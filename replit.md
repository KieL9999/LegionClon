# Legion Gaming Server Website

## Overview
This project is a World of Warcraft Legion private server website, Legion Plus, featuring custom content. The site aims to be a central hub for the Legion Plus community, enhancing player engagement and server promotion. It offers user registration, server information, news management, player rankings, and interactive community features, all styled with a dark, Legion-themed gaming aesthetic.

## User Preferences
Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend
The frontend uses React/TypeScript with Vite, building UI components with shadcn/ui on Radix UI primitives. Styling is managed by Tailwind CSS, featuring a custom dark gaming theme with golden accents. Wouter handles client-side routing, TanStack Query manages server state, and React Hook Form with Zod provides type-safe form validation. The architecture emphasizes modularity with reusable components and comprehensive theming.

### Backend
The backend is an Express.js application written in TypeScript, featuring a modular structure. It abstracts database operations via a storage interface, currently in-memory but designed for persistent storage migration. The API layer handles user registration, authentication, data retrieval, and dynamic content management (e.g., web features), with organized routes, error handling, and middleware for logging and validation.

### Data Storage
The application utilizes Drizzle ORM with PostgreSQL (Neon Database). The schema includes UUID-based primary keys for user management, with Drizzle Kit managing migrations. User data includes username, email, password, role fields, and timestamps, all with validation. A `web_features` table stores dynamic content for the website. The database is integrated with Replit's PostgreSQL service.

### Authentication and Authorization
The system features a secure user registration and login system with password hashing (PBKDF2) and session management via HTTP-only cookies. It implements a 7-level GM hierarchy (Player, GM Aspirant, GM Soporte, GM Eventos, GM Superior, GM Jefe, Community Manager, Administrador) with role-based access control for administrative functions and content editing. Client-side and server-side validation using Zod schemas ensure data integrity and security.

### UI/UX Decisions
The design adopts a dark gaming aesthetic with golden accents, consistent with the Legion expansion. UI components are accessible and customizable. The player panel is integrated into the main navigation for a cohesive user experience. The admin panel features clear visual separation between GMs and players, dynamic badges, golden gradients for GMs, crown icons, and a reorganized structure into "Game Administration" and "Web Settings" sections for improved usability. All interfaces are responsive across devices.

## External Dependencies
- **UI Frameworks**: Radix UI, shadcn/ui
- **Styling**: Tailwind CSS
- **Form Management**: React Hook Form, Zod, Hookform Resolvers
- **Icons**: Lucide React, React Icons
- **Database**: PostgreSQL (Neon serverless driver), Drizzle ORM, Drizzle Kit
- **Fonts**: Google Fonts (Inter, Orbitron)
- **Build Tools**: Vite
- **State Management/Data Fetching**: TanStack Query
- **Routing**: Wouter