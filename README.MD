# Biblioteca IPF

Trabajo Práctico N° 4 — App integradora de React Native y Expo Router.

**Alumno** Lautaro Short
**Versión del SDK de Expo:** 58 (Expo Go)
**Versión de React Native:** 0.88

## Descripción

Aplicación móvil para consultar el catálogo de libros de la biblioteca del Instituto, reservar ejemplares, anotarse en listas de espera y recibir recordatorios de devolución. Incluye una vista de "Mostrador" para el personal.

## Árbol de carpetas

El proyecto está estructurado siguiendo las buenas prácticas:

- `src/app`: Contiene exclusivamente las rutas (Expo Router).
  - `(tabs)`: Pestañas de Catálogo y Mis Reservas.
  - `libro/[isbn].tsx`: Detalle del libro.
  - `buscar.tsx`: Buscador con parámetros en la URL.
  - `escanear.tsx`: Lector de código de barras.
  - `reservar/[isbn].tsx`: Modal de confirmación.
  - `permisos/[recurso].tsx`: Pantalla previa explicativa de permisos.
  - `login.tsx` y `mostrador.tsx`: Rutas protegidas para el personal.
  - `+not-found.tsx`: Pantalla 404.
- `src/components`: Componentes reutilizables (Boton, TarjetaLibro).
- `src/hooks`: Lógica extraída (useLibros, usePermiso).
- `src/context`: Estado global (BibliotecaContext).
- `src/estructuras`: Clases Pila y Cola.
- `src/data`: Datos iniciales (libros.ts).
- `src/lib`: API simulada y utilidades de notificaciones.
- `src/types`: Tipos de TypeScript.
- `src/constants`: Tema visual (tema.ts).

## Permisos bloqueados (Mínimo privilegio)

En el `app.json` bloqueamos explícitamente los siguientes permisos de Android porque la app no los utiliza:

- `android.permission.RECORD_AUDIO`: Aunque usamos `expo-camera` (que por defecto incluye la grabación de video), nuestra app solo escanea códigos de barras y no graba audio. Lo bloqueamos con `microphonePermission: false` y `recordAudioAndroid: false` en el plugin, y `blockedPermissions`.
- `android.permission.ACCESS_FINE_LOCATION` y `ACCESS_COARSE_LOCATION`: No usamos geolocalización.
