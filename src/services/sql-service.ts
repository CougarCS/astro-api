import mysql from "mysql2/promise";
import { RowDataPacket } from "mysql2";

import { DB_NAME, DB_CONFIG } from "../utils/config";
import SQLUtil from "../utils/sql-util";
import logger from "../utils/logger/logger";

import { Field, SelectOptions } from "../models/sql-service.model";

class SQLService {
	static async query(
		SQL: string,
		args: string[] = []
	): Promise<RowDataPacket[]> {
		logger.info("SQLService.query invoked! SQL =", SQL);
		const connection = await mysql.createConnection(DB_CONFIG);
		const [rows] = await connection.query(SQL, args);
		return <RowDataPacket[]>rows;
	}

	static async tables(): Promise<string[]> {
		logger.info("SQLService.tables invoked!");
		const SQL = "SHOW TABLES";
		const output = await SQLService.query(SQL);
		const tables = output.map((row) => row[`Tables_in_${DB_NAME}`]);
		return tables;
	}

	static async fields(table: string): Promise<Field[]> {
		logger.info("SQLService.fields invoked! Table = " + table);
		const SQL = `SHOW COLUMNS FROM ${table};`;
		const rows = await SQLService.query(SQL);
		const fields = rows.map((row) => ({
			name: row.Field,
			type: row.Type,
			nullable: row.Null === "YES",
			isPrimaryKey: row.Key === "PRI",
			isForeignKey: row.Key === "MUL",
			default: row.Default ? row.Default : "",
		}));
		return fields;
	}

	static async select(
		table: string,
		{ fields = [], constraints = [], compare = "AND" }: SelectOptions
	): Promise<RowDataPacket[]> {
		logger.info(
			`SQLService.select invoked! Table = ${table}, Fields = ${JSON.stringify(
				fields
			)} Constraints= ${JSON.stringify(constraints)}`
		);

		const selectParams = fields.length !== 0 ? fields.join(",") : "*";
		const compareOption = ` ${compare} `;
		const whereParams =
			constraints.length !== 0
				? ` WHERE ${SQLUtil.attrToStringArr(constraints).join(compareOption)}`
				: "";

		const SQL = `SELECT ${selectParams} FROM ${table}${whereParams};`;
		const rows = await SQLService.query(SQL);
		return rows;
	}

	// static async update() {}

	// static async delete() {}
}

export default SQLService;
