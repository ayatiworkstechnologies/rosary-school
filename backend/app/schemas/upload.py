from pydantic import BaseModel


class ImageUploadResponse(BaseModel):
    message: str
    image_url: str
    filename: str