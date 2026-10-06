# AdiBank Copilot

AdiBank Copilot is a full-stack banking demonstration that brings account management, financial analytics, and conversational banking into one responsive application.

The project explores how to build an end-to-end banking experience with secure authentication, database-backed operations, clear user permissions, and accessible interfaces.

## 🚀 Live Application

🔗 [Try AdiBank Copilot](https://adibanking-copilot.vercel.app/)

The login page provides a demo account selector for exploring admin and customer experiences.

## 🛠️ Tech Stack

- **Framework**: Next.js App Router
- **Frontend**: React, TypeScript, Tailwind CSS v4
- **Authentication and Database**: Supabase Auth and PostgreSQL
- **Validation**: Zod
- **Testing**: Jest and isolated PostgreSQL tests with PGlite
- **Deployment**: Vercel

## 📦 Features

- Responsive layouts designed for iPhone 12 mini and larger screens
- Supabase authentication, protected routes, profile editing, and logout
- Admin and customer roles with server-enforced access controls
- Checking, savings, retirement, investment, mortgage, loan, and credit card accounts
- Database-backed account and transaction management
- Transfers between eligible accounts with confirmation and transfer history
- Credit card payments and cash advances constrained by available credit
- Monthly income, expenses, and savings analytics
- Expense category pie chart with transaction drill-down
- Banking assistant for application-specific questions and transfer requests
- Explicit confirmation before assistant-initiated transfers
- Activity logs with pagination and interaction-type search
- Admin filters for viewing activity across users
- Page refresh controls and database revision checks

## 👥 Admin and Customer Experiences

- **Customers** manage their own banking records, profile, and transfers, and view their own activity logs.
- **Admins** additionally access user management and activity logs across users, with a user filter.
- Banking data access follows ownership rules enforced by the API and database policies.

## 🔒 Security and Data Integrity

- Row-level security protects records belonging to each user.
- Protected endpoints validate authentication and permissions.
- Active-session checks reject access from revoked sessions.
- Money is stored in integer cents to avoid floating-point rounding errors.
- Database transactions keep transfers and balance changes consistent.
- Retry-safe operations prevent duplicate transfer execution.
- Assistant requests are restricted to supported application actions.

## ⚖️ Trade-offs and Scope

This application uses simulated banking data and public demo identities. Visitors using the same demo identity share its records.

Retirement and investment accounts represent simulated cash balances. Loans and credit cards do not implement interest accrual or statement cycles.

The assistant handles supported banking commands within the application. It is not a general-purpose financial adviser or an external bank integration.

Conversation history is stored per user in the browser rather than synchronized across devices. Local implementation updates may precede deployment to the live application.

## 📬 Contact

- 🔗 [LinkedIn](https://www.linkedin.com/in/adirathore)
- 🧑‍💻 [GitHub](https://github.com/aadishrath)

© aadish. Built for demonstration purposes only.
