# Healthy Meals

Healthy Meals ayuda a estudiantes universitarios que viven solos a comer mejor sin
complicarse. En lugar de elegir entre cocinar desde cero o pedir comida chatarra,
Healthy Meals muestra kits de comida simples y accesibles adaptados a su tiempo y
presupuesto.

Este repositorio contiene la infraestructura base y el homepage estático del
proyecto. Por ahora **no incluye** autenticación, carrito, pagos, recomendaciones con
IA real, ni conexión funcional a Supabase — todo el contenido de los meal kits es
data estática.

## Instalación

```bash
npm install
```

## Desarrollo

```bash
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000) para ver la app.

## Variables de entorno

Copia `.env.example` a `.env.local` y completa los valores:

```bash
cp .env.example .env.local
```

| Variable | Descripción |
| --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL` | URL del proyecto de Supabase (aún no conectado). |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Clave anónima pública de Supabase (aún no conectado). |

## Stack

- [Next.js 16](https://nextjs.org/) (App Router)
- [React 19](https://react.dev/)
- [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS 4](https://tailwindcss.com/)
- Desplegado en [Vercel](https://vercel.com/)
