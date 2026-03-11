export interface WordAuthOptions {
  apiKey: string;
  /** Override the base URL (default: https://api.wordauth.com) */
  baseUrl?: string;
}

export interface GenerateResponse {
  otp_id: string;
  code: string;
  session_id: string | null;
  expires_at: string;
}

export interface ValidateRequest {
  otp_id: string;
  code: string;
}

export interface ValidateResponse {
  valid: boolean;
  otp_id: string;
}

export interface WordAuthErrorResponse {
  error: string;
  status: number;
}
