# 🎓 Bidyapith — Enterprise University Management & Student Information System (Frontend)

<div align="center">

[![Next.js](https://img.shields.io/badge/Next.js-16.3-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.2-61DAFB?style=for-the-badge&logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-06B6D4?style=for-the-badge&logo=tailwindcss)](https://tailwindcss.com/)
[![Redux Toolkit](https://img.shields.io/badge/Redux_Toolkit-2.12-764ABC?style=for-the-badge&logo=redux)](https://redux-toolkit.js.org/)
[![TanStack Query](https://img.shields.io/badge/TanStack_Query-v5-FF4154?style=for-the-badge&logo=reactquery)](https://tanstack.com/query)

**A high-performance, accessible, and responsive enterprise-grade University Management System (UMS / SIS) web application designed for higher education institutions.**

[Live Demo](https://bidyapith.vercel.app) • [Backend Repository](https://github.com/parvejme24/bidyapith-backend) • [API Documentation](https://bidyapith-backend.onrender.com/health)

</div>

---

## 📌 Overview

**Bidyapith** is an end-to-end institutional web portal that unifies prospective admissions, student academics, faculty grading, course scheduling, billing, and administration under a single cohesive interface. Built with modern web standards, it delivers real-time data sync, high-density analytical dashboards, and role-guarded workflows.

---

## ✨ Key Features & Portals

### 👨‍💼 1. Institutional Administration Portal (`/admin`)
* **Real-time Institutional Metrics:** Interactive enrollment statistics, fee collection summaries, and active department breakdowns powered by **Recharts**.
* **Academic Catalog Governance:** Centralized management for Departments, Degree Programs, Courses, and Prerequisites.
* **Semester & Section Offerings:** Schedule creation with real-time seat quota monitoring and timetable conflict detection.
* **Faculty & Student Directory:** Comprehensive user lifecycle management, role delegation, and profile controls.

### 👨‍🏫 2. Faculty & Instructor Portal (`/instructor`)
* **Course Workspaces:** Manage active class rosters, syllabus disclosures, and course announcements.
* **High-Density Gradebook:** Fast, keyboard-friendly grade entry with auto-calculating weighted GPA using **TanStack Table**.
* **Attendance Ledger:** Daily/weekly attendance tracking with automatic eligibility threshold calculations (<75% exam warning).

### 👨‍🎓 3. Student Portal (`/student`)
* **Academic Dashboard:** Enrolled courses, timetable schedules, GPA progressions, and financial status at a glance.
* **Self-Service Course Registration:** Step-by-step enrollment wizard with prerequisite validation and real-time seat availability.
* **Digital Transcript & Verification:** Materialized semester grade reports, academic standings, and printable verifiable certificates.
* **Billing & Online Payments:** Tuition invoice breakdown and integrated Stripe / SSLCommerz checkout flows.

### 🌐 4. Public Web Portal & Admissions
* **Admissions Funnel:** Multi-step online student application with file uploads (transcripts, identity proofs).
* **Interactive Academic Catalog:** Filterable and searchable program and course directories.
* **Central Notice Board:** Real-time departmental notices and circulars.
* **Global Command Search (`⌘K` / `Ctrl+K`):** Fast application-wide navigation across departments, faculty, courses, and documentation.

---

## 🛠️ Tech Stack & Architecture

| Layer | Technology | Purpose |
|---|---|---|
| **Framework** | **Next.js 16 (App Router)** | Server & Client Components, Route Handlers, SEO optimization |
| **UI Library** | **React 19** | Modern concurrent rendering and hooks |
| **Language** | **TypeScript (Strict Mode)** | End-to-end type safety |
| **Styling** | **Tailwind CSS v4 + tw-animate** | High performance zero-runtime styling |
| **Component Kit** | **shadcn/ui + Base UI** | Fully accessible, composable UI primitives |
| **State Management** | **Redux Toolkit + RTK Query** | Centralized global client state |
| **Data Fetching** | **TanStack Query (React Query v5)** | Optimistic updates, background revalidation & cache |
| **Data Tables** | **TanStack Table v9** | Virtualized sorting, filtering, and pagination |
| **Forms & Validation** | **React Hook Form + Zod** | Schema-driven client-side validation |
| **Animations** | **Framer Motion** | Micro-interactions and fluid layout transitions |
| **Data Visualization**| **Recharts** | Interactive institutional charts and metric graphs |
| **Icons** | **Lucide React** | Clean, consistent UI iconography |

---

## 📁 Project Structure

```text
bidyapith_frontend/
├── app/                        # Next.js 16 App Router (Routes & Layouts)
│   ├── (public)/               # Home, About, Admissions, Programs, Courses, Notices
│   ├── (auth)/                 # Login, Register, Password Recovery
│   ├── admin/                  # Administrative Management Portal
│   ├── instructor/             # Faculty Grading & Attendance Portal
│   ├── student/                # Student Academics & Registration Portal
│   ├── layout.tsx              # Root Layout with Theme & Redux Providers
│   └── globals.css             # Tailwind v4 Directives & Design Tokens
├── components/                 # Modular, Reusable Component Library
│   ├── ui/                     # Primitives (Button, Modal, Input, Badge, Table)
│   ├── dashboard/              # Role-specific dashboard widgets, topbars, sidebars
│   ├── site/                   # Public landing components, headers, footers
│   └── shared/                 # Skeletons, breadcrumbs, search dialogs
├── hooks/                      # Custom React hooks (auth, media queries, debounce)
├── lib/                        # Client-side Utilities & Core Logic
│   ├── api-client/             # Modular API SDK grouped by domain
│   ├── redux/                  # Redux Toolkit store and RTK Query API definitions
│   └── utils.ts                # Formatting, date helpers, class merger (`cn`)
└── public/                     # Static assets, branding, and icons
```

---

## ⚡ Getting Started

### Prerequisites
* **Node.js**: `v20.x` or higher
* **Package Manager**: `npm`, `pnpm`, or `bun`
* **Backend API**: Running instance of [bidyapith-backend](https://github.com/parvejme24/bidyapith-backend)

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/parvejme24/bidyapith-frontend.git
   cd bidyapith-frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure Environment Variables:**
   Create a `.env.local` file in the project root:
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:5001/api/v1
   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
   ```

4. **Run the development server:**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser.

5. **Type Check & Lint:**
   ```bash
   npm run typecheck
   npm run lint
   ```

---

## 💼 Key Engineering Highlights (Portfolio / Resume)

* **Robust State & Cache Architecture:** Integrated Redux Toolkit for synchronous client UI states alongside TanStack Query for server-cache lifecycle management.
* **Universal Search Portal:** Engineered a `⌘K` global search palette with debounced querying across courses, faculty, and administrative settings.
* **Strict Type Cohesion:** Unified schema contracts between Zod form schemas and TypeScript data models to eliminate runtime schema mismatch.
* **Institutional Printing Engine:** Built dynamic CSS print media stylesheets for verifiable academic transcripts and graduation certificates.
* **Accessible UI/UX:** Built on WAI-ARIA compliant primitives with full keyboard navigability and dynamic Light/Dark theme switching.

---

## 📄 License

This project is licensed under the [ISC License](LICENSE).
