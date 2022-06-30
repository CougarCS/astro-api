import { Router } from "express";
import { query, validationResult } from "express-validator";

import MemberService from "../services/member-service";

import logger from "../utils/logger/logger";

const router = Router();

/* GET /member/status?student_id=||email= */

router.get(
	"/status",
	query("student_id").optional().isString().isLength({ min: 7, max: 7 }),
	query("email").optional().isEmail(),
	query("student_id").if(query("email").not().exists()).exists(),
	query("email").if(query("student_id").not().exists()).exists(),
	async (req, res) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return res.status(400).json({ errors: errors.array() });
		}

		const { student_id, email } = req.query;

		try {
			const membership = await MemberService.isMember(student_id, email);
			return res.status(200).json({ membership });
		} catch (err) {
			logger.error("MemberService.isMember failed. Error =");
			logger.error(err);
		}

		return res.status(500).json({ message: "Unable to load resource" });
	}
);

export default router;
