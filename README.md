# POS Almacen Backend

API REST para un pequeno almacen/kiosco con autenticacion JWT, autorizacion por roles, validacion, sanitizacion, rate limiting, logs y SQLite local.

## Requisitos

- Node.js 24 o superior
- npm

## Ejecucion

1. Crear una carpeta.

2. Clonar el repo backend y frontend dentro de la misma carpeta:

```bash
git clone https://github.com/krojasdev11/tp1-pos-backend
git clone https://github.com/krojasdev11/tp1-pos-frontend
```

3. Abrir el proyecto backend e iniciar el proyecto:

```bash
npm install
npm run dev
```

4. Abrir:

```text
http://localhost:3000
```

El servidor queda disponible en `http://localhost:3000`.

## Usuarios iniciales

| Usuario | Password | Rol |
|----------|----------|----------|
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
    {
      "product_id": 1,
      "quantity": 2
    }
  ],
  "payment": 5000
}
```

---

# POS Almacen Front End

Frontend en HTML, CSS y JavaScript para consumir la API REST del proyecto `tp1-pos-backend` conformada por NodeJS y Express.

## Requisitos

- Backend del siguiente repositorio:
  - https://github.com/krojasdev11/tp1-pos-backend

- Ejecutandose en:

```text
http://localhost:3000
```

## Ejecucion

1. Crear una carpeta.

2. Clonar el repo backend y frontend dentro de la misma carpeta:

```bash
git clone https://github.com/krojasdev11/tp1-pos-backend
git clone https://github.com/krojasdev11/tp1-pos-frontend
```

3. Abrir el proyecto backend e iniciar el proyecto:

```bash
npm install
npm run dev
```

4. Abrir el frontend:

```text
http://localhost:5500
```

## Usuarios de prueba

| Usuario | Password | Rol |
|----------|----------|----------|
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
├── index.html
├── css/
│   └── styles.css
└── js/
    ├── api.js
    ├── app.js
    ├── auth.js
    ├── config.js
    ├── dom.js
    ├── products.js
    ├── sales.js
    └── storage.js
```