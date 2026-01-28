# System Architecture & Design: AI Recipe Platform

This document outlines the architectural patterns, data flow, and design decisions made for the **Servd AI Recipe Platform**.

---

## 1. High-Level System Architecture

The platform follows a **Decoupled Client-Server Architecture** with a modern Next.js 16 frontend and a standalone Express.js backend.

### The Flow:

1. **User Action**: User interacts with the UI (e.g., searches for a recipe).
2. **Server Action**: Next.js triggers a Server Action (Backend-for-Frontend layer).
3. **External Services**: The Server Action communicates with Google Gemini (AI) and Unsplash (Images).
4. **Data Persistence**: The processed data is sent to the Express API, which stores it in MongoDB.
5. **Response**: Data flows back up to the Next.js frontend to update the UI.

---

## 2. Backend Architecture

The backend is built using a **Layered Service-Controller Architecture**:

- **Layer 1: Entry (server.js)**: Configures global middleware (CORS, Parsers) and initializes the DB connection.
- **Layer 2: Routes**: Maps HTTP endpoints to logic (e.g., `/api/auth`, `/api/recipes`).
- **Layer 3: Models (Mongoose)**: Defines the data structure and business rules (e.g., pass hashing on save).
- **Layer 4: Middleware**: Intercepts requests for authentication and authorization.

---

## 3. Frontend Architecture

The frontend leverages the **Next.js App Router** pattern:

- **Routing**: Folder-based routing with support for shared layouts.
- **Components**:
  - **shadcn/ui**: Component library based on Radix UI and Tailwind CSS for a consistent, accessible design system.
  - **Server Components**: Used for static/data-fetching pages to minimize JS on the client.
  - **Client Components**: Used for interactive sections like forms and modals.
- **State Management**:
  - **Auth State**: Global via React Context API (`AuthContext`).
  - **Data State**: Handled via Next.js Server Actions and native `useState`/`useTransition`.
- **Modular AI Layer**:
  - Located in `frontend/lib/ai/`, this layer separates complex prompt engineering and API clients from the orchestration logic in Server Actions, improving testability and code reuse.

---

## 4. API Design & Data Flow

The API is designed to mimic a Headless CMS (Strapi) structure:

- **Format**: All responses are wrapped in a `{ data: {} }` or `{ data: [] }` envelope.
- **Filtering**: Supports basic URL query filters (e.g., `?filters[title][$eqi]=...`).
- **Statelessness**: No session state is held on the server; everything relies on the JWT stored in the browser cookie.

---

## 5. Database Design (MongoDB)

### Collections:

1. **Users**:
   - Fields: `email`, `password`, `subscriptionTier`, `role`.
   - Index: Unique index on `email`.
2. **Recipes**:
   - Fields: `title`, `description`, `ingredients` (Array), `instructions` (Array), `author` (Ref: User).
   - Relationship: Many-to-One with Users.
3. **PantryItems**:
   - Fields: `name`, `quantity`, `author` (Ref: User).
4. **SavedRecipes**:
   - Junction collection linking Users to Recipes (Many-to-Many).

---

## 6. Authentication & Security

- **Auth Strategy**: JWT (JSON Web Tokens) with a 7-day expiration.
- **Cookie Security**: Tokens are sent in an `HttpOnly`, `Secure` cookie to prevent Cross-Site Scripting (XSS).
- **Network Security**: **Arcjet** acts as a Shield WAF, blocking common attacks (SQLi, XSS) and unwanted bots.
- **Rate Limiting**: Implemented via Arcjet based on a per-user token bucket algorithm (different limits for Free vs Pro).

---

## 7. Performance & Scalability

- **Gemini 1.5 Flash**: Chosen specifically for its balance of high reasoning power and ultra-low latency.
- **Stale-While-Revalidate**: Next.js cache headers are used to prevent redundant AI calls if a recipe was generated recently.
- **Scalability**: The backend is stateless, meaning multiple instances can be spun up behind a load balancer without data sync issues.

---

## 8. Error Handling

- **Toast Notifications**: Managed by `sonner` for real-time user feedback.
- **Global Error Boundary**: Implemented in the backend to catch unhandled rejections and return a clean `500` status.
- **AI Graceful Degradation**: If Gemini fails, the system provides a clear error message rather than a silent crash.

---

## 9. Diagrams (Description)

### Data Lifecycle Diagram:

- **Input**: User uploads image.
- **Process A**: Frontend → Gemini Vision → Ingredient List.
- **Process B**: Frontend → Gemini Text → Full Recipe Schema.
- **Output**: JSON stored in MongoDB → Rendered as Card in UI.
