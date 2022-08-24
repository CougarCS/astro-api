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

	static async checkAttendance(uh_id: string, event_id: string) {
		const attendance = await prisma.event_attendance.findFirst({
			where: {
				contact: {
					uh_id,
				},
				event_id,
			},
		});

		if (attendance) {
			return true;
		}

		return false;
	}

	static async addAttendance(uh_id: string, event_id: string, swag: boolean) {
		logger.info(
			`EventService.addAttendance invoked! uh_id:${uh_id} event_id=${event_id}`
		);

		const UUID = uuidv4();

		const timestamp = new Date();

		const contact = await prisma.contact.findFirst({
			where: {
				uh_id,
			},
			select: {
				contact_id: true,
			},
		});

		const attendance = await prisma.event_attendance.create({
			data: {
				event_attendance_id: UUID,
				event_id: event_id,
				contact_id: contact.contact_id,
				timestamp: timestamp,
				swag: swag,
			},
		});

		return attendance;
	}
}

export default EventService;
