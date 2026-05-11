import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import sanitize from "mongo-sanitize";
import "dotenv/config";

import connectDB from "./config/db.js";
import authRoutes from "./routes/auth.routes.js";
import { globalLimiter } from "./middlewares/rateLimiter.middleware.js";

const app = express();

// ── Security headers ───── 
app.use(helmet());

// ── Global rate limiter ────── 
app.use(globalLimiter);

// ── Body parsing (limit payload size — DoS protection) ───── 
app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: true, limit: "10kb" }));

// ── Cookie parser ──────── 
app.use(cookieParser());

// ── NoSQL injection sanitizer (manual — avoids express-mongo-sanitize bug) ────
app.use((req, res, next) => {
  if (req.body) req.body = sanitize(req.body);
  if (req.params) req.params = sanitize(req.params);
  next();
});

// ── Routes ──────── 
app.use("/api/v1/auth", authRoutes);

// ── Connect DB then start server ────── 
const PORT = process.env.PORT || 5000;

connectDB().then(() => {
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});