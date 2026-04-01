export interface WordAuthOptions {
  apiKey: string;
  /** Override the base URL (default: https://api.wordauth.com) */
  baseUrl?: string;
}

export interface GenerateRequest {
  session_id?: string | null;
  ttl_seconds?: number;
  email?: string | null;
  phone?: string | null;
}

export interface GenerateResponse {
  otp_id: string;
  code: string;
  session_id: string | null;
  expires_at: string;
}

export interface ValidateRequest {
  otp_id?: string | null;
  session_id?: string | null;
  code: string;
}

export interface ValidateResponse {
  valid: boolean;
  message?: string | null;
}

export interface WordAuthErrorResponse {
  error: string;
  status: number;
}
