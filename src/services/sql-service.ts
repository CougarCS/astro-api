import mysql from "mysql2/promise";
import { RowDataPacket, OkPacket } from "mysql2";

import { DB_NAME, DB_CONFIG } from "../utils/config";
import SQLUtil from "../utils/sql-util";
import logger from "../utils/logger/logger";

import {
	Attribute,
	CompoundAttribute,
	Field,
	OkResult,
	SelectOptions,
} from "../models/sql-service.model";

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
			)} Constraints = ${JSON.stringify(constraints)}`
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

	static async update(
		table: string,
		updateOptions: CompoundAttribute[]
	): Promise<OkResult> {
		logger.info(
			`SQLService.update invoked! Table = ${table}, updateOptions = ${JSON.stringify(
				updateOptions
			)}`
		);

		const pool = mysql.createPool(DB_CONFIG);
		const connection = await pool.getConnection();

		const summary = {
			fieldCount: 0,
			affectedRows: 0,
			warningCount: 0,
			changedRows: 0,
		};

		await Promise.all(
			updateOptions.map(async (option) => {
				const { attributes, constraints } = option;
				const updateParams = SQLUtil.attrToStringArr(attributes).join(",");
				const constraintParams =
					SQLUtil.attrToStringArr(constraints).join(" AND ");
				const SQL = `UPDATE ${table} SET ${updateParams} WHERE ${constraintParams};`;
				logger.info(`SQLService.update: Executing SQL "${SQL}"`);
				const [packet] = await connection.query(SQL);
				const result = <OkPacket>packet;
				summary.fieldCount += result.fieldCount;
				summary.affectedRows += result.affectedRows;
				summary.warningCount += result.warningCount;
				summary.changedRows += result.changedRows;
			})
		);

		return summary;
	}

	static async delete(
		table: string,
		constraints: Attribute[]
	): Promise<OkResult> {
		logger.info(
			`SQLService.delete invoked! Table = ${table}, Constraints = ${JSON.stringify(
				constraints
			)}`
		);

		const whereParams =
			constraints.length !== 0
				? ` WHERE ${SQLUtil.attrToStringArr(constraints).join("OR")}`
				: "";
		const SQL = `DELETE FROM ${table}${whereParams}`;

		const connection = await mysql.createConnection(DB_CONFIG);
		const [packet] = await connection.query(SQL);
		return <OkResult>packet;
	}
}

export default SQLService;
