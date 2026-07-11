import { WordAuthError } from "./errors";
import { DEFAULT_BASE_URL, HttpClient } from "./http";
import { AuthResource } from "./resources/auth";
import {
  AuditLogsResource,
  RbacResource,
  ScimResource,
} from "./resources/management";
import {
  MfaResource,
  PasskeysResource,
  SocialResource,
  SsoResource,
} from "./resources/identity";
import { OtpResource } from "./resources/otp";
import {
  AdminPortalResource,
  MembersResource,
  OrganizationAppsResource,
  SubOrganizationsResource,
} from "./resources/organization";
import { SessionsResource } from "./resources/sessions";
import { UsersResource } from "./resources/users";
import { WebhooksResource } from "./resources/webhooks";
import type {
  GenerateRequest,
  GenerateResponse,
  ValidateRequest,
  ValidateResponse,
  WordAuthOptions,
} from "./types";

export class WordAuth {
  private readonly http: HttpClient;

  readonly auth: AuthResource;
  readonly otp: OtpResource;
  readonly sessions: SessionsResource;
  readonly users: UsersResource;
  readonly webhooks: WebhooksResource;
  readonly sso: SsoResource;
  readonly social: SocialResource;
  readonly mfa: MfaResource;
  readonly passkeys: PasskeysResource;
  readonly adminPortal: AdminPortalResource;
  readonly subOrganizations: SubOrganizationsResource;
  readonly members: MembersResource;
  readonly organizationApps: OrganizationAppsResource;
  readonly rbac: RbacResource;
  readonly auditLogs: AuditLogsResource;
  readonly scim: ScimResource;

  constructor(options: string | WordAuthOptions) {
    const resolved =
      typeof options === "string"
        ? { apiKey: options }
        : options;

    if (!resolved.apiKey) {
      throw new WordAuthError("API key is required", 0);
    }

    this.http = new HttpClient(
      resolved.apiKey,
      resolved.baseUrl ?? DEFAULT_BASE_URL,
      resolved.subOrgId,
    );

    this.auth = new AuthResource(this.http);
    this.otp = new OtpResource(this.http);
    this.sessions = new SessionsResource(this.http);
    this.users = new UsersResource(this.http);
    this.webhooks = new WebhooksResource(this.http);
    this.sso = new SsoResource(this.http);
    this.social = new SocialResource(this.http);
    this.mfa = new MfaResource(this.http);
    this.passkeys = new PasskeysResource(this.http);
    this.adminPortal = new AdminPortalResource(this.http);
    this.subOrganizations = new SubOrganizationsResource(this.http);
    this.members = new MembersResource(this.http);
    this.organizationApps = new OrganizationAppsResource(this.http);
    this.rbac = new RbacResource(this.http);
    this.auditLogs = new AuditLogsResource(this.http);
    this.scim = new ScimResource(this.http);
  }

  /** @deprecated Use `wordauth.otp.generate()` instead. */
  async generate(params: GenerateRequest = {}): Promise<GenerateResponse> {
    return this.otp.generate(params);
  }

  /** @deprecated Use `wordauth.otp.generateWithEmail()` instead. */
  async generateWithEmail(
    email: string,
    params: Omit<GenerateRequest, "email"> = {},
  ): Promise<GenerateResponse> {
    return this.otp.generateWithEmail(email, params);
  }

  /** @deprecated Use `wordauth.otp.generateWithSMS()` instead. */
  async generateWithSMS(
    phone: string,
    params: Omit<GenerateRequest, "phone"> = {},
  ): Promise<GenerateResponse> {
    return this.otp.generateWithSMS(phone, params);
  }

  /** @deprecated Use `wordauth.otp.validate()` instead. */
  async validate(params: ValidateRequest): Promise<ValidateResponse> {
    if (!params.code) {
      throw new WordAuthError("code is required", 0);
    }
    return this.otp.validate(params);
  }
}
