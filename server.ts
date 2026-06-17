/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import mongoose from "mongoose";
import { MongoDBService } from "./src/services/mongodbService";
import { loadDb } from "./src/shared/database/dbState";

// Module Router Imports
import authRouter from "./src/modules/auth/auth.routes";
import usersRouter from "./src/modules/users/users.routes";
import connectionsRouter from "./src/modules/connections/connections.routes";
import chatsRouter from "./src/modules/chats/chats.routes";
import feedRouter from "./src/modules/feed/feed.routes";
import aiRouter from "./src/modules/ai/ai.routes";
import notificationsRouter from "./src/modules/notifications/notifications.routes";
import adminRouter from "./src/modules/admin/admin.routes";
import projectsRouter from "./src/modules/projects/projects.routes";
import hackathonsRouter from "./src/modules/hackathons/hackathons.routes";
import opportunitiesRouter from "./src/modules/opportunities/opportunities.routes";
import mentorsRouter from "./src/modules/mentors/mentors.routes";
import githubRouter from "./src/modules/github/github.routes";

const app = express();
const PORT = 3000;

// Universal Middleware Gating
app.use(express.json());

// Load mock databases on bootstrapping
loadDb();

// Mount Custom Module Routers
// Specifying explicit mounting points guarantees zero collisions and full client compliance
app.use("/api/auth", authRouter);
app.use("/api/users", usersRouter);
app.use("/api/feed", feedRouter);
app.use("/api/notifications", notificationsRouter);
app.use("/api/admin", adminRouter);

// Routers with compound, cross-root or multi-prefix route patterns are mounted at root (/)
app.use("/", connectionsRouter);
app.use("/", chatsRouter);
app.use("/", projectsRouter);
app.use("/", hackathonsRouter);
app.use("/", opportunitiesRouter);
app.use("/", mentorsRouter);
app.use("/", aiRouter);
app.use("/", githubRouter);

async function startServer() {
  // Vite Development / Production Configuration Gating
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  // Listening Loop
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[Krenza Build] Server running continuously at http://0.0.0.0:${PORT}`);
    
    // Connect to MongoDB Atlas Connection Pool
    MongoDBService.getInstance().connect()
      .then(() => console.info("[Bootstrap] MongoDB Atlas Connection pool established successfully."))
      .catch((err) => {
        if (err?.message?.includes("ECONNREFUSED") || err?.name === "MongooseServerSelectionError" || err?.message?.includes("MongooseServerSelectionError")) {
          console.info("[Bootstrap] Offline fallback activated: Local MongoDB is offline/unresolved. Krenza operates stably using full file-based dbState mock fallbacks.");
        } else {
          console.warn("[Bootstrap] MongoDB Atlas Connection deferred or initialized under offline fallback:", err?.message || err);
        }
      });
  });
}

startServer();
export default app;
