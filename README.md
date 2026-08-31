# Assign Meter Web

A production-oriented workforce and meter management web application built with **Next.js** and **React**.

Assign Meter Web provides the frontend interface for managing meters, field operations, assignments, users, locations, reports, and other operational workflows through a centralized web application.

The application communicates with a dedicated backend API and uses cookie-based authentication to protect application routes and user sessions.

---

## Table of Contents

* [Overview](#overview)
* [Key Features](#key-features)
* [Technology Stack](#technology-stack)
* [Application Architecture](#application-architecture)
* [Project Structure](#project-structure)
* [Authentication](#authentication)
* [Route Protection](#route-protection)
* [Backend Integration](#backend-integration)
* [Real-Time Communication](#real-time-communication)
* [File and Spreadsheet Handling](#file-and-spreadsheet-handling)
* [Maps and Location Features](#maps-and-location-features)
* [UI and Styling](#ui-and-styling)
* [Environment Variables](#environment-variables)
* [Getting Started](#getting-started)
* [Development](#development)
* [Production Build](#production-build)
* [Deployment](#deployment)
* [Code Organization Guidelines](#code-organization-guidelines)
* [Security Considerations](#security-considerations)
* [Troubleshooting](#troubleshooting)
* [Future Improvements](#future-improvements)
* [Related Repository](#related-repository)
* [License](#license)

---

# Overview

Assign Meter Web is the frontend application for the Assign Meter platform.

The application is designed around operational workflows where authenticated users can interact with meter-related data and perform actions based on their permissions.

The frontend is responsible for:

* User interface and user experience
* Authentication-aware routing
* Meter management interfaces
* Assignment workflows
* Data visualization
* Reports and operational views
* Spreadsheet processing
* Map-based interfaces
* Real-time UI updates
* Browser-side notifications and application interactions
* Communication with the Assign Meter backend

The frontend is built using the Next.js App Router architecture.

---

# Key Features

## Authentication

The application uses an authentication cookie named:

```text
access_token
```

The cookie is checked by Next.js middleware before allowing access to protected application routes.

Authentication-related responsibilities include:

* Login flow
* Authentication-aware routing
* Redirecting unauthenticated users to `/login`
* Redirecting authenticated users away from `/login`
* Maintaining authentication through browser cookies
* Communicating with the backend authentication system

The frontend should not be considered the final security boundary. Authorization must always be enforced by the backend.

---

## Meter Management

The application provides interfaces for working with meter-related operational data.

Typical workflows include:

* Viewing meter records
* Searching and filtering meters
* Managing meter information
* Assigning meters
* Tracking assignment-related information
* Viewing meter status
* Working with operational meter data

---

## Assignment Management

The application supports workflows around assigning operational resources to field users.

Depending on user permissions, the application can be used to:

* View assignments
* Create assignments
* Update assignments
* Track assignment status
* Review assigned work
* Manage assignment-related information

---

## User and Workforce Management

The frontend provides interfaces for managing users and workforce-related operations.

The application is designed to support role-based workflows where different users can have different capabilities.

The frontend should use permissions to improve the user experience, while the backend remains responsible for enforcing authorization.

---

## Reporting

The application includes interfaces for viewing operational information and reports.

Reports can be used to:

* Review operational activity
* Inspect meter-related information
* Filter data
* Analyze records
* Export or process data where supported

---

## Spreadsheet Processing

The project includes the `xlsx` package for working with Excel/spreadsheet data.

This allows the frontend to support workflows involving:

* Excel files
* Spreadsheet parsing
* Spreadsheet data processing
* Import/export workflows
* Bulk operational data handling

Large file uploads should be handled carefully and should not unnecessarily pass through the Next.js server when a direct object-storage upload architecture is available.

---

## Maps and Location

The project includes map-related libraries:

* Leaflet
* React Leaflet
* Google Maps React integration

These libraries provide the foundation for location-based interfaces and map visualization.

Possible use cases include:

* Showing meter locations
* Displaying field locations
* Visualizing geographic data
* Selecting locations
* Mapping operational activities

---

## Real-Time Application Updates

The Assign Meter platform supports real-time communication between the backend and frontend.

The frontend can consume real-time events to update the interface without requiring the user to manually refresh the page.

Typical real-time workflows include:

```text
Backend event
     ↓
Real-time connection
     ↓
Frontend receives event
     ↓
Application state updates
     ↓
UI updates
```

For long-running real-time connections, the frontend should correctly handle:

* Connection establishment
* Connection cleanup
* Reconnection
* Component unmounting
* Duplicate connections
* Error handling

---

# Technology Stack

## Core

| Technology | Purpose                                 |
| ---------- | --------------------------------------- |
| Next.js    | React framework and application runtime |
| React      | UI development                          |
| JavaScript | Application programming language        |
| React DOM  | Browser rendering                       |

Current project versions are defined in `package.json`.

## UI and Styling

| Technology               | Purpose                  |
| ------------------------ | ------------------------ |
| Tailwind CSS             | Utility-first styling    |
| Sass                     | CSS preprocessing        |
| shadcn                   | UI component tooling     |
| Radix UI                 | Accessible UI primitives |
| Lucide React             | Icons                    |
| Phosphor Icons           | Icons                    |
| class-variance-authority | Component variants       |
| clsx                     | Conditional class names  |
| tailwind-merge           | Tailwind class merging   |
| tw-animate-css           | Tailwind animations      |

## Maps

| Technology      | Purpose                       |
| --------------- | ----------------------------- |
| Leaflet         | Interactive maps              |
| React Leaflet   | React integration for Leaflet |
| Google Maps API | Google Maps integration       |

## Data Processing

| Technology | Purpose                      |
| ---------- | ---------------------------- |
| XLSX       | Excel/spreadsheet processing |

## Development

| Technology   | Purpose                  |
| ------------ | ------------------------ |
| ESLint       | Code quality and linting |
| PostCSS      | CSS processing           |
| Autoprefixer | CSS vendor compatibility |

---

# Application Architecture

The frontend follows a Next.js application architecture.

At a high level:

```text
                         ┌─────────────────────┐
                         │      Browser        │
                         └──────────┬──────────┘
                                    │
                                    │
                         ┌──────────▼──────────┐
                         │     Next.js App     │
                         │                     │
                         │  App Router         │
                         │  Components         │
                         │  Contexts           │
                         │  UI                 │
                         │  Middleware         │
                         └──────────┬──────────┘
                                    │
                   ┌────────────────┴────────────────┐
                   │                                 │
                   ▼                                 ▼
          ┌─────────────────┐              ┌─────────────────┐
          │  Backend API    │              │ Real-Time Layer │
          │                 │              │                 │
          │ Node.js         │              │ SSE / Events    │
          │ Express         │              │                 │
          └────────┬────────┘              └─────────────────┘
                   │
                   ▼
          ┌─────────────────┐
          │    MongoDB      │
          └─────────────────┘

                   │
                   ▼
          ┌─────────────────┐
          │   AWS S3        │
          │ File Storage    │
          └─────────────────┘
```

The frontend should primarily be responsible for presentation, user interaction, client-side state, and communicating with backend services.

Business-critical authorization and data validation must remain on the backend.

---

# Project Structure

Current repository structure includes the following major directories:

```text
Assign-Meter-Web/
│
├── app/
│   ├── ...
│   └── ...
│
├── components/
│   ├── ...
│   └── ...
│
├── contexts/
│   ├── ...
│   └── ...
│
├── lib/
│   ├── ...
│   └── ...
│
├── public/
│   ├── ...
│   └── ...
│
├── middleware.js
├── next.config.mjs
├── eslint.config.mjs
├── jsconfig.json
├── postcss.config.mjs
├── components.json
├── package.json
├── package-lock.json
└── README.md
```

The repository currently separates:

### `app/`

Contains the Next.js application routes and pages.

This is the primary application layer using the Next.js App Router.

### `components/`

Contains reusable React components.

Components should generally contain UI and interaction logic that can be reused across multiple pages.

### `contexts/`

Contains React Context providers and shared client-side state.

Contexts should be used for state that genuinely needs to be shared across multiple parts of the application.

### `lib/`

Contains reusable application utilities and supporting logic.

This is a suitable place for:

* API helpers
* Utility functions
* Client-side services
* Shared configuration
* Data transformation helpers

### `public/`

Contains static assets that can be served directly by Next.js.

### `middleware.js`

Handles authentication-aware route protection before requests reach application pages.

---

# Authentication

Authentication is based on an `access_token` cookie.

The current middleware reads the cookie:

```js
const access_token = request.cookies.get("access_token")?.value;
```

If the user does not have an access token and attempts to access a protected route, the middleware redirects the user to:

```text
/login
```

If an authenticated user attempts to access `/login`, the middleware redirects them to:

```text
/meter
```

The current middleware applies to application routes while excluding Next.js internal assets, API routes, and the favicon.

---

# Route Protection

The current authentication flow is:

```text
User opens application
        ↓
Next.js Middleware
        ↓
Read access_token cookie
        ↓
┌───────────────┐
│ Token exists? │
└───────┬───────┘
        │
   ┌────┴────┐
   │         │
  YES        NO
   │         │
   ▼         ▼
Allow       /login
route      redirect
```

For `/login`:

```text
Authenticated user
        ↓
     /login
        ↓
    /meter
```

## Important Security Rule

The middleware only provides route-level protection for the frontend.

It must not be treated as the actual authorization mechanism.

The backend must independently:

1. Verify the authentication token.
2. Verify that the user exists.
3. Verify the user's permissions.
4. Verify access to the requested resource.
5. Validate all incoming data.

---

# Backend Integration

The frontend communicates with the Assign Meter backend API.

The backend repository is responsible for:

* Authentication
* Authorization
* Database operations
* Business logic
* File storage
* Meter management
* Workforce operations
* Notifications
* Real-time events
* Server-side validation

The frontend should not duplicate backend business rules unnecessarily.

---

# API Communication

API communication should ideally be centralized rather than directly calling `fetch()` from many unrelated components.

Recommended structure:

```text
lib/
└── api/
    ├── auth.js
    ├── meters.js
    ├── users.js
    ├── assignments.js
    ├── reports.js
    └── notifications.js
```

A centralized API layer makes it easier to manage:

* Base URLs
* Authentication
* Headers
* Credentials
* Error handling
* Response parsing
* API changes

---

# Real-Time Communication

The application can receive real-time updates from the backend.

The conceptual flow is:

```text
Backend
   │
   │ event
   ▼
Real-Time Connection
   │
   ▼
Frontend
   │
   ▼
State Update
   │
   ▼
UI Update
```

Real-time communication is useful for operational interfaces where users should see changes without manually refreshing the page.

Examples include:

* New meter records
* Assignment changes
* Operational status updates
* Notifications
* Other application events

---

# File and Spreadsheet Handling

The frontend includes the `xlsx` library for spreadsheet processing.

Typical workflow:

```text
User selects Excel file
        ↓
Browser reads file
        ↓
Spreadsheet parsed
        ↓
Data validated
        ↓
Data sent to backend
```

For large files, avoid unnecessarily routing the entire file through the Next.js application server.

A preferred architecture for large uploads is:

```text
Browser
   │
   │ request upload permission
   ▼
Backend
   │
   │ generate signed upload URL
   ▼
Browser
   │
   │ direct upload
   ▼
AWS S3
```

This reduces the amount of large-file traffic handled by the Next.js server.

---

# Maps and Location Features

The project includes both Leaflet and Google Maps integrations.

Installed packages include:

```text
leaflet
react-leaflet
@react-google-maps/api
```

These should be used according to the specific requirement of each map-based feature.

When implementing map-heavy components:

* Avoid unnecessary map re-renders.
* Load maps only where required.
* Clean up event listeners.
* Avoid storing large geographic datasets unnecessarily in React state.
* Consider server-side filtering for large datasets.
* Keep API keys restricted where applicable.

---

# UI and Styling

The project uses a combination of:

* Tailwind CSS
* Sass
* shadcn tooling
* Radix UI
* Lucide React
* Phosphor Icons

The repository also contains `components.json`, indicating the use of shadcn-related component tooling.

Reusable UI should generally be placed in:

```text
components/
```

rather than duplicated across pages.

---

# Environment Variables

Create a local environment file:

```text
.env.local
```

Environment variables required by the frontend should be documented here.

For example:

```env
NEXT_PUBLIC_BACKEND_URL=http://localhost:5000
```

For production:

```env
NEXT_PUBLIC_BACKEND_URL=https://your-backend-domain.com
```

Only variables that are intentionally exposed to the browser should use the `NEXT_PUBLIC_` prefix.

## Important

Never place secrets such as:

```text
JWT_SECRET
AWS_SECRET_ACCESS_KEY
DATABASE_PASSWORD
PRIVATE_KEYS
```

inside `NEXT_PUBLIC_*` variables.

Anything prefixed with `NEXT_PUBLIC_` can become available to browser-side code.

---

# Getting Started

## Prerequisites

Before running the project, install:

* Node.js
* npm

Recommended:

```bash
node --version
npm --version
```

The project uses Next.js 16 and React 19 as defined in the current `package.json`.

---

## Installation

Clone the repository:

```bash
git clone https://github.com/Codewithajoydas/Assign-Meter-Web.git
```

Move into the project:

```bash
cd Assign-Meter-Web
```

Install dependencies:

```bash
npm install
```

---

# Environment Setup

Create:

```text
.env.local
```

Add the required frontend environment variables.

Example:

```env
NEXT_PUBLIC_BACKEND_URL=http://localhost:5000
```

Make sure the backend server is also running and accessible from the configured URL.

---

# Development

Start the development server:

```bash
npm run dev
```

The application will normally be available at:

```text
http://localhost:3000
```

The development command is defined in `package.json` as:

```json
"dev": "next dev"
```

---

# Linting

Run ESLint:

```bash
npm run lint
```

The project currently uses ESLint 9 and the Next.js ESLint configuration.

Before committing significant changes:

```bash
npm run lint
```

---

# Production Build

Create a production build:

```bash
npm run build
```

Then start the production server:

```bash
npm run start
```

The available scripts are currently:

```json
{
  "dev": "next dev",
  "build": "next build",
  "start": "next start",
  "lint": "eslint"
}
```

---

# Deployment

The frontend is deployed using Vercel.

Production URL:

https://assign-meter-web.vercel.app

The GitHub repository currently identifies this deployment URL as its project website.

## Vercel Deployment Checklist

Before deploying:

```text
[ ] npm run lint
[ ] npm run build
[ ] Environment variables configured
[ ] Backend URL points to production backend
[ ] Authentication cookies configured correctly
[ ] CORS configured on backend
[ ] Production API accessible
[ ] Large file uploads tested
[ ] Real-time connections tested
[ ] Browser notifications tested where applicable
```

---

# Development Workflow

A recommended development workflow is:

```text
1. Create feature branch
        ↓
2. Implement feature
        ↓
3. Run lint
        ↓
4. Run production build
        ↓
5. Test authentication
        ↓
6. Test API integration
        ↓
7. Test relevant workflows
        ↓
8. Commit changes
        ↓
9. Push branch
        ↓
10. Review
        ↓
11. Merge
```

---

# Code Organization Guidelines

## Keep Components Focused

Avoid creating extremely large components containing:

* API requests
* Business logic
* UI
* Validation
* State management
* Data transformation

all in one file.

Prefer:

```text
Page
 ├── Component
 ├── Component
 ├── Hook
 └── API service
```

---

## Keep API Logic Separate

Avoid:

```js
// Large component
fetch(...)
fetch(...)
fetch(...)
fetch(...)
```

Prefer:

```text
Component
    ↓
API service
    ↓
Backend
```

---

## Keep Business Logic Out of Presentational Components

A component should primarily manage:

* Rendering
* User interaction
* UI state

Complex business logic should be moved to reusable utilities, hooks, services, or the backend where appropriate.

---

# Security Considerations

## Authentication

Do not trust the frontend to determine whether a user is authorized.

The backend must validate every protected request.

---

## Authorization

Frontend permission checks are useful for UI control:

```text
Hide button
Disable action
Hide navigation item
```

But they are not security mechanisms.

The backend must enforce:

```text
User
 ↓
Role
 ↓
Permission
 ↓
Resource
 ↓
Action
```

---

## Sensitive Data

Never expose:

* Database credentials
* JWT signing secrets
* AWS secret keys
* Private cryptographic keys
* Internal service credentials

to browser-side JavaScript.

---

## Cookies

Authentication cookies should be configured securely by the authentication server.

Production authentication should consider:

```text
HttpOnly
Secure
SameSite
Expiration
```

---

# Performance Considerations

When working on the application:

### Avoid unnecessary client components

Use server components where client-side functionality is not required.

### Avoid unnecessary re-renders

Be careful with:

* Context providers
* Large arrays in state
* Map components
* Real-time event handlers
* Large tables

### Paginate large datasets

Do not load thousands of records into the browser when server-side pagination can be used.

### Optimize large files

Large files should preferably use direct object-storage upload flows instead of passing through the frontend server.

---

# Troubleshooting

## Backend requests fail

Check:

```text
1. Backend is running
2. NEXT_PUBLIC_BACKEND_URL is correct
3. CORS configuration is correct
4. Authentication cookie exists
5. Backend route exists
6. Browser Network tab
```

---

## User is repeatedly redirected to `/login`

Check:

```text
access_token cookie
        ↓
Cookie domain
        ↓
Cookie SameSite
        ↓
Cookie Secure setting
        ↓
Backend authentication
```

The middleware currently redirects requests without the `access_token` cookie to `/login`.

---

## Production API works locally but not on Vercel

Check:

```text
NEXT_PUBLIC_BACKEND_URL
CORS allowed origin
Cookie configuration
HTTPS
Backend availability
```

---

## Map does not load

Check:

```text
API key
Google Maps configuration
Leaflet CSS
Browser console
Network requests
```

---

## Real-time updates stop

Check:

```text
Backend event stream
Connection status
Browser Network tab
EventSource lifecycle
Component cleanup
Reconnection logic
```

---

# Future Improvements

The following improvements are recommended as the application continues to grow.

## Architecture

* Centralized API client
* Dedicated API service modules
* Consistent API error handling
* Shared validation utilities
* Better client-side state boundaries

## Authentication

* Explicit public/private route configuration
* Better expired-session handling
* Refresh-token strategy if required
* Centralized authentication state

## File Upload

* Presigned S3 uploads
* Client-side upload progress
* Large-file handling
* File type validation
* Upload cancellation
* Retry handling

## Real-Time

* Automatic reconnection
* Connection status indicator
* Event deduplication
* Centralized event subscription management

## Testing

Introduce automated testing for:

* Authentication flows
* Protected routes
* Critical forms
* API services
* Assignment workflows
* Spreadsheet processing
* Permission-based UI

## CI/CD

Add GitHub Actions for:

```text
Pull Request
    ↓
Install
    ↓
Lint
    ↓
Build
    ↓
Tests
    ↓
Merge
```

---

# Recommended Production Checklist

Before considering the frontend production-ready:

### Application

* [ ] All critical workflows tested
* [ ] No unnecessary console logs
* [ ] No debug code
* [ ] No dead imports
* [ ] No unused components
* [ ] No hard-coded production URLs

### Authentication

* [ ] Secure cookies
* [ ] Correct expiration
* [ ] Expired session handling
* [ ] Backend authorization verified

### API

* [ ] Centralized API communication
* [ ] Consistent error handling
* [ ] Loading states
* [ ] Empty states
* [ ] Network failure handling

### Files

* [ ] File type validation
* [ ] File size validation
* [ ] Large upload architecture reviewed
* [ ] Upload failure handling

### Performance

* [ ] Production build tested
* [ ] Large tables optimized
* [ ] Maps optimized
* [ ] Real-time connections cleaned up
* [ ] Unnecessary client components removed

### Deployment

* [ ] Production environment variables configured
* [ ] Backend CORS configured
* [ ] HTTPS enabled
* [ ] Production build successful
* [ ] Authentication tested in production

---

# Related Repository

Assign Meter Web depends on the Assign Meter backend application.

Backend repository:

https://github.com/Codewithajoydas/Assign-Meter-Backend

The backend provides the API, authentication, authorization, database operations, file storage, and server-side business logic used by this frontend.

---

# Repository

Frontend:

https://github.com/Codewithajoydas/Assign-Meter-Web

Production:

https://assign-meter-web.vercel.app

---

# Author

**Ajoy Das**

GitHub:

https://github.com/Codewithajoydas

---

# License

This project is currently maintained as a private application codebase.

If this repository is intended for public distribution, add an explicit license and update this section accordingly.

---

## Project Status

Assign Meter Web is an actively developed application.

The codebase is evolving as new operational workflows, authentication features, real-time functionality, reporting capabilities, and file-processing requirements are added.

For production changes, prioritize:

1. Security
2. Data integrity
3. Authentication and authorization
4. Reliability
5. Performance
6. Maintainability
7. User experience
