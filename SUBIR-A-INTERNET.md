# Publicar MAIA en internet (URL para Jean)

## Aclaración importante

| Servicio | Qué hace | ¿Jean abre esto en el navegador? |
|----------|---------|-----------------------------------|
| **MongoDB Atlas** | Guarda datos (nombres, resultados) | **NO** — no es una web |
| **Vercel** (u otro host) | Publica la app MAIA en internet | **SÍ** — te da una URL tipo `maia.vercel.app` |

MongoDB **no sube** la página. Solo almacena información.
Para que Jean vea la app necesitas **publicar la app** (Vercel es lo más rápido con Next.js).

---

## Opción recomendada: Vercel (15 min, gratis)

### 1. Crear cuenta
https://vercel.com → Sign up (puede usar GitHub)

### 2. Subir el proyecto a GitHub (si aún no está)
En terminal, desde `maia-platform`:

```powershell
git add .
git commit -m "MAIA screening workbench demo"
```

Crea un repo en GitHub y súbelo, o usa el import directo de carpeta en Vercel.

### 3. Deploy en Vercel
1. https://vercel.com/new
2. Importa el repo (o arrastra la carpeta `maia-platform`)
3. **Root Directory:** `apps/web`
4. Framework: Next.js (auto)
5. **Environment Variables** (opcional, para Mongo después):
   - `MONGODB_URI` = tu connection string con contraseña real
   - `MONGODB_DB` = `maia`
6. Deploy

### 4. Resultado
Vercel te da una URL permanente, ej:
`https://maia-platform-xxx.vercel.app`

**Esa URL se la envías a Jean** — la abre desde cualquier computadora.

---

## MongoDB — cuándo entra

- **Sin Mongo:** la demo funciona con datos de prueba (mock)
- **Con Mongo en Vercel:** agregas `MONGODB_URI` en Variables de entorno de Vercel → búsqueda usa base real

Mongo se **conecta** a la web ya publicada. No reemplaza a Vercel.

---

## Opción rápida temporal (sin Vercel)

Túnel desde tu PC (solo mientras tu PC esté encendida):
`https://chatty-camels-attack.loca.lt`

No es permanente. Para demo de emergencia sirve.

---

## Qué decirle a Jean

> "La app está publicada en [URL de Vercel]. MongoDB es la base de datos detrás; la pantalla que ves es la app web en Vercel."
