# 🧘‍♀️ Pilates Studio Booking System

## 🌟 Project Overview

A production-ready full-stack web application built to manage class schedules, user bookings, and administrative operations for a modern Pilates studio. This project showcases my ability to deliver a **secure, scalable, and highly aesthetic user experience** while handling complex full-stack responsibilities.

* **Goal:** To demonstrate advanced proficiency in modern **React/Next.js development, state management, secure API integration, Stripe payments, and custom UI design** for a real-world application.

---

## 💻 Tech Stack & Dependencies

This project is built using the Next.js App Router for optimal performance, routing, and server-side capabilities.

### Core Stack
| Category | Technology | Purpose |
| :--- | :--- | :--- |
| **Framework** | **Next.js 16 (App Router), React, TypeScript** | Performance, Server Components, and Type Safety. |
| **Styling** | **Tailwind CSS** | Utility-first CSS framework for rapid, responsive design. |
| **Backend/BaaS** | **Supabase** | Provides database (PostgreSQL) and Auth (user/admin role management). |
| **Payments** | **Stripe** | Secure handling of payment processing. |

### Key Libraries & Integrations
| NPM Package | Functionality |
| :--- | :--- |
| **resend & react-email** | For building and sending email confirmations (templates built in React). |
| **react-confetti** | Enhanced UX feedback upon successful payment. |
| **toastify** | Consistent and non-intrusive toast notifications for success/error states. |
| **headless ui** | Accessible and unstyled component primitives for dropdowns and navigation. |
| **lucide-icons** | Clean, modern iconography for an engaging interface. |
---

## 🛠️ Key Features

The application’s functionality emphasizes robust UX and reliable data handling.

### 1. 📅 Interactive Class Booking System
* **Seamless Booking Flow:** Multi-step booking process with strong frontend validation for simplicity and reliability.
* **Real-Time Capacity:** Automatic handling of class maximum spots. The UI reflects available spots in real-time, disabling booking buttons when a class is full.
* **User Experience:** Classes are displayed in a clean, week-grouped overview. Implemented **skeleton loading states** for a smooth, professional feel while data is being fetched.
* **Payment & Confirmation:** Full **Stripe Checkout** integration followed by a confirmation page with **react-confetti** and an automated confirmation email sent via **Resend**.

### 2. 🛡️ Secure & Metrics-Driven Admin Dashboard
* **Role-Based Access:** Secure sign-in using **Supabase Auth** with role verification enforced via **Middleware**.
* **Management Tools:** Admins can CRUD (Create, Read, Update, Delete) classes, view key studio metrics, and manage manual bookings through a clean, tabbed interface.
* **Data Overview:** Comprehensive filtering and views for all classes and bookings for easy management.
* **Payment Management:** Admins can also handle **Stripe refunds directly from the admin panel**, giving full control over financial adjustments without touching the database manually.

### 3. 🎨 Custom Design & Branding
* **Design System:** The entire visual design, including the **warm, elegant color palette**, **typography selection**, and component aesthetics (cards, grids, tab navigation), was **designed from scratch** to establish a professional & fancy Pilates brand identity.
* **Responsiveness:** Fully adaptive layout ensuring an optimal experience across desktop, tablet, and mobile devices.

---

## 🎯 Development Challenges

This section details some of the most interesting challenges I solved while building the application. It highlights the problem-solving approach needed in a full-stack environment.

### Challenge: Real-Time Class Availability
* **Problem:** Guaranteeing that the UI always showed the **exact remaining spots** for classes, crucial for preventing users from attempting to book a fully-booked session in a high-traffic scenario.
* **Solution (Supabase Realtime):** Implemented **Supabase Realtime** to subscribe to live updates from the `bookings` table. This allowed the frontend to instantly receive changes, enabling the booking button to be **immediately disabled and visually updated** when a class capacity was reached, providing reliable and instant feedback without requiring a refresh.

### Challenge: Making Admin Work Easy (No Code Needed!)
* **Problem:** Admins and instructors needed a non-technical way to easily manage classes (create, edit, delete) and add manual bookings received via external channels (e.g., email, social media).
* **Solution (Admin Dashboard):** Built a dedicated, secure Admin Panel with user-friendly forms and a simple overview. This allows admins to add, modify, or remove classes, and **manually input bookings** for walk-ins or external sign-ups(social media).

### Challenge: Secure and Trustworthy Payment UX
* **Problem:** Users required a seamless and trustworthy method to complete payments directly on the site, minimizing friction while ensuring the highest security standards for handling sensitive payment information.
* **Solution (Stripe Embedded Elements):** Integrated **Stripe Payments using Embedded Elements**. This provides a smooth, in-context user experience (UX) by keeping the user on the site, while offloading all sensitive data handling to Stripe. Crucially, the resulting `payment_id` is securely stored in the database, linking the payment directly to the booking for reliable tracking.
---

## 🚀 Getting Started

Follow these steps to set up and run the application locally.

1.  **Clone the Repository:** `git clone https://github.com/WilliamMattsson1/pilates-studio.git`
2.  **Install Dependencies:** `npm install` or `yarn install`
3.  **Run the Application:** `npm run dev`
4.  The application will be available at `http://localhost:3000`.

---

## ✉️ Contact

I am seeking my first role as a Frontend Developer and am eager to discuss the technical implementation and design choices of this project further.

* **Name:** William Mattsson
* **Email:** wmattsson@hotmail.com
