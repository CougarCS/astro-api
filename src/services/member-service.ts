import { writeToPath } from "fast-csv";
import logger from "../utils/logger/logger";
import * as path from "path";

import SQLService from "./sql-service";
import { LedgerOptions as LedgerOption } from "src/models/member-service.model";

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

	static async writeLedgerFile(options: Array<LedgerOption>) {
		logger.info("MemberService.getLedgerFile invoked! Options = " + options);
		
		const fields = options.map((option) => { return option.field; });
		const headers = options.map((option) => { return option.header ? option.header : option.field; });

		const ledger_data = await SQLService.select("contact", { fields: fields });
		const rows = ledger_data.map(Object.values);

		writeToPath(path.resolve(__dirname, "member-ledger.csv"), rows, { headers: headers })
			.on("error", (err) => console.error(err))
			.on("finish", () => console.log("Done writing."));
	}
}

export default MemberService;
