import type { HttpClient } from "../http";
import type { JsonObject, SubOrgParams, SuccessResponse } from "../types";

export class SessionsResource {
  constructor(private readonly http: HttpClient) {}

  list(params?: SubOrgParams): Promise<JsonObject> {
    const scoped = this.http.withSubOrg(params);
    return this.http.get("/sessions", { subOrgId: scoped.subOrgId });
  }

  revokeAll(params: SubOrgParams & { userId: string }): Promise<SuccessResponse> {
    const scoped = this.http.withSubOrg(params);
    return this.http.delete("/sessions", {
      subOrgId: scoped.subOrgId,
      userId: params.userId,
    });
  }

  revoke(
    sessionId: string,
    params?: SubOrgParams,
  ): Promise<SuccessResponse> {
    const scoped = this.http.withSubOrg(params);
    return this.http.delete(`/sessions/${sessionId}`, {
      subOrgId: scoped.subOrgId,
    });
  }
}
