import { member_point_transaction } from "@prisma/client";

import { prisma } from "../utils/prisma";
import Util from "../utils/util";
// import logger from "../utils/logger/logger";
import { updateMemberModel } from "../models/member.model";

class MemberService {
	static async isMember(uh_id = "", email = "") {
		console.info(
			`MemberService.isMember invoked! uh_id=${uh_id} email=${email}`
		);

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
		console.info(
			`MemberService.createMember invoked! contact_id=${contact_id} start_date=${start_date} end_date=${end_date} membership_code_id=${membership_code_id}`
		);

		const membership_id = Util.generateId();
		const startDateParsed = new Date(start_date);
		const endDateParsed = new Date(end_date);

		const membership = await prisma.membership.create({
			data: {
				membership_id,
				contact_id,
				start_date: startDateParsed,
				end_date: endDateParsed,
				membership_code_id,
			},
		});

		return membership;
	}

	static async getMember(uh_id = "", email = "") {
		console.info(
			`MemberService.getMember invoked! uh_id=${uh_id} email=${email}`
		);

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
			shirt_size: contact.shirt_size_id,
			start_date: membership.start_date,
			end_date: membership.end_date,
		};
	}

	static async getMembers() {
		console.info("MemberService.getMembers invoked!");
		const members = prisma.contact.findMany();
		return members;
	}

	static async updateMember(membership_id: string, updates: updateMemberModel) {
		console.info(
			`MemberService.updateMember invoked! membership membership_id=${membership_id} updates=${JSON.stringify(
				updates
			)}`
		);

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

	static async getMemberPoints(
		uh_id: string,
		start_date: string,
		end_date: string
	) {
		const lower_bound = start_date ? new Date(start_date) : undefined;
		const upper_bound = end_date ? new Date(end_date) : undefined;

		const point_transactions = await prisma.member_point_transaction.findMany({
			where: {
				contact: {
					uh_id,
				},
				timestamp: {
					gte: lower_bound,
					lte: upper_bound,
				},
			},
		});

		const member_points = point_transactions.reduce(
			(acc: number, curr: member_point_transaction) => acc + curr.point_value,
			0
		);
		return member_points;
	}
}

export default MemberService;
