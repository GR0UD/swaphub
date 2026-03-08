# 📚 SwapHub Dokumentation

**Marks Galkins - WU12 Webudvikler**  
_Eksamensprojekt - Marts 2025_

> En fuld-stack marketplace applikation til swap/byttehandel mellem brugere.

---

## 📖 Indholdsfortegnelse

1. [Quick Start](#quick-start)
2. [Eksamensopgaver](#eksamensopgaver)
3. [Tech Stack & Valg](#tech-stack--valg)
4. [Arkitektur](#arkitektur)
5. [Database Schema](#database-schema)
6. [API Dokumentation](#api-dokumentation)
7. [Autentifikation](#autentifikation)
8. [Komponenter & Code Splitting](#komponenter--code-splitting)
9. [Implementerede Features](#implementerede-features)
10. [Performance Optimeringer](#performance-optimeringer)
11. [Error Handling](#error-handling)
12. [Environment Setup](#environment-setup)
13. [Troubleshooting](#troubleshooting)
14. [Fremtidige Forbedringer](#fremtidige-forbedringer)

---

## 🚀 Quick Start

### Krav

- Node.js 18+
- npm eller yarn
- SQLite3

For at starte både backend (API) og frontend (Next.js app), følg disse trin:

### 1. Klone repository

```bash
git clone https://github.com/rts-cmk-wu12/wu12-eksamen-eud-swaphub.git
cd wu12-eksamen-eud-swaphub
```

### 2. Start API-serveren

```bash
cd api
npm install
npm start
```

API kører på: **http://localhost:4000**

### 3. Start frontend-projektet

```bash
cd projekt
npm install
npm run dev
```

Frontend kører på: **http://localhost:3000** (eller 3001 hvis 3000 er optaget)

### 4. Test med dummy accounts

Se hovedREADME.md for liste over 10 predefinerede test-brugere.

---

## 📋 Eksamensopgaver

Jeg har implementeret alle 3 eksamensopgaver (Opgave A, B, og C):

### ✅ **Opgave A** – Filter og sortering

- **Kravere**: Kategori-filter buttons + sortering efter bruger
- **Implementering**:
  - Kategori-filter buttons i listingsundercombbox
  - "By User" sort option for at sortere efter oprettelse efter brugernavn
  - Persisted filter state med React hooks
- **Fil**: [filterButtons/index.jsx](/projekt/src/components/filterButtons/index.jsx)

### ✅ **Opgave B** – CRUD for listings

- **Kravere**: Create, Edit, Delete listings med billedupload
- **Implementering**:
  - Create: [createListingForm/index.jsx](/projekt/src/components/forms/createListingForm/index.jsx)
  - Edit: [editListingForm/index.jsx](/projekt/src/components/forms/editListingForm/index.jsx)
  - Delete: Knap i [myListings/index.jsx](/projekt/src/components/myListings/index.jsx)
  - Billedupload via [asset.service](/api/services/asset.js)
- **Features**: Valideringsformularer, error handling, success notifications

### ✅ **Opgave C** – Validering & autentifikation

- **Kravere**: Form validering + bruger-autentifikation (sign-up/sign-in)
- **Implementering**:
  - Zod schema validering på client + server
  - Sign-up: [signUp/index.jsx](/projekt/src/components/forms/signUp/index.jsx)
  - Sign-in: [signIn/index.jsx](/projekt/src/components/forms/signIn/index.jsx)
  - JWT token-baseret auth med cookies
  - Secure password hashing (bcryptjs)
- **Validering på**: Sign-up, Sign-in, Kontakt form, Newsletter, Listings

---

## 🛠 Tech Stack & Valg

- **Next.js 15** - React framework med App Router
  - _Valg_: Automatisk code splitting, server-side rendering (SSR), og file-based routing. @/utils path aliases gør imports meget mere læsbar.
  - _Alternativ_: React + Vite (mere manuel konfiguration)
  - _Fordel_: Zero config setupog built-in Turbopack
- **React 19** - UI komponenter og state management
  - _Valg_: `useActionState` hook til form håndtering gør async forms very clean
  - _Alternativ_: Vue.js eller Svelte
  - _Fordel_: Bedre performance med concurrent rendering
- **SASS (SCSS)** - CSS preprocessing med BEM naming
  - _Valg_: Nested CSS, variables, mixins for bedre struktur. BEM pattern for scalabilty.
  - _Alternativ_: TailwindCSS (utility-first) eller CSS Modules
  - _Fordel_: Fuldt kontrol over styling + maintainable CSS
- **Zod 4** - Runtime validation schema
  - _Valg_: TypeScript-like validation i JavaScript. Konsistent between client og server.
  - _Alternativ_: Yup eller Joi
  - _Fordel_: Super ergonomisk API og excellent error messages
- **Express.js** - Backend API server
  - _Valg_: Minimal framework med maximum flexibility
  - _Alternativ_: Fastify eller Koa
  - _Fordel_: Stort ecosystem og lettest at lære
- **Sequelize 5** - ORM for database
  - _Valg_: Giver struktur med models, associations, migrations
  - _Alternativ_: TypeORM, Prisma, eller raw SQL
  - _Fordel_: God relationship handling med `belongsTo`, `hasMany`, `hasOne`
- **SQLite3** - Database
  - _Valg_: File-based, ingen server setup needed for exam
  - _Alternativ_: PostgreSQL, MySQL for production
  - _Fordel_: Perfect for development/local testing

### Biblioteker

| Bibliotek              | Formål                                       | Plads    |
| ---------------------- | -------------------------------------------- | -------- |
| **React Icons**        | FontAwesome, Ionicons, Material Design icons | Frontend |
| **react-toastify**     | Toast notifications for feedback             | Frontend |
| **JWT (jsonwebtoken)** | Token-baseret autentifikation                | Backend  |
| **bcryptjs**           | Sikker password hashing                      | Backend  |
| **express-formidable** | Multipart form data & file upload handling   | Backend  |
| **Winston**            | Logging/debugging                            | Backend  |
| **CORS**               | Cross-origin resource sharing                | Backend  |

---

## 🏗 Arkitektur

```
SwapHub/
├── api/                              # Express backend
│   ├── bin/www                       # Server entry point
│   ├── config/
│   │   ├── database.js              # Sequelize setup
│   │   ├── sqlite.js                # SQLite config
│   │   └── winston.js               # Logger config
│   ├── controllers/                 # Route handlers (business logic)
│   │   ├── listing.controller.js
│   │   ├── user.controller.js
│   │   ├── asset.controller.js
│   │   ├── request.controller.js
│   │   └── ...
│   ├── middleware/auth.js           # JWT authentication
│   ├── models/models.js             # Sequelize models + relationships
│   ├── routes/                      # Express route definitions
│   ├── services/asset.js            # File upload logic
│   ├── storage/database.sqlite3     # SQLite database file
│   └── assets/                      # User-uploaded images
│
├── projekt/                         # Next.js frontend
│   ├── public/images/               # Static assets
│   ├── src/
│   │   ├── app/                    # Next.js App Router pages
│   │   │   ├── page.jsx            # / (Homepage - listings)
│   │   │   ├── layout.jsx          # Root layout
│   │   │   └── (routes)/           # Route group
│   │   │       ├── details/[id]/   # /details/:id
│   │   │       ├── my-listings/    # /my-listings (CRUD)
│   │   │       ├── profile/        # /profile
│   │   │       ├── sign-in/        # /sign-in
│   │   │       ├── sign-up/        # /sign-up
│   │   │       └── contact/        # /contact
│   │   ├── components/              # Reusable React components
│   │   │   ├── listing/            # Listings display
│   │   │   ├── filterButtons/      # Category filter
│   │   │   ├── forms/              # All form components
│   │   │   ├── siteHeader/         # Navigation
│   │   │   ├── siteFooter/         # Footer
│   │   │   └── ...
│   │   ├── hooks/                   # Custom React hooks
│   │   │   ├── useFetch.js         # Data fetching
│   │   │   └── useUserData.js      # User context
│   │   ├── styles/                  # SASS stylesheets
│   │   │   ├── main.scss           # Entrypoint
│   │   │   ├── core/               # Global styles
│   │   │   └── components/         # Component styles (BEM)
│   │   ├── utils/                   # Utility functions
│   │   │   ├── auth.js             # Auth helpers
│   │   │   └── dateFormat.js       # Date utilities
│   │   └── middleware.js            # Next.js middleware
│   ├── jsconfig.json                # Path aliases (@/*)
│   └── next.config.mjs              # Next.js config
│
└── dokumentation.md                 # This file!
```

### Dataflow

1. **Frontend** → Bruger interagerer med React komponenter
2. **Client Action/Fetch** → Data sendes til API via HTTP POST/PUT/GET
3. **Backend Route** → Express router modtager request
4. **Middleware** → Auth middleware checker JWT token
5. **Controller** → Business logic, validering, database queries
6. **Model** → Sequelize kommunikerer med SQLite database
7. **Response** → JSON response sendes tilbage til frontend
8. **State Update** → Frontend state opdateres, UI re-renders

---

## 🗄 Database Schema

### Models & Relationships

#### **User**

```
users:
  - id (INT, PK)
  - email (STRING, UNIQUE)
  - password (STRING, encrypted)
  - firstName (STRING)
  - lastName (STRING)
  - bio (TEXT)
  - avatar (STRING, nullable)
  - createdAt (DATETIME)
  - updatedAt (DATETIME)

Relationships:
  - hasMany: Listing
  - hasMany: Request
  - hasOne: Newsletter (één newsletter subscription per user)
```

#### **Listing**

```
listings:
  - id (INT, PK)
  - title (STRING)
  - description (TEXT)
  - categoryId (INT, FK → categories)
  - userId (INT, FK → users)
  - createdAt (DATETIME)
  - updatedAt (DATETIME)

Relationships:
  - belongsTo: User
  - belongsTo: Category
  - hasMany: Asset
  - hasMany: Request
```

#### **Asset** (billeder)

```
assets:
  - id (INT, PK)
  - url (STRING)
  - listingId (INT, FK → listings)
  - createdAt (DATETIME)

Relationships:
  - belongsTo: Listing
```

#### **Request** (swap proposals)

```
requests:
  - id (INT, PK)
  - fromUserId (INT, FK → users)
  - toUserId (INT, FK → users)
  - listingId (INT, FK → listings, det item der byttes FOR)
  - swapListingId (INT, FK → listings, det item der byttes MED)
  - createdAt (DATETIME)

Relationships:
  - belongsTo: User (fromUser)
  - belongsTo: User (toUser)
  - belongsTo: Listing
```

#### **Category**

```
categories:
  - id (INT, PK)
  - name (STRING, UNIQUE)
  - createdAt (DATETIME)

Relationships:
  - hasMany: Listing
```

#### **Newsletter**

```
newsletters:
  - id (INT, PK)
  - email (STRING, UNIQUE)
  - userId (INT, FK → users, nullable)
  - createdAt (DATETIME)

Relationships:
  - belongsTo: User (optional)
```

---

## 📡 API Dokumentation

### Base URL

```
http://localhost:4000/api/v1
```

### Autentifikation

Requests der kræver auth skal sende JWT token via cookie:

```
Cookie: user_token=<jwt>
```

### Listings Endpoints

| Method | Endpoint        | Auth | Beskrivelse                  |
| ------ | --------------- | ---- | ---------------------------- |
| GET    | `/listings`     | Nej  | Hent alle listings           |
| GET    | `/listings/:id` | Nej  | Hent enkelt listing + assets |
| POST   | `/listings`     | Ja   | Opret ny listing             |
| PUT    | `/listings/:id` | Ja   | Opdater listing              |
| DELETE | `/listings/:id` | Ja   | Slet listing                 |

**GET /listings** Response:

```json
[
  {
    "id": 1,
    "title": "Gaming PC",
    "description": "RTX 4080...",
    "categoryId": 3,
    "userId": 2,
    "createdAt": "2025-03-01T10:30:00Z",
    "assets": [
      {
        "id": 1,
        "url": "http://localhost:4000/file-bucket/17584850554091.png"
      }
    ],
    "User": {
      "id": 2,
      "firstName": "Maria",
      "lastName": "Garcia"
    }
  }
]
```

**POST /listings** Request:

```json
{
  "title": "Gaming PC",
  "description": "RTX 4080 with 32GB RAM",
  "categoryId": 3
}
```

### Users Endpoints

| Method | Endpoint     | Auth | Beskrivelse               |
| ------ | ------------ | ---- | ------------------------- |
| GET    | `/users/:id` | Nej  | Hent bruger profil        |
| POST   | `/users`     | Nej  | Opret ny bruger (sign-up) |
| PUT    | `/users/:id` | Ja   | Opdater bruger profil     |

**POST /users** (Sign-up):

```json
{
  "email": "user@example.com",
  "password": "securepassword123",
  "firstName": "John",
  "lastName": "Doe"
}
```

### Autentifikation Endpoint

| Method | Endpoint      | Auth | Beskrivelse            |
| ------ | ------------- | ---- | ---------------------- |
| POST   | `/auth/token` | Nej  | Log ind (få JWT token) |

**POST /auth/token** Request:

```json
{
  "email": "user@example.com",
  "password": "securepassword123"
}
```

Response sætter cookie med JWT token.

### Assets Endpoint (Billeder)

| Method | Endpoint  | Auth | Beskrivelse    |
| ------ | --------- | ---- | -------------- |
| POST   | `/assets` | Ja   | Upload billede |

**POST /assets** (FormData):

```
file: <binary image>
listingId: 1
```

---

## 🔐 Autentifikation

### Autentifikation Flow

**Sign-Up Flow:**

1. Bruger fylder sign-up form med email, password, firstName, lastName
2. Frontend validerer med Zod schema
3. POST /users sendes til API
4. Backend hasher password med bcryptjs
5. User gemmes i database
6. Bruger omdirigeres til sign-in siden

**Sign-In Flow:**

1. Bruger fylder email + password
2. Frontend validerer med Zod
3. POST /auth/token sendes til API
4. Backend finder user ved email
5. bcryptjs comparer plaintext password med hashed password
6. Hvis match: JWT token genereres med userId + email payload
7. Token sættes i HttpOnly cookie
8. Frontend gemmer user data i browser (localStorage/state)
9. Bruger omdirigeres til homepage

**Token Verification:**

- Hver request med auth tjekker cookie for JWT token
- Middleware verifier token og extracter userId
- Hvis invalid/expired: 401 Unauthorized
- Hvis valid: userId attached til request, controller kan bruge det

**Logout:**

- Frontend clearer localStorage
- Cookie slettes automatisk

---

## 🧩 Komponenter & Code Splitting

Projektet bruger Next.js App Router struktur for automatisk code splitting og lazy loading.

### Listing Component

[/projekt/src/components/listing/index.jsx](/projekt/src/components/listing/index.jsx)

```jsx
"use client";

import React, { useState, useMemo } from "react";
import Image from "next/image";
import useFetch from "@/hooks/useFetch";
import { IoSearch } from "react-icons/io5";
import Pagination from "../pagination";
import Link from "next/link";

export default function Listing() {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("new");
  const [currentPage, setCurrentPage] = useState(1);
  const { data, error, loading } = useFetch("/listings");

  const filteredItems = useMemo(() => {
    let result = Array.isArray(data) ? data : [];
    if (search) {
      result = result.filter(
        (item) =>
          item.title?.toLowerCase().includes(search.toLowerCase()) ||
          item.description?.toLowerCase().includes(search.toLowerCase()),
      );
    }
    return result;
  }, [data, search]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error loading listings</div>;

  return (
    <div className="listing">
      <div className="listing__controls">
        <input
          className="listing__search"
          type="search"
          placeholder="Search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="listing__grid">
        {filteredItems.map((item) => (
          <Link key={item.id} href={`/details/${item.id}`}>
            <div className="listing__item">
              <Image
                src={item.asset?.url || "/images/placeholder.svg"}
                alt={item.title}
                width={300}
                height={200}
                loading="lazy"
                className="listing__img"
              />
              <h3>{item.title}</h3>
              <p>{item.description}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
```

## Forklaring af Koden

Denne komponent viser hvordan jeg har implementeret dynamisk indhold fra API'et:

1. **useFetch hook**: Henter data fra `/listings` endpoint på API'et
2. **State management**: Bruger React hooks til at håndtere søgning og filtrering
3. **Dynamic rendering**: Viser listings baseret på data fra API'et
4. **Error handling**: Håndterer loading states og fejl
5. **Client-side interaktivitet**: Søgefunktionalitet der filtrerer resultater i real-time
6. **Lazy loading**: Next.js `<Image>` komponenten sørger automatisk for kun at loade billeder, når de er synlige på skærmen.

Komponenten er opdelt i mindre dele som Pagination og bruger custom hooks som useFetch, hvilket demonstrerer code splitting principper. Data kommer dynamisk fra backend API'et og opdaterer UI'en automatisk.

## Ændringer/Valg jeg har taget

**Filter system** – Jeg har forbedret filtersystemet, så brugeren nu kan sortere listerne alfabetisk (A-Z og Z-A) og har beholdt "New".

```jsx
const sortItems = (a, b, type) => {
  switch (type) {
    case "alpha-asc":
      return (a.title || "")
        .toLowerCase()
        .localeCompare((b.title || "").toLowerCase());
    case "alpha-desc":
      return (b.title || "")
        .toLowerCase()
        .localeCompare((a.title || "").toLowerCase());
    case "new":
      return new Date(b.createdAt) - new Date(a.createdAt);
    default:
      return 0;
  }
};
```

## POST Request Implementation

Projektet sender data til API'et gennem flere formularer. Her er et eksempel på newsletter signup:

```js
export async function subscribeToNewsletter(prevState, formData) {
  const email = formData.get("email");

  const parseResult = emailSchema.safeParse({ email: email.trim() });
  if (!parseResult.success) {
    return { success: false, error: "You must enter a valid email" };
  }

  try {
    const response = await fetch("http://localhost:4000/api/v1/newsletter", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: email.trim() }),
    });

    return response.status === 204
      ? { success: true }
      : { success: false, error: await response.text() };
  } catch (err) {
    return { success: false, error: err.message };
  }
}
```

**Andre POST endpoints implementeret:**

- User registration (`/api/v1/users`)
- User authentication (`/auth/token`)
- Profile opdatering (`/api/v1/users/:id`)

## Performance Optimeringer

**1. Lazy Loading**

- Next.js `<Image>` komponenter loader kun billeder når synlige
- Automatisk WebP konvertering og responsive images

**2. Pagination**

- Kun 8 items vises ad gangen for at reducere DOM størrelse
- Client-side pagination for bedre brugeroplevelse

**3. Memoization**

```jsx
const filteredItems = useMemo(() => {
  let result = Array.isArray(data) ? data : [];
  // Filtering og sorting logic
  return result;
}, [data, search, filter]);
```

**4. Debounced Search**

- Real-time søgning uden API kald pr. keystroke

## Error Handling

- Loader/error states i UI.

- Zod validation på både client og server.

- Toast feedback til brugeren.

- Fallback billeder og graceful degradation hvis API fejler.

## Fremtidige Forbedringer

**API Forbedringer:**

- WebSocket support for real-time swap notifications
- Admin panel til at administrere users og listings
- Rate limiting for API protection
- Better error messages og HTTP status codes
- API versioning (v2, v3, etc.)

**Frontend Forbedringer:**

- Dark mode toggle med localStorage persistence
- Mobile responsiveness optimering
- Image upload preview før upload
- Real-time chat mellem brugere
- Wish-list/favoritter system
- Advanced search filters (pris range, dato, location)

**Database Forbedringer:**

- Migration til PostgreSQL for production
- Database indexing for bedre performance
- User ratings system
- Review/comment system på listings

**Deploy:**

- Docker containerization
- GitHub Actions CI/CD pipeline
- Deploy til Vercel + Heroku

---

## 🔧 Environment Setup

### Backend (.env)

Create `api/.env` file:

```env
NODE_ENV=development
PORT=4000
DATABASE_URL=./storage/database.sqlite3
JWT_SECRET=your_secret_key_here_min_32_chars
LOG_LEVEL=debug
CORS_ORIGIN=http://localhost:3000
```

### Frontend (.env.local)

Create `projekt/.env.local` file:

```env
NEXT_PUBLIC_API_URL=http://localhost:4000
```

---

## 🐛 Troubleshooting

### Port allerede optaget

```bash
# Hvis port 3000 er optaget, Next.js skifter automatisk til 3001
# eller kill processen på porten:

# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Mac/Linux
lsof -ti:3000 | xargs kill -9
```

### API connection error

```
Error: Failed to fetch from http://localhost:4000
```

- Check at API server kører: `npm start` i `/api`
- Check at port 4000 er åben
- Browser console for CORS errors
- Verificer `NEXT_PUBLIC_API_URL` i `.env.local`

### Database error: SQLITE_CANTOPEN

```
Error: SQLITE_CANTOPEN
```

- Check at `/api/storage` directory eksisterer
- Check file permissions på `database.sqlite3`
- Delete database og restart server for at gen-create

### Images vises ikke

- Check at API server kører (images served fra `/file-bucket`)
- Verify `next.config.mjs` har remote pattern for localhost:4000
- Check i browser DevTools > Network at `/file-bucket/*` requests får 200 status

### Build error: "swapRequests not found"

```
File 'src/components/swapRequests/index.jsx' not found
```

- Clear Next.js cache: `rm -rf projekt/.next`
- Restart dev server
- Reload browser

### Zod validation fejler client-side

- Check browser console for validation error details
- Verify form input values matches Zod schema
- Check email format, password length, required fields

---

## 📚 Ressourcer & Learning

- [Next.js Documentation](https://nextjs.org/docs)
- [React Hooks Guide](https://react.dev/reference/react/hooks)
- [Zod Validation](https://zod.dev)
- [Express Best Practices](https://expressjs.com/en/guide/error-handling.html)
- [Sequelize ORM](https://sequelize.org/docs/v6/getting-started/)
- [SASS/SCSS Guide](https://sass-lang.com/guide)
- [BEM Naming Convention](http://getbem.com/)

---

## 📝 Notes til fremtidig udvikler

1. **Always** validate input både client og server side
2. **Always** hash passwords med bcryptjs (never store plaintext!)
3. **Clean URLs**: `/api/v1/listings` over `/listings` eller `/getListings`
4. **Error messages**: Return specific error messages for debugging
5. **CORS**: Configure properly for production
6. **Images**: Compress before upload for performance
7. **Pagination**: Implement for scalability (current: 6-8 items per page)
8. **Logging**: Use Winston for backend logging, browser console for frontend
9. **Testing**: Add unit tests for controllers, integration tests for API
10. **Security**: Use HTTPS in production, validate CSRF tokens

---

**Credit til:** [Awesome README](https://github.com/matiassingers/awesome-readme?tab=readme-ov-file)  
_Denne guide hjalp mig med at strukturere god dokumentation._

**Marks Galkins - WU12**  
_SwapHub - Eksamensprojekt 2025_
