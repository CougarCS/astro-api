import { PrismaClient } from "@prisma/client";
import { v4 as uuidv4 } from "uuid";

import { updateMemberModel } from "../models/member.model";
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

	static async createMember(
		contact_id: string,
		start_date: string,
		end_date: string,
		membership_code_id: string
	) {
		logger.info(
			`MemberService.createMember invoked! contact_id=${contact_id} start_date=${start_date} end_date=${end_date} membership_code_id=${membership_code_id}`
		);

		const prisma = new PrismaClient();
		const UUID = uuidv4();

		const startDateParsed = new Date(start_date);
		const endDateParsed = new Date(end_date);

		const membership = await prisma.membership.create({
			data: {
				membership_id: UUID,
				contact_id: contact_id,
				start_date: startDateParsed,
				end_date: endDateParsed,
				membership_code_id: membership_code_id,
			},
		});

		return membership;
	}

	static async getMembers() {
		logger.info("MemberService.getMembers invoked!");
		const prisma = new PrismaClient();
		const members = prisma.contact.findMany();
		return members;
	}

	static async updateMember(membership_id: string, updates: updateMemberModel) {
		logger.info(
			`MemberService.updateMember invoked! membership membership_id=${membership_id} updates=${JSON.stringify(
				updates
			)}`
		);

		const prisma = new PrismaClient();

		const dates: { [key: string]: Date } = {};
		if (updates.start_date) dates.start_date = new Date(updates.start_date);
		if (updates.end_date) dates.end_date = new Date(updates.end_date);

		const format = { ...updates, ...dates };

		const membership = await prisma.membership.update({
			where: {
				membership_id,
			},
			data: {
				...format,
			},
		});

		return membership;
	}
}

export default MemberService;
