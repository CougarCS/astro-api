import { Router } from "express";

import EventService from "../services/event-service";

const router = Router();

/* POST /event */

// Creates an event

router.post("/", (req, res) => {
	res.status(200).json({ message: "Project ASTRO API 🚀" });
});

/* POST /event/attendance */

// Creates an event attendance

router.post("/attendance", (req, res) => {
	res.status(200).json({ message: "Project ASTRO API 🚀" });
});

export default router;
