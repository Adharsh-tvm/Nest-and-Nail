# 🏡 Nest & Nail

Nest & Nail is a full-stack, role-based service marketplace platform designed to connect clients with skilled workers for various service requests (e.g., plumbing, electrical, carpentry). It features a robust Clean Architecture backend and a modern Next.js App Router frontend, supporting end-to-end workflows including real-time location-based worker dispatching, secure document verification, and administrative management.

## ✨ Core Features

* **Role-Based Access Control (RBAC):** Distinct interfaces and capabilities for Clients, Workers, and Admins.
* **Service Request Dispatching:** Geo-location-based matchmaking to find eligible workers near the client's address.
* **Worker Verification System:** Workers can upload identity documents and certificates for admin review before approval.
* **Authentication:** Multi-factor authentication via Email/Password, OTP verification, and Google OAuth.
* **Media Management:** Secure file and image uploads using AWS S3 with presigned URLs for safe access.
* **Admin Dashboard:** Complete management of users, workers, service categories, and platform analytics.

---

## 🛠️ Tech Stack & Languages

### **Languages**
* **TypeScript:** End-to-end type safety across both frontend and backend.
* **JavaScript (Node.js/React):** Core runtime and UI building.

### **Frontend**
* **Framework:** Next.js (App Router), React.
* **Styling:** Tailwind CSS.
* **State Management:** Zustand (with persistent hydration).
* **Data Fetching:** Axios & Next.js Server Actions.
* **UI Components:** Custom components utilizing `clsx`, `tailwind-merge`, and `lucide-react`.

### **Backend**
* **Runtime / Framework:** Node.js, Express.js.
* **Database:** MongoDB with Mongoose (implementing Discriminators for different User roles).
* **Storage:** AWS S3 (File/Image storage via `@aws-sdk/client-s3`).
* **Mailing:** Nodemailer.
* **Security & Auth:** JWT, Bcrypt, OTP generation.

### **Tooling & Monorepo**
* **Package Manager:** `pnpm` (configured with `pnpm-workspace.yaml`).
* **Containerization:** Docker (`Dockerfile.dev` included).

---

## 🏛️ Architecture

The backend strictly adheres to **Clean Architecture**, **Domain-Driven Design (DDD)**, and **SOLID** principles. It is structured into four decoupled layers, ensuring high maintainability and testability:

1. **Domain Layer (`/domain`):** Contains enterprise business logic, Entities (User, Client, Worker, ServiceRequest, Category), and Repository Interfaces.
2. **Application Layer (`/application`):** Contains application-specific business rules.
    * Use Cases (e.g., `CreateServiceRequestUseCase`, `VerifyOtpUseCase`).
    * DTOs (Data Transfer Objects) and Mappers.
    * Interface definitions for infrastructure services.
3. **Infrastructure Layer (`/infrastructure`):** Implements the interfaces defined in the application layer.
    * **Adapters:** JWT Generation, Bcrypt Hashing, Nodemailer, AWS S3.
    * **Database:** Mongoose Models and Repository implementations.
    * **DI Container:** Manual Dependency Injection container wiring up controllers, use-cases, and infrastructure.
4. **Presentation Layer (`/presentation`):** Handles incoming HTTP requests via Express Controllers, Routes, and Middlewares.

---

## 🔒 Security Measures

* **JWT Authentication:** Secure handling of access and refresh tokens.
* **Password Security:** Passwords hashed and salted using `bcryptjs`.
* **OTP Verification:** Short-lived One-Time Passwords for registration and password resets.
* **Presigned URLs:** Dynamically generated, short-lived AWS S3 URLs to protect sensitive user documents and work photos.
* **Input Validation:** Strict runtime validation using Zod.

---

## 📂 Project Structure

\`\`\`text
nest-n-nail/
├── backend/
│   ├── src/
│   │   ├── application/    # DTOs, Use Cases, Interfaces, Mappers
│   │   ├── config/         # Zod Environment validation
│   │   ├── domain/         # Entities, Errors, Repository Interfaces
│   │   ├── infrastructure/ # DB Models, Adapters (S3, JWT, Bcrypt), DI, Repos
│   │   ├── presentation/   # Controllers, Express Routes, Middlewares
│   │   ├── shared/         # Enums, Response formats, Types
│   │   └── index.ts        # Express App entry point
│   └── Dockerfile.dev      # Docker configuration
│
├── frontend/
│   ├── src/
│   │   ├── app/            # Next.js App Router (Pages, Layouts)
│   │   ├── actions/        # Next.js Server Actions
│   │   ├── components/     # Reusable UI components
│   │   ├── hooks/          # Custom React Hooks
│   │   ├── lib/            # Axios instance, utility functions, Zod schemas
│   │   ├── sources/        # API call wrappers
│   │   ├── store/          # Zustand global state management
│   │   └── types/          # Frontend TypeScript definitions
│   └── next.config.ts
│
├── package.json            # Root scripts
└── pnpm-workspace.yaml     # Monorepo configuration
\`\`\`

---

## 🚀 Getting Started

### Prerequisites
* Node.js (v20+)
* MongoDB instance
* AWS S3 Bucket
* pnpm installed globally (`npm install -g pnpm`)

### Installation & Setup

1. **Clone the repository:**
   \`\`\`bash
   git clone <repository-url>
   cd adharsh-tvm-nest-and-nail
   \`\`\`

2. **Install Dependencies:**
   Install all workspace dependencies from the root directory:
   \`\`\`bash
   pnpm install
   \`\`\`

3. **Environment Setup:**
   Navigate to the `backend/` directory and copy the example environment file:
   \`\`\`bash
   cp backend/.env.example backend/.env
   \`\`\`
   *Fill out your `.env` file with your MongoDB URI, AWS Credentials, Google OAuth tokens, and JWT Secrets.*

4. **Run the Application:**
   Start both the backend and frontend concurrently from the root directory (assuming you have a root dev script set up):
   \`\`\`bash
   pnpm run dev
   \`\`\`
   * The backend will typically run on `http://localhost:4444`.
   * The frontend will start on `http://localhost:3000`.

### Docker (Optional)
If you prefer running the backend via Docker:
\`\`\`bash
cd backend
docker build -t nest-n-nail-backend -f Dockerfile.dev .
docker run -p 4444:4444 nest-n-nail-backend
\`\`\`
