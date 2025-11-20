# 🌱 HuertoHogar Backend

<div align="center">

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![Node](https://img.shields.io/badge/node-%3E%3D14.0.0-brightgreen.svg)
![License](https://img.shields.io/badge/license-ISC-green.svg)
![Express](https://img.shields.io/badge/express-4.18.2-lightgrey.svg)
![Supabase](https://img.shields.io/badge/supabase-2.81.1-orange.svg)

**API REST para la gestión de huertos en el hogar**

[Características](#-características) • [Instalación](#-instalación) • [Documentación](#-documentación-de-la-api) • [Desarrolladores](#-desarrolladores)

</div>

---

## 📋 Tabla de Contenidos

- [Descripción](#-descripción)
- [Características](#-características)
- [Tecnologías](#-tecnologías)
- [Requisitos Previos](#-requisitos-previos)
- [Instalación](#-instalación)
- [Configuración](#-configuración)
- [Uso](#-uso)
- [Documentación de la API](#-documentación-de-la-api)
- [Estructura del Proyecto](#-estructura-del-proyecto)
- [Despliegue](#-despliegue)
- [Desarrolladores](#-desarrolladores)
- [Licencia](#-licencia)

---

## 🎯 Descripción

**HuertoHogar Backend** es una API REST desarrollada con Node.js y Express que proporciona los servicios necesarios para gestionar un sistema de huertos en el hogar. La aplicación permite a los usuarios registrarse, autenticarse, gestionar productos, categorías y realizar operaciones administrativas de manera segura y eficiente.

La API está diseñada para ser escalable, segura y fácil de mantener, utilizando Supabase como base de datos y JWT para la autenticación de usuarios.

---

## ✨ Características

- 🔐 **Autenticación y Autorización**: Sistema completo de registro, login y gestión de tokens JWT
- 📦 **Gestión de Productos**: CRUD completo para productos con soporte para múltiples usuarios
- 🏷️ **Categorías**: Sistema de categorización de productos
- 👥 **Gestión de Usuarios**: Endpoints administrativos para gestión de usuarios
- 🛡️ **Seguridad**: Middleware de autenticación y control de roles
- 🚀 **Despliegue en Vercel**: Configuración lista para producción
- 📊 **Health Check**: Endpoint para monitoreo del estado del servidor
- 🔒 **Validación**: Manejo robusto de errores y validaciones

---

## 🛠️ Tecnologías

### Dependencias Principales

| Tecnología | Versión | Propósito |
|------------|---------|-----------|
| **Express** | ^4.18.2 | Framework web para Node.js |
| **@supabase/supabase-js** | ^2.81.1 | Cliente de Supabase para base de datos |
| **jsonwebtoken** | ^9.0.2 | Generación y verificación de tokens JWT |
| **bcryptjs** | ^3.0.3 | Encriptación de contraseñas |
| **dotenv** | ^17.2.3 | Gestión de variables de entorno |

### Dependencias de Desarrollo

| Tecnología | Versión | Propósito |
|------------|---------|-----------|
| **nodemon** | ^3.1.11 | Reinicio automático del servidor en desarrollo |

---

## 📦 Requisitos Previos

Antes de comenzar, asegúrate de tener instalado:

- **Node.js** (versión 14.0.0 o superior)
- **npm** (versión 6.0.0 o superior) o **yarn**
- Una cuenta de **Supabase** con un proyecto configurado
- **Git** para clonar el repositorio

---

## 🚀 Instalación

### 1. Clonar el Repositorio

```bash
git clone https://github.com/tu-usuario/huerto-hogar-backend.git
cd huerto-hogar-backend
```

### 2. Instalar Dependencias

```bash
npm install
```

### 3. Configurar Variables de Entorno

Crea un archivo `.env` en la raíz del proyecto con las siguientes variables:

```env
# Puerto del servidor
PORT=5000

# Configuración de Supabase
SUPABASE_URL=tu_url_de_supabase
SUPABASE_KEY=tu_clave_de_supabase

# JWT Secret
JWT_SECRET=tu_secret_jwt_muy_seguro

# Entorno
NODE_ENV=development
```

> ⚠️ **Importante**: Nunca subas el archivo `.env` al repositorio. Asegúrate de que esté en tu `.gitignore`.

---

## ⚙️ Configuración

### Configuración de Supabase

1. Crea un proyecto en [Supabase](https://supabase.com)
2. Obtén tu URL y API Key desde la configuración del proyecto
3. Configura las tablas necesarias en tu base de datos:
   - `users`
   - `products`
   - `categories`

### Configuración de JWT

Genera un secret seguro para JWT. Puedes usar el siguiente comando:

```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

---

## 💻 Uso

### Modo Desarrollo

```bash
npm run dev
```

El servidor se iniciará en `http://localhost:5000` con reinicio automático usando nodemon.

### Modo Producción

```bash
npm start
```

El servidor se iniciará en el puerto especificado en la variable de entorno `PORT` o en el puerto 5000 por defecto.

### Verificar Instalación

Una vez iniciado el servidor, puedes verificar que funciona correctamente visitando:

- **Raíz**: `http://localhost:5000/`
- **Health Check**: `http://localhost:5000/health`

---

## 📚 Documentación de la API

### Base URL

```
http://localhost:5000/api
```

### Endpoints Disponibles

#### 🔐 Autenticación (`/api/auth`)

| Método | Endpoint | Descripción | Autenticación |
|--------|----------|-------------|---------------|
| `POST` | `/register` | Registro de nuevo usuario | No |
| `POST` | `/login` | Inicio de sesión | No |

#### 📦 Productos (`/api/products`)

| Método | Endpoint | Descripción | Autenticación |
|--------|----------|-------------|---------------|
| `GET` | `/` | Obtener todos los productos | No |
| `GET` | `/:id` | Obtener producto por ID | No |
| `GET` | `/my-products` | Obtener mis productos | Sí |
| `POST` | `/` | Crear nuevo producto | Sí |
| `PUT` | `/:id` | Actualizar producto | Sí |
| `DELETE` | `/:id` | Eliminar producto | Sí |

#### 🏷️ Categorías (`/api/categories`)

| Método | Endpoint | Descripción | Autenticación |
|--------|----------|-------------|---------------|
| `GET` | `/` | Obtener todas las categorías | No |
| `GET` | `/:categoryName/products` | Obtener productos por categoría | No |

#### 👥 Usuarios (`/api/users`)

| Método | Endpoint | Descripción | Autenticación |
|--------|----------|-------------|---------------|
| `GET` | `/` | Obtener todos los usuarios (Admin) | Sí (Admin) |
| `GET` | `/:id` | Obtener usuario por ID (Admin) | Sí (Admin) |

### Ejemplo de Uso

#### Registro de Usuario

```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "usuario@example.com",
    "password": "password123",
    "name": "Juan Pérez"
  }'
```

#### Login

```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "usuario@example.com",
    "password": "password123"
  }'
```

#### Crear Producto (con autenticación)

```bash
curl -X POST http://localhost:5000/api/products \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer TU_TOKEN_JWT" \
  -d '{
    "name": "Tomate",
    "description": "Tomates orgánicos",
    "price": 5.99,
    "category": "Vegetales"
  }'
```

---

## 📁 Estructura del Proyecto

```
huerto-hogar-backend/
│
├── 📂 api/
│   └── 📄 index.js                    # Punto de entrada principal de la aplicación
│                                       # Configura Express, middlewares, rutas y manejo de errores
│                                       # Exporta la app para Vercel Serverless Functions
│
├── 📂 config/
│   └── 📄 supabase.js                 # Configuración y cliente de Supabase
│                                       # Inicializa la conexión con la base de datos
│                                       # Utiliza Service Role Key para bypass de RLS
│
├── 📂 controllers/
│   ├── 📄 authController.js           # Controlador de autenticación
│   │                                   # - register: Registro de nuevos usuarios
│   │                                   # - login: Inicio de sesión y generación de JWT
│   │
│   ├── 📄 categoryController.js       # Controlador de categorías
│   │                                   # - getAllCategories: Lista todas las categorías
│   │                                   # - getProductsByCategory: Filtra productos por categoría
│   │
│   └── 📄 productController.js        # Controlador de productos
│                                       # - createProduct: Crea un nuevo producto
│                                       # - getAllProducts: Lista todos los productos
│                                       # - getProductById: Obtiene un producto específico
│                                       # - updateProduct: Actualiza un producto existente
│                                       # - deleteProduct: Elimina un producto
│                                       # - getMyProducts: Obtiene productos del usuario autenticado
│
├── 📂 middleware/
│   └── 📄 auth.js                     # Middleware de autenticación y autorización
│                                       # - verifyToken: Verifica y valida tokens JWT
│                                       # - checkRole: Valida roles de usuario (admin, user, etc.)
│                                       # Extrae información del usuario del token
│
├── 📂 models/                         # Modelos de datos (actualmente vacío)
│                                       # Preparado para futuros modelos de datos si se requieren
│
├── 📂 routes/
│   ├── 📄 auth.js                     # Rutas de autenticación
│   │                                   # POST /api/auth/register
│   │                                   # POST /api/auth/login
│   │
│   ├── 📄 categories.js               # Rutas de categorías (públicas)
│   │                                   # GET /api/categories
│   │                                   # GET /api/categories/:categoryName/products
│   │
│   ├── 📄 products.js                 # Rutas de productos
│   │                                   # GET /api/products (público)
│   │                                   # GET /api/products/:id (público)
│   │                                   # GET /api/products/my/products (protegido)
│   │                                   # POST /api/products (protegido)
│   │                                   # PUT /api/products/:id (protegido)
│   │                                   # DELETE /api/products/:id (protegido)
│   │
│   └── 📄 users.js                    # Rutas de usuarios (protegidas)
│                                       # GET /api/users/me (perfil del usuario actual)
│                                       # GET /api/users (solo admin - lista todos los usuarios)
│
├── 📄 test-connection.js              # Script de prueba de conexión a Supabase
│                                       # Utilidad para verificar la configuración de la BD
│
├── 📄 .env                            # Variables de entorno (NO incluido en git)
│                                       # Contiene: PORT, SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, JWT_SECRET
│
├── 📄 .gitignore                      # Archivos y carpetas ignorados por Git
│                                       # Incluye: node_modules, .env, logs, etc.
│
├── 📄 package.json                    # Configuración del proyecto Node.js
│                                       # Dependencias, scripts y metadatos del proyecto
│
├── 📄 package-lock.json               # Lock file de dependencias npm
│                                       # Asegura versiones consistentes entre entornos
│
├── 📄 vercel.json                     # Configuración de despliegue en Vercel
│                                       # Define el punto de entrada y rutas del servidor
│
└── 📄 README.md                       # Documentación del proyecto (este archivo)
```

### 🔍 Descripción Detallada de Componentes

#### 🚀 **API Layer** (`api/`)
- **`index.js`**: Configuración central de Express, registro de middlewares globales, montaje de rutas, manejo de errores y exportación para Vercel.

#### ⚙️ **Configuración** (`config/`)
- **`supabase.js`**: Inicializa el cliente de Supabase con Service Role Key para operaciones administrativas que requieren bypass de Row Level Security (RLS).

#### 🎮 **Controladores** (`controllers/`)
Contienen la lógica de negocio de cada módulo:
- **Autenticación**: Maneja registro, login y generación de tokens JWT
- **Categorías**: Gestiona la consulta de categorías y filtrado de productos
- **Productos**: Implementa todas las operaciones CRUD para productos

#### 🛡️ **Middleware** (`middleware/`)
- **`auth.js`**: Middleware de seguridad que valida tokens JWT y verifica permisos basados en roles de usuario.

#### 🛣️ **Rutas** (`routes/`)
Definen los endpoints de la API y asocian las rutas HTTP con sus controladores correspondientes, aplicando middlewares de autenticación cuando es necesario.

#### 📝 **Archivos de Configuración**
- **`.env`**: Variables de entorno sensibles (no versionado)
- **`package.json`**: Gestión de dependencias y scripts npm
- **`vercel.json`**: Configuración específica para despliegue en Vercel

### 🔄 Flujo de Petición

```
Cliente → Express (api/index.js) 
       → Middleware (auth.js si es necesario)
       → Route (routes/*.js)
       → Controller (controllers/*.js)
       → Supabase (config/supabase.js)
       → Base de Datos
```

---

## 🌐 Despliegue

### Despliegue en Vercel

Este proyecto está configurado para desplegarse fácilmente en Vercel:

1. **Instalar Vercel CLI** (opcional):
   ```bash
   npm i -g vercel
   ```

2. **Desplegar**:
   ```bash
   vercel
   ```

3. **Configurar Variables de Entorno en Vercel**:
   - Ve a la configuración de tu proyecto en Vercel
   - Agrega las variables de entorno necesarias:
     - `SUPABASE_URL`
     - `SUPABASE_KEY`
     - `JWT_SECRET`
     - `NODE_ENV=production`

El archivo `vercel.json` ya está configurado para que Vercel reconozca correctamente el punto de entrada de la aplicación.

---

## 👨‍💻 Desarrolladores

Este proyecto fue desarrollado con dedicación y profesionalismo por:

<div align="center">

### Jean P. Valenzuela Navarrete
[![GitHub](https://img.shields.io/badge/GitHub-JeanU10-181717?style=for-the-badge&logo=github)](https://github.com/JeanU10)

### Matias E. Reyes Aguilera
[![GitHub](https://img.shields.io/badge/GitHub-MatiasReyes1925-181717?style=for-the-badge&logo=github)](https://github.com/MatiasReyes1925)

</div>

---

## 📝 Licencia

Este proyecto está bajo la Licencia ISC. Ver el archivo `LICENSE` para más detalles.

---

## 🤝 Contribuciones

Las contribuciones son bienvenidas. Por favor:

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

---

## 📧 Contacto

Para preguntas o sugerencias sobre este proyecto, puedes contactar a los desarrolladores a través de sus perfiles de GitHub.

---

<div align="center">

**Hecho con ❤️ para facilitar la gestión de huertos en el hogar**

⭐ Si este proyecto te fue útil, considera darle una estrella

</div>
