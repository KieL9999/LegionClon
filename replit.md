# AetherWoW Gaming Server Website

## Overview
AetherWoW is a World of Warcraft Legion private server website serving as a central community hub. It aims to enhance player engagement and server promotion through features like user registration, server information, news management, player rankings, and interactive community functionalities. The project emphasizes a dark, Legion-themed gaming aesthetic, supports custom content, and includes a comprehensive support ticket system. It recently underwent a brand transformation from "Legion Plus" to "AetherWoW" with significant UI/UX improvements.

## Current Status (October 5, 2025)
- **Environment**: Successfully migrated to Replit with Node.js 20 runtime
- **Database**: PostgreSQL (Neon) with Drizzle ORM
- **Deployment**: Configured for autoscale deployment
- **Active Development**: Admin ticket management UI improvements

## Recent Changes

### October 5, 2025 - Admin Ticket Management UI Redesign
- **File Modified**: `client/src/pages/TicketsAdminPage.tsx`
- **Changes**:
  - Redesigned ticket card layout with centered VIP badges, status, and priority badges
  - Added clear "TÍTULO" and "DESCRIPCIÓN" labels in gaming-gold color for better visual hierarchy
  - Implemented perfectly symmetric metadata grid for Category, User, and Creation Date
  - All three metadata elements now have identical container styling, padding, and alignment
  - Improved spacing and visual balance throughout ticket cards
  - Enhanced hover effects and click handlers for better UX
- **Admin Setup**: User "kiel" granted level 7 administrator access
- **Testing**: Test ticket data created for UI validation

## User Preferences
Preferred communication style: Simple, everyday language.

## System Architecture

### UI/UX Decisions
The design features a dark gaming aesthetic with golden accents, consistent with the Legion expansion. UI components are built using shadcn/ui on Radix UI primitives and styled with Tailwind CSS, focusing on accessibility and customizability. Key elements include:
- Player panel integrated into main navigation.
- Admin panel with clear visual separation and dynamic badging.
- Redesigned player panel with modern gradient cards, dynamic color coding, and neon-colored labels.
- Navigation buttons use meaningful emojis.
- Homepage stats feature a symmetric, responsive grid layout.
- Elegant container design for narrative content in the hero section, with semi-transparent backgrounds and golden border frameworks.
- Support system uses blue/cyan themes and professional layouts.
- Admin management sections follow a unified design pattern with header sections, counter displays, responsive content grids, and consistent card designs.
- **Admin Ticket Cards**: Symmetric layout with centered badges, labeled sections, and uniform metadata presentation with gaming-themed styling.

### Technical Implementations

#### Frontend
Built with React/TypeScript and Vite. Wouter handles client-side routing, TanStack Query manages server state, and React Hook Form with Zod ensures type-safe form validation. Architecture prioritizes modularity, reusable components, comprehensive theming, and an integrated support system with role-based content display.

#### Backend
An Express.js application written in TypeScript, featuring a modular structure with abstracted database operations. It handles user registration, authentication, data retrieval, dynamic content management (web features, news, downloads), secure file uploads, and a comprehensive support ticket management system. Includes organized routes, error handling, authentication middleware, and Zod schema validation.

#### Dynamic Content and Site Settings
Supports dynamic management of web features, downloads, server news, and essential site settings (title, favicon, SEO). Offers flexible image options and includes an auto-initialization system for default site settings.

#### Authentication and Authorization
Features secure user registration and login with PBKDF2 password hashing and session management via HTTP-only cookies. Implements an 8-level GM hierarchy (Player to Administrator) with role-based access control.

#### Support Ticket System
A comprehensive system allows users to create, track, and manage support requests with categorized tickets, priority levels, and status tracking (open, in_progress, resolved, closed). It includes role-based access for users and administrators. A real-time chat system for support tickets is implemented via a dedicated WebSocket server, using httpOnly session cookies for authentication, storing messages in the `ticket_messages` table, and providing a modern chat UI with message history and real-time updates. The system also includes a reorganized ticket management for users and admins, with separate views and functionalities.

**Admin UI Features**:
- VIP level badges (0-10) with neon glow effects displayed prominently on ticket cards
- Status and priority indicators with color-coded badges
- Labeled sections for title and description with gaming-gold headers
- Symmetric metadata grid showing Category, User, and Creation Date with uniform styling
- Staff assignment system with GM role filtering
- Quick action buttons for viewing and editing tickets

### System Design Choices

#### Data Storage
Uses Drizzle ORM with PostgreSQL (Neon Database) and Drizzle Kit for migrations. A MemStorage fallback provides full functionality when PostgreSQL is unavailable. User data includes UUIDs, username, email, password, role, coins, ban status, and login timestamps.
Database tables include: `users`, `user_sessions`, `web_features`, `downloads`, `server_news`, `site_settings`, `support_tickets`, and `ticket_messages`.

#### Development Mode Configuration
Automatic MemStorage fallback when `DATABASE_URL` is unavailable, default admin access (`admin`/`admin123`), and pre-loaded sample data. Configured for Replit autoscale deployment with proper host allowance and port binding.

## External Dependencies
- **UI Frameworks**: Radix UI, shadcn/ui
- **Styling**: Tailwind CSS
- **Form Management**: React Hook Form, Zod, Hookform Resolvers
- **Icons**: Lucide React, React Icons
- **Database**: PostgreSQL (Neon serverless driver), Drizzle ORM, Drizzle Kit
- **File Upload**: Multer
- **Fonts**: Google Fonts (Inter, Orbitron)
- **Build Tools**: Vite
- **State Management/Data Fetching**: TanStack Query
- **Routing**: Wouter

## Important Files
- `client/src/pages/TicketsAdminPage.tsx` - Admin ticket management interface (active component for `/admin/tickets` route)
- `shared/schema.ts` - Database schema definitions with Drizzle ORM
- `drizzle.config.ts` - Database configuration
- `.local/state/replit/agent/progress_tracker.md` - Migration and development progress tracker
