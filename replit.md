# Legion Gaming Server Website

## Overview
This project is a World of Warcraft Legion private server website, Legion Plus, featuring custom content. It uses a React/TypeScript frontend and an Express.js backend. The site offers user registration, server information, news management, player rankings, and interactive community features, all styled with a dark, Legion-themed gaming aesthetic. The business vision is to provide a central hub for the Legion Plus community, enhancing player engagement and server promotion with a professional and immersive online presence.

## User Preferences
Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend
The frontend uses React/TypeScript with Vite for building. UI components are built with shadcn/ui on Radix UI primitives, styled using Tailwind CSS with a custom dark gaming theme and golden accents. Wouter handles client-side routing, TanStack Query manages server state, and React Hook Form with Zod provides type-safe form validation. The component architecture is modular, featuring reusable UI, feature-specific, and page-level components, with comprehensive theming via CSS custom properties.

### Backend
The backend is an Express.js application written in TypeScript, featuring a modular structure. It abstracts database operations via a storage interface, currently in-memory but designed for persistent storage migration. The API layer handles user registration, authentication, and data retrieval, with organized routes, error handling, and middleware for logging and validation. Development is supported by Vite's hot module replacement.

### Data Storage
The application utilizes Drizzle ORM with PostgreSQL (Neon Database). The schema includes UUID-based primary keys for user management, with Drizzle Kit managing migrations. User data encompasses username, email, password, role fields, and timestamps, all with validation. The database is integrated with Replit's PostgreSQL service.

### Authentication and Authorization
User authentication features a registration system with email and username validation. Password handling adheres to security best practices. The system includes user session management and credential validation. Client-side validation uses Zod schemas, complemented by server-side validation. Error handling provides clear feedback for registration issues. The system supports a 7-level GM hierarchy with distinct roles (Player, GM Aspirant, GM Soporte, GM Eventos, GM Superior, GM Jefe, Community Manager, Administrador) and role-based access control for administrative functions.

### UI/UX Decisions
The design emphasizes a dark gaming aesthetic with golden accents, consistent with the Legion expansion. UI components are accessible and customizable. The player panel is fully integrated into the main navigation, not isolated, ensuring a cohesive user experience. The admin panel features clear visual separation between GMs and players, dynamic badges, golden gradients for GMs, and crown icons. All interfaces are responsive across desktop, tablet, and mobile.

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

## Recent Changes

### 28 de septiembre de 2025 - PANEL ADMINISTRATIVO AVANZADO COMPLETADO
- **Panel Administrativo Completamente Renovado**
  - **Estadísticas completas de jerarquía GM**: Visualización individual de los 7 niveles con conteos en tiempo real
  - **Separación visual clara**: GMs y jugadores en secciones distintas con diseños diferenciados
  - **Botones de acción rápida**: "Promover a GM" para jugadores y "Expulsar GM" para degradar
  - **Interfaz intuitive**: Badges dinámicos, gradientes dorados para GMs, iconos Crown distintivos
  - **Responsive design**: Adaptación completa a escritorio, tablet y móvil
- **Funcionalidades Administrativas Avanzadas**
  - **Dashboard de estadísticas**: Total de GMs, jugadores, distribución por nivel
  - **Gestión granular de roles**: Selector dropdown para cambios precisos de nivel
  - **Prevención de errores**: No auto-modificación, validación completa de roles
  - **Feedback visual**: Estados de carga, confirmaciones toast, badges diferenciados
- **Base de Datos y Seguridad**
  - **6 usuarios de prueba**: Admin, Community Manager, GM Eventos, GM Soporte, 2 jugadores
  - **Validación Zod completa**: Esquemas seguros para cambios de rol
  - **Endpoints protegidos**: Solo GMs pueden acceder a funciones administrativas
  - **Logs de auditoría**: Registro de todos los cambios de roles
- **UX/UI Optimizada**
  - **Jerarquía visual clara**: Nivel 7 (Administrador) hasta Nivel 1 (GM Aspirante)
  - **Colores temáticos**: Gaming-gold para elementos GM, colores neutros para jugadores
  - **Iconografía consistente**: Crown para GMs, User para jugadores, Shield para admin
  - **Acciones contextuales**: Botones específicos según el rol del usuario

### 28 de septiembre de 2025 - FUNCIONALIDAD BUSCAR JUGADOR IMPLEMENTADA
- **Nueva Funcionalidad "Buscar Jugador" Completada**
  - Reemplazó la sección estática "Jugadores Registrados" con funcionalidad de búsqueda avanzada
  - **Búsqueda en tiempo real**: Por nombre de usuario o correo electrónico
  - **Interfaz intuitiva**: Campo de búsqueda con placeholders descriptivos
  - **Resultados dinámicos**: Filtrado instantáneo mientras el usuario escribe
  - **Estados visuales mejorados**: Mensajes cuando no hay búsqueda, sin resultados, o cargando
  - **Gestión de roles completa**: Promover a GM y cambiar niveles desde resultados de búsqueda
  - **UX optimizada**: Iconos distintivos (Search, Users) y feedback visual claro
- **Configuración de Base de Datos Optimizada**
  - Migrado de Neon WebSocket a PostgreSQL cliente nativo para mayor estabilidad
  - Conexión directa sin SSL para entorno interno de Replit
  - Eliminados errores de certificados auto-firmados
  - Rendimiento mejorado en consultas de base de datos

### 28 de septiembre de 2025 - MIGRACIÓN EXITOSA COMPLETADA
- **Migración de Replit Agent a Entorno Replit Completada**
  - Instalación completa de dependencias Node.js y paquetes npm
  - Configuración verificada de PostgreSQL con DATABASE_URL
  - Workflow funcionando correctamente sin errores
  - Aplicación ejecutándose estable en puerto 5000
- **Sistema de Autenticación Completamente Funcional**
  - Backend seguro con hash de contraseñas usando PBKDF2 y sal única por usuario
  - Gestión de sesiones con cookies HTTP-only y configuración SameSite=strict
  - Endpoints completos: `/api/register`, `/api/login`, `/api/me`, `/api/logout`
  - Storage con PostgreSQL nativo de Replit
- **Sistema de 7 Niveles GM Implementado**
  - 7 niveles jerárquicos: Player, GM Aspirante, GM Soporte, GM Eventos, GM Superior, GM Jefe, Community Manager, Administrador
  - Panel de administración con gestión completa de roles de usuarios
  - Endpoints seguros para cambio de roles (`/api/users`, `/api/change-role`)
  - Interfaz responsive con badges diferenciados por nivel de GM

## Estado Actual del Proyecto - TOTALMENTE FUNCIONAL ✅

### Aplicación Principal
- ✅ **Aplicación funcionando correctamente en puerto 5000**
- ✅ **Sistema de base de datos PostgreSQL configurado y funcionando** 
- ✅ **Registro y login de usuarios FUNCIONANDO**
- ✅ **Sesiones de usuario persistentes y seguras**

### Funcionalidades Implementadas  
- ✅ Modal de descarga implementado y funcional
- ✅ **Foro completamente funcional con navegación integrada**
- ✅ **Sistema de autenticación completo con PostgreSQL**
- ✅ **Estado global de autenticación en toda la aplicación**
- ✅ **Panel de usuario con cambio de contraseña y email**
- ✅ **Sistema completo de 7 niveles de GM implementado**
- ✅ **Panel de administración AVANZADO con gestión completa de usuarios**
- ✅ **Estadísticas en tiempo real de jerarquía GM (7 niveles)**
- ✅ **Separación visual entre GMs y jugadores**
- ✅ **Botones de promoción/degradación de usuarios**
- ✅ **Endpoints seguros para cambio de roles**
- ✅ **Interfaz responsive con badges diferenciados por nivel de GM**
- ✅ **Funcionalidad "Buscar Jugador" con filtrado en tiempo real**
- ✅ **Búsqueda por usuario y correo electrónico**
- ✅ **Gestión de roles desde resultados de búsqueda**
- ✅ **Cuenta administrativa principal creada y funcionando**

### Protección de Datos
- ✅ **Progreso guardado automáticamente con sistema auto-save de Replit**
- ✅ **Base de datos PostgreSQL persistente con backups automáticos**
- ✅ **Sistema de checkpoints para rollback si es necesario**
- ✅ **Todos los archivos sincronizados en la nube**

### Estado de la Migración y Desarrollo
**✅ MIGRACIÓN Y PANEL ADMINISTRATIVO COMPLETADOS EXITOSAMENTE** - La aplicación está lista para continuar desarrollo con:
- PostgreSQL como base de datos principal (recomendado para Replit)
- Sistema de autenticación completamente funcional  
- Panel del jugador integrado con navegación principal
- Panel administrativo avanzado con estadísticas y gestión completa de usuarios
- Todos los datos protegidos y persistentes con múltiples capas de seguridad
- **Guardado automático activo**: Sin riesgo de pérdida de datos

## Credenciales de Acceso Activas

### Cuenta Administrativa Principal
- **Usuario Administrador**: `admin_usuario`
- **Contraseña**: `Admin2024!`
- **Rol**: Administrador (Nivel 7 - Acceso completo)
- **Permisos**: Panel administrativo completo, gestión de usuarios, estadísticas GM

### Cuentas de Prueba Adicionales
- **Administrador Demo**: `admin_demo` / `admin123`
- **Community Manager**: `community_mgr` / `test123`
- **GM Eventos**: `gm_eventos` / `test123`
- **GM Soporte**: `gm_soporte` / `test123`
- **Jugadores**: `jugador1` / `test123`, `jugador2` / `test123`

### Configuración de Base de Datos
- **Base de datos**: PostgreSQL nativo de Replit
- **Cliente**: Cliente PostgreSQL directo (pg)
- **Conexión**: Sin SSL para entorno interno
- **Estado**: Completamente funcional y optimizada