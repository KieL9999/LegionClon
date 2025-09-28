import type { Express } from "express";
import express from "express";
import { createServer, type Server } from "http";
import multer from "multer";
import path from "path";
import fs from "fs";
import { storage } from "./storage";
import { insertUserSchema, loginSchema, changePasswordSchema, changeEmailSchema, changeRoleSchema, insertWebFeatureSchema, updateWebFeatureSchema, insertServerNewsSchema, updateServerNewsSchema, USER_ROLES } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // User registration endpoint
  app.post('/api/register', async (req, res) => {
    try {
      // Validate request body
      const validatedData = insertUserSchema.parse(req.body);
      
      // Check if username already exists
      const existingUserByUsername = await storage.getUserByUsername(validatedData.username);
      if (existingUserByUsername) {
        return res.status(400).json({
          error: 'Username already exists',
          message: 'Este nombre de usuario ya está en uso'
        });
      }
      
      // Check if email already exists
      const existingUserByEmail = await storage.getUserByEmail(validatedData.email);
      if (existingUserByEmail) {
        return res.status(400).json({
          error: 'Email already exists',
          message: 'Este email ya está registrado'
        });
      }
      
      // Create user
      const newUser = await storage.createUser(validatedData);
      
      // Return user without password
      const { password, ...userResponse } = newUser;
      
      res.status(201).json({
        success: true,
        message: 'Cuenta creada exitosamente',
        user: userResponse
      });
      
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          error: 'Validation error',
          message: 'Datos inválidos',
          details: error.errors
        });
      }
      
      console.error('Registration error:', error);
      res.status(500).json({
        error: 'Internal server error',
        message: 'Error interno del servidor'
      });
    }
  });

  // User login endpoint
  app.post('/api/login', async (req, res) => {
    try {
      // Validate request body
      const validatedData = loginSchema.parse(req.body);
      
      // Validate user credentials
      const user = await storage.validateUser(validatedData.username, validatedData.password);
      if (!user) {
        return res.status(401).json({
          error: 'Invalid credentials',
          message: 'Nombre de usuario o contraseña incorrectos'
        });
      }
      
      // Create session
      const session = await storage.createSession(user.id);
      
      // Set secure httpOnly cookie
      res.cookie('sessionId', session.id, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 24 * 60 * 60 * 1000, // 24 hours
        sameSite: 'strict'
      });
      
      // Return user without password
      const { password, ...userResponse } = user;
      
      res.status(200).json({
        success: true,
        message: 'Inicio de sesión exitoso',
        user: userResponse
      });
      
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          error: 'Validation error',
          message: 'Datos inválidos',
          details: error.errors
        });
      }
      
      console.error('Login error:', error);
      res.status(500).json({
        error: 'Internal server error',
        message: 'Error interno del servidor'
      });
    }
  });

  // Get current user endpoint
  app.get('/api/me', async (req, res) => {
    try {
      const sessionId = req.cookies.sessionId;
      if (!sessionId) {
        return res.status(401).json({
          error: 'Not authenticated',
          message: 'No hay sesión activa'
        });
      }

      const user = await storage.getUserBySession(sessionId);
      if (!user) {
        return res.status(401).json({
          error: 'Invalid session',
          message: 'Sesión inválida o expirada'
        });
      }

      const { password, ...userResponse } = user;
      res.json({
        success: true,
        user: userResponse
      });
      
    } catch (error) {
      console.error('Get user error:', error);
      res.status(500).json({
        error: 'Internal server error',
        message: 'Error interno del servidor'
      });
    }
  });

  // User logout endpoint
  app.post('/api/logout', async (req, res) => {
    try {
      const sessionId = req.cookies.sessionId;
      
      if (sessionId) {
        await storage.deleteSession(sessionId);
      }
      
      res.clearCookie('sessionId');
      res.json({
        success: true,
        message: 'Sesión cerrada exitosamente'
      });
      
    } catch (error) {
      console.error('Logout error:', error);
      res.status(500).json({
        error: 'Internal server error',
        message: 'Error interno del servidor'
      });
    }
  });

  // Change password endpoint
  app.post('/api/change-password', async (req, res) => {
    try {
      const sessionId = req.cookies.sessionId;
      if (!sessionId) {
        return res.status(401).json({
          error: 'Not authenticated',
          message: 'No hay sesión activa'
        });
      }

      const user = await storage.getUserBySession(sessionId);
      if (!user) {
        return res.status(401).json({
          error: 'Invalid session',
          message: 'Sesión inválida o expirada'
        });
      }

      // Validate request body
      const validatedData = changePasswordSchema.parse(req.body);
      
      // Verify current password
      const isValidPassword = await storage.validateUser(user.username, validatedData.currentPassword);
      if (!isValidPassword) {
        return res.status(400).json({
          error: 'Invalid current password',
          message: 'La contraseña actual es incorrecta'
        });
      }
      
      // Update password
      const updatedUser = await storage.updateUserPassword(user.id, validatedData.newPassword);
      
      res.json({
        success: true,
        message: 'Contraseña cambiada exitosamente'
      });
      
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          error: 'Validation error',
          message: 'Datos inválidos',
          details: error.errors
        });
      }
      
      console.error('Change password error:', error);
      res.status(500).json({
        error: 'Internal server error',
        message: 'Error interno del servidor'
      });
    }
  });

  // Change email endpoint
  app.post('/api/change-email', async (req, res) => {
    try {
      const sessionId = req.cookies.sessionId;
      if (!sessionId) {
        return res.status(401).json({
          error: 'Not authenticated',
          message: 'No hay sesión activa'
        });
      }

      const user = await storage.getUserBySession(sessionId);
      if (!user) {
        return res.status(401).json({
          error: 'Invalid session',
          message: 'Sesión inválida o expirada'
        });
      }

      // Validate request body
      const validatedData = changeEmailSchema.parse(req.body);
      
      // Verify password
      const isValidPassword = await storage.validateUser(user.username, validatedData.password);
      if (!isValidPassword) {
        return res.status(400).json({
          error: 'Invalid password',
          message: 'La contraseña es incorrecta'
        });
      }
      
      // Check if email already exists
      const existingUser = await storage.getUserByEmail(validatedData.newEmail);
      if (existingUser && existingUser.id !== user.id) {
        return res.status(400).json({
          error: 'Email already exists',
          message: 'Este email ya está en uso por otra cuenta'
        });
      }
      
      // Update email
      const updatedUser = await storage.updateUserEmail(user.id, validatedData.newEmail);
      
      const { password, ...userResponse } = updatedUser;
      
      res.json({
        success: true,
        message: 'Email cambiado exitosamente',
        user: userResponse
      });
      
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          error: 'Validation error',
          message: 'Datos inválidos',
          details: error.errors
        });
      }
      
      console.error('Change email error:', error);
      res.status(500).json({
        error: 'Internal server error',
        message: 'Error interno del servidor'
      });
    }
  });

  // Get all users endpoint (admin only)
  app.get('/api/users', async (req, res) => {
    try {
      const sessionId = req.cookies.sessionId;
      if (!sessionId) {
        return res.status(401).json({
          error: 'Not authenticated',
          message: 'No hay sesión activa'
        });
      }

      const user = await storage.getUserBySession(sessionId);
      if (!user) {
        return res.status(401).json({
          error: 'Invalid session',
          message: 'Sesión inválida o expirada'
        });
      }

      // Check if user is GM (any level)
      if (user.role === USER_ROLES.PLAYER) {
        return res.status(403).json({
          error: 'Insufficient permissions',
          message: 'Solo los Game Masters pueden acceder a esta función'
        });
      }

      const users = await storage.getAllUsers();
      
      // Remove passwords from response
      const safeUsers = users.map(({ password, ...userResponse }) => userResponse);
      
      res.json({
        success: true,
        users: safeUsers
      });
      
    } catch (error) {
      console.error('Get users error:', error);
      res.status(500).json({
        error: 'Internal server error',
        message: 'Error interno del servidor'
      });
    }
  });

  // Change user role endpoint (admin only)
  app.post('/api/change-role', async (req, res) => {
    try {
      const sessionId = req.cookies.sessionId;
      if (!sessionId) {
        return res.status(401).json({
          error: 'Not authenticated',
          message: 'No hay sesión activa'
        });
      }

      const user = await storage.getUserBySession(sessionId);
      if (!user) {
        return res.status(401).json({
          error: 'Invalid session',
          message: 'Sesión inválida o expirada'
        });
      }

      // Check if user is GM (any level)
      if (user.role === USER_ROLES.PLAYER) {
        return res.status(403).json({
          error: 'Insufficient permissions',
          message: 'Solo los Game Masters pueden cambiar roles'
        });
      }

      // Validate request body
      const validatedData = changeRoleSchema.parse(req.body);
      
      // Prevent users from changing their own role
      if (validatedData.userId === user.id) {
        return res.status(400).json({
          error: 'Cannot change own role',
          message: 'No puedes cambiar tu propio rol'
        });
      }
      
      // Update user role
      const updatedUser = await storage.updateUserRole(validatedData.userId, validatedData.newRole);
      
      const { password, ...userResponse } = updatedUser;
      
      res.json({
        success: true,
        message: 'Rol cambiado exitosamente',
        user: userResponse
      });
      
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          error: 'Validation error',
          message: 'Datos inválidos',
          details: error.errors
        });
      }
      
      console.error('Change role error:', error);
      res.status(500).json({
        error: 'Internal server error',
        message: 'Error interno del servidor'
      });
    }
  });

  // Get all web features endpoint (public)
  app.get('/api/web-features', async (req, res) => {
    try {
      const features = await storage.getAllWebFeatures();
      
      res.json({
        success: true,
        features
      });
      
    } catch (error) {
      console.error('Get web features error:', error);
      res.status(500).json({
        error: 'Internal server error',
        message: 'Error interno del servidor'
      });
    }
  });

  // Create web feature endpoint (admin only)
  app.post('/api/web-features', async (req, res) => {
    try {
      const sessionId = req.cookies.sessionId;
      if (!sessionId) {
        return res.status(401).json({
          error: 'Not authenticated',
          message: 'No hay sesión activa'
        });
      }

      const user = await storage.getUserBySession(sessionId);
      if (!user) {
        return res.status(401).json({
          error: 'Invalid session',
          message: 'Sesión inválida o expirada'
        });
      }

      // Check if user is administrator
      if (user.role !== USER_ROLES.ADMINISTRADOR) {
        return res.status(403).json({
          error: 'Insufficient permissions',
          message: 'Solo los administradores pueden crear características'
        });
      }

      // Validate request body
      const validatedData = insertWebFeatureSchema.parse(req.body);
      
      // Create web feature
      const newFeature = await storage.createWebFeature(validatedData);
      
      res.status(201).json({
        success: true,
        message: 'Característica creada exitosamente',
        feature: newFeature
      });
      
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          error: 'Validation error',
          message: 'Datos inválidos',
          details: error.errors
        });
      }
      
      console.error('Create web feature error:', error);
      res.status(500).json({
        error: 'Internal server error',
        message: 'Error interno del servidor'
      });
    }
  });

  // Update web feature endpoint (admin only)
  app.patch('/api/web-features/:id', async (req, res) => {
    try {
      const sessionId = req.cookies.sessionId;
      if (!sessionId) {
        return res.status(401).json({
          error: 'Not authenticated',
          message: 'No hay sesión activa'
        });
      }

      const user = await storage.getUserBySession(sessionId);
      if (!user) {
        return res.status(401).json({
          error: 'Invalid session',
          message: 'Sesión inválida o expirada'
        });
      }

      // Check if user is administrator
      if (user.role !== USER_ROLES.ADMINISTRADOR) {
        return res.status(403).json({
          error: 'Insufficient permissions',
          message: 'Solo los administradores pueden editar características'
        });
      }

      const featureId = req.params.id;
      
      // Validate request body
      const validatedData = updateWebFeatureSchema.parse(req.body);
      
      // Update web feature
      const updatedFeature = await storage.updateWebFeature(featureId, validatedData);
      
      if (!updatedFeature) {
        return res.status(404).json({
          error: 'Feature not found',
          message: 'Característica no encontrada'
        });
      }
      
      res.json({
        success: true,
        message: 'Característica actualizada exitosamente',
        feature: updatedFeature
      });
      
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          error: 'Validation error',
          message: 'Datos inválidos',
          details: error.errors
        });
      }
      
      console.error('Update web feature error:', error);
      res.status(500).json({
        error: 'Internal server error',
        message: 'Error interno del servidor'
      });
    }
  });

  // Delete web feature endpoint (admin only)
  app.delete('/api/web-features/:id', async (req, res) => {
    try {
      const sessionId = req.cookies.sessionId;
      if (!sessionId) {
        return res.status(401).json({
          error: 'Not authenticated',
          message: 'No hay sesión activa'
        });
      }

      const user = await storage.getUserBySession(sessionId);
      if (!user) {
        return res.status(401).json({
          error: 'Invalid session',
          message: 'Sesión inválida o expirada'
        });
      }

      // Check if user is administrator
      if (user.role !== USER_ROLES.ADMINISTRADOR) {
        return res.status(403).json({
          error: 'Insufficient permissions',
          message: 'Solo los administradores pueden eliminar características'
        });
      }

      const featureId = req.params.id;
      
      // Delete web feature
      const deletedFeature = await storage.deleteWebFeature(featureId);
      
      if (!deletedFeature) {
        return res.status(404).json({
          error: 'Feature not found',
          message: 'Característica no encontrada'
        });
      }
      
      res.json({
        success: true,
        message: 'Característica eliminada exitosamente'
      });
      
    } catch (error) {
      console.error('Delete web feature error:', error);
      res.status(500).json({
        error: 'Internal server error',
        message: 'Error interno del servidor'
      });
    }
  });

  // Get all server news endpoint (public)
  app.get('/api/server-news', async (req, res) => {
    try {
      const news = await storage.getAllServerNews();
      
      res.json({
        success: true,
        news
      });
      
    } catch (error) {
      console.error('Get server news error:', error);
      res.status(500).json({
        error: 'Internal server error',
        message: 'Error interno del servidor'
      });
    }
  });

  // Create server news endpoint (admin only)
  app.post('/api/server-news', async (req, res) => {
    try {
      const sessionId = req.cookies.sessionId;
      if (!sessionId) {
        return res.status(401).json({
          error: 'Not authenticated',
          message: 'No hay sesión activa'
        });
      }

      const user = await storage.getUserBySession(sessionId);
      if (!user) {
        return res.status(401).json({
          error: 'Invalid session',
          message: 'Sesión inválida o expirada'
        });
      }

      // Check if user is administrator
      if (user.role !== USER_ROLES.ADMINISTRADOR) {
        return res.status(403).json({
          error: 'Insufficient permissions',
          message: 'Solo los administradores pueden crear noticias'
        });
      }

      // Validate request body
      const validatedData = insertServerNewsSchema.parse(req.body);
      
      // Create server news
      const newNews = await storage.createServerNews(validatedData);
      
      res.status(201).json({
        success: true,
        message: 'Noticia creada exitosamente',
        news: newNews
      });
      
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          error: 'Validation error',
          message: 'Datos inválidos',
          details: error.errors
        });
      }
      
      console.error('Create server news error:', error);
      res.status(500).json({
        error: 'Internal server error',
        message: 'Error interno del servidor'
      });
    }
  });

  // Update server news endpoint (admin only)
  app.patch('/api/server-news/:id', async (req, res) => {
    try {
      const sessionId = req.cookies.sessionId;
      if (!sessionId) {
        return res.status(401).json({
          error: 'Not authenticated',
          message: 'No hay sesión activa'
        });
      }

      const user = await storage.getUserBySession(sessionId);
      if (!user) {
        return res.status(401).json({
          error: 'Invalid session',
          message: 'Sesión inválida o expirada'
        });
      }

      // Check if user is administrator
      if (user.role !== USER_ROLES.ADMINISTRADOR) {
        return res.status(403).json({
          error: 'Insufficient permissions',
          message: 'Solo los administradores pueden editar noticias'
        });
      }

      const newsId = req.params.id;
      
      // Validate request body
      const validatedData = updateServerNewsSchema.parse(req.body);
      
      // Update server news
      const updatedNews = await storage.updateServerNews(newsId, validatedData);
      
      if (!updatedNews) {
        return res.status(404).json({
          error: 'News not found',
          message: 'Noticia no encontrada'
        });
      }
      
      res.json({
        success: true,
        message: 'Noticia actualizada exitosamente',
        news: updatedNews
      });
      
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          error: 'Validation error',
          message: 'Datos inválidos',
          details: error.errors
        });
      }
      
      console.error('Update server news error:', error);
      res.status(500).json({
        error: 'Internal server error',
        message: 'Error interno del servidor'
      });
    }
  });

  // Delete server news endpoint (admin only)
  app.delete('/api/server-news/:id', async (req, res) => {
    try {
      const sessionId = req.cookies.sessionId;
      if (!sessionId) {
        return res.status(401).json({
          error: 'Not authenticated',
          message: 'No hay sesión activa'
        });
      }

      const user = await storage.getUserBySession(sessionId);
      if (!user) {
        return res.status(401).json({
          error: 'Invalid session',
          message: 'Sesión inválida o expirada'
        });
      }

      // Check if user is administrator
      if (user.role !== USER_ROLES.ADMINISTRADOR) {
        return res.status(403).json({
          error: 'Insufficient permissions',
          message: 'Solo los administradores pueden eliminar noticias'
        });
      }

      const newsId = req.params.id;
      
      // Delete server news
      const deletedNews = await storage.deleteServerNews(newsId);
      
      if (!deletedNews) {
        return res.status(404).json({
          error: 'News not found',
          message: 'Noticia no encontrada'
        });
      }
      
      res.json({
        success: true,
        message: 'Noticia eliminada exitosamente'
      });
      
    } catch (error) {
      console.error('Delete server news error:', error);
      res.status(500).json({
        error: 'Internal server error',
        message: 'Error interno del servidor'
      });
    }
  });

  // Configure multer for file uploads
  const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
  
  // Ensure uploads directory exists
  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
  }

  const storage_multer = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, uploadsDir);
    },
    filename: (req, file, cb) => {
      // Generate unique filename with timestamp
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      const ext = path.extname(file.originalname);
      cb(null, `image-${uniqueSuffix}${ext}`);
    }
  });

  const upload = multer({
    storage: storage_multer,
    limits: {
      fileSize: 5 * 1024 * 1024, // 5MB limit
    },
    fileFilter: (req, file, cb) => {
      // Only allow image files
      if (file.mimetype.startsWith('image/')) {
        cb(null, true);
      } else {
        const error = new Error('Solo se permiten archivos de imagen') as any;
        error.code = 'LIMIT_FILE_TYPE';
        cb(error);
      }
    }
  });

  // Serve uploaded files statically
  app.use('/uploads', express.static(uploadsDir));

  // Authentication middleware for upload
  const uploadAuthMiddleware = async (req: any, res: any, next: any) => {
    try {
      const sessionId = req.cookies.sessionId;
      if (!sessionId) {
        return res.status(401).json({
          error: 'Not authenticated',
          message: 'No hay sesión activa'
        });
      }

      const user = await storage.getUserBySession(sessionId);
      if (!user) {
        return res.status(401).json({
          error: 'Invalid session',
          message: 'Sesión inválida o expirada'
        });
      }

      // Check if user is administrator
      if (user.role !== USER_ROLES.ADMINISTRADOR) {
        return res.status(403).json({
          error: 'Insufficient permissions',
          message: 'Solo los administradores pueden subir imágenes'
        });
      }

      // Store user in request for later use
      req.user = user;
      next();
    } catch (error) {
      console.error('Upload auth error:', error);
      res.status(500).json({
        error: 'Internal server error',
        message: 'Error interno del servidor'
      });
    }
  };

  // Upload image endpoint (admin only) - Authentication BEFORE multer
  app.post('/api/upload-image', uploadAuthMiddleware, upload.single('image'), async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({
          error: 'No file uploaded',
          message: 'No se subió ningún archivo'
        });
      }

      // Return the uploaded file URL
      const fileUrl = `/uploads/${req.file.filename}`;
      
      res.json({
        success: true,
        message: 'Imagen subida exitosamente',
        url: fileUrl,
        filename: req.file.filename
      });
      
    } catch (error) {
      console.error('Upload image error:', error);
      
      // Clean up uploaded file if there was an error
      if (req.file?.path) {
        try {
          fs.unlinkSync(req.file.path);
        } catch (cleanupError) {
          console.error('Failed to cleanup uploaded file:', cleanupError);
        }
      }
      
      res.status(500).json({
        error: 'Internal server error',
        message: 'Error interno del servidor'
      });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
