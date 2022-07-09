import { Router } from "express";
import { body, validationResult } from "express-validator";

import logger from "../utils/logger/logger";

import SQLService from "../services/sql-service";

const router = Router();

/* GET /interface/tables */

router.get("/tables", async (_, res) => {
	try {
		const tables = await SQLService.tables();
		return res.status(200).json({ tables });
	} catch (err) {
		logger.error("SQLService.tables failed. Error =");
		logger.error(err);
	}

	return res.status(500).json({ message: "Unable to load resource" });
});

/* GET /interface/fields */

router.get("/fields", body("table").isString().notEmpty(), async (req, res) => {
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

/* GET /interface/query */

router.get(
	"/query",
	body("table").isString().notEmpty(),
	body("fields").optional().isArray(),
	body("fields.*").isString().notEmpty(),
	body("constraints").optional().isArray(),
	body("constraints.*.field").isString().notEmpty(),
	body("constraints.*.value").exists().notEmpty(),
	async (req, res) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return res.status(400).json({ errors: errors.array() });
		}

		const { table, fields = [], constraints = [] } = req.body;

		try {
			const result = await SQLService.select(table, { fields, constraints });
			return res.status(200).json({ result });
		} catch (err) {
			logger.error("SQLService.select failed. Error =");
			logger.error(err);
		}

		return res.status(500).json({ message: "Unable to load resource" });
	}
);

/* POST /interface/data */

router.post(
	"/data",
	body("table").isString().notEmpty(),
	body("fields").isArray({ min: 1 }),
	body("fields.*.field").isString().notEmpty(),
	body("fields.*.value").exists().notEmpty(),
	async (req, res) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return res.status(400).json({ errors: errors.array() });
		}

		const { table, fields } = req.body;

		try {
			const result = await SQLService.insert(table, fields);
			return res.status(200).json({ result });
		} catch (err) {
			logger.error("SQLService.insert failed. Error =");
			logger.error(err);
		}

		return res.status(500).json({ message: "Unable to load resource" });
	}
);

/* PUT /interface/data */

router.put(
	"/data",
	body("table").isString().notEmpty(),
	body("updateOptions").isArray({ min: 1 }),
	body("updateOptions.*.attributes").isArray({ min: 1 }),
	body("updateOptions.*.attributes.*.field").isString().notEmpty(),
	body("updateOptions.*.attributes.*.value").exists().notEmpty(),
	body("updateOptions.*.constraints").isArray({ min: 1 }),
	body("updateOptions.*.constraints.*.field").isString().notEmpty(),
	body("updateOptions.*.constraints.*.value").exists().notEmpty(),
	async (req, res) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return res.status(400).json({ errors: errors.array() });
		}

		const { table, updateOptions } = req.body;

		try {
			const result = await SQLService.update(table, updateOptions);
			return res.status(200).json({ result });
		} catch (err) {
			logger.error("SQLService.update failed. Error =");
			logger.error(err);
		}

		return res.status(500).json({ message: "Unable to load resource" });
	}
);

/* DELETE /interface/data */

router.delete(
	"/data",
	body("table").isString().notEmpty(),
	body("constraints").isArray({ min: 1 }),
	body("constraints.*.field").isString().notEmpty(),
	body("constraints.*.value").exists().notEmpty(),
	async (req, res) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return res.status(400).json({ errors: errors.array() });
		}

		const { table, constraints } = req.body;

		try {
			const result = await SQLService.delete(table, constraints);
			return res.status(200).json({ result });
		} catch (err) {
			logger.error("SQLService.delete failed. Error =");
			logger.error(err);
		}

		return res.status(500).json({ message: "Unable to load resource" });
	}
);

export default router;
