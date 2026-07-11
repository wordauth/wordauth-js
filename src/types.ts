export interface WordAuthOptions {
  apiKey: string;
  /** Override the API base URL (default: https://os.wordauth.com) */
  baseUrl?: string;
  /** Default sub-organization for org-wide API keys */
  subOrgId?: string;
}

export interface SubOrgParams {
  subOrgId?: string;
}

export interface AuthSession {
  access_token: string;
  refresh_token: string;
  expires_in: number;
  user_id: string;
  directory_user_id: string;
  token_hash?: string;
}

export interface SessionResponse {
  session: AuthSession;
}

export interface AuthMethod {
  id: "otp" | "password" | "magic_link" | "social" | "passkey" | "sso";
  label: string;
  providers?: string[];
  connections?: Array<{ id: string; name: string; protocol: string }>;
}

export interface AuthMethodsResponse {
  methods: AuthMethod[];
}

export interface OtpSendResponse {
  otp_id: string;
  expires_at: string;
  delivery_hint: string;
  delivery_method: string;
}

export interface MagicLinkSendResponse {
  delivery_hint: string;
}

export interface PasskeyOptionsResponse {
  options: Record<string, unknown>;
  challengeId: string;
}

export interface OAuthStartResponse {
  authorization_url: string;
  state: string;
}

export interface GenerateRequest {
  session_id?: string | null;
  ttl_seconds?: number;
  email?: string | null;
  phone?: string | null;
  subOrgId?: string;
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
  subOrgId?: string;
}

export interface ValidateResponse {
  valid: boolean;
  message?: string | null;
}

export interface OtpSettings {
  mode?: string;
  ttl_seconds?: number;
  channel_sms?: boolean;
  channel_email?: boolean;
  [key: string]: unknown;
}

export interface OtpSettingsResponse {
  settings: OtpSettings;
}

export interface WordAuthErrorResponse {
  error: string;
  status: number;
}

// Auth login/signup request types
export interface AuthEmailParams extends SubOrgParams {
  email: string;
}

export interface AuthLoginOtpVerifyParams extends SubOrgParams {
  email: string;
  otp_id: string;
  code: string;
}

export interface AuthLoginPasswordParams extends SubOrgParams {
  email: string;
  password: string;
}

export interface AuthMagicLinkSendParams extends SubOrgParams {
  email: string;
  redirectTo?: string;
}

export interface AuthMagicLinkVerifyParams extends SubOrgParams {
  email: string;
  token_hash: string;
}

export interface AuthPasskeyOptionsParams extends SubOrgParams {
  email: string;
}

export interface AuthPasskeyVerifyParams extends SubOrgParams {
  email: string;
  challengeId: string;
  credential: Record<string, unknown>;
}

export interface AuthSocialStartParams extends SubOrgParams {
  provider: "google" | "github" | "apple" | "microsoft" | string;
  redirectUri: string;
}

export interface AuthSsoStartParams extends SubOrgParams {
  connectionId: string;
  redirectUri: string;
}

export interface AuthSignupParams extends SubOrgParams {
  email: string;
  openSignup?: boolean;
  firstName?: string;
  lastName?: string;
  phone?: string;
}

export interface AuthSignupPasswordParams extends SubOrgParams {
  email: string;
  password: string;
  openSignup?: boolean;
}

export interface AuthSignupOtpSendParams extends SubOrgParams {
  email: string;
  openSignup?: boolean;
}

export interface AuthSignupOtpVerifyParams extends SubOrgParams {
  email: string;
  otp_id: string;
  code: string;
  openSignup?: boolean;
}

// OS management types (loosely typed for forward compatibility)
export type JsonObject = Record<string, unknown>;

export interface SuccessResponse {
  success: boolean;
}

export interface OkResponse {
  ok: boolean;
}
