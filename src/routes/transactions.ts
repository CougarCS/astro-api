import { Router } from "express";
import { body, query, validationResult } from "express-validator";
import TransactionService from "../services/transaction-service";

import logger from "../utils/logger/logger";

const router = Router();

/* POST /transactions/points */

/* Creates member point transactions */

router.post(
	"/points",
	body("uh_id").isString().isLength({ min: 7, max: 7 }),
	body("point_value").isNumeric(),
	body("reason").isString(),
	async (req, res) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return res.status(400).json({ errors: errors.array() });
		}

		const { uh_id, point_value, reason } = req.body;

		try {
			const transaction = await TransactionService.createPoints(
				uh_id,
				point_value,
				reason
			);
			// console.log(transaction);
			return res.status(200).json(transaction);
		} catch (err) {
			logger.error("TransactionService.createPoints failed. Error =");
			logger.error(err);
		}

		return res.status(500).json({ message: "Unable to load resource" });
	}
);

export default router;
