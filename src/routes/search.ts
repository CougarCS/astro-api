import { Router } from "express";
import { query, validationResult } from "express-validator";

import logger from "../utils/logger/logger";

import SearchService from "../services/search-service";

const router = Router();

// Use SearchService for logic.
// Implement your own input parameters.
// Potential inputs:
// - Target table ?
// - Query text string

/* POST /search */

router.post("/", (req, res) => {
	res.status(200).json({ message: "Project ASTRO API 🚀" });
});

/* POST /search/contacts */

router.post("/contacts", (req, res) => {
	res.status(200).json({ message: "Project ASTRO API 🚀" });
});

/* POST /search/events */

router.get("/events", query("search").notEmpty(), async (req, res) => {
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		return res.status(400).json({ errors: errors.array() });
	}

	const { search } = req.query;

	try {
		const result = await SearchService.searchEvents(search);
		return res.status(200).json({ result });
	} catch (err) {
		logger.error("SearchService.searchEvents failed. Error =", err);
	}
	// fields: event_id, title, description, duration, point_value, datetime

	res.status(500).json({ message: "Unable to load resource" });
});

export default router;
