import { WordAuthError } from "./errors";
import type {
  WordAuthOptions,
  GenerateResponse,
  ValidateRequest,
  ValidateResponse,
} from "./types";

const DEFAULT_BASE_URL = "https://api.wordauth.com";

export class WordAuth {
  private readonly apiKey: string;
  private readonly baseUrl: string;

  constructor(options: string | WordAuthOptions) {
    if (typeof options === "string") {
      this.apiKey = options;
      this.baseUrl = DEFAULT_BASE_URL;
    } else {
      this.apiKey = options.apiKey;
      this.baseUrl = options.baseUrl?.replace(/\/+$/, "") ?? DEFAULT_BASE_URL;
    }

    if (!this.apiKey) {
      throw new WordAuthError("API key is required", 0);
    }
  }

  async generate(): Promise<GenerateResponse> {
    return this.request<GenerateResponse>("/v1/generate", {
      method: "POST",
      body: JSON.stringify({}),
    });
  }

  async validate(params: ValidateRequest): Promise<ValidateResponse> {
    if (!params.otp_id || !params.code) {
      throw new WordAuthError("otp_id and code are required", 0);
    }

    return this.request<ValidateResponse>("/v1/validate", {
      method: "POST",
      body: JSON.stringify({
        otp_id: params.otp_id,
        code: params.code,
      }),
    });
  }

  private async request<T>(path: string, init: RequestInit): Promise<T> {
    const url = `${this.baseUrl}${path}`;

    let response: Response;
    try {
      response = await fetch(url, {
        ...init,
        headers: {
          "Content-Type": "application/json",
          "x-api-key": this.apiKey,
          ...init.headers,
        },
      });
    } catch (err) {
      throw new WordAuthError(
        err instanceof Error ? err.message : "Network request failed",
        0,
      );
    }

    const data = await response.json();

    if (!response.ok) {
      throw new WordAuthError(
        data.error ?? `Request failed with status ${response.status}`,
        response.status,
      );
    }

    return data as T;
  }
}
