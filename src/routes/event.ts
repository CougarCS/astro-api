import { Router } from "express";
import { body, validationResult } from "express-validator";

import EventService from "../services/event-service";

import logger from "../utils/logger/logger";

const router = Router();

/* POST /event */

// Creates an event

router.post(
	"/",
	body("title").isString().notEmpty(),
	body("description").isString().notEmpty(),
	body("datetime").isString().notEmpty(),
	body("duration").isFloat().notEmpty(),
	body("point_value").isInt().notEmpty(),
	async (req, res) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return res.status(400).json({ errors: errors.array() });
		}

		const { title, description, datetime, duration, point_value } = req.body;

		try {
			const event = await EventService.createEvent(
				title,
				description,
				datetime,
				duration,
				point_value
			);
			return res.status(200).json({ event });
		} catch (err) {
			logger.error("EventService.createEvent failed. Error=");
			logger.error(err);
		}

		res.status(500).json({ message: "Unable to load resource" });
	}
);

/* POST /event/attendance */

// Creates an event attendance

router.post("/attendance", (req, res) => {
	res.status(200).json({ message: "Project ASTRO API 🚀" });
});

export default router;
