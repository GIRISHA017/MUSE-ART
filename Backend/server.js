import express from "express";
import path from "path";
import fs from "fs/promises";
import "dotenv/config";
import mongoose from "mongoose";
import os from "os";
import { fileURLToPath } from "url";
import { createServer as createViteServer } from "vite";
import { connectDB } from "./db/config.js";
import fsNormal from "fs";
import { startScheduler } from "./scheduler.js";

// REDIRECT LOGS FOR DEBUGGING
const logDir = path.join(os.tmpdir(), "museart");
if (!fsNormal.existsSync(logDir)) {
  fsNormal.mkdirSync(logDir, { recursive: true });
}
const logStream = fsNormal.createWriteStream(path.join(logDir, "server_log.txt"), { flags: "w" });
const originalWrite = process.stdout.write;
process.stdout.write = function(chunk) {
  logStream.write(chunk);
  return originalWrite.apply(process.stdout, arguments);
};
const originalErrWrite = process.stderr.write;
process.stderr.write = function(chunk) {
  logStream.write(chunk);
  return originalErrWrite.apply(process.stderr, arguments);
};

// Routes
import userRoutes from "./routes/userRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import { register, login } from "./controllers/userController.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  try {
    const app = express();
    const PORT = Number(process.env.PORT) || 3001;

    // A. FAST INITIALIZATION (No blocking I/O)
    app.use(express.json({ limit: '50mb' }));
    app.use(express.urlencoded({ limit: '50mb', extended: true }));
    
    // Custom API Debug Logger
    app.use((req, res, next) => {
      if (req.url.startsWith('/api')) {
        console.log(`[API REQUEST] ${req.method} ${req.url} | ${new Date().toISOString()}`);
      }
      next();
    });

    // Health Check Endpoint (Returns quickly)
    app.get("/api/health", (req, res) => {
      res.json({ 
        status: "ok", 
        database: mongoose.connection.readyState === 1 ? "connected" : "disconnected",
        timestamp: new Date().toISOString()
      });
    });

    // B. MOUNT API ROUTES (Fast, just definitions)
    app.post("/api/auth/register", register);
    app.post("/api/auth/login", login);
    app.use("/api/gallery", adminRoutes);

    // Catch-all for API 404
    app.all("/api/*", (req, res) => {
      res.status(404).json({ error: "Endpoint not found", path: req.originalUrl });
    });

    // C. LISTEN IMMEDIATELY (Reduces "Starting Server" page time)
    const server = app.listen(PORT, "0.0.0.0", () => {
      console.log(`[SYSTEM] Server listening on port ${PORT} at ${new Date().toISOString()}`);
      console.log(`[SYSTEM] Open the app at http://localhost:${PORT}`);
    });

    server.on("error", (e) => {
      if (e.code === "EADDRINUSE") {
        console.error(`[FATAL] Port ${PORT} already in use. Set PORT in .env to another value.`);
        process.exit(1);
      }
    });

    // D. BACKGROUND INITIALIZATION (Heavy lifting)
    
    // 1. Database and Scheduler
    connectDB().then(() => {
      startScheduler();
    }).catch(err => console.error('[DB ERROR] Background connection failed:', err));

    // 2. Vite / Frontend
    if (process.env.NODE_ENV !== "production") {
      console.log("[SYSTEM] Initializing Vite Dev Middleware...");
      const vite = await createViteServer({
        server: {
          middlewareMode: true,
          hmr: {
            port: Number(process.env.VITE_HMR_PORT) || 24679
          }
        },
        appType: "spa",
        configFile: path.join(process.cwd(), "vite.config.js")
      });
      app.use(vite.middlewares);

      app.get("*", async (req, res, next) => {
        try {
          let template = await fs.readFile(path.resolve(process.cwd(), "Frontend", "index.html"), "utf-8");
          template = await vite.transformIndexHtml(req.originalUrl, template);
          res.status(200).set({ "Content-Type": "text/html" }).end(template);
        } catch (e) {
          vite.ssrFixStacktrace(e);
          next(e);
        }
      });
    } else {
      const distPath = path.join(process.cwd(), "Frontend", "dist");
      app.use(express.static(distPath));
      app.get("*", (req, res) => {
        res.sendFile(path.join(distPath, "index.html"));
      });
    }
  } catch (err) {
    console.error("[CRITICAL] Server failed to start:", err);
    process.exit(1);
  }
}

// Prevent process from exiting on background errors
process.on('unhandledRejection', (reason, promise) => {
  console.error('[FATAL] Unhandled Rejection at:', promise, 'reason:', reason);
});
process.on('uncaughtException', (err) => {
  console.error('[FATAL] Uncaught Exception:', err);
});

startServer();
