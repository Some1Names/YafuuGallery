# Manga Web

A personal manga reading website built with **Next.js**, designed to provide a clean and responsive experience for browsing manga, viewing chapters, and managing manga content.

## ✨ Features

* 📚 Browse available manga
* 📖 Read manga chapters
* 🔎 Manga and chapter navigation
* ❤️ Favorite manga
* 👤 User authentication
* 📝 Manga and chapter management
* 📱 Responsive design for desktop and mobile
* ⚡ Server-side data fetching with Prisma

## 🛠️ Tech Stack

### Frontend

* [Next.js](https://nextjs.org/)
* React
* TypeScript
* Tailwind CSS
* Lucide React

### Backend

* Next.js API Routes
* Prisma ORM
* PostgreSQL

### Authentication & Security

* Authentication with NextAuth/Auth.js
* Password hashing with bcryptjs
* Zod validation
* React Hook Form

## 📁 Project Structure

```text
.
├── app/
│   ├── api/              # Backend API routes
│   ├── manga/            # Manga pages
│   ├── browse/           # Manga browsing
│   └── ...
├── components/           # Reusable React components
├── lib/                  # Utilities and shared logic
├── prisma/
│   └── schema.prisma     # Database schema
├── public/               # Static assets
├── .env                  # Environment variables
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
npm install
```

### 3. Configure environment variables

Create a `.env` file in the root directory:

```env
DATABASE_URL="your-database-url"
AUTH_SECRET="your-auth-secret"
```

Add any additional environment variables required by your project.

### 4. Set up the database

Run the Prisma migration:

```bash
npx prisma migrate dev
```

Then generate the Prisma Client:

```bash
npx prisma generate
```

### 5. Start the development server

```bash
npm run dev
```

Open your browser and visit:

```text
http://localhost:3000
```

## 🗄️ Database

The project uses **PostgreSQL** with **Prisma ORM**.

The database contains data such as:

* Users
* Manga
* Authors
* Chapters
* Favorites

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
