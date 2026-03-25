# Notas de Seguridad

- El backend: solo puede confiar en sí mismo, el frontend siempre miente, con lo cual las validaciones son importantes porque no se puede confiar en el cliente. 


- Para esto se puede usar JWT
JWT transforma objetos en base64 (o sea texto), 
JWT se usa para transferencia de datos, 
se pueden firmar los objetos, 
el JWT se conforma de Payload (carga util) y Signature(la firma)
y los headers (como se genero el token) 

- La clave super secreta se puede transformar en signature pero no al reves y es por eso que sirve de firma

- el payload no es mas que el email y nombre (datos) del usuario

# Notas 
- los helpers (ayudantes) son archivos donde guardamos herramientas "genéricas" que vamos a reutilizar en varias partes del código. En tu caso, crearon un ServerError. Como lanzar errores con un código HTTP (ej. 400, 404) es algo que haces en todas partes, lo pones en un helper para no repetir código. Ejemplo:

    class ServerError extends Error{
        constructor(message, status){
            super(message)                  // que hacia el super()?
            this.status = status
        }
    }

    export default ServerError


# Tarea

Una buena forma de practicar todo esto es hacer el 
flujo de restablecimiento de contrasenias

POST /api/auth/reset-password-request 
    body: {email}

    Esto enviara un mail al email proporcionado con un link restablecer la password
    
    Ese link tendra un JWT firmado con datos del usuario como el email 
    o id

// al hacer click en el enlace del mail, esto redireccionara a un get con un formulario
// que me permita hacer el POST de abajo.

Por otro lado desarrollaran el 
(el :reset_token es el JWT que lo pasaremos por aca)
POST /api/auth/reset-password/:reset_token
    body: {new_password}
    El backend valida el token enviado y la nueva contrasenia   
    Si todo esta bien, cambia la password

- la consultas del servidor tienen que tener un estado de error - uno de loading - y uno de response
