# GreenSlack — API

# !!! Porfavor leer con atencion.

# Descripcion del Proyecto

API REST de una aplicación de mensajería colaborativa estilo Slack. Permite crear workspaces, organizarlos en canales y comunicarse mediante mensajes de canal o mensajes directos entre miembros.

## Caracteristicas del Proyecto
- **Web App Full-Stack**: Frontend desarrollado en React (Vite) + Typescript, y Backend en Node.js + Express.
- **Arquitectura en Capas**: Estricta separación de responsabilidades en `routes → controllers → services → repository` + `models` y `middlewares`.
- **Autenticación Segura**: Implementación de Hashing con Bcrypt, JSON Web Tokens (JWT) con expiración, y confirmación obligatoria de cuentas por Email.
- **Base de Datos Relacional (NoSQL)**: Uso de MongoDB + Mongoose con relaciones complejas y `.populate()` (Workspaces -> Channels -> Messages -> Members).
- **CRUD Completo**: La entidad principal (Workspace) y las entidades relacionadas (Canales, Mensajes, Miembros) poseen operaciones completas de Crear, Leer, Actualizar y Eliminar.
- **Middlewares**: Se incluyen Middlewares para CORS, validación de esquemas (Inputs), manejo centralizado de errores (`errorHandler`) y verificación JWT.
- **Manejo de Variables de Entorno**: Uso seguro de `.env` en Frontend y Backend.
- **Envío de Correos**: Integración robusta con `Nodemailer` para registro, recuperación de contraseña e invitaciones.
- **UI Responsiva**: Interfaz adaptativa probada desde pantallas móviles pequeñas (320px) hasta monitores UltraWide (2000px+).

## Características Adicionales (Bonus) 🚀
Se ha ido mucho más allá de los requisitos básicos, implementando lógicas avanzadas propias de una aplicación SaaS real:
- **Mensajería Directa (DM)**: Chat privado 1 a 1 entre miembros del espacio de trabajo.
- **Control de Acceso Basado en Roles (RBAC)**: Diferenciación de permisos internos en cada Workspace (`Owner`, `Admin`, `Member`). Por ejemplo, solo el Owner puede borrar el Workspace, y solo los Admins pueden invitar.
- **Invitaciones por Magic Links**: Sistema para invitar a nuevos usuarios al workspace enviando un link único al correo, el cual permite Aceptar/Rechazar al instante.
- **Tematización Dinámica**: Soporte completo de Modo Oscuro / Modo Claro gestionado mediante React Context y CSS Variables nativas.
- **Cambio de Email Seguro**: Flujo de seguridad estricto que requiere la contraseña actual y confirmación al nuevo correo para cambiar el email del perfil.
- **Borrado en Cascada (Cascade Delete)**: Al eliminar una cuenta de usuario o un workspace, un script interno se encarga de purgar todas las referencias, mensajes y canales asociados para no dejar bases de datos huérfanas.
- **Simulación Real-Time**: Polling integrado en el chat para sincronizar mensajes en tiempo real, adaptado a las limitaciones "Serverless" del despliegue en Vercel.
- **Modal Navigation Móvil**: Sistema de navegación bottom-sheet profesional en dispositivos móviles.

## Autenticación
- Las rutas protegidas requieren un **Bearer Token** en el header
- El token se obtiene al hacer login.

## Verificacion
- Existe verificacion del tipo de datos en ambos lados: 
  - desde el frontend antes de realizar consulta a la API  
  - desde la API al recibir la consulta


## Cuenta de Prueba
Password: IcmC7ZbR7DpaBUXCOKntkDW
Email: slackgreenslack@gmail.com

## URLS:

URL Deploy Frontend = https://greenslack.vercel.app/
URL Deploy Backend = https://2025-pwa-tt-mar-lun-mier-backend-he.vercel.app/
URL Repo Frontend = https://github.com/Hentrixs/2025_PWA_TT_MAR_LUN_MIER_FRONTEND_HENTRIXS
URL Repo Backend = https://github.com/Hentrixs/2025_PWA_TT_MAR_LUN_MIER_BACKEND_HENTRIXS
---

## Instrucciones para el Postman
El archivo `GreenSlack.postman_collection.json` contiene los endpoints junto con la URL de la API predefinida. 
Solo hay que importarlo en Postman, generar un token desde el endpoint 'Login' (en la carpeta Auth) y pegarlo en la variable `token` de la colección para autorizar las demás solicitudes.

## Tecnologias Usadas
- Javascript [Backend]
- Typescript (TSX) [Frontend]
- React + Vite [Frontend]
- Node.js + Express 5 [Backend]
- MongoDB + Mongoose [Backend]
- CSS [Frontend]
- JWT [Backend] 
- Bcrypt [Backend]
- Nodemailer[Backend]
- CORS [Backend]
- Dotenv [Backend]
- Deploy en **Vercel** [Frontend-Backend]

## Uso de IA
- Se han usado las IA ( Claude Code y Google Gemini 3 Pro ) Para:
  - Estandarizacion de Etiquetas CSS
  - Automatizacion de Procesos Repetitivos
  - Estandarizacion de Componentes TSX
  - Debuggear Codigo 
  - Redaccion de Documentacion
  - Todos los procesos realizados por la IA son procesos que el usuario automatizo para agilizar tiempo porque son tediosos 

---


## Roles

| Rol      | Permisos                                                                    |
|----------|-----------------------------------------------------------------------------|
| `owner`  |   Control total del workspace. Puede eliminarlo y gestionar todos los roles |
| `admin`  |   Crear/editar/eliminar canales, invitar y administrar miembros             |
| `member` |  Leer canales, enviar y editar sus propios mensajes                         |


## Endpoints

Importante!!!: en el Repo del Backend esta el JSON con los endpoints para importarlo en el Postman.

### Auth — `/api/auth`

| Método | Ruta                                | Auth | Body                          | Descripción |
|--------|-------------------------------------|--------------------------------------|-------------|-------------------------------------|
| POST   | `/register`                         | No   | `name`, `email`, `password`   | Registrar usuario. Envía email de verificación    |
| POST   | `/login`                            | No   | `email`, `password`           | Login. Devuelve JWT                               |
| GET    | `/verify-email?verify_email_token=X`| No   |                               | Verificar cuenta desde el link del email          |
| POST   | `/reset-password-request`           | No   | `email`                       | Solicitar reset de contraseña por email           |
| POST   | `/reset-password/:token`            | No   | `new_password`                | Confirmar nueva contraseña con el token del email |
| PUT    | `/update_password`                  | Sí   | `old_password`, `new_password`| Cambiar contraseña                                |
| PATCH  | `/update-profile`                   | Sí   | `name`, `description`         | Actualizar perfil                                 |
| GET    | `/profile`                          | Sí   |                               | Obtener perfil del usuario autenticado            |
| POST   | `/request-email-change`             | Sí   | `password`, `new_email`       | Solicitar cambio de email                         |
| GET    | `/confirm-email-change/:token`      | No   |                               | Confirmar cambio de email desde el link           |
| DELETE | `/delete-account`                   | Sí   | `password`                    | Eliminar cuenta                                   |



### Workspaces — `/api/workspace`

| Método | Ruta                             | Rol         | Body                   | Descripción |
|--------|----------------------------------|-------------|------------------------|-----------------------------------------------------------|
| GET    | `/`                              | Autenticado |                        | Listar workspaces del usuario                             |
| POST   | `/`                              | Autenticado | `title`, `description` | Crear workspace                                           |
| GET    | `/:workspace_id/workspaceDetail` | member      |                        | Detalle del workspace + miembros                          |
| PATCH  | `/:workspace_id`                 | admin       | `title`, `description` | Editar workspace                                          |
| DELETE | `/:workspace_id`                 | owner       |                        | Eliminar workspace (cascada: canales, mensajes, miembros) |



### Canales — `/api/workspace/:workspace_id/channel`

| Método | Ruta           | Rol    | Body                  | Descripción                   |
|--------|----------------|--------|-----------------------|-------------------------------|
| GET    | `/`            | member | —                     | Listar canales                |
| POST   | `/`            | admin  | `name`, `description` | Crear canal                   |
| PATCH  | `/:channel_id` | admin  | `name`, `description` | Editar canal                  |
| DELETE | `/:channel_id` | admin  | —                     | Eliminar canal y sus mensajes |

---

### Mensajes de Canal — `/api/workspace/:workspace_id/channel/:channel_id/message`

| Método  | Ruta          | Body       | Descripción                      |
|---------|----------------|-----------|----------------------------------|
| GET     | `/`            | —         | Historial de mensajes            |
| POST    | `/`            | `content` | Enviar mensaje                   |
| PATCH   | `/:message_id` | `content` | Editar mensaje (solo el autor)   |
| DELETE  | `/:message_id` | —         | Eliminar mensaje (solo el autor) |

---

### Mensajes Directos — `/api/workspace/:workspace_id/dm`

| Método | Ruta | Body | Descripción |
|--------|------------------------------------------|-----------|---------------------------------|  
| GET    | `/:other_member_id`                      |           | Historial de conversación       |
| POST   | `/:other_member_id`                      | `content` | Enviar mensaje directo          |
| PATCH  | `/:other_member_id/message/:message_id`  | `content` | Editar mensaje (solo el autor)  |

---

### Miembros — `/api/workspace/:workspace_id/member`

| Método | Ruta          | Rol    | Body            | Descripción                                  |
|--------|---------------|--------|-----------------|----------------------------------------------|
| GET    | `/`           | member |                 | Listar miembros                              |
| POST   | `/invite`     | admin  | `email`, `role` | Invitar por email (envía link de aceptación) |
| PUT    | `/:member_id` | admin  | `role`          | Cambiar rol                                  |
| DELETE | `/:member_id` | member |                 | Expulsar miembro                             |

---

### Invitaciones — `/api/invitation`

| Método | Ruta               | Auth | Descripción                                      |
|--------|--------------------|------|--------------------------------------------------|
| GET    | `/respond?token=X` | No   | Aceptar o rechazar una invitación desde el email |

---

## Ejemplo de uso

### Registrarse

```http
POST /api/auth/register
Content-Type: application/json

{
  "name": "Juan Pérez",
  "email": "juan@example.com",
  "password": "miPassword123"
}
```

```json
{ "ok": true, "message": "Usuario creado. Revisa tu email para verificar tu cuenta." }
```

### Iniciar sesión

```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "juan@example.com",
  "password": "miPassword123"
}
```

```json
{ "ok": true, "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." }
```

---

## Arquitectura

```
src/
├── config/        # MongoDB, Nodemailer, variables de entorno
├── controllers/   # Manejan req/res
├── services/      # Lógica de negocio (JWT, bcrypt, emails)
├── repository/    # Queries Mongoose
├── models/        # Esquemas de la base de datos
├── routes/        # Definición de endpoints
├── middlewares/   # Auth, validación, RBAC, manejo de errores
└── main.js        # Entry point
```
