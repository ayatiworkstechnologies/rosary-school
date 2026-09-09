from pathlib import Path

from sqlalchemy import (
    func,
    or_,
    select,
    update,
)

from sqlalchemy.orm import (
    Session,
    selectinload,
)

from app.models.gallery import (
    GalleryAlbum,
    GalleryImage,
)

from app.schemas.gallery import (
    GalleryAlbumCreate,
    GalleryAlbumUpdate,
    GalleryImageCreate,
    GalleryImageUpdate,
)


# =========================================================
# PATHS
# =========================================================

BACKEND_ROOT = (
    Path(__file__)
    .resolve()
    .parents[2]
)

GALLERY_UPLOAD_DIR = (
    BACKEND_ROOT
    / "uploads"
    / "gallery"
)


# =========================================================
# TEXT CLEANING
# =========================================================

def clean_required_text(
    value: str,
    field_name: str,
) -> str:

    cleaned = value.strip()

    if not cleaned:
        raise ValueError(
            f"{field_name} cannot be empty."
        )

    return cleaned


# =========================================================
# DELETE PHYSICAL GALLERY FILE
#
# Only deletes files from:
#
# backend/uploads/gallery/
#
# It will NOT delete arbitrary server files.
# =========================================================

def delete_gallery_file(
    image_url: str | None,
) -> None:

    if not image_url:
        return

    prefix = "/uploads/gallery/"

    if not image_url.startswith(
        prefix
    ):
        return

    file_name = image_url.removeprefix(
        prefix
    )

    if not file_name:
        return

    gallery_root = (
        GALLERY_UPLOAD_DIR.resolve()
    )

    file_path = (
        GALLERY_UPLOAD_DIR
        / file_name
    ).resolve()

    try:

        file_path.relative_to(
            gallery_root
        )

    except ValueError:

        # Prevent path traversal.
        return

    if (
        file_path.exists()
        and file_path.is_file()
    ):
        try:
            file_path.unlink()
        except OSError:
            # Database deletion should not fail
            # merely because physical file cleanup
            # failed.
            pass


# =========================================================
# CLEAR HOMEPAGE POSITION
#
# Example:
#
# Image A = homepage position 1
#
# Admin assigns Image B to position 1
#
# Image A:
# is_homepage = False
# homepage_order = None
#
# Image B:
# is_homepage = True
# homepage_order = 1
# =========================================================

def clear_homepage_position(
    db: Session,
    *,
    homepage_order: int,
    exclude_image_id: int | None = None,
) -> None:

    filters = [
        GalleryImage.homepage_order
        == homepage_order
    ]

    if exclude_image_id is not None:
        filters.append(
            GalleryImage.id
            != exclude_image_id
        )

    statement = (
        update(GalleryImage)
        .where(*filters)
        .values(
            is_homepage=False,
            homepage_order=None,
        )
    )

    db.execute(statement)

    # Important when homepage_order has
    # a UNIQUE database index.
    db.flush()


# =========================================================
# GET ALBUM BY ID
# =========================================================

def get_gallery_album_by_id(
    db: Session,
    album_id: int,
) -> GalleryAlbum | None:

    statement = (
        select(GalleryAlbum)
        .options(
            selectinload(
                GalleryAlbum.images
            )
        )
        .where(
            GalleryAlbum.id
            == album_id
        )
    )

    return db.scalar(statement)


# =========================================================
# GET IMAGE BY ID
# =========================================================

def get_gallery_image_by_id(
    db: Session,
    image_id: int,
) -> GalleryImage | None:

    statement = (
        select(GalleryImage)
        .where(
            GalleryImage.id
            == image_id
        )
    )

    return db.scalar(statement)


# =========================================================
# CREATE ALBUM
# =========================================================

def create_gallery_album(
    db: Session,
    *,
    payload: GalleryAlbumCreate,
    admin_id: int | None,
) -> GalleryAlbum:

    album = GalleryAlbum(
        title=clean_required_text(
            payload.title,
            "Title",
        ),

        category=clean_required_text(
            payload.category,
            "Category",
        ),

        year=payload.year,

        is_published=
            payload.is_published,

        created_by_id=
            admin_id,
    )

    db.add(album)

    db.commit()

    db.refresh(album)

    return album


# =========================================================
# ADMIN LIST ALBUMS
# =========================================================

def list_gallery_albums(
    db: Session,
    *,
    page: int = 1,
    limit: int = 20,
    year: int | None = None,
    category: str | None = None,
    is_published: bool | None = None,
    search: str | None = None,
) -> tuple[
    list[GalleryAlbum],
    int,
]:

    safe_page = max(
        page,
        1,
    )

    safe_limit = max(
        1,
        min(
            limit,
            100,
        ),
    )

    filters = []

    if year is not None:
        filters.append(
            GalleryAlbum.year
            == year
        )

    if category:
        filters.append(
            GalleryAlbum.category
            == category.strip()
        )

    if is_published is not None:
        filters.append(
            GalleryAlbum.is_published
            .is_(
                is_published
            )
        )

    if search:

        search_value = (
            f"%{search.strip()}%"
        )

        filters.append(
            or_(
                GalleryAlbum.title.ilike(
                    search_value
                ),
                GalleryAlbum.category.ilike(
                    search_value
                ),
            )
        )

    statement = (
        select(GalleryAlbum)
        .options(
            selectinload(
                GalleryAlbum.images
            )
        )
        .where(*filters)
        .order_by(
            GalleryAlbum.year.desc(),
            GalleryAlbum.created_at.desc(),
            GalleryAlbum.id.desc(),
        )
        .offset(
            (
                safe_page - 1
            )
            * safe_limit
        )
        .limit(
            safe_limit
        )
    )

    items = list(
        db.scalars(
            statement
        ).all()
    )

    total_statement = (
        select(
            func.count(
                GalleryAlbum.id
            )
        )
        .where(*filters)
    )

    total = (
        db.scalar(
            total_statement
        )
        or 0
    )

    return (
        items,
        total,
    )


# =========================================================
# UPDATE ALBUM
# =========================================================

def update_gallery_album(
    db: Session,
    *,
    album: GalleryAlbum,
    payload: GalleryAlbumUpdate,
) -> GalleryAlbum:

    data = payload.model_dump(
        exclude_unset=True
    )

    if "title" in data:

        if data["title"] is None:
            raise ValueError(
                "Title cannot be null."
            )

        data["title"] = (
            clean_required_text(
                data["title"],
                "Title",
            )
        )

    if "category" in data:

        if data["category"] is None:
            raise ValueError(
                "Category cannot be null."
            )

        data["category"] = (
            clean_required_text(
                data["category"],
                "Category",
            )
        )

    if (
        "year" in data
        and data["year"] is None
    ):
        raise ValueError(
            "Year cannot be null."
        )

    if (
        "is_published" in data
        and data["is_published"]
        is None
    ):
        raise ValueError(
            "Published status cannot be null."
        )

    for key, value in data.items():
        setattr(
            album,
            key,
            value,
        )

    db.commit()

    db.refresh(album)

    return get_gallery_album_by_id(
        db,
        album.id,
    ) or album


# =========================================================
# DELETE ALBUM
#
# DB:
# gallery_images removed through CASCADE
#
# Files:
# removed after successful database commit
# =========================================================

def delete_gallery_album(
    db: Session,
    *,
    album: GalleryAlbum,
) -> None:

    image_urls = [
        image.image_url
        for image in album.images
    ]

    db.delete(album)

    db.commit()

    for image_url in image_urls:
        delete_gallery_file(
            image_url
        )


# =========================================================
# CREATE GALLERY IMAGE
# =========================================================

def create_gallery_image(
    db: Session,
    *,
    album: GalleryAlbum,
    payload: GalleryImageCreate,
) -> GalleryImage:

    image_url = clean_required_text(
        payload.image_url,
        "Image URL",
    )

    alt_text = clean_required_text(
        payload.alt_text,
        "Alt text",
    )

    # -----------------------------------------------------
    # HOMEPAGE VALIDATION
    # -----------------------------------------------------

    if (
        payload.is_homepage
        and payload.homepage_order
        is None
    ):
        raise ValueError(
            "Homepage position is required "
            "when Show on Homepage is enabled."
        )

    if (
        not payload.is_homepage
        and payload.homepage_order
        is not None
    ):
        raise ValueError(
            "Homepage position can only be "
            "set when Show on Homepage is enabled."
        )

    # -----------------------------------------------------
    # CLEAR OLD IMAGE FROM SAME HOMEPAGE SLOT
    # -----------------------------------------------------

    if (
        payload.is_homepage
        and payload.homepage_order
        is not None
    ):

        clear_homepage_position(
            db,
            homepage_order=
                payload.homepage_order,
        )

    image = GalleryImage(
        album_id=
            album.id,

        image_url=
            image_url,

        alt_text=
            alt_text,

        sort_order=
            payload.sort_order,

        is_homepage=
            payload.is_homepage,

        homepage_order=(
            payload.homepage_order
            if payload.is_homepage
            else None
        ),
    )

    db.add(image)

    db.commit()

    db.refresh(image)

    return image


# =========================================================
# UPDATE GALLERY IMAGE
# =========================================================

def update_gallery_image(
    db: Session,
    *,
    image: GalleryImage,
    payload: GalleryImageUpdate,
) -> GalleryImage:

    data = payload.model_dump(
        exclude_unset=True
    )

    # -----------------------------------------------------
    # ALT TEXT
    # -----------------------------------------------------

    if "alt_text" in data:

        if data["alt_text"] is None:
            raise ValueError(
                "Alt text cannot be null."
            )

        data["alt_text"] = (
            clean_required_text(
                data["alt_text"],
                "Alt text",
            )
        )

    # -----------------------------------------------------
    # SORT ORDER
    # -----------------------------------------------------

    if (
        "sort_order" in data
        and data["sort_order"]
        is None
    ):
        raise ValueError(
            "Sort order cannot be null."
        )

    # -----------------------------------------------------
    # DETERMINE FINAL HOMEPAGE STATE
    # -----------------------------------------------------

    target_is_homepage = (
        data.get(
            "is_homepage",
            image.is_homepage,
        )
    )

    target_homepage_order = (
        data.get(
            "homepage_order",
            image.homepage_order,
        )
    )

    # -----------------------------------------------------
    # IF HOMEPAGE DISABLED
    #
    # Automatically remove the homepage position.
    # -----------------------------------------------------

    if target_is_homepage is False:

        target_homepage_order = None

        data[
            "homepage_order"
        ] = None

        data[
            "is_homepage"
        ] = False

    # -----------------------------------------------------
    # IF HOMEPAGE ENABLED
    #
    # Position 1–6 is mandatory.
    # -----------------------------------------------------

    if target_is_homepage is True:

        if target_homepage_order is None:

            raise ValueError(
                "Homepage position is required "
                "when Show on Homepage is enabled."
            )

        clear_homepage_position(
            db,
            homepage_order=
                target_homepage_order,
            exclude_image_id=
                image.id,
        )

        data[
            "is_homepage"
        ] = True

        data[
            "homepage_order"
        ] = (
            target_homepage_order
        )

    # -----------------------------------------------------
    # APPLY UPDATE
    # -----------------------------------------------------

    for key, value in data.items():

        setattr(
            image,
            key,
            value,
        )

    db.commit()

    db.refresh(image)

    return image


# =========================================================
# DELETE GALLERY IMAGE
# =========================================================

def delete_gallery_image(
    db: Session,
    *,
    image: GalleryImage,
) -> None:

    image_url = image.image_url

    db.delete(image)

    db.commit()

    delete_gallery_file(
        image_url
    )


# =========================================================
# PUBLIC GALLERY ALBUMS
#
# Used by:
#
# /gallery
#
# Only published albums are returned.
# =========================================================

def get_public_gallery_albums(
    db: Session,
    *,
    year: int | None = None,
) -> tuple[
    list[GalleryAlbum],
    int,
]:

    # -----------------------------------------------------
    # PUBLIC VISIBILITY RULES
    #
    # 1. Album must be Published
    # 2. Album must contain at least one image
    #
    # Your frontend GalleryCard accesses album.images,
    # so empty published albums should not be returned.
    # -----------------------------------------------------

    filters = [
        GalleryAlbum.is_published
        .is_(True),

        GalleryAlbum.images.any(),
    ]

    if year is not None:

        filters.append(
            GalleryAlbum.year
            == year
        )

    statement = (
        select(GalleryAlbum)
        .options(
            selectinload(
                GalleryAlbum.images
            )
        )
        .where(*filters)
        .order_by(
            GalleryAlbum.year.desc(),
            GalleryAlbum.created_at.desc(),
            GalleryAlbum.id.desc(),
        )
    )

    items = list(
        db.scalars(
            statement
        ).all()
    )

    total_statement = (
        select(
            func.count(
                GalleryAlbum.id
            )
        )
        .where(*filters)
    )

    total = (
        db.scalar(
            total_statement
        )
        or 0
    )

    return (
        items,
        total,
    )


# =========================================================
# PUBLIC HOMEPAGE GALLERY
#
# Used by:
#
# Homepage -> Life at Rosary
#
# Important:
#
# 1. Image must be selected for homepage
# 2. Homepage position must exist
# 3. Parent Album must be Published
# 4. Ordered exactly 1 -> 6
# =========================================================

def get_public_homepage_gallery(
    db: Session,
) -> list[GalleryImage]:

    statement = (
        select(GalleryImage)
        .join(
            GalleryAlbum,
            GalleryImage.album_id
            == GalleryAlbum.id,
        )
        .where(
            GalleryImage.is_homepage
            .is_(True),

            GalleryImage.homepage_order
            .is_not(None),

            GalleryAlbum.is_published
            .is_(True),
        )
        .order_by(
            GalleryImage.homepage_order
            .asc()
        )
        .limit(6)
    )

    return list(
        db.scalars(
            statement
        ).all()
    )