Sistema POS Full Stack - Gestión de Almacén

Sistema de gestión de productos y ventas desarrollado como aplicación Full Stack utilizando Node.js, Express, SQLite y JavaScript. El proyecto implementa autenticación JWT, control de acceso por roles (RBAC), validaciones, sanitización de datos y buenas prácticas de seguridad tanto en backend como en frontend.

Tecnologías Utilizadas
Backend
Node.js
Express.js
SQLite
JWT (JSON Web Token)
bcrypt
express-validator
Rate Limiting
Middleware de logs
Frontend
HTML5
CSS3
JavaScript ES Modules
Fetch API
Arquitectura del Sistema
Frontend (HTML + CSS + JavaScript)
                |
                | Authorization: Bearer <token>
                v
Backend (Node.js + Express)
                |
                v
           SQLite

El frontend consume la API REST del backend mediante peticiones HTTP autenticadas con JWT.

Funcionalidades Implementadas
Autenticación
Login mediante usuario y contraseña.
Generación de JWT.
Logout.
Protección de rutas mediante token.
Almacenamiento del token en sessionStorage.
Gestión de Productos
Listado de productos.
Búsqueda por categoría.
Alta de productos (ADMIN).
Modificación de productos (ADMIN).
Eliminación de productos (ADMIN).
Gestión de Ventas
Creación de ventas.
Carrito de compras.
Actualización automática del stock.
Consulta de ventas (ADMIN).
Reportes
Reporte general de ventas.
Reporte de ventas del día.
Acceso restringido a usuarios ADMIN.
Seguridad
Autenticación JWT.
Autorización basada en roles (RBAC).
Validación de datos en backend.
Validación de formularios en frontend.
Sanitización de entradas.
Protección contra XSS utilizando textContent y creación segura de nodos DOM.
No se utiliza innerHTML con datos dinámicos.
Manejo controlado de errores.
No se exponen stack traces ni detalles internos.
Rate Limiting para protección básica contra abuso.
Contraseñas almacenadas mediante hash.
Roles del Sistema
Rol	Permisos
ADMIN	Gestionar productos, registrar ventas y consultar reportes
USER	Consultar productos y registrar ventas
Usuarios de Prueba
Usuario	Contraseña	Rol
admin	Admin123!	ADMIN
empleado	User123!	USER
Instalación
1. Clonar el repositorio
git clone <url-del-repositorio>
cd tp1-pos-backend
2. Instalar dependencias
npm install
3. Inicializar datos de prueba (opcional)
npm run seed
4. Ejecutar el backend
npm run dev

Servidor:

http://localhost:3000
Ejecución del Frontend

Abrir el frontend mediante un servidor estático.

Por ejemplo utilizando VS Code y Live Server:

http://localhost:5500

El frontend se conecta automáticamente con:

http://localhost:3000
Endpoints Principales
Autenticación
POST /auth/login
Productos
GET    /products
GET    /products?category=gaseosas
POST   /products
PUT    /products/:id
DELETE /products/:id
Ventas
POST /sales
GET  /sales
GET  /sales/daily
Uso del Token JWT

Todas las rutas protegidas requieren el encabezado:

Authorization: Bearer <token>

Ejemplo:

GET /products
Authorization: Bearer eyJhbGciOi...
Ejemplo de Venta
{
  "items": [
    {
      "product_id": 1,
      "quantity": 2
    }
  ],
  "payment": 5000
}
Estructura del Proyecto
tp1-pos-backend/
│
├── src/
├── database/
├── middleware/
├── routes/
├── services/
└── ...
│
└── tp1-pos-frontend/
    │
    ├── index.html
    ├── css/
    │   └── styles.css
    │
    └── js/
        ├── api.js
        ├── app.js
        ├── auth.js
        ├── config.js
        ├── dom.js
        ├── products.js
        ├── sales.js
        └── storage.js
Verificaciones Realizadas
Login funcional con JWT.
Control de acceso por roles.
CRUD de productos operativo.
Registro de ventas funcional.
Reportes funcionando correctamente.
Backend validado mediante endpoint /health.
Frontend probado en navegador.
Módulos JavaScript verificados con node --check.
Revisión de uso de innerHTML, eval y almacenamiento inseguro.
Manejo de errores validado sin exposición de información sensible.