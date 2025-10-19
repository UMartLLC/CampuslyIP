import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertItemSchema } from "@shared/schema";
import { setupAuth } from "./auth";
import multer from "multer";
import { ObjectStorageService } from "./objectStorage";

const upload = multer({ storage: multer.memoryStorage() });

export async function registerRoutes(app: Express): Promise<Server> {
  // Setup username/password authentication
  // Referenced from blueprint:javascript_auth_all_persistance
  setupAuth(app);
  
  // Serve public objects from object storage
  // Referenced from blueprint:javascript_object_storage
  app.get("/public-objects/:filePath(*)", async (req, res) => {
    const filePath = req.params.filePath;
    const objectStorageService = new ObjectStorageService();
    try {
      const file = await objectStorageService.searchPublicObject(filePath);
      if (!file) {
        return res.status(404).json({ error: "File not found" });
      }
      objectStorageService.downloadObject(file, res);
    } catch (error) {
      console.error("Error searching for public object:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  });

  app.get("/api/items", async (req, res) => {
    try {
      const sellerId = req.query.sellerId as string | undefined;
      const includeDeleted = req.query.includeDeleted === 'true';
      
      if (sellerId) {
        const items = includeDeleted 
          ? await storage.getAllItemsBySeller(sellerId)
          : await storage.getItemsBySeller(sellerId);
        return res.json(items);
      }
      
      const items = await storage.getAllItems();
      res.json(items);
    } catch (error) {
      console.error("Error fetching items:", error);
      res.status(500).json({ message: "Failed to fetch items" });
    }
  });

  app.get("/api/items/:id", async (req, res) => {
    try {
      const item = await storage.getItem(req.params.id);
      if (!item) {
        return res.status(404).json({ message: "Item not found" });
      }
      res.json(item);
    } catch (error) {
      console.error("Error fetching item:", error);
      res.status(500).json({ message: "Failed to fetch item" });
    }
  });

  app.post("/api/items", upload.array("images", 5), async (req: any, res) => {
    if (!req.isAuthenticated() || !req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    try {
      const files = req.files as Express.Multer.File[];
      const imageUrls: string[] = [];

      if (files && files.length > 0) {
        const objectStorageService = new ObjectStorageService();
        
        for (const file of files) {
          const publicUrl = await objectStorageService.uploadFile(
            file.buffer,
            file.originalname,
            file.mimetype
          );
          imageUrls.push(publicUrl);
        }
      }

      const itemData = {
        ...req.body,
        price: req.body.price.toString(),
        images: imageUrls.length > 0 ? imageUrls : undefined,
      };

      const validatedItem = insertItemSchema.parse(itemData);
      
      // Use logged-in user as seller
      const sellerId = req.user.id;
      const item = await storage.createItem(validatedItem, sellerId);
      
      res.status(201).json(item);
    } catch (error) {
      console.error("Error creating item:", error);
      res.status(400).json({ message: "Failed to create item", error: String(error) });
    }
  });

  app.patch("/api/items/:id", async (req, res) => {
    try {
      const updates = {
        ...req.body,
        ...(req.body.price && { price: req.body.price.toString() }),
      };
      
      const item = await storage.updateItem(req.params.id, updates);
      if (!item) {
        return res.status(404).json({ message: "Item not found" });
      }
      res.json(item);
    } catch (error) {
      console.error("Error updating item:", error);
      res.status(400).json({ message: "Failed to update item" });
    }
  });

  app.delete("/api/items/:id", async (req, res) => {
    try {
      const success = await storage.deleteItem(req.params.id);
      if (!success) {
        return res.status(404).json({ message: "Item not found" });
      }
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting item:", error);
      res.status(500).json({ message: "Failed to delete item" });
    }
  });

  app.post("/api/items/:id/repost", async (req, res) => {
    try {
      const item = await storage.repostItem(req.params.id);
      if (!item) {
        return res.status(404).json({ message: "Item not found" });
      }
      res.json(item);
    } catch (error) {
      console.error("Error reposting item:", error);
      res.status(500).json({ message: "Failed to repost item" });
    }
  });

  app.get("/api/users/:id", async (req, res) => {
    try {
      const user = await storage.getUser(req.params.id);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
