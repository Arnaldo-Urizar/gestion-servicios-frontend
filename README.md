# Gestión Servicio Trinity — Frontend

## Resumen

Aplicación frontend React + TypeScript creada con Vite para la plataforma "Consorcio de agua". Código organizado por dominios (admin, operator, user, auth, shared, etc.). Assets estáticos en `public/`.

## Requisitos

- Node.js 18+ (Linux)
- npm o yarn
- Git
- Backend disponible (API) para desarrollo completo

## Instalación rápida

Desde la raíz del proyecto:

- Instalar dependencias:
  - npm: `npm install`
  - yarn: `yarn`
- Configurar variables de entorno (crear `.env` en la raíz):
  - Usar prefijo Vite para variables públicas: `VITE_`
  - Ejemplo mínimo:
    - `VITE_API_URL=https://api.example.com`
    - `VITE_APP_ENV=development`
- Levantar frontend:
  - `npm run dev` (por defecto Vite sirve en http://localhost:5173)

Build y preview:

- `npm run build`
- `npm run preview`

(Los scripts pueden variar según package.json; validar allí.)

## Estructura relevante

- index.html — punto de entrada. Nota: assets en `public/` se sirven desde la raíz (`public/logo.svg` → `/logo.svg`).
- public/
  - logo.svg
- src/
  - main.tsx — arranque de la app, providers y rutas
  - App.tsx, App.css, index.css
  - config/axiosConfig.ts — configuración de Axios (baseURL, interceptores)
  - context/AuthContext.tsx — estado global de autenticación
  - hooks/useAuth.ts — hook para autenticación
  - core/
    - models/ — DTOs y tipos
    - services/apiService.ts — capa para llamadas a la API
  - auth/, admin/, operator/, user/ — features por rol
  - shared/ — componentes reutilizables (navbar, footer, tablas, pdf, etc.)
  - assets/img/ — imágenes usadas por la UI

## Archivos y puntos de interés iniciales

- `src/main.tsx` — ver providers, rutas y el mount.
- `src/config/axiosConfig.ts` — cambiar baseURL o interceptores aquí; suele usar `VITE_API_URL`.
- `src/context/AuthContext.tsx` + `src/hooks/useAuth.ts` — flujo de login/logout y persistencia.
- `index.html` — comprobar rutas a imágenes (usar `/logo.svg`).

## Buenas prácticas

- Variables públicas: prefijo `VITE_`.
- Mantener la lógica de acceso a API en `core/services` o `config/axiosConfig.ts`.
- Reutilizar componentes en `shared/components`.
- DTOs y tipos en `core/models/dto`.

## Debugging y VS Code

- Usar la terminal integrada (Linux) para `npm run dev`.
- Puntos de partida para debugging: `src/main.tsx` y providers en `src/context`.
- Revisar la consola del navegador y la pestaña del servidor Vite para errores.

## Contribución y flujo de trabajo

- Ramas por feature: `feature/<descripcion>` o `fix/<descripcion>`.
- Ejecutar lint y tests antes de PR si están configurados:
  - `npm run lint`
  - `npm test`

## Notas finales

- Si algo no funciona al arrancar, revisar `VITE_API_URL` y disponibilidad del backend.
- Preguntas frecuentes:
  - ¿Dónde cambiar la URL de la API? `src/config/axiosConfig.ts` o `.env` (`VITE_API_URL`).
  - ¿Dónde está la autenticación?
