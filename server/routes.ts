import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth, isAuthenticated } from "./replitAuth";
import { 
  generateCaptionSchema, 
  generateBioSchema, 
  generateHashtagsSchema,
  gridConvertSchema 
} from "@shared/schema";
import { 
  generateCaptions, 
  generateBio, 
  generateHashtags, 
  analyzeImage 
} from "./openai";
import multer from "multer";

const upload = multer({ 
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB limit
});

export async function registerRoutes(app: Express): Promise<Server> {
  // Auth middleware - skip in development if no DATABASE_URL
  if (process.env.DATABASE_URL) {
    await setupAuth(app);
  } else {
    console.log("Running in development mode without authentication");
  }

  // Auth routes
  app.get('/api/auth/user', async (req: any, res) => {
    try {
      if (process.env.DATABASE_URL) {
        // Use authentication in production
        if (!req.user) {
          return res.status(401).json({ message: "Not authenticated" });
        }
        const userId = req.user.claims.sub;
        const user = await storage.getUser(userId);
        res.json(user);
      } else {
        // Mock user for development
        const mockUser = await storage.getUser("dev-user-id");
        res.json(mockUser);
      }
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });
  
  // Generate captions from image or prompt
  app.post("/api/generate/captions", async (req, res) => {
    try {
      const data = generateCaptionSchema.parse(req.body);
      
      const captions = await generateCaptions({
        imageBase64: data.imageBase64,
        imageUrl: data.imageUrl,
        prompt: data.prompt,
        mood: data.mood,
        length: data.length
      });

      const content = await storage.createContent({
        type: 'caption',
        imageBase64: data.imageBase64,
        imageUrl: data.imageUrl,
        prompt: data.prompt,
        mood: data.mood,
        length: data.length,
        generatedContent: { captions }
      });

      res.json({ success: true, captions, contentId: content.id });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      res.status(400).json({ 
        success: false, 
        message: "Failed to generate captions: " + errorMessage 
      });
    }
  });

  // Generate bio
  app.post("/api/generate/bio", async (req, res) => {
    try {
      const data = generateBioSchema.parse(req.body);
      
      const bios = await generateBio({
        occupation: data.occupation,
        interests: data.interests,
        personality: data.personality,
        includeEmojis: data.includeEmojis
      });

      const content = await storage.createContent({
        type: 'bio',
        generatedContent: { bios },
        prompt: `${data.occupation} - ${data.interests} - ${data.personality}`
      });

      res.json({ success: true, bios, contentId: content.id });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      res.status(400).json({ 
        success: false, 
        message: "Failed to generate bio: " + errorMessage 
      });
    }
  });

  // Generate hashtags
  app.post("/api/generate/hashtags", async (req, res) => {
    try {
      const data = generateHashtagsSchema.parse(req.body);
      
      const hashtags = await generateHashtags({
        content: data.content,
        niche: data.niche,
        targetAudience: data.targetAudience
      });

      const content = await storage.createContent({
        type: 'hashtags',
        generatedContent: hashtags,
        prompt: data.content
      });

      res.json({ success: true, hashtags, contentId: content.id });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      res.status(400).json({ 
        success: false, 
        message: "Failed to generate hashtags: " + errorMessage 
      });
    }
  });

  // Upload and process image
  app.post("/api/upload", upload.single('image'), async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ 
          success: false, 
          message: "No image file provided" 
        });
      }

      const base64Image = req.file.buffer.toString('base64');
      const analysis = await analyzeImage(base64Image);

      res.json({ 
        success: true, 
        imageBase64: base64Image,
        analysis,
        filename: req.file.originalname,
        size: req.file.size
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      res.status(400).json({ 
        success: false, 
        message: "Failed to process image: " + errorMessage 
      });
    }
  });

  // Get content history
  app.get("/api/content/:type", async (req, res) => {
    try {
      const { type } = req.params;
      const content = await storage.getContentByType(type);
      res.json({ success: true, content });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      res.status(500).json({ 
        success: false, 
        message: "Failed to fetch content: " + errorMessage 
      });
    }
  });

  // Delete content
  app.delete("/api/content/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const deleted = await storage.deleteContent(id);
      if (deleted) {
        res.json({ success: true, message: "Content deleted" });
      } else {
        res.status(404).json({ success: false, message: "Content not found" });
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      res.status(500).json({ 
        success: false, 
        message: "Failed to delete content: " + errorMessage 
      });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
