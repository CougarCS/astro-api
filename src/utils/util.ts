import { v4 } from "uuid";

class Util {
	static generateId(): string {
		return v4();
	}
}

export default Util;
