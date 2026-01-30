# Rebuild Guide: Servd AI Recipe Platform

This guide provides a comprehensive, step-by-step walkthrough to rebuild the **Servd AI Recipe Platform** from scratch.

## 1. Project Overview

**Servd** is an AI-powered culinary assistant designed to solve the "what should I cook tonight?" dilemma. It allows users to:

- **Scan Pantry/Fridge**: Use AI Vision to identify ingredients from a photo.
- **AI Recipe Generation**: Generate detailed, professional recipes using Google Gemini.
- **Smart Pantry**: Manage a digital inventory of ingredients.
- **Professional PDF Export**: Export recipes as beautifully formatted PDFs.
- **Dynamic Collection**: Bookmark and save favorite recipes.

---

## 2. Tech Stack Rationale

| Tech                        | Role       | Why?                                                                                 |
| :-------------------------- | :--------- | :----------------------------------------------------------------------------------- |
| **Next.js 16 (App Router)** | Frontend   | Offers superior SEO, Server Components for performance, and built-in Server Actions. |
| **React 19**                | UI Library | Latest concurrent features and improved hook performance.                            |
| **Tailwind CSS v4**         | Styling    | Ultra-fast, zero-runtime CSS with modern variables and utility-first approach.       |
| **Express.js (Manual)**     | Backend    | Lightweight but robust control over API behavior and MongoDB interactions.           |
| **MongoDB + Mongoose**      | Database   | Flexible NoSQL schema allows for complex, nested recipe data.                        |
| **Google Gemini AI**        | AI Engine  | State-of-the-art vision and text generation with low latency (Flash models).         |
| **Arcjet**                  | Security   | Backend middleware for rate-limiting and WAF protection.                             |
| **Unsplash API**            | Media      | Backend service for fetching dynamic recipe images.                                  |

---

## 3. Folder Structure Explanation

### Frontend (`/frontend`)

- `app/`: Routing layer (Next.js App Router). Contains pages, layouts, and global styles.
- `actions/`: **Server Actions**. Contains the core "business logic" (AI calls, DB updates via fetch).
- `components/`: UI components. Separated into `ui` (primitives) and feature-specific components.
- `lib/`: Utilities, contexts (Auth), and static data.
  - `api.js`: Helper for authenticated fetch requests.
- `hooks/`: Custom React hooks.

### Backend (`/backend`)

- `models/`: Mongoose schemas (User, Recipe, PantryItem).
- `routes/`: Express API endpoints.
- `middleware/`: Auth verification and Arcjet Rate Limiting.
- `lib/ai/`: **Hub for AI Logic**. Gemini Client, Prompts, and Image Service.
- `server.js`: Main entry point for the Express server.

---

## 4. Environment Setup

You will need the following API keys and tools:

1. **Node.js LTS** (v20+)
2. **MongoDB Atlas** (External URI or Local)
3. **Google AI Studio Key** (Add to Backend .env)
4. **Arcjet Key** (Add to Backend .env)
5. **Unsplash Access Key** (Add to Backend .env)
6. **JWT Secret** (any random string)

---

## 5. Step-by-Step Build Process

### Step 1: Initialize the Project

Create two main folders: `frontend` and `backend-manual`. Initialize `npm` in both.

### Step 2: Backend Implementation (The Foundation)

1. **Database Models**: Create `User.js` with hashed passwords (Bcrypt) and `Recipe.js` to store complex JSON objects.
2. **JWT Auth Middleware**: Write a middleware that extracts a token from `req.cookies` and verifies it using `jsonwebtoken`.
3. **API Routes**: Implement CRUD for Recipes and Pantry items. Ensure they return data in a consistent wrapper (e.g., `{ data: ... }`).

### Step 3: Frontend Implementation (The Interface)

1. **Auth Context**: Create a `lib/auth-context.js` to manage the logged-in user state using React Context and `useEffect` to sync with the backend.
2. **Middleware**: Add a `middleware.js` in the root of `/frontend` to redirect unauthenticated users away from `/dashboard`.
3. **UI Components**: Build a responsive header, hero section, and a dynamic dashboard using **shadcn/ui** components.

### Step 4: Integrating AI Features (The Heart)

1. **Backend AI Layer**: Create `backend/lib/ai/`. Move `client.js` (Gemini Config), `prompts.js`, and `image-service.js` here.
2. **AI Routes**: Create `backend/routes/recipes.js` and `pantry.js`. Implement endpoints (`/generate`, `/suggest`, `/scan`) that use the AI layer.
3. **Frontend API Helper**: Create `frontend/lib/api.js` with a `fetchWithAuth` function to handle token headers automatically.
4. **Connect Actions**: Update `frontend/actions/` to use `fetchWithAuth` to call your new backend endpoints.

### Step 5: PDF and Polish

- Use `@react-pdf/renderer` to create a `RecipePDF` template.
- Integrate **Sonner** for toast notifications on success/error.

---

## 6. Communication Flow

- The **Frontend** never talks directly to the Database.
- It uses **Server Actions** or `fetch()` calls.
- All requests to the backend include `credentials: 'include'` to pass the HTTP-only JWT cookie.
- The **Backend** validates the session and responds with JSON.

---

## 7. Common Mistakes & Debugging

- **Cookie Issues**: Ensure the backend's `cors` allow `credentials: true`.
- **Gemini JSON Parsing**: Sometimes AI adds markdown like ` ```json `. Use a regex to strip these before `JSON.parse()`.
- **Database Connection**: Always check if your IP is whitelisted on MongoDB Atlas.

---

## 8. How to Run Locally

1. Start Backend: `cd backend && npm run dev` (Port 1337).
2. Start Frontend: `cd frontend && npm run dev` (Port 3000).
3. Ensure `.env` files are populated in both directories.

---

## 9. Deployment Guidance

- **Backend**: Deploy to Render or Fly.io. Set `NODE_ENV=production`.
- **Frontend**: Deploy to Vercel. Ensure all environment variables are added in the Vercel dashboard.
- **Database**: Use a managed MongoDB Atlas instance.
