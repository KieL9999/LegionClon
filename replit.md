# Legion Gaming Server Website

## Overview
This project is a World of Warcraft Legion private server website, Legion Plus, featuring custom content. The site aims to be a central hub for the Legion Plus community, enhancing player engagement and server promotion. It offers user registration, server information, news management, player rankings, and interactive community features, all styled with a dark, Legion-themed gaming aesthetic.

## Recent Changes (September 28, 2025)
- ✅ **Project Import & Setup**: Successfully imported from GitHub and configured for Replit environment
- ✅ **Multiple Image Support**: Implemented 3-way image system for web features (predefined, URL external, file upload)
- ✅ **File Upload System**: Added secure file upload with multer, authentication, and validation
- ✅ **Admin User Setup**: Configured user "kiel" with administrator level 7 privileges
- ✅ **Security Enhancements**: Fixed authentication middleware ordering for upload security
- ✅ **Database Integration**: All features tested and working with PostgreSQL
- ✅ **Dynamic Downloads System**: Converted DownloadModal from static hardcoded content to dynamic API-driven system
- ✅ **Site Settings Management**: Implemented complete system for dynamic site configuration (title, favicon, SEO)
- ✅ **SEO & Meta Enhancement**: Added dynamic meta tags, Open Graph, and favicon management through admin interface
- ✅ **Site Configuration API**: Complete CRUD API for site settings with validation and admin-only access
- ✅ **Auto-Initialize System**: Built-in functionality to initialize default site settings with one-click admin action

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
- `users`: User management with 8-level role hierarchy
- `user_sessions`: Secure session management
- `web_features`: Dynamic content management for website
- `downloads`: Dynamic download management system
- `server_news`: News and announcements system
- `site_settings`: Site configuration management (title, favicon, SEO, etc.)

The database is integrated with Replit's PostgreSQL service with automatic schema synchronization via `npm run db:push --force`.

### Authentication and Authorization
The system features a secure user registration and login system with password hashing (PBKDF2) and session management via HTTP-only cookies. It implements a 7-level GM hierarchy (Player, GM Aspirant, GM Soporte, GM Eventos, GM Superior, GM Jefe, Community Manager, Administrador) with role-based access control for administrative functions and content editing. Client-side and server-side validation using Zod schemas ensure data integrity and security.

### UI/UX Decisions
The design adopts a dark gaming aesthetic with golden accents, consistent with the Legion expansion. UI components are accessible and customizable. The player panel is integrated into the main navigation for a cohesive user experience. The admin panel features clear visual separation between GMs and players, dynamic badges, golden gradients for GMs, crown icons, and a reorganized structure into "Game Administration" and "Web Settings" sections for improved usability.

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
- **Database**: PostgreSQL with 1 administrator user (kiel), complete schema with 6 tables
- **File System**: Upload directory configured at `/public/uploads/`
- **Authentication**: Session-based with HTTP-only cookies
- **Site Configuration**: Dynamic title, favicon, and SEO management system active
- **APIs**: Complete REST endpoints for all content management
- **Admin Interface**: Full administrative control panel with all management tools
- **Deployment**: Configured for Replit autoscale deployment
- **Development Server**: Running on port 5000 with hot reload
- **Security**: Full authentication and authorization implemented

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