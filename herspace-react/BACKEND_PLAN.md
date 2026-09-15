# HerSpace — Backend Architecture & Step-by-Step Implementation Plan

> **Note:** This document serves as the master blueprint and reference for developing, integrating, and testing the HerSpace backend module-by-module.

---

## 1. System Architecture Overview

```
Frontend (React + Vite)
      │
      ▼
Reverse Proxy / CORS / API Gateway
      │
      ▼
Express.js / Node.js REST API (/api/v1)
      ├── Rate Limiting & Security (Helmet, CORS, Express-Rate-Limit)
      ├── Authentication & RBAC (JWT, bcrypt)
      ├── File Processing Middleware (Multer: 5MB limit, PDF/DOCX/Images)
      │
      ├── Database Layer (PostgreSQL with Prisma OR MongoDB with Mongoose)
      ├── Object Storage Service (AWS S3 / Cloudinary / Supabase Storage)
      ├── Payment Service (JazzCash / EasyPaisa / Stripe Sandbox)
      └── Email Delivery Service (Resend / SendGrid / Nodemailer)
```

---

## 2. Directory Structure

```
backend/
├── .env.example
├── .gitignore
├── package.json
├── server.js                        # App bootstrap & HTTP listener
└── src/
    ├── app.js                       # Express setup, middleware chains & error handlers
    ├── config/
    │   ├── db.js                    # Database connection pool / client
    │   ├── storage.js               # Cloud/Local object storage client
    │   └── mailer.js                # Email transport configuration
    ├── constants/
    │   └── roles.js                 # RBAC roles (SUPER_ADMIN, HR_MANAGER, EDITOR)
    ├── middlewares/
    │   ├── auth.middleware.js       # JWT validation & role permissions check
    │   ├── upload.middleware.js     # Multer file filter (PDF/DOCX/Images, 5MB limit)
    │   ├── validate.middleware.js   # Request schema validator (Zod or Joi)
    │   ├── rateLimiter.js           # Anti-spam for public-facing forms
    │   └── errorHandler.js          # Centralized error handler
    ├── models/                      # Database entities / schemas
    │   ├── User.js                  # Admin & staff credentials and roles
    │   ├── Donation.js              # Donation transactions & payment status
    │   ├── Volunteer.js             # Volunteer applications
    │   ├── Internship.js            # Internship job postings
    │   ├── Application.js           # Internship candidate applications & CV links
    │   ├── Blog.js                  # Blog articles / CMS posts
    │   └── Subscriber.js            # Newsletter email subscribers
    ├── routes/
    │   ├── index.js                 # Root router mounting /api/v1
    │   ├── auth.routes.js           # /api/v1/auth
    │   ├── donation.routes.js       # /api/v1/donations
    │   ├── volunteer.routes.js      # /api/v1/volunteers
    │   ├── internship.routes.js     # /api/v1/internships
    │   ├── blog.routes.js           # /api/v1/blogs
    │   └── newsletter.routes.js     # /api/v1/newsletter
    ├── controllers/
    │   ├── auth.controller.js
    │   ├── donation.controller.js
    │   ├── volunteer.controller.js
    │   ├── internship.controller.js
    │   ├── blog.controller.js
    │   └── newsletter.controller.js
    ├── services/
    │   ├── payment.service.js       # Payment gateway API & webhook verification
    │   ├── email.service.js         # Automated emails (confirmation, receipts, alerts)
    │   └── file.service.js          # Upload & cleanup logic for CVs/images
    └── utils/
        ├── apiResponse.js           # Standardized JSON response formatting
        └── validators.js            # Zod/Joi validation schemas
```

---

## 3. Database Schema Blueprint

### 3.1. `users` (Admin & Staff)
| Field | Type | Attributes | Description |
| :--- | :--- | :--- | :--- |
| `id` | UUID / ObjectId | Primary Key | Unique user identifier |
| `name` | VARCHAR(100) | NOT NULL | Admin full name |
| `email` | VARCHAR(255) | NOT NULL, UNIQUE | Login email |
| `password_hash` | VARCHAR(255) | NOT NULL | Salted bcrypt hash |
| `role` | ENUM | NOT NULL | `SUPER_ADMIN`, `HR_MANAGER`, `CONTENT_EDITOR` |
| `is_active` | BOOLEAN | DEFAULT true | Account status |
| `created_at` | TIMESTAMP | DEFAULT NOW() | Registration date |
| `updated_at` | TIMESTAMP | DEFAULT NOW() | Last update date |

### 3.2. `donations`
| Field | Type | Attributes | Description |
| :--- | :--- | :--- | :--- |
| `id` | UUID / ObjectId | Primary Key | Unique transaction record ID |
| `full_name` | VARCHAR(150) | NOT NULL | Donor's full name |
| `email` | VARCHAR(255) | NOT NULL | Donor's email |
| `phone` | VARCHAR(30) | NOT NULL | Contact phone (03XX-XXXXXXX) |
| `amount` | DECIMAL(12, 2)| NOT NULL | Amount in PKR |
| `currency` | VARCHAR(10) | DEFAULT 'PKR' | Currency code |
| `payment_method`| VARCHAR(50) | NULL | `card`, `jazzcash`, `easypaisa`, etc. |
| `payment_status`| ENUM | DEFAULT 'PENDING' | `PENDING`, `COMPLETED`, `FAILED`, `REFUNDED` |
| `transaction_id`| VARCHAR(100) | NULL, UNIQUE | External gateway reference |
| `gateway_meta` | JSON | NULL | Full gateway response/receipt info |
| `created_at` | TIMESTAMP | DEFAULT NOW() | Date initiated |

### 3.3. `volunteer_applications`
| Field | Type | Attributes | Description |
| :--- | :--- | :--- | :--- |
| `id` | UUID / ObjectId | Primary Key | Unique application ID |
| `full_name` | VARCHAR(150) | NOT NULL | Volunteer's name |
| `email` | VARCHAR(255) | NOT NULL | Email address |
| `phone` | VARCHAR(30) | NOT NULL | Contact phone number |
| `city` | VARCHAR(100) | NULL | City of residence (e.g. Karachi, Jamshoro) |
| `age` | INTEGER | NULL | Applicant age |
| `gender` | ENUM | NULL | `Male`, `Female`, `Other` |
| `statement` | TEXT | NOT NULL | "Why do you want to volunteer with HerSpace?" |
| `status` | ENUM | DEFAULT 'PENDING' | `PENDING`, `REVIEWED`, `SHORTLISTED`, `ACCEPTED`, `REJECTED` |
| `reviewer_notes`| TEXT | NULL | Internal admin evaluation notes |
| `created_at` | TIMESTAMP | DEFAULT NOW() | Submission timestamp |

### 3.4. `internships`
| Field | Type | Attributes | Description |
| :--- | :--- | :--- | :--- |
| `id` | UUID / ObjectId | Primary Key | Unique listing ID |
| `title` | VARCHAR(150) | NOT NULL | Role name (e.g. "Research Intern") |
| `slug` | VARCHAR(160) | UNIQUE | URL-friendly slug |
| `description` | TEXT | NOT NULL | Scope, tasks, qualifications |
| `location` | VARCHAR(100) | NOT NULL | e.g. "Jamshoro, Sindh" or "Remote" |
| `workplace_type`| ENUM | NOT NULL | `Remote`, `On-Site`, `Hybrid` |
| `duration` | VARCHAR(50) | NOT NULL | e.g. "3 months", "6 months" |
| `deadline` | DATE | NOT NULL | Application deadline |
| `is_active` | BOOLEAN | DEFAULT true | Allows opening/closing positions |
| `created_at` | TIMESTAMP | DEFAULT NOW() | Listing date |

### 3.5. `internship_applications`
| Field | Type | Attributes | Description |
| :--- | :--- | :--- | :--- |
| `id` | UUID / ObjectId | Primary Key | Unique application ID |
| `internship_id` | UUID / ObjectId | FK -> internships | Applied role reference (NULL if spontaneous) |
| `role_title` | VARCHAR(150) | NOT NULL | Snapshot of role applied for |
| `full_name` | VARCHAR(150) | NOT NULL | Applicant name |
| `email` | VARCHAR(255) | NOT NULL | Applicant email |
| `phone` | VARCHAR(30) | NOT NULL | Phone number |
| `city` | VARCHAR(100) | NULL | City |
| `age` | INTEGER | NULL | Age |
| `gender` | ENUM | NULL | `Male`, `Female`, `Other` |
| `cv_url` | VARCHAR(500) | NOT NULL | Cloud storage URL or local path to CV file |
| `statement` | TEXT | NOT NULL | Applicant motivation letter |
| `status` | ENUM | DEFAULT 'APPLIED' | `APPLIED`, `UNDER_REVIEW`, `INTERVIEWED`, `ACCEPTED`, `REJECTED` |
| `reviewer_notes`| TEXT | NULL | Internal notes |
| `created_at` | TIMESTAMP | DEFAULT NOW() | Submission timestamp |

### 3.6. `blogs`
| Field | Type | Attributes | Description |
| :--- | :--- | :--- | :--- |
| `id` | UUID / ObjectId | Primary Key | Unique article ID |
| `title` | VARCHAR(200) | NOT NULL | Post title |
| `slug` | VARCHAR(220) | NOT NULL, UNIQUE | Friendly URL slug |
| `cover_image` | VARCHAR(500) | NOT NULL | URL or path to featured image |
| `body` | JSON / TEXT | NOT NULL | Array of paragraphs or rich text HTML |
| `author_name` | VARCHAR(100) | DEFAULT 'HerSpace Team' | Author attribution |
| `status` | ENUM | DEFAULT 'PUBLISHED' | `DRAFT`, `PUBLISHED`, `ARCHIVED` |
| `published_at` | TIMESTAMP | DEFAULT NOW() | Publication date |
| `created_at` | TIMESTAMP | DEFAULT NOW() | Created date |

### 3.7. `newsletter_subscribers`
| Field | Type | Attributes | Description |
| :--- | :--- | :--- | :--- |
| `id` | UUID / ObjectId | Primary Key | Unique subscriber ID |
| `email` | VARCHAR(255) | NOT NULL, UNIQUE | Subscriber email address |
| `is_active` | BOOLEAN | DEFAULT true | Unsubscribe flag |
| `source` | ENUM | DEFAULT 'FOOTER' | `BANNER`, `FOOTER` |
| `subscribed_at`| TIMESTAMP | DEFAULT NOW() | Subscription timestamp |

---

## 4. API Endpoints Map

### Public Endpoints (Consumed by Frontend)
- `POST /api/v1/donations/checkout` — Initialize donation and get payment link/token
- `POST /api/v1/donations/webhook` — Gateway webhook for payment confirmation
- `POST /api/v1/volunteers/apply` — Submit volunteer application form
- `GET  /api/v1/internships` — List all currently active internships
- `GET  /api/v1/internships/:id` — Get details of a specific internship
- `POST /api/v1/internships/apply` — Submit application with CV upload (`multipart/form-data`)
- `GET  /api/v1/blogs` — List published blog posts
- `GET  /api/v1/blogs/:slug` — Get full blog post
- `POST /api/v1/newsletter/subscribe` — Subscribe an email address

### Protected Endpoints (Admin Dashboard & Management)
- `POST   /api/v1/auth/login` — Authenticate admin, returns JWT
- `GET    /api/v1/auth/me` — Get current logged-in admin profile
- `GET    /api/v1/admin/donations` — View all donations with filters & CSV export
- `GET    /api/v1/admin/volunteers` — View all volunteer applications
- `PATCH  /api/v1/admin/volunteers/:id` — Update volunteer status / notes
- `POST   /api/v1/admin/internships` — Create internship post
- `PUT    /api/v1/admin/internships/:id` — Update or close internship post
- `DELETE /api/v1/admin/internships/:id` — Delete internship post
- `GET    /api/v1/admin/applications` — Review applications & download CVs
- `PATCH  /api/v1/admin/applications/:id` — Update application status / notes
- `POST   /api/v1/admin/blogs` — Create new blog with image upload
- `PUT    /api/v1/admin/blogs/:id` — Update blog post
- `DELETE /api/v1/admin/blogs/:id` — Delete blog post
- `GET    /api/v1/admin/subscribers` — List and export subscriber emails

---

## 5. Module-by-Module Development & Testing Plan

We will proceed iteratively through each phase:

### Phase 1: Core Foundation & Scaffold
- Initialize backend package in `backend/` with dependencies (`express`, `cors`, `helmet`, `dotenv`, `morgan`, `zod`, DB driver).
- Configure environment configuration (`.env`).
- Setup database connection & migrations/schemas.
- Establish unified API response & error handling middleware.
- **Verification**: Health check endpoint (`GET /api/v1/health`) test.

### Phase 2: Newsletter & Volunteers (Low-Risk, Form Submissions)
- Create `Newsletter` and `Volunteer` models and routes.
- Input validation (email format, phone format, character limits).
- Rate limiter for form spam prevention.
- Connect [Newsletter.jsx](file:///home/aka-Ayaan/herspace-react/src/components/Newsletter.jsx), [Footer.jsx](file:///home/aka-Ayaan/herspace-react/src/components/Footer.jsx), and [VolunteerModal.jsx](file:///home/aka-Ayaan/herspace-react/src/components/VolunteerModal.jsx) to live API.
- **Verification**: Form submission tests, duplicate email handling, rate-limiting tests.

### Phase 3: File Upload & Internships System
- Configure Multer upload middleware (file size check 5MB max, MIME types: `.pdf`, `.doc`, `.docx`).
- Configure local uploads directory or cloud object storage for CV files.
- Build `Internship` listings CRUD and `InternshipApplication` submission endpoint.
- Connect [Internships.jsx](file:///home/aka-Ayaan/herspace-react/src/components/Internships.jsx) and [ApplyModal.jsx](file:///home/aka-Ayaan/herspace-react/src/components/ApplyModal.jsx) to live API.
- **Verification**: File upload validation (reject invalid types/oversized files), CV file storage integrity check.

### Phase 4: Blog & Content System (CMS)
- Create `Blog` model, migration, and seed initial data from `blogsData.js`.
- Build public read endpoints (`GET /blogs`, `GET /blogs/:slug`).
- Connect [Blogs.jsx](file:///home/aka-Ayaan/herspace-react/src/components/Blogs.jsx) and [BlogModal.jsx](file:///home/aka-Ayaan/herspace-react/src/components/BlogModal.jsx) to fetch dynamically from API.
- **Verification**: Blog listing, pagination, and single post view tests.

### Phase 5: Donations & Payment Gateway Integration
- Create `Donation` model and validation.
- Implement payment processing workflow (sandbox / mock gateway initially, ready for JazzCash/EasyPaisa/Stripe).
- Webhook receiver with signature verification and automated confirmation email.
- Connect [DonateModal.jsx](file:///home/aka-Ayaan/herspace-react/src/components/DonateModal.jsx) to live API.
- **Verification**: Simulation of payment success/failure webhooks and transaction status updates.

### Phase 6: Admin Authentication & Management Dashboard
- Admin user seed script, password hashing with bcrypt, JWT token generation & verification middleware.
- Protected admin routes for reviewing applications, managing blogs, managing internships, and exporting donations.
- Replace `openAdmin()` alert in [Header.jsx](file:///home/aka-Ayaan/herspace-react/src/components/Header.jsx) with admin login / dashboard view.
- **Verification**: Role-based authorization tests, token expiration, secure data export.
