# DashSphere Backend API Documentation

## 📋 Table of Contents
1. [Technology Stack](#technology-stack)
2. [Project Architecture](#project-architecture)
3. [Request Flow](#request-flow)
4. [Standardized Response Format](#standardized-response-format)
5. [Database Schema](#database-schema)
6. [Model Relationships](#model-relationships)
7. [API Endpoints](#api-endpoints)
8. [Middleware](#middleware)
9. [Third-Party Integrations](#third-party-integrations)
10. [Authentication & Authorization](#authentication--authorization)
11. [File Structure](#file-structure)

---

## 🛠 Technology Stack

### Core Framework
- **Laravel 10.x** - PHP Framework
- **PHP 8.1+** - Programming Language

### Authentication & Security
- **tymon/jwt-auth** - JWT Authentication
- **spatie/laravel-permission** - Role & Permission Management
- **Laravel Encryption** - Data Encryption for Sensitive Information

### Database
- **MySQL 8.0+** - Primary Database
- **Laravel Migrations** - Database Version Control
- **Laravel Eloquent ORM** - Database Abstraction Layer

### Additional Packages
- **Laravel Sanctum** (Optional) - API Token Management
- **Laravel Horizon** (Optional) - Queue Monitoring
- **Laravel Telescope** (Optional) - Debugging Tool

---

## 🏗 Project Architecture

### Request Flow Pattern

```
Request 
  ↓
Middleware (Authentication, Authorization, Tenant Context)
  ↓
Controller (Request Validation, Response Formatting)
  ↓
Service (Business Logic, Data Processing)
  ↓
Library (Third-Party API Calls)
  ↓
Repository (Database Queries)
  ↓
Response (Standardized Format)
```

### Directory Structure

```
app/
├── Http/
│   ├── Controllers/
│   │   ├── Auth/
│   │   ├── Dashboard/
│   │   ├── Analytics/
│   │   ├── Users/
│   │   ├── Tenants/
│   │   ├── Billing/
│   │   ├── Integrations/
│   │   ├── Settings/
│   │   ├── Notifications/
│   │   ├── AuditLogs/
│   │   └── Projects/
│   ├── Middleware/
│   │   ├── Authenticate.php
│   │   ├── TenantContext.php
│   │   └── PermissionCheck.php
│   └── Requests/
│       └── [Validation Requests]
├── Services/
│   ├── AuthService.php
│   ├── UserService.php
│   ├── TenantService.php
│   ├── BillingService.php
│   ├── IntegrationService.php
│   └── ...
├── Repositories/
│   ├── UserRepository.php
│   ├── TenantRepository.php
│   ├── BillingRepository.php
│   └── ...
├── Libraries/
│   ├── StripeLibrary.php
│   ├── GoogleOAuthLibrary.php
│   ├── AWSS3Library.php
│   ├── CloudinaryLibrary.php
│   └── ...
├── Models/
│   ├── User.php
│   ├── Tenant.php
│   ├── Role.php
│   ├── Permission.php
│   ├── Subscription.php
│   ├── Integration.php
│   └── ...
└── Helpers/
    └── ResponseHelper.php
```

---

## 📤 Standardized Response Format

### Success Response

```json
{
    "status_code": 200,
    "message": "Success",
    "error": false,
    "data": {
        "count": 0,
        "transactions": []
    }
}
```

### Error Response

```json
{
    "status_code": 401,
    "message": "Invalid authorization key",
    "error": true,
    "data": "Invalid Inputs"
}
```

### Response Helper Implementation

**File: `app/Helpers/ResponseHelper.php`**

```php
<?php

namespace App\Helpers;

class ResponseHelper
{
    /**
     * Success Response
     */
    public static function success($data = null, $message = 'Success', $statusCode = 200)
    {
        return response()->json([
            'status_code' => $statusCode,
            'message' => $message,
            'error' => false,
            'data' => $data
        ], $statusCode);
    }

    /**
     * Error Response
     */
    public static function error($message = 'Error', $statusCode = 400, $data = null)
    {
        return response()->json([
            'status_code' => $statusCode,
            'message' => $message,
            'error' => true,
            'data' => $data
        ], $statusCode);
    }

    /**
     * Validation Error Response
     */
    public static function validationError($errors, $message = 'Validation Error')
    {
        return response()->json([
            'status_code' => 422,
            'message' => $message,
            'error' => true,
            'data' => $errors
        ], 422);
    }

    /**
     * Unauthorized Response
     */
    public static function unauthorized($message = 'Unauthorized')
    {
        return response()->json([
            'status_code' => 401,
            'message' => $message,
            'error' => true,
            'data' => null
        ], 401);
    }

    /**
     * Forbidden Response
     */
    public static function forbidden($message = 'Forbidden')
    {
        return response()->json([
            'status_code' => 403,
            'message' => $message,
            'error' => true,
            'data' => null
        ], 403);
    }

    /**
     * Not Found Response
     */
    public static function notFound($message = 'Resource Not Found')
    {
        return response()->json([
            'status_code' => 404,
            'message' => $message,
            'error' => true,
            'data' => null
        ], 404);
    }
}
```

---

## 🗄 Database Schema

### Core Tables

#### 1. **users**
```sql
- id (bigint, primary key)
- tenant_id (bigint, nullable, foreign key -> tenants.id)
- name (string)
- email (string, unique)
- email_verified_at (timestamp, nullable)
- password (string, hashed)
- role (string) // 'super_admin', 'tenant_owner', 'tenant_admin', 'manager', 'user', 'viewer'
- status (string) // 'active', 'inactive', 'pending'
- avatar (string, nullable)
- last_login_at (timestamp, nullable)
- last_login_ip (string, nullable)
- created_at (timestamp)
- updated_at (timestamp)
- deleted_at (timestamp, nullable)
```

#### 2. **tenants**
```sql
- id (bigint, primary key)
- name (string)
- domain (string, unique)
- subdomain (string, unique, nullable)
- email (string)
- status (string) // 'active', 'inactive', 'suspended'
- plan (string) // 'free', 'professional', 'enterprise'
- max_users (integer, default: 10)
- max_storage (integer, default: 1000) // in MB
- current_users (integer, default: 0)
- current_storage (integer, default: 0) // in MB
- settings (json, nullable) // Tenant-specific settings
- created_at (timestamp)
- updated_at (timestamp)
- deleted_at (timestamp, nullable)
```

#### 3. **roles** (Spatie Package)
```sql
- id (bigint, primary key)
- tenant_id (bigint, nullable, foreign key -> tenants.id)
- name (string)
- guard_name (string, default: 'api')
- created_at (timestamp)
- updated_at (timestamp)
```

#### 4. **permissions** (Spatie Package)
```sql
- id (bigint, primary key)
- name (string)
- guard_name (string, default: 'api')
- created_at (timestamp)
- updated_at (timestamp)
```

#### 5. **model_has_roles** (Spatie Package)
```sql
- role_id (bigint, foreign key -> roles.id)
- model_type (string)
- model_id (bigint)
```

#### 6. **model_has_permissions** (Spatie Package)
```sql
- permission_id (bigint, foreign key -> permissions.id)
- model_type (string)
- model_id (bigint)
```

#### 7. **role_has_permissions** (Spatie Package)
```sql
- permission_id (bigint, foreign key -> permissions.id)
- role_id (bigint, foreign key -> roles.id)
```

### Billing & Subscription Tables

#### 8. **subscriptions**
```sql
- id (bigint, primary key)
- tenant_id (bigint, foreign key -> tenants.id)
- plan_id (bigint, foreign key -> plans.id)
- status (string) // 'active', 'cancelled', 'expired', 'trial'
- start_date (date)
- end_date (date, nullable)
- trial_ends_at (timestamp, nullable)
- cancelled_at (timestamp, nullable)
- created_at (timestamp)
- updated_at (timestamp)
```

#### 9. **plans**
```sql
- id (bigint, primary key)
- name (string)
- slug (string, unique)
- description (text, nullable)
- price (decimal, 10, 2)
- currency (string, default: 'USD')
- interval (string) // 'monthly', 'yearly'
- max_users (integer)
- max_storage (integer) // in MB
- features (json) // Plan features
- is_active (boolean, default: true)
- created_at (timestamp)
- updated_at (timestamp)
```

#### 10. **payments**
```sql
- id (bigint, primary key)
- tenant_id (bigint, foreign key -> tenants.id)
- subscription_id (bigint, foreign key -> subscriptions.id, nullable)
- amount (decimal, 10, 2)
- currency (string, default: 'USD')
- status (string) // 'pending', 'completed', 'failed', 'refunded'
- payment_method (string) // 'card', 'bank_transfer', 'paypal'
- transaction_id (string, nullable)
- payment_gateway (string, nullable) // 'stripe', 'paypal'
- gateway_response (json, nullable)
- paid_at (timestamp, nullable)
- created_at (timestamp)
- updated_at (timestamp)
```

#### 11. **invoices**
```sql
- id (bigint, primary key)
- tenant_id (bigint, foreign key -> tenants.id)
- subscription_id (bigint, foreign key -> subscriptions.id, nullable)
- payment_id (bigint, foreign key -> payments.id, nullable)
- invoice_number (string, unique)
- amount (decimal, 10, 2)
- currency (string, default: 'USD')
- status (string) // 'draft', 'sent', 'paid', 'cancelled'
- due_date (date)
- paid_at (timestamp, nullable)
- items (json) // Invoice line items
- created_at (timestamp)
- updated_at (timestamp)
```

#### 12. **payment_methods**
```sql
- id (bigint, primary key)
- tenant_id (bigint, foreign key -> tenants.id)
- type (string) // 'card', 'bank_account'
- provider (string) // 'stripe', 'paypal'
- provider_customer_id (string)
- provider_payment_method_id (string)
- last_four (string, nullable) // Last 4 digits of card
- brand (string, nullable) // 'visa', 'mastercard', etc.
- expiry_month (integer, nullable)
- expiry_year (integer, nullable)
- is_default (boolean, default: false)
- is_active (boolean, default: true)
- metadata (json, nullable)
- created_at (timestamp)
- updated_at (timestamp)
```

### Integration Tables

#### 13. **integrations**
```sql
- id (bigint, primary key)
- tenant_id (bigint, nullable, foreign key -> tenants.id) // null = global
- name (string)
- type (string) // 'oauth', 'api_key', 'webhook', 'saml'
- category (string) // 'auth', 'storage', 'automation', 'security', 'developer', 'monitoring'
- provider (string) // 'google', 'microsoft', 'stripe', 'aws', 'cloudinary', etc.
- status (string) // 'active', 'inactive', 'error'
- environment (string) // 'development', 'production'
- enabled (boolean, default: false)
- config (json) // Encrypted configuration
- credentials (json) // Encrypted credentials
- last_sync_at (timestamp, nullable)
- last_error (text, nullable)
- created_at (timestamp)
- updated_at (timestamp)
```

#### 14. **integration_credentials**
```sql
- id (bigint, primary key)
- integration_id (bigint, foreign key -> integrations.id)
- key_name (string) // 'api_key', 'secret_key', 'access_token', etc.
- encrypted_value (text) // Encrypted credential value
- created_at (timestamp)
- updated_at (timestamp)
```

### Notification Tables

#### 15. **notifications**
```sql
- id (bigint, primary key)
- tenant_id (bigint, nullable, foreign key -> tenants.id) // null = global
- user_id (bigint, nullable, foreign key -> users.id) // null = broadcast
- type (string) // 'info', 'success', 'warning', 'error', 'system'
- title (string)
- message (text)
- action_url (string, nullable)
- is_read (boolean, default: false)
- read_at (timestamp, nullable)
- created_at (timestamp)
- updated_at (timestamp)
```

### Audit & Activity Tables

#### 16. **audit_logs**
```sql
- id (bigint, primary key)
- tenant_id (bigint, nullable, foreign key -> tenants.id)
- user_id (bigint, foreign key -> users.id)
- action_type (string) // 'create', 'update', 'delete', 'login', 'logout', etc.
- action (string) // Human-readable action description
- description (text)
- resource_type (string, nullable) // 'User', 'Tenant', 'Subscription', etc.
- resource_id (bigint, nullable)
- severity (string) // 'low', 'medium', 'high', 'critical'
- ip_address (string, nullable)
- user_agent (text, nullable)
- changes (json, nullable) // {before: {}, after: {}}
- metadata (json, nullable)
- created_at (timestamp)
```

### Projects / Modules Tables

#### 17. **modules**
```sql
- id (bigint, primary key)
- name (string, unique)
- slug (string, unique)
- description (text, nullable)
- category (string) // 'business', 'productivity', 'communication', 'analytics', 'integration'
- icon (string)
- version (string)
- is_active (boolean, default: true)
- created_at (timestamp)
- updated_at (timestamp)
```

#### 18. **tenant_modules**
```sql
- id (bigint, primary key)
- tenant_id (bigint, foreign key -> tenants.id)
- module_id (bigint, foreign key -> modules.id)
- enabled (boolean, default: false)
- status (string) // 'active', 'inactive', 'configuring', 'error'
- config (json, nullable) // Module-specific configuration
- last_updated_at (timestamp)
- created_at (timestamp)
- updated_at (timestamp)
- UNIQUE KEY (tenant_id, module_id)
```

### Analytics Tables

#### 19. **analytics_events**
```sql
- id (bigint, primary key)
- tenant_id (bigint, foreign key -> tenants.id)
- user_id (bigint, nullable, foreign key -> users.id)
- event_type (string) // 'page_view', 'action', 'conversion', etc.
- event_name (string)
- properties (json, nullable)
- session_id (string, nullable)
- ip_address (string, nullable)
- user_agent (text, nullable)
- created_at (timestamp)
```

#### 20. **analytics_daily**
```sql
- id (bigint, primary key)
- tenant_id (bigint, foreign key -> tenants.id)
- date (date)
- metrics (json) // {visitors: 100, page_views: 500, revenue: 1000, etc.}
- created_at (timestamp)
- updated_at (timestamp)
- UNIQUE KEY (tenant_id, date)
```

#### 21. **analytics_weekly**
```sql
- id (bigint, primary key)
- tenant_id (bigint, foreign key -> tenants.id)
- week_start_date (date)
- week_end_date (date)
- metrics (json)
- created_at (timestamp)
- updated_at (timestamp)
- UNIQUE KEY (tenant_id, week_start_date)
```

---

## 🔗 Model Relationships

### User Model
```php
// User.php
- belongsTo(Tenant::class)
- belongsToMany(Role::class) // Spatie
- hasMany(AuditLog::class)
- hasMany(Notification::class)
- hasMany(AnalyticsEvent::class)
```

### Tenant Model
```php
// Tenant.php
- hasMany(User::class)
- hasOne(Subscription::class)
- hasMany(Payment::class)
- hasMany(Invoice::class)
- hasMany(PaymentMethod::class)
- hasMany(Integration::class)
- hasMany(Notification::class)
- hasMany(AuditLog::class)
- hasMany(AnalyticsEvent::class)
- hasMany(AnalyticsDaily::class)
- hasMany(AnalyticsWeekly::class)
- belongsToMany(Module::class, 'tenant_modules')
```

### Subscription Model
```php
// Subscription.php
- belongsTo(Tenant::class)
- belongsTo(Plan::class)
- hasMany(Payment::class)
- hasMany(Invoice::class)
```

### Integration Model
```php
// Integration.php
- belongsTo(Tenant::class, nullable)
- hasMany(IntegrationCredential::class)
```

### Module Model
```php
// Module.php
- belongsToMany(Tenant::class, 'tenant_modules')
```

---

## 🔌 API Endpoints

### Base URL
```
https://api.dashsphere.com/api/v1
```

### Authentication Endpoints

#### 1. Register
```
POST /auth/register
```
**Request:**
```json
{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123",
    "password_confirmation": "password123",
    "tenant_name": "Acme Corporation" // Optional, for tenant creation
}
```
**Response:** Success (201) / Error (422)
**Middleware:** None

---

#### 2. Login
```
POST /auth/login
```
**Request:**
```json
{
    "email": "john@example.com",
    "password": "password123"
}
```
**Response:** Success (200) with JWT token
**Middleware:** None

**Success Response:**
```json
{
    "status_code": 200,
    "message": "Success",
    "error": false,
    "data": {
        "token": "eyJ0eXAiOiJKV1QiLCJhbGc...",
        "token_type": "bearer",
        "expires_in": 3600,
        "user": {
            "id": 1,
            "name": "John Doe",
            "email": "john@example.com",
            "role": "tenant_admin",
            "tenant": {
                "id": 1,
                "name": "Acme Corporation"
            }
        }
    }
}
```

---

#### 3. Logout
```
POST /auth/logout
```
**Request:** Headers: `Authorization: Bearer {token}`
**Response:** Success (200)
**Middleware:** `auth:api`

---

#### 4. Refresh Token
```
POST /auth/refresh
```
**Request:** Headers: `Authorization: Bearer {token}`
**Response:** Success (200) with new token
**Middleware:** `auth:api`

---

#### 5. Forgot Password
```
POST /auth/forgot-password
```
**Request:**
```json
{
    "email": "john@example.com"
}
```
**Response:** Success (200)
**Middleware:** None

---

#### 6. Reset Password
```
POST /auth/reset-password
```
**Request:**
```json
{
    "email": "john@example.com",
    "token": "reset_token",
    "password": "newpassword123",
    "password_confirmation": "newpassword123"
}
```
**Response:** Success (200)
**Middleware:** None

---

### Dashboard Endpoints

#### 7. Get Dashboard Stats
```
GET /dashboard/stats
```
**Request:** Headers: `Authorization: Bearer {token}`
**Response:** Success (200) with dashboard KPIs
**Middleware:** `auth:api`, `tenant.context`, `permission:dashboard:view`

**Success Response:**
```json
{
    "status_code": 200,
    "message": "Success",
    "error": false,
    "data": {
        "total_users": 150,
        "active_users": 120,
        "total_revenue": 50000,
        "monthly_revenue": 5000,
        "total_tenants": 10,
        "active_tenants": 8
    }
}
```

---

### Analytics Endpoints

#### 8. Get Daily Analytics
```
GET /analytics/daily?start_date=2024-01-01&end_date=2024-01-31
```
**Request:** Headers: `Authorization: Bearer {token}`
**Query Parameters:**
- `start_date` (optional)
- `end_date` (optional)
**Response:** Success (200)
**Middleware:** `auth:api`, `tenant.context`, `permission:analytics:view`

---

#### 9. Get Weekly Analytics
```
GET /analytics/weekly?start_date=2024-01-01&end_date=2024-01-31
```
**Request:** Headers: `Authorization: Bearer {token}`
**Query Parameters:**
- `start_date` (optional)
- `end_date` (optional)
**Response:** Success (200)
**Middleware:** `auth:api`, `tenant.context`, `permission:analytics:view`

---

#### 10. Export Analytics
```
GET /analytics/export?format=csv&start_date=2024-01-01&end_date=2024-01-31
```
**Request:** Headers: `Authorization: Bearer {token}`
**Query Parameters:**
- `format` (csv, pdf, excel)
- `start_date` (optional)
- `end_date` (optional)
**Response:** File download
**Middleware:** `auth:api`, `tenant.context`, `permission:analytics:export`

---

### User Management Endpoints

#### 11. List Users
```
GET /users?page=1&per_page=20&search=&status=&role=
```
**Request:** Headers: `Authorization: Bearer {token}`
**Query Parameters:**
- `page` (optional, default: 1)
- `per_page` (optional, default: 20)
- `search` (optional)
- `status` (optional: all, active, inactive, pending)
- `role` (optional)
**Response:** Success (200) with paginated users
**Middleware:** `auth:api`, `tenant.context`, `permission:users:view`

---

#### 12. Get User Details
```
GET /users/{id}
```
**Request:** Headers: `Authorization: Bearer {token}`
**Response:** Success (200)
**Middleware:** `auth:api`, `tenant.context`, `permission:users:view`

---

#### 13. Create User
```
POST /users
```
**Request:** Headers: `Authorization: Bearer {token}`
**Body:**
```json
{
    "name": "Jane Doe",
    "email": "jane@example.com",
    "password": "password123",
    "password_confirmation": "password123",
    "role": "manager",
    "status": "active"
}
```
**Response:** Success (201)
**Middleware:** `auth:api`, `tenant.context`, `permission:users:create`

---

#### 14. Update User
```
PUT /users/{id}
```
**Request:** Headers: `Authorization: Bearer {token}`
**Body:**
```json
{
    "name": "Jane Doe Updated",
    "email": "jane@example.com",
    "role": "manager",
    "status": "active"
}
```
**Response:** Success (200)
**Middleware:** `auth:api`, `tenant.context`, `permission:users:edit`

---

#### 15. Delete User
```
DELETE /users/{id}
```
**Request:** Headers: `Authorization: Bearer {token}`
**Response:** Success (200)
**Middleware:** `auth:api`, `tenant.context`, `permission:users:delete`

---

#### 16. Invite User
```
POST /users/invite
```
**Request:** Headers: `Authorization: Bearer {token}`
**Body:**
```json
{
    "email": "newuser@example.com",
    "role": "user",
    "message": "Welcome to our platform!"
}
```
**Response:** Success (200)
**Middleware:** `auth:api`, `tenant.context`, `permission:users:create`

---

#### 17. Reset User Password
```
POST /users/{id}/reset-password
```
**Request:** Headers: `Authorization: Bearer {token}`
**Response:** Success (200) with temporary password
**Middleware:** `auth:api`, `tenant.context`, `permission:users:edit`

---

#### 18. Deactivate User
```
POST /users/{id}/deactivate
```
**Request:** Headers: `Authorization: Bearer {token}`
**Response:** Success (200)
**Middleware:** `auth:api`, `tenant.context`, `permission:users:edit`

---

#### 19. Activate User
```
POST /users/{id}/activate
```
**Request:** Headers: `Authorization: Bearer {token}`
**Response:** Success (200)
**Middleware:** `auth:api`, `tenant.context`, `permission:users:edit`

---

### Role Management Endpoints

#### 20. List Roles
```
GET /roles
```
**Request:** Headers: `Authorization: Bearer {token}`
**Response:** Success (200)
**Middleware:** `auth:api`, `tenant.context`, `permission:roles:view`

---

#### 21. Create Role
```
POST /roles
```
**Request:** Headers: `Authorization: Bearer {token}`
**Body:**
```json
{
    "name": "Custom Manager",
    "permissions": ["users:view", "users:create", "analytics:view"]
}
```
**Response:** Success (201)
**Middleware:** `auth:api`, `tenant.context`, `permission:roles:create`

---

#### 22. Update Role
```
PUT /roles/{id}
```
**Request:** Headers: `Authorization: Bearer {token}`
**Body:**
```json
{
    "name": "Custom Manager Updated",
    "permissions": ["users:view", "users:create", "users:edit", "analytics:view"]
}
```
**Response:** Success (200)
**Middleware:** `auth:api`, `tenant.context`, `permission:roles:edit`

---

#### 23. Delete Role
```
DELETE /roles/{id}
```
**Request:** Headers: `Authorization: Bearer {token}`
**Response:** Success (200)
**Middleware:** `auth:api`, `tenant.context`, `permission:roles:delete`

---

### Tenant Management Endpoints (Super Admin Only)

#### 24. List Tenants
```
GET /tenants?page=1&per_page=20&search=&status=&plan=
```
**Request:** Headers: `Authorization: Bearer {token}`
**Query Parameters:**
- `page` (optional)
- `per_page` (optional)
- `search` (optional)
- `status` (optional)
- `plan` (optional)
**Response:** Success (200)
**Middleware:** `auth:api`, `permission:tenants:view`, `super.admin`

---

#### 25. Create Tenant
```
POST /tenants
```
**Request:** Headers: `Authorization: Bearer {token}`
**Body:**
```json
{
    "name": "New Corporation",
    "domain": "newcorp.com",
    "subdomain": "newcorp",
    "email": "admin@newcorp.com",
    "plan": "professional",
    "max_users": 50,
    "max_storage": 1000
}
```
**Response:** Success (201)
**Middleware:** `auth:api`, `permission:tenants:create`, `super.admin`

---

#### 26. Update Tenant
```
PUT /tenants/{id}
```
**Request:** Headers: `Authorization: Bearer {token}`
**Body:** Same as create
**Response:** Success (200)
**Middleware:** `auth:api`, `permission:tenants:edit`, `super.admin`

---

#### 27. Delete Tenant
```
DELETE /tenants/{id}
```
**Request:** Headers: `Authorization: Bearer {token}`
**Response:** Success (200)
**Middleware:** `auth:api`, `permission:tenants:delete`, `super.admin`

---

#### 28. Activate/Deactivate Tenant
```
POST /tenants/{id}/toggle-status
```
**Request:** Headers: `Authorization: Bearer {token}`
**Response:** Success (200)
**Middleware:** `auth:api`, `permission:tenants:edit`, `super.admin`

---

#### 29. Get Tenant Analytics
```
GET /tenants/{id}/analytics
```
**Request:** Headers: `Authorization: Bearer {token}`
**Response:** Success (200)
**Middleware:** `auth:api`, `permission:tenants:view`, `super.admin`

---

### Billing & Subscription Endpoints

#### 30. Get Current Plan
```
GET /billing/current-plan
```
**Request:** Headers: `Authorization: Bearer {token}`
**Response:** Success (200)
**Middleware:** `auth:api`, `tenant.context`, `permission:billing:view`

---

#### 31. Get Payment History
```
GET /billing/payments?page=1&per_page=20
```
**Request:** Headers: `Authorization: Bearer {token}`
**Response:** Success (200)
**Middleware:** `auth:api`, `tenant.context`, `permission:billing:view`

---

#### 32. Get Invoices
```
GET /billing/invoices?page=1&per_page=20
```
**Request:** Headers: `Authorization: Bearer {token}`
**Response:** Success (200)
**Middleware:** `auth:api`, `tenant.context`, `permission:billing:view`

---

#### 33. Get Invoice PDF
```
GET /billing/invoices/{id}/download
```
**Request:** Headers: `Authorization: Bearer {token}`
**Response:** PDF file
**Middleware:** `auth:api`, `tenant.context`, `permission:billing:view`

---

#### 34. Update Payment Method
```
PUT /billing/payment-methods/{id}
```
**Request:** Headers: `Authorization: Bearer {token}`
**Body:**
```json
{
    "is_default": true
}
```
**Response:** Success (200)
**Middleware:** `auth:api`, `tenant.context`, `permission:billing:manage`

---

#### 35. Add Payment Method
```
POST /billing/payment-methods
```
**Request:** Headers: `Authorization: Bearer {token}`
**Body:**
```json
{
    "type": "card",
    "provider": "stripe",
    "token": "stripe_token"
}
```
**Response:** Success (201)
**Middleware:** `auth:api`, `tenant.context`, `permission:billing:manage`

---

#### 36. Upgrade/Downgrade Plan
```
POST /billing/change-plan
```
**Request:** Headers: `Authorization: Bearer {token}`
**Body:**
```json
{
    "plan_id": 2
}
```
**Response:** Success (200)
**Middleware:** `auth:api`, `tenant.context`, `permission:billing:manage`

---

### Integration Endpoints

#### 37. List Integrations
```
GET /integrations?category=&status=
```
**Request:** Headers: `Authorization: Bearer {token}`
**Query Parameters:**
- `category` (optional)
- `status` (optional)
**Response:** Success (200)
**Middleware:** `auth:api`, `tenant.context`, `permission:integrations:view`

---

#### 38. Get Integration Details
```
GET /integrations/{id}
```
**Request:** Headers: `Authorization: Bearer {token}`
**Response:** Success (200)
**Middleware:** `auth:api`, `tenant.context`, `permission:integrations:view`

---

#### 39. Configure Integration
```
PUT /integrations/{id}/configure
```
**Request:** Headers: `Authorization: Bearer {token}`
**Body:**
```json
{
    "enabled": true,
    "environment": "production",
    "config": {
        "api_key": "encrypted_value",
        "secret_key": "encrypted_value"
    }
}
```
**Response:** Success (200)
**Middleware:** `auth:api`, `tenant.context`, `permission:integrations:manage`

---

#### 40. Enable/Disable Integration
```
POST /integrations/{id}/toggle
```
**Request:** Headers: `Authorization: Bearer {token}`
**Response:** Success (200)
**Middleware:** `auth:api`, `tenant.context`, `permission:integrations:manage`

---

#### 41. Test Integration Connection
```
POST /integrations/{id}/test
```
**Request:** Headers: `Authorization: Bearer {token}`
**Response:** Success (200)
**Middleware:** `auth:api`, `tenant.context`, `permission:integrations:manage`

---

### Settings Endpoints

#### 42. Get Settings
```
GET /settings
```
**Request:** Headers: `Authorization: Bearer {token}`
**Response:** Success (200)
**Middleware:** `auth:api`, `tenant.context`, `permission:settings:view`

---

#### 43. Update Settings
```
PUT /settings
```
**Request:** Headers: `Authorization: Bearer {token}`
**Body:**
```json
{
    "theme": "dark",
    "language": "en",
    "notifications": {
        "email": true,
        "push": false
    }
}
```
**Response:** Success (200)
**Middleware:** `auth:api`, `tenant.context`, `permission:settings:edit`

---

#### 44. Update Profile
```
PUT /settings/profile
```
**Request:** Headers: `Authorization: Bearer {token}`
**Body:**
```json
{
    "name": "John Doe Updated",
    "avatar": "base64_image_or_url"
}
```
**Response:** Success (200)
**Middleware:** `auth:api`

---

#### 45. Change Password
```
POST /settings/change-password
```
**Request:** Headers: `Authorization: Bearer {token}`
**Body:**
```json
{
    "current_password": "oldpassword",
    "password": "newpassword",
    "password_confirmation": "newpassword"
}
```
**Response:** Success (200)
**Middleware:** `auth:api`

---

### Notification Endpoints

#### 46. List Notifications
```
GET /notifications?page=1&per_page=20&unread_only=false
```
**Request:** Headers: `Authorization: Bearer {token}`
**Query Parameters:**
- `page` (optional)
- `per_page` (optional)
- `unread_only` (optional, default: false)
**Response:** Success (200)
**Middleware:** `auth:api`, `tenant.context`

---

#### 47. Mark Notification as Read
```
POST /notifications/{id}/read
```
**Request:** Headers: `Authorization: Bearer {token}`
**Response:** Success (200)
**Middleware:** `auth:api`

---

#### 48. Mark All Notifications as Read
```
POST /notifications/read-all
```
**Request:** Headers: `Authorization: Bearer {token}`
**Response:** Success (200)
**Middleware:** `auth:api`

---

#### 49. Get Unread Count
```
GET /notifications/unread-count
```
**Request:** Headers: `Authorization: Bearer {token}`
**Response:** Success (200)
**Middleware:** `auth:api`

---

### Audit Logs Endpoints

#### 50. List Audit Logs
```
GET /audit-logs?page=1&per_page=20&user_id=&action_type=&severity=&start_date=&end_date=&search=
```
**Request:** Headers: `Authorization: Bearer {token}`
**Query Parameters:**
- `page` (optional)
- `per_page` (optional)
- `user_id` (optional)
- `action_type` (optional)
- `severity` (optional)
- `start_date` (optional)
- `end_date` (optional)
- `search` (optional)
**Response:** Success (200)
**Middleware:** `auth:api`, `tenant.context`, `permission:audit_logs:view`

---

#### 51. Get Audit Log Details
```
GET /audit-logs/{id}
```
**Request:** Headers: `Authorization: Bearer {token}`
**Response:** Success (200)
**Middleware:** `auth:api`, `tenant.context`, `permission:audit_logs:view`

---

#### 52. Export Audit Logs
```
GET /audit-logs/export?format=csv&start_date=&end_date=
```
**Request:** Headers: `Authorization: Bearer {token}`
**Response:** File download
**Middleware:** `auth:api`, `tenant.context`, `permission:audit_logs:export`

---

### Projects / Modules Endpoints (Super Admin Only)

#### 53. List Modules
```
GET /projects/modules?category=&status=&search=
```
**Request:** Headers: `Authorization: Bearer {token}`
**Query Parameters:**
- `category` (optional)
- `status` (optional)
- `search` (optional)
**Response:** Success (200)
**Middleware:** `auth:api`, `permission:projects:view`, `super.admin`

---

#### 54. Get Module Details
```
GET /projects/modules/{id}
```
**Request:** Headers: `Authorization: Bearer {token}`
**Response:** Success (200)
**Middleware:** `auth:api`, `permission:projects:view`, `super.admin`

---

#### 55. Configure Module
```
PUT /projects/modules/{id}/configure
```
**Request:** Headers: `Authorization: Bearer {token}`
**Body:**
```json
{
    "tenant_id": 1,
    "enabled": true,
    "config": {
        "setting1": "value1",
        "setting2": "value2"
    }
}
```
**Response:** Success (200)
**Middleware:** `auth:api`, `permission:projects:manage`, `super.admin`

---

#### 56. Enable/Disable Module for Tenant
```
POST /projects/modules/{id}/toggle
```
**Request:** Headers: `Authorization: Bearer {token}`
**Body:**
```json
{
    "tenant_id": 1,
    "enabled": true
}
```
**Response:** Success (200)
**Middleware:** `auth:api`, `permission:projects:manage`, `super.admin`

---

## 🛡 Middleware

### 1. Authentication Middleware
**File:** `app/Http/Middleware/Authenticate.php`
- Validates JWT token
- Sets authenticated user in request

### 2. Tenant Context Middleware
**File:** `app/Http/Middleware/TenantContext.php`
- Extracts tenant from subdomain, header, or user
- Sets tenant context for all requests
- Ensures data isolation

### 3. Permission Check Middleware
**File:** `app/Http/Middleware/PermissionCheck.php`
- Checks user permissions using Spatie
- Validates tenant-scoped permissions
- Returns 403 if permission denied

### 4. Super Admin Middleware
**File:** `app/Http/Middleware/SuperAdmin.php`
- Checks if user is super_admin
- Returns 403 if not super admin

### Middleware Registration
**File:** `app/Http/Kernel.php`

```php
protected $middlewareGroups = [
    'api' => [
        \App\Http\Middleware\EncryptCookies::class,
        \App\Http\Middleware\VerifyCsrfToken::class,
    ],
];

protected $routeMiddleware = [
    'auth' => \App\Http\Middleware\Authenticate::class,
    'tenant.context' => \App\Http\Middleware\TenantContext::class,
    'permission' => \App\Http\Middleware\PermissionCheck::class,
    'super.admin' => \App\Http\Middleware\SuperAdmin::class,
];
```

---

## 🔐 Authentication & Authorization

### JWT Configuration
**File:** `config/jwt.php`

```php
'ttl' => env('JWT_TTL', 60), // minutes
'refresh_ttl' => env('JWT_REFRESH_TTL', 20160), // minutes
'algo' => env('JWT_ALGO', 'HS256'),
```

### Spatie Permission Setup
**File:** `config/permission.php`

```php
'models' => [
    'permission' => Spatie\Permission\Models\Permission::class,
    'role' => Spatie\Permission\Models\Role::class,
],
'cache_expiration_time' => 86400,
```

### Permission Seeder
**File:** `database/seeders/PermissionSeeder.php`

```php
// Create all permissions
$permissions = [
    'users:view', 'users:create', 'users:edit', 'users:delete',
    'roles:view', 'roles:create', 'roles:edit', 'roles:delete',
    'tenants:view', 'tenants:create', 'tenants:edit', 'tenants:delete',
    'dashboard:view', 'dashboard:create', 'dashboard:edit', 'dashboard:delete',
    'analytics:view', 'analytics:create', 'analytics:edit', 'analytics:delete', 'analytics:export',
    'billing:view', 'billing:create', 'billing:edit', 'billing:delete', 'billing:manage',
    'integrations:view', 'integrations:create', 'integrations:edit', 'integrations:delete', 'integrations:manage',
    'settings:view', 'settings:create', 'settings:edit', 'settings:delete',
    'notifications:view', 'notifications:create', 'notifications:edit', 'notifications:delete', 'notifications:manage',
    'audit_logs:view', 'audit_logs:create', 'audit_logs:edit', 'audit_logs:delete', 'audit_logs:export',
    'projects:view', 'projects:create', 'projects:edit', 'projects:delete', 'projects:manage',
];

foreach ($permissions as $permission) {
    Permission::create(['name' => $permission]);
}
```

---

## 🔌 Third-Party Integrations

### Library Structure

All third-party API integrations should be placed in `app/Libraries/` folder.

### Example: Stripe Library
**File:** `app/Libraries/StripeLibrary.php`

```php
<?php

namespace App\Libraries;

use App\Helpers\ResponseHelper;
use Stripe\StripeClient;

class StripeLibrary
{
    private $stripe;
    
    public function __construct($apiKey)
    {
        $this->stripe = new StripeClient($apiKey);
    }
    
    public function createCustomer($data)
    {
        try {
            $customer = $this->stripe->customers->create([
                'email' => $data['email'],
                'name' => $data['name'],
            ]);
            
            return ResponseHelper::success($customer);
        } catch (\Exception $e) {
            return ResponseHelper::error($e->getMessage(), 500);
        }
    }
    
    public function createPaymentMethod($data)
    {
        try {
            $paymentMethod = $this->stripe->paymentMethods->create([
                'type' => 'card',
                'card' => [
                    'number' => $data['card_number'],
                    'exp_month' => $data['exp_month'],
                    'exp_year' => $data['exp_year'],
                    'cvc' => $data['cvc'],
                ],
            ]);
            
            return ResponseHelper::success($paymentMethod);
        } catch (\Exception $e) {
            return ResponseHelper::error($e->getMessage(), 500);
        }
    }
}
```

### Credential Encryption

**File:** `app/Services/IntegrationService.php`

```php
public function storeCredentials($integrationId, $credentials)
{
    foreach ($credentials as $key => $value) {
        IntegrationCredential::updateOrCreate(
            [
                'integration_id' => $integrationId,
                'key_name' => $key
            ],
            [
                'encrypted_value' => encrypt($value) // Laravel encryption
            ]
        );
    }
}

public function getCredentials($integrationId)
{
    $credentials = IntegrationCredential::where('integration_id', $integrationId)->get();
    
    $decrypted = [];
    foreach ($credentials as $credential) {
        $decrypted[$credential->key_name] = decrypt($credential->encrypted_value);
    }
    
    return $decrypted;
}
```

### Integration Library List

1. **StripeLibrary.php** - Payment processing
2. **GoogleOAuthLibrary.php** - Google OAuth integration
3. **MicrosoftOAuthLibrary.php** - Microsoft OAuth integration
4. **AWSS3Library.php** - AWS S3 storage
5. **CloudinaryLibrary.php** - Cloudinary media storage
6. **SentryLibrary.php** - Error tracking
7. **ZapierLibrary.php** - Zapier webhooks
8. **SAMLibrary.php** - SAML SSO

---

## 📁 File Structure

### Complete Directory Structure

```
app/
├── Console/
│   └── Commands/
├── Exceptions/
│   └── Handler.php
├── Helpers/
│   └── ResponseHelper.php
├── Http/
│   ├── Controllers/
│   │   ├── Auth/
│   │   │   ├── AuthController.php
│   │   │   └── PasswordResetController.php
│   │   ├── Dashboard/
│   │   │   └── DashboardController.php
│   │   ├── Analytics/
│   │   │   └── AnalyticsController.php
│   │   ├── Users/
│   │   │   ├── UserController.php
│   │   │   └── RoleController.php
│   │   ├── Tenants/
│   │   │   └── TenantController.php
│   │   ├── Billing/
│   │   │   ├── SubscriptionController.php
│   │   │   ├── PaymentController.php
│   │   │   └── InvoiceController.php
│   │   ├── Integrations/
│   │   │   └── IntegrationController.php
│   │   ├── Settings/
│   │   │   └── SettingsController.php
│   │   ├── Notifications/
│   │   │   └── NotificationController.php
│   │   ├── AuditLogs/
│   │   │   └── AuditLogController.php
│   │   └── Projects/
│   │       └── ModuleController.php
│   ├── Middleware/
│   │   ├── Authenticate.php
│   │   ├── TenantContext.php
│   │   ├── PermissionCheck.php
│   │   └── SuperAdmin.php
│   └── Requests/
│       ├── Auth/
│       │   ├── LoginRequest.php
│       │   └── RegisterRequest.php
│       ├── Users/
│       │   ├── CreateUserRequest.php
│       │   └── UpdateUserRequest.php
│       └── ...
├── Libraries/
│   ├── StripeLibrary.php
│   ├── GoogleOAuthLibrary.php
│   ├── MicrosoftOAuthLibrary.php
│   ├── AWSS3Library.php
│   ├── CloudinaryLibrary.php
│   ├── SentryLibrary.php
│   ├── ZapierLibrary.php
│   └── SAMLibrary.php
├── Models/
│   ├── User.php
│   ├── Tenant.php
│   ├── Subscription.php
│   ├── Plan.php
│   ├── Payment.php
│   ├── Invoice.php
│   ├── PaymentMethod.php
│   ├── Integration.php
│   ├── IntegrationCredential.php
│   ├── Notification.php
│   ├── AuditLog.php
│   ├── Module.php
│   ├── TenantModule.php
│   ├── AnalyticsEvent.php
│   ├── AnalyticsDaily.php
│   └── AnalyticsWeekly.php
├── Repositories/
│   ├── UserRepository.php
│   ├── TenantRepository.php
│   ├── SubscriptionRepository.php
│   ├── IntegrationRepository.php
│   └── ...
├── Services/
│   ├── AuthService.php
│   ├── UserService.php
│   ├── TenantService.php
│   ├── BillingService.php
│   ├── IntegrationService.php
│   ├── NotificationService.php
│   ├── AuditLogService.php
│   └── AnalyticsService.php
└── Providers/
    └── AppServiceProvider.php

config/
├── jwt.php
├── permission.php
└── ...

database/
├── migrations/
│   ├── 2024_01_01_000001_create_users_table.php
│   ├── 2024_01_01_000002_create_tenants_table.php
│   ├── 2024_01_01_000003_create_subscriptions_table.php
│   ├── 2024_01_01_000004_create_payments_table.php
│   ├── 2024_01_01_000005_create_integrations_table.php
│   └── ...
└── seeders/
    ├── DatabaseSeeder.php
    ├── PermissionSeeder.php
    ├── RoleSeeder.php
    └── PlanSeeder.php

routes/
├── api.php
└── web.php
```

---

## 🚀 Getting Started

### Installation Steps

1. **Install Laravel**
```bash
composer create-project laravel/laravel dashsphere-backend
cd dashsphere-backend
```

2. **Install Required Packages**
```bash
composer require tymon/jwt-auth
composer require spatie/laravel-permission
```

3. **Publish Configurations**
```bash
php artisan vendor:publish --provider="Tymon\JWTAuth\Providers\LaravelServiceProvider"
php artisan vendor:publish --provider="Spatie\Permission\PermissionServiceProvider"
php artisan jwt:secret
```

4. **Run Migrations**
```bash
php artisan migrate
```

5. **Seed Permissions & Roles**
```bash
php artisan db:seed --class=PermissionSeeder
php artisan db:seed --class=RoleSeeder
```

6. **Create Super Admin User**
```bash
php artisan tinker
>>> $user = User::create(['name' => 'Super Admin', 'email' => 'admin@dashsphere.com', 'password' => bcrypt('password'), 'role' => 'super_admin']);
>>> $user->assignRole('super_admin');
```

---

## 📝 Notes

1. **All endpoints must return standardized response format**
2. **All third-party credentials must be encrypted before storage**
3. **All database queries must be tenant-scoped (except super-admin)**
4. **All permissions must be checked via middleware**
5. **All errors must be logged in audit_logs table**
6. **All third-party API calls must be in Libraries folder**
7. **All business logic must be in Services folder**
8. **All database queries must be in Repositories folder**

---

## 🔄 Request Flow Example

### Example: Create User Endpoint

```
1. Request: POST /api/v1/users
   Headers: Authorization: Bearer {token}
   Body: {name, email, password, role}

2. Middleware: auth:api
   - Validates JWT token
   - Sets authenticated user

3. Middleware: tenant.context
   - Extracts tenant from user
   - Sets tenant context

4. Middleware: permission:users:create
   - Checks if user has 'users:create' permission
   - Returns 403 if not authorized

5. Controller: UserController@store
   - Validates request (CreateUserRequest)
   - Calls UserService::createUser()

6. Service: UserService::createUser()
   - Business logic validation
   - Calls UserRepository::create()

7. Repository: UserRepository::create()
   - Database insert query
   - Returns created user

8. Service: UserService::createUser()
   - Creates audit log
   - Sends notification
   - Returns user data

9. Controller: UserController@store
   - Formats response using ResponseHelper::success()

10. Response:
    {
        "status_code": 201,
        "message": "Success",
        "error": false,
        "data": {
            "user": {...}
        }
    }
```

---

## ✅ Checklist for Development

- [ ] Set up Laravel project
- [ ] Install JWT Auth
- [ ] Install Spatie Permissions
- [ ] Create all database migrations
- [ ] Create all models with relationships
- [ ] Create ResponseHelper
- [ ] Create all middleware
- [ ] Create all repositories
- [ ] Create all services
- [ ] Create all controllers
- [ ] Create all request validators
- [ ] Create all routes with middleware
- [ ] Create all libraries for third-party integrations
- [ ] Seed permissions and roles
- [ ] Test all endpoints
- [ ] Implement audit logging
- [ ] Implement tenant isolation
- [ ] Implement credential encryption

---

**End of Documentation**

