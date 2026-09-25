from pathlib import Path

from sqlalchemy import (
    func,
    or_,
    select,
)

from sqlalchemy.orm import Session

from app.models.download import Download

from app.schemas.download import (
    DownloadCreate,
    DownloadUpdate,
)


# =========================================================
# PATHS
# =========================================================

BACKEND_ROOT = (
    Path(__file__)
    .resolve()
    .parents[2]
)


DOWNLOAD_UPLOAD_DIR = (
    BACKEND_ROOT
    / "uploads"
    / "downloads"
)


DOWNLOAD_FILES_DIR = (
    DOWNLOAD_UPLOAD_DIR
    / "files"
)


DOWNLOAD_ICONS_DIR = (
    DOWNLOAD_UPLOAD_DIR
    / "icons"
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


def clean_optional_text(
    value: str | None,
) -> str | None:

    if value is None:
        return None

    cleaned = value.strip()

    return cleaned or None


# =========================================================
# DELETE UPLOADED FILE
#
# Security:
#
# Only files inside:
#
# backend/uploads/downloads/files/
# backend/uploads/downloads/icons/
#
# can be deleted.
# =========================================================

def delete_download_uploaded_file(
    file_url: str | None,
) -> None:

    if not file_url:
        return

    file_root: Path | None = None
    relative_name: str | None = None


    # -----------------------------------------------------
    # PDF
    # -----------------------------------------------------

    file_prefix = (
        "/uploads/downloads/files/"
    )

    if file_url.startswith(
        file_prefix
    ):

        file_root = (
            DOWNLOAD_FILES_DIR
        )

        relative_name = (
            file_url.removeprefix(
                file_prefix
            )
        )


    # -----------------------------------------------------
    # ICON
    # -----------------------------------------------------

    icon_prefix = (
        "/uploads/downloads/icons/"
    )

    if file_url.startswith(
        icon_prefix
    ):

        file_root = (
            DOWNLOAD_ICONS_DIR
        )

        relative_name = (
            file_url.removeprefix(
                icon_prefix
            )
        )


    # -----------------------------------------------------
    # INVALID / EXTERNAL URL
    # -----------------------------------------------------

    if (
        file_root is None
        or not relative_name
    ):
        return


    root = file_root.resolve()

    file_path = (
        file_root
        / relative_name
    ).resolve()


    # -----------------------------------------------------
    # PREVENT PATH TRAVERSAL
    # -----------------------------------------------------

    try:

        file_path.relative_to(
            root
        )

    except ValueError:

        return


    # -----------------------------------------------------
    # DELETE
    # -----------------------------------------------------

    if (
        file_path.exists()
        and file_path.is_file()
    ):

        try:

            file_path.unlink()

        except OSError:

            # DB operation should not fail
            # only because physical cleanup
            # failed.
            pass


# =========================================================
# GET DOWNLOAD BY ID
# =========================================================

def get_download_by_id(
    db: Session,
    download_id: int,
) -> Download | None:

    statement = (
        select(Download)
        .where(
            Download.id
            == download_id
        )
    )

    return db.scalar(
        statement
    )


# =========================================================
# CREATE DOWNLOAD
# =========================================================

def create_download(
    db: Session,
    *,
    payload: DownloadCreate,
    admin_id: int | None,
) -> Download:

    title = clean_required_text(
        payload.title,
        "Title",
    )

    description = (
        clean_required_text(
            payload.description,
            "Description",
        )
    )

    file_url = clean_required_text(
        payload.file_url,
        "File URL",
    )


    icon_type = (
        payload.icon_type
    )

    icon_key = (
        clean_optional_text(
            payload.icon_key
        )
    )

    icon_url = (
        clean_optional_text(
            payload.icon_url
        )
    )


    # -----------------------------------------------------
    # LUCIDE ICON
    # -----------------------------------------------------

    if icon_type == "lucide":

        if not icon_key:

            raise ValueError(
                "Lucide icon key is required."
            )

        icon_url = None


    # -----------------------------------------------------
    # CUSTOM IMAGE ICON
    # -----------------------------------------------------

    elif icon_type == "image":

        if not icon_url:

            raise ValueError(
                "Uploaded icon URL is required."
            )

        icon_key = None


    else:

        raise ValueError(
            "Invalid icon type."
        )


    download = Download(

        title=title,

        description=description,

        icon_type=icon_type,

        icon_key=icon_key,

        icon_url=icon_url,

        file_url=file_url,

        original_file_name=(
            clean_optional_text(
                payload.original_file_name
            )
        ),

        file_size_bytes=(
            payload.file_size_bytes
        ),

        display_order=(
            payload.display_order
        ),

        is_active=(
            payload.is_active
        ),

        created_by_id=(
            admin_id
        ),
    )


    db.add(
        download
    )

    db.commit()

    db.refresh(
        download
    )

    return download


# =========================================================
# ADMIN LIST DOWNLOADS
# =========================================================

def list_admin_downloads(
    db: Session,
    *,
    page: int = 1,
    limit: int = 20,
    search: str | None = None,
    icon_type: str | None = None,
    is_active: bool | None = None,
) -> tuple[
    list[Download],
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


    # -----------------------------------------------------
    # SEARCH
    # -----------------------------------------------------

    if search:

        search_value = (
            f"%{search.strip()}%"
        )

        filters.append(
            or_(

                Download.title.ilike(
                    search_value
                ),

                Download.description.ilike(
                    search_value
                ),

                Download.original_file_name.ilike(
                    search_value
                ),
            )
        )


    # -----------------------------------------------------
    # ICON TYPE
    # -----------------------------------------------------

    if icon_type:

        filters.append(
            Download.icon_type
            == icon_type.strip()
        )


    # -----------------------------------------------------
    # STATUS
    # -----------------------------------------------------

    if is_active is not None:

        filters.append(
            Download.is_active.is_(
                is_active
            )
        )


    # -----------------------------------------------------
    # LIST
    # -----------------------------------------------------

    statement = (
        select(Download)
        .where(
            *filters
        )
        .order_by(

            Download.display_order.asc(),

            Download.created_at.desc(),

            Download.id.desc(),
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


    # -----------------------------------------------------
    # TOTAL
    # -----------------------------------------------------

    total_statement = (
        select(
            func.count(
                Download.id
            )
        )
        .where(
            *filters
        )
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
# UPDATE DOWNLOAD
# =========================================================

def update_download(
    db: Session,
    *,
    download: Download,
    payload: DownloadUpdate,
) -> Download:

    data = payload.model_dump(
        exclude_unset=True
    )


    # =====================================================
    # REQUIRED FIELDS
    # =====================================================

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


    if "description" in data:

        if data["description"] is None:

            raise ValueError(
                "Description cannot be null."
            )

        data["description"] = (
            clean_required_text(
                data["description"],
                "Description",
            )
        )


    if "file_url" in data:

        if data["file_url"] is None:

            raise ValueError(
                "File URL cannot be null."
            )

        data["file_url"] = (
            clean_required_text(
                data["file_url"],
                "File URL",
            )
        )


    if (
        "display_order" in data
        and data["display_order"]
        is None
    ):

        raise ValueError(
            "Display order cannot be null."
        )


    if (
        "is_active" in data
        and data["is_active"]
        is None
    ):

        raise ValueError(
            "Active status cannot be null."
        )


    if (
        "icon_type" in data
        and data["icon_type"]
        is None
    ):

        raise ValueError(
            "Icon type cannot be null."
        )


    # =====================================================
    # CLEAN OPTIONAL VALUES
    # =====================================================

    if "icon_key" in data:

        data["icon_key"] = (
            clean_optional_text(
                data["icon_key"]
            )
        )


    if "icon_url" in data:

        data["icon_url"] = (
            clean_optional_text(
                data["icon_url"]
            )
        )


    if (
        "original_file_name"
        in data
    ):

        data[
            "original_file_name"
        ] = (
            clean_optional_text(
                data[
                    "original_file_name"
                ]
            )
        )


    # =====================================================
    # DETERMINE FINAL ICON STATE
    # =====================================================

    target_icon_type = (
        data.get(
            "icon_type",
            download.icon_type,
        )
    )


    target_icon_key = (
        data.get(
            "icon_key",
            download.icon_key,
        )
    )


    target_icon_url = (
        data.get(
            "icon_url",
            download.icon_url,
        )
    )


    # -----------------------------------------------------
    # LUCIDE
    # -----------------------------------------------------

    if target_icon_type == "lucide":

        target_icon_key = (
            clean_optional_text(
                target_icon_key
            )
        )

        if not target_icon_key:

            raise ValueError(
                "Lucide icon key is required."
            )

        data["icon_type"] = (
            "lucide"
        )

        data["icon_key"] = (
            target_icon_key
        )

        data["icon_url"] = (
            None
        )


    # -----------------------------------------------------
    # IMAGE
    # -----------------------------------------------------

    elif target_icon_type == "image":

        target_icon_url = (
            clean_optional_text(
                target_icon_url
            )
        )

        if not target_icon_url:

            raise ValueError(
                "Uploaded icon URL is required."
            )

        data["icon_type"] = (
            "image"
        )

        data["icon_key"] = (
            None
        )

        data["icon_url"] = (
            target_icon_url
        )


    else:

        raise ValueError(
            "Invalid icon type."
        )


    # =====================================================
    # SAVE OLD FILES
    #
    # We delete them only AFTER DB commit succeeds.
    # =====================================================

    old_file_url = (
        download.file_url
    )

    old_icon_url = (
        download.icon_url
    )


    # =====================================================
    # APPLY UPDATE
    # =====================================================

    for key, value in data.items():

        setattr(
            download,
            key,
            value,
        )


    db.commit()

    db.refresh(
        download
    )


    # =====================================================
    # DELETE REPLACED PDF
    # =====================================================

    if (
        old_file_url
        and old_file_url
        != download.file_url
    ):

        delete_download_uploaded_file(
            old_file_url
        )


    # =====================================================
    # DELETE REPLACED / REMOVED ICON
    # =====================================================

    if (
        old_icon_url
        and old_icon_url
        != download.icon_url
    ):

        delete_download_uploaded_file(
            old_icon_url
        )


    return download


# =========================================================
# ACTIVE / INACTIVE
# =========================================================

def update_download_status(
    db: Session,
    *,
    download: Download,
    is_active: bool,
) -> Download:

    download.is_active = (
        is_active
    )

    db.commit()

    db.refresh(
        download
    )

    return download


# =========================================================
# UPDATE DISPLAY ORDER
# =========================================================

def update_download_order(
    db: Session,
    *,
    download: Download,
    display_order: int,
) -> Download:

    if display_order < 1:

        raise ValueError(
            "Display order must be at least 1."
        )

    download.display_order = (
        display_order
    )

    db.commit()

    db.refresh(
        download
    )

    return download


# =========================================================
# DELETE DOWNLOAD
#
# Database first.
#
# Physical files deleted only after DB commit succeeds.
# =========================================================

def delete_download(
    db: Session,
    *,
    download: Download,
) -> None:

    file_url = (
        download.file_url
    )

    icon_url = (
        download.icon_url
    )


    db.delete(
        download
    )

    db.commit()


    # -----------------------------------------------------
    # DELETE PDF
    # -----------------------------------------------------

    delete_download_uploaded_file(
        file_url
    )


    # -----------------------------------------------------
    # DELETE CUSTOM ICON
    # -----------------------------------------------------

    delete_download_uploaded_file(
        icon_url
    )


# =========================================================
# PUBLIC DOWNLOADS
#
# Only active records.
#
# Ordered exactly using Admin display_order.
# =========================================================

def list_public_downloads(
    db: Session,
) -> tuple[
    list[Download],
    int,
]:

    filters = [
        Download.is_active.is_(
            True
        )
    ]


    statement = (
        select(Download)
        .where(
            *filters
        )
        .order_by(

            Download.display_order.asc(),

            Download.id.asc(),
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
                Download.id
            )
        )
        .where(
            *filters
        )
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