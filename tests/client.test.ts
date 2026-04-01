import { describe, it, expect, vi, beforeEach } from "vitest";
import { WordAuth } from "../src/client";
import { WordAuthError } from "../src/errors";

const MOCK_API_KEY = "sk_test_abc123";

function mockFetch(data: unknown, status = 200) {
  return vi.fn().mockResolvedValue({
    ok: status >= 200 && status < 300,
    status,
    json: () => Promise.resolve(data),
  });
}

beforeEach(() => {
  vi.restoreAllMocks();
});

describe("WordAuth constructor", () => {
  it("accepts a string API key", () => {
    const client = new WordAuth(MOCK_API_KEY);
    expect(client).toBeInstanceOf(WordAuth);
  });

  it("accepts an options object", () => {
    const client = new WordAuth({ apiKey: MOCK_API_KEY });
    expect(client).toBeInstanceOf(WordAuth);
  });

  it("accepts a custom base URL and strips trailing slashes", () => {
    const client = new WordAuth({
      apiKey: MOCK_API_KEY,
      baseUrl: "https://custom.api.com/",
    });
    expect(client).toBeInstanceOf(WordAuth);
  });

  it("throws if API key is empty", () => {
    expect(() => new WordAuth("")).toThrow(WordAuthError);
    expect(() => new WordAuth({ apiKey: "" })).toThrow(WordAuthError);
  });
});

describe("WordAuth.generate()", () => {
  it("returns a generated word pair", async () => {
    const mockResponse = {
      otp_id: "abc-123",
      code: "happening holiday",
      session_id: null,
      expires_at: "2026-03-11T02:50:46.700343Z",
    };
    global.fetch = mockFetch(mockResponse);

    const client = new WordAuth(MOCK_API_KEY);
    const result = await client.generate();

    expect(result).toEqual(mockResponse);
    expect(global.fetch).toHaveBeenCalledOnce();
    expect(global.fetch).toHaveBeenCalledWith(
      "https://api.wordauth.com/v1/generate",
      expect.objectContaining({
        method: "POST",
        headers: expect.objectContaining({
          "Content-Type": "application/json",
          "x-api-key": MOCK_API_KEY,
        }),
      }),
    );
  });

  it("passes params to the request body", async () => {
    const mockResponse = {
      otp_id: "abc-123",
      code: "happy cloud",
      session_id: "sess-1",
      expires_at: "2026-03-11T02:50:46.700343Z",
    };
    global.fetch = mockFetch(mockResponse);

    const client = new WordAuth(MOCK_API_KEY);
    await client.generate({ session_id: "sess-1", ttl_seconds: 600 });

    expect(global.fetch).toHaveBeenCalledWith(
      "https://api.wordauth.com/v1/generate",
      expect.objectContaining({
        body: JSON.stringify({ session_id: "sess-1", ttl_seconds: 600 }),
      }),
    );
  });

  it("uses custom base URL", async () => {
    const mockResponse = {
      otp_id: "abc-123",
      code: "test words",
      session_id: null,
      expires_at: "2026-03-11T02:50:46.700343Z",
    };
    global.fetch = mockFetch(mockResponse);

    const client = new WordAuth({
      apiKey: MOCK_API_KEY,
      baseUrl: "https://custom.api.com",
    });
    await client.generate();

    expect(global.fetch).toHaveBeenCalledWith(
      "https://custom.api.com/v1/generate",
      expect.anything(),
    );
  });

  it("throws WordAuthError on API error", async () => {
    global.fetch = mockFetch({ error: "Invalid API key" }, 403);

    const client = new WordAuth(MOCK_API_KEY);

    await expect(client.generate()).rejects.toThrow(WordAuthError);
    await expect(client.generate()).rejects.toMatchObject({
      message: "Invalid API key",
      status: 403,
    });
  });

  it("throws WordAuthError on network failure", async () => {
    global.fetch = vi.fn().mockRejectedValue(new Error("fetch failed"));

    const client = new WordAuth(MOCK_API_KEY);

    await expect(client.generate()).rejects.toThrow(WordAuthError);
    await expect(client.generate()).rejects.toMatchObject({
      message: "fetch failed",
      status: 0,
    });
  });
});

describe("WordAuth.generateWithEmail()", () => {
  it("sends the email field in the request body", async () => {
    const mockResponse = {
      otp_id: "abc-123",
      code: "happy cloud",
      session_id: null,
      expires_at: "2026-03-11T02:50:46.700343Z",
    };
    global.fetch = mockFetch(mockResponse);

    const client = new WordAuth(MOCK_API_KEY);
    const result = await client.generateWithEmail("user@example.com");

    expect(result).toEqual(mockResponse);
    expect(global.fetch).toHaveBeenCalledWith(
      "https://api.wordauth.com/v1/generate",
      expect.objectContaining({
        body: JSON.stringify({ email: "user@example.com" }),
      }),
    );
  });

  it("merges extra params alongside the email", async () => {
    const mockResponse = {
      otp_id: "abc-123",
      code: "happy cloud",
      session_id: "sess-1",
      expires_at: "2026-03-11T02:50:46.700343Z",
    };
    global.fetch = mockFetch(mockResponse);

    const client = new WordAuth(MOCK_API_KEY);
    await client.generateWithEmail("user@example.com", {
      session_id: "sess-1",
      ttl_seconds: 600,
    });

    expect(global.fetch).toHaveBeenCalledWith(
      "https://api.wordauth.com/v1/generate",
      expect.objectContaining({
        body: JSON.stringify({
          session_id: "sess-1",
          ttl_seconds: 600,
          email: "user@example.com",
        }),
      }),
    );
  });
});

describe("WordAuth.generateWithSMS()", () => {
  it("sends the phone field in the request body", async () => {
    const mockResponse = {
      otp_id: "abc-123",
      code: "happy cloud",
      session_id: null,
      expires_at: "2026-03-11T02:50:46.700343Z",
    };
    global.fetch = mockFetch(mockResponse);

    const client = new WordAuth(MOCK_API_KEY);
    const result = await client.generateWithSMS("+15550001234");

    expect(result).toEqual(mockResponse);
    expect(global.fetch).toHaveBeenCalledWith(
      "https://api.wordauth.com/v1/generate",
      expect.objectContaining({
        body: JSON.stringify({ phone: "+15550001234" }),
      }),
    );
  });

  it("merges extra params alongside the phone", async () => {
    const mockResponse = {
      otp_id: "abc-123",
      code: "happy cloud",
      session_id: "sess-2",
      expires_at: "2026-03-11T02:50:46.700343Z",
    };
    global.fetch = mockFetch(mockResponse);

    const client = new WordAuth(MOCK_API_KEY);
    await client.generateWithSMS("+15550001234", {
      session_id: "sess-2",
      ttl_seconds: 120,
    });

    expect(global.fetch).toHaveBeenCalledWith(
      "https://api.wordauth.com/v1/generate",
      expect.objectContaining({
        body: JSON.stringify({
          session_id: "sess-2",
          ttl_seconds: 120,
          phone: "+15550001234",
        }),
      }),
    );
  });
});

describe("WordAuth.validate()", () => {
  it("returns validation result for a valid pair", async () => {
    const mockResponse = { valid: true };
    global.fetch = mockFetch(mockResponse);

    const client = new WordAuth(MOCK_API_KEY);
    const result = await client.validate({
      otp_id: "abc-123",
      code: "happening holiday",
    });

    expect(result).toEqual(mockResponse);
    expect(global.fetch).toHaveBeenCalledWith(
      "https://api.wordauth.com/v1/validate",
      expect.objectContaining({
        method: "POST",
        body: JSON.stringify({
          otp_id: "abc-123",
          code: "happening holiday",
        }),
      }),
    );
  });

  it("returns validation result for an invalid pair", async () => {
    const mockResponse = { valid: false, message: "OTP not found" };
    global.fetch = mockFetch(mockResponse);

    const client = new WordAuth(MOCK_API_KEY);
    const result = await client.validate({
      otp_id: "abc-123",
      code: "wrong words",
    });

    expect(result.valid).toBe(false);
  });

  it("throws WordAuthError when code is missing", async () => {
    const client = new WordAuth(MOCK_API_KEY);

    await expect(
      client.validate({ otp_id: "abc-123", code: "" }),
    ).rejects.toThrow(WordAuthError);
  });

  it("throws WordAuthError on expired session", async () => {
    global.fetch = mockFetch({ error: "OTP expired" }, 410);

    const client = new WordAuth(MOCK_API_KEY);

    await expect(
      client.validate({ otp_id: "abc-123", code: "happening holiday" }),
    ).rejects.toMatchObject({
      message: "OTP expired",
      status: 410,
    });
  });

  it("throws WordAuthError on API error", async () => {
    global.fetch = mockFetch({ error: "Rate limit exceeded" }, 429);

    const client = new WordAuth(MOCK_API_KEY);

    await expect(
      client.validate({ otp_id: "abc-123", code: "happening holiday" }),
    ).rejects.toThrow(WordAuthError);
  });
});
