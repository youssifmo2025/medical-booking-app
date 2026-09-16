# Medical Booking App

A modern, responsive React frontend application for browsing doctors and booking medical appointments. Built as an individual training project for ITI Fayoum.

## Tech Stack

This project is built using modern web development tools:
- **Core:** React 19, React Router 8
- **State Management:** Zustand
- **Form Handling & Validation:** React Hook Form, Zod
- **API Client:** Axios
- **Mock Backend:** json-server
- **Styling:** Tailwind CSS (v4) with predefined UI tokens

## Setup Instructions

Follow these steps to run the project locally:

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Start the local backend server:**
   In one terminal, start the `json-server` which will run on port 3001:
   ```bash
   npm run server
   ```

3. **Start the Vite development server:**
   In a separate terminal, start the frontend app:
   ```bash
   npm run dev
   ```

## Local Environment

- **API Base URL:** `http://localhost:3001`
- The `src/services/api.js` is configured to read the API URL from `.env` using `import.meta.env.VITE_API_BASE_URL`, falling back to `http://localhost:3001`.

## Implemented Core Features

- **Doctors Listing:** Search doctors by name and filter by specialty.
- **Doctor Details:** View full doctor information including consultation fees, experience, and available slots.
- **Book Appointment:** Integrated booking form with strict Zod validation. Prevents double-booking existing time slots.
- **Appointments Management:** Full CRUD capabilities for appointments (View all, Cancel, Delete, and inline Edit/Reschedule).
- **Profile:** Manage personal and medical details with persistent local storage.

## Bonus Features Actually Implemented

- **Global State Management:** Extracted API fetching logic and shared data into robust `Zustand` stores (`useDoctorStore` and `useAppointmentStore`).
- **Dark / Light Theme Toggle:** A persistent theme switcher in the Navbar (🌙 / ☀️). Respects the user's system preference on first visit and saves the choice to `localStorage`.
- **Reusable UI Components:** Cleanly extracted duplicated UI elements into shared components (e.g., `SkeletonCard`, `StatusBadge`, `EmptyState`).
- **Responsive Design:** Fluid layouts built with Tailwind CSS that adapt beautifully across mobile (375px), tablet (768px), and desktop (1280px) screens.
- **Graceful Error Handling & Fallbacks:** Displays user-friendly `EmptyState` views if the API server is down or searches yield no results, rather than crashing.
- **Custom 404 Page:** Catches all undefined routes and elegantly redirects users back to safety.

## Screenshots

Screenshots available in `/screenshots`
