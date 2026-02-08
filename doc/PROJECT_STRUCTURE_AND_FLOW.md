# Project Topology & Data Flow: Servd AI Recipe Platform

This document serves as the master map for the project's physical structure and its logical data pathways.

---

## 1. Complete File Structure

Below is the full recursive structure of the project (excluding `node_modules`, `.next`, and build artifacts).

```text
ai-recipe-platform-master/
├── backend/
│   ├── lib/
│   │   ├── ai/                 # Modular AI Layer (Moved from Frontend)
│   │   │   ├── client.js       # Shared Gemini initialization
│   │   │   ├── image-service.js# Unsplash integration
│   │   │   └── prompts.js      # Clean storage for AI prompts
│   │   └── arcjet.js           # Arcjet Security Config
│   ├── middleware/
│   │   ├── auth.js             # JWT Verification logic
│   │   ├── rate-limit.js       # Arcjet Rate Limiting Middleware
│   │   └── validate.js         # Zod Schema Validation Middleware
│   ├── models/
│   │   ├── PantryItem.js       # Mongoose Schema: User ingredients
│   │   ├── Recipe.js           # Mongoose Schema: AI Generated Recipes
│   │   ├── SavedRecipe.js      # Mongoose Schema: User bookmarks
│   │   └── User.js             # Mongoose Schema: Auth & Profile
│   ├── routes/
│   │   ├── auth.js             # Endpoints: Login, Signup, Logout
│   │   ├── pantry.js           # Endpoints: Pantry CRUD & AI Scan
│   │   ├── recipes.js          # Endpoints: Recipe search, generation & suggestions
│   │   ├── saved-recipes.js    # Endpoints: User collections
│   │   └── users.js            # Endpoints: Profile management
│   ├── schemas/                # Zod Runtime Schemas
│   │   ├── auth.js
│   │   ├── pantry.js
│   │   └── recipe.js
│   ├── package.json
│   └── server.js               # Entry: DB Connection & Server Config
├── doc/
│   ├── ARCHITECTURE_AND_DESIGN.md
│   ├── INTERVIEW_QA_HINGLISH.md
│   ├── PROJECT_STRUCTURE_AND_FLOW.md
│   ├── SETUP_AND_REBUILD_GUIDE.md
│   └── stacks.md
├── frontend/
│   ├── actions/
│   │   ├── mealdb.actions.js   # External API integration logic
│   │   ├── pantry.actions.js   # Calls Backend API (formerly contained logic)
│   │   └── recipe.actions.js   # Calls Backend API (formerly contained logic)
│   ├── app/
│   │   ├── (auth)/             # Auth Route Group
│   │   │   ├── sign-in/
│   │   │   └── sign-up/
│   │   ├── (main)/             # Core Feature Group
│   │   │   ├── dashboard/      # User Home
│   │   │   ├── pantry/         # Ingredient Management
│   │   │   ├── recipe/         # Recipe View/Generator
│   │   │   └── recipes/        # Saved/Public Recipes
│   │   ├── globals.css         # Tailwind Root
│   │   ├── layout.js           # Root Layout & Auth Provider
│   │   └── page.js             # Landing Page
│   ├── components/
│   │   ├── ui/                 # shadcn/ui components (Radix + Tailwind)
│   │   ├── wrappers/           # Layout Context Wrappers
│   │   ├── Header.js           # Main Navigation
│   │   └── PricingSection.js   # Subscription UI
│   ├── lib/
│   │   ├── schemas/            # Zod Client-side Schemas
│   │   │   ├── auth.js
│   │   │   ├── pantry.js
│   │   │   └── recipe.js
│   │   ├── api.js              # Fetch Helper (fetchWithAuth)
│   │   ├── auth-context.js     # React Auth Context (Auth State)
│   │   ├── data.js             # Static configuration data
│   │   └── serverAuth.js       # Server-side auth helpers
│   ├── middleware.js           # Next.js Auth Middleware
│   ├── next.config.mjs
│   └── package.json
└── README.md
```

---

## 2. Core Data Flow Logic

### 🔄 Scenario: Pantry Scanning to Recipe Generation

The platform uses a "Thin Client, Heavy Server" model. The frontend handles UI and auth tokens, while the backend orchestrates AI processing and DB persistence.

```mermaid
graph TD
    A[User Uploads Image] --> B[Next.js Server Action]
    B --> C[Fetch /api/pantry-items/scan]
    C --> D[Express Backend Middleware]
    D --> E{Arcjet Rate Limit}
    E --> F{Gemini Vision API}
    F -->|Extracts| G[Ingredient List JSON]
    G --> H[Frontend: Show Ingredients]
    H --> I[User Confirms & Saves]
    I --> J[Fetch /api/pantry-items]
    J --> K[(MongoDB: PantryItems)]

    K --> L[User Requests Recipe]
    L --> M[Next.js Server Action]
    M --> N[Fetch /api/recipes/generate]
    N --> O[Express Backend]
    O --> P{Gemini 2.5 Flash API}
    P -->|Prompts| Q[Structured Recipe JSON]
    Q --> R{Unsplash API}
    R -->|Fetch Image| S[Complete Recipe Object]
    S --> T[(MongoDB: Recipes)]
    T --> U[Frontend: Render UI]
```

---

## 3. Communication Patterns

### **1. Authentication (JWT)**

- **Issuance**: Backend `POST /api/auth/login` sets a Secure, HttpOnly cookie named `token`.
- **Validation**: Every frontend request to the backend includes `credentials: 'include'` (via `fetchWithAuth`), which the Express `auth` middleware validates.

### **2. AI Security & Isolation**

- **Backend-Only AI**: To improve security and separation of concerns, **Google Generative AI** and **Unsplash** clients are initialized entirely within `backend/lib/ai/`.
- **No Keys on Client**: `GEMINI_API_KEY` and `UNSPLASH_ACCESS_KEY` effectively never leave the backend environment.
- **Rate Limiting**: **Arcjet** logic is implemented as Express middleware (`backend/middleware/rate-limit.js`), protecting expensive AI endpoints (`/scan`, `/suggest`) from abuse.

### **3. Data Synchronization**

- **Pure API Wrappers**: The frontend actions (`pantry.actions.js`, `recipe.actions.js`) are strictly wrappers. They handle the "Base64" conversion for images but delegate all logic (Validation, AI, DB) to the Express Backend.
- **Performance Patterns**:
  - **Web Worker PDF**: Generation logic uses `pdf-lib` inside `public/pdf-worker.js`, keeping the main thread free.
  - **Image UX**: `RecipeCard.jsx` implements animated pulse placeholders and fade-in transitions for all images.
- **Unified Fetch**: A `fetchWithAuth` helper in the frontend ensures consistent error handling and token passing for all requests.
