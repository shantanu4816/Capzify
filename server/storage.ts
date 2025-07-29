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
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
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
    const [result] = await db.select().from(content).where(eq(content.id, id));
    return result;
  }

  async getContentByType(type: string): Promise<Content[]> {
    return await db.select().from(content).where(eq(content.type, type));
  }

  async createContent(insertContent: InsertContent): Promise<Content> {
    const [result] = await db.insert(content).values(insertContent).returning();
    return result;
  }

  async deleteContent(id: string): Promise<boolean> {
    await db.delete(content).where(eq(content.id, id));
    return true;
  }
}

export const storage = new DatabaseStorage();
