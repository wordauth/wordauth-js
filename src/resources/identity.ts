import type { HttpClient } from "../http";
import type { JsonObject, SubOrgParams, SuccessResponse } from "../types";

export class SsoResource {
  constructor(private readonly http: HttpClient) {}

  listConnections(params?: SubOrgParams): Promise<JsonObject> {
    const scoped = this.http.withSubOrg(params);
    return this.http.get("/sso/connections", { subOrgId: scoped.subOrgId });
  }

  createConnection(body: JsonObject & SubOrgParams): Promise<JsonObject> {
    const scoped = this.http.withSubOrg(body);
    return this.http.post("/sso/connections", scoped);
  }

  getConnection(
    connectionId: string,
    params?: SubOrgParams,
  ): Promise<JsonObject> {
    const scoped = this.http.withSubOrg(params);
    return this.http.get(`/sso/connections/${connectionId}`, {
      subOrgId: scoped.subOrgId,
    });
  }

  updateConnection(
    connectionId: string,
    body: JsonObject & SubOrgParams,
  ): Promise<JsonObject> {
    const scoped = this.http.withSubOrg(body);
    return this.http.patch(`/sso/connections/${connectionId}`, scoped);
  }

  deleteConnection(
    connectionId: string,
    params?: SubOrgParams,
  ): Promise<SuccessResponse> {
    const scoped = this.http.withSubOrg(params);
    return this.http.delete(`/sso/connections/${connectionId}`, {
      subOrgId: scoped.subOrgId,
    });
  }

  testConnection(
    connectionId: string,
    params?: SubOrgParams,
  ): Promise<JsonObject> {
    const scoped = this.http.withSubOrg(params);
    return this.http.post(`/sso/connections/${connectionId}/test`, undefined, {
      subOrgId: scoped.subOrgId,
    });
  }
}

export class SocialResource {
  constructor(private readonly http: HttpClient) {}

  listProviders(params?: SubOrgParams): Promise<JsonObject> {
    const scoped = this.http.withSubOrg(params);
    return this.http.get("/social/providers", { subOrgId: scoped.subOrgId });
  }

  updateProvider(
    body: JsonObject & SubOrgParams & { provider: string; enabled: boolean },
  ): Promise<JsonObject> {
    const scoped = this.http.withSubOrg(body);
    return this.http.put("/social/providers", scoped);
  }
}

export class MfaResource {
  constructor(private readonly http: HttpClient) {}

  getPolicy(params?: SubOrgParams): Promise<JsonObject> {
    const scoped = this.http.withSubOrg(params);
    return this.http.get("/mfa/policy", { subOrgId: scoped.subOrgId });
  }

  updatePolicy(body: JsonObject & SubOrgParams): Promise<JsonObject> {
    const scoped = this.http.withSubOrg(body);
    return this.http.patch("/mfa/policy", scoped);
  }
}

export class PasskeysResource {
  constructor(private readonly http: HttpClient) {}

  listCredentials(
    params: SubOrgParams & { userId: string },
  ): Promise<JsonObject> {
    const scoped = this.http.withSubOrg(params);
    return this.http.get("/webauthn/credentials", {
      subOrgId: scoped.subOrgId,
      userId: params.userId,
    });
  }

  deleteCredential(
    credentialId: string,
    params?: SubOrgParams,
  ): Promise<SuccessResponse> {
    const scoped = this.http.withSubOrg(params);
    return this.http.delete(`/webauthn/credentials/${credentialId}`, {
      subOrgId: scoped.subOrgId,
    });
  }
}
