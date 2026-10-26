# Rosary School Website

Full-stack school website and administration dashboard built with Next.js and FastAPI.

## Stack

- Frontend: Next.js 16.3, React 19, TypeScript, Tailwind CSS 4
- Backend: FastAPI, SQLAlchemy, Alembic
- Database: MySQL
- Authentication: JWT stored in an HTTP-only cookie

## Requirements

- Node.js 20.9 or newer
- npm
- Python 3.11 or newer (recommended)
- MySQL 8 or a compatible MySQL server

## Quick start: frontend only

The frontend is configured to use the deployed backend by default.

```powershell
npm ci
npm run dev
```

Open <http://localhost:3000>.

## Run the complete project locally

### 1. Create the MySQL database

Create an empty database and a database user with permission to access it. For example, name the database `rosary_school`.

### 2. Configure the backend

Create `backend/.env` with your local values:

```dotenv
APP_NAME=Rosary School API
APP_ENV=development
FRONTEND_URL=http://localhost:3000

DB_HOST=127.0.0.1
DB_PORT=3306
DB_NAME=rosary_school
DB_USER=rosary_user
DB_PASSWORD=replace_with_your_database_password

JWT_SECRET_KEY=replace_with_a_long_random_secret
JWT_ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=60
COOKIE_SECURE=false
```

Generate a suitable JWT secret with Python:

```powershell
python -c "import secrets; print(secrets.token_urlsafe(48))"
```

Do not commit `.env` files. They are intentionally ignored by Git.

### 3. Install and start the backend

Run these commands from the repository root:

```powershell
cd backend
python -m venv .venv
.\.venv\Scripts\Activate.ps1
python -m pip install -r requirements.txt
python -m alembic upgrade head
python -m uvicorn app.main:app --reload --host 127.0.0.1 --port 8010
```

The backend is then available at:

- API: <http://127.0.0.1:8010>
- Health check: <http://127.0.0.1:8010/health>
- Swagger UI: <http://127.0.0.1:8010/docs>

Keep this terminal running.

### 4. Point the frontend to the local backend

Create `.env.local` in the repository root:

```dotenv
ROSARY_BACKEND_URL=http://127.0.0.1:8010

# Used only by the legacy Ayatiworks routes and newsletter integration.
AYATIWORKS_API_KEY=replace_with_your_api_key
```

`ROSARY_BACKEND_URL` controls the Next.js rewrites for `/backend/*` and `/uploads/*`. Keeping browser requests on these same-origin paths allows the admin authentication cookie to work normally.

`AYATIWORKS_API_KEY` is used only by the retained legacy Ayatiworks route handlers and newsletter integration. Contact and admission forms now submit to FastAPI and MySQL. Obtain this key from the project administrator only if the legacy routes or newsletter are required.

### 5. Start the frontend

Open a second terminal at the repository root:

```powershell
npm ci
npm run dev
```

Open <http://localhost:3000>. The admin login is at <http://localhost:3000/admin/login>.

Restart the Next.js development server after changing `.env.local` or `next.config.ts`.

## Create an administrator

With the backend virtual environment active and the working directory set to `backend`:

```powershell
python -m scripts.create_admin
```

To change an existing administrator's password:

```powershell
python -m scripts.change_admin_password
```

## Available commands

Run frontend commands from the repository root:

| Command | Purpose |
| --- | --- |
| `npm run dev` | Start the development server at port 3000 |
| `npm run build` | Create an optimized production build |
| `npm run start` | Serve an existing production build |
| `npm run lint` | Run ESLint |

Production-style local run:

```powershell
npm run build
npm run start
```

Run backend commands from `backend` with its virtual environment active:

| Command | Purpose |
| --- | --- |
| `python -m uvicorn app.main:app --reload` | Start the development API |
| `python -m alembic upgrade head` | Apply all database migrations |
| `python -m alembic current` | Show the current migration |

## Environment variables

### Frontend (`.env.local` in the repository root)

| Variable | Required | Description |
| --- | --- | --- |
| `ROSARY_BACKEND_URL` | No | Backend used by Next.js rewrites; defaults to the deployed API |
| `NEXT_PUBLIC_API_URL` | No | Direct browser API base URL; normally leave unset and use `/backend` |
| `AYATIWORKS_API_KEY` | For legacy integrations | Server-side key for retained Ayatiworks routes and newsletter submissions |

### Backend (`backend/.env`)

| Variable | Required | Description |
| --- | --- | --- |
| `DB_HOST` | Yes | MySQL hostname |
| `DB_PORT` | No | MySQL port; defaults to `3306` |
| `DB_NAME` | Yes | Database name |
| `DB_USER` | Yes | Database user |
| `DB_PASSWORD` | No | Database password |
| `JWT_SECRET_KEY` | Yes | Secret used to sign authentication tokens |
| `FRONTEND_URL` | No | Allowed frontend CORS origin; defaults to `http://localhost:3000` |
| `COOKIE_SECURE` | No | Use `true` when serving production over HTTPS |

Email notifications also use these backend variables:

| Variable | Description |
| --- | --- |
| `SMTP_HOST` / `SMTP_PORT` | SMTP server and port |
| `SMTP_USERNAME` / `SMTP_PASSWORD` | SMTP login credentials |
| `SMTP_FROM_EMAIL` / `SMTP_FROM_NAME` | Sender shown on school notifications |
| `SMTP_USE_TLS` | Enable STARTTLS, normally `true` on port 587 |
| `CONTACT_MAIL_TO`, `CONTACT_MAIL_CC`, `CONTACT_MAIL_BCC` | Contact-form recipients; multiple addresses are comma-separated |
| `ADMISSION_MAIL_TO`, `ADMISSION_MAIL_CC`, `ADMISSION_MAIL_BCC` | Admission-form recipients; multiple addresses are comma-separated |
| `CONTACT_REPLY_TO` / `ADMISSION_REPLY_TO` | School address used when a visitor or parent replies to their confirmation |
| `CONTACT_ACKNOWLEDGEMENT_ENABLED` | Send the visitor confirmation and enquiry reference email; defaults to `true` |
| `ADMISSION_ACKNOWLEDGEMENT_ENABLED` | Send the parent confirmation and registration email; defaults to `true` |

For contact enquiries, the school receives a notification through the configured To/CC/BCC list and the visitor receives a separate thank-you email containing an `ENQ-000001`-style reference number. Admission applications use the same two-email flow: the school receives the full application and the parent receives confirmation with the generated registration number and key pupil details. The submitted address is Reply-To on the school notification, while the school mailbox is Reply-To on the acknowledgement. Submissions are saved even if SMTP is unavailable; administrators can inspect the failure and retry delivery from the admin page.

## Contact and admission administration

Website submissions are stored in MySQL and available to authenticated administrators:

- Contact enquiries: <http://localhost:3000/admin/contact-enquiries>
- Admission applications: <http://localhost:3000/admin/admissions>
- Newsletter subscribers: <http://localhost:3000/admin/newsletter>
- Mail routing settings: <http://localhost:3000/admin/settings>

The Settings page manages To, CC, BCC, Reply-To and acknowledgement switches. Saved admin values override the corresponding `.env` routing defaults. SMTP host, username and password remain server-only environment settings.

Newsletter signups are stored in MySQL, send a subscriber confirmation in the background, and can be activated, deactivated or deleted from the admin page.

Branded HTML templates for school notifications are stored in `backend/app/templates/` for contact enquiries, admission applications and newsletter subscriptions. `BACKEND_PUBLIC_URL` must be the publicly reachable backend origin in production so admission photographs can render inside emails.

After pulling a version containing new migrations, apply them from `backend`:

```powershell
python -m alembic upgrade head
```

## Project structure

```text
app/          Next.js routes, including the public site and admin dashboard
components/   Reusable React components
services/     Browser-side API clients
backend/app/  FastAPI application, models, schemas, routes, and services
backend/migrations/  Alembic database migrations
backend/scripts/     Administrator maintenance commands
```

Uploaded backend files are stored under `backend/uploads/` at runtime and served from `/uploads`. This directory is ignored by Git; back it up separately in production.

## Current verification status

- `npm run build`: passes with Next.js 16.3.0
- `npm run lint`: currently fails because the existing codebase has ESLint findings, primarily React hook/state rules and a few TypeScript `any` usages

Next.js 16 does not run ESLint as part of `next build`, so run both commands when validating changes.
