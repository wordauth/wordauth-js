import type { HttpClient } from "../http";
import type {
  AuthEmailParams,
  AuthLoginOtpVerifyParams,
  AuthLoginPasswordParams,
  AuthMagicLinkSendParams,
  AuthMagicLinkVerifyParams,
  AuthMethodsResponse,
  AuthPasskeyOptionsParams,
  AuthPasskeyVerifyParams,
  AuthSignupOtpSendParams,
  AuthSignupOtpVerifyParams,
  AuthSignupParams,
  AuthSignupPasswordParams,
  AuthSocialStartParams,
  AuthSsoStartParams,
  MagicLinkSendResponse,
  OAuthStartResponse,
  OtpSendResponse,
  PasskeyOptionsResponse,
  SessionResponse,
  SubOrgParams,
} from "../types";

export class AuthResource {
  constructor(private readonly http: HttpClient) {}

  methods(params?: SubOrgParams): Promise<AuthMethodsResponse> {
    const scoped = this.http.withSubOrg(params);
    return this.http.get("/auth/methods", {
      subOrgId: scoped.subOrgId,
    });
  }

  login = {
    otp: {
      send: (params: AuthEmailParams): Promise<OtpSendResponse> => {
        const scoped = this.http.withSubOrg(params);
        return this.http.post("/auth/login/otp/send", scoped);
      },
      verify: (params: AuthLoginOtpVerifyParams): Promise<SessionResponse> => {
        const scoped = this.http.withSubOrg(params);
        return this.http.post("/auth/login/otp/verify", scoped);
      },
    },
    password: (params: AuthLoginPasswordParams): Promise<SessionResponse> => {
      const scoped = this.http.withSubOrg(params);
      return this.http.post("/auth/login/password", scoped);
    },
    magicLink: {
      send: (params: AuthMagicLinkSendParams): Promise<MagicLinkSendResponse> => {
        const scoped = this.http.withSubOrg(params);
        return this.http.post("/auth/login/magic-link/send", scoped);
      },
      verify: (
        params: AuthMagicLinkVerifyParams,
      ): Promise<SessionResponse> => {
        const scoped = this.http.withSubOrg(params);
        return this.http.post("/auth/login/magic-link/verify", scoped);
      },
    },
    passkey: {
      options: (
        params: AuthPasskeyOptionsParams,
      ): Promise<PasskeyOptionsResponse> => {
        const scoped = this.http.withSubOrg(params);
        return this.http.post("/auth/login/passkey/options", scoped);
      },
      verify: (params: AuthPasskeyVerifyParams): Promise<SessionResponse> => {
        const scoped = this.http.withSubOrg(params);
        return this.http.post("/auth/login/passkey/verify", scoped);
      },
    },
    social: {
      start: (params: AuthSocialStartParams): Promise<OAuthStartResponse> => {
        const scoped = this.http.withSubOrg(params);
        return this.http.post("/auth/login/social/start", scoped);
      },
    },
    sso: {
      start: (params: AuthSsoStartParams): Promise<OAuthStartResponse> => {
        const scoped = this.http.withSubOrg(params);
        return this.http.post("/auth/login/sso/start", scoped);
      },
    },
  };

  signup = {
    create: (params: AuthSignupParams): Promise<SessionResponse> => {
      const scoped = this.http.withSubOrg(params);
      return this.http.post("/auth/signup", scoped);
    },
    password: (params: AuthSignupPasswordParams): Promise<SessionResponse> => {
      const scoped = this.http.withSubOrg(params);
      return this.http.post("/auth/signup/password", scoped);
    },
    otp: {
      send: (params: AuthSignupOtpSendParams): Promise<OtpSendResponse> => {
        const scoped = this.http.withSubOrg(params);
        return this.http.post("/auth/signup/otp/send", scoped);
      },
      verify: (
        params: AuthSignupOtpVerifyParams,
      ): Promise<SessionResponse> => {
        const scoped = this.http.withSubOrg(params);
        return this.http.post("/auth/signup/otp/verify", scoped);
      },
    },
  };
}
