# Legion Gaming Server Website

## Overview
This project is a World of Warcraft Legion private server website, Legion Plus, designed to be a central hub for its community. It aims to enhance player engagement and server promotion by offering features such as user registration, server information, news management, player rankings, and interactive community functionalities. The website is styled with a dark, Legion-themed gaming aesthetic and supports custom content.

## Recent Changes (September 29, 2025)

### Project Setup and Replit Environment Configuration
- ✅ **GitHub Import Completion**: Successfully imported Legion Plus project from GitHub repository
- ✅ **Replit Environment Setup**: Configured Node.js environment with all dependencies
- ✅ **Frontend Host Configuration**: Properly configured Vite to allow all hosts for Replit proxy compatibility
- ✅ **Workflow Configuration**: Set up automated workflow on port 5000 with webview output for seamless preview
- ✅ **Database Fallback Implementation**: Added MemStorage class as fallback when PostgreSQL is unavailable
  - Complete CRUD operations for all data models (users, sessions, webFeatures, serverNews, downloads, siteSettings)
  - Default admin user (username: admin, password: admin123) for testing
  - Sample data initialization for immediate functionality
- ✅ **Deployment Configuration**: Configured autoscale deployment target with proper build and run commands
- ✅ **Development Environment**: Application running successfully with live reload and error handling

### Header Modernization and Player Experience Enhancement
- ✅ **Player Counter Optimization**: Refined "247 jugadores conectados" display:
  - **Removed "ONLINE" text** as requested for cleaner appearance
  - **Centered layout** with improved typography alignment
  - Maintained professional glassmorphism design with golden accents
- ✅ **Integrated Player Dashboard**: Revolutionary always-visible player information system:
  - **No-Click Access**: Player stats visible without dropdown interaction on large screens (XL+)
  - **Live Player Stats**: Real-time display of coins, VIP level, and account status
  - **Smart Responsive Design**: Full dashboard on desktop, compact dropdown on mobile
  - **Quick Actions**: Direct access buttons for settings and logout
  - **Visual Excellence**: Dynamic color coding for VIP levels and account status
  - **Professional Glassmorphism**: Consistent with overall design language

### Technical Implementation Details
- **Responsive Breakpoints**: XL screens show full dashboard, smaller screens use enhanced dropdown
- **Data Integration**: Direct connection to user context for real-time updates
- **Performance Optimized**: Efficient rendering with proper fallbacks for undefined values
- **Accessibility**: Added comprehensive data-testid attributes for testing
- **Code Quality**: Clean implementation with TypeScript safety and proper error handling

### UI/UX Architecture Updates
- **Modern Design Language**: Enhanced glassmorphism with golden accent palette
- **Always-Available Information**: Critical player data visible without interaction
- **Enhanced Visual Hierarchy**: Clear separation between functional areas with professional spacing
- **Responsive Excellence**: Perfect adaptation across all screen sizes
- **Performance Optimized**: Hardware-accelerated animations and efficient rendering

## User Preferences
Preferred communication style: Simple, everyday language.

## System Architecture

### UI/UX Decisions
The design adopts a dark gaming aesthetic with golden accents, consistent with the Legion expansion. UI components are accessible and customizable, built with shadcn/ui on Radix UI primitives and styled with Tailwind CSS. The player panel is integrated into the main navigation for a cohesive user experience. The admin panel features clear visual separation, dynamic badges, golden gradients for GMs, crown icons, and a reorganized structure into "Game Administration" and "Web Settings" for improved usability. The player panel has been redesigned with modern gradient cards for statistics, including dynamic color coding for account status and neon-colored labels. Navigation buttons utilize meaningful emojis, and the homepage stats section features a symmetric, responsive grid layout with uniform card heights and enhanced typography.

### Technical Implementations

#### Frontend
The frontend uses React/TypeScript with Vite. Wouter handles client-side routing, TanStack Query manages server state, and React Hook Form with Zod provides type-safe form validation. The architecture emphasizes modularity with reusable components and comprehensive theming.

#### Backend
The backend is an Express.js application written in TypeScript with a modular structure. It abstracts database operations via a storage interface with PostgreSQL integration. The API layer handles user registration, authentication, data retrieval, dynamic content management (web features), and secure file uploads. It features organized routes, comprehensive error handling, authentication middleware, and validation with Zod schemas.

#### File Upload System
Secure file uploads are handled with Multer, including type validation (images only) and size limits (5MB). Authentication middleware ensures only administrators can upload files, which are stored in `/public/uploads/` with unique naming.

#### Dynamic Content and Site Settings
The system supports dynamic management of web features, downloads, server news, and site settings (title, favicon, SEO). It offers a triple image option for content (predefined, external URLs, file upload) and includes an auto-initialize system for default site settings.

#### Authentication and Authorization
The system features secure user registration and login with PBKDF2 password hashing and session management via HTTP-only cookies. It implements an 8-level GM hierarchy (Player to Administrator) with role-based access control.

#### Enhanced Player Panel System
The player panel includes gradient cards for player statistics: Donation Coins, Account Status (active/banned), Last Login, and Membership Date. It also features detailed account information, ban management displays, and responsive real-time data updates.

### System Design Choices

#### Data Storage
The application uses Drizzle ORM with PostgreSQL (Neon Database) when available, with Drizzle Kit managing migrations. A MemStorage fallback provides complete functionality when PostgreSQL is unavailable. User data includes UUID-based primary keys, username, email, password, role fields, coins, ban status, ban reason, and last login timestamps.

**Development Mode Configuration:**
- **Fallback Storage**: Automatic MemStorage when DATABASE_URL is unavailable
- **Default Admin Access**: Username: `admin`, Password: `admin123` (Role: Administrador)
- **Sample Data**: Pre-loaded web features and site settings for immediate testing
- **Replit Deployment**: Configured for autoscale with proper host allowance and port binding

**Database Tables:**
- `users`: Enhanced user management with 8-level role hierarchy, coins, ban management, and login tracking.
- `user_sessions`: Secure session management.
- `web_features`: Dynamic content management for the website.
- `downloads`: Dynamic download management system.
- `server_news`: News and announcements system.
- `site_settings`: Site configuration management (title, favicon, SEO, etc.).

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