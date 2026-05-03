# Inversoft Frontend

Aplicacion mobile multiplataforma construida con Expo y React Native para operar el SaaS multi-tenant de gestion de cobros y creditos de corto plazo.

## Stack

- Expo SDK 54
- React Native + TypeScript
- TanStack Query
- TanStack Form
- React Navigation
- React Native Reanimated
- StyleSheet nativo

## Variables de entorno

La app usa variables nativas de Expo con prefijo `EXPO_PUBLIC_`.

1. Crea tu archivo `.env` a partir de `.env.example`.
2. Define la URL base del backend.

```env
EXPO_PUBLIC_API_BASE_URL=http://localhost:5047/api
EXPO_PUBLIC_BYPASS_LOGIN=false
```

La lectura centralizada se hace desde [env.ts](C:/Users/Yefry%20Mendoza/Desktop/Yefry%20M/Proyectos/Carlos%20Beleno/CDX/Inversoft_frontend/src/shared/config/env.ts).

Si quieres revisar solo la interfaz sin autenticacion real, puedes activar:

```env
EXPO_PUBLIC_BYPASS_LOGIN=true
```

Con eso la app entra directamente en modo preview como administrador.

## Estructura

```text
src/
|- app/
|  |- navigation/
|  \- providers/
|- features/
|  |- auth/
|  |- collections/
|  |- collaborators/
|  |- credits/
|  |- customers/
|  |- notifications/
|  |- partners/
|  |- routes/
|  \- users/
|- shared/
   |- api/
   |- config/
   |- theme/
   \- ui/
```

## Convenciones

- Arquitectura por features para aislar UI, hooks, tipos y acceso a datos.
- `shared/` contiene piezas transversales reutilizables.
- `app/` concentra providers globales y navegacion.
- El contexto de sesion ya esta preparado para roles y tenant.
- La capa HTTP ya contempla `Authorization`, `X-Company-Id` y `X-Company-Code`.

## Notas tecnicas

- El backend usa `PATCH` mediante arreglos `{ property, value }`.
- La app esta pensada para crecer hacia persistencia segura de sesion y consumo real de endpoints.
- Se dejo un login inicial con TanStack Form y mutation de TanStack Query para marcar el patron.

## Siguientes pasos recomendados

1. Instalar dependencias.
2. Ejecutar la app con Expo.
3. Implementar persistencia de sesion.
4. Conectar clientes, creditos y cobros del dia al backend real.
5. Agregar guards por rol en drawer y tabs.
