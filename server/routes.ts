import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertUserSchema, loginSchema, changePasswordSchema, changeEmailSchema } from "@shared/schema";
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

  const httpServer = createServer(app);

  return httpServer;
}
