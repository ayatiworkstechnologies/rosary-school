from datetime import date, datetime

from pydantic import BaseModel, ConfigDict, Field, model_validator

from app.models.achievement import AchievementType, VideoSource


class AchievementImagePayload(BaseModel):
    image_url: str = Field(min_length=1, max_length=500)
    alt_text: str = Field(min_length=1, max_length=255)
    display_order: int = Field(default=1, ge=1)


class AchievementImageResponse(AchievementImagePayload):
    id: int
    achievement_id: int
    created_at: datetime
    updated_at: datetime
    model_config = ConfigDict(from_attributes=True)


class AchievementBase(BaseModel):
    achievement_type: AchievementType
    title: str = Field(min_length=2, max_length=255)
    category: str = Field(min_length=2, max_length=120)
    achievement_date: date
    year: int = Field(ge=1900, le=2100)
    is_active: bool = True
    display_order: int = Field(default=1, ge=1)
    poster_image_url: str | None = Field(default=None, max_length=500)
    video_source: VideoSource | None = None
    youtube_url: str | None = Field(default=None, max_length=500)
    video_url: str | None = Field(default=None, max_length=500)

    @model_validator(mode="after")
    def validate_video_fields(self):
        if self.achievement_type == AchievementType.PHOTO:
            if any((self.poster_image_url, self.video_source, self.youtube_url, self.video_url)):
                raise ValueError("Photo achievements cannot include video fields.")
        elif self.video_source == VideoSource.YOUTUBE:
            if not self.poster_image_url or not self.youtube_url or self.video_url:
                raise ValueError("YouTube achievements require a poster image and only a YouTube URL.")
        elif self.video_source == VideoSource.UPLOADED:
            if not self.poster_image_url or not self.video_url or self.youtube_url:
                raise ValueError("Uploaded video achievements require a poster image and only an uploaded video URL.")
        else:
            raise ValueError("Video achievements require a video source.")
        return self


class AchievementCreate(AchievementBase):
    images: list[AchievementImagePayload] = Field(default_factory=list)

    @model_validator(mode="after")
    def validate_photo_images(self):
        if self.achievement_type == AchievementType.PHOTO and not self.images:
            raise ValueError("Photo achievements require at least one image.")
        if self.achievement_type == AchievementType.VIDEO and self.images:
            raise ValueError("Video achievements cannot include gallery images.")
        return self


class AchievementUpdate(AchievementCreate):
    pass


class AchievementResponse(AchievementBase):
    id: int
    created_by_id: int | None
    created_at: datetime
    updated_at: datetime
    images: list[AchievementImageResponse] = Field(default_factory=list)
    model_config = ConfigDict(from_attributes=True)


class AchievementListResponse(BaseModel):
    items: list[AchievementResponse]
    total: int
    page: int
    limit: int


class PublicAchievementResponse(BaseModel):
    id: int
    achievement_type: AchievementType
    title: str
    category: str
    achievement_date: date
    year: int
    display_order: int
    poster_image_url: str | None
    video_source: VideoSource | None
    youtube_url: str | None
    video_url: str | None
    images: list[AchievementImageResponse] = Field(default_factory=list)
    model_config = ConfigDict(from_attributes=True)


class PublicAchievementListResponse(BaseModel):
    items: list[PublicAchievementResponse]
    total: int
