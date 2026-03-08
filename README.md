<div align="center">
  <img src="projekt/public/images/Logo.svg" alt="SwapHub Logo" width="200" height="200">
  # SwapHub
  
  A full-stack marketplace web application for swapping items with other users. Built as a final exam project for the **EUD Webudvikler (WU12)** program.
</div>

> List items you no longer need, browse what others have to offer, and propose swaps — no money involved.

![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)
![React](https://img.shields.io/badge/React-19-61DAFB?logo=react)
![Express](https://img.shields.io/badge/Express-4.17-000000?logo=express)
![SQLite](https://img.shields.io/badge/SQLite-3-003B57?logo=sqlite)
![SASS](https://img.shields.io/badge/SASS-BEM-CC6699?logo=sass)

---

## ✨ Features

- **Browse & Search** — Search listings in real-time with category filtering and sorting (A-Z, Z-A, Newest, By User)
- **User Authentication** — Sign up, sign in with JWT-based auth and secure password hashing
- **Create / Edit / Delete Listings** — Full CRUD with image upload support
- **Swap Proposals** — Propose a swap by selecting one of your own listings to offer in exchange
- **Profile Management** — View and edit your personal profile
- **Pagination** — Client-side pagination (6 items per page)
- **Contact Form** — Reach out via a contact form with validation
- **Newsletter** — Subscribe to updates via email
- **Responsive Design** — Mobile-friendly layout with SASS and BEM methodology

---

## 🛠 Tech Stack

### Frontend (`/projekt`)

| Technology         | Purpose                                                          |
| ------------------ | ---------------------------------------------------------------- |
| **Next.js 16**     | React framework with App Router, Server Actions, Turbopack       |
| **React 19**       | UI components with `useActionState` hook for form handling       |
| **SASS**           | Styling with BEM naming convention, mixins, and variables        |
| **Zod 4**          | Schema validation for forms (client & server)                    |
| **react-toastify** | Toast notifications for user feedback                            |
| **react-icons**    | Consistent icon set (FontAwesome 6, Ionicons 5, Material Design) |

### Backend (`/api`)

| Technology             | Purpose                                   |
| ---------------------- | ----------------------------------------- |
| **Express 4**          | RESTful API server                        |
| **Sequelize 5**        | ORM for database models and relations     |
| **SQLite3**            | Lightweight file-based database           |
| **JWT**                | Token-based authentication                |
| **bcryptjs**           | Secure password hashing                   |
| **express-formidable** | Multipart form data & file upload parsing |
| **Winston**            | Logging                                   |
| **CORS**               | Cross-origin resource sharing             |

---

## 📁 Project Structure

```
SwapHub/
├── api/                          # Express REST API
│   ├── assets/                   # Uploaded images (served via /file-bucket)
│   ├── bin/www                   # Server entry point
│   ├── config/                   # Database, SQLite & logging config
│   ├── controllers/              # Route handlers (listing, user, asset, etc.)
│   ├── middleware/auth.js        # JWT authentication middleware
│   ├── models/models.js          # Sequelize models & relations
│   ├── routes/                   # Express route definitions
│   ├── services/asset.js         # File upload service
│   └── storage/database.sqlite3  # SQLite database file
│
├── projekt/                      # Next.js frontend
│   ├── public/images/            # Static assets
│   └── src/
│       ├── app/(routes)/         # Next.js App Router pages
│       │   ├── page.jsx          # Homepage (listings)
│       │   ├── details/[id]/     # Single listing detail page
│       │   ├── my-listings/      # User's own listings (CRUD)
│       │   ├── profile/          # User profile page
│       │   ├── sign-in/          # Authentication
│       │   ├── sign-up/          # Registration
│       │   └── contact/          # Contact page
│       ├── components/           # Reusable UI components
│       ├── hooks/                # Custom React hooks (useFetch, useUserData)
│       ├── styles/               # SASS stylesheets (BEM)
│       └── utils/                # Auth helpers, date formatting
│
├── dokumentation.md              # Danish exam documentation
├── SwapHub.fig                   # Figma design file
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** 18+ installed
- **npm** or **yarn**

### 1. Clone the repo

```bash
git clone https://github.com/rts-cmk-wu12/wu12-eksamen-eud-swaphub.git
cd wu12-eksamen-eud-swaphub
```

### 2. Start the API

```bash
cd api
npm install
npm start
```

The API runs on **http://localhost:4000**

### 3. Start the Frontend

```bash
cd projekt
npm install
npm run dev
```

The frontend runs on **http://localhost:3000**

### 4. Test Accounts

10 predefined test users are available for testing. Use any of these credentials to sign in:

| ID  | Email                      | Password     |
| --- | -------------------------- | ------------ |
| 1   | james.johnson@swaphub.test | password1234 |
| 2   | maria.garcia@swaphub.test  | password1234 |
| 3   | liam.oconnor@swaphub.test  | password1234 |
| 4   | aisha.khan@swaphub.test    | password1234 |
| 5   | sofia.rossi@swaphub.test   | password1234 |
| 6   | chen.wei@swaphub.test      | password1234 |
| 7   | lucas.mueller@swaphub.test | password1234 |
| 8   | emma.dubois@swaphub.test   | password1234 |
| 9   | noah.andersen@swaphub.test | password1234 |
| 10  | priya.patel@swaphub.test   | password1234 |

---

## 🔗 API Endpoints

| Method   | Endpoint               | Description             | Auth |
| -------- | ---------------------- | ----------------------- | ---- |
| `GET`    | `/api/v1/listings`     | Get all listings        | No   |
| `GET`    | `/api/v1/listings/:id` | Get single listing      | No   |
| `POST`   | `/api/v1/listings`     | Create a listing        | Yes  |
| `PUT`    | `/api/v1/listings/:id` | Update a listing        | Yes  |
| `DELETE` | `/api/v1/listings/:id` | Delete a listing        | Yes  |
| `GET`    | `/api/v1/users/:id`    | Get user profile        | No   |
| `POST`   | `/api/v1/users`        | Register new user       | No   |
| `PUT`    | `/api/v1/users/:id`    | Update user profile     | Yes  |
| `POST`   | `/auth/token`          | Login (get JWT token)   | No   |
| `POST`   | `/api/v1/assets`       | Upload an image         | Yes  |
| `GET`    | `/api/v1/categories`   | Get all categories      | No   |
| `POST`   | `/api/v1/requests`     | Create a swap request   | Yes  |
| `POST`   | `/api/v1/newsletter`   | Subscribe to newsletter | No   |

---

## � Deployment

SwapHub is ready for production deployment! 

### 🌐 Live Deployment

- **Frontend**: Deploy to Vercel
- **Backend**: Deploy to Railway, Render, or similar service

### Quick Start

See [VERCEL_DEPLOYMENT.md](VERCEL_DEPLOYMENT.md) for complete step-by-step deployment guide including:

- Deploying frontend to Vercel
- Deploying backend to Railway/Render
- Setting up environment variables
- Connecting frontend to production API
- Troubleshooting common issues

### Environment Variables

**Frontend** (`projekt/.env.local`):
```env
NEXT_PUBLIC_API_URL=https://your-api-domain.com
```

**Backend** (`api/.env`):
```env
NODE_ENV=production
JWT_SECRET=your_secure_secret_key_min_32_chars
CORS_ORIGIN=https://your-vercel-domain.vercel.app
DATABASE_URL=./storage/database.sqlite3
```

See `.env.example` files for all options.

---

## �📸 Screenshots

> _Design based on the included Figma file (`SwapHub.fig`)_

---

## 📝 Exam Tasks Completed

- **Opgave A** — Category filter buttons + "By User" sort option
- **Opgave B** — Full CRUD for listings (Create, Edit, Delete with image upload)
- **Opgave C** — Form validation with Zod (sign-up, sign-in, contact, listings)

---

## 👤 Author

**Marks Galkins** — WU12 Webudvikler

---

## 📄 License

This project was built as an exam assignment for [Roskilde Tekniske Skole](https://www.rfrts.dk/).
