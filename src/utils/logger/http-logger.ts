import morgan, { StreamOptions } from "morgan";

import logger from "./logger";

const stream: StreamOptions = {
	write: (message) => logger.info(message),
};

const httpLogger = morgan(":method :url :status - :response-time ms", {
	stream,
});

export default httpLogger;
