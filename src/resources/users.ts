import type { HttpClient } from "../http";
import type { JsonObject, OkResponse, SubOrgParams } from "../types";

export class UsersResource {
  constructor(private readonly http: HttpClient) {}

  list(params?: SubOrgParams): Promise<JsonObject> {
    const scoped = this.http.withSubOrg(params);
    return this.http.get("/users", { subOrgId: scoped.subOrgId });
  }

  create(body: JsonObject & SubOrgParams & { email: string }): Promise<JsonObject> {
    const scoped = this.http.withSubOrg(body);
    return this.http.post("/users", scoped);
  }

  bulkUpsert(body: JsonObject & SubOrgParams): Promise<JsonObject> {
    const scoped = this.http.withSubOrg(body);
    return this.http.put("/users", scoped);
  }

  update(
    userId: string,
    body: JsonObject & SubOrgParams,
  ): Promise<JsonObject> {
    const scoped = this.http.withSubOrg(body);
    return this.http.patch(`/users/${userId}`, scoped);
  }

  delete(userId: string, params?: SubOrgParams): Promise<OkResponse> {
    const scoped = this.http.withSubOrg(params);
    return this.http.delete(`/users/${userId}`, {
      subOrgId: scoped.subOrgId,
    });
  }

  assign(
    userId: string,
    body: { targetSubOrgId: string },
  ): Promise<JsonObject> {
    return this.http.post(`/users/${userId}`, body);
  }
}
