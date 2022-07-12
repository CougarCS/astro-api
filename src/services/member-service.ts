// import { type } from "os";
import logger from "../utils/logger/logger";

import SQLService from "./sql-service";

class MemberService {
	static async isMember(uh_id = "", email = "") {
		logger.info(`uh_id=${uh_id} email=${email}`);

		const constraints = [];
		if (email !== "") constraints.push({ field: "email", value: email });
		if (uh_id !== "") constraints.push({ field: "uh_id", value: uh_id });

		const result = await SQLService.select("active_member", {
			fields: ["start_date", "end_date", "member_points"],
			constraints,
			compare: "AND",
		});
		
		if (result.length === 0) return { status: false };
		return {
			status: true,
			start_date: result[0].start_date,
			end_date: result[0].end_date,
			member_points: result[0].member_points
		};
	}
}

export default MemberService;
