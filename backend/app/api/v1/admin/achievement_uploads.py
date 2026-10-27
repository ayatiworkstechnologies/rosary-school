from io import BytesIO
from pathlib import Path
from typing import Annotated, Literal
from uuid import uuid4

from fastapi import APIRouter, Depends, File, HTTPException, UploadFile, status
from PIL import Image
from pydantic import BaseModel

from app.api.dependencies import get_current_admin
from app.models.admin import Admin

router = APIRouter(prefix="/api/v1/admin/uploads/achievements", tags=["Admin Achievement Uploads"])
BACKEND_ROOT = Path(__file__).resolve().parents[4]
ROOT = BACKEND_ROOT / "uploads" / "achievements"
IMAGE_TYPES = {"image/jpeg": ".jpg", "image/png": ".png", "image/webp": ".webp"}
VIDEO_TYPES = {"video/mp4": ".mp4", "video/webm": ".webm", "video/quicktime": ".mov"}


class AchievementUploadResponse(BaseModel):
    url: str
    file_name: str
    original_name: str
    size: int


async def _upload(file: UploadFile, folder: Literal["photos", "posters", "videos"], allowed: dict[str, str], max_bytes: int, validate_image: bool = False) -> AchievementUploadResponse:
    if not file.filename or file.content_type not in allowed:
        raise HTTPException(status_code=400, detail="Unsupported upload file type.")
    content = await file.read(max_bytes + 1)
    if not content:
        raise HTTPException(status_code=400, detail="Uploaded file is empty.")
    if len(content) > max_bytes:
        raise HTTPException(status_code=status.HTTP_413_CONTENT_TOO_LARGE, detail="Uploaded file exceeds the size limit.")
    extension = allowed[file.content_type]
    if validate_image:
        try:
            with Image.open(BytesIO(content)) as image:
                image.verify()
        except Exception as error:
            raise HTTPException(status_code=400, detail="Uploaded file is not a valid image.") from error
    directory = ROOT / folder
    directory.mkdir(parents=True, exist_ok=True)
    name = f"{uuid4().hex}{extension}"
    try:
        (directory / name).write_bytes(content)
    except OSError as error:
        raise HTTPException(status_code=500, detail="Unable to save uploaded file.") from error
    return AchievementUploadResponse(url=f"/uploads/achievements/{folder}/{name}", file_name=name, original_name=file.filename, size=len(content))


@router.post("/photos", response_model=AchievementUploadResponse, status_code=status.HTTP_201_CREATED)
async def upload_photo(file: Annotated[UploadFile, File()], current_admin: Admin = Depends(get_current_admin)):
    _ = current_admin
    try:
        return await _upload(file, "photos", IMAGE_TYPES, 5 * 1024 * 1024, True)
    finally:
        await file.close()


@router.post("/posters", response_model=AchievementUploadResponse, status_code=status.HTTP_201_CREATED)
async def upload_poster(file: Annotated[UploadFile, File()], current_admin: Admin = Depends(get_current_admin)):
    _ = current_admin
    try:
        return await _upload(file, "posters", IMAGE_TYPES, 5 * 1024 * 1024, True)
    finally:
        await file.close()


@router.post("/videos", response_model=AchievementUploadResponse, status_code=status.HTTP_201_CREATED)
async def upload_video(file: Annotated[UploadFile, File()], current_admin: Admin = Depends(get_current_admin)):
    _ = current_admin
    try:
        return await _upload(file, "videos", VIDEO_TYPES, 100 * 1024 * 1024)
    finally:
        await file.close()
