import express from "express";
import sendDataController from "../controllers/sendDataController.js";

const router = express.Router();

router.post("/", sendDataController);

export default router;
