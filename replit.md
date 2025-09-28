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
The application utilizes Drizzle ORM with PostgreSQL (Neon Database). The schema includes UUID-based primary keys for user management, with Drizzle Kit managing migrations. User data includes username, email, password, role fields, and timestamps, all with validation. A `web_features` table stores dynamic content for the website. The database is integrated with Replit's PostgreSQL service.

### Authentication and Authorization
The system features a secure user registration and login system with password hashing (PBKDF2) and session management via HTTP-only cookies. It implements a 7-level GM hierarchy (Player, GM Aspirant, GM Soporte, GM Eventos, GM Superior, GM Jefe, Community Manager, Administrador) with role-based access control for administrative functions and content editing. Client-side and server-side validation using Zod schemas ensure data integrity and security.

### UI/UX Decisions
The design adopts a dark gaming aesthetic with golden accents, consistent with the Legion expansion. UI components are accessible and customizable. The player panel is integrated into the main navigation for a cohesive user experience. The admin panel features clear visual separation between GMs and players, dynamic badges, golden gradients for GMs, crown icons, and a reorganized structure into "Game Administration" and "Web Settings" sections for improved usability.

#### Web Features Management
- **Triple Image Options**: Administrators can use predefined images, external URLs, or upload files from PC
- **Dynamic Image Resolution**: System automatically detects and displays the correct image type
- **Visual Upload Feedback**: Real-time upload progress and success/error notifications
- **Smart Type Detection**: Automatic detection of image type when editing existing features
- **Responsive Design**: All interfaces work seamlessly across desktop and mobile devices

## Current System Status
- **Database**: PostgreSQL with 1 administrator user (kiel), 3 test web features
- **File System**: Upload directory configured at `/public/uploads/`
- **Authentication**: Session-based with HTTP-only cookies
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

### User Management
- **Role Hierarchy**: 8-level system from Player to Administrator
- **Current Admin**: User "kiel" with full administrator privileges
- **Session Management**: Secure cookie-based authentication
- **Password Security**: PBKDF2 hashing with salt