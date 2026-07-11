import type { HttpClient } from "../http";
import type { JsonObject, SubOrgParams, SuccessResponse } from "../types";

export class WebhooksResource {
  constructor(private readonly http: HttpClient) {}

  list(params?: SubOrgParams): Promise<JsonObject> {
    const scoped = this.http.withSubOrg(params);
    return this.http.get("/webhooks", { subOrgId: scoped.subOrgId });
  }

  create(
    body: JsonObject & SubOrgParams & { name: string; url: string; events: string[] },
  ): Promise<JsonObject> {
    const scoped = this.http.withSubOrg(body);
    return this.http.post("/webhooks", scoped);
  }

  get(
    webhookId: string,
    params?: SubOrgParams & { deliveries?: boolean; limit?: number },
  ): Promise<JsonObject> {
    const scoped = this.http.withSubOrg(params);
    return this.http.get(`/webhooks/${webhookId}`, {
      subOrgId: scoped.subOrgId,
      deliveries: params?.deliveries,
      limit: params?.limit,
    });
  }

  update(
    webhookId: string,
    body: JsonObject & SubOrgParams,
  ): Promise<JsonObject> {
    const scoped = this.http.withSubOrg(body);
    return this.http.patch(`/webhooks/${webhookId}`, scoped);
  }

  delete(webhookId: string, params?: SubOrgParams): Promise<SuccessResponse> {
    const scoped = this.http.withSubOrg(params);
    return this.http.delete(`/webhooks/${webhookId}`, {
      subOrgId: scoped.subOrgId,
    });
  }
}
