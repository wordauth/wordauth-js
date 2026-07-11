import { describe, it, expect, vi, beforeEach } from "vitest";
import { WordAuth } from "../src/client";
import { WordAuthError } from "../src/errors";
import { API_PREFIX, DEFAULT_BASE_URL } from "../src/http";

const MOCK_API_KEY = "sk_test_abc123";
const BASE = `${DEFAULT_BASE_URL}${API_PREFIX}`;

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

  it("exposes resource namespaces", () => {
    const client = new WordAuth(MOCK_API_KEY);
    expect(client.auth).toBeDefined();
    expect(client.otp).toBeDefined();
    expect(client.sessions).toBeDefined();
    expect(client.users).toBeDefined();
  });
});

describe("WordAuth.otp.generate()", () => {
  it("returns a generated word pair", async () => {
    const mockResponse = {
      otp_id: "abc-123",
      code: "happening holiday",
      session_id: null,
      expires_at: "2026-03-11T02:50:46.700343Z",
    };
    global.fetch = mockFetch(mockResponse);

    const client = new WordAuth(MOCK_API_KEY);
    const result = await client.otp.generate();

    expect(result).toEqual(mockResponse);
    expect(global.fetch).toHaveBeenCalledOnce();
    expect(global.fetch).toHaveBeenCalledWith(
      `${BASE}/otp/generate`,
      expect.objectContaining({
        method: "POST",
        headers: expect.objectContaining({
          "Content-Type": "application/json",
          Authorization: `Bearer ${MOCK_API_KEY}`,
          "X-API-Key": MOCK_API_KEY,
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
    await client.otp.generate({ session_id: "sess-1", ttl_seconds: 600 });

    expect(global.fetch).toHaveBeenCalledWith(
      `${BASE}/otp/generate`,
      expect.objectContaining({
        body: JSON.stringify({ session_id: "sess-1", ttl_seconds: 600 }),
      }),
    );
  });

  it("uses custom base URL", async () => {
    global.fetch = mockFetch({
      otp_id: "abc-123",
      code: "test words",
      session_id: null,
      expires_at: "2026-03-11T02:50:46.700343Z",
    });

    const client = new WordAuth({
      apiKey: MOCK_API_KEY,
      baseUrl: "https://custom.api.com",
    });
    await client.otp.generate();

    expect(global.fetch).toHaveBeenCalledWith(
      `https://custom.api.com${API_PREFIX}/otp/generate`,
      expect.anything(),
    );
  });

  it("throws WordAuthError on API error", async () => {
    global.fetch = mockFetch({ error: "Invalid API key" }, 403);

    const client = new WordAuth(MOCK_API_KEY);

    await expect(client.otp.generate()).rejects.toThrow(WordAuthError);
    await expect(client.otp.generate()).rejects.toMatchObject({
      message: "Invalid API key",
      status: 403,
    });
  });

  it("throws WordAuthError on network failure", async () => {
    global.fetch = vi.fn().mockRejectedValue(new Error("fetch failed"));

    const client = new WordAuth(MOCK_API_KEY);

    await expect(client.otp.generate()).rejects.toThrow(WordAuthError);
    await expect(client.otp.generate()).rejects.toMatchObject({
      message: "fetch failed",
      status: 0,
    });
  });
});

describe("WordAuth.otp.generateWithEmail()", () => {
  it("sends the email field in the request body", async () => {
    global.fetch = mockFetch({
      otp_id: "abc-123",
      code: "happy cloud",
      session_id: null,
      expires_at: "2026-03-11T02:50:46.700343Z",
    });

    const client = new WordAuth(MOCK_API_KEY);
    await client.otp.generateWithEmail("user@example.com");

    expect(global.fetch).toHaveBeenCalledWith(
      `${BASE}/otp/generate`,
      expect.objectContaining({
        body: JSON.stringify({ email: "user@example.com" }),
      }),
    );
  });
});

describe("WordAuth.otp.validate()", () => {
  it("returns validation result for a valid pair", async () => {
    global.fetch = mockFetch({ valid: true });

    const client = new WordAuth(MOCK_API_KEY);
    const result = await client.otp.validate({
      otp_id: "abc-123",
      code: "happening holiday",
    });

    expect(result).toEqual({ valid: true });
    expect(global.fetch).toHaveBeenCalledWith(
      `${BASE}/otp/validate`,
      expect.objectContaining({
        method: "POST",
        body: JSON.stringify({
          otp_id: "abc-123",
          code: "happening holiday",
        }),
      }),
    );
  });

  it("throws WordAuthError when code is missing via legacy validate()", async () => {
    const client = new WordAuth(MOCK_API_KEY);

    await expect(
      client.validate({ otp_id: "abc-123", code: "" }),
    ).rejects.toThrow(WordAuthError);
  });
});

describe("WordAuth.auth", () => {
  it("lists auth methods", async () => {
    global.fetch = mockFetch({
      methods: [{ id: "otp", label: "OTP" }],
    });

    const client = new WordAuth({
      apiKey: MOCK_API_KEY,
      subOrgId: "sub-1",
    });
    const result = await client.auth.methods();

    expect(result.methods).toHaveLength(1);
    expect(global.fetch).toHaveBeenCalledWith(
      `${BASE}/auth/methods?subOrgId=sub-1`,
      expect.objectContaining({ method: "GET" }),
    );
  });

  it("sends OTP login and returns session on verify", async () => {
    global.fetch = mockFetch({
      otp_id: "otp-1",
      expires_at: "2026-03-11T02:50:46.700343Z",
      delivery_hint: "u•••@example.com",
      delivery_method: "email",
    });

    const client = new WordAuth({
      apiKey: MOCK_API_KEY,
      subOrgId: "sub-1",
    });

    const sendResult = await client.auth.login.otp.send({
      email: "user@example.com",
    });
    expect(sendResult.otp_id).toBe("otp-1");

    global.fetch = mockFetch({
      session: {
        access_token: "tok",
        refresh_token: "ref",
        expires_in: 3600,
        user_id: "u1",
        directory_user_id: "d1",
      },
    });

    const verifyResult = await client.auth.login.otp.verify({
      email: "user@example.com",
      otp_id: "otp-1",
      code: "red bird",
    });
    expect(verifyResult.session.access_token).toBe("tok");
  });

  it("starts password login", async () => {
    global.fetch = mockFetch({
      session: {
        access_token: "tok",
        refresh_token: "ref",
        expires_in: 3600,
        user_id: "u1",
        directory_user_id: "d1",
      },
    });

    const client = new WordAuth({
      apiKey: MOCK_API_KEY,
      subOrgId: "sub-1",
    });

    const result = await client.auth.login.password({
      email: "user@example.com",
      password: "secret",
    });

    expect(result.session.access_token).toBe("tok");
    expect(global.fetch).toHaveBeenCalledWith(
      `${BASE}/auth/login/password`,
      expect.objectContaining({
        method: "POST",
        body: JSON.stringify({
          email: "user@example.com",
          password: "secret",
          subOrgId: "sub-1",
        }),
      }),
    );
  });
});

describe("legacy top-level OTP methods", () => {
  it("generate() delegates to otp.generate()", async () => {
    global.fetch = mockFetch({
      otp_id: "abc-123",
      code: "happy cloud",
      session_id: null,
      expires_at: "2026-03-11T02:50:46.700343Z",
    });

    const client = new WordAuth(MOCK_API_KEY);
    await client.generate();

    expect(global.fetch).toHaveBeenCalledWith(
      `${BASE}/otp/generate`,
      expect.anything(),
    );
  });
});
