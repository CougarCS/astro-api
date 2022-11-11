import { Router } from "express";
import { body, validationResult } from "express-validator";

// import logger from "../utils/logger/logger";
import AuthUtil from "../utils/auth-util";
import { EMAIL_MAX, PASSWORD_LENGTH } from "../utils/config";

import AuthService from "../services/auth-service";

const router = Router();

/* POST /auth/login */

router.post(
	"/login",
	body("email").isEmail().isLength({ max: EMAIL_MAX }),
	body("password").isString().isLength(PASSWORD_LENGTH),
	async (req, res) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return res.status(400).json({ errors: errors.array() });
		}

		const { email, password } = req.body;

		try {
			const token = await AuthService.login(email, password);
			if (!token) return res.sendStatus(401);
			return res.status(200).json({ token });
		} catch (err) {
			logger.error(`AuthService.login failed. Error = ${err}`);
			return res.status(500).json({ message: "Unable to load resource" });
		}
	}
);

/* POST /auth/create */

router.post(
	"/create",
	AuthUtil.authenticateToken,
	body("email").isEmail().isLength({ max: EMAIL_MAX }),
	body("password").isString().isLength(PASSWORD_LENGTH),
	body("role").isString(),
	body("first_name").isString(),
	body("last_name").optional().isString(),
	async (req, res) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return res.status(400).json({ errors: errors.array() });
		}

		const { email, password, role, first_name, last_name } = req.body;

		try {
			const result = await AuthService.createUser(
				email,
				password,
				role,
				first_name,
				last_name
			);
			return res.status(200).json({ result });
		} catch (err) {
			logger.error(`AuthService.createUser failed. Error = ${err}`);
			return res.status(500).json({ message: "Unable to load resource" });
		}
	}
);

export default router;
