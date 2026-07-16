# Aimfox Public API — Complete Endpoint Reference

> Source: [docs.aimfox.com](https://docs.aimfox.com) (API v2). Compiled 2026-07-14.
> Base URL: `https://api.aimfox.com`  ·  **69 endpoints** across 13 groups.

---

## Getting Started

### Introduction
Welcome to the Aimfox API documentation. This guide covers everything you need to integrate with our platform — whether you're automating workflows, building a custom integration, or extending your application with Aimfox's features.

### Authentication
All requests to the Aimfox API must be authenticated using an API key. API keys do not expire but can be deleted at any time.

To obtain an API key, navigate to the **Workspace Settings** tab in your Aimfox dashboard, then open the **Integrations** tab.

Once you have your key, include it in every request by adding an `Authorization` header with the value `Bearer YOUR_API_KEY`.

### Rate Limits
The Aimfox API enforces a limit of **60 requests per minute** across all endpoints. Exceeding this limit will result in a `429` HTTP status code.

### Common Errors
A frequent source of confusion is receiving a `500 Internal Server Error`. This is often caused by using a **master API key** on a route that expects a **regular API key**, or vice versa. If you encounter this error, double-check that you are using the correct key type for the endpoint you are calling.

We strive to make your integration experience as seamless as possible. If you have any questions, suggestions, or need support, feel free to reach out at **team@aimfox.com**. Happy coding!

### Key Types at a Glance

| Key type | Where it is used |
| --- | --- |
| **Master API key** | Workspace/seat/client provisioning, white-label, token generation (agency & LTD partner routes). |
| **Normal API key** | Everything scoped to a single workspace: accounts, campaigns, leads, messages, templates, webhooks, blacklist. |

Using the wrong key type on a route is the most common cause of an unexpected `500`.

---

## Endpoint Index (A–Z by group)

| # | Group | Endpoint | Method | Path | Key |
| --- | --- | --- | --- | --- | --- |
| 1 | Seats | [Assign LTD Seats](#assign-ltd-seats) | `POST` | `/api/v2/workspaces/:workspace_id/seats/lifetime` | Master |
| 2 | Seats | [Assign Agency Seats](#assign-agency-seats) | `POST` | `/api/v2/workspaces/:workspace_id/seats/agency` | Master |
| 3 | Workspaces | [Create Workspace](#create-workspace) | `POST` | `/api/v2/workspaces` | Master |
| 4 | Workspaces | [Create Workspace Token](#create-workspace-token) | `POST` | `/api/v2/workspaces/:workspace_id/tokens` | Master |
| 5 | Workspaces | [Get Workspace Tokens](#get-workspace-tokens) | `GET` | `/api/v2/workspaces/:workspace_id/tokens` | Master |
| 6 | White Label | [Generate Client Token](#generate-client-token) | `POST` | `/api/v2/clients/token` | Master |
| 7 | White Label | [Create Client](#create-client) | `POST` | `/api/v2/clients` | Normal |
| 8 | Tokens | [Generate Login Token](#generate-login-token) | `POST` | `/api/v2/token` | Normal |
| 9 | Accounts | [List Accounts](#list-accounts) | `GET` | `/api/v2/accounts` | Normal |
| 10 | Accounts | [Get Account Limits](#get-account-limits) | `GET` | `/api/v2/accounts/:account_id/limits` | Normal |
| 11 | Accounts | [Set Account Limits](#set-account-limits) | `PATCH` | `/api/v2/accounts/:account_id/limits` | Normal |
| 12 | Analytics | [List Recent Leads](#list-recent-leads) | `GET` | `/api/v2/analytics/recent-leads` | Normal |
| 13 | Analytics | [List Interactions](#list-interactions) | `GET` | `/api/v2/analytics/interactions` | Normal |
| 14 | Blacklist | [List Blacklisted Profiles](#list-blacklisted-profiles) | `GET` | `/api/v2/blacklist` | Normal |
| 15 | Blacklist | [List Blacklisted Companies](#list-blacklisted-companies) | `GET` | `/api/v2/blacklist-companies` | Normal |
| 16 | Blacklist | [Add Companies To Blacklist](#add-companies-to-blacklist) | `POST` | `/api/v2/blacklist-companies` | Normal |
| 17 | Blacklist | [Add Profile To Blacklist](#add-profile-to-blacklist) | `POST` | `/api/v2/blacklist/:urn` | Normal |
| 18 | Blacklist | [Add Profiles To Blacklist](#add-profiles-to-blacklist) | `POST` | `/api/v2/blacklist` | Normal |
| 19 | Blacklist | [Remove Profile From Blacklist](#remove-profile-from-blacklist) | `DELETE` | `/api/v2/blacklist/:urn` | Normal |
| 20 | Blacklist | [Remove Company From Blacklist](#remove-company-from-blacklist) | `DELETE` | `/api/v2/blacklist-companies/:company_urn` | Normal |
| 21 | Campaigns | [List Campaigns](#list-campaigns) | `GET` | `/api/v2/campaigns` | Normal |
| 22 | Campaigns | [Create Campaign](#create-campaign) | `POST` | `/api/v2/campaigns` | Normal |
| 23 | Campaigns | [Get Campaign](#get-campaign) | `GET` | `/api/v2/campaigns/:campaign_id` | Normal |
| 24 | Campaigns | [Get Campaign Audience](#get-campaign-audience) | `GET` | `/api/v2/campaigns/:campaign_id/audience` | Normal |
| 25 | Campaigns | [Delete Campaign](#delete-campaign) | `DELETE` | `/api/v2/campaigns/:campaign_id` | Normal |
| 26 | Campaigns | [Get Campaign Metrics](#get-campaign-metrics) | `GET` | `/api/v2/campaigns/:campaign_id/metrics` | Normal |
| 27 | Campaigns | [Add Profile to Campaign](#add-profile-to-campaign) | `POST` | `/api/v2/campaigns/:campaign_id/audience` | Normal |
| 28 | Campaigns | [Remove Profile from Campaign](#remove-profile-from-campaign) | `DELETE` | `/api/v2/campaigns/:campaign_id/audience/:urn` | Normal |
| 29 | Campaigns | [Add Profiles to Campaign With Custom Variables](#add-profiles-to-campaign-with-custom-variables) | `POST` | `/api/v2/campaigns/:campaign_id/audience/multiple` | Normal |
| 30 | Campaigns | [Update Campaign](#update-campaign) | `PATCH` | `/api/v2/campaigns/:campaign_id` | Normal |
| 31 | Campaigns › Custom Variables | [Get Campaign Custom Variables](#get-campaign-custom-variables) | `GET` | `/api/v2/campaigns/:campaign_id/custom-variables` | Normal |
| 32 | Campaigns › Custom Variables | [Get Campaign Target Custom Variables](#get-campaign-target-custom-variables) | `GET` | `/api/v2/campaigns/:campaign_id/custom-variables/:urn` | Normal |
| 33 | Campaigns › Custom Variables | [Add Custom Variables to Target](#add-custom-variables-to-target) | `POST` | `/api/v2/campaigns/:campaign_id/custom-variables` | Normal |
| 34 | Labels | [List Workspace Labels](#list-workspace-labels) | `GET` | `/api/v2/labels` | Normal |
| 35 | Labels | [Add Label To Workspace](#add-label-to-workspace) | `POST` | `/api/v2/labels` | Normal |
| 36 | Labels | [Edit Workspace Label](#edit-workspace-label) | `PATCH` | `/api/v2/labels/:label_id` | Normal |
| 37 | Labels | [Delete Workspace Label](#delete-workspace-label) | `DELETE` | `/api/v2/labels/:label_id` | Normal |
| 38 | Leads | [Get Lead Details](#get-lead-details) | `GET` | `/api/v2/leads/:lead_id` | Normal |
| 39 | Leads | [Get Lead Custom Variables](#get-lead-custom-variables) | `GET` | `/api/v2/accounts/:account_id/leads/:lead_urn/custom-variables` | Normal |
| 40 | Leads | [Add Label To Lead](#add-label-to-lead) | `POST` | `/api/v2/leads/:lead_id/labels/:label_id` | Normal |
| 41 | Leads | [Search Leads](#search-leads) | `POST` | `/api/v2/leads:search` | Normal |
| 42 | Leads | [Search Lead Facets](#search-lead-facets) | `POST` | `/api/v2/leads:search/facets/:name` | Normal |
| 43 | Leads | [Get Total Leads Count](#get-total-leads-count) | `POST` | `/api/v2/leads:search/total` | Normal |
| 44 | Leads | [Remove Label From Lead](#remove-label-from-lead) | `DELETE` | `/api/v2/leads/:lead_id/labels/:label_id` | Normal |
| 45 | Leads › Notes | [List Lead Notes](#list-lead-notes) | `GET` | `/api/v2/leads/:lead_id/notes` | Normal |
| 46 | Leads › Notes | [Create Lead Note](#create-lead-note) | `POST` | `/api/v2/leads/:lead_id/notes` | Normal |
| 47 | Leads › Notes | [Update Lead Note](#update-lead-note) | `PATCH` | `/api/v2/leads/:lead_id/notes/:note_id` | Normal |
| 48 | Leads › Notes | [Delete Lead Note](#delete-lead-note) | `DELETE` | `/api/v2/leads/:lead_id/notes/:note_id` | Normal |
| 49 | Messages | [List Conversations](#list-conversations) | `GET` | `/api/v2/conversations` | Normal |
| 50 | Messages | [Get Conversation](#get-conversation) | `GET` | `/api/v2/accounts/:account_id/conversations/:conversation_urn` | Normal |
| 51 | Messages | [Get Lead Conversation](#get-lead-conversation) | `GET` | `/api/v2/accounts/:account_id/leads/:lead_id/conversation` | Normal |
| 52 | Messages | [Start Conversation](#start-conversation) | `POST` | `/api/v2/accounts/:account_id/conversations` | Normal |
| 53 | Messages | [Start Conversation With Voice Note](#start-conversation-with-voice-note) | `POST` | `/api/v2/accounts/:account_id/conversations/send-audio` | Normal |
| 54 | Messages | [Upload File](#upload-file) | `POST` | `/api/v2/accounts/:account_id/conversations/upload-file` | Normal |
| 55 | Messages | [Send Message To Conversation](#send-message-to-conversation) | `POST` | `/api/v2/accounts/:account_id/conversations/:conversation_urn` | Normal |
| 56 | Messages | [Send Voice Note To Conversation](#send-voice-note-to-conversation) | `POST` | `/api/v2/accounts/:account_id/conversations/:conversation_urn/send-audio` | Normal |
| 57 | Messages | [Read A Conversation](#read-a-conversation) | `POST` | `/api/v2/accounts/:account_id/conversations/:conversation_urn/mark-as-read` | Normal |
| 58 | Messages | [React To Message](#react-to-message) | `POST` | `/api/v2/accounts/:account_id/conversations/:conversation_urn/messages/:message_id/react` | Normal |
| 59 | Messages | [Edit Message](#edit-message) | `PATCH` | `/api/v2/accounts/:account_id/conversations/:conversation_urn/messages/:message_id` | Normal |
| 60 | Messages | [Delete Message](#delete-message) | `DELETE` | `/api/v2/accounts/:account_id/conversations/:conversation_urn/messages/:message_id` | Normal |
| 61 | Templates | [List Templates](#list-templates) | `GET` | `/api/v2/templates` | Normal |
| 62 | Templates | [Get Template](#get-template) | `GET` | `/api/v2/templates/:template_id` | Normal |
| 63 | Templates | [Create Template](#create-template) | `POST` | `/api/v2/templates` | Normal |
| 64 | Templates | [Edit Template](#edit-template) | `PATCH` | `/api/v2/templates/:template_id` | Normal |
| 65 | Templates | [Delete Template](#delete-template) | `DELETE` | `/api/v2/templates/:template_id` | Normal |
| 66 | Webhooks | [List Webhooks](#list-webhooks) | `GET` | `/api/v2/webhooks` | Normal |
| 67 | Webhooks | [Create Webhook](#create-webhook) | `POST` | `/api/v2/webhooks` | Normal |
| 68 | Webhooks | [Edit Webhook](#edit-webhook) | `PATCH` | `/api/v2/webhooks/:webhook_id` | Normal |
| 69 | Webhooks | [Delete Webhook](#delete-webhook) | `DELETE` | `/api/v2/webhooks/:webhook_id` | Normal |

---

## Endpoint Details

## Seats

### Assign LTD Seats

```http
POST /api/v2/workspaces/:workspace_id/seats/lifetime
```

This POST request assigns lifetime seats to a specific workspace.

> ⚠️ **Warning:** This request sets the total number of seats for the workspace, it does not add to the existing count. For example, if your workspace already has 3 seats and you submit a value of 5, the workspace will be updated to 5 seats — not 8.

> ℹ️ **Note:** This route requires the Master API key.

**Path parameters**

| Name | Example |
| --- | --- |
| `workspace_id` | `6b36b919-79ab-4656-84ea-e23a9f840df9` |

**Request body** (application/json)

```json
{
	"count": 5,
	"source": "ltd"
}
```

**Response `200`**

```json
{
  "promotion": {
    "type": "ltd",
    "license_count": 4,
    "unassigned_license_count": 0,
    "subscription": null
  },
  "status": "ok",
  "workspace": {
    "id": "3f7aafe5-533b-40d4-b0c2-a7fecc237db7",
    "name": "Test",
    "app_id": "aimfox",
    "subscription": {
      "id": "1b6a3ac3-f635-4358-891c-788bfa5209a7",
      "customer_id": "AzqC4uU44KGDT8U",
      "workspace_id": "3f7aafe5-533b-40d4-b0c2-a7fecc237db7",
      "type": "user",
      "rented_count": 0,
      "pricing_id": "Basic-USD-Monthly",
      "plan_id": "Basic",
      "status": "active",
      "created_at": 1733397192,
      "updated_at": 1734606807,
      "cancelled_at": 0,
      "next_billing": 1737285192,
      "billing_amount": 0,
      "social": "",
      "tapfilliate_token": "",
  ... (truncated — see docs for the full payload)
```

---

### Assign Agency Seats

```http
POST /api/v2/workspaces/:workspace_id/seats/agency
```

This POST request assigns Agency Plan seats to a specific workspace.

> ⚠️ **Warning:** This request sets the total number of seats for the workspace, it does not add to the existing count. For example, if your workspace already has 3 seats and you submit a value of 5, the workspace will be updated to 5 seats — not 8.

> ℹ️ **Note:** This route requires the Master API key.

**Path parameters**

| Name | Example |
| --- | --- |
| `workspace_id` | `6b36b919-79ab-4656-84ea-e23a9f840df9` |

**Request body** (application/json)

```json
{
	"count": 5,
	"source": "agency"
}
```

**Response `200`**

```json
{
  "promotion": {
    "type": "agency",
    "license_count": 40,
    "unassigned_license_count": 24,
    "subscription": {
      "id": "748ef8ef-1006-424b-a6ba-33659791b94e",
      "customer_id": "99937eb3-c061-43f3-909d-94814771c764",
      "workspace_id": "",
      "type": "agency",
      "rented_count": 16,
      "pricing_id": "Agency-USD-Every-6-months",
      "plan_id": "Agency",
      "status": "active",
      "created_at": 1768842979,
      "updated_at": 1771504438,
      "cancelled_at": 0,
      "next_billing": 1787135723,
      "billing_amount": 39983,
      "social": "",
      "tapfilliate_token": "",
      "account_id": "",
      "conversion_id": "",
      "coupons": null,
      "addon_count": 0,
      "has_changes": false,
      "payment_source": null,
      "item": {
  ... (truncated — see docs for the full payload)
```

---

## Workspaces

### Create Workspace

```http
POST /api/v2/workspaces
```

This POST request is used to create a new workspace.

> ℹ️ **Note:** This route requires the Master API key.

**Request body** (application/json)

```json
{
	"name": "New Workspace"
}
```

**Response `200`**

```json
{
	"status": "ok",
	"workspace": {
		"id": "d9c538f2-9867-47db-a100-660c1b892435",
		"name": "New Workspace",
		"subscription": null,
		"rental_subscription": null,
		"licenses": [],
		"license_count": 0,
		"lifetime_license_count": 0,
		"accounts_count": 0,
		"active_license_count": 0,
		"non_renewing_license_count": 0,
		"created_at": 1767188060,
		"role": "owner",
		"permissions": [
			"campaigns_limited",
			"campaigns_full",
			"leads_full",
			"inbox_limited",
			"inbox_full",
			"templates_limited",
			"templates_full",
			"accounts_limited",
			"accounts_full",
			"members_limited",
			"members_full",
			"billing_limited",
  ... (truncated — see docs for the full payload)
```

---

### Create Workspace Token

```http
POST /api/v2/workspaces/:workspace_id/tokens
```

This POST request is used to create an API token for a specific workspace.

> ℹ️ **Note:** This route requires the Master API key.

**Path parameters**

| Name | Example |
| --- | --- |
| `workspace_id` | `6b36b919-79ab-4656-84ea-e23a9f840df9` |

**Request body** (application/json)

```json
{
	"name": "Master Token",
	"write": true
}
```

**Response `200`**

```json
{
	"status": "ok",
	"token": {
		"id": "28e3c3d9-1410-4f7b-8fab-73704c60ee2a",
		"token": "1103d1fa-9ff5-4328-ab81-67728d1df388",
		"name": "Master Token",
		"app_id": "aimfox",
		"workspace_id": "c49b6647-92fb-4bb9-b065-d960a388fde3",
		"read": true,
		"write": true,
		"created_at": 1768842316140
	}
}
```

---

### Get Workspace Tokens

```http
GET /api/v2/workspaces/:workspace_id/tokens
```

This GET request is used to return all API tokens of a specific workspace.

> ℹ️ **Note:** This route requires the Master API key.

**Path parameters**

| Name | Example |
| --- | --- |
| `workspace_id` | `6b36b919-79ab-4656-84ea-e23a9f840df9` |

**Response `200`**

```json
{
	"status": "ok",
	"tokens": [
		{
			"id": "cc12e414-f0b2-4963-a94e-035f29fcf1ee",
			"token": "5ccbb001-b249-4292-b1b5-8683a4baf119",
			"name": "User Token",
			"app_id": "aimfox",
			"workspace_id": "c49b6647-92fb-4bb9-b065-d960a388fde3",
			"read": true,
			"write": true,
			"created_at": 1768842295355
		},
		{
			"id": "28e3c3d9-1410-4f7b-8fab-73704c60ee2a",
			"token": "1103d1fa-9ff5-4328-ab81-67728d1df388",
			"name": "Master Token",
			"app_id": "aimfox",
			"workspace_id": "c49b6647-92fb-4bb9-b065-d960a388fde3",
			"read": true,
			"write": true,
			"created_at": 1768842316140
		}
	]
}
```

---

## White Label

### Generate Client Token

```http
POST /api/v2/clients/token
```

This POST request generates a login token for a client using their email address. The token can be appended to your whitelabel login URL to authenticate the client directly.

If the client does not exist, a `404` error will be returned.

**Example:** `https://your_whitelabel_url/#{{generated_token}}`

> ℹ️ **Note:** This route requires the Master API key.

**Request body** (application/json)

```json
{
    "email": "john.doe@gmail.com"
}
```

**Response `200`**

```json
{
  "client": {
    "id": "fe7365fc-3107-429a-9954-f46843d5202f",
    "chargebee_id": "fe7365fc-3107-429a-9954-f46843d5202f",
    "first_name": "John",
    "last_name": "Doe",
    "email": "john.doe@gmail.com",
    "created_at": 1768843509,
    "updated_at": 0,
    "show_questionnaire": false,
    "had_trial": false,
    "master_api_key": "",
    "whitelabel_id": "99937eb3-c061-43f3-909d-94814771c764"
  },
  "status": "ok",
  "token": "eyJhbGciOiJSUzI1NiIsInR5cCIgOiAiSldUIiwia2lkIiA6...JqH91DyAbEs74vXNV9Hw"
}
```

---

### Create Client

```http
POST /api/v2/clients
```

This POST request is used to create a new client.

> ℹ️ **Note:** This route requires a normal API key.

**Request body** (application/json)

```json
{
	"first_name": "John",
	"last_name": "Doe",
	"email": "john.doe@gmail.com",
	"skip_login_email": true
}
```

**Response `200`**

```json
{
	"status": "ok",
	"client": {
		"first_name": "John",
		"last_name": "Doe",
		"email": "john.doe@gmail.com",
		"skip_login_email": true,
		"created_at": 1768837004
	}
}
```

---

## Tokens

### Generate Login Token

```http
POST /api/v2/token
```

This POST request generates a login token that can be appended to your whitelabel login URL to authenticate a user directly.

This route can also be used to re-login an existing account by including the account ID in the request body.

**Example:** `https://lnconnect.me/#{{generated_token}}`

> ℹ️ **Note:** This route requires a normal API key.

**Request body** (application/json)

```json
{
    "account_id": "123456"
}
```

**Response `200`**

```json
{
    "status": "ok",
    "token": "eyJhl3In0.eyJleHAi4PB3AfMIUO1iQnxuEI-JOtaYT5bSBMZ6u_TidPJpEh__0AzrHgz-GE_D7YwlqR9v-_g"
}
```

---

## Accounts

### List Accounts

```http
GET /api/v2/accounts
```

This GET request retrieves all accounts of specific workspace.

> ℹ️ **Note:** This route requires a normal API key.

**Response `200`**

```json
{
    "status": "ok",
    "accounts": [
        {
            "id": 123456789,
            "urn": "ACoAADTPCXUBJO_XjHzN9LwNwU-5ilfawDBDjK0",
            "public_identifier": "john-doe-bb1869208",
            "first_name": "John",
            "last_name": "Doe",
            "full_name": "John Doe",
            "email": "johndoe@aimfox.com",
            "occupation": "Founder of Aimofox",
            "picture_url": "https://media.licdn.com/dms/image/v2/D4D03AQEn223gCmxe4g/profile-displayphoto-shrink_100_100/profile-displayphoto-shrink_100_100/0/1704067078808?e=1737590400&v=beta&t=gPAcP3yAD23daSLJd5_v_oiOe7LgFRp8TrbsiPJ0sGQ",
            "premium": false,
            "first_scraped_at": "0001-01-01T00:00:00Z",
            "last_scraped_at": "0001-01-01T00:00:00Z",
            "state": "LoggedIn",
            "sales_navigator": false,
            "workspace_id": "b179b8fc-ba3b-4785-9fe2-660974c9f4e0",
            "type": "user",
            "disabled": false,
            "license": {
                "account_id": "123456789",
                "status": "active",
                "lifetime": false,
                "expires_at": 0,
                "source": "aimfox"
            }
  ... (truncated — see docs for the full payload)
```

---

### Get Account Limits

```http
GET /api/v2/accounts/:account_id/limits
```

This GET request retrieves the interaction limits for an account.

> ℹ️ **Note:** This route requires a normal API key.

**Path parameters**

| Name | Example |
| --- | --- |
| `account_id` | `964178669` |

**Response `200`**

```json
{
  "status": "ok",
  "limit": {
    "id": "83767a62-e444-469c-adaf-e6de688003e4",
    "connect": 100,
    "email_connect": 100,
    "message_request": 100,
    "inmail": 100,
    "warmup": {
      "enabled": false
    }
  }
}
```

---

### Set Account Limits

```http
PATCH /api/v2/accounts/:account_id/limits
```

This PATCH request updates the weekly interaction limits for a specific account.

The minimum allowed value is **1** and the maximum is **1000**. For optimal results, we recommend keeping the limit between **50** and **200**.

> ℹ️ **Note:** This route requires a normal API key.

**Path parameters**

| Name | Example |
| --- | --- |
| `account_id` | `964178669` |

**Request body** (application/json)

```json
{
	"connect": 75,
	"message_request": 100,
	"inmail": 100
}
```

**Response `200`**

```json
{
  "status": "ok",
  "limit": {
    "id": 1033744867,
    "connect": 75,
    "email_connect": 100,
    "message_request": 100,
    "inmail": 100,
    "warmup": {
      "enabled": false
    }
  }
}
```

---

## Analytics

### List Recent Leads

```http
GET /api/v2/analytics/recent-leads
```

This GET request is used to retrieve recent leads of a specific workspace.

> ℹ️ **Note:** This route requires a normal API key.

**Response `200`**

```json
{
    "status": "ok",
    "leads": [
        {
            "timestamp": "2024-07-10T10:52:52.370Z",
            "campaign_id": "7918e607-d898-4ca9-814e-a09fe1727459",
            "flow_id": "e570bb95-a4b0-450b-87cd-64c09ddd811d",
            "target_id": "123456789",
            "target_urn": "ACoAADG6AZQBM0pqraAXLTTWHzSeW2YfJ7qHkCk",
            "transition": "accepted",
            "template_id": null,
            "campaign_name": "Search Campaign #5",
            "owner": "987654321",
            "target": {
                "id": "987654321",
                "urn": "ACoAADG6AZQBM0pqraAXLTTWHzSeW2YfJ7qHkCk",
                "public_identifier": "john-doe-3304911b3",
                "full_name": "John Doe",
                "occupation": "Software Developer at Aimfox",
                "picture_url": "https://cdn.constel.co/linkedin-profile/834273684.jpg",
                "location": {
                    "name": "Belgrade, Serbia",
                    "urn": "105353691"
                },
                "education": [
                    {
                        "school": {
                            "name": "Southern Federal University"
  ... (truncated — see docs for the full payload)
```

---

### List Interactions

```http
GET /api/v2/analytics/interactions
```

This GET request retrieves all interactions for a specific workspace.

By default, interactions for all accounts are returned. Use the optional `account_ids` query parameter to filter results by specific accounts.

If the optional `campaign_id` query parameter is provided, interactions will be returned only for the provided campaign.

The `from` and `to` parameters should be timestamps in milliseconds, and the `bucket` parameter controls the grouping interval. Available bucket options are `1 hour` and `1 day`.

> ℹ️ **Note:** This route requires a normal API key.

**Query parameters**

| Name | Example | Description |
| --- | --- | --- |
| `bucket` | `1 day` |  |
| `from` | `1730993349242` |  |
| `to` | `1732023225000` |  |
| `account_ids` | `["123345678"]` | OPTIONAL |
| `campaign_id` | `d1df7481-aadd-4568-8320-cbd4c2568cc9` | OPTIONAL |

**Response `200`**

```json
{
    "status": "ok",
    "count": 3,
    "buckets": [
        {
            "timestamp": 1730937600000,
            "sent_connections": 0,
            "accepted_connections": 0,
            "sent_messages": 0,
            "sent_inmails": 0,
            "replies": 0,
            "views": 0,
            "message_requests": 0,
            "sent_likes": 0,
            "sent_endorsements": 0
        },
        {
            "timestamp": 1731024000000,
            "sent_connections": 1,
            "accepted_connections": 2,
            "sent_messages": 5,
            "sent_inmails": 9,
            "replies": 0,
            "views": 11,
            "message_requests": 1,
            "sent_likes": 0,
            "sent_endorsements": 0
        },
  ... (truncated — see docs for the full payload)
```

---

## Blacklist

### List Blacklisted Profiles

```http
GET /api/v2/blacklist
```

This GET request retrieves all LinkedIn profiles that have been blacklisted in your workspace.

> ℹ️ **Note:** This route requires a normal API key.

**Response `200`**

```json
{
	"status": "ok",
	"profiles": [
		{
			"id": "445999231",
			"full_name": "John Doe",
			"public_identifier": "john-doe-1b8866177",
			"picture_url": "https://cdn.constel.co/linkedin-profile/46040103.jpg",
			"occupation": "NodeJS Developer at Aimfox",
			"urn": "ACoAAAK-hCcB6RvA71OCuRk-JHYpV6FFKIjbxpY",
			"location": {
				"name": "Serbia",
				"urn": "101855366"
			}
		}
	]
}
```

---

### List Blacklisted Companies

```http
GET /api/v2/blacklist-companies
```

This GET request retrieves all LinkedIn companies that have been blacklisted in your workspace.

> ℹ️ **Note:** This route requires a normal API key.

**Response `200`**

```json
{
    "status": "ok",
    "companies": [
        {
            "urn": "2568197",
            "name": "Company",
            "universal_name": "company",
            "logo_url": "https://cdn.constel.co/linkedin-companies/2568197.jpg",
            "description": "Company"
        }
    ]
}
```

---

### Add Companies To Blacklist

```http
POST /api/v2/blacklist-companies
```

This POST request is used to blacklist multiple LinkedIn companies.

> ℹ️ **Note:** This route requires a normal API key.

**Request body** (application/json)

```json
{
   "companies": ["https://www.linkedin.com/company/ubisoft/"]
}
```

**Response `200`**

```json
{
    "status": "ok",
    "companies": [
        {
            "urn": "2568197",
            "name": "Company",
            "description": "Company",
            "logo_url": "https://cdn.constel.co/linkedin-companies/2568197.jpg",
            "universal_name": "company"
        }
    ],
    "failed": []
}
```

---

### Add Profile To Blacklist

```http
POST /api/v2/blacklist/:urn
```

This POST request adds a LinkedIn profile to your workspace blacklist using their URN, preventing any further interactions or campaign operations from targeting that profile.

> ℹ️ **Note:** This route requires a normal API key.

**Path parameters**

| Name | Example |
| --- | --- |
| `urn` | `ACoAAAK-hCcB6RvA71OCuRk-JHYpV6FFKIjbxpY` |

**Response `200`**

```json
{
	"status": "ok"
}
```

---

### Add Profiles To Blacklist

```http
POST /api/v2/blacklist
```

This POST request adds one or more LinkedIn profiles to your workspace blacklist using their LinkedIn URLs, preventing any further interactions or campaign operations from targeting those profiles.

> ℹ️ **Note:** This route requires a normal API key.

**Request body** (application/json)

```json
{
	"urls": ["https://www.linkedin.com/in/ognjen-bjeletic-bb1869208/"]
}
```

**Response `200`**

```json
{
	"status": "ok"
}
```

---

### Remove Profile From Blacklist

```http
DELETE /api/v2/blacklist/:urn
```

This DELETE request removes a LinkedIn profile from your workspace blacklist using their URN.

> ℹ️ **Note:** This route requires a normal API key.

**Path parameters**

| Name | Example |
| --- | --- |
| `urn` | `ACoAAAK-hCcB6RvA71OCuRk-JHYpV6FFKIjbxpY` |

**Response `200`**

```json
{
	"status": "ok"
}
```

---

### Remove Company From Blacklist

```http
DELETE /api/v2/blacklist-companies/:company_urn
```

This DELETE request removes a LinkedIn company from your workspace blacklist using their URN.

> ℹ️ **Note:** This route requires a normal API key.

**Path parameters**

| Name | Example |
| --- | --- |
| `company_urn` | `2568197` |

**Response `200`**

```json
{
	"status": "ok"
}
```

---

## Campaigns

### List Campaigns

```http
GET /api/v2/campaigns
```

This GET request retrieves all campaigns in your workspace, including each campaign's details and current status.

All query parameters are optional — if omitted, all campaigns are returned.

- **outreach_type** — Filters campaigns by outreach type. Available options: `inbound`, `outbound`.
- **accepts_profiles** — Filters campaigns to only those that accept LinkedIn profile inserts. Available options: `true`, `false`.

> ℹ️ **Note:** This route requires a normal API key.

**Query parameters**

| Name | Example | Description |
| --- | --- | --- |
| `outreach_type` | `inbound` |  |
| `accepts_profiles` | `true` |  |

**Response `200`**

```json
{
    "status": "ok",
    "campaigns": [
        {
            "id": "e59d5151-fdc3-4d7c-845d-9d01f3087d92",
            "name": "Search Campaign #2",
            "state": "INIT",
            "created_at": 1712752099825,
            "target_count": 50,
            "type": "search",
            "outreach_type": "connect",
            "owners": [
                "1173158106"
            ],
            "start_date": null,
            "miner": "1173158106",
            "uses_connection_note": false,
            "labels": []
        }
    ]
}
```

---

### Create Campaign

```http
POST /api/v2/campaigns
```

This POST request creates a new Aimfox campaign.
Note that this request only creates the campaign itself — the audience, schedule, and connection flows will need to be configured separately through the Aimfox dashboard.

> ℹ️ **Note:** This route requires a normal API key.

## Request body

At minimum you must supply an `outreach_type`. Every other field below is optional and falls back to its default.

### Outreach type (required)

`outreach_type` controls how the campaign engages its targets:

| Value | What it does |
| --- | --- |
| `"connect"` | Sends connection requests (optionally with a connection note). |
| `"message"` | Messages existing 1st-degree connections directly. |
| `"inmail"` | Sends InMails to targets. |
| `"drip"` | Runs an **inbound / drip** campaign. |

> 💡 **Setting up an inbound campaign:** pass `outreach_type: "drip"`. This is currently the only `outreach_type` that enables an inbound campaign — no other value will create one.

### InMail optimization

| Field | Type | Default | Description |
| --- | --- | --- | --- |
| `inmail_optimization` | boolean | `false` | When `true`, Aimfox sends InMails in the most credit-efficient way (e.g. prioritizing Open Profile members who can be messaged for free). Most relevant for `"inmail"` and `"drip"` campaigns. |

### Exclusion settings

Optional boolean flags that keep certain profiles out of the campaign audience:

| Field | Type | Description |
| --- | --- | --- |
| `no_pfp` | boolean | When `true`, excludes targets that don't have a profile picture. |
| `exclude_active_targets` | boolean | When `true`, excludes profiles currently being targeted by another active campaign. |
| `exclude_previous_targets` | boolean | When `true`, excludes profiles you've already targeted in previous campaigns. |

## Examples

### Standard connection campaign

```json
{
  "name": "Q4 Connection Campaign",
  "type": "list",
  "outreach_type": "connect",
  "uses_connection_note": true
}
```

### Inbound (drip) campaign with InMail optimization and exclusions

```json
{
  "name": "Inbound Drip Campaign",
  "type": "list",
  "outreach_type": "drip",
  "inmail_optimization": true,
  "no_pfp": true,
  "exclude_active_targets": true,
  "exclude_previous_targets": true
}
```

**Request body** (application/json)

```json
{
    "name": "Custom list Campaign #1",
    "type": "list",
    "audience_size": 10000,
    "outreach_type": "connect",
    "account_ids": [
        "885983605"
    ]
}
```

**Response `200`**

```json
{
    "status": "ok",
    "campaign": {
        "id": "39e20796-0bdc-4b5f-b51f-51c810190e0d",
        "state": "INIT",
        "schedule": {
            "timezone": {
                "name": null,
                "offset": null
            },
            "sunday": {
                "intervals": [
                    {
                        "start": 9,
                        "end": 17
                    }
                ]
            },
            "monday": {
                "intervals": [
                    {
                        "start": 9,
                        "end": 17
                    }
                ]
            },
            "tuesday": {
                "intervals": [
  ... (truncated — see docs for the full payload)
```

---

### Get Campaign

```http
GET /api/v2/campaigns/:campaign_id
```

This GET request retrieves detailed information about a specific campaign, including its attributes, current status, and associated data.

> ℹ️ **Note:** This route requires a normal API key.

**Path parameters**

| Name | Example |
| --- | --- |
| `campaign_id` | `5c9098ed-d7df-402f-85e0-f7a635c35c86` |

**Response `200`**

```json
{
    "status": "ok",
    "campaign": {
        "id": "95850888-b5b9-477c-ae83-b915b1053a8f",
        "state": "INIT",
        "schedule": {
            "timezone": {
                "name": null,
                "offset": null
            },
            "sunday": {
                "intervals": [
                    {
                        "start": 9,
                        "end": 17
                    }
                ]
            },
            "monday": {
                "intervals": [
                    {
                        "start": 9,
                        "end": 17
                    }
                ]
            },
            "tuesday": {
                "intervals": [
  ... (truncated — see docs for the full payload)
```

---

### Get Campaign Audience

```http
GET /api/v2/campaigns/:campaign_id/audience
```

This GET request retrieves the audience of an Aimfox campaign.

> ℹ️ **Note:** This route requires a normal API key.

**Path parameters**

| Name | Example |
| --- | --- |
| `campaign_id` | `5c9098ed-d7df-402f-85e0-f7a635c35c86` |

**Response `200`**

```json
{
  "status": "ok",
  "audience": [
    {
      "id": "672548957",
      "full_name": "Justine Leadbetter",
      "public_identifier": "justine-leadbetter-6a529a169",
      "picture_url": "https://cdn.lnconnect.me/linkedin-profile/ACoAACgWSF0BwKJ2adL4S_vIylQ4I-R-CRcQunY.jpg",
      "occupation": "Head of Demand Management at WRc Group",
      "urn": "ACoAACgWSF0BwKJ2adL4S_vIylQ4I-R-CRcQunY",
      "location": {
        "name": "Swindon, England, United Kingdom",
        "urn": "104595308"
      },
      "company": "WRc Group",
      "state": "init"
    }
  ]
}
```

---

### Delete Campaign

```http
DELETE /api/v2/campaigns/:campaign_id
```

This DELETE request permanently deletes a specific campaign from your workspace.

> ℹ️ **Note:** This route requires a normal API key.

**Path parameters**

| Name | Example |
| --- | --- |
| `campaign_id` | `5c9098ed-d7df-402f-85e0-f7a635c35c86` |

**Response `200`**

```json
{
    "status": "ok"
}
```

---

### Get Campaign Metrics

```http
GET /api/v2/campaigns/:campaign_id/metrics
```

This GET request retrieves the interaction metrics for a specific campaign.

> ℹ️ **Note:** This route requires a normal API key.

**Path parameters**

| Name | Example |
| --- | --- |
| `campaign_id` | `5c9098ed-d7df-402f-85e0-f7a635c35c86` |

**Response `200`**

```json
{
  "status": "ok",
  "metrics": {
    "sent_connections": 108,
    "accepted_connections": 57,
    "sent_messages": 0,
    "replies": 0,
    "inmail_replies": 0,
    "sent_inmails": 0,
    "message_requests": 0,
    "sent_endorsements": 0,
    "views": 109,
    "sent_likes": 0
  }
}
```

---

### Add Profile to Campaign

```http
POST /api/v2/campaigns/:campaign_id/audience
```

This POST request adds a specific LinkedIn profile to an Aimfox campaign using their LinkedIn URL.

> ℹ️ **Note:** This route requires a normal API key.

- **Applicable campaign states:** `ACTIVE`, `PAUSED`, `DONE`, `CREATED`
- **Unsupported campaign types:** `GROUP MESSAGE`, `EVENT MESSAGE`

**Possible error messages:**
```
{
  "blocked": "The Target is Blocked",
  "locked": "The Target is Locked in another Campaign",
  "miningFailed": "The Target was not found",
  "noPFP": "The Target has no Profile Picture",
  "alreadyConnected": "The Target is already a lead",
  "notLead": "The Target is not a lead",
  "closed": "The target cannot receive free InMails",
}
```

**Path parameters**

| Name | Example |
| --- | --- |
| `campaign_id` | `5c9098ed-d7df-402f-85e0-f7a635c35c86` |

**Request body** (application/json)

```json
{
	"profile_url": "https://www.linkedin.com/in/ognjen-bjeletic-bb1869208/"
}
```

**Response `200`**

```json
{
	"status": "ok"
}
```

**Response `400`**

```json
{
	"status": "fail",
	"error": {
		"code": 400,
		"message": "The Target is Locked",
		"type": "Bad Request",
		"data": "locked"
	}
}
```

---

### Remove Profile from Campaign

```http
DELETE /api/v2/campaigns/:campaign_id/audience/:urn
```

This DELETE request removes a specific profile from an Aimfox campaign using their URN or Public Identifier.

The Public Identifier can be extracted from the profile's LinkedIn URL:

`https://www.linkedin.com/in/ognjen-bjeletic-bb1869208/` → `ognjen-bjeletic-bb1869208`

> ℹ️ **Note:** This route requires a normal API key.

**Path parameters**

| Name | Example |
| --- | --- |
| `campaign_id` | `5c9098ed-d7df-402f-85e0-f7a635c35c86` |
| `urn` | `ACoAAAK-hCcB6RvA71OCuRk-JHYpV6FFKIjbxpY` |

**Response `200`**

```json
{
	"status": "ok"
}
```

---

### Add Profiles to Campaign With Custom Variables

```http
POST /api/v2/campaigns/:campaign_id/audience/multiple
```

This POST request adds multiple LinkedIn profiles to an Aimfox campaign along with their custom variables, using each profile's LinkedIn URL.

- **Applicable campaign states:** `ACTIVE`, `PAUSED`, `DONE`, `CREATED`

> ℹ️ **Note:** This route requires a normal API key.

**Path parameters**

| Name | Example |
| --- | --- |
| `campaign_id` | `5c9098ed-d7df-402f-85e0-f7a635c35c86` |

**Request body** (application/json)

```json
{
    "type": "profile_url",
    "profiles": [
        {
            "profile_url": "https://www.linkedin.com/in/john-doe/",
            "custom_variables": {
                "first name": "John",
                "last name": "Doe"
            }
        }
    ]
}
```

**Response `200`**

```json
{
    "status": "ok",
    "profiles": [
        {
            "id": "583654275",
            "full_name": "John Doe",
            "public_identifier": "john-doe",
            "picture_url": "https://cdn.constel.co/linkedin-profile/no-image.svg",
            "occupation": "HR Manager at Company d.o.o.",
            "urn": "ACoAACLJ24MBzmiDMnvfLfdTJgMutVzE2bTVppk",
            "location": {
                "name": "Serbia",
                "urn": "101855366"
            },
            "state": "init"
        }
    ],
    "failed": [
        {
            "profile_url": "https://www.linkedin.com/in/jane-doe",
            "custom_variables": {
                "first name": "Jane",
                "last name": "Doe"
            }
        }
    ],
    "failedReason": {
        "jane-doe": "alreadyConnected"
  ... (truncated — see docs for the full payload)
```

---

### Update Campaign

```http
PATCH /api/v2/campaigns/:campaign_id
```

This PATCH request updates the details of a specific campaign.

- **Available campaign states:** `ACTIVE`, `PAUSED`

> ℹ️ **Note:** This route requires a normal API key.

**Path parameters**

| Name | Example |
| --- | --- |
| `campaign_id` | `5c9098ed-d7df-402f-85e0-f7a635c35c86` |

**Request body** (application/json)

```json
{
		"name": "Search Campaign #3",
		"state": "PAUSED",
		"target_count": 50,
		"exclude_active_targets": false,
		"exclude_previous_targets": true
}
```

**Response `200`**

```json
{
	"status": "ok",
	"campaign": {
		"id": "95850888-b5b9-477c-ae83-b915b1053a8f",
		"state": "PAUSED",
		"schedule": {
			"timezone": {
				"name": null,
				"offset": null
			},
			"sunday": {
				"intervals": [
					{
						"start": 9,
						"end": 17
					}
				]
			},
			"monday": {
				"intervals": [
					{
						"start": 9,
						"end": 17
					}
				]
			},
			"tuesday": {
				"intervals": [
  ... (truncated — see docs for the full payload)
```

---

### Campaigns › Custom Variables

### Get Campaign Custom Variables

```http
GET /api/v2/campaigns/:campaign_id/custom-variables
```

This GET request retrieves all custom variables associated with a specific campaign.

> ℹ️ **Note:** This route requires a normal API key.

**Path parameters**

| Name | Example |
| --- | --- |
| `campaign_id` | `5c9098ed-d7df-402f-85e0-f7a635c35c86` |

**Headers**

- `User-Agent: insomnia/12.2.0`

**Response `200`**

```json
{
    "status": "ok",
    "custom_variable_keys": [
        "FIRST_NAME",
        "FULL_NAME",
        "LAST_NAME",
        "GENERATED_MESSAGE"
    ],
    "custom_variables": [
        {
            "target_urn": "ACoAAALFnSUBDfSrz2kO3C8PelRi1DHIPNWuOlo",
            "variables": {
                "FIRST_NAME": "John",
                "FULL_NAME": "John Doe",
                "LAST_NAME": "Doe",
                "GENERATED_MESSAGE": "Hey there"
            }
        }
    ]
}
```

---

### Get Campaign Target Custom Variables

```http
GET /api/v2/campaigns/:campaign_id/custom-variables/:urn
```

This GET request retrieves all custom variables associated with a specific target within an Aimfox campaign.

> ℹ️ **Note:** This route requires a normal API key.

**Path parameters**

| Name | Example |
| --- | --- |
| `campaign_id` | `5c9098ed-d7df-402f-85e0-f7a635c35c86` |
| `urn` | `ACoAAAK-hCcB6RvA71OCuRk-JHYpV6FFKIjbxpY` |

**Headers**

- `User-Agent: insomnia/12.2.0`

**Response `200`**

```json
{
    "status": "ok",
    "custom_variable_keys": [
        "FIRST_NAME",
        "LAST_NAME",
        "FULL_NAME",
        "CUSTOM_MESSAGE",
        "GENERATED_MESSAGE"
    ],
    "custom_variables": {
        "target_urn": "ACoAAALFnSUBDfSrz2kO3C8PelRi1DHIPNWuOlo",
        "variables": {
            "CUSTOM_MESSAGE": "Hello there"
        }
    }
}
```

---

### Add Custom Variables to Target

```http
POST /api/v2/campaigns/:campaign_id/custom-variables
```

This POST request adds custom variables to a specific target within an Aimfox campaign.

> ℹ️ **Note:** This route requires a normal API key.

**Path parameters**

| Name | Example |
| --- | --- |
| `campaign_id` | `5c9098ed-d7df-402f-85e0-f7a635c35c86` |

**Headers**

- `User-Agent: insomnia/12.2.0`

**Request body** (application/json)

```json
{
    "custom_variables": [
        {
            "target_urn": "ACoAAALFnSUBDfSrz2kO3C8PelRi1DHIPNWuOlo",
            "variables": {
                "CUSTOM_MESSAGE": "Hello there"
            }
        }
    ]
}
```

**Response `200`**

```json
{
    "status": "ok",
    "response": [
        {
            "custom_variable_keys": [
                "CUSTOM_MESSAGE"
            ],
            "custom_variables": {
                "target_urn": "ACoAAALFnSUBDfSrz2kO3C8PelRi1DHIPNWuOlo",
                "variables": {
                    "CUSTOM_MESSAGE": "Hello there"
                }
            }
        }
    ]
}
```

---

## Labels

### List Workspace Labels

```http
GET /api/v2/labels
```

This GET request retrieves all labels associated with your workspace.

> ℹ️ **Note:** This route requires a normal API key.

**Response `200`**

```json
{
	"status": "ok",
	"labels": [
		{
			"id": "83b3aa1d-cda0-42b3-845c-afccf1192dc5",
			"agency_id": "aimfox",
			"name": "Aimfox Label",
			"color": "info",
			"count": 1
		}
	]
}
```

---

### Add Label To Workspace

```http
POST /api/v2/labels
```

This POST request adds a new label to your workspace.

> ℹ️ **Note:** This route requires a normal API key.

The following color options are available:

- `quaternary` — Light gray
- `secondary` — Light purple
- `danger` — Light red
- `yellow` — Light yellow
- `info` — Light blue
- `success` — Light green

**Request body** (application/json)

```json
{
    "name": "test3",
    "color": "info"
}
```

**Response `201`**

```json
{
	"status": "ok",
	"label": {
		"id": "3cc1752e-6f99-4b7c-9c01-70c9deb58ee5",
		"agency_id": "aimfox",
		"name": "Aimfox Label",
		"color": "info"
	}
}
```

---

### Edit Workspace Label

```http
PATCH /api/v2/labels/:label_id
```

This PATCH request updates an existing label in your workspace.

> ℹ️ **Note:** This route requires a normal API key.

**Path parameters**

| Name | Example |
| --- | --- |
| `label_id` | `83b3aa1d-cda0-42b3-845c-afccf1192dc5` |

**Request body** (application/json)

```json
{
    "name": "test23",
    "color": "info"
}
```

**Response `200`**

```json
{
	"status": "ok",
	"label": {
		"id": "88fb4384-8448-4721-915c-afa6353eaf5f",
		"agency_id": "aimfox",
		"name": "Label",
		"color": "info"
	}
}
```

---

### Delete Workspace Label

```http
DELETE /api/v2/labels/:label_id
```

This DELETE request removes a specific label from your workspace.

> ℹ️ **Note:** This route requires a normal API key.

**Path parameters**

| Name | Example |
| --- | --- |
| `label_id` | `83b3aa1d-cda0-42b3-845c-afccf1192dc5` |

**Response `200`**

```json
{
	"status": "ok"
}
```

---

## Leads

### Get Lead Details

```http
GET /api/v2/leads/:lead_id
```

This GET request retrieves all data associated with a specific lead.

> ℹ️ **Note:** This route requires a normal API key.

**Path parameters**

| Name | Example |
| --- | --- |
| `lead_id` | `1113575872` |

**Response `200`**

```json
{
    "status": "ok",
    "lead": {
        "id": "1113575872",
        "urn": "ACoAAEJf0cEB1xJUsEqzamNA07--LN7lnZHDdbk",
        "public_identifier": "john-doe-12",
        "first_name": "John",
        "last_name": "Doe",
        "full_name": "John Doe",
        "industry_urn": "80",
        "occupation": "Software developer at Aimfox",
        "picture_url": "https://cdn.constel.co/linkedin-profile/46040103.jpg",
        "location": {
            "name": "Serbia",
            "urn": "105353691"
        },
        "work_experience": [
            {
                "company": {
                    "urn": "79648041",
                    "name": "Aimfox",
                    "universal_name": "Aimfox",
                    "logo_url": "https://media.licdn.com/dms/image/C4E0BAQHONUbSTwyvgg/company-logo_100_100/0/1630617287527?e=1730937600&v=beta&t=VjmgSijMRVb1CKMz2ZCqqE6KQQe3wv2wJ3s5dhsSLM8"
                },
                "job_title": "Software developer",
                "employment_type": {
                    "urn": "12",
                    "name": "Full-time"
  ... (truncated — see docs for the full payload)
```

---

### Get Lead Custom Variables

```http
GET /api/v2/accounts/:account_id/leads/:lead_urn/custom-variables
```

This GET request retrieves all custom variables associated with a specific lead.

> ℹ️ **Note:** This route requires a normal API key.

**Path parameters**

| Name | Example |
| --- | --- |
| `account_id` | `964178669` |
| `lead_urn` | `ACoAAEJf0cEB1xJUsEqzamNA07--LN7lnZHDdbk` |

**Response `200`**

```json
{
    "status": "ok",
    "campaign_id": "30909f96-2e73-4705-9a5c-e58a4b8ace04",
    "flow_id": "10124ac0-b925-452d-b0f4-772b80566766",
    "state": "done",
    "custom_variable_keys": [
        "first_name",
        "last_name"
    ],
    "custom_variables": {
        "first_name": "Jane",
        "last_name": "Doe"
    }
}
```

---

### Add Label To Lead

```http
POST /api/v2/leads/:lead_id/labels/:label_id
```

This POST request adds a label to a specific lead.

> ℹ️ **Note:** This route requires a normal API key.

**Path parameters**

| Name | Example |
| --- | --- |
| `lead_id` | `1113575872` |
| `label_id` | `83b3aa1d-cda0-42b3-845c-afccf1192dc5` |

**Response `201`**

```json
{
	"status": "ok"
}
```

---

### Search Leads

```http
POST /api/v2/leads:search
```

This POST request searches through all leads in your workspace.

> ℹ️ **Note:** This route requires a normal API key.

**Path parameters**

| Name | Example |
| --- | --- |
| `search` | `` |

**Query parameters**

| Name | Example | Description |
| --- | --- | --- |
| `start` | `0` |  |
| `count` | `20` |  |

**Request body** (application/json)

```json
{
	"keywords": "",
	"current_companies": [],
	"past_companies": [],
	"education": [],
	"interests": [],
	"labels": [],
	"languages": [],
	"locations": [],
	"origins": [],
	"skills": [],
	"lead_of": [],
	"optimize": false
}
```

**Response `200`**

```json
{
    "status": "ok",
    "leads": [
        {
            "id": "17236432",
            "is_lead": true,
            "lead_of": [
                "1033744867"
            ],
            "origins": [
                {
                    "id": "47fc52d2-b5b8-4169-aca6-fef9abac46f9",
                    "name": "Search Campaign #5"
                }
            ],
            "notes": [],
            "labels": [
                {
                    "id": "8d6aa0ac-8770-4c9d-9e6f-7d204869158c",
                    "group_id": "1033744867",
                    "agency_id": "3tOl2PMDbssl0iDmm9jQAeoj7O8nnoJl@clients",
                    "name": "Tag",
                    "color": "quaternary"
                }
            ],
            "favorite": false,
            "urn": "ACoAAAEHAdAByqCE04BW88_6Pq0ilIl-awllmf0",
            "public_identifier": "john-doe",
  ... (truncated — see docs for the full payload)
```

---

### Search Lead Facets

```http
POST /api/v2/leads:search/facets/:name
```

This POST request searches through all lead facets in your workspace.

> ℹ️ **Note:** This route requires a normal API key.

- **Available facet names:** `lead_of`, `origins`, `current_companies`, `past_companies`, `locations`, `labels`, `interests`, `skills`, `languages`

**Path parameters**

| Name | Example |
| --- | --- |
| `search` | `` |
| `name` | `` |

**Request body** (application/json)

```json
{
	"keywords": "",
	"current_companies": [],
	"past_companies": [],
	"education": [],
	"interests": [],
	"labels": [],
	"languages": [],
	"locations": [],
	"origins": [],
	"skills": [],
	"lead_of": [],
	"optimize": false
}
```

**Response `200`**

```json
{
  "status": "ok",
  "lead_of": [
    {
      "id": "1033744867",
      "name": "1033744867",
      "target_count": 2142
    },
    {
      "id": "1173158106",
      "name": "1173158106",
      "target_count": 851
    }
  ]
}
```

---

### Get Total Leads Count

```http
POST /api/v2/leads:search/total
```

This POST request retrieves the total count of leads matching the provided filters.

> ℹ️ **Note:** This route requires a normal API key.

**Path parameters**

| Name | Example |
| --- | --- |
| `search` | `` |

**Request body** (application/json)

```json
{
	"keywords": "",
	"current_companies": [],
	"past_companies": [],
	"education": [],
	"interests": [],
	"labels": [],
	"languages": [],
	"locations": [],
	"origins": [],
	"skills": [],
	"lead_of": [],
	"optimize": false
}
```

**Response `200`**

```json
{
    "status": "ok",
    "total_leads": 7202,
    "sync": false,
    "accounts_sync": {
        "885983605": false,
        "1222885447": false
    }
}
```

---

### Remove Label From Lead

```http
DELETE /api/v2/leads/:lead_id/labels/:label_id
```

This DELETE request removes a label from a specific lead.

> ℹ️ **Note:** This route requires a normal API key.

**Path parameters**

| Name | Example |
| --- | --- |
| `lead_id` | `1113575872` |
| `label_id` | `83b3aa1d-cda0-42b3-845c-afccf1192dc5` |

**Response `200`**

```json
{
	"status": "ok"
}
```

---

### Leads › Notes

### List Lead Notes

```http
GET /api/v2/leads/:lead_id/notes
```

This GET request retrieves all notes associated with a specific lead.

> ℹ️ **Note:** This route requires a normal API key.

**Path parameters**

| Name | Example |
| --- | --- |
| `lead_id` | `1113575872` |

**Response `200`**

```json
{
	"status": "ok",
	"notes": [
		{
			"id": "48ae319e-e276-4492-bacd-2eb064230c97",
			"text": "get notes",
			"created_at": "2024-11-14T16:19:40.781Z"
    	}
	]
}
```

---

### Create Lead Note

```http
POST /api/v2/leads/:lead_id/notes
```

This POST request adds a note to a specific lead.

> ℹ️ **Note:** This route requires a normal API key.

**Path parameters**

| Name | Example |
| --- | --- |
| `lead_id` | `1113575872` |

**Request body** (application/json)

```json
{
    "text": "add note"
}
```

**Response `201`**

```json
{
	"status": "ok",
	"note": {
		"id": "e39610c4-f5bd-4e0f-986b-7e5b840bf332",
		"text": "create note",
		"created_at": "2024-11-18T14:38:58.936Z"
	}
}
```

---

### Update Lead Note

```http
PATCH /api/v2/leads/:lead_id/notes/:note_id
```

This PATCH request updates a specific note associated with a lead.

> ℹ️ **Note:** This route requires a normal API key.

**Path parameters**

| Name | Example |
| --- | --- |
| `lead_id` | `1113575872` |
| `note_id` | `48ae319e-e276-4492-bacd-2eb064230c97` |

**Request body** (application/json)

```json
{
    "text": "add note test 2"
}
```

**Response `200`**

```json
{
	"status": "ok",
	"note": {
		"id": "e39610c4-f5bd-4e0f-986b-7e5b840bf332",
		"text": "edit note",
		"created_at": "2024-11-18T14:38:58.936Z"
	}
}
```

---

### Delete Lead Note

```http
DELETE /api/v2/leads/:lead_id/notes/:note_id
```

This DELETE request removes a specific note from a lead.

> ℹ️ **Note:** This route requires a normal API key.

**Path parameters**

| Name | Example |
| --- | --- |
| `lead_id` | `1113575872` |
| `note_id` | `48ae319e-e276-4492-bacd-2eb064230c97` |

**Response `200`**

```json
{
	"status": "ok"
}
```

---

## Messages

### List Conversations

```http
GET /api/v2/conversations
```

This GET request retrieves all conversations associated with your workspace.

> ℹ️ **Note:** This route requires a normal API key.

**Query Parameters**
- **in_app** — Overrides the workspace privacy setting. When set to `true`, only Aimfox campaign conversations are returned. When set to `false`, all conversations are returned.
- **before** — Used for pagination. Returns conversations before the provided timestamp. The value should be in milliseconds.
- **unread** — When set to `true`, only unread conversations are returned.

**Query parameters**

| Name | Example | Description |
| --- | --- | --- |
| `in_app` | `true` |  |
| `before` | `1748945687000` |  |
| `campaigns` | `["da858e34-0b21-40a1-9099-52fd10221802"]` | OPTIONAL |
| `unread` | `true` | OPTIONAL |

**Response `200`**

```json
{
    "status": "ok",
    "conversations": [
        {
            "unread_count": 3,
            "connected": false,
            "last_activity_at": "2025-10-30T02:43:27.708Z",
            "conversation_urn": "2-MTYzYWZjNmMtNGU5MS00ODZkLWEwZDItNDIyMTEwZjVkYzQxXzEwMA==",
            "last_message": {
                "urn": "2-MTc2MTc5MjIwNzcwOGI4NDU3MS0xMDAmMTYzYWZjNmMtNGU5MS00ODZkLWEwZDItNDIyMTEwZjVkYzQxXzEwMA==",
                "conversation_urn": "2-MTYzYWZjNmMtNGU5MS00ODZkLWEwZDItNDIyMTEwZjVkYzQxXzEwMA==",
                "created_at": 1761792207708,
                "subject": null,
                "body": "I am in my career mode of choice at the moment, good looking out, thank you ",
                "deleted": false,
                "edited": false,
                "declined": false,
                "sender": {
                    "id": "122979512",
                    "full_name": "John Doe"
                },
                "gif": null,
                "links": [],
                "updated_at": "2025-10-30T02:43:30.035Z",
                "inmail": false,
                "audio": null
            },
            "participants": [
  ... (truncated — see docs for the full payload)
```

---

### Get Conversation

```http
GET /api/v2/accounts/:account_id/conversations/:conversation_urn
```

This GET request retrieves the details of a specific conversation using the conversation URN.

> ℹ️ **Note:** This route requires a normal API key.

**Path parameters**

| Name | Example |
| --- | --- |
| `account_id` | `964178669` |
| `conversation_urn` | `2-MTYzYWZjNmMtNGU5MS00ODZkLWEwZDItNDIyMTEwZjVkYzQxXzEwMA==` |

**Response `200`**

```json
{
	"status": "ok",
	"messages": [
		{
			"urn": "2-MTczMTgzNzQyMTM4OGI1NzMzNC0wMDMmNDU5NGMxYzgtZGIyMi00Yzc4LWFjNTYtOWIyNDdmMzI4MmQwXzAxMg==",
			"type": "MEMBER_TO_MEMBER",
			"subject": null,
			"body": "Hi, have a nice weekend, how are you doing today?",
			"sender": {
				"id": "987654321",
				"full_name": "John Doe"
			},
			"created_at": 1731837421707
		}
	]
}
```

---

### Get Lead Conversation

```http
GET /api/v2/accounts/:account_id/leads/:lead_id/conversation
```

This GET request retrieves the conversation URN for a conversation with a specific lead.

> ℹ️ **Note:** This route requires a normal API key.

**Path parameters**

| Name | Example |
| --- | --- |
| `account_id` | `964178669` |
| `lead_id` | `1113575872` |

**Response `200`**

```json
{
	"status": "ok",
	"conversation_urn": "2-ODk4OGVjNTUtYjczOS00NGNhLTlmMTctMTJjNWI0YThiN2M4XzAxMw=="
}
```

**Response `400`**

```json
{
	"status": "fail",
	"error": {
		"code": 400,
		"message": "\"params.lead_id\" must be a number",
		"type": "Bad Request",
		"data": "ValidationError"
	}
}
```

---

### Start Conversation

```http
POST /api/v2/accounts/:account_id/conversations
```

This POST request starts a new conversation with an account or group and sends an initial message.

If a conversation with the specified recipient already exists, the message will be sent to that existing conversation instead.

> ⚠️ **Disclaimer:** Adding multiple recipients does not send individual messages to each recipient. Instead, a group conversation is created with all recipients and the message is sent to the group.

> ℹ️ **Note:** This route requires a normal API key.

> ℹ️ **Note:** Either `message` or `file_identifiers` (non-empty) must be provided.

Available body options:
```json
{
	"message": "Example Message",
	"recipients": ["account_id"],
	"file_identifiers": ["c3e15d9d-44ec-496d-80b5-d30807809133"]
}
```
```json
{
	"message": "Example Message",
	"recipient_urns": ["account_urn"],
	"file_identifiers": ["c3e15d9d-44ec-496d-80b5-d30807809133"]
}
```

**Body fields:**

| Field | Required | Description |
|-------|----------|-------------|
| `message` | Conditional | The text content of the message. Either `message` or `file_identifiers` must be provided. |
| `recipients` | Conditional | Array of account IDs. Use either `recipients` or `recipient_urns`. |
| `recipient_urns` | Conditional | Array of account URNs. Use either `recipients` or `recipient_urns`. |
| `file_identifiers` | Optional | IDs returned by the `/upload-file` endpoint. Attach one or more previously uploaded files to the message. Either `file_identifiers` (non-empty) or `message` must be provided. |

**Path parameters**

| Name | Example |
| --- | --- |
| `account_id` | `964178669` |

**Request body** (application/json)

```json
{
	"message": "test",
	"recipients": ["1113575873"]
}
```

**Response `200`**

```json
{
	"conversation_urn": "2-ODk4OGVjNTUtYjczOS00NGNhLTlmMTctMTJjNWI0YThiN2M4XzAxMw==",
	"created_at": 1731935868773,
	"message_urn": "2-MTczMTkzNTg2ODMwNGI3MjA1OC0wMDQmODk4OGVjNTUtYjczOS00NGNhLTlmMTctMTJjNWI0YThiN2M4XzAxMw==",
	"status": "ok"
}
```

**Response `400`**

```json
{
	"status": "fail",
	"error": {
		"code": 400,
		"message": "\"body\" does not match any of the allowed types",
		"type": "Bad Request",
		"data": "ValidationError"
	}
}
```

---

### Start Conversation With Voice Note

```http
POST /api/v2/accounts/:account_id/conversations/send-audio
```

This POST request starts a new conversation and sends a voice note as the initial message.

> ℹ️ **Note:** This route requires a normal API key.

> ℹ️ **Note:** Voice notes are not supported in Sales Navigator conversations.

Available body options:
```multipart/form-data
{
	"file": "<binary>",
	"file_name": "voice.mp4",
	"recipients": ["1113575873"]
}
```
```multipart/form-data
{
	"file": "<binary>",
	"file_name": "voice.mp4",
	"recipient_urns": ["ACoAADTPCXUBJO_XjHzN9LwNwU-5ilfawDBDjK0"]
}
```

**Body fields:**

| Field | Required | Description |
|-------|----------|-------------|
| `file` | Required | The audio file as a binary Blob. |
| `file_name` | Required | The file name including extension (e.g. `"voice.mp4"`). |
| `recipients` | Conditional | Array of account IDs. Use either `recipients` or `recipient_urns`. |
| `recipient_urns` | Conditional | Array of account URNs. Use either `recipients` or `recipient_urns`. |

**Path parameters**

| Name | Example |
| --- | --- |
| `account_id` | `964178669` |

**Request body** (multipart/form-data)

```json
[
  {
    "name": "file",
    "value": "",
    "description": "",
    "disabled": false,
    "type": "file"
  },
  {
    "name": "file_name",
    "value": "note.mp3",
    "description": "",
    "disabled": false
  },
  {
    "name": "recipients",
    "value": "1113575873",
    "description": "",
    "disabled": false
  }
]
```

**Response `200`**

```json
{
	"conversation_urn": "2-ODk4OGVjNTUtYjczOS00NGNhLTlmMTctMTJjNWI0YThiN2M4XzAxMw==",
	"created_at": 1731935868773,
	"message_urn": "2-MTczMTkzNTg2ODMwNGI3MjA1OC0wMDQmODk4OGVjNTUtYjczOS00NGNhLTlmMTctMTJjNWI0YThiN2M4XzAxMw==",
	"status": "ok"
}
```

---

### Upload File

```http
POST /api/v2/accounts/:account_id/conversations/upload-file
```

This POST request uploads a file and returns a `file_identifier` that can be included in a subsequent message request via `file_identifiers[]`.

> ℹ️ **Note:** This route requires a normal API key.

> ℹ️ **Note:** The `file_identifier` is single-use — include it in the `file_identifiers` array when sending a message via `POST /accounts/:account_id/conversations` or `POST /accounts/:account_id/conversations/:conversation_urn`.

**Request body (multipart/form-data):**

| Field | Required | Description |
|-------|----------|-------------|
| `file` | Required | The file to upload as a binary Blob. |
| `file_name` | Required | The original file name including extension (e.g. `"report.pdf"`). |

**Path parameters**

| Name | Example |
| --- | --- |
| `account_id` | `964178669` |

**Request body** (multipart/form-data)

```json
[
  {
    "name": "file",
    "value": "",
    "description": "",
    "disabled": false,
    "type": "file"
  },
  {
    "name": "file_name",
    "value": "report.pdf",
    "description": "",
    "disabled": false
  }
]
```

**Response `200`**

```json
{
	"file_identifier": "c3e15d9d-44ec-496d-80b5-d30807809133",
	"file_input": {
		"originalname": "report.pdf",
		"encoding": "7bit",
		"mimetype": "application/pdf",
		"size": 204800
	},
	"status": "ok"
}
```

**Response `415`**

```json
{
	"status": "fail",
	"error": {
		"code": 415,
		"message": "application/x-executable",
		"type": "Unsupported Media Type"
	}
}
```

---

### Send Message To Conversation

```http
POST /api/v2/accounts/:account_id/conversations/:conversation_urn
```

This POST request sends a message to an existing conversation.

> ℹ️ **Note:** This route requires a normal API key.

> ℹ️ **Note:** Either `message` or `file_identifiers` (non-empty) must be provided.

Available body options:
```json
{
  "message": "See attachment",
  "file_identifiers": ["c3e15d9d-44ec-496d-80b5-d30807809133"]
}
```

**Body fields:**

| Field | Required | Description |
|-------|----------|-------------|
| `message` | Conditional | The text content of the message. Either `message` or `file_identifiers` must be provided. |
| `file_identifiers` | Optional | IDs returned by the `/upload-file` endpoint. Attach one or more previously uploaded files to the message. Either `file_identifiers` (non-empty) or `message` must be provided. |

**Path parameters**

| Name | Example |
| --- | --- |
| `account_id` | `964178669` |
| `conversation_urn` | `2-MTYzYWZjNmMtNGU5MS00ODZkLWEwZDItNDIyMTEwZjVkYzQxXzEwMA==` |

**Request body** (application/json)

```json
{
	"message": ""
}
```

**Response `201`**

```json
{
	"status": "ok"
}
```

---

### Send Voice Note To Conversation

```http
POST /api/v2/accounts/:account_id/conversations/:conversation_urn/send-audio
```

This POST request sends a voice note to an existing conversation.

> ℹ️ **Note:** This route requires a normal API key.

> ℹ️ **Note:** Voice notes are not supported in Sales Navigator conversations.

**Body fields (multipart/form-data):**

| Field | Required | Description |
|-------|----------|-------------|
| `file` | Required | The audio file as a binary Blob. |
| `file_name` | Required | The file name including extension (e.g. `"voice.mp4"`). |

**Path parameters**

| Name | Example |
| --- | --- |
| `account_id` | `964178669` |
| `conversation_urn` | `2-MTYzYWZjNmMtNGU5MS00ODZkLWEwZDItNDIyMTEwZjVkYzQxXzEwMA==` |

**Request body** (multipart/form-data)

```json
[
  {
    "name": "file",
    "value": "",
    "description": "",
    "disabled": false,
    "type": "file"
  },
  {
    "name": "file_name",
    "value": "note.mp3",
    "description": "",
    "disabled": false
  }
]
```

**Response `200`**

```json
{
	"conversation_urn": "2-ODk4OGVjNTUtYjczOS00NGNhLTlmMTctMTJjNWI0YThiN2M4XzAxMw==",
	"created_at": 1731935868773,
	"message_urn": "2-MTczMTkzNTg2ODMwNGI3MjA1OC0wMDQmODk4OGVjNTUtYjczOS00NGNhLTlmMTctMTJjNWI0YThiN2M4XzAxMw==",
	"status": "ok"
}
```

**Response `400`**

```json
{
	"status": "fail",
	"error": {
		"code": 400,
		"message": "Voice Messages are not supported in sales navigator conversations",
		"type": "Bad Request",
		"data": "NoVoiceSalesNav"
	}
}
```

---

### Read A Conversation

```http
POST /api/v2/accounts/:account_id/conversations/:conversation_urn/mark-as-read
```

This POST request marks a specific conversation as read, setting its status to `seen`.

> ℹ️ **Note:** This route requires a normal API key.

**Path parameters**

| Name | Example |
| --- | --- |
| `account_id` | `964178669` |
| `conversation_urn` | `2-MTYzYWZjNmMtNGU5MS00ODZkLWEwZDItNDIyMTEwZjVkYzQxXzEwMA==` |

**Response `200`**

```json
{
	"status": "ok"
}
```

---

### React To Message

```http
POST /api/v2/accounts/:account_id/conversations/:conversation_urn/messages/:message_id/react
```

This POST request adds a reaction to a specific message in a conversation.

> ℹ️ **Note:** This route requires a normal API key.

**Path parameters**

| Name | Example |
| --- | --- |
| `account_id` | `964178669` |
| `conversation_urn` | `2-MTYzYWZjNmMtNGU5MS00ODZkLWEwZDItNDIyMTEwZjVkYzQxXzEwMA==` |
| `message_id` | `12345678` |

**Request body** (application/json)

```json
{
	"emoji": "💀",
	"unreact": false
}
```

**Response `201`**

```json
{
	"status": "ok"
}
```

---

### Edit Message

```http
PATCH /api/v2/accounts/:account_id/conversations/:conversation_urn/messages/:message_id
```

This PATCH request edits a specific message in a conversation.

> ℹ️ **Note:** This route requires a normal API key.

**Path parameters**

| Name | Example |
| --- | --- |
| `account_id` | `964178669` |
| `conversation_urn` | `2-MTYzYWZjNmMtNGU5MS00ODZkLWEwZDItNDIyMTEwZjVkYzQxXzEwMA==` |
| `message_id` | `12345678` |

**Request body** (application/json)

```json
{
	"message": "test2"
}
```

**Response `200`**

```json
{
	"status": "ok"
}
```

**Response `400`**

```json
{
	"status": "fail",
	"error": {
		"code": 400,
		"message": "Message is not editable",
		"type": "Bad Request"
	}
}
```

**Response `404`**

```json
{
	"status": "fail",
	"error": {
		"code": 404,
		"message": "Message not found",
		"type": "Not Found"
	}
}
```

---

### Delete Message

```http
DELETE /api/v2/accounts/:account_id/conversations/:conversation_urn/messages/:message_id
```

This DELETE request deletes a specific message from a conversation.

> ℹ️ **Note:** This route requires a normal API key.

**Path parameters**

| Name | Example |
| --- | --- |
| `account_id` | `964178669` |
| `conversation_urn` | `2-MTYzYWZjNmMtNGU5MS00ODZkLWEwZDItNDIyMTEwZjVkYzQxXzEwMA==` |
| `message_id` | `12345678` |

**Response `200`**

```json
{
	"status": "ok"
}
```

---

## Templates

### List Templates

```http
GET /api/v2/templates
```

This GET request retrieves all templates associated with your workspace, including each template's attributes and usage details.

> ℹ️ **Note:** This route requires a normal API key.

**Response `200`**

```json
{
	"status": "ok",
	"templates": [
		{
			"id": "6b36b919-79ab-4656-84ea-e23a9f840df9",
			"name": "Test Template",
			"type": "NOTE_TEMPLATE",
			"message": "Test message",
			"ai": false,
			"created_at": 1712659132678,
			"stats": {
				"sent": 0,
				"replies": 0,
				"accepted": 0
			}
		}
	]
}
```

---

### Get Template

```http
GET /api/v2/templates/:template_id
```

This GET request retrieves the details of a specific template in your workspace.

> ℹ️ **Note:** This route requires a normal API key.

**Path parameters**

| Name | Example |
| --- | --- |
| `template_id` | `6b36b919-79ab-4656-84ea-e23a9f840df9` |

**Response `200`**

```json
{
	"status": "ok",
	"template": {
		"id": "46377415-c809-4475-ad40-145e4ed532d0",
		"agency_id": "aimfox",
		"message": "Hello",
		"subject": "Hello",
		"type": "INMAIL_TEMPLATE",
		"name": "Inmail Template",
		"is_deleted": false,
		"is_global": true,
		"created_at": 1718738396722,
		"edited_at": null,
		"original_id": null,
		"edited": false,
		"ai": false,
		"ai_prompt_id": null,
		"stats": {
			"sent": 0,
			"replies": 0,
			"accepted": 0
		}
	}
}
```

---

### Create Template

```http
POST /api/v2/templates
```

This POST request creates a new template in your workspace.

> ℹ️ **Note:** This route requires a normal API key.

**Available template types:**
- `NOTE_TEMPLATE`
- `INMAIL_TEMPLATE`
- `MESSAGE_TEMPLATE`

> 📝 InMail templates include an additional `subject` field (e.g., `"subject": "Hello"`).

**Request body** (application/json)

```json
{
	"name": "test",
  "type": "NOTE_TEMPLATE",
	"message": "Test message",
	"ai": false
}
```

**Response `201`**

```json
{
	"status": "ok",
	"template": {
		"id": "2a7d247e-f105-4b03-8cb0-aafd60fdeee8",
		"agency_id": "aimfox",
		"message": "Test message",
		"subject": null,
		"type": "NOTE_TEMPLATE",
		"name": "Note template",
		"is_deleted": false,
		"is_global": true,
		"created_at": "2024-11-18T11:46:10.514Z",
		"edited_at": null,
		"original_id": null,
		"edited": false,
		"ai": false,
		"ai_prompt_id": null,
		"stats": {
			"sent": 0,
			"replies": 0,
			"accepted": 0
		}
	}
}
```

---

### Edit Template

```http
PATCH /api/v2/templates/:template_id
```

This PATCH request updates a specific template in your workspace.

> ℹ️ **Note:** This route requires a normal API key.

**Path parameters**

| Name | Example |
| --- | --- |
| `template_id` | `6b36b919-79ab-4656-84ea-e23a9f840df9` |

**Request body** (application/json)

```json
{
			"name": "Test Template",
			"message": "Test message",
			"ai": false
}
```

**Response `200`**

```json
{
	"status": "ok",
	"template": {
		"id": "e8ea07eb-56a9-456c-9d7a-6686af2d6a6a",
		"agency_id": "aimfox",
		"message": "Test message",
		"subject": null,
		"type": "NOTE_TEMPLATE",
		"name": "Test Template",
		"is_deleted": false,
		"is_global": true,
		"created_at": "2024-11-18T11:47:34.450Z",
		"edited_at": null,
		"original_id": null,
		"edited": false,
		"ai": false,
		"ai_prompt_id": null
	}
}
```

---

### Delete Template

```http
DELETE /api/v2/templates/:template_id
```

This DELETE request removes a specific template from your workspace.

> ℹ️ **Note:** This route requires a normal API key.

**Path parameters**

| Name | Example |
| --- | --- |
| `template_id` | `6b36b919-79ab-4656-84ea-e23a9f840df9` |

**Response `200`**

```json
{
	"status": "ok"
}
```

---

## Webhooks

### List Webhooks

```http
GET /api/v2/webhooks
```

This GET request retrieves all webhooks associated with your workspace, including each webhook's attributes and configuration details.

> ℹ️ **Note:** This route requires a normal API key.

**Response `200`**

```json
{
    "status": "ok",
    "webhooks": [
        {
            "id": "8bf1a6ac-9b4d-45f7-a021-74e1fc1a4586",
            "workspace_id": "59d282b1-f2b1-438c-a4e2-21f1faba6ac5",
            "name": "Aimfox Webhook",
            "events": [
                "account_logged_in"
            ],
            "url": "https://1f24-80-93-251-178.ngrok-free.app/api/v1/webhooks",
            "account_id": null,
            "headers": null,
            "deleted": false,
            "created_at": "2025-07-29T10:06:29.526Z",
            "updated_at": "2025-07-29T10:06:29.526Z",
            "integration": false
        }
    ]
}
```

---

### Create Webhook

```http
POST /api/v2/webhooks
```

This POST request creates a new webhook in your workspace.

> ℹ️ **Note:** This route requires a normal API key.

The `url` field specifies the endpoint where Aimfox will send event payloads when the selected events are triggered. The `integrations` field should always be set to `false`.

**Available webhook events:**
`account_logged_in`, `account_logged_out`, `new_connection`, `view`, `connect`, `accepted`, `inmail`, `message_request`, `message`, `new_reply`, `reply`, `inmail_reply`, `lead_label_added`, `campaign_ended`, `campaign_created`, `campaign_started`, `inbox_event`, `campaign_reply`

**Request body** (application/json)

```json
{
	"name": "Aimfox Webhook",
	"events": ["account_logged_in"],
	"url": "https://0bf5-80-93-251-178.ngrok-free.app/api/v1/webhooks/char",
	"integration": false
}
```

**Response `201`**

```json
{
	"status": "ok",
	"webhook": {
		"id": "b744e5c4-11ca-4847-bfc8-5aea559e27ad",
		"workspace_id": "d89ef66d-7b07-460b-98c1-32aa4c72b640",
		"name": "Aimfox Webhook",
		"events": [
			"account_logged_in"
		],
		"url": "https://0bf5-80-93-251-178.ngrok-free.app/api/v1/webhooks",
		"account_id": null,
		"headers": null,
		"deleted": false,
		"created_at": "2024-12-30T15:49:33.885Z",
		"updated_at": "2024-12-30T15:49:33.885Z",
		"integration": false
	}
}
```

---

### Edit Webhook

```http
PATCH /api/v2/webhooks/:webhook_id
```

This PATCH request updates an existing webhook in your workspace.

> ℹ️ **Note:** This route requires a normal API key.

**Available webhook events:**
`account_logged_in`, `account_logged_out`, `new_connection`, `view`, `connect`, `accepted`, `inmail`, `message_request`, `message`, `new_reply`, `reply`, `inmail_reply`, `lead_label_added`, `campaign_ended`, `campaign_created`, `campaign_started`, `inbox_event`, `campaign_reply`

**Path parameters**

| Name | Example |
| --- | --- |
| `webhook_id` | `6b36b919-79ab-4656-84ea-e23a9f840df9` |

**Request body** (application/json)

```json
{
	"name": "Test Webhook",
	"events": ["account_logged_out"],
	"url": "https://localhost:5000/api/v1/webhooks",
	"headers": {
		"Authorization": "Bearer 123"
	}
}
```

**Response `200`**

```json
{
	"status": "ok"
}
```

---

### Delete Webhook

```http
DELETE /api/v2/webhooks/:webhook_id
```

This DELETE request removes a specific webhook from your workspace.

> ℹ️ **Note:** This route requires a normal API key.

**Path parameters**

| Name | Example |
| --- | --- |
| `webhook_id` | `6b36b919-79ab-4656-84ea-e23a9f840df9` |

**Response `200`**

```json
{
	"status": "ok"
}
```

---

*Reference generated from the Aimfox public API documentation. Response samples are abbreviated where payloads are very large.*
