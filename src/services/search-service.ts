import logger from "../utils/logger/logger";

class SearchService {
	static async searchContacts(key: string) {
		logger.info(`SearchService.searchContacts invoked! Key = ${key}`);
		const rows = [];
		return rows;
	}

	static async searchEvents(key: string) {
		logger.info(`SearchService.searchEvents invoked! Key = ${key}`);
		const rows = [];
		return rows;
	}
}

export default SearchService;
