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
The application uses Drizzle ORM with PostgreSQL (Neon Database) for database operations. The schema defines user management with proper UUID-based primary keys, constraints and relationships. Database migrations are managed through Drizzle Kit with PostgreSQL dialect configuration.

Current implementation includes a production-ready PostgreSQL database with user sessions management. User data includes username, email, password, role fields and timestamp fields with proper validation. The database is fully integrated with Replit's built-in PostgreSQL service.

### Authentication and Authorization
User authentication is implemented through a registration system with email and username validation. Password handling follows security best practices with proper validation constraints. The system includes user session management and credential validation for secure access.

Form validation is implemented client-side with Zod schemas and server-side validation for security. Error handling provides user-friendly feedback for registration issues like duplicate usernames or invalid email formats.

### External Dependencies
The application integrates several key external libraries:
- UI Framework: Radix UI primitives for accessible components
- Styling: Tailwind CSS with custom gaming-themed color schemes
- Forms: React Hook Form with Hookform Resolvers for validation
- Icons: Lucide React icons with React Icons for brand symbols
- Database: PostgreSQL with Neon serverless driver support
- Fonts: Google Fonts integration (Inter, Orbitron) for typography
- Build Tools: Vite with TypeScript support and development plugins

The architecture supports Replit-specific plugins for development enhancement including error overlays, cartographer integration, and development banners when running in the Replit environment.

## Recent Changes

### 28 de septiembre de 2025 - IMPLEMENTACIÓN: Sistema Completo de 7 Niveles de GM
- **Sistema de Roles Avanzado Implementado**
  - **7 niveles jerárquicos de GM**: Player, GM Aspirante, GM Soporte, GM Eventos, GM Superior, GM Jefe, Community Manager, Administrador
  - **Esquema de base de datos expandido**: Campo de rol ampliado a 50 caracteres para soportar roles descriptivos
  - **Migración exitosa**: Base de datos actualizada con nuevos roles sin pérdida de datos
  - **Constantes y labels**: Definición completa de `USER_ROLES` y `ROLE_LABELS` para consistencia
- **Panel de Administración Avanzado**
  - **Gestión completa de usuarios**: Interfaz para ver todos los usuarios registrados
  - **Selector de roles dinámico**: Dropdown con los 7 niveles disponibles para cambio de roles
  - **Prevención de auto-modificación**: Los administradores no pueden cambiar su propio rol
  - **Visualización jerárquica**: Badges diferenciados por colores para cada nivel de GM
- **Backend Robusto y Seguro**
  - **Nuevos endpoints**: `/api/users` para obtener lista de usuarios, `/api/change-role` para cambiar roles
  - **Validación con Zod**: Schema `changeRoleSchema` con enum estricto de roles válidos
  - **Autorización granular**: Solo usuarios GM pueden acceder a funciones administrativas
  - **Logs de auditoría**: Registro completo de cambios de roles en el sistema
- **Interfaz Mejorada**
  - **Helper functions**: `isGM()` y `getRoleDisplayName()` para consistencia en toda la aplicación
  - **Badges dinámicos**: Colores y estilos adaptados según el nivel del rol
  - **UX optimizada**: Carga async de usuarios, estados de error y loading apropiados
  - **Responsive design**: Adaptación completa a diferentes tamaños de pantalla

### 28 de septiembre de 2025 - ACTUALIZACIÓN: Panel del Jugador Mejorado con Navegación Integrada
- **Migración Exitosa de Replit Agent a Entorno Replit**
  - Instalación completa de dependencias Node.js y paquetes npm
  - Configuración verificada de PostgreSQL con DATABASE_URL
  - Workflow funcionando correctamente sin errores
  - Aplicación ejecutándose estable en puerto 5000
- **Panel del Jugador Rediseñado e Integrado**
  - **PROBLEMA RESUELTO**: El panel ya NO está aislado como un recuadro separado
  - **Header integrado**: Navegación principal siempre visible con acceso a todas las páginas
  - **Botón "Volver al inicio"**: Navegación rápida de regreso a la página principal
  - **Diseño consistente**: Uso de colores del tema (gaming-gold, bg-background, text-foreground)
  - **Espaciado correcto**: pt-24 para compensar header fixed sin superposición
- **Funcionalidad Completa Preservada**
  - Cambio de contraseña con validación segura
  - Cambio de email con confirmación de contraseña actual
  - Panel de administrador para usuarios GM
  - Formularios con React Hook Form y validación Zod
  - Estados de carga y notificaciones toast

### 28 de septiembre de 2025 - Panel del Jugador y Sistema de Roles
- **Panel del Jugador Completo Implementado**
  - Página dedicada del panel del jugador en `/panel` con interfaz moderna
  - Opciones para cambiar contraseña con validación de contraseña actual
  - Funcionalidad para cambiar email con confirmación de contraseña
  - Información detallada del perfil del usuario
  - Navegación integrada desde el dropdown del usuario autenticado
- **Sistema de Roles y Administración**
  - Agregado campo 'role' al esquema de usuario (player/GM)
  - Apartado especial "Administrador" visible solo para usuarios con role "GM"
  - Sección de administración con placeholders para funciones futuras
  - Badges visuales para identificar Game Masters
- **Seguridad y Backend Robusto**
  - Endpoints seguros `/api/change-password` y `/api/change-email`
  - Validación de contraseña actual antes de cambios
  - Verificación de unicidad de email en cambios
  - Hashing seguro con PBKDF2 y sal única por usuario
  - Validación completa con Zod en frontend y backend
- **Interfaz de Usuario Mejorada**
  - Diseño cohesivo con la temática Legion gaming
  - Formularios con manejo de estados de carga
  - Notificaciones toast para feedback del usuario
  - Validación en tiempo real con React Hook Form

### 28 de septiembre de 2025 - Implementación de Foro y Sistema de Login Completo
- **Agregado apartado "Foro" en la navegación**
  - Añadido enlace "Foro" en el header entre "Rankings" y "Descargar"
  - Creada página completa del foro (`ForoPage.tsx`) con secciones organizadas
  - Diseño temático con estadísticas de la comunidad y llamadas a la acción
- **Sistema de autenticación completo implementado**
  - Backend seguro con hash de contraseñas usando PBKDF2 y sal única por usuario
  - Gestión de sesiones con cookies HTTP-only y configuración SameSite=strict
  - Endpoints completos: `/api/register`, `/api/login`, `/api/me`, `/api/logout`
  - Almacenamiento in-memory con expiración automática de sesiones (24h)
- **Frontend con estado global de autenticación**
  - Contexto de autenticación (`AuthContext`) con TanStack Query
  - Header actualizado que muestra estado de usuario autenticado
  - Modal de login integrado con sistema de autenticación
  - Dropdown de usuario con opción de logout para usuarios autenticados
- **Seguridad y validación**
  - Validación de esquemas con Zod en frontend y backend
  - Cookies seguras con configuración apropiada para desarrollo/producción
  - Manejo de errores y estados de carga en toda la interfaz

### 28 de septiembre de 2025 - Migración Exitosa y Configuración de Base de Datos
- **Migración exitosa a PostgreSQL de Replit**
  - Configuración completada de PostgreSQL nativo de Replit con DATABASE_URL
  - Schema optimizado usando pgTable con UUIDs para mejor rendimiento
  - Sistema de autenticación completamente funcional con base de datos persistente
  - **Registro de usuarios funcionando**: 1 usuario registrado exitosamente
- **Implementación de Modal de Descarga Completo**
  - Creado `DownloadModal.tsx` con diseño siguiendo especificaciones exactas del usuario
  - Sección "Cliente Completo" con información detallada (28.5 GB, 1247 descargas)
  - Sección "Parches y Actualizaciones" con múltiples opciones de descarga
  - Instrucciones de instalación paso a paso para cliente y parches

## Estado Actual del Proyecto - TOTALMENTE FUNCIONAL ✅

### Aplicación Principal
- ✅ **Aplicación funcionando correctamente en puerto 5000**
- ✅ **Sistema de base de datos PostgreSQL configurado y funcionando** 
- ✅ **Registro de usuarios FUNCIONANDO** (1 usuario ya registrado)
- ✅ **Sistema de login FUNCIONANDO** (autenticación exitosa)
- ✅ **Sesiones de usuario persistentes y seguras**

### Funcionalidades Implementadas  
- ✅ Modal de descarga implementado y funcional
- ✅ **Foro completamente funcional con navegación integrada**
- ✅ **Sistema de autenticación completo con PostgreSQL**
- ✅ **Estado global de autenticación en toda la aplicación**
- ✅ **Panel de usuario con cambio de contraseña y email**
- ✅ **Sistema de roles (player/GM) implementado**
- ✅ **Panel de jugador MEJORADO con navegación integrada**
- ✅ **Sistema completo de 7 niveles de GM implementado**
- ✅ **Panel de administración con gestión de roles de usuarios**
- ✅ **Endpoints seguros para cambio de roles (/api/users, /api/change-role)**
- ✅ **Interfaz responsive con badges diferenciados por nivel de GM**

### Protección de Datos
- ✅ **Progreso guardado automáticamente con sistema auto-save de Replit**
- ✅ **Base de datos PostgreSQL persistente con backups automáticos**
- ✅ **Sistema de checkpoints para rollback si es necesario**
- ✅ **Todos los archivos sincronizados en la nube**

### Estado de la Migración
**✅ MIGRACIÓN Y MEJORAS COMPLETADAS EXITOSAMENTE** - La aplicación está lista para continuar desarrollo con:
- PostgreSQL como base de datos principal (recomendado para Replit)
- Sistema de autenticación completamente funcional  
- Panel del jugador integrado con navegación principal
- Todos los datos protegidos y persistentes con múltiples capas de seguridad
- **Guardado automático activo**: Sin riesgo de pérdida de datos