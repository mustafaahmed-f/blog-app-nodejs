import { Router } from "express";

const router: Router = Router();

router.get("/", (req, res) => {
  res.json({ message: "All posts" });
});

export default router;
