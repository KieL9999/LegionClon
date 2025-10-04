# AetherWoW Gaming Server Website

## Overview
AetherWoW is a World of Warcraft Legion private server website designed to be a central community hub. It aims to enhance player engagement and server promotion through features like user registration, server information, news management, player rankings, and interactive community functionalities, all styled with a dark, Legion-themed gaming aesthetic and supporting custom content. The project has recently undergone a complete brand transformation from "Legion Plus" to "AetherWoW," and significant UI/UX improvements have been made, including a comprehensive support ticket system.

## User Preferences
Preferred communication style: Simple, everyday language.

## Replit Setup (October 4, 2025 - Latest Fresh Import)
This project was successfully imported from GitHub and configured to run in the Replit environment:

### Environment Configuration
- **Runtime**: Node.js 20 with TypeScript
- **Port**: 5000 (frontend and backend on same port)
- **Host**: 0.0.0.0 (required for Replit proxy)
- **Database**: PostgreSQL (Replit managed database via DATABASE_URL)
- **Development Server**: Vite dev server with HMR and allowedHosts: true
- **Build System**: Vite + esbuild

### Fresh Import Setup Completed (October 4, 2025 - Latest)
1. **Database Connection**: Verified DATABASE_URL exists and database schema is in sync
2. **Vite Configuration**: Confirmed `allowedHosts: true` in server/vite.ts for Replit proxy support
3. **Workflow Configuration**: Set up "Start application" workflow with:
   - Command: `npm run dev`
   - Port: 5000
   - Output Type: webview
4. **Deployment Configuration**: Configured autoscale deployment with:
   - Build: `npm run build`
   - Run: `npm run start`
5. **Git Configuration**: Updated .gitignore to properly exclude node_modules, dist, env files, logs, and uploads
6. **Application Verification**: Tested homepage and support page - all routes and frontend working correctly
7. **WebSocket Server**: Real-time chat for support tickets configured and functional

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

**Real-Time Chat System (October 4, 2025):**
Implemented a full real-time chat system for support tickets enabling instant communication between users and staff:
- **WebSocket Server**: Dedicated WebSocket endpoint at `/ws` for real-time message delivery
- **Authentication**: Secure WebSocket authentication using httpOnly session cookies from HTTP upgrade request
- **Message Storage**: New `ticket_messages` database table with sender tracking and timestamps
- **Chat Interface**: Modern chat UI in TicketDetailPage with message history, real-time updates, and auto-scroll
- **REST API**: Endpoints for fetching ticket details with messages and creating new messages
- **Subscription System**: Clients subscribe to specific tickets and receive instant updates when new messages arrive
- **Security**: Session-based authentication ensures only authorized users can view and send messages

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
- `ticket_messages`: Real-time chat messages for support tickets with sender tracking and timestamps.

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

### GM Role-Based Support View (October 4, 2025 - Latest)
Implemented role-based access control for the Support Page to provide different experiences for GMs and players:

**GM View (All GM Levels 1-7):**
- GMs now see ALL tickets from all users, not just their own tickets
- Uses `/api/admin/tickets` endpoint instead of `/api/tickets`
- Title displays "Todos los Tickets de Soporte" with explanatory subtitle
- Each ticket card shows:
  - **User ID Badge**: Purple badge displaying the first 8 characters of the ticket creator's ID
  - **Assigned To Badge**: Cyan badge showing GM assignment when ticket is assigned (first 8 characters)
  - All standard ticket information (status, priority, category, date)
- Empty state message: "No hay tickets pendientes - Todos los tickets de soporte aparecerán aquí cuando los jugadores los creen"

**Player View:**
- Players see only their own tickets (existing behavior)
- Uses `/api/tickets` endpoint
- Title displays "Mis Tickets de Soporte"
- Standard ticket display without GM-specific information
- Empty state message: "No tienes tickets aún - Crea tu primer ticket de soporte para obtener ayuda con cualquier problema"

**Technical Implementation:**
- Role check: `const isGM = user?.role !== USER_ROLES.PLAYER`
- Dynamic query key based on role for proper cache management
- Both query keys invalidated on ticket creation
- Conditional rendering of GM-specific badges and information
- All changes maintain responsive design and dark gaming aesthetic

### Ticket Management System Enhancements (October 4, 2025 - Latest)
Major improvements to ticket closure workflow and organization:

**Close Ticket with Resolution Status:**
- GMs can now close tickets with resolution status via dialog:
  - **"Sí, Resuelto"**: Marks ticket as `resolved` (problema resuelto exitosamente)
  - **"No, Cerrar sin Resolver"**: Marks ticket as `closed` (cerrado sin resolver)
- Close button appears for GMs who have taken the ticket
- Button only available for tickets in `open` or `in_progress` status

**Tabs for Active and Closed Tickets:**
- Support page now has two tabs for better organization:
  - **"Tickets Activos"**: Shows tickets with status `open` or `in_progress`
  - **"Tickets Cerrados"**: Shows tickets with status `resolved` or `closed`
- Both players and GMs can view tickets in both tabs
- Closed tickets have distinct visual styling (slightly transparent) to differentiate from active tickets

**Persistent Ticket History:**
- All tickets remain in the system after closure for review and audit purposes
- GMs can review all closed tickets to track resolution patterns
- Players can access their complete ticket history
- Closed tickets are fully viewable with complete conversation history

**Active Users:**
- User "kiel" (ID: 4b856e14-4b65-4b99-93fd-8db8337607c4) has been granted Administrador (Level 7) role for testing and administration purposes

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