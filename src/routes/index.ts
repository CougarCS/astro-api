import { Router } from "express";

const router = Router();

/* GET / */

router.get("/", (_, res) => {
	res.status(200).json({ message: "Project ASTRO API 🚀" });
});

export default router;
