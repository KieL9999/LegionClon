import type { Express } from "express";
import express from "express";
import { createServer, type Server } from "http";
import multer from "multer";
import path from "path";
import fs from "fs";
import { WebSocket, WebSocketServer } from "ws";
import { storage } from "./storage";
import { insertUserSchema, loginSchema, changePasswordSchema, changeEmailSchema, changeRoleSchema, insertWebFeatureSchema, updateWebFeatureSchema, insertServerNewsSchema, updateServerNewsSchema, insertDownloadSchema, updateDownloadSchema, insertSiteSettingSchema, updateSiteSettingSchema, insertSupportTicketSchema, updateSupportTicketSchema, uploadDownloadFileSchema, insertTicketMessageSchema, USER_ROLES } from "@shared/schema";
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
      
      // Update last login timestamp
      const updatedUser = await storage.updateUserLastLogin(user.id);
      
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
      const { password, ...userResponse } = updatedUser;
      
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

  // Get all downloads endpoint (public)
  app.get('/api/downloads', async (req, res) => {
    try {
      const downloads = await storage.getAllDownloads();
      
      res.json({
        success: true,
        downloads
      });
      
    } catch (error) {
      console.error('Get downloads error:', error);
      res.status(500).json({
        error: 'Internal server error',
        message: 'Error interno del servidor'
      });
    }
  });

  // Create download endpoint (admin only)
  app.post('/api/downloads', async (req, res) => {
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
          message: 'Solo los administradores pueden crear descargas'
        });
      }

      // Validate request body
      const validatedData = insertDownloadSchema.parse(req.body);
      
      // Create download
      const newDownload = await storage.createDownload(validatedData);
      
      res.status(201).json({
        success: true,
        message: 'Descarga creada exitosamente',
        download: newDownload
      });
      
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          error: 'Validation error',
          message: 'Datos inválidos',
          details: error.errors
        });
      }
      
      console.error('Create download error:', error);
      res.status(500).json({
        error: 'Internal server error',
        message: 'Error interno del servidor'
      });
    }
  });

  // Update download endpoint (admin only)
  app.patch('/api/downloads/:id', async (req, res) => {
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
          message: 'Solo los administradores pueden actualizar descargas'
        });
      }

      const downloadId = req.params.id;
      
      // Validate request body
      const validatedData = updateDownloadSchema.parse(req.body);
      
      // Update download
      const updatedDownload = await storage.updateDownload(downloadId, validatedData);
      
      if (!updatedDownload) {
        return res.status(404).json({
          error: 'Download not found',
          message: 'Descarga no encontrada'
        });
      }
      
      res.json({
        success: true,
        message: 'Descarga actualizada exitosamente',
        download: updatedDownload
      });
      
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          error: 'Validation error',
          message: 'Datos inválidos',
          details: error.errors
        });
      }
      
      console.error('Update download error:', error);
      res.status(500).json({
        error: 'Internal server error',
        message: 'Error interno del servidor'
      });
    }
  });

  // Delete download endpoint (admin only)
  app.delete('/api/downloads/:id', async (req, res) => {
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
          message: 'Solo los administradores pueden eliminar descargas'
        });
      }

      const downloadId = req.params.id;
      
      // Delete download
      const deletedDownload = await storage.deleteDownload(downloadId);
      
      if (!deletedDownload) {
        return res.status(404).json({
          error: 'Download not found',
          message: 'Descarga no encontrada'
        });
      }
      
      res.json({
        success: true,
        message: 'Descarga eliminada exitosamente'
      });
      
    } catch (error) {
      console.error('Delete download error:', error);
      res.status(500).json({
        error: 'Internal server error',
        message: 'Error interno del servidor'
      });
    }
  });

  // Increment download count endpoint (public)
  app.post('/api/downloads/:id/download', async (req, res) => {
    try {
      const downloadId = req.params.id;
      
      // Increment download count
      const updatedDownload = await storage.incrementDownloadCount(downloadId);
      
      if (!updatedDownload) {
        return res.status(404).json({
          error: 'Download not found',
          message: 'Descarga no encontrada'
        });
      }
      
      res.json({
        success: true,
        message: 'Descarga contabilizada exitosamente',
        downloadCount: updatedDownload.downloadCount
      });
      
    } catch (error) {
      console.error('Increment download count error:', error);
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

  // Configure multer for download files (separate from images)
  const downloadsDir = path.join(process.cwd(), 'public', 'uploads', 'downloads');
  
  // Ensure downloads directory exists
  if (!fs.existsSync(downloadsDir)) {
    fs.mkdirSync(downloadsDir, { recursive: true });
  }

  const downloadStorage = multer.diskStorage({
    destination: (req, file, cb) => {
      // Create type-specific subdirectory
      const downloadType = req.body.type || 'client';
      const typeDir = path.join(downloadsDir, downloadType);
      if (!fs.existsSync(typeDir)) {
        fs.mkdirSync(typeDir, { recursive: true });
      }
      cb(null, typeDir);
    },
    filename: (req, file, cb) => {
      // Generate unique filename with timestamp and random suffix
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      const ext = path.extname(file.originalname);
      const baseName = path.basename(file.originalname, ext).replace(/[^a-zA-Z0-9.-]/g, '_');
      cb(null, `${baseName}-${uniqueSuffix}${ext}`);
    }
  });

  const uploadDownloadFile = multer({
    storage: downloadStorage,
    limits: {
      fileSize: 2 * 1024 * 1024 * 1024, // 2GB limit for game files
    },
    fileFilter: (req, file, cb) => {
      // Allow common download file types
      const allowedTypes = [
        'application/zip',
        'application/x-zip-compressed',
        'application/x-rar-compressed',
        'application/x-7z-compressed',
        'application/octet-stream',
        'application/x-msdownload', // .exe files
        'application/x-msi', // .msi files
        'text/plain', // .txt files
      ];
      
      if (allowedTypes.includes(file.mimetype) || 
          file.originalname.match(/\.(zip|rar|7z|exe|msi|txt|patch|bin)$/i)) {
        cb(null, true);
      } else {
        const error = new Error('Tipo de archivo no permitido. Solo se permiten: ZIP, RAR, 7Z, EXE, MSI, TXT') as any;
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

  // Authentication middleware for ticket image uploads (any authenticated user)
  const ticketUploadAuthMiddleware = async (req: any, res: any, next: any) => {
    try {
      const sessionId = req.cookies.sessionId;
      if (!sessionId) {
        return res.status(401).json({
          error: 'Not authenticated',
          message: 'Debes iniciar sesión para subir imágenes'
        });
      }

      const user = await storage.getUserBySession(sessionId);
      if (!user) {
        return res.status(401).json({
          error: 'Invalid session',
          message: 'Sesión inválida o expirada'
        });
      }

      // Store user in request for later use
      req.user = user;
      next();
    } catch (error) {
      console.error('Ticket upload auth error:', error);
      res.status(500).json({
        error: 'Internal server error',
        message: 'Error interno del servidor'
      });
    }
  };

  // Upload ticket image endpoint (authenticated users)
  app.post('/api/upload-ticket-image', ticketUploadAuthMiddleware, upload.single('image'), async (req, res) => {
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
      console.error('Upload ticket image error:', error);
      
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

  // Upload file to download endpoint (admin only)
  app.post('/api/downloads/:id/upload', uploadAuthMiddleware, uploadDownloadFile.single('file'), async (req, res) => {
    try {
      const downloadId = req.params.id;
      
      if (!req.file) {
        return res.status(400).json({
          error: 'No file uploaded',
          message: 'No se subió ningún archivo'
        });
      }

      // Get the download to update
      const download = await storage.getDownloadById(downloadId);
      if (!download) {
        // Clean up uploaded file
        try {
          fs.unlinkSync(req.file.path);
        } catch (cleanupError) {
          console.error('Failed to cleanup uploaded file:', cleanupError);
        }
        return res.status(404).json({
          error: 'Download not found',
          message: 'Descarga no encontrada'
        });
      }

      // If there was an old local file, delete it
      if (download.localFilePath) {
        const oldFilePath = path.join(process.cwd(), 'public', download.localFilePath);
        try {
          if (fs.existsSync(oldFilePath)) {
            fs.unlinkSync(oldFilePath);
          }
        } catch (cleanupError) {
          console.error('Failed to cleanup old file:', cleanupError);
        }
      }

      // Calculate file size in bytes
      const stats = fs.statSync(req.file.path);
      const fileSizeBytes = stats.size;

      // Convert bytes to human readable format for the fileSize field
      const humanFileSize = (bytes: number) => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
      };

      // Create relative path for storage
      const relativePath = path.relative(path.join(process.cwd(), 'public'), req.file.path);

      // Update download with file information
      const updatedDownload = await storage.updateDownloadWithFile(downloadId, {
        localFilePath: relativePath.replace(/\\/g, '/'), // Ensure forward slashes for URLs
        originalFilename: req.file.originalname,
        mimeType: req.file.mimetype,
        fileSizeBytes: fileSizeBytes
      });

      // Also update the human-readable file size
      if (updatedDownload) {
        await storage.updateDownload(downloadId, {
          fileSize: humanFileSize(fileSizeBytes)
        });
      }

      res.json({
        success: true,
        message: 'Archivo subido exitosamente',
        download: updatedDownload
      });
      
    } catch (error) {
      console.error('Upload download file error:', error);
      
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

  // Download file endpoint (public with download count)
  app.get('/api/download/:id', async (req, res) => {
    try {
      const downloadId = req.params.id;
      
      // Get the download
      const download = await storage.getDownloadById(downloadId);
      if (!download) {
        return res.status(404).json({
          error: 'Download not found',
          message: 'Descarga no encontrada'
        });
      }

      // Check if it has a local file
      if (!download.localFilePath) {
        // If no local file, redirect to external URL if available
        if (download.downloadUrl) {
          // Increment download count
          await storage.incrementDownloadCount(downloadId);
          return res.redirect(download.downloadUrl);
        } else {
          return res.status(404).json({
            error: 'No download available',
            message: 'No hay archivo disponible para descarga'
          });
        }
      }

      // Construct full file path
      const filePath = path.join(process.cwd(), 'public', download.localFilePath);
      
      // Check if file exists
      if (!fs.existsSync(filePath)) {
        return res.status(404).json({
          error: 'File not found',
          message: 'Archivo no encontrado en el servidor'
        });
      }

      // Increment download count
      await storage.incrementDownloadCount(downloadId);

      // Set appropriate headers for download
      res.setHeader('Content-Disposition', `attachment; filename="${download.originalFilename}"`);
      res.setHeader('Content-Type', download.mimeType || 'application/octet-stream');
      
      // Send the file
      res.sendFile(filePath);
      
    } catch (error) {
      console.error('Download file error:', error);
      res.status(500).json({
        error: 'Internal server error',
        message: 'Error interno del servidor'
      });
    }
  });

  // Delete uploaded file endpoint (admin only)
  app.delete('/api/downloads/:id/file', async (req, res) => {
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
          message: 'Solo los administradores pueden eliminar archivos'
        });
      }

      const downloadId = req.params.id;
      
      // Get the download
      const download = await storage.getDownloadById(downloadId);
      if (!download) {
        return res.status(404).json({
          error: 'Download not found',
          message: 'Descarga no encontrada'
        });
      }

      if (!download.localFilePath) {
        return res.status(400).json({
          error: 'No local file',
          message: 'Esta descarga no tiene archivo local'
        });
      }

      // Delete the physical file
      const filePath = path.join(process.cwd(), 'public', download.localFilePath);
      try {
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
      } catch (fileError) {
        console.error('Failed to delete file:', fileError);
      }

      // Update download to remove file references
      const updatedDownload = await storage.updateDownload(downloadId, {
        localFilePath: null,
        originalFilename: null,
        mimeType: null,
        fileSizeBytes: null
      });

      res.json({
        success: true,
        message: 'Archivo eliminado exitosamente',
        download: updatedDownload
      });
      
    } catch (error) {
      console.error('Delete download file error:', error);
      res.status(500).json({
        error: 'Internal server error',
        message: 'Error interno del servidor'
      });
    }
  });

  // Get all site settings endpoint (public)
  app.get('/api/site-settings', async (req, res) => {
    try {
      const settings = await storage.getAllSiteSettings();
      
      res.status(200).json({
        success: true,
        settings: settings
      });
      
    } catch (error) {
      console.error('Get site settings error:', error);
      res.status(500).json({
        error: 'Internal server error',
        message: 'Error al obtener configuraciones del sitio'
      });
    }
  });

  // Create site setting endpoint (admin only)
  app.post('/api/site-settings', async (req, res) => {
    try {
      // Check authentication and admin role
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
          message: 'Sesión inválida'
        });
      }

      // Check if user is admin
      if (user.role !== USER_ROLES.ADMINISTRADOR) {
        return res.status(403).json({
          error: 'Insufficient permissions',
          message: 'No tienes permisos para realizar esta acción'
        });
      }

      // Validate request body
      const validatedData = insertSiteSettingSchema.parse(req.body);
      
      // Create site setting
      const newSetting = await storage.createSiteSetting(validatedData);
      
      res.status(201).json({
        success: true,
        message: 'Configuración creada exitosamente',
        setting: newSetting
      });
      
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          error: 'Validation error',
          message: 'Datos inválidos',
          details: error.errors
        });
      }
      
      console.error('Create site setting error:', error);
      res.status(500).json({
        error: 'Internal server error',
        message: 'Error interno del servidor'
      });
    }
  });

  // Update site setting endpoint (admin only)
  app.patch('/api/site-settings/:key', async (req, res) => {
    try {
      // Check authentication and admin role
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
          message: 'Sesión inválida'
        });
      }

      // Check if user is admin
      if (user.role !== USER_ROLES.ADMINISTRADOR) {
        return res.status(403).json({
          error: 'Insufficient permissions',
          message: 'No tienes permisos para realizar esta acción'
        });
      }

      const { key } = req.params;
      
      // Validate request body
      const validatedData = updateSiteSettingSchema.parse(req.body);
      
      // Update site setting
      const updatedSetting = await storage.updateSiteSetting(key, validatedData);
      
      if (!updatedSetting) {
        return res.status(404).json({
          error: 'Setting not found',
          message: 'Configuración no encontrada'
        });
      }
      
      res.status(200).json({
        success: true,
        message: 'Configuración actualizada exitosamente',
        setting: updatedSetting
      });
      
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          error: 'Validation error',
          message: 'Datos inválidos',
          details: error.errors
        });
      }
      
      console.error('Update site setting error:', error);
      res.status(500).json({
        error: 'Internal server error',
        message: 'Error interno del servidor'
      });
    }
  });

  // Support ticket routes
  // Get current user's tickets
  app.get('/api/tickets', async (req, res) => {
    try {
      const sessionId = req.cookies.sessionId;
      if (!sessionId) {
        return res.status(401).json({
          error: 'Unauthorized',
          message: 'Debes iniciar sesión para ver tus tickets'
        });
      }

      const user = await storage.getUserBySession(sessionId);
      if (!user) {
        return res.status(401).json({
          error: 'Invalid session',
          message: 'Sesión inválida'
        });
      }

      const tickets = await storage.getSupportTicketsByUserId(user.id);
      
      res.status(200).json({
        success: true,
        tickets
      });
      
    } catch (error) {
      console.error('Get tickets error:', error);
      res.status(500).json({
        error: 'Internal server error',
        message: 'Error interno del servidor'
      });
    }
  });

  // Create new support ticket
  app.post('/api/tickets', async (req, res) => {
    try {
      const sessionId = req.cookies.sessionId;
      if (!sessionId) {
        return res.status(401).json({
          error: 'Unauthorized',
          message: 'Debes iniciar sesión para crear un ticket'
        });
      }

      const user = await storage.getUserBySession(sessionId);
      if (!user) {
        return res.status(401).json({
          error: 'Invalid session',
          message: 'Sesión inválida'
        });
      }

      // Validate request body
      const validatedData = insertSupportTicketSchema.parse({
        ...req.body,
        userId: user.id
      });
      
      // Create ticket
      const newTicket = await storage.createSupportTicket(validatedData);
      
      res.status(201).json({
        success: true,
        message: 'Ticket creado exitosamente',
        ticket: newTicket
      });
      
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          error: 'Validation error',
          message: 'Datos inválidos',
          details: error.errors
        });
      }
      
      console.error('Create ticket error:', error);
      res.status(500).json({
        error: 'Internal server error',
        message: 'Error interno del servidor'
      });
    }
  });

  // Get ticket by ID with messages
  app.get('/api/tickets/:id', async (req, res) => {
    try {
      const sessionId = req.cookies.sessionId;
      if (!sessionId) {
        return res.status(401).json({
          error: 'Unauthorized',
          message: 'Debes iniciar sesión para ver este ticket'
        });
      }

      const user = await storage.getUserBySession(sessionId);
      if (!user) {
        return res.status(401).json({
          error: 'Invalid session',
          message: 'Sesión inválida'
        });
      }

      const ticketId = req.params.id;
      const ticket = await storage.getSupportTicketById(ticketId);

      if (!ticket) {
        return res.status(404).json({
          error: 'Not found',
          message: 'Ticket no encontrado'
        });
      }

      // Check if user owns the ticket or is staff (GM or higher)
      const isStaff = user.role !== 'player';
      if (ticket.userId !== user.id && !isStaff) {
        return res.status(403).json({
          error: 'Forbidden',
          message: 'No tienes permiso para ver este ticket'
        });
      }

      // Get messages for the ticket
      const messages = await storage.getTicketMessages(ticketId);

      // Get user info for each message
      const messagesWithUsers = await Promise.all(
        messages.map(async (msg) => {
          const sender = await storage.getUser(msg.senderId);
          return {
            ...msg,
            senderName: sender?.username || 'Usuario desconocido',
            isStaff: sender?.role !== 'player'
          };
        })
      );

      res.status(200).json({
        success: true,
        ticket,
        messages: messagesWithUsers
      });

    } catch (error) {
      console.error('Get ticket error:', error);
      res.status(500).json({
        error: 'Internal server error',
        message: 'Error interno del servidor'
      });
    }
  });

  // Create a message for a ticket
  app.post('/api/tickets/:id/messages', async (req, res) => {
    try {
      const sessionId = req.cookies.sessionId;
      if (!sessionId) {
        return res.status(401).json({
          error: 'Unauthorized',
          message: 'Debes iniciar sesión para enviar mensajes'
        });
      }

      const user = await storage.getUserBySession(sessionId);
      if (!user) {
        return res.status(401).json({
          error: 'Invalid session',
          message: 'Sesión inválida'
        });
      }

      const ticketId = req.params.id;
      const ticket = await storage.getSupportTicketById(ticketId);

      if (!ticket) {
        return res.status(404).json({
          error: 'Not found',
          message: 'Ticket no encontrado'
        });
      }

      // Check if user owns the ticket or is staff
      const isStaff = user.role !== 'player';
      if (ticket.userId !== user.id && !isStaff) {
        return res.status(403).json({
          error: 'Forbidden',
          message: 'No tienes permiso para enviar mensajes en este ticket'
        });
      }

      // Validate message
      const validatedData = insertTicketMessageSchema.parse({
        ticketId,
        senderId: user.id,
        message: req.body.message
      });

      // Create message
      const newMessage = await storage.createTicketMessage(validatedData);

      // Update ticket status to in_progress if it's open and staff is responding
      if (ticket.status === 'open' && isStaff) {
        await storage.updateSupportTicket(ticketId, { status: 'in_progress' });
      }

      // Broadcast message to WebSocket subscribers
      const messageData = {
        ...newMessage,
        senderName: user.username,
        isStaff
      };
      
      if (typeof (app as any).broadcastTicketMessage === 'function') {
        (app as any).broadcastTicketMessage(ticketId, messageData);
      }

      res.status(201).json({
        success: true,
        message: newMessage,
        senderName: user.username,
        isStaff
      });

    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          error: 'Validation error',
          message: 'Datos inválidos',
          details: error.errors
        });
      }

      console.error('Create message error:', error);
      res.status(500).json({
        error: 'Internal server error',
        message: 'Error interno del servidor'
      });
    }
  });

  // Update support ticket
  app.patch('/api/tickets/:id', async (req, res) => {
    try {
      const sessionId = req.cookies.sessionId;
      if (!sessionId) {
        return res.status(401).json({
          error: 'Unauthorized',
          message: 'Debes iniciar sesión para actualizar tickets'
        });
      }

      const user = await storage.getUserBySession(sessionId);
      if (!user) {
        return res.status(401).json({
          error: 'Invalid session',
          message: 'Sesión inválida'
        });
      }

      const ticketId = req.params.id;
      
      // Check if user owns the ticket or is admin/GM
      const existingTickets = await storage.getSupportTicketsByUserId(user.id);
      const userOwnsTicket = existingTickets.some(ticket => ticket.id === ticketId);
      const isStaff = user.role !== 'player';
      
      if (!userOwnsTicket && !isStaff) {
        return res.status(403).json({
          error: 'Forbidden',
          message: 'No tienes permisos para actualizar este ticket'
        });
      }

      // Validate request body
      const validatedData = updateSupportTicketSchema.parse(req.body);
      
      // Update ticket
      const updatedTicket = await storage.updateSupportTicket(ticketId, validatedData);
      
      if (!updatedTicket) {
        return res.status(404).json({
          error: 'Ticket not found',
          message: 'Ticket no encontrado'
        });
      }
      
      res.status(200).json({
        success: true,
        message: 'Ticket actualizado exitosamente',
        ticket: updatedTicket
      });
      
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          error: 'Validation error',
          message: 'Datos inválidos',
          details: error.errors
        });
      }
      
      console.error('Update ticket error:', error);
      res.status(500).json({
        error: 'Internal server error',
        message: 'Error interno del servidor'
      });
    }
  });

  // Get all tickets (admin/GM only)
  app.get('/api/admin/tickets', async (req, res) => {
    try {
      const sessionId = req.cookies.sessionId;
      if (!sessionId) {
        return res.status(401).json({
          error: 'Unauthorized',
          message: 'Debes iniciar sesión'
        });
      }

      const user = await storage.getUserBySession(sessionId);
      if (!user || user.role === 'player') {
        return res.status(403).json({
          error: 'Forbidden',
          message: 'No tienes permisos para ver todos los tickets'
        });
      }

      const tickets = await storage.getAllSupportTickets();
      
      res.status(200).json({
        success: true,
        tickets
      });
      
    } catch (error) {
      console.error('Get all tickets error:', error);
      res.status(500).json({
        error: 'Internal server error',
        message: 'Error interno del servidor'
      });
    }
  });

  const httpServer = createServer(app);

  // WebSocket server for real-time ticket messages
  const wss = new WebSocketServer({ server: httpServer, path: '/ws' });
  
  // Map to track connected clients by ticket ID
  const ticketConnections = new Map<string, Set<WebSocket>>();

  wss.on('connection', async (ws, req) => {
    let currentTicketId: string | null = null;
    let authenticatedUserId: string | null = null;

    // Authenticate using session cookie from request
    const cookies = req.headers.cookie?.split('; ').reduce((acc, cookie) => {
      const [key, value] = cookie.split('=');
      acc[key] = value;
      return acc;
    }, {} as Record<string, string>) || {};

    const sessionId = cookies.sessionId;
    
    if (sessionId) {
      const user = await storage.getUserBySession(sessionId);
      if (user) {
        authenticatedUserId = user.id;
        ws.send(JSON.stringify({ type: 'auth_success', userId: user.id }));
      } else {
        ws.send(JSON.stringify({ type: 'auth_error', message: 'Invalid session' }));
        ws.close();
        return;
      }
    } else {
      ws.send(JSON.stringify({ type: 'auth_error', message: 'No session found' }));
      ws.close();
      return;
    }

    ws.on('message', async (data) => {
      try {
        const message = JSON.parse(data.toString());

        if (message.type === 'subscribe' && authenticatedUserId) {
          // Subscribe to a ticket
          const ticketId = message.ticketId;
          const ticket = await storage.getSupportTicketById(ticketId);

          if (ticket) {
            const user = await storage.getUser(authenticatedUserId);
            const isStaff = user && user.role !== 'player';
            
            // Check if user owns the ticket or is staff
            if (ticket.userId === authenticatedUserId || isStaff) {
              // Unsubscribe from previous ticket if any
              if (currentTicketId && ticketConnections.has(currentTicketId)) {
                ticketConnections.get(currentTicketId)?.delete(ws);
              }

              // Subscribe to new ticket
              currentTicketId = ticketId;
              if (!ticketConnections.has(ticketId)) {
                ticketConnections.set(ticketId, new Set());
              }
              ticketConnections.get(ticketId)?.add(ws);

              ws.send(JSON.stringify({ 
                type: 'subscribed', 
                ticketId 
              }));
            } else {
              ws.send(JSON.stringify({ 
                type: 'error', 
                message: 'No tienes permiso para ver este ticket' 
              }));
            }
          } else {
            ws.send(JSON.stringify({ 
              type: 'error', 
              message: 'Ticket no encontrado' 
            }));
          }
        }
      } catch (error) {
        console.error('WebSocket message error:', error);
        ws.send(JSON.stringify({ 
          type: 'error', 
          message: 'Error procesando mensaje' 
        }));
      }
    });

    ws.on('close', () => {
      // Clean up on disconnect
      if (currentTicketId && ticketConnections.has(currentTicketId)) {
        ticketConnections.get(currentTicketId)?.delete(ws);
        if (ticketConnections.get(currentTicketId)?.size === 0) {
          ticketConnections.delete(currentTicketId);
        }
      }
    });

    ws.on('error', (error) => {
      console.error('WebSocket error:', error);
    });
  });

  // Function to broadcast new messages to ticket subscribers
  const broadcastTicketMessage = (ticketId: string, message: any) => {
    const connections = ticketConnections.get(ticketId);
    if (connections) {
      const data = JSON.stringify({
        type: 'new_message',
        message
      });
      
      connections.forEach(client => {
        if (client.readyState === WebSocket.OPEN) {
          client.send(data);
        }
      });
    }
  };

  // Export broadcast function for use in routes
  (app as any).broadcastTicketMessage = broadcastTicketMessage;

  return httpServer;
}
