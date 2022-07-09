import { RowDataPacket } from "mysql2";
import logger from "../utils/logger/logger";
import SQLService from "./sql-service";

class SearchService {
	static async search(
		table: string,
		key: string,
		columns: string[]
	): Promise<RowDataPacket[]> {
		logger.info(
			`SearchService invoked! Table = ${table}, Key = ${key}, Columns = ${columns}`
		);

		const whereParams = ` WHERE MATCH (${columns})`;
		const againstParams = ` AGAINST ('${key}' IN NATURAL LANGUAGE MODE)`;
		const SQL = `SELECT * FROM ${table}${whereParams}${againstParams};`;

		const rows = await SQLService.query(SQL);
		return rows;
	}

	static async searchContacts(key: string): Promise<RowDataPacket[]> {
		logger.info(`SearchService.searchContacts invoked! Key = ${key}`);
		const rows = SearchService.search("contact", key, [
			"contact_id",
			"uh_id",
			"email",
			"first_name",
			"last_name",
			"phone_number",
		]);
		return rows;
	}

	static async searchEvents(key: string): Promise<RowDataPacket[]> {
		logger.info(`SearchService.searchEvents invoked! Key = ${key}`);

		const rows = SearchService.search("event", key, ["title", "description"]);
		return rows;
	}
}

export default SearchService;
