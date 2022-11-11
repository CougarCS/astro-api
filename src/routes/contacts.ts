import { Router } from "express";
import { body, validationResult } from "express-validator";

import ContactService from "../services/contact-service";

// import logger from "../utils/logger/logger";

const router = Router();

/* POST /contacts/create */

// Creates a new contact

router.post(
	"/",
	body("uh_id").isString().isLength({ min: 7, max: 7 }),
	body("email").isString().isEmail(),
	body("first_name").isString(),
	body("last_name").isString(),
	body("phone_number").isString(),
	body("shirt_size_id").isString(),
	async (req, res) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return res.status(400).json({ errors: errors.array() });
		}

		const { uh_id, email, first_name, last_name, phone_number, shirt_size_id } =
			req.body;

		const response = await ContactService.checkContact(uh_id);

		if (response) {
			return res
				.status(409)
				.json({ message: "A contact with this information already exists." });
		}

		try {
			const contact = await ContactService.createContact(
				uh_id,
				email,
				first_name,
				last_name,
				phone_number,
				shirt_size_id
			);

			return res.status(200).json({ contact });
		} catch (err) {
			logger.error("ContactService.createContact failed. Error=");
			logger.error(err);
		}

		res.status(500).json({ message: "Unable to load resource" });
	}
);

export default router;
