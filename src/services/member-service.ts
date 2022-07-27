import { PrismaClient } from "@prisma/client";

import logger from "../utils/logger/logger";

class MemberService {
	static async isMember(uh_id = "", email = "") {
		logger.info(
			`MemberService.isMember invoked! uh_id=${uh_id} email=${email}`
		);

		const prisma = new PrismaClient();

		const contact = await prisma.contact.findFirst({
			where: {
				OR: [{ uh_id }, { email }],
			},
		});

		if (!contact) return { status: false };

		const membership = await prisma.membership.findFirst({
			where: { contact_id: contact.contact_id },
			orderBy: { start_date: "desc" },
		});

		if (!membership)
			return {
				status: false,
				first_name: contact.first_name,
				last_name: contact.last_name,
			};

		const status = new Date(membership.end_date) > new Date();

		return {
			status,
			first_name: contact.first_name,
			last_name: contact.last_name,
			start_date: membership.start_date,
			end_date: membership.end_date,
		};
	}

	static async getMembers() {
		logger.info("MemberService.getMembers invoked!");
		const prisma = new PrismaClient();
		const members = prisma.contact.findMany();
		return members;
	}
}

export default MemberService;
