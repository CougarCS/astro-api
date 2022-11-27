import { prisma } from "../utils/prisma";
import logger from "../utils/logger/logger";
import Util from "../utils/util";

class ContactService {
	static async checkContact(uh_id: string) {
		const contact = await prisma.contact.findFirst({
			where: {
				uh_id,
			},
		});

		return !!contact;
	}

	static async createContact(
		uh_id: string,
		email: string,
		first_name: string,
		last_name: string,
		phone_number: string,
		shirt_size_id: string
	) {
		logger.info(
			`ContactService.createContact invoked! uh_id:${uh_id} email=${email} first_name=${first_name} last_name=${last_name} phone_number=${phone_number} shirt_size_id=${shirt_size_id}`
		);

		const contact_id = Util.generateId();
		const timestamp = new Date();

		const contact = await prisma.contact.create({
			data: {
				contact_id,
				uh_id,
				email,
				first_name,
				last_name,
				phone_number,
				shirt_size_id,
				timestamp,
			},
		});

		return contact;
	}
}

export default ContactService;
