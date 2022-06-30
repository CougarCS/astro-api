import util from "util";

import mysql from "mysql2";

import {
	DB_SERVICE_URL,
	DB_USER,
	DB_PASSWORD,
	DB_NAME,
	DB_PORT,
} from "../utils/config";
import {
	SQLTableRow,
	SQLField,
	SQLAttribute,
	SQLCompoundAttribute,
	SQLUtil,
} from "../utils/sql-utils";
import logger from "../utils/logger/logger";

const connection = mysql.createConnection({
	host: DB_SERVICE_URL,
	user: DB_USER,
	password: DB_PASSWORD,
	database: DB_NAME,
	port: DB_PORT,
});

const query = util.promisify(connection.query).bind(connection);

class SQLService {
	static query(SQL: string, args: string[] = []) {
		logger.info("SQLService.query invoked! SQL =", SQL);
		return query(SQL, args);
	}

	static async tables() {
		logger.info("SQLService.tables invoked!");
		const SQL = "SHOW TABLES";
		const output = await SQLService.query(SQL);
		const tables = output.map(
			(row: SQLTableRow) => row[`Tables_in_${DB_NAME}`]
		);
		return tables;
	}

	static async fields(table: string) {
		logger.info("SQLService.fields invoked! Table = " + table);
		const SQL = `SHOW COLUMNS FROM ${table};`;
		const output = await SQLService.query(SQL);
		const fields = output.map((row: SQLField) => ({
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
		fields: Array<string>,
		constraints: SQLAttribute[]
	) {
		logger.info(
			`SQLService.select invoked! Table = ${table}, Fields = ${JSON.stringify(
				fields
			)} Constraints = ${JSON.stringify(constraints)}`
		);

		const selectParams = fields.length !== 0 ? fields.join(",") : "*";
		const whereParams =
			constraints.length !== 0
				? ` WHERE ${SQLUtil.attrToString(constraints)}`
				: "";

		const SQL = `SELECT ${selectParams} FROM ${table}${whereParams};`;
		const rows = await SQLService.query(SQL);
		return rows;
	}

	static async update(
		table: string,
		params: SQLCompoundAttribute[]
	) {
		logger.info(
			`SQLService.update invoked! Table = ${table}, Params = ${JSON.stringify(
				params
			)}`
		);

		let results = { fieldCount: 0, affectedRows: 0, warningCount: 0, changedRows: 0 };
		const SQLStatements: string[] = [];

		params.forEach(async (compoundAttribute) => {
			const fields = compoundAttribute.fields;
			const constraints = compoundAttribute.constraints;

			const setParams = SQLUtil.attrToString(fields);
			const whereParams = 
				constraints.length !== 0
					? ` WHERE ${SQLUtil.attrToString(constraints)}`
					: "";
				
			const SQL = `UPDATE ${table} SET ${setParams}${whereParams}`;

			SQLStatements.push(SQL);

			const result = await SQLService.query(SQL);
			results = {
				fieldCount: results.fieldCount + result.fieldCount,
				affectedRows: results.affectedRows + result.affectedRows,
				warningCount: results.warningCount + result.warningCount,
				changedRows: results.changedRows + result.changedRows,
			};
		});
		
		console.log(results);
		return [results, SQLStatements];
	}

	// static async delete() {}
}

export default SQLService;
