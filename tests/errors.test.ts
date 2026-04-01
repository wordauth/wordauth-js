import { describe, it, expect } from "vitest";
import { WordAuthError } from "../src/errors";

describe("WordAuthError", () => {
  it("has the correct name", () => {
    const err = new WordAuthError("test", 400);
    expect(err.name).toBe("WordAuthError");
  });

  it("stores message and status", () => {
    const err = new WordAuthError("Something went wrong", 500);
    expect(err.message).toBe("Something went wrong");
    expect(err.status).toBe(500);
  });

  it("is an instance of Error", () => {
    const err = new WordAuthError("test", 400);
    expect(err).toBeInstanceOf(Error);
    expect(err).toBeInstanceOf(WordAuthError);
  });

  it("has a stack trace", () => {
    const err = new WordAuthError("test", 400);
    expect(err.stack).toBeDefined();
  });

  it("works with status 0 for client-side errors", () => {
    const err = new WordAuthError("Network failure", 0);
    expect(err.status).toBe(0);
    expect(err.message).toBe("Network failure");
  });
});
