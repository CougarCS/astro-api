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
			const result = await SQLService.select(table, { fields, constraints });
			return res.status(200).json({ result });
		} catch (err) {
			logger.error("SQLService.select failed. Error =", err);
		}

		return res.status(500).json({ message: "Unable to load resource" });
	}
);

/* PUT /interface/query */

router.put(
	"/query",
	body("table").isString().notEmpty(),
	body("updateOptions").isArray(),
	body("updateOptions.*.attributes").isArray(),
	body("updateOptions.*.attributes.*.field").isString().notEmpty(),
	body("updateOptions.*.attributes.*.value").exists(),
	body("updateOptions.*.constraints").isArray(),
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
			logger.error("SQLService.update failed. Error =", err);
		}
	}
);

router.post(
    "/delete",
    body("table").isString(),
    body("constraints").optional().isArray(),
    body("constraints.*.field").isString(),
    body("constraints.*.value").exists(),
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            res.status(400).json({ errors: errors.array() });
        }

        const { table, constraints = [] }  = req.body;

        try {
            const result = await SQLService.delete(table, { constraints });
        	return res.status(200).json({ message: `Affected rows: ${result.affectedRows}, Changed rows: ${result.changedRows == undefined ? "0" : result.changedRows}, Field count: ${result.fieldCount}, Warning count: ${result.warningCount == undefined ? "0" : result.warningCount}` });
        }
        catch (err) {
            logger.error("SQLService.delete failed. Error =", err);
        	return res.status(400).json({ message: "Unable to load resource" });
        }
    }
);


export default router;
