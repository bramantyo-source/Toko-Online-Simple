# 🛒 LapakSimpel - Toko Online Sederhana

[![Node.js](https://img.shields.io/badge/Node.js-18.x-green.svg)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express-5.x-blue.svg)](https://expressjs.com/)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

> **Proyek Tugas Kuliah Keamanan Aplikasi Web**  
> Implementasi Secure Coding pada Aplikasi E-Commerce Sederhana

![LapakSimpel Preview](https://via.placeholder.com/800x400/6366f1/ffffff?text=LapakSimpel+-+Toko+Online+Simpel)

---

## 📋 Daftar Isi

- [Tentang Proyek](#-tentang-proyek)
- [Fitur Keamanan](#-fitur-keamanan)
- [Teknologi](#-teknologi)
- [Instalasi](#-instalasi)
- [Struktur Proyek](#-struktur-proyek)
- [API Endpoints](#-api-endpoints)
- [Demo Accounts](#-demo-accounts)
- [Screenshots](#-screenshots)
- [Kontributor](#-kontributor)

---

## 🎯 Tentang Proyek

**LapakSimpel** adalah aplikasi toko online sederhana yang dibangun dengan fokus pada **Secure Coding Practices**. Proyek ini dibuat sebagai tugas mata kuliah Keamanan Aplikasi Web untuk mendemonstrasikan implementasi berbagai fitur keamanan pada aplikasi web.

### Fitur Utama:
- ✅ Registrasi & Login User
- ✅ Katalog Produk dengan Filter Kategori
- ✅ Sistem Checkout (Protected)
- ✅ Referral System
- ✅ Admin Dashboard
- ✅ User Profile Page

---

## 🔐 Fitur Keamanan

Proyek ini mengimplementasikan **10 fitur keamanan** sesuai standar OWASP:

| No | Fitur | Deskripsi | Status |
|----|-------|-----------|--------|
| 1 | **Password Hashing** | bcrypt dengan 12 rounds | ✅ Aktif |
| 2 | **Password Validation** | Min 8 char + special character | ✅ Aktif |
| 3 | **Rate Limiting** | 5 request / 15 menit untuk login | ✅ Aktif |
| 4 | **Security Headers** | Helmet.js dengan CSP | ✅ Aktif |
| 5 | **JWT Authentication** | Token-based auth, expire 24 jam | ✅ Aktif |
| 6 | **Role-Based Access Control** | ROLE_CUSTOMER & ROLE_ADMIN | ✅ Aktif |
| 7 | **Input Validation** | express-validator | ✅ Aktif |
| 8 | **CSRF Protection** | Token-based, single use | ⚠️ Ready |
| 9 | **Custom Error Pages** | Tidak expose stack trace | ✅ Aktif |
| 10 | **Environment Variables** | Secrets tidak di-hardcode | ✅ Aktif |

### Detail Implementasi:

#### 1. Password Hashing (bcrypt)
```javascript
const hashedPassword = await bcrypt.hash(password, 12);
```

#### 2. Rate Limiting
```javascript
const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 menit
    max: 5 // maksimal 5 percobaan
});
```

#### 3. Security Headers (Helmet)
```javascript
app.use(helmet({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            scriptSrc: ["'self'", "'unsafe-inline'", "https://cdn.tailwindcss.com"],
            // ...
        }
    }
}));
```

#### 4. Role-Based Access Control
```javascript
router.get('/dashboard', authenticateToken, authorizeRole('ROLE_ADMIN'), adminController.getDashboard);
```

---

## 🛠 Teknologi

| Kategori | Teknologi |
|----------|-----------|
| **Backend** | Node.js, Express.js 5 |
| **Security** | bcrypt, helmet, express-rate-limit, jsonwebtoken |
| **Validation** | express-validator |
| **Frontend** | HTML5, TailwindCSS, Vanilla JavaScript |
| **Database** | JSON File (untuk demo) |

---

## 🚀 Instalasi

### Prerequisites
- Node.js 18.x atau lebih baru
- npm atau yarn

### Langkah Instalasi

1. **Clone repository**
   ```bash
   git clone https://github.com/username/toko-online-simpel.git
   cd toko-online-simpel
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Konfigurasi environment**
   ```bash
   cp .env.example .env
   ```
   
   Edit file `.env`:
   ```env
   PORT=3000
   JWT_SECRET=your_super_secret_key_here
   BCRYPT_ROUNDS=12
   RATE_LIMIT_WINDOW_MS=900000
   RATE_LIMIT_MAX_ATTEMPTS=5
   ```

4. **Jalankan server**
   ```bash
   node server.js
   ```

5. **Buka browser**
   ```
   http://localhost:3000
   ```

---

## 📁 Struktur Proyek

```
toko-online-simpel/
├── 📁 controllers/           # Business Logic (Controller)
│   ├── authController.js        # Autentikasi (login, register)
│   ├── adminController.js       # Admin features
│   └── orderController.js       # Checkout & orders
│
├── 📁 middleware/            # Security Middleware
│   ├── authMiddleware.js        # JWT verification & RBAC
│   └── csrfMiddleware.js        # CSRF token protection
│
├── 📁 models/                # Data Layer (Model)
│   └── userModel.js             # User CRUD operations
│
├── 📁 routes/                # Route Definitions
│   ├── authRoutes.js            # /api/login, /api/register, /api/profile
│   ├── adminRoutes.js           # /admin/dashboard
│   └── orderRoutes.js           # /api/checkout
│
├── 📁 public/                # Static Files (View)
│   ├── index.html               # Homepage & katalog
│   ├── profile.html             # User profile page
│   └── 404.html                 # Custom error page
│
├── 📁 data/                  # JSON Database
│   └── users.json               # User data storage
│
├── 📄 server.js              # Express entry point
├── 📄 .env.example           # Environment template
├── 📄 .gitignore             # Git ignore rules
├── 📄 package.json           # Dependencies
└── 📄 README.md              # Dokumentasi
```

### Arsitektur MVC

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   Routes    │────▶│ Controllers │────▶│   Models    │
│  (Router)   │     │  (Logic)    │     │   (Data)    │
└─────────────┘     └─────────────┘     └─────────────┘
       │                   │
       ▼                   ▼
┌─────────────┐     ┌─────────────┐
│ Middleware  │     │    Views    │
│ (Security)  │     │   (HTML)    │
└─────────────┘     └─────────────┘
```

---

## 🔌 API Endpoints

### Authentication
| Method | Endpoint | Deskripsi | Auth |
|--------|----------|-----------|------|
| POST | `/api/register` | Daftar user baru | ❌ |
| POST | `/api/login` | Login user | ❌ |
| GET | `/api/profile` | Get user profile | ✅ JWT |

### Orders
| Method | Endpoint | Deskripsi | Auth |
|--------|----------|-----------|------|
| POST | `/api/checkout` | Proses checkout | ✅ JWT |

### Admin
| Method | Endpoint | Deskripsi | Auth |
|--------|----------|-----------|------|
| GET | `/admin/dashboard` | Admin dashboard | ✅ JWT + ROLE_ADMIN |

### CSRF
| Method | Endpoint | Deskripsi | Auth |
|--------|----------|-----------|------|
| GET | `/api/csrf-token` | Generate CSRF token | ❌ |

---

## 👤 Demo Accounts

### Admin Account
```
Email: admin@lapaksimpel.com
Password: Admin@123
Role: ROLE_ADMIN
```

### Customer Account
```
Email: customer@example.com
Password: Test@1234
Role: ROLE_CUSTOMER
```

> ⚠️ **Catatan**: Akun ini hanya untuk demo. Untuk production, gunakan password yang lebih kuat!

---

## 📸 Screenshots

### Homepage
![Homepage](https://via.placeholder.com/600x400/6366f1/ffffff?text=Homepage)

### Login Modal
![Login](https://via.placeholder.com/600x400/8b5cf6/ffffff?text=Login+Modal)

### Product Detail
![Product](https://via.placeholder.com/600x400/ec4899/ffffff?text=Product+Detail)

### Profile Page
![Profile](https://via.placeholder.com/600x400/10b981/ffffff?text=Profile+Page)

---

## 🧪 Testing Security Features

### 1. Test Rate Limiting
```bash
# Jalankan 6x untuk trigger rate limit
for i in {1..6}; do
  curl -X POST http://localhost:3000/api/login \
    -H "Content-Type: application/json" \
    -d '{"email":"test@test.com","password":"wrong"}'
done
```

### 2. Test RBAC
```bash
# Akses admin dashboard dengan token customer (akan gagal)
curl http://localhost:3000/admin/dashboard \
  -H "Authorization: Bearer <customer_token>"
# Response: 403 Forbidden
```

### 3. Test Password Validation
```bash
# Password lemah (akan ditolak)
curl -X POST http://localhost:3000/api/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"123456"}'
```

### 4. Check Security Headers
```bash
curl -I http://localhost:3000
# Lihat headers: X-Content-Type-Options, X-Frame-Options, CSP, dll
```

---

## 📚 Referensi Keamanan

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [OWASP Cheat Sheet Series](https://cheatsheetseries.owasp.org/)
- [Node.js Security Best Practices](https://nodejs.org/en/docs/guides/security/)
- [Express.js Security Best Practices](https://expressjs.com/en/advanced/best-practice-security.html)

---

## 👨‍💻 Kontributor

| Nama | NIM | Role |
|------|-----|------|
| [Nama Anda] | [NIM] | Developer |

---

## 📄 Lisensi

Proyek ini dibuat untuk keperluan **Tugas Mata Kuliah Keamanan Aplikasi Web**.

MIT License © 2026

---

<p align="center">
  Made with ❤️ for Web Security Class
</p>
