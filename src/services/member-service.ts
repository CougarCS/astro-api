import logger from "../utils/logger/logger";

// import SQLService from "./sql-service";

class MemberService {
	static async isMember(student_id = "", email = "") {
		logger.info(`student_id=${student_id} email=${email}`);

		// Use SQLService to look up if student is a member.
		// Either student_id or email may be empty. One is guaranteed to be valid.

		return "Yes";
	}
}

export default MemberService;
