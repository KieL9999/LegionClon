# Legion Gaming Server Website

## Overview

This is a World of Warcraft Legion private server website built with React/TypeScript frontend and Express.js backend. The site showcases Legion Plus, a WoW private server with custom content, featuring a dark gaming aesthetic inspired by Legion's visual theme. The application includes user registration, server information display, news management, player rankings, and various interactive components for the gaming community.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
The client uses a modern React/TypeScript stack with Vite as the build tool. The UI is built with shadcn/ui components on top of Radix UI primitives, providing accessible and customizable interface elements. Styling is handled through Tailwind CSS with a custom color scheme optimized for gaming aesthetics, featuring dark themes with golden accents reflecting the Legion expansion's visual identity.

The routing system uses Wouter for lightweight client-side navigation. State management is handled by TanStack Query (React Query) for server state management and caching. Form handling utilizes React Hook Form with Zod validation for type-safe form processing.

Component architecture follows a modular approach with reusable UI components, feature-specific components (like FeatureCard, NewsCard), and page-level components. The design system includes comprehensive theming with CSS custom properties for consistent styling across light and dark modes.

### Backend Architecture
The server is built with Express.js using TypeScript and follows a modular structure. Database operations are abstracted through a storage interface, currently implemented with in-memory storage but designed for easy migration to persistent storage solutions.

The API layer handles user registration, authentication, and data retrieval. Routes are organized in a centralized routing system with proper error handling and request/response middleware for logging and validation.

Development setup includes hot module replacement through Vite integration, allowing for rapid development cycles while maintaining production-ready build processes.

### Data Storage Solutions
The application uses Drizzle ORM with PostgreSQL configuration for database operations. The schema defines user management with proper constraints and relationships. Database migrations are managed through Drizzle Kit with a dedicated configuration for schema changes.

Current implementation includes a storage abstraction layer that supports both memory-based storage for development and database persistence for production. User data includes username, email, password, and timestamp fields with proper validation.

### Authentication and Authorization
User authentication is implemented through a registration system with email and username validation. Password handling follows security best practices with proper validation constraints. The system includes user session management and credential validation for secure access.

Form validation is implemented client-side with Zod schemas and server-side validation for security. Error handling provides user-friendly feedback for registration issues like duplicate usernames or invalid email formats.

### External Dependencies
The application integrates several key external libraries:
- UI Framework: Radix UI primitives for accessible components
- Styling: Tailwind CSS with custom gaming-themed color schemes
- Forms: React Hook Form with Hookform Resolvers for validation
- Icons: Lucide React icons with React Icons for brand symbols
- Database: Neon serverless PostgreSQL with WebSocket support
- Fonts: Google Fonts integration (Inter, Orbitron) for typography
- Build Tools: Vite with TypeScript support and development plugins

The architecture supports Replit-specific plugins for development enhancement including error overlays, cartographer integration, and development banners when running in the Replit environment.