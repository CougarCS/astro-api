import { Router } from "express";
import { body, query, validationResult } from "express-validator";

import MemberService from "../services/member-service";

import logger from "../utils/logger/logger";

const router = Router();

/* GET /member/status?uh_id=||email= */

router.get(
	"/status",
	query("uh_id").optional().isString().isLength({ min: 7, max: 7 }),
	query("email").optional().isEmail(),
	query("uh_id").if(query("email").not().exists()).exists(),
	query("email").if(query("uh_id").not().exists()).exists(),
	async (req, res) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return res.status(400).json({ errors: errors.array() });
		}

		const { uh_id, email } = req.query;

		try {
			const membership = await MemberService.isMember(uh_id, email);
			return res.status(200).json({ membership });
		} catch (err) {
			logger.error("MemberService.isMember failed. Error =");
			logger.error(err);
		}

		return res.status(500).json({ message: "Unable to load resource" });
	}
);

/* POST /member/create */

router.post(
	"/create",
	body("contact_id").isString().notEmpty(),
	body("start_date").isString().notEmpty(),
	body("end_date").isString().notEmpty(),
	body("membership_code_id").isString().notEmpty(),
	async (req, res) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return res.status(400).json({ errors: errors.array() });
		}

		const { contact_id, start_date, end_date, membership_code_id } = req.body;

		try {
			const result = await MemberService.createMember(
				contact_id,
				start_date,
				end_date,
				membership_code_id
			);
			return res.status(200).json({ result });
		} catch (err) {
			logger.error("MemberService.createMember failed. Error=");
			logger.error(err);
		}

		return res.status(500).json({ message: "Unable to load resource" });
	}
);

/* PATCH /member/edit */

router.patch(
	"/edit",
	body("membership_id").isString().isLength({ min: 36, max: 36 }),
	body("updates").exists(),
	async (req, res) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return res.status(400).json({ errors: errors.array() });
		}

		const { membership_id, updates } = req.body;

		try {
			const result = await MemberService.updateMember(membership_id, updates);
			return res.status(200).json({ result });
		} catch (err) {
			logger.error("MemberService.updateMembers failed. Error =");
			logger.error(err);
		}

		return res.status(500).json({ message: "Unable to load resource" });
	}
);

/* GET /member/points */

// Pull a member's points in a time range (or all if no time range)

router.get(
	"/points",
	query("uh_id").isString().isLength({ min: 7, max: 7 }),
	query("start_date").optional().isString(),
	query("end_date").optional().isString(),
	async (req, res) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return res.status(400).json({ errors: errors.array() });
		}

		const { uh_id, start_date, end_date } = req.query;

		try {
			const member_points = await MemberService.getMemberPoints(
				uh_id,
				start_date,
				end_date
			);
			return res.status(200).json({ member_points });
		} catch (err) {
			logger.error("MemberService.getMemberPoints failed. Error =");
			logger.error(err);
		}

		return res.status(500).json({ message: "Unable to load resource" });
	}
);

/* GET /member/all */

router.get("/all", async (req, res) => {
	try {
		const members = await MemberService.getMembers();
		return res.status(200).json(members);
	} catch (err) {
		logger.error("MemberService.getMembers failed. Error =");
		logger.error(err);
	}

	return res.status(500).json({ message: "Unable to load resource" });
});

export default router;
