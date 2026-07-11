import { WordAuthError } from "./errors";

export const DEFAULT_BASE_URL = "https://os.wordauth.com";
export const API_PREFIX = "/api/v1";

export type QueryParams = Record<
  string,
  string | number | boolean | undefined | null
>;

export type HttpRequestOptions = {
  method?: string;
  query?: QueryParams;
  body?: unknown;
};

export class HttpClient {
  readonly apiKey: string;
  readonly baseUrl: string;
  readonly defaultSubOrgId?: string;

  constructor(apiKey: string, baseUrl: string, defaultSubOrgId?: string) {
    this.apiKey = apiKey;
    this.baseUrl = baseUrl.replace(/\/+$/, "");
    this.defaultSubOrgId = defaultSubOrgId;
  }

  resolveSubOrgId(subOrgId?: string): string | undefined {
    return subOrgId ?? this.defaultSubOrgId;
  }

  withSubOrg<T extends { subOrgId?: string }>(
    params: T | undefined,
  ): T & { subOrgId?: string } {
    const subOrgId = this.resolveSubOrgId(params?.subOrgId);
    if (!subOrgId) return params ?? ({} as T);
    return { ...(params ?? ({} as T)), subOrgId };
  }

  buildUrl(path: string, query?: QueryParams): string {
    const url = new URL(`${this.baseUrl}${API_PREFIX}${path}`);
    if (query) {
      for (const [key, value] of Object.entries(query)) {
        if (value !== undefined && value !== null) {
          url.searchParams.set(key, String(value));
        }
      }
    }
    return url.toString();
  }

  async request<T>(path: string, options: HttpRequestOptions = {}): Promise<T> {
    const { method = "GET", query, body } = options;
    const url = this.buildUrl(path, query);

    let response: Response;
    try {
      response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${this.apiKey}`,
          "X-API-Key": this.apiKey,
        },
        body: body === undefined ? undefined : JSON.stringify(body),
      });
    } catch (err) {
      throw new WordAuthError(
        err instanceof Error ? err.message : "Network request failed",
        0,
      );
    }

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      throw new WordAuthError(
        (data as { error?: string }).error ??
          `Request failed with status ${response.status}`,
        response.status,
      );
    }

    return data as T;
  }

  get<T>(path: string, query?: QueryParams): Promise<T> {
    return this.request<T>(path, { method: "GET", query });
  }

  post<T>(path: string, body?: unknown, query?: QueryParams): Promise<T> {
    return this.request<T>(path, { method: "POST", body, query });
  }

  put<T>(path: string, body?: unknown, query?: QueryParams): Promise<T> {
    return this.request<T>(path, { method: "PUT", body, query });
  }

  patch<T>(path: string, body?: unknown, query?: QueryParams): Promise<T> {
    return this.request<T>(path, { method: "PATCH", body, query });
  }

  delete<T>(path: string, query?: QueryParams, body?: unknown): Promise<T> {
    return this.request<T>(path, { method: "DELETE", query, body });
  }
}
