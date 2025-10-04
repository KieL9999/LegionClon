import { type User, type InsertUser, type Session, type ChangePasswordData, type ChangeEmailData, type WebFeature, type InsertWebFeature, type UpdateWebFeature, type ServerNews, type InsertServerNews, type UpdateServerNews, type Download, type InsertDownload, type UpdateDownload, type SiteSetting, type InsertSiteSetting, type UpdateSiteSetting, type SupportTicket, type InsertSupportTicket, type UpdateSupportTicket, type TicketMessage, type InsertTicketMessage, users, sessions, webFeatures, serverNews, downloads, siteSettings, supportTickets, ticketMessages } from "@shared/schema";
import { randomUUID, createHash, pbkdf2Sync, randomBytes } from "crypto";
import { db } from "./db";
import { eq, desc, sql } from "drizzle-orm";

// modify the interface with any CRUD methods
// you might need

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  getAllUsers(): Promise<User[]>;
  createUser(user: InsertUser): Promise<User>;
  validateUser(username: string, password: string): Promise<User | undefined>;
  createSession(userId: string): Promise<Session>;
  getSession(sessionId: string): Promise<Session | undefined>;
  deleteSession(sessionId: string): Promise<void>;
  getUserBySession(sessionId: string): Promise<User | undefined>;
  updateUserPassword(userId: string, newPassword: string): Promise<User>;
  updateUserEmail(userId: string, newEmail: string): Promise<User>;
  updateUserRole(userId: string, role: string): Promise<User>;
  updateUserLastLogin(userId: string): Promise<User>;
  getAllWebFeatures(): Promise<WebFeature[]>;
  createWebFeature(feature: InsertWebFeature): Promise<WebFeature>;
  updateWebFeature(id: string, feature: UpdateWebFeature): Promise<WebFeature | undefined>;
  deleteWebFeature(id: string): Promise<WebFeature | undefined>;
  getAllServerNews(): Promise<ServerNews[]>;
  createServerNews(news: InsertServerNews): Promise<ServerNews>;
  updateServerNews(id: string, news: UpdateServerNews): Promise<ServerNews | undefined>;
  deleteServerNews(id: string): Promise<ServerNews | undefined>;
  getAllDownloads(): Promise<Download[]>;
  getDownloadById(id: string): Promise<Download | undefined>;
  createDownload(download: InsertDownload): Promise<Download>;
  updateDownload(id: string, download: UpdateDownload): Promise<Download | undefined>;
  deleteDownload(id: string): Promise<Download | undefined>;
  incrementDownloadCount(id: string): Promise<Download | undefined>;
  updateDownloadWithFile(id: string, fileData: {
    localFilePath: string;
    originalFilename: string;
    mimeType: string;
    fileSizeBytes: number;
  }): Promise<Download | undefined>;
  getAllSiteSettings(): Promise<SiteSetting[]>;
  getSiteSettingByKey(key: string): Promise<SiteSetting | undefined>;
  createSiteSetting(setting: InsertSiteSetting): Promise<SiteSetting>;
  updateSiteSetting(key: string, setting: UpdateSiteSetting): Promise<SiteSetting | undefined>;
  deleteSiteSetting(key: string): Promise<SiteSetting | undefined>;
  getAllSupportTickets(): Promise<SupportTicket[]>;
  getSupportTicketsByUserId(userId: string): Promise<SupportTicket[]>;
  getSupportTicketById(id: string): Promise<SupportTicket | undefined>;
  createSupportTicket(ticket: InsertSupportTicket): Promise<SupportTicket>;
  updateSupportTicket(id: string, ticket: UpdateSupportTicket): Promise<SupportTicket | undefined>;
  deleteSupportTicket(id: string): Promise<SupportTicket | undefined>;
  getTicketMessages(ticketId: string): Promise<TicketMessage[]>;
  createTicketMessage(message: InsertTicketMessage): Promise<TicketMessage>;
}

export class DatabaseStorage implements IStorage {
  constructor() {
    if (!db) {
      throw new Error('Database not initialized. DATABASE_URL is required.');
    }
  }

  private hashPassword(password: string): string {
    const salt = randomBytes(16).toString('hex');
    const hash = pbkdf2Sync(password, salt, 10000, 64, 'sha512').toString('hex');
    return `${salt}:${hash}`;
  }

  private verifyPassword(password: string, hashedPassword: string): boolean {
    const [salt, hash] = hashedPassword.split(':');
    const testHash = pbkdf2Sync(password, salt, 10000, 64, 'sha512').toString('hex');
    return hash === testHash;
  }

  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db!.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db!.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db!.select().from(users).where(eq(users.email, email));
    return user || undefined;
  }

  async getAllUsers(): Promise<User[]> {
    const allUsers = await db!.select().from(users);
    return allUsers;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const hashedPassword = this.hashPassword(insertUser.password);
    const [user] = await db!
      .insert(users)
      .values({
        username: insertUser.username,
        email: insertUser.email,
        password: hashedPassword,
        role: "player"
      })
      .returning();
    return user;
  }

  async validateUser(username: string, password: string): Promise<User | undefined> {
    const user = await this.getUserByUsername(username);
    if (user && this.verifyPassword(password, user.password)) {
      return user;
    }
    return undefined;
  }

  async createSession(userId: string): Promise<Session> {
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours
    
    const [session] = await db!
      .insert(sessions)
      .values({
        userId,
        sessionData: JSON.stringify({ createdAt: new Date() }),
        expiresAt
      })
      .returning();
    
    return session;
  }

  async getSession(sessionId: string): Promise<Session | undefined> {
    const [session] = await db!.select().from(sessions).where(eq(sessions.id, sessionId));
    if (session && session.expiresAt > new Date()) {
      return session;
    } else if (session) {
      // Session expired, delete it
      await db!.delete(sessions).where(eq(sessions.id, sessionId));
    }
    return undefined;
  }

  async deleteSession(sessionId: string): Promise<void> {
    await db!.delete(sessions).where(eq(sessions.id, sessionId));
  }

  async getUserBySession(sessionId: string): Promise<User | undefined> {
    const session = await this.getSession(sessionId);
    if (session) {
      return this.getUser(session.userId);
    }
    return undefined;
  }

  async updateUserPassword(userId: string, newPassword: string): Promise<User> {
    const hashedPassword = this.hashPassword(newPassword);
    const [updatedUser] = await db!
      .update(users)
      .set({ 
        password: hashedPassword,
        updatedAt: new Date()
      })
      .where(eq(users.id, userId))
      .returning();
    
    if (!updatedUser) {
      throw new Error('User not found');
    }
    
    return updatedUser;
  }

  async updateUserEmail(userId: string, newEmail: string): Promise<User> {
    const [updatedUser] = await db!
      .update(users)
      .set({ 
        email: newEmail,
        updatedAt: new Date()
      })
      .where(eq(users.id, userId))
      .returning();
    
    if (!updatedUser) {
      throw new Error('User not found');
    }
    
    return updatedUser;
  }

  async updateUserRole(userId: string, role: string): Promise<User> {
    const [updatedUser] = await db!
      .update(users)
      .set({ 
        role,
        updatedAt: new Date()
      })
      .where(eq(users.id, userId))
      .returning();
    
    if (!updatedUser) {
      throw new Error('User not found');
    }
    
    return updatedUser;
  }

  async updateUserLastLogin(userId: string): Promise<User> {
    const [updatedUser] = await db!
      .update(users)
      .set({ 
        lastLogin: new Date(),
        updatedAt: new Date()
      })
      .where(eq(users.id, userId))
      .returning();
    
    if (!updatedUser) {
      throw new Error('User not found');
    }
    
    return updatedUser;
  }

  async getAllWebFeatures(): Promise<WebFeature[]> {
    const features = await db!
      .select()
      .from(webFeatures)
      .where(eq(webFeatures.isActive, true))
      .orderBy(webFeatures.displayOrder);
    return features;
  }

  async createWebFeature(insertFeature: InsertWebFeature): Promise<WebFeature> {
    const [feature] = await db!
      .insert(webFeatures)
      .values({
        ...insertFeature,
        createdAt: new Date(),
        updatedAt: new Date()
      })
      .returning();
    return feature;
  }

  async updateWebFeature(id: string, updateData: UpdateWebFeature): Promise<WebFeature | undefined> {
    const [updatedFeature] = await db!
      .update(webFeatures)
      .set({ 
        ...updateData,
        updatedAt: new Date()
      })
      .where(eq(webFeatures.id, id))
      .returning();
    
    return updatedFeature || undefined;
  }

  async deleteWebFeature(id: string): Promise<WebFeature | undefined> {
    const [deletedFeature] = await db!
      .delete(webFeatures)
      .where(eq(webFeatures.id, id))
      .returning();
    
    return deletedFeature || undefined;
  }

  async getAllServerNews(): Promise<ServerNews[]> {
    const news = await db!
      .select()
      .from(serverNews)
      .where(eq(serverNews.isActive, true))
      .orderBy(desc(serverNews.publishedAt), serverNews.displayOrder);
    return news;
  }

  async createServerNews(insertNews: InsertServerNews): Promise<ServerNews> {
    const [news] = await db!
      .insert(serverNews)
      .values({
        ...insertNews,
        createdAt: new Date(),
        updatedAt: new Date()
      })
      .returning();
    return news;
  }

  async updateServerNews(id: string, updateData: UpdateServerNews): Promise<ServerNews | undefined> {
    const [updatedNews] = await db!
      .update(serverNews)
      .set({ 
        ...updateData,
        updatedAt: new Date()
      })
      .where(eq(serverNews.id, id))
      .returning();
    
    return updatedNews || undefined;
  }

  async deleteServerNews(id: string): Promise<ServerNews | undefined> {
    const [deletedNews] = await db!
      .delete(serverNews)
      .where(eq(serverNews.id, id))
      .returning();
    
    return deletedNews || undefined;
  }

  async getAllDownloads(): Promise<Download[]> {
    const allDownloads = await db!
      .select()
      .from(downloads)
      .where(eq(downloads.isActive, true))
      .orderBy(downloads.displayOrder, desc(downloads.releaseDate));
    return allDownloads;
  }

  async getDownloadById(id: string): Promise<Download | undefined> {
    const [download] = await db!.select().from(downloads).where(eq(downloads.id, id));
    return download || undefined;
  }

  async createDownload(insertDownload: InsertDownload): Promise<Download> {
    const [download] = await db!
      .insert(downloads)
      .values({
        ...insertDownload,
        createdAt: new Date(),
        updatedAt: new Date()
      })
      .returning();
    return download;
  }

  async updateDownload(id: string, updateData: UpdateDownload): Promise<Download | undefined> {
    const [updatedDownload] = await db!
      .update(downloads)
      .set({ 
        ...updateData,
        updatedAt: new Date()
      })
      .where(eq(downloads.id, id))
      .returning();
    
    return updatedDownload || undefined;
  }

  async deleteDownload(id: string): Promise<Download | undefined> {
    const [deletedDownload] = await db!
      .delete(downloads)
      .where(eq(downloads.id, id))
      .returning();
    
    return deletedDownload || undefined;
  }

  async incrementDownloadCount(id: string): Promise<Download | undefined> {
    const [updatedDownload] = await db!
      .update(downloads)
      .set({ 
        downloadCount: sql`${downloads.downloadCount} + 1`,
        updatedAt: new Date()
      })
      .where(eq(downloads.id, id))
      .returning();
    
    return updatedDownload || undefined;
  }

  async updateDownloadWithFile(id: string, fileData: {
    localFilePath: string;
    originalFilename: string;
    mimeType: string;
    fileSizeBytes: number;
  }): Promise<Download | undefined> {
    const [updatedDownload] = await db!
      .update(downloads)
      .set({ 
        localFilePath: fileData.localFilePath,
        originalFilename: fileData.originalFilename,
        mimeType: fileData.mimeType,
        fileSizeBytes: fileData.fileSizeBytes,
        downloadUrl: null, // Clear external URL when local file is set
        updatedAt: new Date()
      })
      .where(eq(downloads.id, id))
      .returning();
    
    return updatedDownload || undefined;
  }
  async getAllSiteSettings(): Promise<SiteSetting[]> {
    const allSettings = await db!.select().from(siteSettings);
    return allSettings;
  }

  async getSiteSettingByKey(key: string): Promise<SiteSetting | undefined> {
    const [setting] = await db!.select().from(siteSettings).where(eq(siteSettings.key, key));
    return setting || undefined;
  }

  async createSiteSetting(insertSetting: InsertSiteSetting): Promise<SiteSetting> {
    const [newSetting] = await db!
      .insert(siteSettings)
      .values({
        ...insertSetting,
        createdAt: new Date(),
        updatedAt: new Date()
      })
      .returning();
    
    return newSetting;
  }

  async updateSiteSetting(key: string, updateSetting: UpdateSiteSetting): Promise<SiteSetting | undefined> {
    const [updatedSetting] = await db!
      .update(siteSettings)
      .set({
        ...updateSetting,
        updatedAt: new Date()
      })
      .where(eq(siteSettings.key, key))
      .returning();
      
    return updatedSetting || undefined;
  }

  async deleteSiteSetting(key: string): Promise<SiteSetting | undefined> {
    const [deletedSetting] = await db!
      .delete(siteSettings)
      .where(eq(siteSettings.key, key))
      .returning();
      
    return deletedSetting || undefined;
  }

  async getAllSupportTickets(): Promise<SupportTicket[]> {
    const tickets = await db!
      .select()
      .from(supportTickets)
      .orderBy(desc(supportTickets.createdAt));
    return tickets;
  }

  async getSupportTicketsByUserId(userId: string): Promise<SupportTicket[]> {
    const tickets = await db!
      .select()
      .from(supportTickets)
      .where(eq(supportTickets.userId, userId))
      .orderBy(desc(supportTickets.createdAt));
    return tickets;
  }

  async getSupportTicketById(id: string): Promise<SupportTicket | undefined> {
    const [ticket] = await db!
      .select()
      .from(supportTickets)
      .where(eq(supportTickets.id, id));
    return ticket || undefined;
  }

  async createSupportTicket(insertTicket: InsertSupportTicket): Promise<SupportTicket> {
    const [ticket] = await db!
      .insert(supportTickets)
      .values({
        ...insertTicket,
        createdAt: new Date(),
        updatedAt: new Date()
      })
      .returning();
    return ticket;
  }

  async updateSupportTicket(id: string, updateData: UpdateSupportTicket): Promise<SupportTicket | undefined> {
    const [updatedTicket] = await db!
      .update(supportTickets)
      .set({ 
        ...updateData,
        updatedAt: new Date()
      })
      .where(eq(supportTickets.id, id))
      .returning();
    
    return updatedTicket || undefined;
  }

  async deleteSupportTicket(id: string): Promise<SupportTicket | undefined> {
    const [deletedTicket] = await db!
      .delete(supportTickets)
      .where(eq(supportTickets.id, id))
      .returning();
    
    return deletedTicket || undefined;
  }

  async getTicketMessages(ticketId: string): Promise<TicketMessage[]> {
    const messages = await db!
      .select()
      .from(ticketMessages)
      .where(eq(ticketMessages.ticketId, ticketId))
      .orderBy(ticketMessages.createdAt);
    return messages;
  }

  async createTicketMessage(insertMessage: InsertTicketMessage): Promise<TicketMessage> {
    const [message] = await db!
      .insert(ticketMessages)
      .values({
        ...insertMessage,
        createdAt: new Date()
      })
      .returning();
    return message;
  }
}

// Memory storage implementation as fallback when database is not available
export class MemStorage implements IStorage {
  private users: Map<string, User> = new Map();
  private sessions: Map<string, Session> = new Map();
  private webFeatures: Map<string, WebFeature> = new Map();
  private serverNews: Map<string, ServerNews> = new Map();
  private downloads: Map<string, Download> = new Map();
  private siteSettings: Map<string, SiteSetting> = new Map();
  private supportTickets: Map<string, SupportTicket> = new Map();
  private ticketMessages: Map<string, TicketMessage> = new Map();

  constructor() {
    this.initializeDefaults();
  }

  private initializeDefaults(): void {
    // Initialize some default data for demonstration
    const adminId = randomUUID();
    const adminUser: User = {
      id: adminId,
      username: "admin",
      password: this.hashPassword("admin123"),
      email: "admin@aetherwow.com",
      role: "administrador",
      coins: 1000,
      vipLevel: 5,
      isBanned: false,
      banReason: null,
      lastLogin: new Date(),
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.users.set(adminId, adminUser);

    // Add some default web features
    const feature1: WebFeature = {
      id: randomUUID(),
      title: "Legion Raids Exclusivas",
      description: "Descubre las mazmorras y raids únicas disponibles solo en AetherWoW",
      image: "/api/placeholder/400/300",
      type: "Característica",
      category: "pve",
      displayOrder: 1,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.webFeatures.set(feature1.id, feature1);

    // Add default site settings
    const defaultSettings = [
      { key: "site_title", value: "AetherWoW - Servidor WoW Legion", description: "Título del sitio web", type: "text" },
      { key: "server_name", value: "AetherWoW", description: "Nombre del servidor", type: "text" },
      { key: "online_players", value: "247", description: "Jugadores conectados", type: "text" }
    ];

    defaultSettings.forEach(setting => {
      const siteSetting: SiteSetting = {
        id: randomUUID(),
        key: setting.key,
        value: setting.value,
        description: setting.description,
        type: setting.type,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      this.siteSettings.set(setting.key, siteSetting);
    });
  }

  private hashPassword(password: string): string {
    const salt = randomBytes(16).toString('hex');
    const hash = pbkdf2Sync(password, salt, 10000, 64, 'sha512').toString('hex');
    return `${salt}:${hash}`;
  }

  private verifyPassword(password: string, hashedPassword: string): boolean {
    const [salt, hash] = hashedPassword.split(':');
    const testHash = pbkdf2Sync(password, salt, 10000, 64, 'sha512').toString('hex');
    return hash === testHash;
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.username === username);
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.email === email);
  }

  async getAllUsers(): Promise<User[]> {
    return Array.from(this.users.values());
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const hashedPassword = this.hashPassword(insertUser.password);
    const now = new Date();
    
    const user: User = {
      id,
      username: insertUser.username,
      password: hashedPassword,
      email: insertUser.email,
      role: "player",
      coins: 0,
      vipLevel: 0,
      isBanned: false,
      banReason: null,
      lastLogin: null,
      createdAt: now,
      updatedAt: now
    };
    
    this.users.set(id, user);
    return user;
  }

  async validateUser(username: string, password: string): Promise<User | undefined> {
    const user = await this.getUserByUsername(username);
    if (user && this.verifyPassword(password, user.password)) {
      return user;
    }
    return undefined;
  }

  async createSession(userId: string): Promise<Session> {
    const id = randomUUID();
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours
    
    const session: Session = {
      id,
      userId,
      sessionData: JSON.stringify({ createdAt: new Date() }),
      expiresAt,
      createdAt: new Date()
    };
    
    this.sessions.set(id, session);
    return session;
  }

  async getSession(sessionId: string): Promise<Session | undefined> {
    const session = this.sessions.get(sessionId);
    if (session && session.expiresAt > new Date()) {
      return session;
    } else if (session) {
      this.sessions.delete(sessionId);
    }
    return undefined;
  }

  async deleteSession(sessionId: string): Promise<void> {
    this.sessions.delete(sessionId);
  }

  async getUserBySession(sessionId: string): Promise<User | undefined> {
    const session = await this.getSession(sessionId);
    if (session) {
      return this.getUser(session.userId);
    }
    return undefined;
  }

  async updateUserPassword(userId: string, newPassword: string): Promise<User> {
    const user = this.users.get(userId);
    if (!user) throw new Error('User not found');
    
    const hashedPassword = this.hashPassword(newPassword);
    const updatedUser = { ...user, password: hashedPassword, updatedAt: new Date() };
    this.users.set(userId, updatedUser);
    return updatedUser;
  }

  async updateUserEmail(userId: string, newEmail: string): Promise<User> {
    const user = this.users.get(userId);
    if (!user) throw new Error('User not found');
    
    const updatedUser = { ...user, email: newEmail, updatedAt: new Date() };
    this.users.set(userId, updatedUser);
    return updatedUser;
  }

  async updateUserRole(userId: string, role: string): Promise<User> {
    const user = this.users.get(userId);
    if (!user) throw new Error('User not found');
    
    const updatedUser = { ...user, role, updatedAt: new Date() };
    this.users.set(userId, updatedUser);
    return updatedUser;
  }

  async updateUserLastLogin(userId: string): Promise<User> {
    const user = this.users.get(userId);
    if (!user) throw new Error('User not found');
    
    const updatedUser = { ...user, lastLogin: new Date(), updatedAt: new Date() };
    this.users.set(userId, updatedUser);
    return updatedUser;
  }

  async getAllWebFeatures(): Promise<WebFeature[]> {
    return Array.from(this.webFeatures.values())
      .filter(feature => feature.isActive)
      .sort((a, b) => a.displayOrder - b.displayOrder);
  }

  async createWebFeature(feature: InsertWebFeature): Promise<WebFeature> {
    const id = randomUUID();
    const now = new Date();
    const webFeature: WebFeature = {
      id,
      title: feature.title,
      description: feature.description,
      image: feature.image,
      type: feature.type || "Feature",
      category: feature.category || "general",
      displayOrder: feature.displayOrder || 0,
      isActive: feature.isActive ?? true,
      createdAt: now,
      updatedAt: now
    };
    this.webFeatures.set(id, webFeature);
    return webFeature;
  }

  async updateWebFeature(id: string, updateData: UpdateWebFeature): Promise<WebFeature | undefined> {
    const feature = this.webFeatures.get(id);
    if (!feature) return undefined;
    
    const updatedFeature = { ...feature, ...updateData, updatedAt: new Date() };
    this.webFeatures.set(id, updatedFeature);
    return updatedFeature;
  }

  async deleteWebFeature(id: string): Promise<WebFeature | undefined> {
    const feature = this.webFeatures.get(id);
    if (feature) {
      this.webFeatures.delete(id);
    }
    return feature;
  }

  async getAllServerNews(): Promise<ServerNews[]> {
    return Array.from(this.serverNews.values())
      .filter(news => news.isActive)
      .sort((a, b) => {
        if (a.publishedAt && b.publishedAt) {
          return b.publishedAt.getTime() - a.publishedAt.getTime();
        }
        return b.displayOrder - a.displayOrder;
      });
  }

  async createServerNews(news: InsertServerNews): Promise<ServerNews> {
    const id = randomUUID();
    const now = new Date();
    const serverNews: ServerNews = {
      id,
      title: news.title,
      content: news.content,
      summary: news.summary,
      image: news.image,
      category: news.category || "general",
      priority: news.priority || "normal",
      displayOrder: news.displayOrder || 0,
      isActive: news.isActive ?? true,
      publishedAt: news.publishedAt || now,
      createdAt: now,
      updatedAt: now
    };
    this.serverNews.set(id, serverNews);
    return serverNews;
  }

  async updateServerNews(id: string, updateData: UpdateServerNews): Promise<ServerNews | undefined> {
    const news = this.serverNews.get(id);
    if (!news) return undefined;
    
    const updatedNews = { ...news, ...updateData, updatedAt: new Date() };
    this.serverNews.set(id, updatedNews);
    return updatedNews;
  }

  async deleteServerNews(id: string): Promise<ServerNews | undefined> {
    const news = this.serverNews.get(id);
    if (news) {
      this.serverNews.delete(id);
    }
    return news;
  }

  async getAllDownloads(): Promise<Download[]> {
    return Array.from(this.downloads.values())
      .filter(download => download.isActive)
      .sort((a, b) => {
        if (a.displayOrder !== b.displayOrder) {
          return a.displayOrder - b.displayOrder;
        }
        if (a.releaseDate && b.releaseDate) {
          return b.releaseDate.getTime() - a.releaseDate.getTime();
        }
        return 0;
      });
  }

  async getDownloadById(id: string): Promise<Download | undefined> {
    return this.downloads.get(id);
  }

  async createDownload(download: InsertDownload): Promise<Download> {
    const id = randomUUID();
    const now = new Date();
    const newDownload: Download = {
      id,
      title: download.title,
      description: download.description,
      version: download.version,
      downloadUrl: download.downloadUrl || null,
      fileSize: download.fileSize,
      localFilePath: null,
      originalFilename: null,
      mimeType: null,
      fileSizeBytes: null,
      type: download.type || "client",
      platform: download.platform || "windows",
      releaseDate: download.releaseDate || now,
      isActive: download.isActive ?? true,
      displayOrder: download.displayOrder || 0,
      downloadCount: 0,
      createdAt: now,
      updatedAt: now
    };
    this.downloads.set(id, newDownload);
    return newDownload;
  }

  async updateDownload(id: string, updateData: UpdateDownload): Promise<Download | undefined> {
    const download = this.downloads.get(id);
    if (!download) return undefined;
    
    const updatedDownload = { ...download, ...updateData, updatedAt: new Date() };
    this.downloads.set(id, updatedDownload);
    return updatedDownload;
  }

  async deleteDownload(id: string): Promise<Download | undefined> {
    const download = this.downloads.get(id);
    if (download) {
      this.downloads.delete(id);
    }
    return download;
  }

  async incrementDownloadCount(id: string): Promise<Download | undefined> {
    const download = this.downloads.get(id);
    if (!download) return undefined;
    
    const updatedDownload = { 
      ...download, 
      downloadCount: download.downloadCount + 1, 
      updatedAt: new Date() 
    };
    this.downloads.set(id, updatedDownload);
    return updatedDownload;
  }

  async updateDownloadWithFile(id: string, fileData: {
    localFilePath: string;
    originalFilename: string;
    mimeType: string;
    fileSizeBytes: number;
  }): Promise<Download | undefined> {
    const download = this.downloads.get(id);
    if (!download) return undefined;
    
    const updatedDownload = { 
      ...download,
      localFilePath: fileData.localFilePath,
      originalFilename: fileData.originalFilename,
      mimeType: fileData.mimeType,
      fileSizeBytes: fileData.fileSizeBytes,
      downloadUrl: null, // Clear external URL when local file is set
      updatedAt: new Date() 
    };
    this.downloads.set(id, updatedDownload);
    return updatedDownload;
  }

  async getAllSiteSettings(): Promise<SiteSetting[]> {
    return Array.from(this.siteSettings.values());
  }

  async getSiteSettingByKey(key: string): Promise<SiteSetting | undefined> {
    return this.siteSettings.get(key);
  }

  async createSiteSetting(setting: InsertSiteSetting): Promise<SiteSetting> {
    const id = randomUUID();
    const now = new Date();
    const siteSetting: SiteSetting = {
      id,
      key: setting.key,
      value: setting.value,
      description: setting.description || null,
      type: setting.type || "text",
      createdAt: now,
      updatedAt: now
    };
    this.siteSettings.set(setting.key, siteSetting);
    return siteSetting;
  }

  async updateSiteSetting(key: string, updateSetting: UpdateSiteSetting): Promise<SiteSetting | undefined> {
    const setting = this.siteSettings.get(key);
    if (!setting) return undefined;
    
    const updatedSetting = { ...setting, ...updateSetting, updatedAt: new Date() };
    this.siteSettings.set(key, updatedSetting);
    return updatedSetting;
  }

  async deleteSiteSetting(key: string): Promise<SiteSetting | undefined> {
    const setting = this.siteSettings.get(key);
    if (setting) {
      this.siteSettings.delete(key);
    }
    return setting;
  }

  async getAllSupportTickets(): Promise<SupportTicket[]> {
    return Array.from(this.supportTickets.values())
      .sort((a, b) => {
        if (a.createdAt && b.createdAt) {
          return b.createdAt.getTime() - a.createdAt.getTime();
        }
        return 0;
      });
  }

  async getSupportTicketsByUserId(userId: string): Promise<SupportTicket[]> {
    return Array.from(this.supportTickets.values())
      .filter(ticket => ticket.userId === userId)
      .sort((a, b) => {
        if (a.createdAt && b.createdAt) {
          return b.createdAt.getTime() - a.createdAt.getTime();
        }
        return 0;
      });
  }

  async createSupportTicket(ticket: InsertSupportTicket): Promise<SupportTicket> {
    const id = randomUUID();
    const now = new Date();
    const supportTicket: SupportTicket = {
      id,
      userId: ticket.userId,
      title: ticket.title,
      description: ticket.description,
      status: ticket.status || "open",
      priority: ticket.priority || "normal",
      category: ticket.category || "general",
      assignedTo: ticket.assignedTo || null,
      createdAt: now,
      updatedAt: now
    };
    this.supportTickets.set(id, supportTicket);
    return supportTicket;
  }

  async updateSupportTicket(id: string, updateData: UpdateSupportTicket): Promise<SupportTicket | undefined> {
    const ticket = this.supportTickets.get(id);
    if (!ticket) return undefined;
    
    const updatedTicket = { ...ticket, ...updateData, updatedAt: new Date() };
    this.supportTickets.set(id, updatedTicket);
    return updatedTicket;
  }

  async deleteSupportTicket(id: string): Promise<SupportTicket | undefined> {
    const ticket = this.supportTickets.get(id);
    if (ticket) {
      this.supportTickets.delete(id);
    }
    return ticket;
  }

  async getSupportTicketById(id: string): Promise<SupportTicket | undefined> {
    return this.supportTickets.get(id);
  }

  async getTicketMessages(ticketId: string): Promise<TicketMessage[]> {
    return Array.from(this.ticketMessages.values())
      .filter(msg => msg.ticketId === ticketId)
      .sort((a, b) => {
        if (a.createdAt && b.createdAt) {
          return a.createdAt.getTime() - b.createdAt.getTime();
        }
        return 0;
      });
  }

  async createTicketMessage(message: InsertTicketMessage): Promise<TicketMessage> {
    const id = randomUUID();
    const now = new Date();
    const ticketMessage: TicketMessage = {
      id,
      ticketId: message.ticketId,
      senderId: message.senderId,
      message: message.message,
      createdAt: now
    };
    this.ticketMessages.set(id, ticketMessage);
    return ticketMessage;
  }
}

// Use memory storage as fallback when DATABASE_URL is not available
export const storage = process.env.DATABASE_URL ? new DatabaseStorage() : new MemStorage();
