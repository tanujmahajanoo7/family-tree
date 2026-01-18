# Family Tree Project API Documentation

This document lists all the API endpoints used in the application.

**Total APIs: 15**

## 1. Auth Controller (`/api/auth`)
Handles user authentication and registration.

| Method | Endpoint | Purpose |
| :--- | :--- | :--- |
| `POST` | `/api/auth/login` | Authenticate user and return JWT token |
| `POST` | `/api/auth/register` | Register a new user account |

## 2. Admin Controller (`/api/admin`)
Handles administrative tasks such as user management.

| Method | Endpoint | Purpose |
| :--- | :--- | :--- |
| `PUT` | `/api/admin/users/{userId}/activate` | Activate a newly registered user (Admin only) |

## 3. Person Controller (`/api/person`)
Manages family members (Person entities) and their file uploads.

| Method | Endpoint | Purpose |
| :--- | :--- | :--- |
| `GET` | `/api/person` | Get a list of all persons |
| `POST` | `/api/person` | Create a new person |
| `GET` | `/api/person/{id}` | Get details of a specific person by ID |
| `PUT` | `/api/person/{id}` | Update an existing person's details |
| `DELETE` | `/api/person/{id}` | Delete a person |
| `POST` | `/api/person/upload` | Upload a file (e.g., profile picture) and get the file URI |

## 4. Relationship Controller (`/api/relationship`)
Manages relationships between family members.

| Method | Endpoint | Purpose |
| :--- | :--- | :--- |
| `GET` | `/api/relationship` | Get a list of all relationships |
| `POST` | `/api/relationship` | Add a new relationship between two persons |
| `DELETE` | `/api/relationship/{id}` | Delete a relationship |
| `GET` | `/api/relationship/person/{personId}` | Get all relationships for a specific person |

## 5. Role Controller (`/api/roles`)
Manages user roles within the system.

| Method | Endpoint | Purpose |
| :--- | :--- | :--- |
| `POST` | `/api/roles` | Create a new role definition |
| `POST` | `/api/roles/{roleId}/users/{userId}` | Assign a specific role to a user |
