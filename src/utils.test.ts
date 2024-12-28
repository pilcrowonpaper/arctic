import * as vitest from "vitest";

import { trimLeft, trimRight } from "./utils.js";

vitest.test("trimLeft()", () => {
	vitest.expect(trimLeft(" hello", " ")).toBe("hello");
	vitest.expect(trimLeft("  hello", " ")).toBe("hello");
	vitest.expect(trimLeft("!!!hello", "!")).toBe("hello");
	vitest.expect(trimLeft("!!!hello!", "!")).toBe("hello!");
	vitest.expect(trimLeft("!!", "!")).toBe("");
	vitest.expect(trimLeft("", "!")).toBe("");

	vitest.expect(() => trimLeft("hello", "!!")).toThrow(TypeError);
});

vitest.test("trimRight()", () => {
	vitest.expect(trimRight("hello ", " ")).toBe("hello");
	vitest.expect(trimRight("hello  ", " ")).toBe("hello");
	vitest.expect(trimRight("hello!!!", "!")).toBe("hello");
	vitest.expect(trimRight("!hello!!!", "!")).toBe("!hello");
	vitest.expect(trimRight("!!", "!")).toBe("");
	vitest.expect(trimRight("", "!")).toBe("");

	vitest.expect(() => trimLeft("hello", "!!")).toThrow(TypeError);
});
