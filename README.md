# Champions SaaS

**SaaS multiusuario** para consultar **equipos** y **partidos**, publicar **comentarios** en los partidos y gestionar el contenido mediante paneles de **backoffice con roles** (`EDITOR`, `ADMIN`). Desarrollado como entrega de la **IA7 del M0613** (bloque *Creació d'un SaaS*, sesiones S16–S20).

**Demo en producción:** https://proyecto-champions-next.vercel.app  
**Repositorio:** https://github.com/ivaaan22/proyecto-champions-next

---

## Sobre el proyecto

Aficionados y editores necesitan un único lugar donde **publicar** partidos y contenido tipo Champions, mientras que los **usuarios registrados** pueden comentar los encuentros. La aplicación separa el **catálogo público**, las **funciones sociales** y las **herramientas internas** con una autorización clara por roles — un patrón habitual en productos SaaS reales.

---

## Funcionalidades

### Público
- Consultar los **32 equipos** con buscador y filtro por país.
- Página de **detalle de equipo** con historial de partidos y estadísticas (victorias/empates/derrotas).
- Consultar **partidos** filtrados por fase (Grupos / Cuartos / Semifinal / Final) y estado (Finalizado / Próximo).
- Página de **detalle de partido** con marcador completo e imagen opcional del partido.
- Tabla de **clasificación** con zonas de colores (Top 8 → octavos, 9–24 → repechaje, 25–32 → eliminados).

### Usuarios autenticados
- **Registro** e **inicio de sesión** con Supabase Auth.
- Subir y actualizar la **foto de perfil** (almacenada en Supabase Storage).
- Publicar, **editar y eliminar** sus propios **comentarios** en los partidos (ownership).

### Backoffice
- **`EDITOR`**: crear, editar y eliminar equipos y partidos, incluyendo **subida de imágenes** para escudos y fotos de partidos.
- **`ADMIN`**: acceso total, incluyendo gestión de usuarios y **roles** (`USER`, `EDITOR`, `ADMIN`) y moderación de cualquier comentario.

### Producto / ingeniería
- **Historias de usuario** implementadas de forma incremental siguiendo metodología **Scrum** (sesiones S19–S20).
- Datos cargados mediante SQL para las demos locales y de producción.
- **Buckets de Supabase Storage** para avatares (`avatars`) e imágenes de contenido (`images`).
- Middleware basado en roles que protege las rutas del backoffice.

---

## Stack tecnológico

| Capa | Tecnología |
| --- | --- |
| Framework | **Next.js 16** (App Router), **React 19**, **TypeScript** |
| ORM / BD | **Prisma 7** → **PostgreSQL** (alojado en **Supabase**) |
| Autenticación | **Supabase Auth** |
| UI | **Tailwind CSS v4** |
| Multimedia | **Supabase Storage** |
| Despliegue | **Vercel** (app) + **Supabase** (BD, auth, storage) |

---

## Arquitectura

```
Navegador → Next.js App Router (RSC + Client Components)
               → Prisma (adapter pg) → Supabase PostgreSQL
               → Supabase Auth (sesiones vía @supabase/ssr)
               → Supabase Storage (subida de avatares e imágenes)
               → API Routes (/api/comments, /api/teams, /api/matches, /api/users/[id]/role)
```

- Las **rutas públicas** muestran equipos, partidos y clasificación a los visitantes.
- Las **rutas autenticadas** permiten comentar los partidos (con edición/borrado propio).
- El **backoffice** (`/backoffice/*`) está protegido por middleware — solo EDITOR y ADMIN.

---

## Requisitos previos

- **Node.js** LTS
- Un proyecto de **Supabase** (PostgreSQL + Auth + buckets de Storage `avatars` e `images`)
- **Git**

---

## Puesta en marcha

### 1. Clonar e instalar

```bash
git clone https://github.com/ivaaan22/proyecto-champions-next.git
cd proyecto-champions-next
npm install
```

### 2. Variables de entorno

```bash
cp .env.example .env
```

Rellena tus valores (ver la sección **Variables de entorno** más abajo). Nunca subas el archivo `.env`.

### 3. Base de datos

```bash
npx prisma generate
npx prisma db push
```

Después, carga los equipos y partidos mediante el **SQL Editor de Supabase** (ver `prisma/seed/seed.ts` como referencia de los datos).

### 4. Ejecutar en local

```bash
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000).

---

## Cuentas de prueba

La demo desplegada incluye tres cuentas preconfiguradas, una por rol, para poder evaluar el proyecto de principio a fin:

| Rol | Email | Contraseña |
| --- | --- | --- |
| **ADMIN** | `admin@test.com` | `admin123` |
| **EDITOR** | `editor@test.com` | `editor123` |
| **USER** | `user@test.com` | `user123` |

- **ADMIN** — acceso total: panel de backoffice, equipos, partidos, gestión de usuarios/roles y moderación de comentarios.
- **EDITOR** — acceso al backoffice para crear, editar y eliminar equipos y partidos (con subida de imágenes).
- **USER** — puede comentar partidos y gestionar su perfil/avatar.

> Son cuentas de prueba desechables, únicamente para la evaluación.

---

## Roles y configuración de administrador

La aplicación tiene tres roles: `USER` (por defecto), `EDITOR` y `ADMIN`.

- **USER** — puede comentar partidos y subir un avatar.
- **EDITOR** — puede crear, editar y eliminar equipos y partidos desde el backoffice.
- **ADMIN** — acceso total, incluyendo gestión de usuarios y roles.

Las cuentas nuevas se crean como `USER`. Para promover una cuenta a `ADMIN`, ejecuta esto en el **SQL Editor de Supabase** (sustituye el email por la cuenta deseada):

```sql
-- 1. Crear / actualizar el perfil como ADMIN
INSERT INTO profiles (id, email, username, role, "createdAt", "updatedAt")
SELECT id, email, raw_user_meta_data->>'username', 'ADMIN', NOW(), NOW()
FROM auth.users
WHERE email = 'tu-email@ejemplo.com'
ON CONFLICT (id) DO UPDATE SET role = 'ADMIN';

-- 2. Sincronizar el rol en los metadatos de auth (lo lee el header)
UPDATE auth.users
SET raw_user_meta_data = raw_user_meta_data || '{"role": "ADMIN"}'::jsonb
WHERE email = 'tu-email@ejemplo.com';
```

Tras ejecutarlo, cierra sesión y vuelve a entrar para refrescar la sesión. Una vez tienes un ADMIN, los siguientes cambios de rol se hacen desde el panel de **Usuarios** del backoffice — sin SQL.

---

## Variables de entorno

| Variable | Descripción |
| --- | --- |
| `DATABASE_URL` | URL **pooled** de Postgres en Supabase (puerto 6543, para el cliente Prisma) |
| `DIRECT_URL` | URL **directa** de Supabase (puerto 5432, para las migraciones) |
| `NEXT_PUBLIC_SUPABASE_URL` | URL del proyecto de Supabase |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Clave anon/pública de Supabase |

Plantilla completa en `.env.example` (sin secretos).

---

## Scripts

| Comando | Función |
| --- | --- |
| `npm run dev` | Arranca Next.js en desarrollo (Turbopack) |
| `npm run build` | Build de producción (`prisma generate && next build`) |
| `npm run start` | Arranca el servidor de producción |
| `npm run lint` | ESLint |
| `npm run db:seed` | Ejecuta el script de seed de Prisma |

---

## Estructura del proyecto

```
proyecto-champions-next/
├── app/
│   ├── (public)/           # Rutas públicas (inicio, equipos, partidos, clasificación)
│   │   ├── page.tsx        # Inicio
│   │   ├── teams/          # Lista de equipos + detalle
│   │   ├── matches/        # Lista de partidos + detalle + comentarios
│   │   └── standings/      # Tabla de clasificación
│   ├── (auth)/             # Rutas de autenticación (login, registro)
│   ├── backoffice/         # Backoffice protegido (EDITOR + ADMIN)
│   │   ├── page.tsx        # Panel con contadores
│   │   ├── teams/          # Lista + nuevo + editar
│   │   ├── matches/        # Lista + nuevo + editar
│   │   └── users/          # Gestión de roles (solo ADMIN)
│   └── api/
│       ├── comments/       # Crear / editar / eliminar comentarios
│       ├── teams/          # CRUD de equipos
│       ├── matches/        # CRUD de partidos
│       └── users/[id]/role # Cambiar rol de usuario
├── components/             # Header, Footer, CommentSection, ImageUpload
├── lib/
│   ├── prisma.ts           # Singleton del cliente Prisma
│   └── supabase/           # Helpers de Supabase (servidor + cliente)
├── prisma/
│   ├── schema.prisma       # Modelo de datos (Profile, Team, Match, Comment)
│   └── seed/seed.ts        # Script de seed
├── types/                  # Tipos TypeScript compartidos
└── middleware.ts            # Protección de rutas por rol
```

---

## Checklist de verificación (IA7)

- [x] **US-01 / US-02** — El visitante puede registrarse e iniciar sesión con Supabase Auth.
- [x] **US-05 / 06 / 07** — Zona pública (equipos, partidos, clasificación) con datos de la base de datos.
- [x] **US-08 / 09 / 10** — Comentarios con ownership: los usuarios crean, editan y eliminan los suyos.
- [x] **US-11 → US-16** — CRUD completo de EDITOR para equipos y partidos en el backoffice.
- [x] **US-17 / US-18** — Subida de imágenes para escudos de equipos y fotos de partidos (Supabase Storage).
- [x] **US-19 → US-22** — Administración de usuarios y roles por parte del ADMIN.
- [x] La aplicación se despliega en **Vercel** con las variables de entorno de producción configuradas de forma segura.

---

## Despliegue

1. Sube el código a GitHub y conecta el repositorio a **Vercel**.
2. Configura todas las variables de entorno en el panel de Vercel (las mismas claves que en `.env`).
3. Vercel ejecuta `prisma generate && next build` y despliega automáticamente en cada push a `master`.

---

## Contexto académico

Desarrollado como **IA7 — Kates Serveis web** dentro del **M0613** (DAW2).  
Discovery de producto y backlog: **Scrum** (sesión S19).  
Implementación: sprints guiados (sesión S20).

---

## Licencia

Uso educativo — todos los derechos reservados para fines de clase.

---

## Autor

**Ivan Garcia** — [GitHub](https://github.com/ivaaan22)
