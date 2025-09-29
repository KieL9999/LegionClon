# Legion Gaming Server Website

## Overview
This project is a World of Warcraft Legion private server website, Legion Plus, designed to be a central hub for its community. It aims to enhance player engagement and server promotion by offering features such as user registration, server information, news management, player rankings, and interactive community functionalities. The website is styled with a dark, Legion-themed gaming aesthetic and supports custom content.

## Recent Changes (September 29, 2025)
### Header Modernization and UI Enhancement
- ✅ **Complete Header Redesign**: Revolutionary modernization of the navigation dashboard with glassmorphism effects and advanced styling
- ✅ **Clean Minimalist Design**: Removed all emojis from navigation buttons (Inicio, Noticias, Rankings, Foro, Descargar) for professional appearance
- ✅ **Logo Optimization**: Eliminated logo and "Legion Plus" text from header for ultra-clean aesthetic
- ✅ **Server Status Enhancement**: Redesigned "247 jugadores conectados" counter with:
  - Professional glassmorphism card design with gradients and blur effects
  - Enhanced icon with golden resplandor and circular background
  - Improved typography hierarchy: large "247", "ONLINE" status, "JUGADORES CONECTADOS" subtitle
  - Advanced visual effects with shadows, borders, and hover animations
- ✅ **Navigation Symmetry**: Perfectly balanced layout with proper spacing between elements
- ✅ **Premium Button Styling**: Donación (green gradient) and Tienda (purple gradient) with distinctive colors
- ✅ **Enhanced Spacing**: Optimized gaps between player counter, navigation, and user action buttons
- ✅ **Glassmorphism Framework**: Implemented comprehensive blur effects, gradients, and modern transparency
- ✅ **Professional User Controls**: Refined "Iniciar Sesión", "Registro", and "¡JUGAR AHORA!" buttons with proper separation

### UI/UX Architecture Updates
- **Modern Design Language**: Transitioned to sophisticated glassmorphism with golden accent palette
- **Enhanced Visual Hierarchy**: Clear separation between functional areas with professional spacing
- **Responsive Excellence**: All changes maintain perfect responsiveness across screen sizes
- **Performance Optimized**: Efficient CSS with hardware-accelerated animations and blur effects

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
The application uses Drizzle ORM with PostgreSQL (Neon Database), with Drizzle Kit managing migrations. User data includes UUID-based primary keys, username, email, password, role fields, coins, ban status, ban reason, and last login timestamps.

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