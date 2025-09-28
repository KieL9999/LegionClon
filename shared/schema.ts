import { sql } from "drizzle-orm";
import { pgTable, varchar, timestamp, text, uuid } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  username: varchar("username", { length: 16 }).notNull().unique(),
  password: varchar("password", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  role: varchar("role", { length: 50 }).notNull().default("player"),
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
  ADMIN_WEB: 'admin_web',
  ADMIN_JUEGO: 'admin_juego'
} as const;

export const ROLE_LABELS = {
  [USER_ROLES.PLAYER]: 'Jugador',
  [USER_ROLES.GM_ASPIRANTE]: 'GM Nivel 1: GM Aspirante',
  [USER_ROLES.GM_SOPORTE]: 'GM Nivel 2: GM Soporte',
  [USER_ROLES.GM_EVENTOS]: 'GM Nivel 3: GM Eventos',
  [USER_ROLES.GM_SUPERIOR]: 'GM Nivel 4: GM Superior',
  [USER_ROLES.GM_JEFE]: 'GM Nivel 5: GM Jefe',
  [USER_ROLES.COMMUNITY_MANAGER]: 'GM Nivel 6: Community Manager',
  [USER_ROLES.ADMIN_WEB]: 'Administrador Web',
  [USER_ROLES.ADMIN_JUEGO]: 'Administrador del Juego'
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
    USER_ROLES.ADMIN_WEB,
    USER_ROLES.ADMIN_JUEGO
  ], {
    errorMap: () => ({ message: "Rol no válido" })
  })
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type Session = typeof sessions.$inferSelect;
export type LoginData = z.infer<typeof loginSchema>;
export type ChangePasswordData = z.infer<typeof changePasswordSchema>;
export type ChangeEmailData = z.infer<typeof changeEmailSchema>;
export type ChangeRoleData = z.infer<typeof changeRoleSchema>;
export type UserRole = typeof USER_ROLES[keyof typeof USER_ROLES];
