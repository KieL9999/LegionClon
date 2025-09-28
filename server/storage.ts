import { type User, type InsertUser, type Session, type ChangePasswordData, type ChangeEmailData, type WebFeature, type InsertWebFeature, type UpdateWebFeature, type ServerNews, type InsertServerNews, type UpdateServerNews, type Download, type InsertDownload, type UpdateDownload, type SiteSetting, type InsertSiteSetting, type UpdateSiteSetting, users, sessions, webFeatures, serverNews, downloads, siteSettings } from "@shared/schema";
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
  getAllWebFeatures(): Promise<WebFeature[]>;
  createWebFeature(feature: InsertWebFeature): Promise<WebFeature>;
  updateWebFeature(id: string, feature: UpdateWebFeature): Promise<WebFeature | undefined>;
  deleteWebFeature(id: string): Promise<WebFeature | undefined>;
  getAllServerNews(): Promise<ServerNews[]>;
  createServerNews(news: InsertServerNews): Promise<ServerNews>;
  updateServerNews(id: string, news: UpdateServerNews): Promise<ServerNews | undefined>;
  deleteServerNews(id: string): Promise<ServerNews | undefined>;
  getAllDownloads(): Promise<Download[]>;
  createDownload(download: InsertDownload): Promise<Download>;
  updateDownload(id: string, download: UpdateDownload): Promise<Download | undefined>;
  deleteDownload(id: string): Promise<Download | undefined>;
  incrementDownloadCount(id: string): Promise<Download | undefined>;
  getAllSiteSettings(): Promise<SiteSetting[]>;
  getSiteSettingByKey(key: string): Promise<SiteSetting | undefined>;
  createSiteSetting(setting: InsertSiteSetting): Promise<SiteSetting>;
  updateSiteSetting(key: string, setting: UpdateSiteSetting): Promise<SiteSetting | undefined>;
  deleteSiteSetting(key: string): Promise<SiteSetting | undefined>;
}

export class DatabaseStorage implements IStorage {
  constructor() {
    // No initialization needed for database storage
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
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user || undefined;
  }

  async getAllUsers(): Promise<User[]> {
    const allUsers = await db.select().from(users);
    return allUsers;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const hashedPassword = this.hashPassword(insertUser.password);
    const [user] = await db
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
    
    const [session] = await db
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
    const [session] = await db.select().from(sessions).where(eq(sessions.id, sessionId));
    if (session && session.expiresAt > new Date()) {
      return session;
    } else if (session) {
      // Session expired, delete it
      await db.delete(sessions).where(eq(sessions.id, sessionId));
    }
    return undefined;
  }

  async deleteSession(sessionId: string): Promise<void> {
    await db.delete(sessions).where(eq(sessions.id, sessionId));
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
    const [updatedUser] = await db
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
    const [updatedUser] = await db
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
    const [updatedUser] = await db
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

  async getAllWebFeatures(): Promise<WebFeature[]> {
    const features = await db
      .select()
      .from(webFeatures)
      .where(eq(webFeatures.isActive, true))
      .orderBy(webFeatures.displayOrder);
    return features;
  }

  async createWebFeature(insertFeature: InsertWebFeature): Promise<WebFeature> {
    const [feature] = await db
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
    const [updatedFeature] = await db
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
    const [deletedFeature] = await db
      .delete(webFeatures)
      .where(eq(webFeatures.id, id))
      .returning();
    
    return deletedFeature || undefined;
  }

  async getAllServerNews(): Promise<ServerNews[]> {
    const news = await db
      .select()
      .from(serverNews)
      .where(eq(serverNews.isActive, true))
      .orderBy(desc(serverNews.publishedAt), serverNews.displayOrder);
    return news;
  }

  async createServerNews(insertNews: InsertServerNews): Promise<ServerNews> {
    const [news] = await db
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
    const [updatedNews] = await db
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
    const [deletedNews] = await db
      .delete(serverNews)
      .where(eq(serverNews.id, id))
      .returning();
    
    return deletedNews || undefined;
  }

  async getAllDownloads(): Promise<Download[]> {
    const allDownloads = await db
      .select()
      .from(downloads)
      .where(eq(downloads.isActive, true))
      .orderBy(downloads.displayOrder, desc(downloads.releaseDate));
    return allDownloads;
  }

  async createDownload(insertDownload: InsertDownload): Promise<Download> {
    const [download] = await db
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
    const [updatedDownload] = await db
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
    const [deletedDownload] = await db
      .delete(downloads)
      .where(eq(downloads.id, id))
      .returning();
    
    return deletedDownload || undefined;
  }

  async incrementDownloadCount(id: string): Promise<Download | undefined> {
    const [updatedDownload] = await db
      .update(downloads)
      .set({ 
        downloadCount: sql`${downloads.downloadCount} + 1`,
        updatedAt: new Date()
      })
      .where(eq(downloads.id, id))
      .returning();
    
    return updatedDownload || undefined;
  }
  async getAllSiteSettings(): Promise<SiteSetting[]> {
    const allSettings = await db.select().from(siteSettings);
    return allSettings;
  }

  async getSiteSettingByKey(key: string): Promise<SiteSetting | undefined> {
    const [setting] = await db.select().from(siteSettings).where(eq(siteSettings.key, key));
    return setting || undefined;
  }

  async createSiteSetting(insertSetting: InsertSiteSetting): Promise<SiteSetting> {
    const [newSetting] = await db
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
    const [updatedSetting] = await db
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
    const [deletedSetting] = await db
      .delete(siteSettings)
      .where(eq(siteSettings.key, key))
      .returning();
      
    return deletedSetting || undefined;
  }
}

export const storage = new DatabaseStorage();
