# Family Tree API Endpoints

This document lists all the available API endpoints for the Family Tree application.

## Auth Controller
**Base Path:** `/api/auth`

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/auth/login` | Authenticate user and return JWT token. |
| `POST` | `/api/auth/register` | Register a new user account. |

## Person Controller
**Base Path:** `/api/person`

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/person/upload` | Upload a file (image/document) for a person. |
| `POST` | `/api/person` | Create a new person entry. |
| `PUT` | `/api/person/{id}` | Update an existing person's details. |
| `DELETE` | `/api/person/{id}` | Delete a person by ID. |
| `GET` | `/api/person` | Get a list of all persons. |
| `GET` | `/api/person/{id}` | Get details of a specific person by ID. |

## Relationship Controller
**Base Path:** `/api/relationship`

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/relationship` | Add a new relationship between persons. |
| `DELETE` | `/api/relationship/{id}` | Delete a relationship by ID. |
| `GET` | `/api/relationship/person/{personId}` | Get all relationships for a specific person. |

## Role Controller
**Base Path:** `/api/roles`

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/roles` | Create a new role. |
| `POST` | `/api/roles/{roleId}/users/{userId}` | Assign a specific role to a user. |

## Admin Controller
**Base Path:** `/api/admin`

| Method | Endpoint | Description |
|---|---|---|
| `PUT` | `/api/admin/users/{userId}/activate` | Activate a user account (Admin only). |
