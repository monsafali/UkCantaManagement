# UK Canta Management System

A full-stack web application for managing canta operations, calculating vehicle weights, generating PDF receipts, maintaining transaction records, and monitoring user activity through an admin dashboard.

**Live Demo:** [https://uk-canta-management.vercel.app/](https://uk-canta-management.vercel.app/)

## Overview

UK Canta Management System simplifies daily canta operations by providing a centralized platform for recording vehicle weights, calculating net weight, generating and reprinting PDF receipts, searching transaction records, and managing system users.

The system includes role-based access control, allowing administrators to manage users and review system-wide reports while regular users perform operational tasks.

## Features

### User Features

- **Authentication:** Secure login and logout using JWT-based authentication.
- **Vehicle Weight Management:** Record vehicle and product information.
- **Two-Step Weight Recording:** Save the first weight and record the second weight to complete a weighing transaction.
- **Automatic Weight Calculation:** Calculate net weight using gross and tare weights.
- **Weight Conversion:** Calculate weight in kilograms and maunds according to the application's configured formulas.
- **PDF Generation:** Generate printable transaction receipts and reports.
- **Receipt Reprinting:** Reprint previously generated receipts.
- **Transaction Search:** Search records using available search criteria.
- **Date-Based Reports:** Retrieve transaction records for selected dates.
- **Serial Number Management:** Retrieve serial number information for transactions.

### Admin Dashboard

- **Dashboard Analytics:** View total users and transaction activity.
- **User Management:** Create new user accounts.
- **User Overview:** View registered users and their activity.
- **User Status Management:** Activate or deactivate user accounts.
- **User Deletion:** Delete user accounts.
- **Performance Reports:** Review individual user performance and transaction activity.
- **Administrative Reports:** Access system-wide reports and statistics.

### Security

- JWT-based authentication.
- Password hashing with `bcryptjs`.
- Protected API routes.
- Role-based authorization for administrator endpoints.
- Cookie-based authentication support.
- Environment-based configuration.

## Technology Stack

### Frontend

| Technology | Purpose |
|---|---|
| React 19 | User interface |
| Vite | Development server and build tool |
| React Router DOM | Client-side routing |
| Axios | API communication |
| Zustand | State management |
| React Hook Form | Form handling |
| Recharts | Dashboard charts |
| jsPDF | PDF generation |
| jsPDF AutoTable | Tabular PDF reports |
| Day.js | Date formatting |
| Lucide React | Icons |

### Backend

| Technology | Purpose |
|---|---|
| Node.js | JavaScript runtime |
| Express.js | REST API |
| MongoDB Atlas | Cloud database |
| Mongoose | Database modeling |
| JWT | Authentication |
| bcryptjs | Password hashing |
| Cookie Parser | Cookie handling |
| CORS | Cross-origin requests |
| dotenv | Environment configuration |
| PDFKit | PDF document generation |
| Puppeteer | Browser-based PDF generation |
| json2csv | CSV export |

## Application Architecture

The application follows a frontend-backend architecture:

1. The React frontend provides the user interface and communicates with the backend using Axios.
2. The Express backend exposes REST API endpoints.
3. MongoDB stores user accounts and operational records.
4. Authentication middleware verifies user identity.
5. Role-based middleware restricts administrator endpoints.
6. The application generates printable PDF documents and provides reporting functionality.

## API Endpoints

**Base URL:** `/api/v1`

### Authentication

| Method | Endpoint | Description | Access |
|---|---|---|---|
| POST | `/auth/login` | Log in to the system | Public |
| POST | `/auth/logout` | Log out of the system | Authenticated |
| GET | `/auth/Getme` | Retrieve the current user's information | Authenticated |

### Admin Dashboard and User Management

| Method | Endpoint | Description |
|---|---|---|
| GET | `/admin/dashboard` | Retrieve dashboard analytics |
| POST | `/admin/users` | Create a user |
| GET | `/admin/users` | Retrieve all users |
| PATCH | `/admin/users/:id/status` | Activate or deactivate a user |
| DELETE | `/admin/users/:id` | Delete a user |
| GET | `/admin/users/:id/performance` | Retrieve an individual user's performance |
| GET | `/admin/reports` | Retrieve administrative reports |

All admin endpoints require authentication and the `Admin` role.

### Canta Operations and Reports

| Method | Endpoint | Description |
|---|---|---|
| GET | `/sr` | Retrieve serial number information |
| POST | `/generate` | Generate a product or transaction record |
| POST | `/saveFirtstWeight` | Save the first vehicle weight |
| GET | `/getfirstweight` | Retrieve first-weight information |
| POST | `/searchDate` | Search records by date |
| POST | `/search` | Search transaction records |

All operational endpoints require authentication.

**Note:** The endpoint `/saveFirtstWeight` uses the spelling defined in the existing backend. Keep it unchanged unless you also update the backend route and every frontend reference.

## Environment Variables

### Backend `.env`

Create a `.env` file in the backend directory:

```env
PORT=5000
FRONTEND_URL=http://localhost:5173
NODE_ENV=development

MONGO_URI=your_mongodb_connection_string

JWT_SECRET_KEY=your_strong_random_secret
COOKIE_EXPIRE=7
JWT_EXPIRES=7d

SUPER_ADMIN_NAME=Your Admin Name
SUPER_ADMIN_USERNAME=admin
SUPER_ADMIN_PASSWORD=change_this_password
SUPER_ADMIN_EMAIL=admin@example.com
```

Replace the placeholder values with your actual configuration. Do not commit `.env` to GitHub.

For production, configure `FRONTEND_URL` to match your deployed frontend origin and set `NODE_ENV=production`.

### Frontend `.env`

Create a `.env` file in the frontend directory:

```env
VITE_API_URL=http://localhost:5000/api/v1
```

For production, set `VITE_API_URL` to your deployed backend API base URL, for example:

```env
VITE_API_URL=https://your-backend-domain.com/api/v1
```

Replace the example domain with your actual backend deployment URL.

**Deployment note:** Vercel can host the frontend, but your Express backend must also be deployed and reachable. Configure CORS and cookie settings for the frontend and backend domains.

## Installation and Setup

### Prerequisites

- Node.js and npm
- MongoDB Atlas account or a MongoDB instance
- Git

### 1. Clone the repository

```bash
git clone YOUR_GITHUB_REPOSITORY_URL
cd YOUR_PROJECT_DIRECTORY
```

Replace the placeholders with your repository URL and project directory.

### 2. Install frontend dependencies

```bash
cd frontend
npm install
```

Configure the frontend `.env` file before running the application.

### 3. Install backend dependencies

Open a separate terminal:

```bash
cd backend
npm install
```

Configure the backend `.env` file with your database connection and authentication secrets.

### 4. Start the backend

```bash
npm run dev
```

This command assumes your backend `package.json` defines a `dev` script. Otherwise, use the start command configured in that file.

### 5. Start the frontend

```bash
npm run dev
```

Open the local URL provided by Vite, usually:

`http://localhost:5173`

## Demo Credentials

Use the following accounts to explore the deployed application, provided these demo accounts are still active.

### Administrator

- Username: `admin`
- Password: `admin123`
- Role: `Admin`

### Regular User

- Username: `user`
- Password: `user123456`
- Role: `user`

**Security warning:** These are public demo credentials. Do not use them for real operational data. Change default passwords and restrict access to any production administrator account.

## Default Admin Seeding

The application is configured to create a default administrator using the backend environment variables:

- `SUPER_ADMIN_NAME`
- `SUPER_ADMIN_USERNAME`
- `SUPER_ADMIN_PASSWORD`
- `SUPER_ADMIN_EMAIL`

The seed process should create the account only when the administrator does not already exist. Ensure the password is hashed before saving it to the database.

## Deployment

### Frontend

The frontend is deployed on Vercel:

[Open UK Canta Management System](https://uk-canta-management.vercel.app/)

Configure the production `VITE_API_URL` in Vercel's environment variable settings, then redeploy the frontend after changing it.

### Backend

Deploy the Express backend to a Node.js-compatible hosting platform and configure:

- MongoDB connection string
- JWT secret
- Frontend origin
- Production cookie settings
- Required PDF-generation dependencies

Make sure the backend supports the browser and PDF-generation requirements of Puppeteer.

### Database

MongoDB Atlas is used as the database. Configure network access and database credentials securely, granting only the permissions required by the application.

## Project Goals

The main goal of this system is to digitize canta operations, reduce manual weight-calculation errors, simplify receipt management, and provide transparent user-level reporting for administrators.

## License

Add your preferred license before distributing or publishing the project.

---

**Built with React, Node.js, Express, and MongoDB.**
