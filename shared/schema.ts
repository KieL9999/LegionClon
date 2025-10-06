import { sql } from "drizzle-orm";
import { pgTable, varchar, timestamp, text, uuid, integer, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  username: varchar("username", { length: 16 }).notNull().unique(),
  password: varchar("password", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  role: varchar("role", { length: 50 }).notNull().default("player"),
  coins: integer("coins").notNull().default(0),
  vipLevel: integer("vip_level").notNull().default(0),
  isBanned: boolean("is_banned").notNull().default(false),
  banReason: varchar("ban_reason", { length: 500 }),
  lastLogin: timestamp("last_login"),
  createdAt: timestamp("created_at").default(sql`CURRENT_TIMESTAMP`),
  updatedAt: timestamp("updated_at").default(sql`CURRENT_TIMESTAMP`),
});

export const sessions = pgTable("sessions", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: uuid("user_id").notNull(),
  sessionData: text("session_data"),
  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp("created_at").default(sql`CURRENT_TIMESTAMP`),
});

export const webFeatures = pgTable("web_features", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  title: varchar("title", { length: 100 }).notNull(),
  description: text("description").notNull(),
  image: varchar("image", { length: 255 }).notNull(),
  type: varchar("type", { length: 50 }).notNull().default("Feature"),
  category: varchar("category", { length: 50 }).notNull().default("general"),
  displayOrder: integer("display_order").notNull().default(0),
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at").default(sql`CURRENT_TIMESTAMP`),
  updatedAt: timestamp("updated_at").default(sql`CURRENT_TIMESTAMP`),
});

export const serverNews = pgTable("server_news", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  title: varchar("title", { length: 150 }).notNull(),
  content: text("content").notNull(),
  summary: varchar("summary", { length: 300 }).notNull(),
  image: varchar("image", { length: 255 }).notNull(),
  category: varchar("category", { length: 50 }).notNull().default("general"),
  priority: varchar("priority", { length: 20 }).notNull().default("normal"),
  displayOrder: integer("display_order").notNull().default(0),
  isActive: boolean("is_active").notNull().default(true),
  publishedAt: timestamp("published_at").default(sql`CURRENT_TIMESTAMP`),
  createdAt: timestamp("created_at").default(sql`CURRENT_TIMESTAMP`),
  updatedAt: timestamp("updated_at").default(sql`CURRENT_TIMESTAMP`),
});

export const downloads = pgTable("downloads", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  title: varchar("title", { length: 150 }).notNull(),
  description: text("description").notNull(),
  version: varchar("version", { length: 50 }).notNull(),
  downloadUrl: varchar("download_url", { length: 500 }), // Made nullable - either URL or local file
  fileSize: varchar("file_size", { length: 50 }).notNull(),
  // Local file storage fields
  localFilePath: varchar("local_file_path", { length: 500 }), // Path to locally stored file
  originalFilename: varchar("original_filename", { length: 255 }), // Original uploaded filename
  mimeType: varchar("mime_type", { length: 100 }), // MIME type for proper serving
  fileSizeBytes: integer("file_size_bytes"), // Actual file size in bytes
  type: varchar("type", { length: 50 }).notNull().default("client"), // client, patch, addon, tool
  platform: varchar("platform", { length: 50 }).notNull().default("windows"), // windows, mac, linux
  releaseDate: timestamp("release_date").default(sql`CURRENT_TIMESTAMP`),
  isActive: boolean("is_active").notNull().default(true),
  displayOrder: integer("display_order").notNull().default(0),
  downloadCount: integer("download_count").notNull().default(0),
  createdAt: timestamp("created_at").default(sql`CURRENT_TIMESTAMP`),
  updatedAt: timestamp("updated_at").default(sql`CURRENT_TIMESTAMP`),
});

export const siteSettings = pgTable("site_settings", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  key: varchar("key", { length: 100 }).notNull().unique(),
  value: text("value").notNull(),
  description: varchar("description", { length: 255 }),
  type: varchar("type", { length: 50 }).notNull().default("text"), // text, image, url, boolean
  createdAt: timestamp("created_at").default(sql`CURRENT_TIMESTAMP`),
  updatedAt: timestamp("updated_at").default(sql`CURRENT_TIMESTAMP`),
});

export const supportTickets = pgTable("support_tickets", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: uuid("user_id").notNull(),
  title: varchar("title", { length: 200 }).notNull(),
  description: text("description").notNull(),
  status: varchar("status", { length: 20 }).notNull().default("open"), // open, in_progress, resolved, closed
  priority: varchar("priority", { length: 20 }).notNull().default("normal"), // low, normal, high, urgent
  category: varchar("category", { length: 50 }).notNull().default("general"), // general, technical, account, billing, other
  assignedTo: uuid("assigned_to"), // GM/Admin assigned to ticket (optional)
  imageUrl: varchar("image_url", { length: 500 }), // Optional screenshot or image attachment
  createdAt: timestamp("created_at").default(sql`CURRENT_TIMESTAMP`),
  updatedAt: timestamp("updated_at").default(sql`CURRENT_TIMESTAMP`),
});

export const ticketMessages = pgTable("ticket_messages", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  ticketId: uuid("ticket_id").notNull(),
  senderId: uuid("sender_id").notNull(),
  message: text("message").notNull(),
  imageUrl: varchar("image_url", { length: 500 }),
  isSystemMessage: boolean("is_system_message").notNull().default(false),
  createdAt: timestamp("created_at").default(sql`CURRENT_TIMESTAMP`),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  email: true,
});

export const loginSchema = z.object({
  username: z.string().min(1, "El nombre de usuario es requerido"),
  password: z.string().min(1, "La contraseña es requerida"),
});

export const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, "La contraseña actual es requerida"),
  newPassword: z.string().min(6, "La nueva contraseña debe tener al menos 6 caracteres"),
  confirmPassword: z.string().min(1, "Confirma la nueva contraseña"),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Las contraseñas no coinciden",
  path: ["confirmPassword"],
});

export const changeEmailSchema = z.object({
  newEmail: z.string().email("Ingresa un email válido"),
  password: z.string().min(1, "La contraseña es requerida para confirmar"),
});

// Roles del sistema
export const USER_ROLES = {
  PLAYER: 'player',
  GM_ASPIRANTE: 'gm_aspirante',
  GM_SOPORTE: 'gm_soporte', 
  GM_EVENTOS: 'gm_eventos',
  GM_SUPERIOR: 'gm_superior',
  GM_JEFE: 'gm_jefe',
  COMMUNITY_MANAGER: 'community_manager',
  ADMINISTRADOR: 'administrador'
} as const;

export const ROLE_LABELS = {
  [USER_ROLES.PLAYER]: 'Jugador',
  [USER_ROLES.GM_ASPIRANTE]: 'GM Nivel 1: GM Aspirante',
  [USER_ROLES.GM_SOPORTE]: 'GM Nivel 2: GM Soporte',
  [USER_ROLES.GM_EVENTOS]: 'GM Nivel 3: GM Eventos',
  [USER_ROLES.GM_SUPERIOR]: 'GM Nivel 4: GM Superior',
  [USER_ROLES.GM_JEFE]: 'GM Nivel 5: GM Jefe',
  [USER_ROLES.COMMUNITY_MANAGER]: 'GM Nivel 6: Community Manager',
  [USER_ROLES.ADMINISTRADOR]: 'GM Nivel 7: Administrador'
} as const;

export const ROLE_COLORS = {
  [USER_ROLES.PLAYER]: 'from-gray-500/20 to-gray-500/5 border-gray-500/30 text-gray-400',
  [USER_ROLES.GM_ASPIRANTE]: 'from-green-500/20 to-green-500/5 border-green-500/30 text-green-400',
  [USER_ROLES.GM_SOPORTE]: 'from-blue-500/20 to-blue-500/5 border-blue-500/30 text-blue-400',
  [USER_ROLES.GM_EVENTOS]: 'from-cyan-500/20 to-cyan-500/5 border-cyan-500/30 text-cyan-400',
  [USER_ROLES.GM_SUPERIOR]: 'from-purple-500/20 to-purple-500/5 border-purple-500/30 text-purple-400',
  [USER_ROLES.GM_JEFE]: 'from-orange-500/20 to-orange-500/5 border-orange-500/30 text-orange-400',
  [USER_ROLES.COMMUNITY_MANAGER]: 'from-pink-500/20 to-pink-500/5 border-pink-500/30 text-pink-400',
  [USER_ROLES.ADMINISTRADOR]: 'from-red-500/20 to-red-500/5 border-red-500/30 text-red-400'
} as const;

// VIP Levels
export const VIP_LEVELS = {
  NONE: 0,
  BRONZE: 1,
  SILVER: 2,
  GOLD: 3,
  PLATINUM: 4,
  DIAMOND: 5
} as const;

export const VIP_LABELS = {
  [VIP_LEVELS.NONE]: 'Sin VIP',
  [VIP_LEVELS.BRONZE]: 'VIP Bronce',
  [VIP_LEVELS.SILVER]: 'VIP Plata',
  [VIP_LEVELS.GOLD]: 'VIP Oro',
  [VIP_LEVELS.PLATINUM]: 'VIP Platino',
  [VIP_LEVELS.DIAMOND]: 'VIP Diamante'
} as const;

export const VIP_COLORS = {
  [VIP_LEVELS.NONE]: 'from-gray-500/20 to-gray-500/5 border-gray-500/30 text-gray-500',
  [VIP_LEVELS.BRONZE]: 'from-amber-600/20 to-amber-600/5 border-amber-600/30 text-amber-600',
  [VIP_LEVELS.SILVER]: 'from-gray-400/20 to-gray-400/5 border-gray-400/30 text-gray-400',
  [VIP_LEVELS.GOLD]: 'from-yellow-500/20 to-yellow-500/5 border-yellow-500/30 text-yellow-500',
  [VIP_LEVELS.PLATINUM]: 'from-cyan-400/20 to-cyan-400/5 border-cyan-400/30 text-cyan-400',
  [VIP_LEVELS.DIAMOND]: 'from-purple-500/20 to-purple-500/5 border-purple-500/30 text-purple-500'
} as const;

export const VIP_ICONS = {
  [VIP_LEVELS.NONE]: '0',
  [VIP_LEVELS.BRONZE]: '1',
  [VIP_LEVELS.SILVER]: '2',
  [VIP_LEVELS.GOLD]: '3',
  [VIP_LEVELS.PLATINUM]: '4',
  [VIP_LEVELS.DIAMOND]: '5'
} as const;

export const changeRoleSchema = z.object({
  userId: z.string().uuid("ID de usuario inválido"),
  newRole: z.enum([
    USER_ROLES.PLAYER,
    USER_ROLES.GM_ASPIRANTE,
    USER_ROLES.GM_SOPORTE,
    USER_ROLES.GM_EVENTOS,
    USER_ROLES.GM_SUPERIOR,
    USER_ROLES.GM_JEFE,
    USER_ROLES.COMMUNITY_MANAGER,
    USER_ROLES.ADMINISTRADOR
  ], {
    errorMap: () => ({ message: "Rol no válido" })
  })
});

export const insertWebFeatureSchema = createInsertSchema(webFeatures).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const updateWebFeatureSchema = createInsertSchema(webFeatures).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
}).partial();

export const insertServerNewsSchema = createInsertSchema(serverNews).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const updateServerNewsSchema = createInsertSchema(serverNews).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
}).partial();

export const insertDownloadSchema = createInsertSchema(downloads).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  downloadCount: true,
  localFilePath: true, // Handled by server during upload
  originalFilename: true, // Handled by server during upload
  mimeType: true, // Handled by server during upload
  fileSizeBytes: true, // Handled by server during upload
}).extend({
  // Make downloadUrl optional since we can now have either URL or local file
  downloadUrl: z.string().url("URL inválida").optional().or(z.literal("")),
});

export const updateDownloadSchema = createInsertSchema(downloads).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  downloadCount: true,
}).partial().extend({
  // Make downloadUrl optional since we can now have either URL or local file
  downloadUrl: z.string().url("URL inválida").optional().or(z.literal("")),
});

// Schema specifically for file upload data
export const uploadDownloadFileSchema = z.object({
  downloadId: z.string().uuid("ID de descarga inválido"),
});

export const insertSiteSettingSchema = createInsertSchema(siteSettings).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const updateSiteSettingSchema = z.object({
  value: z.string().min(1, "El valor es requerido"),
  description: z.string().optional(),
});

export const insertSupportTicketSchema = createInsertSchema(supportTickets).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const updateSupportTicketSchema = createInsertSchema(supportTickets).omit({
  id: true,
  userId: true,
  createdAt: true,
  updatedAt: true,
}).partial();

export const insertTicketMessageSchema = createInsertSchema(ticketMessages).omit({
  id: true,
  createdAt: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type Session = typeof sessions.$inferSelect;
export type LoginData = z.infer<typeof loginSchema>;
export type ChangePasswordData = z.infer<typeof changePasswordSchema>;
export type ChangeEmailData = z.infer<typeof changeEmailSchema>;
export type ChangeRoleData = z.infer<typeof changeRoleSchema>;
export type UserRole = typeof USER_ROLES[keyof typeof USER_ROLES];
export type WebFeature = typeof webFeatures.$inferSelect;
export type InsertWebFeature = z.infer<typeof insertWebFeatureSchema>;
export type UpdateWebFeature = z.infer<typeof updateWebFeatureSchema>;
export type ServerNews = typeof serverNews.$inferSelect;
export type InsertServerNews = z.infer<typeof insertServerNewsSchema>;
export type UpdateServerNews = z.infer<typeof updateServerNewsSchema>;
export type Download = typeof downloads.$inferSelect;
export type InsertDownload = z.infer<typeof insertDownloadSchema>;
export type UpdateDownload = z.infer<typeof updateDownloadSchema>;
export type SiteSetting = typeof siteSettings.$inferSelect;
export type InsertSiteSetting = z.infer<typeof insertSiteSettingSchema>;
export type UpdateSiteSetting = z.infer<typeof updateSiteSettingSchema>;
export type SupportTicket = typeof supportTickets.$inferSelect;
export type InsertSupportTicket = z.infer<typeof insertSupportTicketSchema>;
export type UpdateSupportTicket = z.infer<typeof updateSupportTicketSchema>;
export type TicketMessage = typeof ticketMessages.$inferSelect;
export type InsertTicketMessage = z.infer<typeof insertTicketMessageSchema>;
