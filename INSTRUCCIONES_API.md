# Integración de API Real - OncoSímil AI

## ✅ Cambios Implementados

Se ha integrado la autenticación real con la API externa de OncoApp (https://oncoapp-239j.onrender.com).

### Funcionalidades Implementadas:

1. **Servicio de Autenticación** (`src/services/authApi.ts`)
   - Login con email y contraseña
   - Registro de nuevos médicos
   - Obtención de datos del usuario autenticado
   - Gestión de tokens JWT

2. **Contexto de Autenticación Actualizado** (`src/contexts/AuthContext.tsx`)
   - Uso de la API real en lugar de mock
   - Persistencia de sesión con token JWT
   - Verificación automática de sesión al iniciar
   - Estados de carga para mejor UX

3. **Página de Landing con Registro** (`src/pages/Landing.tsx`)
   - Formulario de login actualizado
   - Nuevo formulario de registro de médicos
   - Cambio entre modos login/registro
   - Validación de inputs
   - Manejo de errores con toasts informativos

4. **Rutas Protegidas** (`src/components/layout/ProtectedRoute.tsx`)
   - Loading state mientras verifica sesión
   - Redirección automática si no está autenticado

## 📝 Datos Requeridos para Registro

Al registrarse, los médicos deben proporcionar:
- **Nombres**: Nombre(s) del médico
- **Apellidos**: Apellido(s) del médico
- **Tipo de Documento**: CC (Cédula), CE (Cédula Extranjera), PA (Pasaporte)
- **Número de Documento**: Identificación única
- **Especialidad**: Área médica (ej: "Oncología", "Radiología")
- **Email**: Correo electrónico profesional
- **Contraseña**: Contraseña segura

## 🔐 Flujo de Autenticación

1. **Registro**:
   ```
   Usuario completa formulario → API crea cuenta → Mensaje de éxito → Redirección a login
   ```

2. **Login**:
   ```
   Usuario ingresa credenciales → API valida → Obtiene token JWT → Obtiene datos del usuario → Guarda en localStorage → Redirección al dashboard
   ```

3. **Sesión Persistente**:
   ```
   Usuario recarga página → Sistema verifica token → Si es válido, mantiene sesión → Si es inválido, pide login
   ```

## 🌐 Endpoints Utilizados

### Base URL: `https://oncoapp-239j.onrender.com`

1. **POST /register**
   - Registra un nuevo médico
   - Body: `{ email, password, nombres, apellidos, tipo_doc, doc, especialidades }`
   - Respuesta: `201 Created` o error

2. **POST /login**
   - Autentica un médico
   - Body: `{ email, password }`
   - Respuesta: `{ access_token, token_type }`

3. **GET /me**
   - Obtiene datos del médico autenticado
   - Header: `Authorization: Bearer {token}`
   - Respuesta: `{ id, email, rol_id, created_at }`

## 🔧 Configuración del Token

El token JWT se almacena en:
- `localStorage.getItem('auth_token')` - Token de autenticación
- `localStorage.getItem('oncosimil_user')` - Datos del usuario

El token se envía en cada petición protegida como:
```
Authorization: Bearer {token}
```

## ⚠️ Consideraciones Importantes

1. **La API puede estar en modo "sleep"** (Render free tier):
   - Primera petición puede tardar 30-50 segundos
   - Solicitudes subsecuentes son más rápidas
   - El usuario verá estados de carga apropiados

2. **Datos de Pacientes**:
   - Actualmente se mantienen en el sistema mock local
   - No están conectados a la API externa
   - Para integrar pacientes, necesitarías endpoints adicionales en la API

3. **Roles de Usuario**:
   - La API maneja `rol_id` pero actualmente no se usa en el frontend
   - Se puede implementar control de acceso basado en roles si es necesario

## 🧪 Pruebas

Para probar el sistema:

1. **Registrar nuevo médico**:
   - Ir a la página de inicio
   - Click en "¿No tiene cuenta? Regístrese"
   - Completar todos los campos
   - Enviar formulario
   - Verificar mensaje de éxito

2. **Iniciar sesión**:
   - Usar las credenciales del médico registrado
   - Verificar redirección al dashboard
   - Verificar que los datos del médico aparecen en el header

3. **Sesión persistente**:
   - Iniciar sesión
   - Recargar la página
   - Verificar que sigue autenticado
   - Ir directamente a `/dashboard` - debe funcionar

4. **Cerrar sesión**:
   - Click en el menú del usuario (header)
   - "Cerrar Sesión"
   - Verificar redirección a landing
   - Verificar que token se eliminó

## 🚀 Próximos Pasos (Opcionales)

Si deseas extender la integración:

1. **Conectar Pacientes a la API**:
   - Crear endpoints de pacientes en el backend
   - Actualizar `PatientsAPI` para usar la API real
   - Migrar datos existentes si es necesario

2. **Implementar Roles**:
   - Admin: Puede ver todos los médicos y pacientes
   - Médico: Solo ve sus propios pacientes
   - Crear rutas y permisos específicos

3. **Búsqueda de Médicos**:
   - Usar `/search/flexible?q={término}`
   - Mostrar lista de médicos en el sistema
   - Asignar pacientes a médicos específicos

4. **Recuperación de Contraseña**:
   - Implementar endpoint de reset en backend
   - Conectar el formulario `ForgotPasswordForm` a la API real

## 📚 Recursos

- **API Docs**: https://oncoapp-239j.onrender.com/docs
- **OpenAPI Spec**: https://oncoapp-239j.onrender.com/openapi.json
