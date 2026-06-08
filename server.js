import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import contactRoutes from "./routes/contact.routes.js";

dotenv.config();

const app = express();

app.use(cors());

app.use(express.json({
  limit: "5mb"
}));

app.use("/api/contact", contactRoutes);

app.listen(process.env.PORT, () => {
  console.log(
    `Server running on port ${process.env.PORT}`
  );
});