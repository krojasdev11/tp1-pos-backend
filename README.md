# POS Almacen Backend

API REST para un pequeno almacen/kiosco con autenticacion JWT, autorizacion por roles, validacion, sanitizacion, rate limiting, logs y SQLite local.

## Requisitos

- Node.js 24 o superior
- npm

## Instalacion

```bash
npm install
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

# POS Almacen Fullstack

Frontend en HTML, Bootstrap y JavaScript para consumir la API REST del proyecto `tp1-pos-backend` conformada por NodeJS y Express.

## Requisitos

- Backend ejecutandose en `http://localhost:3000`
- Un servidor estatico local para abrir los modulos JavaScript

## Ejecucion

1. Iniciar el proyecto:

```bash
npm install
npm run dev
```

3. Abrir:

```
http://localhost:3000
```

## Usuarios de prueba

| Usuario | Password | Rol |
| --- | --- | --- |
| admin | Admin123! | ADMIN |
| empleado | User123! | USER |

## Funcionalidades

- Login y logout con JWT.
- Listado de productos protegido por token.
- Alta, edicion y baja de productos para usuarios `ADMIN`.
- Creacion de ventas para usuarios `ADMIN` y `USER`.
- Reporte de ventas y ventas del dia para usuarios `ADMIN`.
- Conexion con la API del backend en `http://localhost:3000`.

## Estructura

```text
tp1-pos-frontend/
  index.html
  css/
    styles.css
  js/
    api.js
    app.js
    auth.js
    config.js
    dom.js
    products.js
    sales.js
    storage.js
```

