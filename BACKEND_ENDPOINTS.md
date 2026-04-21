# Smart Bear Backend API Documentation

This document provides a summary of the available API endpoints in the `smart-bear-server` backend.

## Base URL
The backend is configured to listen on PORT 7017 by default.
`http://localhost:7017` (or the configured production URL)

---

## 1. Authentication (`/api/auth`)
*Managed in AuthController.cs*

| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| POST | `/api/auth/register` | Register a new parent user. | No |
| POST | `/api/auth/login` | Login with email/password. | No |
| POST | `/api/auth/google` | Login with Google ID Token. | No |
| POST | `/api/auth/refresh` | Refresh access token using refresh token. | No |

---

## 2. Device Management (`/api/device`)
*Managed in DeviceController.cs*

| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| GET | `/api/device` | Get all bear devices owned by the authenticated user. | Yes |
| POST | `/api/device/pair` | Pair a bear device using serial number (legacy). | Yes |
| DELETE | `/api/device/unpair/{deviceId}` | Unpair a device from the account. | Yes |
| POST | `/api/device/profile/assign`| Assign an existing profile to a device. | Yes |
| POST | `/api/device/mode` | Set AI mode (Normal, Math, Bilingual). | Yes |
| POST | `/api/device/{deviceId}/protection` | Toggle hardware protection (activation lock). | Yes |
| PUT | `/api/device/profile/{profileId}` | Update child profile settings. | Yes |
| POST | `/api/device/profile/{deviceId}` | Create new profile and assign to device. | Yes |

---

## 3. Zero-Input Pairing (`/api/pairing`)
*Managed in PairingController.cs - Used for ESP32 Bear devices*

| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| POST | `/api/pairing/request` | Device requests a pairing code (via MAC addr). | No |
| POST | `/api/pairing/request_otp` | Mobile App requests bear to read OTP aloud. | No |
| POST | `/api/pairing/claim` | Claim ownership using pairing code & nickname. | Yes |

---

## 4. AI Interactions (`/api/ai`)
*Managed in AIController.cs*

| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| POST | `/api/ai/process-voice` | Process audio bytes, return text and audio URL. | No* |
| POST | `/api/ai/process-voice-openai` | Same as above but using OpenAI. | No* |
| POST | `/api/ai/chat` | Text-in / Text-out interaction. | No* |
| POST | `/api/ai/chat-stream` | SSE streaming text response (EventStream). | No* |
| GET | `/api/ai/config` | Get voice/provider config for a device. | No* |

*\* Note: These endpoints verify identity via `Device-Id` header or query param. Most require a valid device to be pre-registered.*

---

## 5. IoT Endpoints (`/api/iot`)
*Managed in IoTController.cs - Primary endpoints for the Bear hardware*

| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| POST | `/api/iot/speak` | Process text command from bear. | Device Token |
| POST | `/api/iot/voice` | Process audio file (multipart) from bear. | Device Token |
| POST | `/api/iot/music` | Resolve music requests (play/pause/search). | Device Token |
| POST | `/api/iot/story` | Resolve story requests. | Device Token |

**Required Headers for IoT:**
- `X-Device-Token`: Required for authorized access.
- `X-Serial-Number`: Used to identify the hardware.
- `X-Language`: (Optional) e.g., `vi-VN`, `en-US`.

---

## 6. Payment & Subscriptions (`/api/payment`)
*Managed in PaymentController.cs*

| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| GET | `/api/payment/plans` | List active subscription plans. | No |
| GET | `/api/payment/status` | Get current user's subscription status. | Yes |
| POST | `/api/payment/create-qr` | Create PayOS link for Premium subscription. | Yes |
| POST | `/api/payment/create-candy-qr`| Create PayOS link for Candy pack. | Yes |
| GET | `/api/payment/validate-voucher`| Check voucher validity and discount. | Yes |
| POST | `/api/payment/payos-webhook` | Webhook for PayOS payment confirmation. | No |
| PUT | `/api/payment/tts-preference` | Update preferred TTS provider (GCP/ElevenLabs).| Yes |

---

## 7. Chat History (`/api/history`)
*Managed in HistoryController.cs*

| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| GET | `/api/history/sessions/{profileId}` | Get list of chat sessions for a profile. | Yes |
| GET | `/api/history/session/{sessionId}` | Get full transcript of a specific session. | Yes |
| DELETE| `/api/history/session/{sessionId}` | Delete a session and its history. | Yes |

---

## 8. Admin Interface (`/api/admin`)
*Managed in AdminController.cs - Requires Role=1*

| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| GET | `/api/admin/stats` | Dashboard statistics and analytics. | Admin |
| GET | `/api/admin/profiles` | List all child profiles in system. | Admin |
| POST | `/api/admin/devices` | Manually create/register a device serial. | Admin |
| GET | `/api/admin/songs` | Manage song library. | Admin |
| GET | `/api/admin/stories` | Manage story library. | Admin |
| GET | `/api/admin/users` | List all system users. | Admin |
| GET/POST| `/api/admin/safety` | Manage global banned words/safety rules. | Admin |
