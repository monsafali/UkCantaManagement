# Computer Canta Management System

A full-stack management system for handling **users, authentication, product generation, two-step weighing, administrative user management, performance tracking, dashboard analytics, search, and reports**.

The system provides separate functionality for normal users and administrators. Authentication and authorization are handled through protected API routes and role-based access control.

---

## Features

### Authentication

- User login
- User logout
- Get currently authenticated user
- Protected API routes
- Authentication middleware
- Role-based authorization
- Admin-only routes

### Product Management

- Generate product entries
- Generate serial/reference numbers
- Search products
- Search products by date
- Retrieve first-weight records
- Save first-weight records
- Two-step weighing workflow

### Two-Step Weighing

The system supports a two-step weighing process:

1. Product is generated.
2. First weight is recorded.
3. First-weight record can be retrieved.
4. The second/final weighing process can be completed through the product workflow.
5. Product records can be searched and reported.

### Admin Dashboard

Administrators can:

- View dashboard statistics
- View total users
- View active/inactive users
- View product entries
- View revenue
- View daily performance
- View user performance

### User Management

Administrators can:

- Create users
- View all users
- Activate/deactivate users
- Delete users
- View individual user performance

### Reports

Administrators can:

- Generate reports
- Filter reports by date
- Filter reports by user
- View entries
- View revenue
- View user statistics
- View daily statistics

---

# Technology Stack

## Backend

- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT Authentication
- REST API
- Role-Based Access Control

## Frontend

The backend API can be consumed by:

- React
- React Router
- Axios
- Admin Dashboard
- User Dashboard

---

# Project Structure

A recommended backend structure is:

```text
backend/
│
├── controllers/
│   ├── auth.controller.js
│   ├── product.controller.js
│   └── adminController.js
│
├── middleware/
│   └── isAuth.js
│
├── routes/
│   ├── authRoutes.js
│   ├── productRoutes.js
│   └── adminRoutes.js
│
├── models/
│   ├── user.model.js
│   └── product.model.js
│
├── config/
│
├── utils/
│
├── .env
├── server.js
└── package.json
```

---

# Authentication

Authentication routes are available under:

```text
/api/auth
```

Authentication uses the `isAuthenticated` middleware for protected endpoints.

Administrators additionally require:

```text
authorizedRole("Admin")
```

---

# Login

## POST `/api/auth/login`

Logs a user into the system.

### Request

```http
POST /api/auth/login
Content-Type: application/json
```

### Example

```json
{
  "username": "john",
  "password": "password123"
}
```

The exact login fields depend on the implementation of `loginUser`.

### Controller

```text
loginUser
```

---

# Logout

## POST `/api/auth/logout`

Logs out the currently authenticated user.

### Authentication

Required.

### Example

```http
POST /api/auth/logout
```

### Middleware

```text
isAuthenticated
```

### Controller

```text
logoutUser
```

---

# Get Current User

## GET `/api/auth/Getme`

Returns information about the currently authenticated user.

### Authentication

Required.

### Example

```http
GET /api/auth/Getme
```

### Middleware

```text
isAuthenticated
```

### Controller

```text
GetMe
```

---

# Product APIs

Product routes are protected by authentication.

The product route contains functionality for:

- Product generation
- Serial number retrieval
- Two-step weighing
- Date searching
- Product searching

The base path depends on how the router is mounted in `server.js`.

For example:

```js
app.use("/api/v1/product", productRoutes);
```

would result in:

```text
/api/v1/product
```

---

# Get SR

## GET `/api/v1/product/sr`

Returns the SR/reference information required by the product workflow.

### Authentication

Required.

### Example

```http
GET /api/v1/product/sr
```

### Controller

```text
getSr
```

---

# Generate Product

## POST `/api/v1/product/generate`

Generates a new product entry.

### Authentication

Required.

### Example

```http
POST /api/v1/product/generate
Content-Type: application/json
```

### Controller

```text
GenerateProduct
```

The exact request body depends on the implementation of `GenerateProduct`.

---

# Two-Step Weight Flow

The system supports a two-step weighing process.

The first weight is saved separately and can later be retrieved.

---

## Save First Weight

### POST `/api/v1/product/saveFirtstWeight`

> Note: The route currently uses the spelling `saveFirtstWeight` with `Firtst`. This README keeps the route exactly as implemented.

Saves the first weight for a product.

### Authentication

Required.

### Example

```http
POST /api/v1/product/saveFirtstWeight
Content-Type: application/json
```

### Controller

```text
saveFirstWeight
```

The exact request body depends on the implementation of `saveFirstWeight`.

---

# Get First Weight

## GET `/api/v1/product/getfirstweight`

Retrieves the saved first-weight information.

### Authentication

Required.

### Example

```http
GET /api/v1/product/getfirstweight
```

### Controller

```text
getFirstWeight
```

---

# Search Products by Date

## POST `/api/v1/product/searchDate`

Searches product entries based on date-related criteria.

### Authentication

Required.

### Example

```http
POST /api/v1/product/searchDate
Content-Type: application/json
```

### Controller

```text
SearchDate
```

The exact request body depends on the implementation of `SearchDate`.

---

# Search Products

## POST `/api/v1/product/search`

Searches product records.

### Authentication

Required.

### Example

```http
POST /api/v1/product/search
Content-Type: application/json
```

### Controller

```text
SearchProduct
```

The exact search parameters depend on the implementation of `SearchProduct`.

---

# Admin APIs

Admin routes are protected by two middleware functions:

```text
isAuthenticated
authorizedRole("Admin")
```

Therefore, a user must:

1. Be authenticated.
2. Have the `Admin` role.

The base admin route depends on how the router is mounted.

For example:

```js
app.use("/api/v1/admin", adminRoutes);
```

would produce:

```text
/api/v1/admin
```

---

# Admin Dashboard

## GET `/api/v1/admin/dashboard`

Returns administrator dashboard statistics.

### Authentication

Required.

### Role

```text
Admin
```

### Example

```http
GET /api/v1/admin/dashboard
```

### Middleware

```text
isAuthenticated
authorizedRole("Admin")
```

### Controller

```text
getAdminDashboard
```

The dashboard can contain information such as:

- Total users
- Active users
- Inactive users
- Total entries
- Total revenue
- Today's entries
- Today's revenue
- Daily performance
- User performance

---

# Admin User Management

## Create User

### POST `/api/v1/admin/users`

Creates a new user from the administrator panel.

### Authentication

Required.

### Role

```text
Admin
```

### Example

```http
POST /api/v1/admin/users
Content-Type: application/json
```

### Controller

```text
adminCreateUser
```

The exact request body depends on the implementation of `adminCreateUser`.

---

# Get All Users

## GET `/api/v1/admin/users`

Returns all users available to the administrator.

### Authentication

Required.

### Role

```text
Admin
```

### Example

```http
GET /api/v1/admin/users
```

### Controller

```text
getAllUsers
```

---

# Activate / Deactivate User

## PATCH `/api/v1/admin/users/:id/status`

Changes the active status of a user.

### Authentication

Required.

### Role

```text
Admin
```

### Example

```http
PATCH /api/v1/admin/users/USER_ID/status
```

### Controller

```text
toggleUserStatus
```

### URL Parameter

| Parameter | Description |
|---|---|
| `id` | User MongoDB ID |

The endpoint is used for operations such as:

```text
Active → Inactive
Inactive → Active
```

---

# Delete User

## DELETE `/api/v1/admin/users/:id`

Permanently deletes a user.

### Authentication

Required.

### Role

```text
Admin
```

### Example

```http
DELETE /api/v1/admin/users/USER_ID
```

### Controller

```text
deleteUser
```

### URL Parameter

| Parameter | Description |
|---|---|
| `id` | User MongoDB ID |

---

# User Performance

## GET `/api/v1/admin/users/:id/performance`

Returns performance information for a specific user.

### Authentication

Required.

### Role

```text
Admin
```

### Example

```http
GET /api/v1/admin/users/USER_ID/performance
```

### Controller

```text
getUserPerformance
```

### URL Parameter

| Parameter | Description |
|---|---|
| `id` | User MongoDB ID |

This endpoint can be used by the admin dashboard to display an individual user's:

- Product entries
- Performance
- Revenue
- Other statistics returned by the controller

The exact response fields depend on the implementation of `getUserPerformance`.

---

# Admin Reports

## GET `/api/v1/admin/reports`

Generates administrator reports.

### Authentication

Required.

### Role

```text
Admin
```

### Example

```http
GET /api/v1/admin/reports
```

Reports can be filtered using query parameters.

Example:

```http
GET /api/v1/admin/reports?from=2026-09-26&to=2026-09-27&userId=all
```

### Query Parameters

| Parameter | Description |
|---|---|
| `from` | Starting date |
| `to` | Ending date |
| `userId` | User ID or `all` |

### Example

```text
/api/v1/admin/reports
    ?from=2026-09-26
    &to=2026-09-27
    &userId=all
```

### Controller

```text
getAdminReports
```

Reports can provide:

- Total entries
- Total revenue
- User statistics
- Daily statistics

The exact response structure is determined by the `getAdminReports` controller.

---

# Authorization

The application uses two levels of protection.

## Authentication

```js
isAuthenticated
```

This verifies that the request comes from a logged-in user.

Example:

```js
router.get(
  "/dashboard",
  isAuthenticated,
  getAdminDashboard
);
```

---

## Role Authorization

Admin endpoints additionally use:

```js
authorizedRole("Admin")
```

Example:

```js
router.get(
  "/dashboard",
  isAuthenticated,
  authorizedRole("Admin"),
  getAdminDashboard
);
```

This means that simply being logged in is not enough to access administrator functionality.

The user must have the:

```text
Admin
```

role.

---

# API Summary

## Authentication

| Method | Endpoint | Auth | Role | Purpose |
|---|---|---|---|---|
| POST | `/api/auth/login` | No | — | Login |
| POST | `/api/auth/logout` | Yes | — | Logout |
| GET | `/api/auth/Getme` | Yes | — | Get current user |

---

## Product

| Method | Endpoint | Auth | Purpose |
|---|---|---|---|
| GET | `/api/v1/product/sr` | Yes | Get SR |
| POST | `/api/v1/product/generate` | Yes | Generate product |
| POST | `/api/v1/product/saveFirtstWeight` | Yes | Save first weight |
| GET | `/api/v1/product/getfirstweight` | Yes | Get first weight |
| POST | `/api/v1/product/searchDate` | Yes | Search by date |
| POST | `/api/v1/product/search` | Yes | Search products |

---

## Admin

| Method | Endpoint | Auth | Role | Purpose |
|---|---|---|---|---|
| GET | `/api/v1/admin/dashboard` | Yes | Admin | Dashboard |
| POST | `/api/v1/admin/users` | Yes | Admin | Create user |
| GET | `/api/v1/admin/users` | Yes | Admin | Get users |
| PATCH | `/api/v1/admin/users/:id/status` | Yes | Admin | Toggle status |
| DELETE | `/api/v1/admin/users/:id` | Yes | Admin | Delete user |
| GET | `/api/v1/admin/users/:id/performance` | Yes | Admin | User performance |
| GET | `/api/v1/admin/reports` | Yes | Admin | Reports |

---

# Example API Flow

## 1. Login

```text
POST /api/auth/login
        │
        ▼
    loginUser
        │
        ▼
 Authentication
        │
        ▼
     User Login
```

---

## 2. Normal User Product Flow

```text
Login
  │
  ▼
Get Current User
  │
  ▼
Get SR
  │
  ▼
Generate Product
  │
  ▼
Save First Weight
  │
  ▼
Get First Weight
  │
  ▼
Complete Product / Weight Workflow
  │
  ▼
Search / Reports
```

---

## 3. Admin Flow

```text
Admin Login
     │
     ▼
Get Current User
     │
     ▼
Admin Dashboard
     │
     ├── Dashboard
     │
     ├── Manage Users
     │      ├── Create User
     │      ├── Get Users
     │      ├── Activate / Deactivate
     │      ├── Delete User
     │      └── User Performance
     │
     └── Reports
            ├── Date Filter
            ├── User Filter
            ├── Entries
            ├── Revenue
            └── Daily Performance
```

---

# Admin Dashboard Frontend

The administrator interface contains three main sections:

```text
Dashboard
Manage Users
Reports
```

## Dashboard

Displays:

- Total Users
- Active Users
- Inactive Users
- Total Entries
- Total Revenue
- Today's Entries
- Today's Revenue
- Daily Charts
- User Performance

---

## Manage Users

Administrators can:

- Create users
- View users
- Activate users
- Deactivate users
- Delete users
- View user performance

---

## Reports

Administrators can select:

```text
From Date
To Date
User
```

Then generate a report containing:

```text
Total Entries
Total Revenue
User Performance
Daily Performance
```

Reports can also be exported as PDF from the frontend.

---

# Security

Protected routes use authentication middleware:

```js
isAuthenticated
```

Administrator routes additionally use:

```js
authorizedRole("Admin")
```

Therefore:

```text
Unauthenticated User
        │
        └── Cannot access protected routes

Authenticated User
        │
        ├── Normal user functionality
        │
        └── Cannot access Admin routes

Authenticated Admin
        │
        └── Admin functionality
```

---

# Error Handling

The frontend should handle common API errors such as:

```text
401 Unauthorized
403 Forbidden
404 Not Found
400 Bad Request
500 Internal Server Error
```

Typical meanings:

| Status | Meaning |
|---|---|
| `400` | Invalid request |
| `401` | Authentication required / invalid authentication |
| `403` | User does not have permission |
| `404` | Resource not found |
| `500` | Server error |

---

# Environment Variables

The exact environment variables depend on the rest of the backend implementation.

A typical `.env` file may contain:

```env
PORT=5000

MONGO_URI=your_mongodb_connection_string

JWT_SECRET_KEY=your_jwt_secret
```

Do not commit `.env` to GitHub.

Add:

```text
.env
```

to `.gitignore`.

---

# Running the Backend

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

Or, depending on the project's scripts:

```bash
npm start
```

The server may run on:

```text
http://localhost:5000
```

---

# Testing the API

You can test the API using:

- Postman
- Insomnia
- Thunder Client
- Axios
- Frontend application

Example:

```http
GET http://localhost:5000/api/v1/admin/dashboard
```

For protected endpoints, the request must contain the authentication expected by the backend.

---

# API Router Configuration

The final API URLs depend on how the routers are mounted in the main server file.

For example:

```js
app.use("/api/auth", authRoutes);

app.use("/api/v1/product", productRoutes);

app.use("/api/v1/admin", adminRoutes);
```

This produces:

```text
/api/auth/...
/api/v1/product/...
/api/v1/admin/...
```

If different prefixes are used in `server.js`, update the URLs accordingly.

---

# Current Route Controllers

## Authentication

```text
loginUser
logoutUser
GetMe
```

## Product

```text
GenerateProduct
SearchDate
SearchProduct
getSr
saveFirstWeight
getFirstWeight
```

## Administration

```text
adminCreateUser
getAllUsers
toggleUserStatus
deleteUser
getUserPerformance
getAdminDashboard
getAdminReports
```

---

# Current Middleware

The application uses:

```text
isAuthenticated
authorizedRole
```

### `isAuthenticated`

Protects routes that require a logged-in user.

### `authorizedRole`

Restricts routes to a specific role.

For administrator routes:

```js
authorizedRole("Admin")
```

---

# Two-Step Weighing Concept

The two-step weighing system separates the first weight from the later product/weight processing.

The relevant endpoints are:

```text
POST /saveFirtstWeight
GET  /getfirstweight
```

The workflow allows the application to save the first weighing information and retrieve it later during the completion of the weighing process.

The exact fields stored and the final-weight calculation are defined by the implementation of:

```text
saveFirstWeight
getFirstWeight
GenerateProduct
```

---

# Important Route Note

The following route currently contains a spelling mistake:

```text
/saveFirtstWeight
```

The intended wording appears to be:

```text
/saveFirstWeight
```

However, **do not change the frontend or backend URL independently**.

If you decide to correct it, update both the backend route and every frontend/API call that uses it.

---

# Future Improvements

Potential improvements include:

- API validation
- Centralized error handling
- Request logging
- Pagination for users
- Pagination for product searches
- Advanced report filters
- CSV/Excel report export
- PDF report generation
- Dashboard date filters
- Search optimization
- API documentation with Swagger/OpenAPI
- Rate limiting
- Audit logs
- Admin activity logs
- Better API response standardization

---

# License

This project is intended for the Computer Canta management workflow.

Add the project's official license here if one is defined.

---

# Author

**Monsaf Ali**

Full-stack + Generative AI + DevOps Engineer
