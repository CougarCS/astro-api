// import { type } from "os";
import logger from "../utils/logger/logger";

import SQLService from "./sql-service";

class MemberService {
	static async isMember(uh_id = "", email = "") {
		logger.info(`uh_id=${uh_id} email=${email}`);
		const constraints = [];
		if (email !== "") constraints.push({ field: "email", value: email });
		if (uh_id !== "") constraints.push({ field: "uh_id", value: uh_id });
		const result = await SQLService.select("member", {
			fields: ["start_date", "end_date"],
			constraints,
			compare: "AND",
		});
		let status = false;
		if (result.length === 0) return { status };
		if (result[0].start_date < new Date() && new Date() < result[0].end_date)
			status = true;
		return {
			status,
			start_date: result[0].start_date,
			end_date: result[0].end_date,
		};
	}
}

export default MemberService;
