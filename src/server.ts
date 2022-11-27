/* Program Entrypoint */

import serverlessExpress from "@vendia/serverless-express";

import { API_PORT } from "./utils/config";
import logger from "./utils/logger/logger";

import app from "./app";

const LAMBDA = !!process.env.LAMBDA_TASK_ROOT;

if (LAMBDA) {
	logger.info("\n-- API is running on AWS Lambda");
	module.exports.handler = serverlessExpress({ app });
} else {
	app.listen(API_PORT, () => {
		logger.info("\n-- API is NOT running on AWS Lambda");
		logger.info(`-- API is listening at http://localhost:${API_PORT}`);
	});
}
