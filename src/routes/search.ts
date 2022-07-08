import { Router } from "express";
import { query, validationResult } from "express-validator";

import logger from "../utils/logger/logger";

import SearchService from "../services/search-service";

const router = Router();

/* POST /search */

router.post("/", (req, res) => {
	res.status(200).json({ message: "Project ASTRO API 🚀" });
});

/* POST /search/contacts */

router.post(
	"/contacts",
	query("contact").notEmpty().isString(),
	async (req, res) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return res.status(400).json({ errors: errors.array() });
		}

		const contact = req.query.contact;

		try {
			const result = await SearchService.searchContacts(contact);
			return res.status(200).json({ result });
		} catch (err) {
			logger.error("SearchService.searchContacts failed. Error =", err);
		}

		res.status(500).json({ message: "Unable to load resource" });
	}
);

/* POST /search/events */

router.post(
	"/events",
	query("event").notEmpty().isString(),
	async (req, res) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return res.status(400).json({ errors: errors.array() });
		}

		const event = req.query.event;
		console.log(event);

		try {
			const result = await SearchService.searchEvents(event);
			return res.status(200).json({ result });
		} catch (err) {
			logger.error("SearchService.searchEvents failed. Error =", err);
		}

		res.status(500).json({ message: "Unable to load resource" });
	}
);

export default router;
