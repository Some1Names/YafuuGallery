# YafuuGallery

A personal manga reading website built with **Next.js**, designed to provide a clean and responsive experience for browsing manga, viewing chapters, and managing manga content.

## ✨ Features

* 📚 Browse manga, with a home page featuring an admin-curated carousel and a "Latest Updates" grid
* 📖 Read manga chapters (image-based and PDF chapters)
* ⏩ Continue Reading — resume the last chapter you were reading, from the home page or your profile
* 🔎 Search, plus manga and chapter navigation
* ❤️ Favorite manga and individual chapters
* 💬 Comments, with admin moderation
* 👤 User authentication (email/password and Google sign-in)
* 📝 Manga, arc, and chapter management for admins and authors
* 🖼️ Image uploads with automatic client-side cropping and compression before they reach storage
* 📱 Responsive design for desktop and mobile
* ⚡ Server-side data fetching with Prisma, tuned for fast page loads

## 🛠️ Tech Stack

### Frontend

* [Next.js](https://nextjs.org/) (App Router, Turbopack)
* React
* TypeScript
* Tailwind CSS
* Lucide React
* React Hook Form + Zod

### Backend

* Next.js API Routes
* Prisma ORM (driver adapters)
* PostgreSQL (hosted on [Supabase](https://supabase.com/))
* Cloudflare R2 for image storage (S3-compatible)

### Authentication & Email

* Authentication with [Better Auth](https://www.better-auth.com/) (email/password + Google OAuth)
* Transactional email (password reset) with [Resend](https://resend.com/)

### Tooling

* [Bun](https://bun.sh/) as the package manager and runtime

## 📁 Project Structure

```text
.
├── app/
│   ├── (main)/         # Main layout group — home, manga, admin, manage, profile, search, favorites
│   ├── (fullscreen)/   # Fullscreen layout group — chapter viewer, login, signup, password reset
│   └── api/            # API routes (admin, auth, chapters, manga, profile, upload)
├── component/          # Reusable React components
├── lib/                # Shared utilities (auth, Prisma client, image processing, etc.)
├── prisma/
│   ├── schema.prisma   # Database schema
│   └── migrations/     # Migration history
├── public/             # Static assets
├── .env                # Environment variables
└── package.json
```

## 🚀 Getting Started

### 1. Clone the repository

```bash
git clone <your-repository-url>
cd <your-project-folder>
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
CLOUDFLARE_ACCOUNT_ID="your-cloudflare-account-id"
R2_ACCESS_KEY_ID="your-r2-access-key-id"
R2_SECRET_ACCESS_KEY="your-r2-secret-access-key"
R2_BUCKET_NAME="your-r2-bucket-name"
R2_PUBLIC_URL="https://your-r2-public-url"
```

### 4. Set up the database

Apply migrations:

```bash
bunx prisma migrate deploy
```

Then generate the Prisma Client:

```bash
bunx prisma generate
```

### 5. Start the development server

```bash
bun run dev
```

Open your browser and visit:

```text
http://localhost:3000
```

## 🗄️ Database

The project uses **PostgreSQL** (hosted on Supabase) with **Prisma ORM**, connected through the `@prisma/adapter-pg` driver adapter.

Core models include:

* User, Account, Session, Verification (Better Auth)
* Manga, Arc, Chapter, Translation
* Comment, Bookmark, ChapterBookmark
* ReadingProgress

The Prisma schema can be found at:

```text
prisma/schema.prisma
```

## 🎨 Design

The website focuses on a dark, minimal reading experience with responsive layouts optimized for both desktop and mobile devices.

## 📌 Project Status

🚧 **Currently in development**

More features and improvements are planned as development continues.

## 📄 License

This project is intended for personal use.
