# POS Almacen Backend

API REST para un pequeno almacen/kiosco con autenticacion JWT, autorizacion por roles, validacion, sanitizacion, rate limiting, logs y SQLite local.

## Requisitos

- Node.js 24 o superior
- npm

## Instalacion

```bash
npm install
Copy-Item .env.example .env
npm run seed
npm run dev
```

El servidor queda disponible en `http://localhost:3000`.

## Usuarios iniciales

| Usuario | Password | Rol |
| --- | --- | --- |
| admin | Admin123! | ADMIN |
| empleado | User123! | USER |

## Endpoints principales

- `POST /auth/login`
- `GET /products`
- `GET /products?category=gaseosas`
- `POST /products` solo `ADMIN`
- `PUT /products/:id` solo `ADMIN`
- `DELETE /products/:id` solo `ADMIN`
- `POST /sales` `USER` y `ADMIN`
- `GET /sales` solo `ADMIN`
- `GET /sales/daily` solo `ADMIN`

Enviar el token como:

```http
Authorization: Bearer <token>
```

## Ejemplo de venta

```json
{
  "items": [
    { "product_id": 1, "quantity": 2 }
  ],
  "payment": 5000
}
```
