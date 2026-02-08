# AI Recipe Platform - Technical Documentation

## 1. Executive Summary

**Project Name:** AI Recipe Platform (ChefSense)  
**Type:** Full-Stack Web Application (SaaS)  
**Current State:** Production-Ready MVP

The **AI Recipe Platform** is an intelligent culinary assistant that solves the universal "what's for dinner?" problem. Unlike traditional recipe sites that force users to shop for specific ingredients, this platform uses **Generative AI (Gemini 2.5 Flash)** to create custom recipes based on **what users already have in their pantry**.

It bridges the gap between food waste reduction and culinary creativity. By checking existing pantry items and generating tailored recipes, it saves users money and reduces decision fatigue.

**Target Audience:** Home cooks, busy professionals, and food waste conscious individuals.  
**Impact:** transform static recipe searching into dynamic recipe _creation_.

---

## 2. Product Vision & Philosophy

**Why this exists:**  
Existing recipe platforms are **passive**—they require you to fit their requirements. This platform is **reactive**—it molds itself to your available ingredients and preferences.

**Core Philosophy:** "Cook with what you have."  
**Design Principles:**

1.  **AI-First but Human-Centric:** AI generates the content, but the UX focuses on readability and trust.
2.  **Performance by Default:** Optimistic UI, caching strategies, and fast edge middleware.
3.  **Privacy & Security:** Secure HTTP-only cookies and bot protection at the edge.

**Long-Term Vision:**  
To become the "Spotify for Food"—a personalized, AI-driven culinary operating system that manages inventory, meal planning, and grocery shopping autnomously.

---

## 3. User Roles & Permissions

| Role         | Access Level  | Capabilities                                                                                                                              |
| :----------- | :------------ | :---------------------------------------------------------------------------------------------------------------------------------------- |
| **Guest**    | Public        | • View Landing Page<br>• Search Public Recipes<br>• View Single Recipe Details                                                            |
| **User**     | Authenticated | • **All Guest Features**<br>• Manage Pantry Items<br>• Generate New Recipes (Standard Limit)<br>• Save/Bookmark Recipes<br>• Rate Recipes |
| **Pro User** | Paid Tier     | • **All User Features**<br>• Unlimited AI Generations<br>• Nutritional Analysis<br>• Priority Support                                     |
| **Admin**    | System        | • Manage Users<br>• Moderate Content<br>• View System Analytics                                                                           |

**Access Control Strategy:**  
Role-Based Access Control (RBAC) is implemented via:

1.  **Backend:** `auth` middleware checks JWT validity and user roles.
2.  **Frontend:** `middleware.js` protects routes (`/dashboard`, `/pantry`) via edge-logic.

---

## 4. Feature Breakdown

### A. AI Recipe Generation

- **User Story:** "As a user, I want to type 'healthy chicken dinner' and get a full detailed recipe."
- **Flow:** User inputs prompt -> Backend checks DB for match (Cache) -> If miss, call Gemini API -> Parse JSON -> Fetch Image -> Save to DB -> Return to User.
- **Edge Cases:** API Failure, JSON parsing error.
- **Security:** Rate limiting via Arcjet. Response validation via Zod.

### B. Pantry-Based Suggestions ("Cook with what you have")

- **User Story:** "As a user, I want to select my fridge items and find out what I can cook."
- **Flow:** User selects items -> Backend constructs prompt with ingredients -> AI generates 3-5 suggestions -> Images fetched -> Interactive Cards displayed.
- **Why:** Solves the "what can I make right now" problem without shopping.

### C. Digital Pantry Management

- **User Story:** "I want to track what I have at home."
- **Technical Detail:** CRUD operations on `PantryItem` collection.
- **Optimization:** Optimistic UI updates on frontend for instant feedback.

### D. Authentication System

- **User Story:** Secure login/signup.
- **Flow:** Email/Password -> Bcrypt Hash -> JWT Generation -> HTTP-Only Cookie.
- **Security:** Prevents XSS (HttpOnly) and CSRF (SameSite).

---

## 5. System Architecture

The system follows a **Modern Monolithic** architecture (Modular Monolith) suitable for rapid iteration and scalability up to millions of users before breaking into microservices.

**High-Level Data Flow:**
`Client (Next.js) <--> [Edge Middleware] <--> Server (Express/Node) <--> Database (MongoDB)`

**Diagram:**

```ascii
+------------------+       +-------------------+       +-----------------+
|   Client Side    |       |   Backend API     |       |   Data Store    |
| (Next.js/React)  | ----> | (Node.js/Express) | ----> |   MongoDB Atlas |
|                  | <---- |                   | <---- |                 |
+------------------+       +--------+----------+       +-----------------+
        ^                           |
        |                           v
+-------+----------+       +-------------------+
|  Edge Middleware |       |   AI Services     |
| (Arcjet Security)|       | (Gemini AI)        |
+------------------+       +-------------------+
```

---

## 6. Frontend Architecture

**Framework:** Next.js 16 (App Router)

- **Why?** Server-side rendering (SSR) for SEO, unified routing, and easy deployment to Vercel.

**Folder Structure:**

- `app/`: Routes and Pages (Features).
- `components/`: Reusable UI atoms (Buttons, Cards).
- `lib/`: Utilities and helpers.
- `hooks/`: Custom React hooks (e.g., `usePantry`).

**Key Strategies:**

- **State Management:** React Server Components (RSC) for fetching, regular React State (`useState`) for interactivity.
- **Styling:** Tailwind CSS v4 for rapid, utility-first consistency.
- **UI Library:** Shadcn/UI (Radix Primitives) for accessible, unstyled core components.

---

## 7. Backend Architecture

**Framework:** Express.js on Node.js

- **Why?** Proven stability, massive ecosystem, and excellent async handling for AI bridging.

**Structure:**

- `server.js`: Entry point.
- `routes/`: Specific domains (auth, recipes, pantry).
- `models/`: Mongoose schemas.
- `controllers/` (Implicit in routes): Logic handling.
- `middleware/`: Cross-cutting concerns (Auth, Rate Limit).

**API Philosophy:** RESTful JSON API.

- **Validation:** STRICT Zod schema validation (Runtime) + Mongoose schema validation (Storage).
- **Error Handling:** Centralized middleware returning standard JSON error structures.

---

## 8. Database Design

**Database:** MongoDB (via Mongoose)

- **Why?** Flexible schema is perfect for storing AI-generated JSON recipes which may vary slightly in structure.

**Collections:**

1.  **Users:** `_id, email, passwordHash, tier`
2.  **Recipes:** `_id, title, ingredients[], instructions[], nutrition{}, author_id`
    - _Indexes:_ `text` index on Title/Description for search. `author_id` for profile lookups.
3.  **PantryItems:** `_id, name, quantity, owner_id`
4.  **SavedRecipes:** `_id, user_id, recipe_id` (Junction table pattern).

**Consistency:** Eventual consistency is acceptable for recipe feeds; Strong consistency required for User/Auth.

---

## 9. API Documentation (Conceptual)

| Endpoint                | Method | Purpose                     | Auth?   |
| :---------------------- | :----- | :-------------------------- | :------ |
| `/api/auth/register`    | POST   | Create new user account     | No      |
| `/api/auth/login`       | POST   | Authenticate and set cookie | No      |
| `/api/recipes/generate` | POST   | AI Generation or DB Fetch   | **Yes** |
| `/api/recipes/suggest`  | POST   | Suggest based on pantry     | **Yes** |
| `/api/pantry-items`     | GET    | List user's ingredients     | **Yes** |
| `/api/pantry-items`     | POST   | Add item to pantry          | **Yes** |

**Response Format:**

```json
{
  "success": true,
  "data": { ... },
  "message": "Optional human readable status"
}
```

---

## 10. Authentication & Security

**Strategy:** Stateless JWT (JSON Web Tokens).

- **Storage:** `httpOnly`, `secure`, `SameSite=Strict` cookies. **NOT LocalStorage** (to prevent XSS).
- **Encryption:** `bcrypt` for password hashing (12 rounds).
- **Rate Limiting:** `Arcjet` middleware blocks bots and throttles aggressive IPs.
- **CORS:** Strict origin policy allowing only the frontend domain.

---

## 11. Third-Party Integrations

1.  **Google Gemini API:** Primary intelligence for recipe creation.
2.  **Arcjet:** Security as a Service (Bot detection).
3.  **Unsplash (via Custom Helper):** Fetches relevant food imagery based on recipe titles.
4.  **Zod:** Runtime schema validation for typesafety and AI response verification.

---

## 12. Performance Optimization

- **Frontend:**
  - Next.js Image Optimization (`<Image />`) for automatic resizing.
  - Code Splitting via Next.js App Router.
- **Backend:**
  - **DB Caching Pattern:** When generating a recipe, we first check if a recipe with that name already exists in MongoDB. If so, return it instantly (0 cost, <50ms latency).
- **Database:**
  - Compound indexes on common queries (`author` + `createdAt`).

---

## 13. Scalability Strategy

- **Horizontal Scaling:** The backend is stateless. We can run 10 instances of the Express server behind a load balancer without changes.
- **Database:** MongoDB Atlas manages sharding and replication.
- **AI Dependencies:** We use Gemini 2.5 Flash for high-speed reasoning and vision-based pantry scanning.

---

## 14. Deployment & DevOps

- **Frontend:** Vercel (Native Next.js support).
- **Backend:** Render / Railway / AWS EC2.
- **Environment Variables:** Strictly managed (`.env`) for keys.
- **CI/CD:** GitHub Actions (recommended) to run linting and tests before merge.

---

## 15. Testing Strategy

- **Unit:** Test utility functions (e.g., `normalizeTitle`).
- **Integration:** Test API endpoints with Postman/Jest (e.g., `/generate` handles DB hits correctly).
- **E2E:** Manual verify of critical flows (Signup -> Add Pantry Item -> Generate Recipe).

---

## 16. Error Handling & Logging

- **User Facing:** "Toast" notifications (Sonner) for nice feedback ("Recipe saved!", "Failed to generate").
- **Internal:** `console.error` in catch blocks on backend.
- **Global Handler:** Express middleware specifically catches all sync/async errors to prevent server process crashes.

---

## 17. Project Folder Structure

```
/
├── backend/            # Express API
│   ├── models/         # Database Schemas
│   ├── routes/         # Endpoint Definitions
│   ├── lib/            # AI Wrappers & Helpers
│   └── server.js       # Entry Point
├── frontend/           # Next.js App
│   ├── app/            # Pages & Routes
│   ├── components/     # React UI Components
│   └── lib/            # Frontend Utils
└── README.md           # Entry documentation
```

_Separation of Concerns:_ Backend handles logic/data, Frontend handles presentation.

---

## 18. Future Enhancements

- **Short Term:** Email notifications for weekly meal plans.
- **Mid Term:** Social sharing features (Community Feed).
- **Long Term:** Instacart integration to one-click buy missing ingredients.
- **AI:** Fine-tuned model specifically for dietary restrictions (Keto, Vegan).

---

## 19. Resume & Interview Talking Points

**How to explain this project:**

> "I built an AI-powered SaaS platform that orchestrates interactions between a Next.js frontend, an Express backend, and Google Gemini AI. Key challenges involved handling vision-based ingredient extraction, implementing robust prompt engineering, and designing a schema that normalizes unstructured AI output into queryable database records."

**Key Concepts Demonstrated:**

- Full-Stack Architecture (MERN/Next).
- Prompt Engineering & LLM Integration.
- Fallback/Resiliency Patterns.
- Secure Authentication.

---

## 20. Final Summary

The **AI Recipe Platform** is a sophisticated demonstration of modern web engineering. It goes beyond simple CRUD by integrating non-deterministic AI components into a reliable, structured user experience. It handles real-world complexity—rate limits, security, and performance—making it a portfolio piece that proves **production-readiness**.
