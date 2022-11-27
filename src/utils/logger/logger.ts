import winston, { createLogger, config, transports, format } from "winston";

const options = {
	file: {
		handleExceptions: true,
		json: true,
		maxsize: 5242880, // 5MB
		maxFiles: 5,
		colorize: true,
	},
	console: {
		handleExceptions: true,
		json: false,
		colorize: true,
		timestamp: true,
	},
};

const logger = createLogger({
	levels: config.npm.levels,
	format: winston.format.combine(
		format.timestamp({ format: "MM-DD-YYYY hh:mm:ss" }),
		winston.format.json()
	),
	transports: [new transports.Console(options.console)],
	exitOnError: false,
});

export default logger;
