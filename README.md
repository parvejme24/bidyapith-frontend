# 🎓 Bidyapith — University Management & Student Information System (Frontend)

<div align="center">

[![Next.js](https://img.shields.io/badge/Next.js-16.3-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.2-61DAFB?style=for-the-badge&logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-06B6D4?style=for-the-badge&logo=tailwindcss)](https://tailwindcss.com/)
[![Redux Toolkit](https://img.shields.io/badge/Redux_Toolkit-2.12-764ABC?style=for-the-badge&logo=redux)](https://redux-toolkit.js.org/)
[![Frontend CI](https://github.com/parvejme24/bidyapith-frontend/actions/workflows/frontend-ci.yml/badge.svg)](https://github.com/parvejme24/bidyapith-frontend/actions/workflows/frontend-ci.yml)
[![License: ISC](https://img.shields.io/badge/License-ISC-blue.svg?style=for-the-badge)](LICENSE)

**An enterprise-grade, responsive, and accessible University Management System (UMS) and Student Information System (SIS) frontend application.**

[Live Deployment (Primary)](https://bidyapith-frontend.vercel.app/) • [Live Deployment (Mirror)](https://momentum-frontend-pi.vercel.app/) • [Backend API](https://bidyapith-backend.onrender.com)

</div>

---

## 📖 Introduction

**Bidyapith** is an institutional web platform tailored for modern universities, colleges, and higher-education academies. It simplifies academic governance by providing unified, role-based workflows for institutional administrators, faculty educators, enrolled students, and prospective applicants.

Developed with **Next.js 16 (App Router)** and **React 19**, Bidyapith provides sub-second page transitions, dynamic theme adaptations (Dark/Light modes), keyboard-first command search (`⌘K`), and high-density data visualizations.

---

## 📝 Description

Modern educational institutions often struggle with fragmented software for admissions, class scheduling, grading, and tuition billing. Bidyapith solves this by centralizing all four primary university stakeholders into an integrated portal:

1. **Admissions & Public Visitors:** Explore degree offerings, departmental faculties, and submit multi-step admission applications online.
2. **Students:** Track degree progress, register for courses with automatic prerequisite & conflict checking, access printable transcripts, and pay tuition fees.
3. **Faculty Members:** Manage course rosters, maintain attendance records, and input semester grades with live weighted GPA computation.
4. **University Administrators:** Oversee academic departments, program curricula, semester offering quotas, and institutional revenue metrics.

---

## 🌐 Live Links & Repositories

| Resource | URL |
|---|---|
| **Frontend Production (Primary)** | [https://bidyapith-frontend.vercel.app/](https://bidyapith-frontend.vercel.app/) |
| **Frontend Production (Mirror)** | [https://momentum-frontend-pi.vercel.app/](https://momentum-frontend-pi.vercel.app/) |
| **Frontend GitHub Repository** | [https://github.com/parvejme24/bidyapith-frontend.git](https://github.com/parvejme24/bidyapith-frontend.git) |
| **Related Repository (Momentum)** | [https://github.com/parvejme24/momentum-frontend.git](https://github.com/parvejme24/momentum-frontend.git) |
| **Backend REST API** | [https://bidyapith-backend.onrender.com](https://bidyapith-backend.onrender.com) |
| **Backend GitHub Repository** | [https://github.com/parvejme24/bidyapith-backend.git](https://github.com/parvejme24/bidyapith-backend.git) |

---

## 🛠️ Tech Stack

### Core Technologies
* **Framework:** [Next.js 16 (App Router)](https://nextjs.org/)
* **Library:** [React 19](https://react.dev/)
* **Language:** [TypeScript (Strict Mode)](https://www.typescriptlang.org/)
* **Styling:** [Tailwind CSS v4](https://tailwindcss.com/) & [tw-animate-css](https://www.npmjs.com/package/tw-animate-css)
* **UI Primitives:** [shadcn/ui](https://ui.shadcn.com/) & [@base-ui/react](https://base-ui.com/)
* **Iconography:** [Lucide React](https://lucide.dev/)

### State Management & Data Fetching
* **Global State:** [Redux Toolkit (RTK)](https://redux-toolkit.js.org/) & [React-Redux](https://react-redux.js.org/)
* **Server Cache & Async Queries:** [TanStack React Query v5](https://tanstack.com/query)
* **HTTP Client:** [Axios](https://axios-http.com/) with centralized interceptors & token refresh logic

### Data Tables, Forms & Charts
* **Data Grids:** [TanStack Table v9](https://tanstack.com/table) (Sorting, filtering, virtualized pagination)
* **Forms & Validation:** [React Hook Form](https://react-hook-form.com/) with [Zod v3](https://zod.dev/)
* **Data Visualization:** [Recharts](https://recharts.org/) (Institutional metrics, revenue, student intake)
* **Animations:** [Framer Motion](https://www.framer.com/motion/)

---

## 🔄 CI/CD & GitHub Actions Automation

The repository includes automated Continuous Integration (CI) and build verification via GitHub Actions:

```
Push / Pull Request ➔ Lint & Typecheck (tsc + ESLint) ➔ Next.js Production Build ➔ Automated Deployment
```

* **Workflow File:** [`.github/workflows/frontend-ci.yml`](.github/workflows/frontend-ci.yml)
* **Automated Checks:**
  1. **Node.js 20.x Setup:** Optimized with caching on `package-lock.json`.
  2. **Static Type Validation:** Strict TypeScript analysis (`npm run typecheck`).
  3. **Code Quality Linting:** Automated ESLint checks (`npm run lint`).
  4. **Next.js Production Build:** Cache-enabled build compilation (`npm run build`).
* **Continuous Deployment:** Seamless automated deployment to **Vercel** on every push to `main`.

---

## 🌟 Key Features

### 1. 👨‍💼 Institutional Administration Portal (`/admin`)
* **Live Analytics Dashboard:** Interactive Recharts visualising student enrollment trends, revenue breakdowns, and faculty-to-student ratios.
* **Academic Catalog Management:** Create and configure Departments, Programs, Courses, and multi-tier prerequisite requirements.
* **Semester & Section Offerings:** Real-time seat allocation, instructor assignments, and class timetable scheduling.
* **User Governance:** Complete lifecycle management for students, faculty, and administrative staff.

### 2. 👨‍🏫 Instructor & Faculty Portal (`/instructor`)
* **Course Workspaces:** Manage active class rosters, syllabus files, and announcements.
* **Interactive Gradebook:** High-density spreadsheet grade entry with automatic continuous assessment and final weighted GPA calculations.
* **Attendance Ledger:** Fast daily attendance logging with automated warnings for students falling below the 75% exam eligibility threshold.

### 3. 👨‍🎓 Student Portal (`/student`)
* **Academic Hub:** Real-time course schedule, attendance percentage tracking, and CGPA standing.
* **Self-Service Enrollment:** Course registration wizard preventing schedule conflicts and verifying prerequisite completions.
* **Printable Transcripts & Certificates:** Verifiable academic certificates and transcript layouts designed with print-media CSS.
* **Fee Invoicing & Payments:** View outstanding dues and securely complete checkout via Stripe.

### 4. 🌐 Public Experience & Global Utilities
* **Multi-Step Admissions:** Clean student application pipeline with drag-and-drop document uploads.
* **Global Command Palette (`⌘K` / `Ctrl+K`):** Instant search indexing across courses, faculty, and navigation portals.
* **Adaptive Theme Engine:** System, dark, and light mode persistence using `next-themes`.

---

## 📂 Project Structure

```text
bidyapith_frontend/
├── .github/
│   └── workflows/
│       └── frontend-ci.yml          # GitHub Actions CI workflow
├── app/                             # Next.js 16 App Router
│   ├── (public)/                    # Public routes (about, admissions, courses, programs, notices)
│   ├── (auth)/                      # Authentication flows (login, register, forgot/reset-password)
│   ├── admin/                       # Admin dashboard views & management tables
│   ├── instructor/                  # Faculty gradebooks, rosters, and attendance
│   ├── student/                     # Student academic hub, registration, and certificates
│   ├── globals.css                  # Tailwind CSS v4 design tokens and utilities
│   └── layout.tsx                   # Root layout with Redux, Theme, and Query providers
├── components/                      # Modular UI component library
│   ├── dashboard/                   # Role-specific topbars, sidebars, and widgets
│   ├── home/                        # Landing page hero, metric charts, and feature sections
│   ├── site/                        # Public navigation, footers, page headers, skeletons
│   └── ui/                          # Accessible shadcn / Base UI primitives
├── hooks/                           # Custom reusable React hooks
├── lib/                             # Core utilities and client services
│   ├── api-client/                  # Modular REST API clients by domain
│   ├── redux/                       # Redux Toolkit slices and RTK Query base API
│   └── utils.ts                     # Class merge (`cn`) and formatting helpers
└── public/                          # Static brand assets, icons, and illustrations
```

---

## 📸 Screenshots & Preview

<div align="center">

| Public Landing & Hero | Modern Role-Based Dashboard |
|:---:|:---:|
| ![Landing Page Preview](https://raw.githubusercontent.com/parvejme24/bidyapith-frontend/main/public/preview-landing.png) | ![Dashboard Overview](https://raw.githubusercontent.com/parvejme24/bidyapith-frontend/main/public/preview-dashboard.png) |

| Course Registration & Catalog | Academic Certificate & Transcript |
|:---:|:---:|
| ![Course Registration](https://raw.githubusercontent.com/parvejme24/bidyapith-frontend/main/public/preview-courses.png) | ![Certificate View](https://raw.githubusercontent.com/parvejme24/bidyapith-frontend/main/public/preview-certificate.png) |

*(Screenshots reflect production builds hosted on Vercel)*

</div>

---

## 🚀 Local Installation & Setup

### Prerequisites
* **Node.js**: `v20.x` or higher
* **Package Manager**: `npm` / `pnpm` / `yarn`
* **Backend API**: Running instance of [bidyapith-backend](https://github.com/parvejme24/bidyapith-backend)

### Steps

1. **Clone the repository:**
   ```bash
   git clone https://github.com/parvejme24/bidyapith-frontend.git
   cd bidyapith_frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure Environment Variables:**
   Create a `.env.local` file in the root directory:
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:5001/api/v1
   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
   ```

4. **Start the development server:**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser.

5. **Run Linting and Type Verification:**
   ```bash
   npm run typecheck
   npm run lint
   ```

---

## 🎯 Conclusion

**Bidyapith Frontend** demonstrates an enterprise-grade web application architecture featuring strict TypeScript type safety, decoupled state management, high-performance styling, and automated CI/CD deployment pipelines. It represents a production-ready solution capable of scaling to thousands of concurrent institutional users.

---

## 📄 License

This project is licensed under the [ISC License](LICENSE).
