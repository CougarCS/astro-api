import { prisma } from "../utils/prisma";
import logger from "../utils/logger/logger";
import Util from "../utils/util";

class TransactionService {
	static async createPoints(
		uh_id: string,
		point_value: number,
		reason: string
	) {
		logger.info(
			`TransactionService.createPoints invoked! uh_id=${uh_id} point_value=${point_value} reason=${reason}`
		);

		const transaction_id = Util.generateId();
		const timestamp = new Date();

		const contact = await prisma.contact.findFirst({
			where: {
				uh_id,
			},
			select: {
				contact_id: true,
			},
		});

		const pointTransaction = prisma.member_point_transaction.create({
			data: {
				member_point_transaction_id: transaction_id,
				contact_id: contact.contact_id,
				point_value: point_value,
				member_point_transaction_reason_id: reason,
				timestamp: timestamp,
			},
		});

		return pointTransaction;
	}
}

export default TransactionService;
