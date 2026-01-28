# Technical Audit & Architectural Report: AI Recipe Platform

This document provides a detailed mapping of the architecture, tech stack, and security implementation of the AI Recipe Platform.

### 1. Core Tech Stack

| Component              | Technology | Version              | Details                                                          |
| :--------------------- | :--------- | :------------------- | :--------------------------------------------------------------- |
| **Runtime**            | Node.js    | Latest LTS           | Cross-environment runtime for both FE and BE.                    |
| **Frontend Framework** | Next.js    | 16.1.1 (Canary/Edge) | Utilizes the **App Router** and Server Components/Actions.       |
| **Library**            | React      | 19.2.3               | Latest version supporting Concurrent mode and Server Components. |
| **Backend Framework**  | Express.js | 5.2.1                | Lightweight server for API handling and manual backend logic.    |
| **Language**           | JavaScript | ES2024+              | Modern JS with modules and async/await across the stack.         |

---

### 2. Libraries & Components

| Category                 | Key Libraries           | Implementation Notes                                                             |
| :----------------------- | :---------------------- | :------------------------------------------------------------------------------- |
| **UI Component Library** | shadcn/ui, Lucide React | Premium UI components built on Radix UI primitives for accessibility.            |
| **Styling**              | Tailwind CSS v4, `clsx` | Next-gen Tailwind with CSS-first configuration and utility merging.              |
| **State Management**     | React Context API       | Handled via `auth-context.js` for session management; native hooks for UI state. |
| **AI Integration**       | `@google/generative-ai` | Direct integration with Google Gemini for recipe generation.                     |
| **PDF Generation**       | `@react-pdf/renderer`   | Client/Server-side PDF generation for recipes.                                   |
| **Form/Input Handling**  | shadcn/ui, `sonner`     | Used for polished dialogs, tabs, and toast notifications.                        |

---

### 3. Database Architecture

| Category          | Technology    | Description                                                                    |
| :---------------- | :------------ | :----------------------------------------------------------------------------- |
| **Database Type** | **MongoDB**   | NoSQL document-oriented database for flexible recipe schemas.                  |
| **ORM/ODM**       | **Mongoose**  | Used for schema validation, document mapping, and middleware (hooks).          |
| **User Schema**   | `User.js`     | Includes `email`, `password` (hashed), `subscriptionTier`, and `role`.         |
| **Recipe Schema** | `Recipe.js`   | Complex document structure for `ingredients`, `instructions`, and AI metadata. |
| **Relationships** | ObjectId Refs | Relational links between `User` and `Recipe` using Mongoose `ref`.             |

---

### 4. Security Audit

| Implementation          | Method                   | Description                                                               |
| :---------------------- | :----------------------- | :------------------------------------------------------------------------ |
| **Authentication**      | **JWT (JSON Web Token)** | Tokens are stored in **HTTP-only cookies** for protection against XSS.    |
| **Password Security**   | **Bcrypt**               | Passwords are salted and hashed (10 rounds) before DB persistence.        |
| **Advanced Protection** | **Arcjet**               | Implements **WAF (Shield)** and **Bot Detection** via Next.js middleware. |
| **Middleware**          | `cors`, `cookie-parser`  | Backend restricts origins and handles secure cookie parsing.              |
| **Auth Guard**          | Next.js Middleware       | Centralized route protection for `/recipe`, `/pantry`, and `/dashboard`.  |
| **Secrets Handling**    | `.env` / `.env.local`    | Properly ignored in `.gitignore`; environment-specific configs.           |

---

### 5. Project Organization

| Folder                  | Pattern         | Purpose                                                                         |
| :---------------------- | :-------------- | :------------------------------------------------------------------------------ |
| `frontend/app`          | **App Router**  | Directory-based routing with layouts, pages, and server components.             |
| `frontend/components`   | **Atomic-ish**  | Separation of UI primitives (Shadcn-style) and feature components.              |
| `backend-manual/routes` | **Modular API** | Clean separation of concerns for `auth`, `users`, `recipes`, and `pantry`.      |
| `backend-manual/models` | **Data Layer**  | Centralized schema definitions with lifecycle hooks (e.g., `pre-save` hashing). |
