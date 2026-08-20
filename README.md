# 🏔️ Pyramid – Task Management System

A full-stack, pixel-perfect **Task Management System** built as an assessment project. Implements the provided Figma design with high fidelity across a **Next.js** frontend and a **NestJS** backend, connected to a **PostgreSQL** database via **Prisma ORM**.

---

## 🔗 Live Demo

- **Frontend Application (Live):** [https://task-management-system-iota-ten.vercel.app](https://task-management-system-iota-ten.vercel.app)
- **Backend API (Live):** [https://task-management-system-7v14.onrender.com](https://task-management-system-7v14.onrender.com)
- **GitHub Repository:** [https://github.com/Rugvednk/task-management-system](https://github.com/Rugvednk/task-management-system)
- **Part 2 Product Understanding:** [PART_2_PRODUCT_UNDERSTANDING.md](./PART_2_PRODUCT_UNDERSTANDING.md)

---

## 🛠️ Tech Stack

| Layer      | Technology                                         |
|------------|----------------------------------------------------|
| Frontend   | Next.js 16 (App Router), TypeScript, Tailwind CSS v4 |
| Icons      | Lucide React                                        |
| Backend    | NestJS (TypeScript), Class Validator               |
| Database   | PostgreSQL via Prisma ORM                          |
| Auth       | Guest Login with auto-seeding                      |

---

## ✨ Features

### 🎨 Design Fidelity
- Pixel-perfect recreation of the Figma design for all four page layouts
- Correct typography, spacing, color tokens, and iconography
- Smooth transitions and interactive hover/active states

### 🌗 Theme Support
- **Light & Dark Mode** toggle with smooth transition
- **6 Accent Color Palettes** — Amber, Blue, Pink, Rose, Emerald, Black
- Persisted across page refreshes via `localStorage`

### 🔐 Guest Login & Auto-Seeding
- "Continue as Guest" flow on the landing page
- `POST /seed` auto-initializes a default Workspace, Project, Team Members (Dexter, Sarah, Alex), sample Tasks, Subtasks, and Comments

### 📋 Tasks Page
- **List View** — tasks grouped by status (To Do / Doing / Completed), collapsible sections, inline status dropdowns, priority badges, due dates, member avatars
- **Kanban Board View** — drag-friendly columns with card counts, progress badges, status pickers
- Real-time search filtering and status filter dropdown
- Column visibility toggle (Priority, Members, Due Date, Actions)
- Create, Edit, and Delete tasks via modal

### 📁 Projects Page
- Projects table with priority signal bar icons, lead avatars, due dates
- Create new projects via modal — saved to database immediately
- Delete projects with confirmation

### 👤 Settings & Profile Page
- Upload a custom profile picture (files or preset avatars)
- Edit Full Name, Email, Title, and Username
- Changes persist to backend and **instantly reflect across the entire app** (Sidebar, all pages) via global `UserProvider` context

### 🗂️ Task Detail Page (`/tasks/[id]`)
- Full task properties: status, priority, due date, members, reporter
- Subtask checklist with inline add and toggle completion
- Discussion/Comments feed with timestamps and author details
- Activity timeline log
- Share and lock controls header

### 🧩 Reusable Components
- `<Sidebar />` — shared navigation with live user profile
- `<UserProvider />` — global React context for user profile state
- `<ThemeMenu />` — theme + color picker popover
- `<TaskModal />` — create/edit task drawer

---

## 🏗️ NestJS Architecture

```
backend/src/
├── activity/          # Task activity timeline (GET, POST)
├── comments/          # Task comments (GET, POST, DELETE)
├── prisma/            # PrismaService (global singleton)
├── projects/          # Projects CRUD
├── seed/              # Database seeder (POST /seed)
├── subtasks/          # Subtasks CRUD
├── task-members/      # Task member assignment
├── tasks/             # Tasks CRUD
├── users/             # User profile management
├── workspaces/        # Workspace management
└── app.module.ts
```

- Global `ValidationPipe` with `whitelist: true` and `transform: true`
- Express body parser limit set to **50MB** for profile image uploads (base64)
- CORS enabled for frontend origin

---

## 📡 API Endpoints

| Method | Endpoint                    | Description                          |
|--------|-----------------------------|--------------------------------------|
| GET    | `/`                         | Health check                         |
| POST   | `/seed`                     | Seed default workspace & demo data   |
| GET    | `/tasks`                    | Get all tasks (with relations)       |
| POST   | `/tasks`                    | Create a task                        |
| GET    | `/tasks/:id`                | Get single task                      |
| PATCH  | `/tasks/:id`                | Update task                          |
| DELETE | `/tasks/:id`                | Delete task                          |
| GET    | `/projects`                 | Get all projects                     |
| POST   | `/projects`                 | Create a project                     |
| PATCH  | `/projects/:id`             | Update a project                     |
| DELETE | `/projects/:id`             | Delete a project                     |
| POST   | `/subtasks`                 | Add a subtask                        |
| PATCH  | `/subtasks/:id`             | Toggle subtask completion            |
| DELETE | `/subtasks/:id`             | Delete subtask                       |
| GET    | `/comments/task/:taskId`    | Get comments for a task              |
| POST   | `/comments`                 | Post a comment                       |
| DELETE | `/comments/:id`             | Delete a comment                     |
| GET    | `/activity/task/:taskId`    | Get activity log for a task          |
| POST   | `/activity`                 | Create an activity entry             |
| GET    | `/users`                    | Get all users                        |
| PATCH  | `/users/:id`                | Update user profile                  |
| POST   | `/workspaces`               | Create a workspace                   |

---

## 🚀 Getting Started Locally

### Prerequisites
- Node.js v18+
- PostgreSQL database (or use SQLite by changing `DATABASE_URL`)

### 1. Clone the Repository
```bash
git clone https://github.com/Rugvednk/task-management-system.git
cd task-management-system
```

### 2. Backend Setup
```bash
cd backend
npm install
cp .env.example .env
# Edit .env and set your DATABASE_URL

npx prisma generate
npx prisma db push
npm run start:dev
```
> Backend runs on **http://localhost:3001**

### 3. Frontend Setup
```bash
cd ../frontend
npm install
npm run dev
```
> Frontend runs on **http://localhost:3000**

### 4. Seed Demo Data
Visit http://localhost:3000 and click **"Continue as Guest"** — this auto-seeds a workspace, projects, tasks, and users.

Or manually:
```bash
curl -X POST http://localhost:3001/seed
```

---

## 📂 Project Structure

```
task-management-system/
├── backend/           # NestJS API
│   ├── prisma/        # Prisma schema & migrations
│   └── src/           # Source modules
├── frontend/          # Next.js app
│   └── src/app/       # App Router pages & components
└── README.md
```

---

## 📝 Intentional Deviations from Figma

| Area | Decision | Reason |
|------|----------|--------|
| Profile Image | Stored as base64 in DB instead of file server | Simplifies setup; no file storage service needed |
| Auth | Guest login only (no JWT) | Per assignment scope; focus on UI/UX fidelity |
| Drag & Drop (Kanban) | Not implemented | Not shown in Figma interactions spec |

---

## 📸 Screenshots

> _(Add screenshots of each page after deployment)_

---

## 🧑‍💻 Author

Built by **Rugved Naik** as part of the Frontend + Backend Assessment.
