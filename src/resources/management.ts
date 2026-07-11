import type { HttpClient } from "../http";
import type { JsonObject, SubOrgParams } from "../types";

export class RbacResource {
  constructor(private readonly http: HttpClient) {}

  listRoles(params?: SubOrgParams): Promise<JsonObject> {
    const scoped = this.http.withSubOrg(params);
    return this.http.get("/rbac/roles", { subOrgId: scoped.subOrgId });
  }

  createRole(body: JsonObject & SubOrgParams): Promise<JsonObject> {
    const scoped = this.http.withSubOrg(body);
    return this.http.post("/rbac/roles", scoped);
  }

  getRole(roleId: string, params?: SubOrgParams): Promise<JsonObject> {
    const scoped = this.http.withSubOrg(params);
    return this.http.get(`/rbac/roles/${roleId}`, { subOrgId: scoped.subOrgId });
  }

  updateRole(
    roleId: string,
    body: JsonObject & SubOrgParams,
  ): Promise<JsonObject> {
    const scoped = this.http.withSubOrg(body);
    return this.http.patch(`/rbac/roles/${roleId}`, scoped);
  }

  deleteRole(roleId: string, params?: SubOrgParams): Promise<JsonObject> {
    const scoped = this.http.withSubOrg(params);
    return this.http.delete(`/rbac/roles/${roleId}`, {
      subOrgId: scoped.subOrgId,
    });
  }

  getMemberRoles(
    membershipId: string,
    params?: SubOrgParams,
  ): Promise<JsonObject> {
    const scoped = this.http.withSubOrg(params);
    return this.http.get(`/rbac/members/${membershipId}/roles`, {
      subOrgId: scoped.subOrgId,
    });
  }

  setMemberRoles(
    membershipId: string,
    body: JsonObject & SubOrgParams,
  ): Promise<JsonObject> {
    const scoped = this.http.withSubOrg(body);
    return this.http.put(`/rbac/members/${membershipId}/roles`, scoped);
  }

  listEnvironments(params?: SubOrgParams): Promise<JsonObject> {
    const scoped = this.http.withSubOrg(params);
    return this.http.get("/environments", { subOrgId: scoped.subOrgId });
  }

  createEnvironment(
    body: JsonObject & SubOrgParams & { name: string; slug: string },
  ): Promise<JsonObject> {
    const scoped = this.http.withSubOrg(body);
    return this.http.post("/environments", scoped);
  }
}

export class AuditLogsResource {
  constructor(private readonly http: HttpClient) {}

  list(
    params?: SubOrgParams & {
      limit?: number;
      category?: string;
      export?: string;
    },
  ): Promise<JsonObject> {
    const scoped = this.http.withSubOrg(params);
    return this.http.get("/audit-logs", {
      subOrgId: scoped.subOrgId,
      limit: params?.limit,
      category: params?.category,
      export: params?.export,
    });
  }
}

export class ScimResource {
  constructor(private readonly http: HttpClient) {}

  getConfig(params?: SubOrgParams): Promise<JsonObject> {
    const scoped = this.http.withSubOrg(params);
    return this.http.get("/scim/config", { subOrgId: scoped.subOrgId });
  }

  updateConfig(body: JsonObject & SubOrgParams): Promise<JsonObject> {
    const scoped = this.http.withSubOrg(body);
    return this.http.patch("/scim/config", scoped);
  }

  rotateToken(body: JsonObject & SubOrgParams & { action: string }): Promise<JsonObject> {
    const scoped = this.http.withSubOrg(body);
    return this.http.post("/scim/config", scoped);
  }
}
