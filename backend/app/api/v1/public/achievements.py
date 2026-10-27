from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

from app.api.dependencies import get_db
from app.models.achievement import AchievementType
from app.schemas.achievement import PublicAchievementListResponse
from app.services.achievement_service import get_public_achievements

router = APIRouter(prefix="/api/v1/achievements", tags=["Public Achievements"])


@router.get("", response_model=PublicAchievementListResponse)
def list_public_achievements(year: int | None = Query(None, ge=1900, le=2100), achievement_type: AchievementType | None = None, db: Session = Depends(get_db)):
    items, total = get_public_achievements(db, year=year, achievement_type=achievement_type)
    return PublicAchievementListResponse(items=items, total=total)
