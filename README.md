# MESHAQ CONNECTION LIMITED — Production Website + Admin

This package includes the responsive website, a Node.js/Express API, PostgreSQL persistence, email notifications, public comment moderation, and a private admin dashboard.

## Included
- Project enquiry form saves submissions to PostgreSQL.
- Email notification to `meshaqconnectionlimited@gmail.com` through configured SMTP.
- Admin login with bcrypt password hashing and an 8-hour HttpOnly, SameSite=Strict session cookie.
- Dashboard at `/admin` for enquiries, services, projects, comments, and testimonials.
- Enquiry status tracking and internal notes.
- CRUD operations for services, projects, comments, and testimonials.
- Comments require admin approval before appearing publicly; public likes are persisted.
- Rate limits on login and public submissions, honeypot fields, input validation, same-origin checks, Helmet security headers, request-size limits, and parameterized SQL.
- Mobile-responsive admin interface.

## Requirements
- Node.js 20 or newer
- Managed PostgreSQL database
- SMTP credentials from an email provider or trusted SMTP relay
- HTTPS in production

## Local setup
1. Run `npm install` in this folder.
2. Copy `.env.example` to `.env` and configure it. At minimum set `DATABASE_URL`, `JWT_SECRET`, and `ADMIN_PASSWORD`. Generate a secret with `openssl rand -hex 32`.
3. Use a strong, unique admin password of at least 12 characters. Never commit `.env` to source control.
4. Configure SMTP: `SMTP_HOST`, `SMTP_PORT`, `SMTP_SECURE`, `SMTP_USER`, `SMTP_PASS`, and a verified `MAIL_FROM`. `NOTIFY_EMAIL` defaults to `meshaqconnectionlimited@gmail.com`.
5. Run `npm start`, open `http://localhost:3000`, and visit `http://localhost:3000/admin` for the dashboard.

First startup creates the initial admin if `ADMIN_PASSWORD` is set and inserts default services if the services table is empty. Existing admin passwords are not overwritten on later starts. Do not expose a public signup route.

## Deploy (Render, Railway, Fly.io, or similar)
1. Create a persistent managed PostgreSQL database and set `DATABASE_URL`.
2. Deploy as a Node web service using build command `npm install` and start command `npm start`.
3. Set `NODE_ENV=production`, `DATABASE_SSL=true` if required, `JWT_SECRET`, `ADMIN_EMAIL`, `ADMIN_PASSWORD`, SMTP variables, `NOTIFY_EMAIL=meshaqconnectionlimited@gmail.com`, `SITE_URL`, and `WHATSAPP_NUMBER` in the host's secret/environment settings.
4. Attach a custom domain and enforce HTTPS. Verify proxy configuration; the app trusts one reverse proxy.
5. Test `/api/health`, submit a test enquiry, verify the database record and notification email, and sign in at `/admin`.
6. Configure backups, alerting, log retention, and uptime monitoring. Existing admin passwords are not reset when `ADMIN_PASSWORD` changes.

## API overview
Public: `GET /api/health`, `GET /api/services`, `GET /api/projects`, `GET /api/testimonials`, `GET /api/comments`, `POST /api/enquiries`, `POST /api/comments`, `POST /api/comments/:id/like`.

Admin (session cookie required; write operations also require CSRF token): `POST /api/admin/login`, `POST /api/admin/logout`, `GET /api/admin/me`, `GET /api/admin/summary`, `GET /api/admin/enquiries`, `PATCH /api/admin/enquiries/:id`, and `GET/POST/PATCH/DELETE /api/admin/{services,projects,comments,testimonials}`.

## Important production notes
- **Email:** SMTP is optional for local testing. Without SMTP, enquiries still save but email notifications are skipped and logged. Configure and test SMTP before launch. Email failures do not delete enquiries.
- **Reply-to:** Client email is used as `Reply-To`, not as the sender.
- **Phone numbers:** Confirm that `0712242050` is valid and use the correct international WhatsApp format. The frontend currently uses `254712242050`; verify it with the business owner before publishing.
- **Attachments:** The form does not upload files. If uploads are required, add validated uploads to private object storage with malware scanning and access controls.
- **Gallery:** Existing Unsplash items are design inspiration, not verified MESHAQ projects. They remain until an admin-published project exists. Only publish genuine company work or properly licensed images and accurate captions.
- **Testimonials:** Publish genuine client feedback only, with permission.
- **NCA:** Do not claim registration or licensing without verified credentials.
- **Privacy/legal:** Review the privacy notice, retention policy, consent language and terms for actual operations and applicable Kenyan law. Restrict access to enquiries containing personal information.
- **Admin hardening:** Use a unique password and strong secret, keep dependencies patched, enable MFA at the hosting/email provider where available, and restrict database/network access. Consider an external CAPTCHA/Turnstile if spam volume warrants it; current protection includes a honeypot, validation, origin checks, and rate limits.
- **Database:** Schema is created idempotently at startup. Use managed PostgreSQL with backups; do not rely on ephemeral local filesystems.

## Check
Run `npm run check` to validate JavaScript syntax. Test the enquiry and admin workflows in staging before switching the production domain.


## Kenya housing reference cards
The public site includes cards for Park Road (Ngara), Pangani, and Jogoo Road Phase 1 based on the official Boma Yangu portal. Their photos and current prices/status are subject to that portal and are not MESHAQ-owned properties or company project claims. The public enquiry form intentionally has no file upload field.
