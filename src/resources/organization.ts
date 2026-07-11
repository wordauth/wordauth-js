import type { HttpClient } from "../http";
import type { JsonObject, SubOrgParams, SuccessResponse } from "../types";

export class AdminPortalResource {
  constructor(private readonly http: HttpClient) {}

  getOverview(params?: SubOrgParams): Promise<JsonObject> {
    const scoped = this.http.withSubOrg(params);
    return this.http.get("/admin-portal", { subOrgId: scoped.subOrgId });
  }

  update(body: JsonObject & SubOrgParams): Promise<JsonObject> {
    const scoped = this.http.withSubOrg(body);
    return this.http.patch("/admin-portal", scoped);
  }

  action(body: JsonObject & SubOrgParams & { action: string }): Promise<JsonObject> {
    const scoped = this.http.withSubOrg(body);
    return this.http.post("/admin-portal", scoped);
  }
}

export class SubOrganizationsResource {
  constructor(private readonly http: HttpClient) {}

  list(): Promise<JsonObject> {
    return this.http.get("/sub-organizations");
  }

  create(body: { name: string; slug: string; description?: string }): Promise<JsonObject> {
    return this.http.post("/sub-organizations", body);
  }

  get(subOrgId: string): Promise<JsonObject> {
    return this.http.get(`/sub-organizations/${subOrgId}`);
  }

  update(
    subOrgId: string,
    body: { name?: string; description?: string; status?: string },
  ): Promise<JsonObject> {
    return this.http.patch(`/sub-organizations/${subOrgId}`, body);
  }

  delete(subOrgId: string): Promise<SuccessResponse> {
    return this.http.delete(`/sub-organizations/${subOrgId}`);
  }

  listMembers(subOrgId: string): Promise<JsonObject> {
    return this.http.get(`/sub-organizations/${subOrgId}/members`);
  }

  replaceMembers(
    subOrgId: string,
    body: { members: unknown[] },
  ): Promise<JsonObject> {
    return this.http.put(`/sub-organizations/${subOrgId}/members`, body);
  }
}

export class MembersResource {
  constructor(private readonly http: HttpClient) {}

  list(): Promise<JsonObject> {
    return this.http.get("/members");
  }

  updateRole(
    membershipId: string,
    body: { newRole: string },
  ): Promise<JsonObject> {
    return this.http.patch(`/members/${membershipId}`, body);
  }

  remove(membershipId: string): Promise<SuccessResponse> {
    return this.http.delete(`/members/${membershipId}`);
  }
}

export class OrganizationAppsResource {
  constructor(private readonly http: HttpClient) {}

  get(params?: SubOrgParams): Promise<JsonObject> {
    const scoped = this.http.withSubOrg(params);
    return this.http.get("/organization-apps", { subOrgId: scoped.subOrgId });
  }

  update(body: JsonObject & SubOrgParams): Promise<JsonObject> {
    const scoped = this.http.withSubOrg(body);
    return this.http.put("/organization-apps", scoped);
  }
}
