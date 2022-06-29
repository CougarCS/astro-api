// import { type } from "os";
import logger from "../utils/logger/logger";

import SQLService from "./sql-service";

class MemberService {
	static async isMember(student_id = "", email = "") {
		logger.info(`student_id=${student_id} email=${email}`);
		// Use SQLService to look up if student is a member.
		// Either student_id or email may be empty. One is guaranteed to be valid.

		let SQLquery = "SELECT * FROM member ";
		if (student_id != "") {
			SQLquery += `WHERE uh_id=${student_id}`;
		} else if (email != "") {
			SQLquery += `WHERE email='${email}'`;
		}
		const result = await SQLService.query(SQLquery);
		return result?.length == 0 ? "No" : "Yes";
	}

	static async getMembershipDates(student_id = "", email = "") {
		logger.info(`student_id=${student_id} email=${email}`);
		let SQLquery = "SELECT * FROM member ";
		if (student_id != "") {
			SQLquery += `WHERE uh_id=${student_id}`;
		} else if (email != "") {
			SQLquery += `WHERE email='${email}'`;
		}
		const result = await SQLService.query(SQLquery);
		if (result.length == 0) {
			logger.error("Member not found.");
			return {};
		}
		const start = result[0]?.start_date;
		const end = result[0]?.end_date;
		return { start, end };
	}
}

export default MemberService;
