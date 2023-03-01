import express from "express";
import { currentUser } from "@tm-cakitomakito/common";
const router = express.Router();

router.get("/", currentUser, (req, res) => {
  res.send({ currentUser: req.currentUser || null });
});

export { router as currentUserRouter };
