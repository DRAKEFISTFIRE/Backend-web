import { Router } from "express";

import {
  sendContactRequest
} from "../controllers/contact.controller.js";

import {
  validateContact
} from "../middlewares/validateContact.js";

const router = Router();

router.post(
  "/",
  validateContact,
  sendContactRequest
);

export default router;