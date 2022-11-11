import { prisma } from "../utils/prisma";
// import logger from "../utils/logger/logger";
import Util from "../utils/util";

class EventService {
	static async createEvent(
		title: string,
		description: string,
		datetime: string,
		duration: number,
		point_value: number
	) {
		console.info(
			`EventService.createEvent invoked! title=${title} description=${description} date=${datetime} duration=${duration} point_value=${point_value} `
		);

		const event_id = Util.generateId();
		const formattedDatetime = new Date(datetime);

		const event = prisma.event.create({
			data: {
				event_id,
				title,
				description,
				datetime: formattedDatetime,
				duration,
				point_value,
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

		return !!attendance;
	}

	static async addAttendance(uh_id: string, event_id: string, swag: boolean) {
		console.info(
			`EventService.addAttendance invoked! uh_id:${uh_id} event_id=${event_id}`
		);

		const event_attendance_id = Util.generateId();
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
				event_attendance_id,
				event_id,
				contact_id: contact.contact_id,
				timestamp,
				swag,
			},
		});

		return attendance;
	}
}

export default EventService;
