# lnky

A modern link-in-bio platform that lets you share all your important links from one customizable page.

## Features

- Custom profile pages at `lnky.lol/username`
- Drag-and-drop link reordering
- Full customization (colors, background image, avatar)
- Profile view analytics
- Mobile-friendly responsive design

## Prerequisites

- Node.js 18+
- PostgreSQL database (or Turso/LibSQL)
- UploadThing account (for image uploads)

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/lnky.git
   cd lnky
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   ```bash
   cp .env.example .env
   ```

   Configure your database URL, NextAuth secret, and UploadThing keys.

4. Set up the database:
   ```bash
   npx prisma db push
   ```

5. Start the development server:
   ```bash
   npm run dev
   ```

6. Open [http://localhost:3000](http://localhost:3000)

## Tech Stack

- Next.js 16 + React 19
- TypeScript
- Tailwind CSS
- Prisma + PostgreSQL
- NextAuth v5
- UploadThing
