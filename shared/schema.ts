import { sql } from "drizzle-orm";
import { pgTable, text, varchar, jsonb, timestamp, index } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Session storage table.
// (IMPORTANT) This table is mandatory for Google Auth, don't drop it.
export const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)],
);

// User storage table.
// (IMPORTANT) This table is mandatory for Google Auth, don't drop it.
export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  email: varchar("email").unique(),
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  profileImageUrl: varchar("profile_image_url"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const content = pgTable("content", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  type: text("type").notNull(), // 'caption', 'bio', 'hashtags', 'grid'
  imageUrl: text("image_url"),
  imageBase64: text("image_base64"),
  prompt: text("prompt"),
  mood: text("mood"),
  length: text("length"),
  generatedContent: jsonb("generated_content").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertContentSchema = createInsertSchema(content).omit({
  id: true,
  createdAt: true,
});

export type InsertContent = z.infer<typeof insertContentSchema>;
export type Content = typeof content.$inferSelect;

export type UpsertUser = typeof users.$inferInsert;
export type User = typeof users.$inferSelect;

// Zod schemas for API validation
export const generateCaptionSchema = z.object({
  imageBase64: z.string().optional(),
  imageUrl: z.string().optional(),
  prompt: z.string().optional(),
  mood: z.enum(['casual', 'professional', 'motivational', 'trending']).default('casual'),
  length: z.enum(['short', 'medium', 'long']).default('medium'),
});

export const generateBioSchema = z.object({
  occupation: z.string(),
  interests: z.string(),
  personality: z.enum(['fun', 'professional', 'minimalist', 'inspiring', 'creative']),
  includeEmojis: z.boolean().default(true),
});

export const generateHashtagsSchema = z.object({
  content: z.string(),
  niche: z.string().optional(),
  targetAudience: z.string().optional(),
});

export const gridConvertSchema = z.object({
  imageBase64: z.string(),
  gridSize: z.enum(['2x2', '3x3', '1x3', '3x1']).default('3x3'),
});

export type GenerateCaptionRequest = z.infer<typeof generateCaptionSchema>;
export type GenerateBioRequest = z.infer<typeof generateBioSchema>;
export type GenerateHashtagsRequest = z.infer<typeof generateHashtagsSchema>;
export type GridConvertRequest = z.infer<typeof gridConvertSchema>;
