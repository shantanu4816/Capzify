import {
  content,
  users,
  type Content,
  type InsertContent,
  type User,
  type UpsertUser,
} from "@shared/schema";
import { db } from "./db";
import { eq } from "drizzle-orm";

export interface IStorage {
  // User operations
  // (IMPORTANT) these user operations are mandatory for Google Auth.
  getUser(id: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;
  
  // Content operations
  getContent(id: string): Promise<Content | undefined>;
  getContentByType(type: string): Promise<Content[]>;
  createContent(content: InsertContent): Promise<Content>;
  deleteContent(id: string): Promise<boolean>;
}

export class DatabaseStorage implements IStorage {
  // User operations
  // (IMPORTANT) these user operations are mandatory for Google Auth.
  async getUser(id: string): Promise<User | undefined> {
    if (!db) {
      // Mock user for development
      return {
        id: id,
        email: "dev@example.com",
        firstName: "Dev",
        lastName: "User",
        profileImageUrl: null,
        createdAt: new Date(),
        updatedAt: new Date()
      };
    }
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    if (!db) {
      // Mock user for development
      return {
        id: userData.id || "dev-user-id",
        email: userData.email || "dev@example.com",
        firstName: userData.firstName || "Dev",
        lastName: userData.lastName || "User",
        profileImageUrl: userData.profileImageUrl || null,
        createdAt: new Date(),
        updatedAt: new Date()
      };
    }
    const [user] = await db
      .insert(users)
      .values(userData)
      .onConflictDoUpdate({
        target: users.id,
        set: {
          ...userData,
          updatedAt: new Date(),
        },
      })
      .returning();
    return user;
  }

  // Content operations
  async getContent(id: string): Promise<Content | undefined> {
    if (!db) return undefined;
    const [result] = await db.select().from(content).where(eq(content.id, id));
    return result;
  }

  async getContentByType(type: string): Promise<Content[]> {
    if (!db) return [];
    return await db.select().from(content).where(eq(content.type, type));
  }

  async createContent(insertContent: InsertContent): Promise<Content> {
    if (!db) {
      // Mock content for development
      return {
        id: "mock-content-id",
        type: insertContent.type,
        imageUrl: insertContent.imageUrl || null,
        imageBase64: insertContent.imageBase64 || null,
        prompt: insertContent.prompt || null,
        mood: insertContent.mood || null,
        length: insertContent.length || null,
        generatedContent: insertContent.generatedContent,
        createdAt: new Date()
      };
    }
    const [result] = await db.insert(content).values(insertContent).returning();
    return result;
  }

  async deleteContent(id: string): Promise<boolean> {
    if (!db) return true;
    await db.delete(content).where(eq(content.id, id));
    return true;
  }
}

export const storage = new DatabaseStorage();
