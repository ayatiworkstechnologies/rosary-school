from fastapi import (
    APIRouter,
    Depends,
    HTTPException,
    Query,
    status,
)

from sqlalchemy.orm import Session

from app.api.dependencies import (
    get_current_admin,
    get_db,
)

from app.models.admin import Admin

from app.models.gallery import (
    GalleryAlbum,
    GalleryImage,
)

from app.schemas.gallery import (
    GalleryAlbumCreate,
    GalleryAlbumListResponse,
    GalleryAlbumResponse,
    GalleryAlbumUpdate,
    GalleryImageCreate,
    GalleryImageResponse,
    GalleryImageUpdate,
)

from app.services.gallery_service import (
    create_gallery_album,
    create_gallery_image,
    delete_gallery_album,
    delete_gallery_image,
    get_gallery_album_by_id,
    get_gallery_image_by_id,
    list_gallery_albums,
    update_gallery_album,
    update_gallery_image,
)


# =========================================================
# ROUTER
# =========================================================

router = APIRouter(
    prefix="/api/v1/admin/gallery",
    tags=[
        "Admin Gallery"
    ],
)


# =========================================================
# LIST GALLERY ALBUMS
#
# GET
# /api/v1/admin/gallery/albums
#
# Supports:
#
# page
# limit
# year
# category
# is_published
# search
# =========================================================

@router.get(
    "/albums",
    response_model=(
        GalleryAlbumListResponse
    ),
)
def get_gallery_albums(
    page: int = Query(
        default=1,
        ge=1,
    ),

    limit: int = Query(
        default=20,
        ge=1,
        le=100,
    ),

    year: int | None = Query(
        default=None,
        ge=1900,
        le=2100,
    ),

    category: str | None = Query(
        default=None,
    ),

    is_published: bool | None = Query(
        default=None,
    ),

    search: str | None = Query(
        default=None,
    ),

    db: Session = Depends(
        get_db
    ),

    current_admin: Admin = Depends(
        get_current_admin
    ),
):

    # Ensure Admin authentication dependency
    # is explicitly active.

    _ = current_admin


    items, total = (
        list_gallery_albums(
            db,

            page=page,

            limit=limit,

            year=year,

            category=category,

            is_published=(
                is_published
            ),

            search=search,
        )
    )


    return GalleryAlbumListResponse(
        items=items,

        total=total,

        page=page,

        limit=limit,
    )


# =========================================================
# CREATE GALLERY ALBUM
#
# POST
# /api/v1/admin/gallery/albums
# =========================================================

@router.post(
    "/albums",

    response_model=(
        GalleryAlbumResponse
    ),

    status_code=(
        status.HTTP_201_CREATED
    ),
)
def create_album(
    payload: GalleryAlbumCreate,

    db: Session = Depends(
        get_db
    ),

    current_admin: Admin = Depends(
        get_current_admin
    ),
):

    try:

        album = (
            create_gallery_album(
                db,

                payload=payload,

                admin_id=(
                    current_admin.id
                ),
            )
        )


        # Reload with images relationship.
        #
        # A newly-created album normally has
        # images = [].

        loaded_album = (
            get_gallery_album_by_id(
                db,
                album.id,
            )
        )


        return (
            loaded_album
            or album
        )


    except ValueError as error:

        raise HTTPException(
            status_code=(
                status.HTTP_400_BAD_REQUEST
            ),

            detail=str(
                error
            ),
        ) from error


# =========================================================
# GET ONE GALLERY ALBUM
#
# GET
# /api/v1/admin/gallery/albums/{album_id}
# =========================================================

@router.get(
    "/albums/{album_id}",

    response_model=(
        GalleryAlbumResponse
    ),
)
def get_album(
    album_id: int,

    db: Session = Depends(
        get_db
    ),

    current_admin: Admin = Depends(
        get_current_admin
    ),
):

    _ = current_admin


    album = (
        get_gallery_album_by_id(
            db,
            album_id,
        )
    )


    if album is None:

        raise HTTPException(
            status_code=(
                status.HTTP_404_NOT_FOUND
            ),

            detail=(
                "Gallery album not found."
            ),
        )


    return album


# =========================================================
# UPDATE GALLERY ALBUM
#
# PATCH
# /api/v1/admin/gallery/albums/{album_id}
# =========================================================

@router.patch(
    "/albums/{album_id}",

    response_model=(
        GalleryAlbumResponse
    ),
)
def update_album(
    album_id: int,

    payload: GalleryAlbumUpdate,

    db: Session = Depends(
        get_db
    ),

    current_admin: Admin = Depends(
        get_current_admin
    ),
):

    _ = current_admin


    album = (
        get_gallery_album_by_id(
            db,
            album_id,
        )
    )


    if album is None:

        raise HTTPException(
            status_code=(
                status.HTTP_404_NOT_FOUND
            ),

            detail=(
                "Gallery album not found."
            ),
        )


    try:

        return (
            update_gallery_album(
                db,

                album=album,

                payload=payload,
            )
        )


    except ValueError as error:

        raise HTTPException(
            status_code=(
                status.HTTP_400_BAD_REQUEST
            ),

            detail=str(
                error
            ),
        ) from error


# =========================================================
# DELETE GALLERY ALBUM
#
# DELETE
# /api/v1/admin/gallery/albums/{album_id}
#
# This removes:
#
# gallery_albums row
# gallery_images rows
# physical Gallery image files
# =========================================================

@router.delete(
    "/albums/{album_id}",
)
def delete_album(
    album_id: int,

    db: Session = Depends(
        get_db
    ),

    current_admin: Admin = Depends(
        get_current_admin
    ),
):

    _ = current_admin


    album = (
        get_gallery_album_by_id(
            db,
            album_id,
        )
    )


    if album is None:

        raise HTTPException(
            status_code=(
                status.HTTP_404_NOT_FOUND
            ),

            detail=(
                "Gallery album not found."
            ),
        )


    delete_gallery_album(
        db,

        album=album,
    )


    return {
        "message":
            "Gallery album deleted successfully."
    }


# =========================================================
# ADD IMAGE TO ALBUM
#
# POST
# /api/v1/admin/gallery/albums/{album_id}/images
#
# Important:
#
# First upload:
#
# POST
# /api/v1/admin/uploads/gallery-images
#
# Receive:
#
# /uploads/gallery/abc.jpg
#
# Then send that URL here.
# =========================================================

@router.post(
    "/albums/{album_id}/images",

    response_model=(
        GalleryImageResponse
    ),

    status_code=(
        status.HTTP_201_CREATED
    ),
)
def add_image_to_album(
    album_id: int,

    payload: GalleryImageCreate,

    db: Session = Depends(
        get_db
    ),

    current_admin: Admin = Depends(
        get_current_admin
    ),
):

    _ = current_admin


    album = (
        get_gallery_album_by_id(
            db,
            album_id,
        )
    )


    if album is None:

        raise HTTPException(
            status_code=(
                status.HTTP_404_NOT_FOUND
            ),

            detail=(
                "Gallery album not found."
            ),
        )


    try:

        return (
            create_gallery_image(
                db,

                album=album,

                payload=payload,
            )
        )


    except ValueError as error:

        raise HTTPException(
            status_code=(
                status.HTTP_400_BAD_REQUEST
            ),

            detail=str(
                error
            ),
        ) from error


# =========================================================
# GET ONE GALLERY IMAGE
#
# GET
# /api/v1/admin/gallery/images/{image_id}
# =========================================================

@router.get(
    "/images/{image_id}",

    response_model=(
        GalleryImageResponse
    ),
)
def get_image(
    image_id: int,

    db: Session = Depends(
        get_db
    ),

    current_admin: Admin = Depends(
        get_current_admin
    ),
):

    _ = current_admin


    image = (
        get_gallery_image_by_id(
            db,
            image_id,
        )
    )


    if image is None:

        raise HTTPException(
            status_code=(
                status.HTTP_404_NOT_FOUND
            ),

            detail=(
                "Gallery image not found."
            ),
        )


    return image


# =========================================================
# UPDATE GALLERY IMAGE
#
# PATCH
# /api/v1/admin/gallery/images/{image_id}
#
# Can update:
#
# alt_text
# sort_order
# is_homepage
# homepage_order
# =========================================================

@router.patch(
    "/images/{image_id}",

    response_model=(
        GalleryImageResponse
    ),
)
def update_image(
    image_id: int,

    payload: GalleryImageUpdate,

    db: Session = Depends(
        get_db
    ),

    current_admin: Admin = Depends(
        get_current_admin
    ),
):

    _ = current_admin


    image = (
        get_gallery_image_by_id(
            db,
            image_id,
        )
    )


    if image is None:

        raise HTTPException(
            status_code=(
                status.HTTP_404_NOT_FOUND
            ),

            detail=(
                "Gallery image not found."
            ),
        )


    try:

        return (
            update_gallery_image(
                db,

                image=image,

                payload=payload,
            )
        )


    except ValueError as error:

        raise HTTPException(
            status_code=(
                status.HTTP_400_BAD_REQUEST
            ),

            detail=str(
                error
            ),
        ) from error


# =========================================================
# DELETE GALLERY IMAGE
#
# DELETE
# /api/v1/admin/gallery/images/{image_id}
#
# Removes:
#
# DB row
# +
# physical image file
# =========================================================

@router.delete(
    "/images/{image_id}",
)
def delete_image(
    image_id: int,

    db: Session = Depends(
        get_db
    ),

    current_admin: Admin = Depends(
        get_current_admin
    ),
):

    _ = current_admin


    image = (
        get_gallery_image_by_id(
            db,
            image_id,
        )
    )


    if image is None:

        raise HTTPException(
            status_code=(
                status.HTTP_404_NOT_FOUND
            ),

            detail=(
                "Gallery image not found."
            ),
        )


    delete_gallery_image(
        db,

        image=image,
    )


    return {
        "message":
            "Gallery image deleted successfully."
    }