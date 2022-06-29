import { Router } from "express";
// import { body, validationResult } from "express-validator";

// import SearchService from "../services/search-service";

const router = Router();

// Use SearchService for logic.
// Implement your own input parameters.
// Potential inputs:
// - Target table ?
// - Query text string
// - Fields to include/exclude ?

/* POST /search */

router.post("/", (req, res) => {
	res.status(200).json({ message: "Project ASTRO API 🚀" });
});

/* POST /search/contacts */

router.post("/contacts", (req, res) => {
	res.status(200).json({ message: "Project ASTRO API 🚀" });
});

/* POST /search/events */

router.post("/events", (req, res) => {
	res.status(200).json({ message: "Project ASTRO API 🚀" });
});

export default router;
