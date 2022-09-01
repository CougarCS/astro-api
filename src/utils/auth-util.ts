import { NextFunction, Request, Response } from "express";
import { sign, verify } from "jsonwebtoken";

import { TOKEN_EXPIRATION } from "./config";
import logger from "./logger/logger";
import { TokenPayloadModel } from "../models/auth.model";
import AuthService from "../services/auth-service";

class AuthUtil {
	static generateAccessToken(
		payload: TokenPayloadModel,
		secret: string
	): string {
		const options = {
			expiresIn: TOKEN_EXPIRATION,
			issuer: "vrd-api",
		};
		const token = sign(payload, secret, options);
		return token;
	}

	static async authenticateToken(
		req: Request,
		res: Response,
		next: NextFunction
	) {
		const { authorization } = req.headers;
		if (!authorization) return res.sendStatus(401);
		const token = authorization.split(" ")[1];
		if (!token) return res.sendStatus(401);

		const secret = await AuthService.getSecret();

		try {
			const decoded = verify(token, secret) as TokenPayloadModel;
			logger.info(
				`Token verified. Requestor = ${decoded.user.first_name} ${decoded.user.last_name}`
			);
			req.body.auth_user_id = decoded.user.user_id;
			req.body.auth_role = decoded.user.role;
		} catch (err) {
			logger.info(`Token verification failed. Error = ${JSON.stringify(err)}`);
			return res.sendStatus(401);
		}

		next();
	}
}

export default AuthUtil;
