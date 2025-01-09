import * as vitest from "vitest";

import { joinURIAndPath } from "./request.js";

vitest.test("joinBaseURIAndPath()", () => {
	vitest.expect(joinURIAndPath("https://example.com", "/hi")).toBe("https://example.com/hi");
	vitest.expect(joinURIAndPath("https://example.com/", "/hi")).toBe("https://example.com/hi");
	vitest.expect(joinURIAndPath("https://example.com/", "hi")).toBe("https://example.com/hi");
	vitest.expect(joinURIAndPath("https://example.com", "hi")).toBe("https://example.com/hi");
	vitest.expect(joinURIAndPath("https://example.com", "/hi/")).toBe("https://example.com/hi/");

	vitest
		.expect(joinURIAndPath("https://example.com", "/hi", "/bye"))
		.toBe("https://example.com/hi/bye");
	vitest
		.expect(joinURIAndPath("https://example.com", "hi", "bye"))
		.toBe("https://example.com/hi/bye");
	vitest
		.expect(joinURIAndPath("https://example.com", "/hi/", "/bye/"))
		.toBe("https://example.com/hi/bye/");
});
