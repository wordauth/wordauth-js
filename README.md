# wordauth

Official JavaScript/TypeScript client for the [WordAuth](https://wordauth.com) API.

## Install

```bash
npm install wordauth
```

## Quick Start

```typescript
import { WordAuth } from "wordauth";

const wordauth = new WordAuth("sk_live_your_api_key");

// Generate a word pair
const { otp_id, code, expires_at } = await wordauth.generate();
console.log(`Word pair: ${code}`); // e.g. "happening holiday"

// Validate user input
const result = await wordauth.validate({ otp_id, code: userInput });
if (result.valid) {
  console.log("Verified!");
}
```

## API Reference

### `new WordAuth(apiKey)`

Create a client with an API key string.

```typescript
const wordauth = new WordAuth("sk_live_...");
```

### `new WordAuth(options)`

Create a client with an options object.

```typescript
const wordauth = new WordAuth({
  apiKey: "sk_live_...",
  baseUrl: "https://custom-api.example.com", // optional
});
```

| Option    | Type     | Required | Description                                          |
| --------- | -------- | -------- | ---------------------------------------------------- |
| `apiKey`  | `string` | Yes      | Your WordAuth API key                                |
| `baseUrl` | `string` | No       | Override the API base URL (default: `https://api.wordauth.com`) |

### `wordauth.generate(params?)`

Generate a new word pair for verification.

**Parameters:**

| Param         | Type     | Required | Description                                      |
| ------------- | -------- | -------- | ------------------------------------------------ |
| `session_id`  | `string` | No       | Associate the OTP with a caller session          |
| `ttl_seconds` | `number` | No       | Override OTP expiry in seconds (default: `300`)  |
| `email`       | `string` | No       | Send the OTP to this email address               |
| `phone`       | `string` | No       | Send the OTP to this phone number via SMS        |

**Returns:** `Promise<GenerateResponse>`

```typescript
interface GenerateResponse {
  otp_id: string;            // Unique identifier for this OTP
  code: string;              // The word pair (e.g. "happening holiday")
  session_id: string | null;
  expires_at: string;        // ISO 8601 expiration timestamp
}
```

### `wordauth.generateWithEmail(email, params?)`

Generate a word pair and deliver it to the given email address.

```typescript
const { otp_id, code } = await wordauth.generateWithEmail("user@example.com");
```

Accepts the same optional `params` as `generate()`, excluding `email`.

### `wordauth.generateWithSMS(phone, params?)`

Generate a word pair and deliver it via SMS to the given phone number.

```typescript
const { otp_id, code } = await wordauth.generateWithSMS("+15550001234");
```

Accepts the same optional `params` as `generate()`, excluding `phone`.

### `wordauth.validate(params)`

Validate a word pair against an OTP session.

**Parameters:**

| Param        | Type     | Required | Description                               |
| ------------ | -------- | -------- | ----------------------------------------- |
| `code`       | `string` | Yes      | The word pair entered by the user         |
| `otp_id`     | `string` | No       | The OTP ID returned from `generate()`     |
| `session_id` | `string` | No       | Alternative to `otp_id` for session-based validation |

**Returns:** `Promise<ValidateResponse>`

```typescript
interface ValidateResponse {
  valid: boolean;
  message?: string | null;  // Error message when valid is false
}
```

## Error Handling

All API errors throw a `WordAuthError` with `message` and `status` properties.

```typescript
import { WordAuth, WordAuthError } from "wordauth";

try {
  const result = await wordauth.generate();
} catch (err) {
  if (err instanceof WordAuthError) {
    console.error(`API error ${err.status}: ${err.message}`);
  }
}
```

| Status | Meaning               |
| ------ | --------------------- |
| `0`    | Network/client error  |
| `400`  | Bad request           |
| `403`  | Invalid API key       |
| `410`  | OTP expired           |
| `429`  | Rate limit exceeded   |
| `500`  | Server error          |

## Requirements

- Node.js 18+ (uses native `fetch`)
- Or any browser environment

## License

MIT
