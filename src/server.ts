import { API_PORT } from "./utils/config";
import logger from "./utils/logger/logger";

import app from "./app";

app.listen(API_PORT, () => {
	logger.info(`API is listening at http://localhost:${API_PORT}`);
});
