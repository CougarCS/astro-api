interface SQLTableRow {
	[x: string]: string;
}

interface SQLField {
	Field: string;
	Type: string;
	Null: string;
	Key: string;
	Default: string | number;
}

interface SQLAttribute {
	field: string;
	value: string | Array<string>;
}

interface SQLCompoundAttribute {
	fields: SQLAttribute[];
	constraints: SQLAttribute[];
}

class SQLUtil {
	static format(value: string) {
		return value.replace("'", "''");
	}

	static attrToString(attrArr: SQLAttribute[]) {
		return attrArr.map((field) => {
			if (typeof field.value === "string")
				return `${field.field}='${SQLUtil.format(field.value)}'`;
			if (Array.isArray(field.value))
				return `${field.field} IN (${field.value.join(",")})`;
			return `${field.field}=${field.value}`;
		});
	}
}

export { SQLTableRow, SQLField, SQLAttribute, SQLCompoundAttribute, SQLUtil };
