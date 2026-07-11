import type { HttpClient } from "../http";
import type {
  GenerateRequest,
  GenerateResponse,
  OtpSettings,
  OtpSettingsResponse,
  SubOrgParams,
  ValidateRequest,
  ValidateResponse,
} from "../types";

export class OtpResource {
  constructor(private readonly http: HttpClient) {}

  generate(params: GenerateRequest = {}): Promise<GenerateResponse> {
    const scoped = this.http.withSubOrg(params);
    return this.http.post("/otp/generate", scoped);
  }

  generateWithEmail(
    email: string,
    params: Omit<GenerateRequest, "email"> = {},
  ): Promise<GenerateResponse> {
    return this.generate({ ...params, email });
  }

  generateWithSMS(
    phone: string,
    params: Omit<GenerateRequest, "phone"> = {},
  ): Promise<GenerateResponse> {
    return this.generate({ ...params, phone });
  }

  validate(params: ValidateRequest): Promise<ValidateResponse> {
    const scoped = this.http.withSubOrg(params);
    return this.http.post("/otp/validate", scoped);
  }

  getSettings(params?: SubOrgParams): Promise<OtpSettingsResponse> {
    const scoped = this.http.withSubOrg(params);
    return this.http.get("/otp/settings", { subOrgId: scoped.subOrgId });
  }

  updateSettings(
    settings: Partial<OtpSettings> & SubOrgParams,
  ): Promise<OtpSettingsResponse> {
    const scoped = this.http.withSubOrg(settings);
    return this.http.patch("/otp/settings", scoped);
  }
}
