import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertUserSchema } from "@shared/schema";
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

  const httpServer = createServer(app);

  return httpServer;
}
