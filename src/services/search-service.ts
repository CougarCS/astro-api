import logger from "../utils/logger/logger";

// import SQLService from "./sql-service";

class SearchService {
	static async search() {
		logger.info("Search");
	}

	static async searchContacts() {
		logger.info("Search Contacts");
	}

	static async searchEvents() {
		logger.info("Search Events");
	}
}

export default SearchService;
