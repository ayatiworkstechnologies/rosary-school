from pathlib import Path

from sqlalchemy import func, or_, select
from sqlalchemy.orm import Session, selectinload

from app.models.achievement import Achievement, AchievementType
from app.schemas.achievement import AchievementCreate

BACKEND_ROOT = Path(__file__).resolve().parents[2]
ACHIEVEMENT_UPLOAD_ROOT = BACKEND_ROOT / "uploads" / "achievements"


def _clean(value: str, field: str) -> str:
    value = value.strip()
    if not value:
        raise ValueError(f"{field} cannot be empty.")
    return value


def _delete_upload(url: str | None) -> None:
    if not url or not url.startswith("/uploads/achievements/"):
        return
    target = (BACKEND_ROOT / url.lstrip("/")).resolve()
    root = ACHIEVEMENT_UPLOAD_ROOT.resolve()
    if root in target.parents and target.is_file():
        try:
            target.unlink()
        except OSError:
            pass


def _load(db: Session, achievement_id: int) -> Achievement | None:
    return db.scalar(select(Achievement).options(selectinload(Achievement.images)).where(Achievement.id == achievement_id))


def _apply(achievement: Achievement, payload: AchievementCreate) -> None:
    data = payload.model_dump(exclude={"images"})
    data["title"] = _clean(data["title"], "Title")
    data["category"] = _clean(data["category"], "Category")
    for key, value in data.items():
        setattr(achievement, key, value)
    achievement.images.clear()
    if payload.achievement_type == AchievementType.PHOTO:
        from app.models.achievement import AchievementImage
        achievement.images.extend(AchievementImage(image_url=_clean(image.image_url, "Image URL"), alt_text=_clean(image.alt_text, "Alt text"), display_order=image.display_order) for image in payload.images)


def create_achievement(db: Session, *, payload: AchievementCreate, admin_id: int) -> Achievement:
    achievement = Achievement(created_by_id=admin_id)
    _apply(achievement, payload)
    db.add(achievement)
    db.commit()
    return _load(db, achievement.id) or achievement


def update_achievement(db: Session, *, achievement: Achievement, payload: AchievementCreate) -> Achievement:
    old_urls = [image.image_url for image in achievement.images]
    old_urls.extend([achievement.poster_image_url, achievement.video_url])
    _apply(achievement, payload)
    db.commit()
    keep_urls = {image.image_url for image in achievement.images} | {achievement.poster_image_url, achievement.video_url}
    for url in old_urls:
        if url not in keep_urls:
            _delete_upload(url)
    return _load(db, achievement.id) or achievement


def delete_achievement(db: Session, *, achievement: Achievement) -> None:
    urls = [image.image_url for image in achievement.images]
    urls.extend([achievement.poster_image_url, achievement.video_url])
    db.delete(achievement)
    db.commit()
    for url in urls:
        _delete_upload(url)


def list_achievements(db: Session, *, page: int = 1, limit: int = 20, year: int | None = None, achievement_type: AchievementType | None = None, is_active: bool | None = None, search: str | None = None) -> tuple[list[Achievement], int]:
    filters = []
    if year is not None: filters.append(Achievement.year == year)
    if achievement_type is not None: filters.append(Achievement.achievement_type == achievement_type)
    if is_active is not None: filters.append(Achievement.is_active.is_(is_active))
    if search:
        token = f"%{search.strip()}%"
        filters.append(or_(Achievement.title.ilike(token), Achievement.category.ilike(token)))
    statement = select(Achievement).options(selectinload(Achievement.images)).where(*filters).order_by(Achievement.display_order.asc(), Achievement.achievement_date.desc(), Achievement.id.desc())
    items = list(db.scalars(statement.offset((max(page, 1) - 1) * min(max(limit, 1), 100)).limit(min(max(limit, 1), 100))).all())
    total = db.scalar(select(func.count(Achievement.id)).where(*filters)) or 0
    return items, total


def get_public_achievements(db: Session, *, year: int | None = None, achievement_type: AchievementType | None = None) -> tuple[list[Achievement], int]:
    return list_achievements(db, page=1, limit=100, year=year, achievement_type=achievement_type, is_active=True)


def get_achievement(db: Session, achievement_id: int) -> Achievement | None:
    return _load(db, achievement_id)
