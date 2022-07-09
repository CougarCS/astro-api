interface Attribute {
	field: string;
	value: string | Array<string>;
}

interface CompoundAttribute {
	attributes: Attribute[];
	constraints: Attribute[];
}

interface Field {
	name: string;
	type: string;
	nullable: boolean;
	isPrimaryKey: boolean;
	isForeignKey: boolean;
	default: string | number;
}

interface SelectOptions {
	fields?: string[];
	constraints?: Attribute[];
	compare?: "AND" | "OR";
}

interface OkResult {
	fieldCount: number;
	affectedRows: number;
	warningCount: number;
	changedRows: number;
}

export { Attribute, CompoundAttribute, Field, OkResult, SelectOptions };
