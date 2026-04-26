# GreenSlack — Backend API

API REST de una aplicación de mensajería colaborativa estilo Slack. Permite crear workspaces, organizarlos en canales y comunicarse mediante mensajes de canal o mensajes directos entre miembros.

URL Deploy =
URL Repo Frontend = 
URL Repo Backend =
---

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

## Autenticación
- Las rutas protegidas requieren un **Bearer Token** en el header
- El token se obtiene al hacer login.

## Verificacion
- Existe verificacion del tipo de datos en ambos lados: 
  - desde el frontend antes de realizar consulta a la API  
  - desde la API al recibir la consulta

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
