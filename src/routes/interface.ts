import { Router } from "express";
import { body, validationResult } from "express-validator";

import logger from "../utils/logger/logger";

import SQLService from "../services/sql-service";

const router = Router();

/* GET /interface/tables */

router.get("/tables", async (req, res) => {
	try {
		const tables = await SQLService.tables();
		return res.status(200).json({ tables });
	} catch (err) {
		logger.error("SQLService.tables failed. Error =");
		logger.error(err);
	}

	return res.status(500).json({ message: "Unable to load resource" });
});

/* POST /interface/fields */

router.post("/fields", body("table").isString(), async (req, res) => {
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		return res.status(400).json({ errors: errors.array() });
	}

	const { table } = req.body;

	try {
		const fields = await SQLService.fields(table);
		return res.status(200).json({ fields });
	} catch (err) {
		logger.error("SQLService.fields failed. Error =");
		logger.error(err);
	}

	return res.status(500).json({ message: "Unable to load resource" });
});

/* POST /interface/query */

router.post(
	"/query",
	body("table").isString(),
	body("fields").optional().isArray(),
	body("fields.*").isString(),
	body("constraints").optional().isArray(),
	body("constraints.*.field").isString(),
	body("constraints.*.value").exists(),
	async (req, res) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return res.status(400).json({ errors: errors.array() });
		}

		const { table, fields = [], constraints = [] } = req.body;

		try {
			const result = await SQLService.select(table, fields, constraints);
			return res.status(200).json({ result });
		} catch (err) {
			logger.error("SQLService.select failed. Error =", err);
		}

		return res.status(500).json({ message: "Unable to load resource" });
	}
);

export default router;
