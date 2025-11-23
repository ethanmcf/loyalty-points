#!/usr/bin/env node
"use strict";

/* STARTER CODE */
const dotenv = require("dotenv");

// load shared root env
dotenv.config({ path: "../.env" });

const express = require("express");
const app = express();

app.use(express.json());
const path = require("path");
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Use cors
const cors = require("cors");
const frontendUrl = process.env.FRONTEND_URL || "http://localhost:5173/";
app.use(
  cors({
    origin: frontendUrl,

    methods: ["GET", "POST", "PATCH", "DELETE"],

    allowedHeaders: ["Content-Type", "Authorization"],

    credentials: true,
  })
);

const port = process.env.BACKEND_PORT || "3000";

const server = app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

server.on("error", (err) => {
  console.error(`cannot start server: ${err.message}`);
  process.exit(1);
});

/** ROUTES */
// Useres
const userRoutes = require("./routes/users");
app.use("/users", userRoutes);

// Events
const eventRoutes = require("./routes/events");
app.use("/events", eventRoutes);

// Transactions
const transactionRoutes = require("./routes/transactions");
app.use("/transactions", transactionRoutes);

// Auths
const authRoutes = require("./routes/auth");
app.use("/auth", authRoutes);

// Promotions
const promotionRoutes = require("./routes/promotions");
app.use("/promotions", promotionRoutes);
