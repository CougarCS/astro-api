import { RowDataPacket } from "mysql2";
import logger from "../utils/logger/logger";
import SQLService from "./sql-service";

class SearchService {
	static async search(
		table: string,
		search: string,
		columns: string[]
	): Promise<RowDataPacket[]> {
		logger.info("Search");
		const matchParams = ` WHERE MATCH (${columns})`;
		const searchParams = ` AGAINST ('${search}' IN NATURAL LANGUAGE MODE)`;
		const SQL = `SELECT * FROM ${table}${matchParams}${searchParams};`;

		console.log(SQL);

		const rows = await SQLService.query(SQL);
		return rows;
	}

	static async searchContacts() {
		logger.info("Search Contacts");
	}

	static async searchEvents(search: string): Promise<RowDataPacket[]> {
		logger.info(`SearchService.searchEvents invoked! Search = ${search}`);

		// const matchParams = " WHERE MATCH (event_id, title, description)";
		// const againstParams = ` AGAINST ('${search}' IN NATURAL LANGUAGE MODE)`;
		// const SQL = `SELECT * FROM event${matchParams}${againstParams};`;

		// TODO: Add full text index
		// ALTER TABLE event
		// ADD FULLTEXT(event_id, title, description)
		// Adjust to use a more broad search() instead of a hard coded search
		// const rows = await SQLService.query(SQL);

		const rows = SearchService.search("event", search, [
			"event_id",
			"title",
			"description",
		]);
		return rows;
	}
}

export default SearchService;
