interface Attribute {
	field: string;
	value: string | Array<string>;
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

export { Attribute, Field, SelectOptions };
