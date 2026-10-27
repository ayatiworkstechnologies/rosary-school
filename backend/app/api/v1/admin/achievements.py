from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session

from app.api.dependencies import get_current_admin, get_db
from app.models.achievement import AchievementType
from app.models.admin import Admin
from app.schemas.achievement import AchievementCreate, AchievementListResponse, AchievementResponse
from app.services.achievement_service import create_achievement, delete_achievement, get_achievement, list_achievements, update_achievement

router = APIRouter(prefix="/api/v1/admin/achievements", tags=["Admin Achievements"])


@router.get("", response_model=AchievementListResponse)
def get_achievements(page: int = Query(1, ge=1), limit: int = Query(20, ge=1, le=100), year: int | None = Query(None, ge=1900, le=2100), achievement_type: AchievementType | None = None, is_active: bool | None = None, search: str | None = None, db: Session = Depends(get_db), current_admin: Admin = Depends(get_current_admin)):
    _ = current_admin
    items, total = list_achievements(db, page=page, limit=limit, year=year, achievement_type=achievement_type, is_active=is_active, search=search)
    return AchievementListResponse(items=items, total=total, page=page, limit=limit)


@router.post("", response_model=AchievementResponse, status_code=status.HTTP_201_CREATED)
def create(payload: AchievementCreate, db: Session = Depends(get_db), current_admin: Admin = Depends(get_current_admin)):
    try:
        return create_achievement(db, payload=payload, admin_id=current_admin.id)
    except ValueError as error:
        raise HTTPException(status_code=400, detail=str(error)) from error


@router.get("/{achievement_id}", response_model=AchievementResponse)
def get_one(achievement_id: int, db: Session = Depends(get_db), current_admin: Admin = Depends(get_current_admin)):
    _ = current_admin
    achievement = get_achievement(db, achievement_id)
    if not achievement:
        raise HTTPException(status_code=404, detail="Achievement not found.")
    return achievement


@router.put("/{achievement_id}", response_model=AchievementResponse)
def update(achievement_id: int, payload: AchievementCreate, db: Session = Depends(get_db), current_admin: Admin = Depends(get_current_admin)):
    _ = current_admin
    achievement = get_achievement(db, achievement_id)
    if not achievement:
        raise HTTPException(status_code=404, detail="Achievement not found.")
    try:
        return update_achievement(db, achievement=achievement, payload=payload)
    except ValueError as error:
        raise HTTPException(status_code=400, detail=str(error)) from error


@router.delete("/{achievement_id}")
def delete(achievement_id: int, db: Session = Depends(get_db), current_admin: Admin = Depends(get_current_admin)):
    _ = current_admin
    achievement = get_achievement(db, achievement_id)
    if not achievement:
        raise HTTPException(status_code=404, detail="Achievement not found.")
    delete_achievement(db, achievement=achievement)
    return {"message": "Achievement deleted successfully."}
