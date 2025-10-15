import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertItemSchema } from "@shared/schema";
import { setupAuth } from "./auth";
import multer from "multer";
import { PutObjectCommand, GetObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { randomUUID } from "crypto";

const s3Client = new S3Client({
  region: "auto",
  endpoint: process.env.R2_ENDPOINT,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID || "",
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY || "",
  },
});

const upload = multer({ storage: multer.memoryStorage() });

export async function registerRoutes(app: Express): Promise<Server> {
  // Setup username/password authentication
  // Referenced from blueprint:javascript_auth_all_persistance
  setupAuth(app);
  
  app.get("/api/object-storage/:filename", async (req, res) => {
    try {
      const publicPath = process.env.PUBLIC_OBJECT_SEARCH_PATHS?.split(',')[0] || 'public';
      const key = `${publicPath}/${req.params.filename}`;
      
      const command = new GetObjectCommand({
        Bucket: process.env.DEFAULT_OBJECT_STORAGE_BUCKET_ID,
        Key: key,
      });
      
      const response = await s3Client.send(command);
      
      if (response.ContentType) {
        res.setHeader('Content-Type', response.ContentType);
      }
      
      if (response.Body) {
        const stream = response.Body as any;
        stream.pipe(res);
      } else {
        res.status(404).json({ message: "File not found" });
      }
    } catch (error) {
      console.error("Error fetching file:", error);
      res.status(404).json({ message: "File not found" });
    }
  });

  app.get("/api/items", async (req, res) => {
    try {
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
        const publicPath = process.env.PUBLIC_OBJECT_SEARCH_PATHS?.split(',')[0] || 'public';
        
        for (const file of files) {
          const fileName = `${randomUUID()}-${file.originalname}`;
          const key = `${publicPath}/${fileName}`;
          
          await s3Client.send(
            new PutObjectCommand({
              Bucket: process.env.DEFAULT_OBJECT_STORAGE_BUCKET_ID,
              Key: key,
              Body: file.buffer,
              ContentType: file.mimetype,
            })
          );

          const publicUrl = `/api/object-storage/${fileName}`;
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
