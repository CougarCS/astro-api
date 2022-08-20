import { prisma } from "../utils/prisma";

class EventService {
	static async createEvent() {
		console.log("createEvent");
	}

	static async addAttendance() {
		console.log("addAttendance");
	}
}

export default EventService;
