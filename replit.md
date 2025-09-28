# Legion Gaming Server Website

## Overview
This project is a World of Warcraft Legion private server website, Legion Plus, featuring custom content. The site aims to be a central hub for the Legion Plus community, enhancing player engagement and server promotion. It offers user registration, server information, news management, player rankings, and interactive community features, all styled with a dark, Legion-themed gaming aesthetic.

## Recent Changes (September 28, 2025)
- ✅ **Fresh GitHub Import Setup**: Successfully imported fresh clone from GitHub and configured for Replit environment 
- ✅ **Replit Environment Configuration**: Complete setup with nodejs-20, port 5000 webview workflow, and proxy configuration
- ✅ **Frontend Proxy Configuration**: Properly configured Vite with allowedHosts: true for Replit iframe compatibility
- ✅ **Workflow Setup**: Configured "Start application" workflow with webview output type on port 5000
- ✅ **Deployment Configuration**: Set up autoscale deployment with npm build and start commands
- ✅ **VIP System Enhancement**: Revolutionary upgrade from emoji-based to number-based VIP levels
  - **VIP Level 0**: Number "0" with gray color scheme (Sin VIP)
  - **VIP Level 1**: Number "1" with amber/bronze color scheme (VIP Bronce)
  - **VIP Level 2**: Number "2" with silver color scheme (VIP Plata)
  - **VIP Level 3**: Number "3" with gold/yellow color scheme (VIP Oro)
  - **VIP Level 4**: Number "4" with cyan/blue color scheme (VIP Platino)
  - **VIP Level 5**: Number "5" with purple color scheme (VIP Diamante)
- ✅ **Admin Account Configuration**: Enhanced user "kiel" setup:
  - Administrator Level 7 privileges granted
  - VIP Level 3 (Oro) assigned for testing
  - Banned status with demonstration reason
  - Ready for testing banned account display functionality
- ✅ **Database Integration**: All PostgreSQL features fully functional and tested
- ✅ **Application Verification**: Complete end-to-end testing confirmed working
- ✅ **Multiple Image Support**: Implemented 3-way image system for web features (predefined, URL external, file upload)
- ✅ **File Upload System**: Added secure file upload with multer, authentication, and validation
- ✅ **Security Enhancements**: Fixed authentication middleware ordering for upload security
- ✅ **Dynamic Downloads System**: Converted DownloadModal from static hardcoded content to dynamic API-driven system
- ✅ **Site Settings Management**: Implemented complete system for dynamic site configuration (title, favicon, SEO)
- ✅ **SEO & Meta Enhancement**: Added dynamic meta tags, Open Graph, and favicon management through admin interface
- ✅ **Site Configuration API**: Complete CRUD API for site settings with validation and admin-only access
- ✅ **Auto-Initialize System**: Built-in functionality to initialize default site settings with one-click admin action
- ✅ **Enhanced Player Panel**: Complete redesign with modern UI and new player features
- ✅ **Player Database Enhancement**: Added coins, ban status, ban reason, and last login tracking
- ✅ **Visual Player Stats**: Beautiful gradient cards displaying player information
- ✅ **Automatic Login Tracking**: System now automatically updates last login timestamp on user authentication
- ✅ **Coins Display Enhancement**: Added golden "Monedas" card with 💰 emoji to player stats section
- ✅ **Account Information Redesign**: Completely renovated with modern glassmorphism design, perfect symmetry, and consistent heights
- ✅ **Security Streamlining**: Removed "Cambiar Email" functionality as requested for security compliance
- ✅ **Rankings Navigation Fix**: Fixed "Rankings" button in header to properly navigate to rankings section on homepage

## User Preferences
Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend
The frontend uses React/TypeScript with Vite, building UI components with shadcn/ui on Radix UI primitives. Styling is managed by Tailwind CSS, featuring a custom dark gaming theme with golden accents. Wouter handles client-side routing, TanStack Query manages server state, and React Hook Form with Zod provides type-safe form validation. The architecture emphasizes modularity with reusable components and comprehensive theming.

### Backend
The backend is an Express.js application written in TypeScript, featuring a modular structure. It abstracts database operations via a storage interface with PostgreSQL integration. The API layer handles user registration, authentication, data retrieval, dynamic content management (web features), and secure file uploads. Features organized routes, comprehensive error handling, authentication middleware, and validation with Zod schemas.

#### File Upload System
- **Multer Integration**: Secure file uploads with type validation (images only) and size limits (5MB)
- **Authentication First**: Middleware ensures only authenticated administrators can upload files
- **Storage Management**: Files stored in `/public/uploads/` with unique naming to prevent conflicts
- **Security Features**: Pre-upload authentication check, automatic cleanup on errors

### Data Storage
The application utilizes Drizzle ORM with PostgreSQL (Neon Database). The schema includes UUID-based primary keys for user management, with Drizzle Kit managing migrations. User data includes username, email, password, role fields, and timestamps, all with validation. 

**Database Tables:**
- `users`: Enhanced user management with 8-level role hierarchy, coins system, ban management, and login tracking
- `user_sessions`: Secure session management
- `web_features`: Dynamic content management for website
- `downloads`: Dynamic download management system
- `server_news`: News and announcements system
- `site_settings`: Site configuration management (title, favicon, SEO, etc.)

**Enhanced Users Table Schema:**
- `id`: UUID primary key
- `username`, `email`, `password`: Basic account information
- `role`: 8-level hierarchy from player to administrator
- `coins`: Integer for donation coin system (default: 0)
- `is_banned`: Boolean flag for account suspension status
- `ban_reason`: Text field for ban justification
- `last_login`: Timestamp tracking user's last authentication
- `created_at`, `updated_at`: Standard timestamps

The database is integrated with Replit's PostgreSQL service with automatic schema synchronization via `npm run db:push --force`.

### Authentication and Authorization
The system features a secure user registration and login system with password hashing (PBKDF2) and session management via HTTP-only cookies. It implements a 7-level GM hierarchy (Player, GM Aspirant, GM Soporte, GM Eventos, GM Superior, GM Jefe, Community Manager, Administrador) with role-based access control for administrative functions and content editing. Client-side and server-side validation using Zod schemas ensure data integrity and security.

### UI/UX Decisions
The design adopts a dark gaming aesthetic with golden accents, consistent with the Legion expansion. UI components are accessible and customizable. The player panel is integrated into the main navigation for a cohesive user experience. The admin panel features clear visual separation between GMs and players, dynamic badges, golden gradients for GMs, crown icons, and a reorganized structure into "Game Administration" and "Web Settings" sections for improved usability.

### Enhanced Player Panel System
**Complete Redesign with Modern UI (September 28, 2025):**
The player panel has been completely redesigned with a modern, visually appealing interface featuring gradient cards and comprehensive player statistics.

**Player Statistics Cards:**
1. **💰 Donation Coins Card**: 
   - Golden gradient design showing player's coin balance
   - Displays total coins earned through donations
   - Starting balance: 0 coins for new players

2. **🛡️ Account Status Card**:
   - Dynamic color coding: Green for active accounts, Red for banned accounts
   - Clear visual indicator: "ACTIVO" or "BANEADO"
   - Shield icon with status-appropriate coloring

3. **📅 Last Login Card**:
   - Blue gradient showing last connection timestamp
   - Automatically updated on each login
   - Shows "Primera vez" for first-time users

4. **👤 Membership Card**:
   - Purple gradient displaying registration date
   - Shows account creation timestamp
   - Member since information

**Detailed Account Information:**
- Enhanced user information section with role badges
- Account activity tracking (days of membership)
- Last activity with full timestamp
- Ban information panel (visible only when banned)
- Comprehensive statistics grid

**Ban Management System:**
- Visual ban status indicators throughout the interface
- Dedicated ban information section with reason display
- Admin-only ban/unban functionality
- Automatic status updates across all components

**Technical Implementation:**
- Responsive design working on all screen sizes
- Real-time data updates using TanStack Query
- Proper TypeScript typing for all new fields
- Secure backend integration with validation

#### Advanced Content Management Features
- **Triple Image Options**: Administrators can use predefined images, external URLs, or upload files from PC
- **Dynamic Image Resolution**: System automatically detects and displays the correct image type
- **Visual Upload Feedback**: Real-time upload progress and success/error notifications
- **Smart Type Detection**: Automatic detection of image type when editing existing features
- **Responsive Design**: All interfaces work seamlessly across desktop and mobile devices
- **Real-time Configuration**: Site title, favicon, and SEO settings update immediately
- **One-click Initialization**: Automatic setup of default configurations for new installations
- **Comprehensive Validation**: All inputs validated with Zod schemas on frontend and backend
- **Cache Invalidation**: TanStack Query ensures UI stays synchronized with database changes

## Current System Status
- **Database**: PostgreSQL with enhanced user schema including coins, ban system, and login tracking
- **File System**: Upload directory configured at `/public/uploads/`
- **Authentication**: Session-based with HTTP-only cookies and automatic last login tracking
- **Site Configuration**: Dynamic title, favicon, and SEO management system active
- **APIs**: Complete REST endpoints for all content management and user tracking
- **Admin Interface**: Full administrative control panel with all management tools
- **Player Panel**: Modern redesigned interface with gradient cards and comprehensive statistics
- **User Management**: Enhanced with coins system, ban management, and activity tracking
- **Deployment**: Configured for Replit autoscale deployment
- **Development Server**: Running on port 5000 with hot reload
- **Security**: Full authentication and authorization implemented
- **Administrator**: User "kiel" configured with level 7 administrator privileges

## External Dependencies
- **UI Frameworks**: Radix UI, shadcn/ui
- **Styling**: Tailwind CSS
- **Form Management**: React Hook Form, Zod, Hookform Resolvers
- **Icons**: Lucide React, React Icons
- **Database**: PostgreSQL (Neon serverless driver), Drizzle ORM, Drizzle Kit
- **File Upload**: Multer, @types/multer
- **Fonts**: Google Fonts (Inter, Orbitron)
- **Build Tools**: Vite
- **State Management/Data Fetching**: TanStack Query
- **Routing**: Wouter

## System Features
### Image Management System
1. **Predefined Images**: Traditional system using imported assets
2. **External URLs**: Support for any HTTPS image URL
3. **File Upload**: Secure upload system for custom images
   - Authentication required (administrator only)
   - File type validation (images only)
   - Size limit enforcement (5MB maximum)
   - Automatic cleanup on errors

### Site Settings Management System
**Complete Dynamic Configuration:**
1. **Dynamic Title Management**: Site title changes apply automatically across all pages
2. **Favicon Management**: Support for custom favicon with real-time updates
3. **SEO Optimization**: Dynamic meta descriptions and Open Graph tags
4. **Admin Interface**: User-friendly configuration panel in admin section
5. **Auto-Initialize**: One-click setup of default site configurations
6. **Real-time Updates**: Changes apply immediately without server restart

**Technical Implementation:**
- `site_settings` table with key-value configuration storage
- REST API endpoints: GET/POST/PATCH `/api/site-settings`
- React hook `useSiteSettings` for real-time document updates
- Admin-only access with comprehensive validation
- Automatic default settings initialization

### Content Management Systems
1. **Web Features**: Dynamic homepage content management
2. **Downloads**: Dynamic download links and descriptions
3. **Server News**: News and announcements system
4. **Site Settings**: Complete site configuration management

### User Management
- **Role Hierarchy**: 8-level system from Player to Administrator
- **Current Admin**: User "kiel" with full administrator privileges
- **Session Management**: Secure cookie-based authentication
- **Password Security**: PBKDF2 hashing with salt

### API Endpoints
**Public Endpoints:**
- `GET /api/site-settings` - Fetch site configuration
- `GET /api/web-features` - Homepage content
- `GET /api/downloads` - Download information
- `GET /api/server-news` - News and announcements

**Admin-Only Endpoints:**
- `POST /api/site-settings` - Create site setting
- `PATCH /api/site-settings/:key` - Update site setting
- Complete CRUD for all content management systems
- File upload endpoints with security validation