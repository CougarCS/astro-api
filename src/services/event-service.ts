import { v4 as uuidv4 } from "uuid";

import { prisma } from "../utils/prisma";
import logger from "../utils/logger/logger";

class EventService {
	static async createEvent(
		title: string,
		description: string,
		datetime: string,
		duration: number,
		point_value: number
	) {
		logger.info(
			`EventService.createEvent invoked! title=${title} description=${description} date=${datetime} duration=${duration} point_value=${point_value} `
		);

		const UUID = uuidv4();

		const formattedDatetime = new Date(datetime);

		const event = prisma.event.create({
			data: {
				event_id: UUID,
				title: title,
				description: description,
				datetime: formattedDatetime,
				duration: duration,
				point_value: point_value,
			},
		});

		return event;
	}

	static async addAttendance() {
		console.log("addAttendance");
	}
}

export default EventService;
