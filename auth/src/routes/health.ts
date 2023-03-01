import express from "express";

const router = express.Router();

router.get("/", (req, res) => {
  console.log("health check");
  res.send("OK");
});

export { router as healthRouter };
