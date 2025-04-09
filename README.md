# Notification Registration Service

The **Notification Registration Service** manages user preferences for receiving notifications and records notification match events. It provides endpoints to create and retrieve notification profiles and log matches used to trigger notifications.

---

## Requirements

Before running the service, ensure the following:

### MongoDB

- **Database**: `growthteam`
- **Collections**:
  - `tests` – stores notification profiles
  - `matches` – stores match records
- **Ports**:
  - `27017` – used by the development/production environment
  - `27010` – used by the test environment

### External Services

- **User API** must be running on:  
  `http://localhost:3000`

---

## Endpoints

### `GET /notification-profiles`

Fetch all notification profiles from the database.

**Response Example:**

```json
[
  {
    "profileName": "Energy M&A",
    "u3Id": "76DB413D-6B4F-4F88-9821-C12E306D7BD3",
    "type": "Digest",
    "isActive": true,
    "schedule": {
      "monday": ["09:00"],
      "friday": ["08:00"]
    }
  }
]
```

---

### `POST /notification-profiles`

Create or update a notification profile.

#### Request (Digest type):

```json
{
  "profileName": "Energy M&A",
  "u3Id": "76DB413D-6B4F-4F88-9821-C12E306D7BD3",
  "type": "Digest",
  "isActive": true,
  "schedule": {
    "monday": ["09:00"],
    "wednesday": ["08:00"]
  }
}
```

#### Request (Immediate type):

```json
{
  "profileName": "Market Alerts",
  "u3Id": "A3BBBD35-1234-4D33-9876-ABCDEF123456",
  "type": "Immediate",
  "isActive": true
}
```

> The `schedule` field is **required only** for `Digest` type profiles.

---

### `POST /notification-matches`

Add a new match record to the `matches` collection.

**Request Example:**

```json
 {
    "contentId": "https://notifications-content-store.mmgapi.net/content/intel-prime-3027806",
    "profileIds": [
        "76DB413D-6B4F-4F88-9821-C12E306D7BD3"
    ]
}
```

---

## Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/lakshya-ion/Notification-service-exercise.git
cd notification-registration-service
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Start MongoDB

Ensure MongoDB is running on:

- `27017` – for dev/prod usage
- `27010` – for test execution

Database must be named `growthteam` with collections: `tests` and `matches`.
