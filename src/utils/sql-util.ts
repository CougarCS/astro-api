import { Attribute } from "../models/sql-service.model";

class SQLUtil {
	static format(value: string) {
		return value.replace("'", "''");
	}

	static attrToStringArr(attrArr: Attribute[]) {
		return attrArr.map((field) => {
			if (typeof field.value === "string")
				return `${field.field}='${SQLUtil.format(field.value)}'`;
			if (Array.isArray(field.value))
				return `${field.field} IN (${field.value.join(",")})`;
			return `${field.field}=${field.value}`;
		});
	}
}

export default SQLUtil;
