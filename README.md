# YafuuGallery

A manga reading website built with **Next.js** — original manga and translations, read in the browser on desktop or phone, in English or Thai.

🌐 **Live:** https://yafuu-gallery.vercel.app

## ✨ Features

### Reading

* 📖 PDF chapters, read as a vertical scroll or page by page (two-page spreads on desktop, swipe on phones)
* ↔️ Reading direction set per manga — manga style (right to left) or comic book style (left to right)
* 🌏 Several languages per chapter (Thai, English, Japanese), switchable in the reader
* ⏩ Picks up where you left off, and the next chapter preloads as you near the end
* 🔚 Previous / next chapter at the end of every chapter

### Discovering

* 🏠 Home page with an admin-curated featured carousel and the latest updates
* 🔎 Search by title, author or chapter name, with genre and status filters and sorting
* 🏷️ Genres and ongoing / completed status on every manga

### Your account

* 👤 Email/password (with email verification) and Google sign-in, plus password reset
* ❤️ Favorite manga and chapters, with a list of new chapters since you last read
* 🕘 Reading history
* 🙂 Profile with avatar and a `name#tag` display name

### Community

* 💬 Comments on chapters, with replies and likes
* 🚩 Readers can report comments; authors and admins can hide them, admins can delete

### Creating (authors at `/manage`, admins at `/admin`)

* 📝 Create and edit manga, arcs and chapters, drag to reorder
* 🖼️ Cover and banner uploads, cropped and compressed in the browser before upload
* 📄 Chapter PDFs upload straight to storage (up to 200 MB); the first page becomes the chapter cover if none is set
* ⭐ Featured carousel, user roles (reader / author / admin) and storage usage with cleanup of unused files (admins)

### Site

* 🇹🇭 English and Thai interface — switch in the navbar; first visits follow the browser's language
* 🌗 Dark and light themes
* 📱 Responsive layouts for desktop and mobile
* ⚖️ Privacy policy and terms of use in both languages
* 🔗 Sitemap, robots.txt and link previews (Open Graph)

## 🛠️ Tech Stack

### Frontend

* [Next.js](https://nextjs.org/) 16 (App Router, Turbopack)
* React 19 + TypeScript
* Tailwind CSS 4
* [next-intl](https://next-intl.dev/) for English / Thai
* [react-pdf](https://github.com/wojtekmaj/react-pdf) (pdf.js) for the reader
* React Hook Form + Zod
* Lucide React, Lenis

### Backend

* Next.js route handlers and server components
* Prisma ORM 7 (with the `@prisma/adapter-pg` driver adapter)
* PostgreSQL (hosted on [Supabase](https://supabase.com/))
* Cloudflare R2 for images and PDFs (S3-compatible, presigned uploads)

### Authentication & Email

* [Better Auth](https://www.better-auth.com/) — email/password and Google OAuth
* [Resend](https://resend.com/) — email verification and password reset

### Tooling

* [Bun](https://bun.sh/) as the package manager and runtime
* ESLint and [Vitest](https://vitest.dev/)
* Deployed on [Vercel](https://vercel.com/)

## 📁 Project Structure

```text
.
├── app/
│   ├── (main)/         # Site layout — home, manga, search, favorites, history, profile, manage, admin, privacy, terms
│   ├── (fullscreen)/   # No site chrome — chapter viewer, login, signup, password reset
│   └── api/            # Route handlers (admin, auth, chapters, comments, favorites, history, manga, profile, upload)
├── component/          # React components
├── lib/                # Shared code (auth, Prisma client, storage, image processing, dates, …)
├── i18n/               # Language detection and next-intl request config
├── messages/           # Interface text — en.json and th.json
├── prisma/
│   ├── schema.prisma   # Database schema
│   └── migrations/     # Migration history
├── generated/prisma/   # Generated Prisma Client (not committed)
└── public/             # Static assets
```

## 🚀 Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/Some1Names/YafuuGallery.git
cd YafuuGallery
```

### 2. Install dependencies

```bash
bun install
```

### 3. Configure environment variables

Create a `.env` file in the root directory:

```env
DATABASE_URL="your-postgres-connection-string"
AUTH_SECRET="your-auth-secret"

GOOGLE_CLIENT_ID="your-google-oauth-client-id"
GOOGLE_CLIENT_SECRET="your-google-oauth-client-secret"

RESEND_API_KEY="your-resend-api-key"
# A sender on a domain verified in Resend. Without it, email verification
# is turned off and mail only reaches your own Resend account.
RESEND_FROM_ADDRESS="YafuuGallery <noreply@your-domain.com>"

CLOUDFLARE_ACCOUNT_ID="your-cloudflare-account-id"
R2_ACCESS_KEY_ID="your-r2-access-key-id"
R2_SECRET_ACCESS_KEY="your-r2-secret-access-key"
R2_BUCKET_NAME="your-r2-bucket-name"
R2_PUBLIC_URL="https://your-r2-public-url"

# Production only — the site's public address
BETTER_AUTH_URL="https://your-domain.com"
NEXT_PUBLIC_SITE_URL="https://your-domain.com"
```

`NEXT_PUBLIC_SITE_URL` is optional: it falls back to `BETTER_AUTH_URL`, then to Vercel's production URL, then to `http://localhost:3000`.

### 4. Set up the database

Apply the migrations, then generate the Prisma Client:

```bash
bunx prisma migrate deploy
bunx prisma generate
```

### 5. Start the development server

```bash
bun run dev
```

Then open http://localhost:3000.

## 📜 Scripts

| Command | What it does |
| --- | --- |
| `bun run dev` | Development server |
| `bun run build` | Generates the Prisma Client and builds for production |
| `bun run start` | Serves the production build |
| `bun run lint` | ESLint |
| `bun run test` | Unit tests (Vitest) |

## ☁️ Deployment

The site runs on Vercel, which deploys every push to `master`.

* Set the environment variables above in the Vercel project. Don't set `NODE_ENV` — Vercel manages it.
* The build doesn't run migrations. After changing `prisma/schema.prisma`, apply the new migration to the production database with `bunx prisma migrate deploy` before (or right as) the code that needs it goes live.
* For Google sign-in, add `https://your-domain.com/api/auth/callback/google` as an authorized redirect URI in Google Cloud Console.

## 🗄️ Database

**PostgreSQL** (hosted on Supabase) with **Prisma ORM**. Core models:

* User, Account, Session, Verification — Better Auth
* Manga (genres, status, reading direction, featured), Arc, Chapter
* Translation — one PDF per chapter per language
* Comment (with replies), CommentLike, CommentReport
* Bookmark (favorite manga), ChapterBookmark (favorite chapter)
* ReadingProgress — resume position and reading history

Timestamps are stored without a time zone. Query them through Prisma: raw `pg` queries read them shifted by the server's offset.

## 🌏 Translations

All interface text lives in `messages/en.json` and `messages/th.json`, which must have the same keys. `global.d.ts` types every `t("…")` call against `en.json`, so a missing or misspelled key fails the typecheck. The privacy policy and terms are full pages per language (`PrivacyEn.tsx` / `PrivacyTh.tsx` and `TermsEn.tsx` / `TermsTh.tsx`).

## 📌 Project Status

🚧 Live and in active development.

## 📄 License

This project is intended for personal use.
