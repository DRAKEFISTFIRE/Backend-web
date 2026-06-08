import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import contactRoutes from "./routes/contact.routes.js";

dotenv.config();

const app = express();

// 🔥 CORS CORRECTO PARA FRONTEND GITHUB PAGES
app.use(cors({
  origin: [
    "https://drakefistfire.github.io",
    "http://localhost:3000",
    "http://127.0.0.1:5500"
  ],
  methods: ["GET", "POST", "OPTIONS"],
  allowedHeaders: ["Content-Type"]
}));

app.use(express.json({ limit: "5mb" }));

// health check
app.get("/", (req, res) => {
  res.json({
    status: "API running",
    endpoints: {
      contact: "/api/contact"
    }
  });
});

app.use("/api/contact", contactRoutes);

const PORT = process.env.PORT || 10000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});