# External APIs

The only external integrations for the MVP are webhook notifications to communication platforms.

## Slack / Microsoft Teams API

- **Purpose:** To send real-time notifications about task status changes.
- **Documentation:** N/A (Uses standard incoming webhooks provided by Slack/Teams).
- **Base URL(s):** User-configured webhook URL.
- **Authentication:** N/A (Token is included in the webhook URL).
- **Rate Limits:** To be managed by the external platform. The application should handle potential `429 Too Many Requests` errors gracefully.
- **Key Endpoints Used:** `POST {{user_provided_webhook_url}}`
- **Integration Notes:** The `Notification Service` will be responsible for constructing and sending a simple JSON payload to the configured URL.
