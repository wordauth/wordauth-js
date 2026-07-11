# wordauth

Official JavaScript/TypeScript client for the [WordAuth OS](https://os.wordauth.com) API.

## Install

```bash
npm install wordauth
```

## Quick Start

```typescript
import { WordAuth } from "wordauth";

const wordauth = new WordAuth({
  apiKey: "sk_live_your_api_key",
  subOrgId: "your-sub-org-id", // required for org-wide keys
});

// End-user login with OTP
const { otp_id } = await wordauth.auth.login.otp.send({
  email: "user@example.com",
});

const { session } = await wordauth.auth.login.otp.verify({
  email: "user@example.com",
  otp_id,
  code: "happening holiday",
});

console.log(session.access_token);

// Legacy OTP primitives (generate + validate word pairs)
const { otp_id: id, code } = await wordauth.otp.generate();
const result = await wordauth.otp.validate({ otp_id: id, code: userInput });
```

## Configuration

```typescript
const wordauth = new WordAuth({
  apiKey: "sk_live_...",
  baseUrl: "https://os.wordauth.com", // default
  subOrgId: "sub-org-uuid", // default for org-wide API keys
});
```

| Option      | Type     | Required | Description |
| ----------- | -------- | -------- | ----------- |
| `apiKey`    | `string` | Yes      | Your WordAuth API key |
| `baseUrl`   | `string` | No       | API root URL (default: `https://os.wordauth.com`) |
| `subOrgId`  | `string` | No       | Default sub-organization for org-wide keys |

All requests are sent to `{baseUrl}/api/v1/...`.

## Auth API

Discover enabled methods and run end-user login/signup flows.

```typescript
// List enabled auth methods for a sub-org
const { methods } = await wordauth.auth.methods({ subOrgId: "..." });

// Password login
const { session } = await wordauth.auth.login.password({
  email: "user@example.com",
  password: "secret",
});

// Magic link
await wordauth.auth.login.magicLink.send({ email: "user@example.com" });
const { session } = await wordauth.auth.login.magicLink.verify({
  email: "user@example.com",
  token_hash: "...",
});

// Passkey login
const { options, challengeId } = await wordauth.auth.login.passkey.options({
  email: "user@example.com",
});
const { session } = await wordauth.auth.login.passkey.verify({
  email: "user@example.com",
  challengeId,
  credential: webAuthnCredential,
});

// Social / SSO (returns authorization URL for browser redirect)
const { authorization_url } = await wordauth.auth.login.social.start({
  provider: "google",
  redirectUri: "https://yourapp.com/callback",
});

// Signup
const { session } = await wordauth.auth.signup.password({
  email: "new@example.com",
  password: "secret",
  openSignup: true,
});
```

Browser OAuth/SSO callbacks (`/api/v1/auth/login/social/callback`, etc.) are handled via redirect — no SDK method needed.

## OTP

Low-level word-pair OTP generation and validation, plus settings management.

```typescript
await wordauth.otp.generate({ ttl_seconds: 300 });
await wordauth.otp.generateWithEmail("user@example.com");
await wordauth.otp.generateWithSMS("+15550001234");
await wordauth.otp.validate({ otp_id, code: "red bird" });
await wordauth.otp.getSettings();
await wordauth.otp.updateSettings({ mode: "phrase", ttl_seconds: 600 });
```

## OS Management

| Resource | Property | Description |
| -------- | -------- | ----------- |
| Sessions | `wordauth.sessions` | List and revoke user sessions |
| Users | `wordauth.users` | Directory user CRUD |
| Webhooks | `wordauth.webhooks` | Webhook endpoint management |
| SSO | `wordauth.sso` | SSO connection admin |
| Social | `wordauth.social` | Social provider config |
| MFA | `wordauth.mfa` | MFA policy |
| Passkeys | `wordauth.passkeys` | WebAuthn credential admin |
| Admin portal | `wordauth.adminPortal` | Branding and domains |
| Sub-orgs | `wordauth.subOrganizations` | Sub-organization management |
| Members | `wordauth.members` | Organization member admin |
| Apps | `wordauth.organizationApps` | Enabled apps and sidebar layout |
| RBAC | `wordauth.rbac` | Roles, member roles, environments |
| Audit logs | `wordauth.auditLogs` | Audit event listing |
| SCIM | `wordauth.scim` | SCIM provisioning config |

## Backward Compatibility

Top-level `generate()`, `validate()`, `generateWithEmail()`, and `generateWithSMS()` still work but are deprecated. They now target `https://os.wordauth.com/api/v1/otp/*`.

## Error Handling

```typescript
import { WordAuth, WordAuthError } from "wordauth";

try {
  await wordauth.auth.login.password({ email, password });
} catch (err) {
  if (err instanceof WordAuthError) {
    console.error(`API error ${err.status}: ${err.message}`);
  }
}
```

## Requirements

- Node.js 18+ (uses native `fetch`)
- Or any browser environment

## License

MIT
