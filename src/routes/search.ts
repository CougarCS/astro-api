import { Router } from "express";
import { query, validationResult } from "express-validator";

import logger from "../utils/logger/logger";

import SearchService from "../services/search-service";

const router = Router();

/* GET /search/contacts?query= */

router.get(
	"/contacts",
	query("query").isString().notEmpty(),
	async (req, res) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return res.status(400).json({ errors: errors.array() });
		}

		const { query } = req.query;

		try {
			const result = await SearchService.searchContacts(query);
			return res.status(200).json({ result });
		} catch (err) {
			logger.error("SearchService.searchContacts failed. Error =", err);
		}

		res.status(500).json({ message: "Unable to load resource" });
	}
);

/* GET /search/events?query= */

router.get(
	"/events",
	query("query").isString().notEmpty(),
	async (req, res) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return res.status(400).json({ errors: errors.array() });
		}

		const { query } = req.query;

		try {
			const result = await SearchService.searchEvents(query);
			return res.status(200).json({ result });
		} catch (err) {
			logger.error("SearchService.searchEvents failed. Error =", err);
		}

		res.status(500).json({ message: "Unable to load resource" });
	}
);

export default router;
