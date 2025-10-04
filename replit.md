# AetherWoW Gaming Server Website

## Overview
AetherWoW is a World of Warcraft Legion private server website designed to be a central community hub. It aims to enhance player engagement and server promotion through features like user registration, server information, news management, player rankings, and interactive community functionalities, all styled with a dark, Legion-themed gaming aesthetic and supporting custom content. The project has recently undergone a complete brand transformation from "Legion Plus" to "AetherWoW," and significant UI/UX improvements have been made, including a comprehensive support ticket system.

## User Preferences
Preferred communication style: Simple, everyday language.

## Replit Setup (October 1, 2025)
This project was successfully imported from GitHub and configured to run in the Replit environment:

### Environment Configuration
- **Runtime**: Node.js 20 with TypeScript
- **Port**: 5000 (frontend and backend on same port)
- **Host**: 0.0.0.0 (required for Replit proxy)
- **Database**: PostgreSQL (already provisioned via DATABASE_URL)
- **Development Server**: Vite dev server with HMR
- **Build System**: Vite + esbuild

### Key Setup Steps Completed
1. Modified `server/db.ts` to gracefully handle missing DATABASE_URL and fall back to MemStorage
2. Configured workflow to run `npm run dev` on port 5000 with webview output
3. Database schema synced using `drizzle-kit push`
4. Verified all routes and authentication working correctly
5. Deployment config set for autoscale production deployment

### Running the Application
- **Development**: Workflow "Start application" runs `npm run dev` automatically
- **Database**: Run `npm run db:push` to sync schema changes
- **Build**: Run `npm run build` to create production build
- **Production**: Run `npm run start` (configured for deployment)

## System Architecture

### UI/UX Decisions
The design embraces a dark gaming aesthetic with golden accents, consistent with the Legion expansion. UI components are built using shadcn/ui on Radix UI primitives and styled with Tailwind CSS, ensuring accessibility and customizability. Key decisions include integrating the player panel into the main navigation for a cohesive experience, an admin panel with clear visual separation and dynamic badging, and a redesigned player panel featuring modern gradient cards, dynamic color coding, and neon-colored labels. Navigation buttons utilize meaningful emojis, and the homepage stats feature a symmetric, responsive grid layout with enhanced typography. Recent updates include an elegant container design for narrative content in the hero section, incorporating semi-transparent backgrounds and golden border frameworks. The support system aligns with the AetherWoW aesthetic, using blue/cyan themes and professional layouts.

**Admin Panel Design Unification (September 29, 2025):**
All admin management sections now follow a consistent, unified design pattern:
- **Header Section**: Semi-transparent background with title, description, and primary action button with golden accent
- **Counter Display**: Visual indicator showing the number of configured items
- **Content Grid**: Responsive grid layout (2 columns on desktop, 1 on mobile) with hover effects
- **Card Design**: Consistent spacing, typography, and action buttons across all sections
- **Unified Components**: ServerNewsManager, WebFeaturesManager, DownloadsManager, and SiteSettingsManager all share the same visual language

### Technical Implementations

#### Frontend
The frontend is built with React/TypeScript and Vite. Wouter handles client-side routing, TanStack Query manages server state, and React Hook Form with Zod ensures type-safe form validation. The architecture prioritizes modularity, reusable components, comprehensive theming, and an integrated support system with role-based content display.

#### Backend
The backend is an Express.js application written in TypeScript, featuring a modular structure that abstracts database operations via a storage interface. It handles user registration, authentication, data retrieval, dynamic content management (web features, news, downloads), secure file uploads, and a comprehensive support ticket management system. It includes organized routes, error handling, authentication middleware, and Zod schema validation.

#### Dynamic Content and Site Settings
The system supports dynamic management of web features, downloads, server news, and essential site settings (title, favicon, SEO). It offers flexible image options for content (predefined, external URLs, file upload) and includes an auto-initialization system for default site settings.

#### Authentication and Authorization
Features secure user registration and login with PBKDF2 password hashing and session management via HTTP-only cookies. An 8-level GM hierarchy (Player to Administrator) is implemented with role-based access control.

#### Support Ticket System
A comprehensive system allows users to create, track, and manage support requests. It includes categorized tickets (general, technical, account, billing, other), priority levels (low, normal, high, urgent), and status tracking (open, in_progress, resolved, closed), with role-based access for both users and administrators.

### System Design Choices

#### Data Storage
The application uses Drizzle ORM with PostgreSQL (Neon Database) and Drizzle Kit for migrations. A MemStorage fallback provides full functionality when PostgreSQL is unavailable. User data includes UUIDs, username, email, password, role, coins, ban status, and login timestamps.

**Development Mode Configuration:**
- **Fallback Storage**: Automatic MemStorage when DATABASE_URL is unavailable.
- **Default Admin Access**: Username: `admin`, Password: `admin123` (Role: Administrador).
- **Sample Data**: Pre-loaded web features and site settings for immediate testing.
- **Replit Deployment**: Configured for autoscale with proper host allowance and port binding.

**Database Tables:**
- `users`: Enhanced user management with role hierarchy, coins, ban management, and login tracking.
- `user_sessions`: Secure session management.
- `web_features`: Dynamic content.
- `downloads`: Dynamic download management.
- `server_news`: News and announcements.
- `site_settings`: Site configuration.
- `support_tickets`: Complete support ticket system.

## Recent Updates

### Support Page UI/UX Improvements (October 4, 2025)
Comprehensive visual enhancements to the Support Page (`client/src/pages/SoportePage.tsx`):

**Ticket Creation Form:**
- Increased input field height for "Imagen (opcional)" to properly display file selection button (h-14 with py-3)
- Removed emoji from "Crear Nuevo Ticket" button for cleaner professional look

**Ticket List Display:**
- Redesigned ticket cards to be compact with horizontal layout
- Added "Ver" button for viewing full ticket conversations
- Removed detailed description and images from list view for better overview
- Implemented color-coded visual system:
  - **Status badges**: Abierto (green), En Progreso (yellow), Resuelto (blue), Cerrado (red)
  - **Priority badges**: Baja (green), Normal (blue), Alta (orange), Urgente (red)
  - **Category badges**: General (purple), Técnico (cyan), Cuenta (indigo), Donaciones (amber), Otro (gray)
- Added clear labels: "Estado:", "Prioridad:", "Categoría:" for improved differentiation
- Enhanced date display with calendar icon and formatted date: "dd de MMMM, yyyy"
- All categories now display in Spanish (Technical → Técnico, Account → Cuenta, etc.)

**Header Section:**
- Redesigned "Centro de Soporte" header with elegant card container
- Removed descriptive text to reduce vertical space
- Added "Equipo disponible 24/7" indicator with animated green pulse dot
- Maintains professional gradient styling consistent with site theme

**Contact Options:**
- Updated all contact methods (Discord, Email, Ticket de Soporte) with color-coded backgrounds
- Discord: Purple gradient, Email: Blue gradient, Ticket de Soporte: Green gradient with "Activo" badge
- All contact cards now use consistent circular icon containers
- Changed Ticket de Soporte from "Próximamente" to active status

**Removed Sections:**
- Eliminated "Estado del Servidor" section to streamline page focus

All changes maintain dark gaming aesthetic with proper color hierarchy and professional appearance optimized for user experience.

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