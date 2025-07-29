import { type Content, type InsertContent } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  getContent(id: string): Promise<Content | undefined>;
  getContentByType(type: string): Promise<Content[]>;
  createContent(content: InsertContent): Promise<Content>;
  deleteContent(id: string): Promise<boolean>;
}

export class MemStorage implements IStorage {
  private content: Map<string, Content>;

  constructor() {
    this.content = new Map();
  }

  async getContent(id: string): Promise<Content | undefined> {
    return this.content.get(id);
  }

  async getContentByType(type: string): Promise<Content[]> {
    return Array.from(this.content.values()).filter(
      (content) => content.type === type,
    );
  }

  async createContent(insertContent: InsertContent): Promise<Content> {
    const id = randomUUID();
    const content: Content = { 
      ...insertContent, 
      id, 
      createdAt: new Date() 
    };
    this.content.set(id, content);
    return content;
  }

  async deleteContent(id: string): Promise<boolean> {
    return this.content.delete(id);
  }
}

export const storage = new MemStorage();
