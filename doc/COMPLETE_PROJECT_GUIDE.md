# 🍳 Servd AI Recipe Platform - Complete Project Guide

> An intelligent culinary assistant that transforms your pantry ingredients into professional recipes using Google Gemini AI and Unsplash images.

**Last Updated:** February 03, 2026
**Project Status:** Active Development
**Stack:** Next.js 16.1.1, Express.js, MongoDB, Google Gemini 2.5 Flash, Unsplash API

---

## 📋 Table of Contents

1. [Project Overview](#project-overview)
2. [Core Features](#core-features)
3. [Technology Stack](#technology-stack)
4. [System Architecture](#system-architecture)
5. [Complete Data Flow](#complete-data-flow)
6. [Database Schema](#database-schema)
7. [API Reference](#api-reference)
8. [Frontend Structure](#frontend-structure)
9. [Backend Structure](#backend-structure)
10. [Authentication & Security](#authentication--security)
11. [Key Components & Workflows](#key-components--workflows)
12. [File Structure](#file-structure)

---

## 🎯 Project Overview

**Servd** is a modern AI-powered recipe platform that enables users to:

- **Photograph their pantry/fridge** and automatically identify ingredients using Gemini Vision
- **Generate professional recipes** based on descriptions or available ingredients
- **Discover meal combinations** from what they already have
- **Save favorite recipes** for future reference
- **Browse recipes** by cuisine and category
- **Access detailed nutritional information** for all generated recipes

### Mission

Reduce food waste, save money on groceries, and inspire creative cooking by making it easy to discover what meals users can create from existing pantry items.

### Target Users

- Home cooks looking for quick recipe ideas
- People trying to reduce food waste
- Busy professionals wanting inspiration without shopping
- Cooking enthusiasts interested in AI-powered suggestions

---

## ✨ Core Features

### 1. **AI Pantry Scanner**

- Users upload a photo of their refrigerator or pantry
- Google Gemini Vision analyzes the image
- System automatically extracts ingredient list with quantities
- Users can edit/confirm ingredients before saving
- All items are stored in their personal pantry inventory

**Key Benefits:**

- Saves time vs. manual ingredient input
- Recognizes various food types and quantities
- Supports multiple languages via Gemini

**Technology:** Google Gemini 2.5 Flash Vision API

### 2. **Smart Recipe Generation**

- Users describe what they want to cook (e.g., "spicy chicken pasta", "breakfast for 4")
- Gemini AI generates complete recipes with:
  - Ingredients with quantities
  - Step-by-step instructions
  - Cooking times (prep + cook)
  - Nutritional information
  - Chef tips & substitutions
- High-quality images automatically sourced from Unsplash

**Key Features:**

- 6-10 detailed, beginner-friendly steps
- Realistic cooking times
- Practical ingredient substitutions
- Full nutritional breakdown

**Technology:** Google Gemini 2.5 Flash, Unsplash API

### 3. **Recipe Suggestions from Pantry**

- System analyzes user's saved pantry items
- Generates 5 unique recipes they can cook RIGHT NOW
- Each suggestion shows:
  - Match percentage (how many ingredients they have)
  - Missing ingredients (if any)
  - Complete recipe details

**Example:**

```
Pantry: Tomatoes, Pasta, Garlic, Olive Oil, Basil
↓
Suggestions:
1. Pasta Pomodoro (98% match) - 2 missing items
2. Tomato Soup (85% match) - 4 missing items
```

### 4. **Recipe Collection & Bookmarks**

- Users save favorite generated recipes
- Personal recipe collection stored in MongoDB
- Browse saved recipes anytime
- Quick access to previously generated recipes

### 5. **Public Recipe Library**

- Browse recipes by cuisine (Italian, Indian, Chinese, etc.)
- Browse recipes by category (Breakfast, Lunch, Dinner, Snacks, Desserts)
- Full-text search across recipe titles and descriptions
- Filter by available ingredients

### 6. **Recipe Details & Export**

- View complete recipe information
- Step-by-step cooking instructions
- Nutritional facts per serving
- Cooking tips for each step
- Generate/download as PDF

---

## 🛠️ Technology Stack

### Frontend

```
Framework         Next.js 16.1.1 (App Router)
Language          JavaScript/JSX
UI Library        shadcn/ui (Radix UI + Tailwind CSS)
State Management  React Context API + useState
Styling           Tailwind CSS v4
Icons             Lucide React
Notifications     Sonner (Toast)
PDF Export        React PDF + pdf-lib
Image Upload      React Dropzone
HTTP Client       Native Fetch API
Auth              JWT (HTTP-Only Cookies)
Validation        Zod (Client-side Form Validation)
Web Workers       pdf-worker.js for background tasks
```

### Backend

```
Framework         Express.js 5.2.1
Language          Node.js / JavaScript
Database          MongoDB (via Mongoose 9.1)
ORM               Mongoose 9.1
Validation        Zod (Runtime Schema Validation)
Authentication    JWT (7-day expiration)
Password Hashing  Bcrypt
AI Model          Google Gemini 2.5 Flash
Image API         Unsplash
Security          Arcjet (WAF + Rate Limiting)
CORS              Enabled for frontend
```

### DevOps & Deployment

```
Package Manager   npm
Development       nodemon (backend), next dev (frontend)
Build Tool        Next.js build system
Environment Vars  .env files
```

---

## � Free External APIs Used in Dashboard

Your project leverages **3 major free external APIs** to power the dashboard and core features:

### 1. **The MealDB API** (Free Tier - Fully Free)

**Purpose:** Provides thousands of recipes for browsing by category and cuisine

**Location:** `frontend/actions/mealdb.actions.js`

#### Key Details:

```javascript
const MEALDB_BASE = "https://www.themealdb.com/api/json/v1/1";
```

#### Endpoints Used:

| Endpoint                   | Function               | Usage                                                       |
| -------------------------- | ---------------------- | ----------------------------------------------------------- |
| `/random.php`              | `getRecipeOfTheDay()`  | Get random recipe displayed on dashboard hero section       |
| `/list.php?c=list`         | `getCategories()`      | Fetch all meal categories (Breakfast, Lunch, Dessert, etc.) |
| `/list.php?a=list`         | `getAreas()`           | Fetch all cuisines/areas (Italian, Indian, Chinese, etc.)   |
| `/filter.php?c={category}` | `getMealsByCategory()` | Get recipes filtered by category                            |
| `/filter.php?a={area}`     | `getMealsByArea()`     | Get recipes filtered by cuisine/area                        |

#### Response Format:

```javascript
// getRecipeOfTheDay Response
{
  meals: [
    {
      idMeal: "52977",
      strMeal: "Corba",
      strDrinkAlternate: null,
      strCategory: "Seafood",
      strArea: "Turkish",
      strInstructions: "Place the olive oil in a large pot...",
      strMealThumb: "https://www.themealdb.com/images/media/meals/...",
      strTags: "Soup,Seafood",
      strYoutube: "https://www.youtube.com/...",
    },
  ];
}
```

#### Features:

- ✅ **Completely Free**: No API key required
- ✅ **No Rate Limiting**: Unlimited requests
- ✅ **No Authentication**: Open access
- ✅ **High Quality**: 1000+ recipes in database
- ✅ **Rich Data**: Includes instructions, images, categories, cuisines, tags
- ✅ **Open Source**: Maintained by free community

#### Caching Strategy:

```javascript
// Categories cached for 7 days (rarely change)
{
  next: {
    revalidate: 604800;
  }
}

// Recipes by category cached for 24 hours
{
  next: {
    revalidate: 86400;
  }
}

// Random recipe cached for 24 hours
{
  next: {
    revalidate: 86400;
  }
}
```

#### Usage in Your Dashboard:

```jsx
// In dashboard/page.jsx
const recipeData = await getRecipeOfTheDay(); // Hero section recipe
const categoriesData = await getCategories(); // Browse by category section
const areasData = await getAreas(); // Browse by cuisine section

// Then users can click to:
// → /recipes/category/breakfast
// → /recipes/cuisine/italian
```

#### Example Flow:

```
User visits Dashboard
      ↓
Frontend calls getRecipeOfTheDay()
      ↓
MealDB API returns random recipe (no auth needed!)
      ↓
Frontend displays in hero section with image
      ↓
User clicks category → /recipes/category/seafood
      ↓
Frontend calls getMealsByCategory("Seafood")
      ↓
MealDB returns all seafood recipes
      ↓
User browses, finds recipe, clicks to view details
```

#### Limitations:

- ❌ No pagination (all results returned)
- ❌ Limited filtering options (only by category or area)
- ❌ No full-text search capability
- ❌ Images served from their CDN (relies on their infrastructure)

---

### 2. **Google Gemini AI API** (Free Tier Available)

**Purpose:** Powers AI recipe generation, pantry image scanning, and recipe suggestions

**Location:** `backend/lib/ai/client.js`

#### Key Details:

```javascript
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const MODEL = "gemini-2.5-flash"; // Ultra-fast model
```

#### Pricing Tiers:

```
FREE TIER:
- 15 requests per minute
- Monthly limit: Varies by region
- Multimodal (text + vision): Supported
- JSON mode: Supported

PAID TIER:
- $0.075 per 1M input tokens
- $0.30 per 1M output tokens
```

#### Features Used:

| Feature             | Used For              | Cost               |
| ------------------- | --------------------- | ------------------ |
| **Vision API**      | Pantry image scanning | ~0.01¢ per image   |
| **Text Generation** | Recipe generation     | ~0.005¢ per recipe |
| **JSON Mode**       | Structured responses  | Included           |
| **System Prompts**  | Custom instructions   | Included           |

#### Integration Points:

**1. Pantry Scanning (Vision)**

```javascript
// POST /api/pantry-items/scan
const response = await getGeminiModel().generateContent({
  contents: [
    {
      role: "user",
      parts: [
        { text: PANTRY_SCAN_PROMPT },
        { inlineData: { mimeType: "image/jpeg", data: base64Image } },
      ],
    },
  ],
});

// Returns: [{ name: "Tomato", quantity: "3", confidence: 0.98 }, ...]
```

**2. Recipe Generation (Text)**

```javascript
// POST /api/recipes/generate
const response = await getGeminiModel().generateContent({
  contents: [
    {
      role: "user",
      parts: [{ text: RECIPE_GENERATION_PROMPT("Pasta Carbonara") }],
    },
  ],
});

// Returns: Full recipe JSON with ingredients, instructions, nutrition
```

**3. Recipe Suggestions (Text)**

```javascript
// GET /api/recipes/suggest
const response = await getGeminiModel().generateContent({
  contents: [
    {
      role: "user",
      parts: [{ text: INGREDIENT_RECIPE_SUGGESTIONS_PROMPT(pantryItems) }],
    },
  ],
});

// Returns: 5 recipe suggestions with match percentages
```

#### Prompt Engineering:

Your prompts are carefully crafted in `backend/lib/ai/prompts.js`:

```javascript
const RECIPE_GENERATION_PROMPT = (title) => `
You are a professional chef. Generate a detailed recipe for: "${title}"

CRITICAL: Return ONLY valid JSON (no markdown):
{
  "title": "...",
  "ingredients": [{ "item": "...", "amount": "...", "category": "..." }],
  "instructions": [{ "step": 1, "title": "...", "instruction": "...", "tip": "..." }],
  "nutrition": { "calories": ..., "protein": "..." },
  "category": "breakfast|lunch|dinner|snack|dessert",
  "cuisine": "italian|chinese|...",
  ...
}
`;
```

#### Rate Limiting (Arcjet):

```javascript
// Protects endpoints to respect free tier limits
POST / api / recipes / generate; // 10 req/min max
POST / api / pantry - items / scan; // 5 req/min max
GET / api / recipes / suggest; // 10 req/min max
```

#### Cost Analysis:

For 1000 monthly active users:

```
Assuming:
- 2 recipe generations per user/month
- 1 pantry scan per user/month
- 1 suggestion request per user/month

Total requests: 4,000/month
Estimated cost: ~$0.40-$1.20/month

→ FREE TIER covers this easily!
```

---

### 3. **Unsplash API** (Free Tier)

**Purpose:** Fetches high-quality food/recipe images to display with generated recipes

**Location:** `backend/lib/ai/image-service.js`

#### Key Details:

```javascript
const UNSPLASH_ACCESS_KEY = process.env.UNSPLASH_ACCESS_KEY;
const API_BASE = "https://api.unsplash.com/search/photos";
```

#### Pricing:

```
FREE TIER:
- 50 requests per hour
- 10,000 requests per month
- No payment required

PAID TIER:
- $49.99/month for 5000 additional requests
```

#### API Endpoint Used:

```
GET https://api.unsplash.com/search/photos
  ?query={recipeName}
  &per_page=1
  &orientation=landscape
  &Authorization: Client-ID {key}
```

#### Integration in Recipe Generation:

```javascript
// In backend/routes/recipes.js
async function generateRecipe(recipeName) {
  // 1. Generate with Gemini
  const recipeJSON = await getGeminiModel().generateContent(...);

  // 2. Fetch image from Unsplash
  const imageUrl = await fetchRecipeImage(recipeName);

  // 3. Attach image to recipe
  recipeJSON.imageUrl = imageUrl;

  // 4. Save to database
  await Recipe.create(recipeJSON);

  return recipeJSON;
}
```

#### Search Logic:

```javascript
async function fetchRecipeImage(recipeName) {
  // Search for high-quality landscape images
  const response = await fetch(
    `https://api.unsplash.com/search/photos?query=${encodeURIComponent(
      recipeName,
    )}&per_page=1&orientation=landscape`,
    {
      headers: {
        Authorization: `Client-ID ${UNSPLASH_ACCESS_KEY}`,
      },
    },
  );

  if (!response.ok) return ""; // Graceful fallback

  const data = await response.json();
  return data.results?.[0]?.urls?.regular || "";
}
```

#### Image URLs Returned:

Unsplash returns multiple image sizes:

```javascript
{
  urls: {
    raw: "https://images.unsplash.com/...",    // Full resolution
    full: "https://images.unsplash.com/...",   // 1600px wide
    regular: "https://images.unsplash.com/...", // 1080px wide ← USED
    small: "https://images.unsplash.com/...",  // 400px wide
    thumb: "https://images.unsplash.com/...",  // 200px wide
  }
}
```

#### Usage in Your Project:

1. **Recipe Generation Page**
   - User generates recipe → Image shown immediately
   - Displays author attribution to Unsplash

2. **Dashboard**
   - MealDB recipe cards use MealDB images
   - AI recipes use Unsplash images
   - Side-by-side visual browsing

3. **Saved Recipes**
   - Images cached in MongoDB
   - Unsplash URLs referenced directly

#### Frontend Configuration:

```javascript
// In next.config.mjs
module.exports = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com", // ← Allow Unsplash CDN
      },
      {
        protocol: "https",
        hostname: "www.themealdb.com", // ← Allow MealDB CDN
      },
    ],
  },
};
```

#### Rate Limiting:

```
50 requests/hour = 1,200 requests/day

For 1000 users generating 1-2 recipes/month:
- ~2,000 requests/month needed
- Free tier comfortably covers this!
```

#### Fallback Strategy:

```javascript
// If Unsplash API fails/hits rate limit
if (!imageUrl) {
  // Still save recipe without image
  // User can view recipe details
  // Image will display as placeholder
}
```

---

## 📊 External APIs Summary Table

| API          | Purpose         | Free Tier                 | Rate Limit  | Auth Required | Used For                       |
| ------------ | --------------- | ------------------------- | ----------- | ------------- | ------------------------------ |
| **MealDB**   | Recipe database | ✅ Fully Free             | Unlimited   | ❌ None       | Dashboard, Browse, Categories  |
| **Gemini**   | AI generation   | ✅ Free Tier (15 req/min) | 15 req/min  | ✅ API Key    | Recipe generation, Pantry scan |
| **Unsplash** | Images          | ✅ Free Tier (50 req/hr)  | 50 req/hour | ✅ API Key    | Recipe images                  |

---

## 💰 Cost Breakdown (For Free Tier)

### Current Monthly Costs:

```
MealDB API:      $0 (completely free)
Gemini API:      ~$0.30-$0.50 (free tier covers)
Unsplash API:    $0 (free tier covers)
MongoDB Atlas:   ~$0 (free tier: 512MB)
Vercel Frontend: $0 (free tier)
--------
TOTAL:           ~$0.30-$0.50/month!
```

### When to Upgrade:

```
If monthly users exceed 10,000:
→ Might hit Gemini free tier (depends on usage)
→ Might hit Unsplash free tier (50 req/hr = ~1,200/day)

Upgrade costs would be:
- Gemini: $0.075 per 1M input tokens (cheap!)
- Unsplash: $49.99/month for extra 5,000 requests
- Hosted database: ~$10-50/month depending on size
```

---

## 🔌 How These APIs Work Together

```
USER FLOW WITH EXTERNAL APIS:
┌─────────────────────────────────────────────────────────┐
│                    USER BROWSER                         │
└─────────────┬───────────────────────────────────────────┘
              │
              ▼
    ┌─────────────────────┐
    │ VISIT DASHBOARD     │
    └─────────┬───────────┘
              │
              ├─→ getRecipeOfTheDay()           ← MealDB Free API
              │   (No auth needed!)
              │
              ├─→ getCategories()                ← MealDB Free API
              │   (Fetch breakfast, lunch, etc.)
              │
              └─→ getAreas()                     ← MealDB Free API
                  (Fetch italian, chinese, etc.)
              │
              ▼
    ┌─────────────────────────────────────────┐
    │ GENERATE CUSTOM RECIPE                  │
    │ "Spicy Pasta Carbonara"                 │
    └─────────────────────┬───────────────────┘
              │
              ├─→ Gemini API                     ← Requires API Key
              │   (Generates recipe JSON)
              │
              ├─→ Unsplash API                   ← Requires API Key
              │   (Fetches "Pasta Carbonara" image)
              │
              └─→ MongoDB                        ← Requires credentials
                  (Saves recipe with image URL)
              │
              ▼
    ┌──────────────────────────────────────────┐
    │ SCAN PANTRY IMAGE                        │
    │ (Take photo of fridge)                   │
    └─────────────────────┬────────────────────┘
              │
              ├─→ Gemini Vision API              ← Requires API Key
              │   (Analyze image, extract ingredients)
              │
              └─→ MongoDB                        ← Requires credentials
                  (Save pantry items)
              │
              ▼
    ┌──────────────────────────────────────────┐
    │ SUGGEST RECIPES                          │
    │ (Based on pantry items)                  │
    └─────────────────────┬────────────────────┘
              │
              ├─→ MongoDB                        ← Fetch user pantry
              │   (Get saved ingredients)
              │
              ├─→ Gemini API                     ← Requires API Key
              │   (Generate 5 recipe suggestions)
              │
              ├─→ Unsplash API × 5               ← Requires API Key
              │   (Fetch images for each)
              │
              └─→ Display to User
                  (Match %, missing ingredients)
```

---

## 🔐 API Security Best Practices

### Your Implementation:

✅ **API Keys in Environment Variables**

```javascript
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const UNSPLASH_ACCESS_KEY = process.env.UNSPLASH_ACCESS_KEY;
```

✅ **Backend-Only API Calls**

- Frontend → Next.js Server Actions → Express Backend → External APIs
- API keys never exposed to browser

✅ **Error Handling**

```javascript
if (!UNSPLASH_ACCESS_KEY) {
  console.warn("⚠️ UNSPLASH_ACCESS_KEY not set, skipping image fetch");
  return ""; // Graceful degradation
}
```

✅ **Rate Limiting with Arcjet**

```javascript
// Protects against excessive API calls
POST /api/recipes/generate    → 10 req/min
GET /api/recipes/suggest      → 10 req/min
```

---

## 📝 Configuration for Free APIs

### .env File Setup:

```bash
# Google Gemini (get at https://ai.google.dev)
GEMINI_API_KEY=AIzaSyD1234567890...

# Unsplash (get at https://unsplash.com/developers)
UNSPLASH_ACCESS_KEY=abc123def456...

# MealDB
# (No key needed - completely free!)
```

### Getting API Keys:

**1. Google Gemini:**

- Visit: https://ai.google.dev
- Click "Get API Key"
- Free tier: 15 requests/minute
- No credit card needed

**2. Unsplash:**

- Visit: https://unsplash.com/developers
- Register app
- Get Client ID
- Free tier: 50 requests/hour

**3. MealDB:**

- No registration needed!
- Just call: https://www.themealdb.com/api/json/v1/1
- Completely free, unlimited

---

## ✅ Advantages of Free APIs

```
✅ Zero upfront costs
✅ No payment method required
✅ Full feature access (for free tier)
✅ Community maintained (MealDB)
✅ Enterprise-grade (Google Gemini)
✅ High-quality images (Unsplash)
✅ Generous rate limits
✅ No strings attached
```

---

## ⚠️ Limitations to Be Aware Of

```
MealDB:
  ❌ Limited filtering options
  ❌ No free text search
  ❌ No pagination (all results)
  ❌ Outdated recipes sometimes

Gemini Free Tier:
  ❌ 15 requests/minute limit
  ❌ Monthly quota varies by region
  ❌ Slightly slower than paid

Unsplash Free Tier:
  ❌ 50 requests/hour limit
  ❌ Must provide attribution
  ❌ Limited to landscape orientation
```

---

## 🚀 Scaling Beyond Free Tiers

When your app grows, consider:

```
1. Paid Gemini: $0.075/1M input tokens
2. Unsplash Pro: $49.99/month (unlimited requests)
3. MongoDB Atlas Paid: $10-50+/month (depending on size)
4. Custom recipe database: Self-hosted for complete control
```

---

## �🏗️ System Architecture

### High-Level Overview

```
┌─────────────────────────────────────────────────────────┐
│                    USER BROWSER                         │
│  (Next.js Frontend + React Components)                  │
└────────────────┬────────────────────────────────────────┘
                 │
                 │ HTTPS + JWT Auth
                 │ (HTTP-Only Cookies)
                 ▼
┌─────────────────────────────────────────────────────────┐
│              EXPRESS BACKEND (Port 1337)                │
│  ┌──────────────┬──────────────┬──────────────┐         │
│  │  Auth Routes │ Recipe Routes│ Pantry Routes│         │
│  └──────────────┴──────────────┴──────────────┘         │
│  ┌──────────────┬──────────────────────────────┐        │
│  │ JWT Verify   │ Rate Limiting (Arcjet)      │        │
│  │ Password Hash│ Security Scanning            │        │
│  └──────────────┴──────────────────────────────┘        │
└────────┬─────────────┬──────────────┬─────────────────┘
         │             │              │
         ▼             ▼              ▼
    ┌─────────┐  ┌──────────┐  ┌─────────────┐
    │ MongoDB │  │  Google  │  │  Unsplash   │
    │         │  │ Gemini   │  │   API       │
    │ Users   │  │   AI     │  │             │
    │ Recipes │  │ (Vision  │  │ (Images)    │
    │ Pantry  │  │  & Text) │  │             │
    └─────────┘  └──────────┘  └─────────────┘
```

### Architectural Patterns

#### **1. Layered Backend Architecture**

```
Layer 1: Entry Point (server.js)
  ↓ Sets up middleware, connects to DB

Layer 2: Routes (auth.js, recipes.js, etc.)
  ↓ Maps HTTP endpoints to logic

Layer 3: Middleware (auth.js, rate-limit.js)
  ↓ Intercepts requests for validation

Layer 4:- `models/`: Mongoose schemas.
- `schemas/`: Zod validation schemas.
- `controllers/` (Implicit in routes): Logic handling.
- `middleware/`: Cross-cutting concerns (Auth, Rate Limit, Validation).
  ↓ Encapsulates external API logic

#### **2. Frontend Architecture**

```

Next.js App Router (File-based routing)
├── Server Components (Static pages)
├── Client Components (Interactive UI)
├── Server Actions (Thin wrappers to Backend API)
└── Components (Reusable UI pieces)

State Management:

- AuthContext (Global user state)
- useState (Local component state)
- Server Actions (API call orchestration)

```

#### **3. Data Flow Pattern: "Thin Client, Heavy Backend"**

```

User Action (UI Click)
↓
Next.js Server Action
↓
fetchWithAuth (Adds JWT token)
↓
Express Backend Route
↓
Auth Middleware (Validates JWT)
↓
Rate Limit Middleware (Arcjet)
↓
Business Logic (AI/DB operations)
↓
MongoDB Query/Save
↓
Response (Wrapped in { data: ... })
↓
Frontend Renders Result

````

---

## 🔄 Complete Data Flow

### Flow 1: User Registration & Login

```mermaid
┌──────────────────────────────────────────────────────────┐
│ SIGNUP FLOW                                              │
└──────────────────────────────────────────────────────────┘

User enters: Email + Password
        ↓
Frontend Form Submission
        ↓
POST /api/auth/signup
        ↓
Backend validates:
  - Email format
  - Password length (min 8 chars)
  - Email uniqueness
        ↓
Hash password with bcrypt (salt rounds: 10)
        ↓
Create User document in MongoDB
        ↓
Generate JWT Token (7-day expiration)
        ↓
Set HTTP-Only Secure Cookie
        ↓
Return User data (password excluded)
        ↓
Frontend stores auth state in AuthContext
        ↓
Redirect to Dashboard
````

**Login Flow:**

```
User enters: Email + Password
        ↓
POST /api/auth/login
        ↓
Find user by email
        ↓
Compare password with bcrypt
        ↓
Generate new JWT (if password matches)
        ↓
Set HTTP-Only Cookie
        ↓
Return success
```

### Flow 2: Pantry Scanning

```
┌──────────────────────────────────────────────────────────┐
│ PANTRY SCAN FLOW (Image → Ingredients)                  │
└──────────────────────────────────────────────────────────┘

User clicks: "Scan Pantry"
        ↓
Upload image (JPG/PNG)
        ↓
Frontend converts image to Base64
        ↓
POST /api/pantry-items/scan
  - Includes: Base64 image + JWT token
        ↓
Backend Auth Middleware ✓ Validates JWT
        ↓
Backend Rate Limit Middleware ✓ Checks Arcjet quota
        ↓
Send image to Google Gemini Vision API
  - Prompt: "Identify food ingredients in this image"
        ↓
Gemini returns JSON:
  [
    { name: "Tomato", quantity: "3 items", confidence: 0.95 },
    { name: "Pasta", quantity: "1 box", confidence: 0.98 },
    { name: "Olive Oil", quantity: "500ml", confidence: 0.92 }
  ]
        ↓
Frontend displays ingredient list for user confirmation
        ↓
User edits quantities (optional)
        ↓
User clicks "Save All"
        ↓
Frontend calls: POST /api/pantry-items (one request per ingredient)
        ↓
Each ingredient saved to MongoDB:
  {
    name: "Tomato",
    quantity: "3 items",
    owner: userId,
    createdAt: timestamp
  }
        ↓
Show success toast: "Saved 3 items to your pantry!"
        ↓
Update pantry list UI
```

### Flow 3: Recipe Generation

```
┌──────────────────────────────────────────────────────────┐
│ RECIPE GENERATION FLOW                                  │
└──────────────────────────────────────────────────────────┘

User enters: "Spicy Pasta Carbonara"
        ↓
POST /api/recipes/generate
        ↓
Backend Auth ✓ validates JWT
        ↓
Backend Rate Limit ✓ checks quota
        ↓
Normalize title: "Spicy Pasta Carbonara"
        ↓
Send to Google Gemini with RECIPE_GENERATION_PROMPT:
  - Includes title
  - Specifies JSON structure
  - Lists allowed categories and cuisines
        ↓
Gemini returns structured JSON:
  {
    title: "Spicy Pasta Carbonara",
    description: "...",
    category: "lunch",
    cuisine: "italian",
    ingredients: [...],
    instructions: [...],
    nutrition: { calories, protein, carbs, fat },
    tips: [...],
    servings: 4,
    prepTime: 10,
    cookTime: 20
  }
        ↓
Call Unsplash API with search term "Spicy Pasta Carbonara"
        ↓
Get high-quality image URL
        ↓
Attach imageUrl to recipe JSON
        ↓
Save recipe to MongoDB:
  {
    title, description, ingredients, instructions,
    imageUrl, author: userId, createdAt
  }
        ↓
Return complete recipe to frontend
        ↓
Frontend displays recipe card with:
  - Title & description
  - Cooking times & servings
  - Ingredient list
  - Step-by-step instructions
  - Nutrition facts
  - Chef tips
```

### Flow 4: Get Recipe Suggestions from Pantry

```
┌──────────────────────────────────────────────────────────┐
│ PANTRY-BASED RECIPE SUGGESTIONS                         │
└──────────────────────────────────────────────────────────┘

User clicks: "Suggest Recipes"
        ↓
GET /api/recipes/suggest
        ↓
Backend fetches all pantry items for user:
  [Tomato, Pasta, Garlic, Olive Oil, Basil]
        ↓
Send to Gemini with INGREDIENT_RECIPE_SUGGESTIONS_PROMPT:
  - Ingredient list
  - Request: 5 recipes
  - Must include match percentage
  - Note missing ingredients
        ↓
Gemini analyzes ingredients and generates:
  [
    {
      title: "Pasta Pomodoro",
      matchPercentage: 98,
      missingIngredients: ["Parmesan", "Fresh Basil"],
      ingredients: [...],
      instructions: [...]
    },
    {
      title: "Tomato Soup",
      matchPercentage: 85,
      missingIngredients: ["Cream", "Stock"],
      ...
    },
    ... 3 more recipes
  ]
        ↓
For each recipe, fetch image from Unsplash
        ↓
Frontend displays 5 recipe cards with:
  - Match percentage indicator
  - Missing ingredients list
  - Full recipe details
        ↓
User can click recipe to view full details
        ↓
User can save recipe to collection
```

### Flow 5: Save & Manage Recipes

```
┌──────────────────────────────────────────────────────────┐
│ SAVE RECIPE TO COLLECTION                               │
└──────────────────────────────────────────────────────────┘

User clicks: Heart icon on recipe card
        ↓
Check if recipe already saved:
  GET /api/saved-recipes?filters[recipe][id][$eq]=recipeId
        ↓
If not already saved:
  POST /api/saved-recipes
  Body: { data: { recipe: recipeId, savedAt: timestamp } }
        ↓
Backend creates SavedRecipe document:
  {
    user: userId,
    recipe: recipeId,
    savedAt: timestamp,
    createdAt, updatedAt
  }
        ↓
Show success toast: "Recipe saved!"
        ↓
Update heart icon to "filled"

┌──────────────────────────────────────────────────────────┐
│ VIEW SAVED RECIPES                                       │
└──────────────────────────────────────────────────────────┘

User navigates to: /recipes (saved collection)
        ↓
GET /api/saved-recipes
        ↓
Backend:
  - Filters by current user (req.userId)
  - Populates full recipe details
  - Sorts by savedAt (newest first)
        ↓
Returns array of recipes
        ↓
Frontend renders recipe grid
```

---

## 🗄️ Database Schema

### MongoDB Collections Structure

```
┌─────────────────────────────────────────┐
│         DATABASE RELATIONSHIPS          │
└─────────────────────────────────────────┘

User (1) ──→ (Many) PantryItem
  |
  ├──→ (Many) Recipe (as author)
  |
  └──→ (Many) SavedRecipe ──→ (Many) Recipe
```

### 1. **Users Collection**

```javascript
{
  _id: ObjectId,
  email: "user@example.com",              // Unique, required
  password: "$2b$10$hashed...",           // Bcrypt hashed
  username: "john_doe",                   // Optional
  firstName: "John",                      // Optional
  lastName: "Doe",                        // Optional
  imageUrl: "https://...",                // Profile picture
  subscriptionTier: "free" | "pro",       // Default: "free"
  createdAt: ISODate("2024-01-15T..."),
  updatedAt: ISODate("2024-01-15T...")
}
```

**Indexes:**

- Unique Index on `email` (Fast lookups, prevents duplicates)

**Virtual Fields:**

- `id` → Returns `_id` for REST API compatibility

### 2. **Recipes Collection**

```javascript
{
  _id: ObjectId,
  title: "Spicy Pasta Carbonara",          // Required
  description: "A classic Italian...",    // Optional
  category: "lunch",                      // breakfast|lunch|dinner|snack|dessert
  cuisine: "italian",                     // Italian|Chinese|Mexican|Indian|etc.
  imageUrl: "https://unsplash.com/...",
  isPublic: true,                         // Default: true

  // Cooking Info
  prepTime: 10,                           // Minutes
  cookTime: 20,                           // Minutes
  servings: 4,                            // Number of servings

  // Complex Data (Arrays of Objects)
  ingredients: [
    {
      item: "Pasta",
      amount: "400g",
      category: "Grain"
    },
    {
      item: "Eggs",
      amount: "3",
      category: "Protein"
    },
    ...
  ],

  instructions: [
    {
      step: 1,
      title: "Boil pasta",
      instruction: "Bring salted water to boil...",
      tip: "Use good quality pasta"
    },
    {
      step: 2,
      title: "Prepare sauce",
      instruction: "Mix eggs with Parmesan...",
      tip: "Use room temperature eggs"
    },
    ...
  ],

  nutrition: {
    calories: 450,
    protein: "25g",
    carbs: "55g",
    fat: "18g"
  },

  tips: [
    "Add pasta water to sauce for creaminess",
    "Cook on medium heat to avoid scrambled eggs",
    "Serve immediately while hot"
  ],

  substitutions: [
    {
      original: "Eggs",
      alternatives: ["Egg substitute", "Cashew cream"]
    },
    ...
  ],

  author: ObjectId(userId),                // Reference to User
  createdAt: ISODate("2024-01-15T..."),
  updatedAt: ISODate("2024-01-15T...")
}
```

**Indexes:**

- Compound Index: `{ author: 1, createdAt: -1 }` (User's recipes, sorted by date)
- Text Index: `{ title: "text", description: "text" }` (Full-text search)
- Regular Index: `{ createdAt: -1 }` (Global feed sorting)

### 3. **PantryItems Collection**

```javascript
{
  _id: ObjectId,
  name: "Tomato",                         // Required (e.g., "Cherry Tomato")
  quantity: "3 items",                    // e.g., "500g", "1 cup", "3 pieces"
  imageUrl: "https://...",                // Optional, specific item photo
  owner: ObjectId(userId),                // Reference to User (Required)
  createdAt: ISODate("2024-01-15T..."),
  updatedAt: ISODate("2024-01-15T...")
}
```

**Indexes:**

- Index on `owner` (Fast lookups of user's pantry)

### 4. **SavedRecipes Collection** (Junction Table)

```javascript
{
  _id: ObjectId,
  user: ObjectId(userId),                 // Reference to User
  recipe: ObjectId(recipeId),             // Reference to Recipe
  savedAt: ISODate("2024-01-15T10:30:00"),
  createdAt: ISODate("2024-01-15T..."),
  updatedAt: ISODate("2024-01-15T...")
}
```

**Indexes:**

- Index on `user` (Fast lookups of user's saved recipes)
- Compound Index: `{ user: 1, recipe: 1 }` (Prevent duplicates)

---

## 📡 API Reference

### Base URL

```
http://localhost:1337/api
```

### Response Format

All successful responses are wrapped in a data envelope:

```json
{
  "data": {} or []
}
```

Error responses:

```json
{
  "error": "Error message"
}
```

---

### **Authentication Routes**

#### 1. POST `/auth/signup`

Creates a new user account.

**Request:**

```json
{
  "email": "user@example.com",
  "password": "securePassword123",
  "firstName": "John",
  "lastName": "Doe",
  "username": "johndoe"
}
```

**Response (201):**

```json
{
  "data": {
    "id": "507f1f77bcf86cd799439011",
    "email": "user@example.com",
    "username": "johndoe",
    "firstName": "John",
    "lastName": "Doe",
    "subscriptionTier": "free",
    "createdAt": "2024-01-15T10:30:00Z"
  }
}
```

**Errors:**

- `400`: Email and password required
- `400`: Password must be at least 8 characters
- `400`: Email already registered

---

#### 2. POST `/auth/login`

Authenticates user and sets JWT cookie.

**Request:**

```json
{
  "email": "user@example.com",
  "password": "securePassword123"
}
```

**Response (200):**

```json
{
  "data": {
    "id": "507f1f77bcf86cd799439011",
    "email": "user@example.com"
  }
}
```

**Headers Set:**

- `Set-Cookie: token=<JWT>; HttpOnly; Secure; SameSite=Strict`

**Errors:**

- `400`: Email and password required
- `401`: Invalid email or password

---

#### 3. POST `/auth/logout`

Clears authentication cookie.

**Response (200):**

```json
{
  "message": "Logged out successfully"
}
```

---

### **Recipe Routes** (Protected - requires Auth)

#### 1. GET `/recipes`

Search recipes by title.

**Query Parameters:**

```
?filters[title][$eqi]=pasta
```

**Response:**

```json
{
  "data": [
    {
      "id": "507f1f77bcf86cd799439012",
      "title": "Pasta Carbonara",
      "description": "...",
      "cuisine": "italian",
      "category": "lunch",
      "imageUrl": "...",
      "prepTime": 10,
      "cookTime": 15,
      "servings": 4
    }
  ]
}
```

---

#### 2. POST `/recipes`

Save a generated recipe to database.

**Request:**

```json
{
  "data": {
    "title": "Spicy Pasta Carbonara",
    "description": "...",
    "category": "lunch",
    "cuisine": "italian",
    "ingredients": [...],
    "instructions": [...],
    "nutrition": {...},
    "imageUrl": "..."
  }
}
```

**Response (201):**

```json
{
  "data": {
    "id": "507f1f77bcf86cd799439012",
    "title": "Spicy Pasta Carbonara",
    "author": "507f1f77bcf86cd799439011",
    "createdAt": "2024-01-15T10:30:00Z"
  }
}
```

---

#### 3. POST `/recipes/generate`

Generate a recipe using AI.

**Request:**

```json
{
  "recipeName": "Spicy Chicken Tikka"
}
```

**Response (200):**

```json
{
  "data": {
    "title": "Spicy Chicken Tikka",
    "description": "...",
    "category": "lunch",
    "cuisine": "indian",
    "ingredients": [
      {
        "item": "Chicken breast",
        "amount": "500g",
        "category": "Protein"
      }
    ],
    "instructions": [...],
    "nutrition": {...},
    "tips": [...],
    "imageUrl": "https://unsplash.com/...",
    "prepTime": 15,
    "cookTime": 20,
    "servings": 2
  }
}
```

**Rate Limiting:** Yes (Arcjet)
**Time:** 10-20 seconds (includes Gemini + Unsplash calls)

---

#### 4. GET `/recipes/suggest`

Get recipe suggestions based on pantry items.

**Response (200):**

```json
{
  "data": [
    {
      "title": "Pasta Pomodoro",
      "description": "...",
      "matchPercentage": 98,
      "missingIngredients": ["Basil"],
      "ingredients": [...],
      "instructions": [...],
      "imageUrl": "..."
    },
    {
      "title": "Tomato Soup",
      "matchPercentage": 85,
      "missingIngredients": ["Cream", "Stock"]
    }
  ]
}
```

**Rate Limiting:** Yes (Arcjet)

---

### **Pantry Routes** (Protected - Auth Required)

#### 1. GET `/pantry-items`

Retrieve all pantry items for logged-in user.

**Response:**

```json
{
  "data": [
    {
      "id": "507f1f77bcf86cd799439013",
      "name": "Tomato",
      "quantity": "3 items",
      "createdAt": "2024-01-15T10:30:00Z"
    },
    {
      "id": "507f1f77bcf86cd799439014",
      "name": "Pasta",
      "quantity": "1 box",
      "createdAt": "2024-01-15T10:31:00Z"
    }
  ]
}
```

---

#### 2. POST `/pantry-items`

Add a new pantry item manually.

**Request:**

```json
{
  "data": {
    "name": "Tomato",
    "quantity": "3 items"
  }
}
```

**Response (201):**

```json
{
  "data": {
    "id": "507f1f77bcf86cd799439013",
    "name": "Tomato",
    "quantity": "3 items",
    "owner": "507f1f77bcf86cd799439011",
    "createdAt": "2024-01-15T10:30:00Z"
  }
}
```

---

#### 3. POST `/pantry-items/scan`

Scan pantry image with Gemini Vision.

**Request:**

```json
{
  "image": "data:image/jpeg;base64,/9j/4AAQSkZJRg..."
}
```

**Response (200):**

```json
{
  "data": [
    {
      "name": "Tomato",
      "quantity": "3 items",
      "confidence": 0.98
    },
    {
      "name": "Pasta",
      "quantity": "1 box",
      "confidence": 0.95
    },
    {
      "name": "Olive Oil",
      "quantity": "500ml",
      "confidence": 0.92
    }
  ]
}
```

**Rate Limiting:** Yes (Arcjet) - Heavy AI operation

---

#### 4. PUT `/pantry-items/:id`

Update a pantry item.

**Request:**

```json
{
  "data": {
    "quantity": "5 items"
  }
}
```

**Response (200):**

```json
{
  "data": {
    "id": "507f1f77bcf86cd799439013",
    "name": "Tomato",
    "quantity": "5 items"
  }
}
```

---

#### 5. DELETE `/pantry-items/:id`

Delete a pantry item.

**Response (200):**

```json
{
  "message": "Item deleted successfully"
}
```

---

### **Saved Recipes Routes** (Protected)

#### 1. GET `/saved-recipes`

Get all recipes saved by user.

**Query:**

```
?filters[recipe][id][$eq]=507f1f77bcf86cd799439012
```

**Response:**

```json
{
  "data": [
    {
      "id": "507f1f77bcf86cd799439020",
      "recipe": {
        "id": "507f1f77bcf86cd799439012",
        "title": "Pasta Carbonara",
        "description": "...",
        "imageUrl": "..."
      },
      "savedAt": "2024-01-15T10:35:00Z"
    }
  ]
}
```

---

#### 2. POST `/saved-recipes`

Save a recipe to user's collection.

**Request:**

```json
{
  "data": {
    "recipe": "507f1f77bcf86cd799439012",
    "savedAt": "2024-01-15T10:35:00Z"
  }
}
```

**Response (201):**

```json
{
  "data": {
    "id": "507f1f77bcf86cd799439020",
    "user": "507f1f77bcf86cd799439011",
    "recipe": "507f1f77bcf86cd799439012",
    "savedAt": "2024-01-15T10:35:00Z"
  }
}
```

---

#### 3. DELETE `/saved-recipes/:id`

Remove recipe from collection.

**Response (200):**

```json
{
  "message": "Recipe removed from collection"
}
```

---

### **User Routes** (Protected)

#### 1. GET `/users/me`

Get current logged-in user profile.

**Response:**

```json
{
  "data": {
    "id": "507f1f77bcf86cd799439011",
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "subscriptionTier": "free"
  }
}
```

---

#### 2. PUT `/users/:id`

Update user profile.

**Request:**

```json
{
  "data": {
    "firstName": "Johnny",
    "imageUrl": "https://..."
  }
}
```

**Response:**

```json
{
  "data": {
    "id": "507f1f77bcf86cd799439011",
    "firstName": "Johnny"
  }
}
```

---

## 🎨 Frontend Structure

### Directory Overview

```
frontend/
├── actions/                          # Next.js Server Actions
│   ├── recipe.actions.js             # Recipe generation, saving, deletion
│   ├── pantry.actions.js             # Pantry scanning, CRUD operations
│   └── mealdb.actions.js             # External MealDB API calls
│
├── app/                              # Next.js App Router
│   ├── layout.js                     # Root layout, AuthProvider
│   ├── page.jsx                      # Landing page
│   ├── globals.css                   # Tailwind + global styles
│   │
│   ├── (auth)/                       # Auth route group
│   │   ├── layout.js                 # Auth page layout
│   │   ├── sign-in/[[...sign-in]]/   # Sign-in page (custom JWT auth)
│   │   └── sign-up/[[...sign-up]]/   # Sign-up page (custom JWT auth)
│   │
│   └── (main)/                       # Main app route group
│       ├── layout.jsx                # Main app layout with nav
│       ├── dashboard/page.jsx        # User dashboard/home
│       ├── pantry/page.jsx           # Pantry management
│       ├── recipe/page.jsx           # Recipe view/cook mode
│       ├── recipes/page.jsx          # Saved recipes collection
│       ├── recipes/category/[category]/page.jsx
│       └── recipes/cuisine/[cuisine]/page.jsx
│
├── components/                       # Reusable React components
│   ├── ui/                           # shadcn/ui components
│   │   ├── avatar.jsx
│   │   ├── badge.jsx
│   │   ├── button.jsx
│   │   ├── card.jsx
│   │   ├── dialog.jsx
│   │   ├── dropdown-menu.jsx
│   │   ├── input.jsx
│   │   ├── tabs.jsx
│   │   └── sonner.jsx               # Toast notifications
│   │
│   ├── wrappers/                     # Layout wrappers
│   │   └── ClientLayout.jsx          # Sticky header/footer wrapper
│   │
│   ├── Header.jsx                    # Navigation header with user menu
│   ├── RecipeCard.jsx                # Recipe card component (grid/list)
│   ├── RecipeGrid.jsx                # Grid of recipe cards
│   ├── RecipePDF.jsx                 # PDF export component
│   ├── AddToPantryModal.jsx          # Modal for adding pantry items
│   ├── ImageUploader.jsx             # Image upload with preview
│   ├── HowToCookModal.jsx            # Recipe instructions modal
│   ├── ManageAccountModal.jsx        # User profile settings
│   ├── PricingModal.jsx              # Subscription pricing
│   ├── ProLockedSection.jsx          # Pro-feature lock UI
│   ├── UserDropdown.jsx              # User menu dropdown
│   ├── PricingSection.jsx            # Pricing showcase section
│   └── theme-provider.jsx            # Next-themes provider
│
├── hooks/                            # Custom React hooks
│   └── use-fetch.js                  # Custom fetch hook for API calls
│
├── lib/                              # Utility functions
│   ├── api.js                        # fetchWithAuth, error handling
│   ├── auth-context.js               # React Context for auth state
│   ├── serverAuth.js                 # Server-side auth helpers
│   ├── utils.js                      # General utilities
│   ├── data.js                       # Static configuration data
│   └── arcjet.js                     # Arcjet client config
│
├── public/                           # Static assets
│   ├── logo.png                      # App logo
│   └── pdf-worker.js                 # Web Worker for PDF generation
│
├── middleware.js                     # Next.js auth middleware
├── next.config.mjs                   # Next.js configuration
├── package.json
└── tsconfig.json                     # TypeScript config (if using TS)
```

### Key Frontend Components

#### **1. AuthProvider (auth-context.js)**

Global authentication state management.

```jsx
<AuthProvider>
  <App />
</AuthProvider>
```

Provides:

- `user` - Current logged-in user object
- `logout()` - Sign out function
- `isLoading` - Auth state loading flag

#### **2. RecipeCard.jsx**

Displays recipe as a card with multiple variants:

- **Grid variant**: Shows recipe image, title, cuisine
- **List variant**: Shows full recipe details inline

Handles:

- Image loading states with skeleton loaders
- Recipe title and description truncation
- Cuisine/category badges
- Cooking time badges

#### **3. ImageUploader.jsx**

Drag-and-drop image upload component:

- Accepts JPG/PNG files
- Shows preview before upload
- Base64 encoding for transmission
- Progress indicator

#### **4. AddToPantryModal.jsx**

Modal dialog for adding manual pantry items:

- Input fields for name and quantity
- Form validation
- API call handling
- Success/error toasts

#### **5. HowToCookModal.jsx**

Step-by-step recipe instructions modal:

- Displays recipe details (prep time, servings, etc.)
- Step-by-step instructions
- Ingredient list
- Nutrition facts
- PDF download button

### Frontend State Management

#### **Global State (AuthContext)**

```jsx
// In auth-context.js
const { user, logout, isLoading } = useUser();

// user shape:
{
  id: "507f...",
  email: "user@example.com",
  firstName: "John",
  subscriptionTier: "free"
}
```

#### **Component-Level State (useState)**

```jsx
const [recipes, setRecipes] = useState([]);
const [isLoading, setIsLoading] = useState(false);
const [selectedRecipe, setSelectedRecipe] = useState(null);
```

#### **Form State (Server Actions)**

```jsx
// In recipe.actions.js
export async function getOrGenerateRecipe(formData) {
  const recipeName = formData.get("recipeName");
  return await fetchWithAuth("/api/recipes/generate", {
    method: "POST",
    body: JSON.stringify({ recipeName }),
  });
}
```

---

## ⚙️ Backend Structure

### Directory Overview

```
backend/
├── lib/                              # Utilities and services
│   ├── ai/                           # AI integration layer
│   │   ├── client.js                 # Gemini client initialization
│   │   ├── image-service.js          # Unsplash integration
│   │   └── prompts.js                # AI prompt templates
│   └── arcjet.js                     # Arcjet security config
│
├── middleware/                       # Express middleware
│   ├── auth.js                       # JWT verification
│   └── rate-limit.js                 # Arcjet rate limiting
│
├── models/                           # Mongoose schemas
│   ├── User.js                       # User model + password hashing
│   ├── Recipe.js                     # Recipe schema
│   ├── PantryItem.js                 # Pantry item schema
│   └── SavedRecipe.js                # Saved recipe (junction) schema
│
├── routes/                           # API route handlers
│   ├── auth.js                       # Auth endpoints
│   ├── recipes.js                    # Recipe endpoints
│   ├── pantry.js                     # Pantry endpoints
│   ├── saved-recipes.js              # Saved recipes endpoints
│   └── users.js                      # User profile endpoints
│
├── server.js                         # Express server entry point
├── package.json
└── upgrade.js                        # Database migration utility
```

### Key Backend Components

#### **1. server.js (Entry Point)**

```javascript
// Responsibilities:
- Load environment variables
- Configure CORS
- Setup body parsers
- Connect to MongoDB
- Register all routes
- Start server on port 1337
```

#### **2. Models**

- **User.js**: Bcrypt password hashing on save, password comparison method
- **Recipe.js**: Full recipe schema with performance indexes
- **PantryItem.js**: Simple ingredient storage with owner reference
- **SavedRecipe.js**: Junction table for user-recipe relationships

#### **3. Middleware**

- **auth.js**: JWT verification, user extraction, error handling
- **rate-limit.js**: Arcjet quota checking for expensive operations

#### **4. Routes**

- **auth.js**: Signup, Login, Logout with JWT token generation
- **recipes.js**: Generate, Search, Save recipes
- **pantry.js**: Scan, Add, Update, Delete pantry items
- **saved-recipes.js**: View, Save, Delete saved recipes
- **users.js**: Get/Update user profile

#### **5. AI Services (lib/ai/)**

**client.js**

```javascript
// Initialize Google Gemini client
const getGeminiModel = (modelName = "gemini-2.0-flash") => {
  return getGenAI().getGenerativeModel({ model: modelName });
};
```

**image-service.js**

```javascript
// Fetch recipe images from Unsplash
async function fetchRecipeImage(recipeName) {
  // Search Unsplash API for high-quality image
  // Return URL
}
```

**prompts.js**

```javascript
// Well-engineered prompts for consistent Gemini responses
-RECIPE_GENERATION_PROMPT -
  PANTRY_SCAN_PROMPT -
  INGREDIENT_RECIPE_SUGGESTIONS_PROMPT;
```

---

## 🔐 Authentication & Security

### JWT Authentication Flow

```
┌────────────────────────────────────────────┐
│ CLIENT (Browser)                           │
└────────────────────────────────────────────┘
           ↓
  1. User enters email/password
           ↓
  2. POST /api/auth/signup
           ↓
┌────────────────────────────────────────────┐
│ SERVER (Express Backend)                   │
├────────────────────────────────────────────┤
│ 1. Validate input                          │
│ 2. Check email uniqueness                  │
│ 3. Hash password with bcrypt (salt: 10)    │
│ 4. Create User document in MongoDB         │
│ 5. Generate JWT Token:                     │
│    - Payload: { userId, iat, exp }        │
│    - Sign with JWT_SECRET                  │
│    - Expiration: 7 days                    │
│ 6. Set HTTP-Only Secure Cookie:            │
│    Set-Cookie: token=JWT; HttpOnly; ...    │
│ 7. Return User data (no password)          │
└────────────────────────────────────────────┘
           ↓
  3. Browser stores cookie automatically
  4. Subsequent requests include cookie
           ↓
  5. Middleware verifies JWT
  6. Access granted ✓
```

### Security Features

#### **1. Password Security**

- **Hashing**: Bcrypt with 10 salt rounds
- **Never Transmitted**: Plain passwords never sent to frontend
- **Hash Verification**: Bcrypt compare for login validation
- **Minimum Length**: 8 characters enforced

#### **2. JWT Token Security**

- **HTTP-Only Cookie**: JavaScript cannot access token (XSS protection)
- **Secure Flag**: Only sent over HTTPS in production
- **SameSite**: Prevents CSRF attacks
- **Expiration**: 7-day expiration enforced by backend
- **Verification**: Every protected route verifies token

#### **3. Request Validation**

- **Auth Middleware**: Validates JWT on every protected request
- **Data Sanitization**: Server removes client-set fields (\_id, author, timestamps)
- **Email Uniqueness**: Prevents duplicate accounts
- **Object ID Validation**: Checks MongoDB ID format before querying

#### **4. API Security (Arcjet)**

- **Rate Limiting**: Protects expensive AI endpoints
  - `/api/pantry-items/scan`: Heavy image processing
  - `/api/recipes/generate`: Heavy AI processing
  - `/api/recipes/suggest`: Heavy AI processing
- **WAF (Web Application Firewall)**: Blocks:
  - SQL Injection attempts
  - XSS payloads
  - Bot attacks
  - DDoS attempts

#### **5. CORS Configuration**

```javascript
cors({
  origin: process.env.FRONTEND_URL, // Only allow our frontend
  credentials: true, // Allow cookies in cross-origin requests
});
```

#### **6. Database Security**

- **Mongoose Validation**: Data type checking
- **MongoDB Indexes**: Unique email constraint
- **Field Filtering**: Passwords excluded from API responses

### Environment Variables (Security)

```
GEMINI_API_KEY         # Google Gemini API key
UNSPLASH_ACCESS_KEY    # Unsplash API key
MONGODB_URI            # Database connection string
JWT_SECRET             # Secret for signing tokens
NODE_ENV               # "development" or "production"
FRONTEND_URL           # CORS allowed origin
PORT                   # Server port (default 1337)
```

---

## 🔄 Key Components & Workflows

### Workflow 1: Complete Recipe Generation Journey

```
User: "I want to cook Carbonara"
        ↓
Frontend: Displays form with recipe name input
        ↓
User: Types "Carbonara", clicks "Generate"
        ↓
Frontend: Calls getOrGenerateRecipe() server action
        ↓
Server Action: Calls fetchWithAuth("/api/recipes/generate")
        ↓
Backend: auth middleware validates JWT ✓
        ↓
Backend: rate-limit middleware checks Arcjet quota ✓
        ↓
Backend: Calls Gemini with RECIPE_GENERATION_PROMPT
        ↓
Gemini: Analyzes prompt, returns structured JSON
  {
    title: "Carbonara",
    ingredients: [{item, amount, category}],
    instructions: [{step, instruction, tip}],
    nutrition: {calories, protein, carbs, fat},
    prepTime: 10,
    cookTime: 15,
    servings: 4
  }
        ↓
Backend: Searches Unsplash for "Carbonara" image
        ↓
Unsplash: Returns high-quality image URL
        ↓
Backend: Attaches imageUrl to recipe object
        ↓
Backend: Saves recipe to MongoDB with author = userId
        ↓
Backend: Returns complete recipe object
        ↓
Frontend: Receives recipe object
        ↓
Frontend: Displays recipe card with:
  - Title and description
  - Cooking times
  - Ingredient list
  - Step-by-step instructions
  - Nutrition information
  - Chef tips
  - "Save to Collection" button
        ↓
User: Clicks heart icon to save
        ↓
Frontend: Calls saveRecipeToCollection()
        ↓
Backend: Creates SavedRecipe document linking user to recipe
        ↓
Frontend: Shows success toast
        ↓
User: Can now access recipe from "My Recipes" collection
```

### Workflow 2: Pantry Scan & Suggestion

```
User: Wants recipe suggestions based on what they have
        ↓
User: Clicks "Scan Pantry" button
        ↓
Frontend: Opens image upload dialog (ImageUploader)
        ↓
User: Selects/drags fridge photo
        ↓
Frontend: Shows image preview
        ↓
User: Confirms, clicks "Scan"
        ↓
Frontend: Converts image to Base64
        ↓
Frontend: Calls scanPantryImage() server action
        ↓
Backend: Receives image in body
        ↓
Backend: Sends to Gemini with PANTRY_SCAN_PROMPT
        ↓
Gemini: Analyzes image, extracts ingredients
  [
    {name: "Tomato", quantity: "3 items", confidence: 0.98},
    {name: "Pasta", quantity: "1 box", confidence: 0.95},
    {name: "Garlic", quantity: "4 cloves", confidence: 0.92}
  ]
        ↓
Backend: Returns ingredient list to frontend
        ↓
Frontend: Shows extracted ingredients for confirmation
        ↓
User: Can edit quantities, then clicks "Save"
        ↓
Frontend: Calls saveToPantry() for each ingredient
        ↓
Backend: Saves each PantryItem to MongoDB with owner = userId
        ↓
Frontend: Updates pantry list UI
        ↓
User: Sees success toast "Saved 3 items"
        ↓
User: Clicks "Suggest Recipes" button
        ↓
Frontend: Calls backend GET /api/recipes/suggest
        ↓
Backend: Fetches all user's pantry items from MongoDB
        ↓
Backend: Sends pantry list to Gemini
        ↓
Gemini: Generates 5 recipes using only/mostly those ingredients
  [
    {
      title: "Pasta Pomodoro",
      matchPercentage: 98,
      missingIngredients: ["Fresh Basil"],
      ingredients: [...],
      instructions: [...]
    },
    {
      title: "Tomato Soup",
      matchPercentage: 85,
      missingIngredients: ["Cream"]
    }
  ]
        ↓
Backend: Fetches images from Unsplash for each recipe
        ↓
Backend: Returns 5 recipe suggestions with images
        ↓
Frontend: Displays recipe suggestion cards with:
  - Match percentage badge
  - Missing ingredients list
  - Cook time and servings
  - Full recipe details
        ↓
User: Clicks on any recipe to view details
        ↓
User: Can save recipe or view/print it
```

### Workflow 3: Search & Browse Recipes

```
User: Wants to find recipe ideas
        ↓
User: Navigates to /recipes (saved collection)
        ↓
Frontend: Loads "My Recipes" page
        ↓
Backend: Calls GET /api/saved-recipes
        ↓
Backend: Fetches all SavedRecipe documents where user = userId
        ↓
Backend: Populates full recipe details
        ↓
Backend: Returns array sorted by savedAt (newest first)
        ↓
Frontend: Displays grid of recipe cards
        ↓
User: Can click any card to view full details
        ↓
---
        ↓
Alternative: User wants to browse by category
        ↓
User: Navigates to /recipes/category/breakfast
        ↓
Frontend: Calls backend with category filter
        ↓
Backend: Queries recipes where category = "breakfast"
        ↓
Backend: Returns matching recipes
        ↓
Frontend: Displays recipe cards in grid
        ↓
---
        ↓
Alternative: User wants to search by recipe name
        ↓
User: Types in search box: "pasta"
        ↓
Frontend: Calls GET /api/recipes?filters[title][$eqi]=pasta
        ↓
Backend: Queries recipes case-insensitively matching "pasta"
        ↓
Backend: Returns matching recipes
        ↓
Frontend: Displays results instantly
```

---

## 📁 Complete File Structure

```
ai-recipe-platform-master/
│
├── README_TECHNICAL.md                          # Project overview
├── README.md                                    # User-facing README
│
├── doc/
│   ├── ARCHITECTURE_AND_DESIGN.md               # System architecture
│   ├── PROJECT_STRUCTURE_AND_FLOW.md            # Data flow & topology
│   ├── SETUP_AND_REBUILD_GUIDE.md               # Development setup
│   ├── INTERVIEW_QA_HINGLISH.md                 # Q&A documentation
│   ├── stacks.md                                # Technology stack
│   └── COMPLETE_PROJECT_GUIDE.md                # THIS FILE
│
├── backend/
│   ├── lib/
│   │   ├── arcjet.js                            # Arcjet security client
│   │   └── ai/
│   │       ├── client.js                        # Gemini initialization
│   │       ├── image-service.js                 # Unsplash integration
│   │       └── prompts.js                       # AI prompts
│   │
│   ├── middleware/
│   │   ├── auth.js                              # JWT verification
│   │   └── rate-limit.js                        # Arcjet rate limiting
│   │
│   ├── models/
│   │   ├── User.js                              # User schema
│   │   ├── Recipe.js                            # Recipe schema
│   │   ├── PantryItem.js                        # Pantry item schema
│   │   └── SavedRecipe.js                       # Saved recipe schema
│   │
│   ├── routes/
│   │   ├── auth.js                              # Auth endpoints
│   │   ├── recipes.js                           # Recipe endpoints
│   │   ├── pantry.js                            # Pantry endpoints
│   │   ├── saved-recipes.js                     # Saved recipes endpoints
│   │   └── users.js                             # User endpoints
│   │
│   ├── server.js                                # Express server
│   ├── upgrade.js                               # DB migration
│   └── package.json
│
├── frontend/
│   ├── actions/
│   │   ├── recipe.actions.js                    # Recipe server actions
│   │   ├── pantry.actions.js                    # Pantry server actions
│   │   └── mealdb.actions.js                    # MealDB API wrapper
│   │
│   ├── app/
│   │   ├── layout.js                            # Root layout
│   │   ├── page.jsx                             # Landing page
│   │   ├── globals.css                          # Global styles
│   │   │
│   │   ├── (auth)/
│   │   │   ├── layout.js                        # Auth layout
│   │   │   ├── sign-in/[[...sign-in]]/page.jsx
│   │   │   └── sign-up/[[...sign-up]]/page.jsx
│   │   │
│   │   └── (main)/
│   │       ├── layout.jsx                       # Main layout
│   │       ├── dashboard/page.jsx               # Dashboard
│   │       ├── pantry/page.jsx                  # Pantry management
│   │       ├── recipe/page.jsx                  # Recipe view
│   │       ├── recipes/page.jsx                 # Saved recipes
│   │       ├── recipes/category/[category]/page.jsx
│   │       └── recipes/cuisine/[cuisine]/page.jsx
│   │
│   ├── components/
│   │   ├── ui/
│   │   │   ├── avatar.jsx
│   │   │   ├── badge.jsx
│   │   │   ├── button.jsx
│   │   │   ├── card.jsx
│   │   │   ├── dialog.jsx
│   │   │   ├── dropdown-menu.jsx
│   │   │   ├── input.jsx
│   │   │   ├── tabs.jsx
│   │   │   └── sonner.jsx
│   │   │
│   │   ├── wrappers/
│   │   │   └── ClientLayout.jsx
│   │   │
│   │   ├── Header.jsx
│   │   ├── RecipeCard.jsx
│   │   ├── RecipeGrid.jsx
│   │   ├── RecipePDF.jsx
│   │   ├── AddToPantryModal.jsx
│   │   ├── ImageUploader.jsx
│   │   ├── HowToCookModal.jsx
│   │   ├── ManageAccountModal.jsx
│   │   ├── PricingModal.jsx
│   │   ├── ProLockedSection.jsx
│   │   ├── UserDropdown.jsx
│   │   ├── PricingSection.jsx
│   │   └── theme-provider.jsx
│   │
│   ├── hooks/
│   │   └── use-fetch.js
│   │
│   ├── lib/
│   │   ├── api.js                               # API helpers
│   │   ├── auth-context.js                      # Auth provider
│   │   ├── serverAuth.js                        # Server auth helpers
│   │   ├── utils.js                             # Utilities
│   │   ├── data.js                              # Static data
│   │   └── arcjet.js                            # Arcjet config
│   │
│   ├── public/
│   │   ├── logo.png
│   │   └── pdf-worker.js                        # Web Worker
│   │
│   ├── middleware.js                            # Next.js middleware
│   ├── next.config.mjs
│   ├── package.json
│   └── jsconfig.json
│
└── .env.example                                 # Environment template
```

---

## 🚀 Key Technologies & Why They Were Chosen

### Google Gemini 2.0 Flash

- **Why**: Ultra-fast reasoning with great JSON generation
- **Used For**: Recipe generation, pantry image scanning, suggestions
- **Advantage**: Low latency = fast user experience

### Unsplash API

- **Why**: Free, high-quality stock images
- **Used For**: Fetching images for generated recipes
- **Advantage**: Reduces storage cost, always fresh images

### MongoDB

- **Why**: Flexible schema for varied recipe data (ingredients, instructions arrays)
- **Used For**: Users, recipes, pantry items, saved recipes
- **Advantage**: Easy to store complex nested data structures

### Mongoose

- **Why**: Schema validation, hooks, population/references
- **Used For**: Data modeling and validation
- **Advantage**: Type safety before saving to MongoDB

### Arcjet

- **Why**: WAF + Rate limiting in one service
- **Used For**: Security and protecting expensive AI endpoints
- **Advantage**: Prevents abuse, blocks common attacks

### Next.js 16

- **Why**: Modern React framework with App Router and Server Components
- **Used For**: Frontend with Server Actions as thin API wrappers
- **Advantage**: Built-in auth middleware, fast performance

### Tailwind CSS 4

- **Why**: Utility-first CSS for rapid UI development
- **Used For**: Styling all components
- **Advantage**: Consistent design, great responsive support

### shadcn/ui

- **Why**: Pre-built accessible components (Radix + Tailwind)
- **Used For**: Buttons, cards, modals, dropdowns, etc.
- **Advantage**: Consistent design language, accessible out of box

---

## 📊 Performance Optimizations

### Frontend

- **Image Lazy Loading**: Pulse placeholders → fade transition (500ms)
- **Web Workers**: PDF generation non-blocking
- **React Server Components**: Reduced JavaScript sent to browser
- **Stale-While-Revalidate**: Cache headers for repeated recipe searches

### Backend

- **Database Indexes**: Compound indexes for fast queries
- **Connection Pooling**: MongoDB connection reuse
- **Rate Limiting**: Protects expensive AI calls
- **Gemini 1.5 Flash**: Optimized for low-latency responses

### Network

- **API Response Format**: Consistent `{ data: ... }` envelope
- **Compression**: Gzip enabled by default in Express

---

## 🛠️ Development Workflow

### Setup

```bash
# Backend
cd backend
npm install
cp .env.example .env  # Configure environment variables
npm run dev

# Frontend (in another terminal)
cd frontend
npm install
npm run dev
```

### Environment Variables

```
# Backend .env
GEMINI_API_KEY=your_gemini_key
UNSPLASH_ACCESS_KEY=your_unsplash_key
MONGODB_URI=mongodb+srv://...
JWT_SECRET=your_secret_key
FRONTEND_URL=http://localhost:3000
PORT=1337

# Frontend .env.local
NEXT_PUBLIC_API_URL=http://localhost:1337
```

### Development Servers

- **Frontend**: `http://localhost:3000`
- **Backend**: `http://localhost:1337`

---

## 📝 Summary

**Servd AI Recipe Platform** is a full-stack web application that leverages:

✅ **Modern Frontend**: Next.js 16 with React, shadcn/ui, Tailwind CSS  
✅ **Robust Backend**: Express.js with MongoDB, Mongoose, JWT auth  
✅ **AI Integration**: Google Gemini 2.0 Flash for recipe generation & image scanning  
✅ **External APIs**: Unsplash for images, Arcjet for security  
✅ **Security**: JWT tokens, bcrypt hashing, Arcjet WAF, CORS  
✅ **Scalability**: Stateless backend, database indexing, rate limiting  
✅ **User Experience**: Smooth UX with loading states, error handling, notifications

The platform successfully combines AI capabilities with a user-friendly interface to solve a real problem: food waste reduction and recipe inspiration.

---

**End of Document**
_For questions or updates, refer to other documentation in the `/doc` folder._
