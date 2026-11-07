# MAIA

Un solo producto: canal de denuncias **SpeakUp** y **Compliance Hub** (screening). Diego clona este repositorio, lo corre en local y presenta la demo.

Requiere **Node.js 20 o superior** y npm.

## Arrancar la demo

En la raíz del repo:

```bash
git clone https://github.com/Diego4519/Maia-ux.git
cd Maia-ux
npm install
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000). Ahí está el portal público de SpeakUp. Screening sigue en `/screening/overview`. El menú interno une ambos módulos.

Si ya habías corrido una versión anterior y la bandeja se ve rara, borra `apps/web/.data` y vuelve a levantar el servidor.

## Recorrido de demo (días 1 a 4 / DA-01 a DA-04)

1. **Portal** (`/`) — sin login. «Presentar un reporte» y «Consultar y responder».
2. **Formulario** (`/reportar`) — 3 pasos. Solo es obligatorio «qué ocurrió». Envía un texto corto, sin categoría, sin archivo y sin correo.
3. **Confirmación** — código + clave una sola vez. Cópialos. La clave no va en la URL.
4. **Buzón** (`/buzon`) — entra con código y clave, responde y adjunta un archivo. Recarga: la conversación sigue.
5. **Equipo** (`/login`) — cuentas de demostración, contraseña `maia-demo`:

| Rol | Correo | Qué debe verse |
| --- | --- | --- |
| Receptor | `ana@maia.demo` | Reportes de su cola. Sin casos. |
| Receptor independiente | `sofia@maia.demo` | Solo la ruta independiente. |
| Investigador | `carlos@maia.demo` | Sin reportes. Solo sus casos. |
| Revisor | `marco@maia.demo` | Reportes y casos (visión amplia). |
| Administrador | `lucia@maia.demo` | Reportes y casos (visión amplia). |

No hay selector de rol falso: cada cuenta recibe del servidor solo lo autorizado.

## Cómo sabemos que quedó bien (Excel)

**DA-01.** El portal abre sin sesión. Los dos botones van a `/reportar` y `/buzon`. Ningún texto promete anonimato absoluto ni atención humana 24 h.

**DA-02.** Un reporte breve sin categoría, sin archivo y sin correo se envía. Si el relato incluye la palabra `FAIL`, el servidor responde error, el formulario conserva los datos, aparece «Reintentar» y no se crea un duplicado en la bandeja.

**DA-03.** Un código sin clave no abre el buzón. Una pregunta del equipo se responde con un adjunto y sigue ahí después de recargar. La clave no aparece en la URL.

**DA-04.** Cada rol ve solo lo suyo porque lo decide el servidor. El investigador no ve filas de reportes. La bandeja tiene pestañas Reportes y Casos, con referencia, fecha, estado/fase, categoría, responsable, urgencia y próximo vencimiento.

## Rutas

| Ruta | Qué es |
| --- | --- |
| `/` | Portal SpeakUp |
| `/reportar` | Nueva denuncia |
| `/buzon` | Consultar y responder |
| `/login` | Acceso del equipo |
| `/bandeja` | Bandeja Reportes / Casos |
| `/screening/overview` | Compliance Hub |

Esto es un entorno de demostración. Los datos son de prueba y viven en `apps/web/.data` (no se sube a GitHub).
