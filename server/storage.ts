import { type User, type InsertUser, type Session } from "@shared/schema";
import { randomUUID, createHash, pbkdf2Sync, randomBytes } from "crypto";

// modify the interface with any CRUD methods
// you might need

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  validateUser(username: string, password: string): Promise<User | undefined>;
  createSession(userId: string): Promise<Session>;
  getSession(sessionId: string): Promise<Session | undefined>;
  deleteSession(sessionId: string): Promise<void>;
  getUserBySession(sessionId: string): Promise<User | undefined>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private sessions: Map<string, Session>;

  constructor() {
    this.users = new Map();
    this.sessions = new Map();
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
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.email === email,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const now = new Date();
    const hashedPassword = this.hashPassword(insertUser.password);
    const user: User = { 
      ...insertUser, 
      password: hashedPassword,
      id,
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
    const sessionId = randomUUID();
    const now = new Date();
    const expiresAt = new Date(now.getTime() + 24 * 60 * 60 * 1000); // 24 hours
    
    const session: Session = {
      id: sessionId,
      userId,
      sessionData: JSON.stringify({ createdAt: now }),
      expiresAt,
      createdAt: now
    };
    
    this.sessions.set(sessionId, session);
    return session;
  }

  async getSession(sessionId: string): Promise<Session | undefined> {
    const session = this.sessions.get(sessionId);
    if (session && session.expiresAt > new Date()) {
      return session;
    } else if (session) {
      // Session expired, delete it
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
}

export const storage = new MemStorage();
