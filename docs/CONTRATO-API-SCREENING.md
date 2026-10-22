# Contrato de API esperado por el front — Screening Individual

Documento para **Alejandro y Diego**: lo que la pantalla *Individual* consume hoy.
Si algo no coincide con el backend, **dígannos qué cambia** y lo adaptamos en
`apps/web/lib/api/normalize.ts` (el contrato se adapta a la UI, no al revés).

Estado: **propuesta a confirmar**. El front ya funciona con este contrato contra
un servicio simulado (`apps/web/scripts/fake-maia-api.ts`) y con datos demo.

## Configuración (variables de entorno del front)

| Variable | Para qué |
|---|---|
| `MAIA_API_BASE_URL` | URL base del API. Sin ella, la app corre en **modo demostración** (se avisa en pantalla). |
| `MAIA_API_TOKEN` | Token Bearer. Solo se usa en el servidor; nunca llega al navegador. |
| `MAIA_USE_MOCK=true` | Fuerza demostración aunque exista URL. |
| `MAIA_SCREENING_SEARCH_PATH` | Ruta de búsqueda. Por defecto `/screening/search`. |
| `MAIA_DECISIONS_FEEDBACK_PATH` | Ruta de feedback. Por defecto `/decisions/feedback`. |

Con URL configurada y sin `MAIA_USE_MOCK=true`, **si el backend falla la UI muestra
un error con "Reintentar"**. Nunca se cae a datos demo.

## 1. Búsqueda

`GET {MAIA_API_BASE_URL}/screening/search?q=<texto>`
Cabeceras: `Authorization: Bearer <token>` · `Accept: application/json`

### Respuesta `200`

```json
{
  "profile": {
    "id": "sub-001",
    "name": "Carlos Alberto Ramírez Torres",
    "document": "DNI 45892136",
    "nationality": "Perú",
    "birthdate": "14/03/1978",
    "tags": ["Persona natural", "PEP potencial"]
  },
  "matches": [
    {
      "id": "m-1",
      "name": "Carlos Alberto Ramírez Torres",
      "entityType": "Persona",
      "score": 96,
      "confidence": 96,
      "riskLevel": "high",
      "status": "Pendiente",
      "source": "PEP Perú + Medios adversos",
      "scoreBreakdown": [
        {
          "id": "name_match",
          "label": "Coincidencia de nombre",
          "value": 0.97,
          "unit": "ratio",
          "weight": 0.35,
          "detail": "Fuzzy + normalización fonética"
        },
        { "id": "pep", "label": "PEP / personas expuestas", "value": 1, "unit": "flag", "weight": 0.3, "detail": "Hit en PEP Perú" }
      ]
    }
  ],
  "reasoning": "MAIA detectó coincidencia de alta confianza en PEP y medios adversos.",
  "sourceCoverage": [
    { "name": "PEP Perú", "status": "found" },
    { "name": "OFAC SDN", "status": "not_found" },
    { "name": "Medios adversos", "status": "found" },
    { "name": "UN Consolidated", "status": "not_screened" }
  ],
  "adverseMedia": [
    {
      "id": "am-1",
      "title": "Exfuncionario vinculado a investigación de lavado",
      "source": "El Comercio",
      "date": "12/03/2024",
      "snippet": "El nombre aparece en cobertura sobre …",
      "url": "https://example.com/noticia-1",
      "sentiment": "negative"
    }
  ]
}
```

### Campos

| Campo | Obligatorio | Valores / notas |
|---|---|---|
| `profile` | **Sí** | Sin perfil la respuesta se rechaza como inválida. `id`, `name`, `document`, `nationality`, `birthdate`, `tags` tienen valor por defecto si faltan. |
| `matches[]` | No (vacío = sin coincidencias) | Lista vacía **solo** cuando se consultó y no hay nada. |
| `matches[].score` | Sí | 0–100. Score del motor. |
| `matches[].confidence` | Sí | 0–100. Seguridad de MAIA en el resultado (distinto del score). |
| `matches[].riskLevel` | Sí | `low` · `medium` · `high` |
| `matches[].status` | No | `Pendiente` · `En revisión` · `Cerrado` · `Auto-resuelto` |
| `matches[].scoreBreakdown[]` | No | Si falta, la UI dice "Sin desglose disponible". |
| `…scoreBreakdown[].value` | Sí | Con `unit: "ratio"` → 0–1. Con `"percent"` → 0–100. Con `"flag"` → 0 o 1. |
| `…scoreBreakdown[].weight` | Recomendado | 0–1. Con pesos en todos los factores la UI muestra "% del resultado". |
| `sourceCoverage[].status` | Sí | `found` · `not_found` · `not_screened` |
| `adverseMedia[].sentiment` | No | `negative` · `neutral` · `positive` |
| `adverseMedia[].date` | No | `dd/mm/aaaa` o ISO 8601. |
| `adverseMedia[].url` | No | Solo `http(s)`; otro esquema se descarta. |

### Reglas que necesitamos que el backend respete

1. **Nunca responder `200` con lista vacía cuando falló una fuente.** Un fallo debe ser un
   código de error, o la fuente debe aparecer como `not_screened`. Para un oficial de
   cumplimiento, "no se pudo consultar" ≠ "persona limpia".
2. Si **Medios adversos** no se consultó, debe venir `{"name": "Medios adversos", "status": "not_screened"}`.
   La UI lo muestra como "Fuente no consultada", no como "sin menciones".
3. Errores: `401/403` → "sin autorización"; otros `4xx/5xx` → "error del servicio". Timeout del front: 15 s.

### Preguntas abiertas (necesitamos respuesta)

- ¿`score` es la suma de `value × weight × 100`? Hoy los datos demo **no** cuadran
  (96 vs 77), por eso la UI muestra "% del resultado" y no "puntos".
- ¿El nuevo scoring por tokens cambia los factores o los pesos?
- ¿Hay un campo de **relevancia/homónimo** por artículo en medios adversos?
- ¿Cómo se identifica el caso? Hoy el front arma `IND-<id del perfil>`.

## 2. Feedback del operador

`POST {MAIA_API_BASE_URL}/decisions/feedback`
El navegador **no** llama directo: pasa por `POST /api/decisions/feedback` del front, que
reenvía con el token.

### Cuerpo

```json
{
  "caseId": "IND-001",
  "matchId": "m-1",
  "subjectId": "sub-001",
  "action": "reject",
  "engineAgreement": "disagree",
  "comment": "El artículo corresponde a un homónimo.",
  "riskLevel": "high",
  "name": "Carlos Alberto Ramírez Torres"
}
```

| Campo | Obligatorio | Valores |
|---|---|---|
| `caseId` | **Sí** | texto |
| `action` | **Sí** | `accept` · `reject` · `escalate` |
| `engineAgreement` | No | `agree` · `disagree` — ¿el operador coincide con el análisis de MAIA? |
| `comment` | No (obligatorio en la UI si `disagree`) | máx. 500 caracteres |
| `matchId`, `subjectId`, `riskLevel`, `name` | No | contexto |

### Respuesta `200`

```json
{ "id": "fb-123", "status": "recorded", "recordedAt": "2026-10-04T08:11:46Z" }
```

`status`: `recorded` o `queued` (la UI avisa que quedó en cola).

### Preguntas abiertas

- ¿El endpoint acepta `engineAgreement` y `comment`? Son campos nuevos de nuestra parte.
- ¿Hay un `GET` para recuperar la decisión de un caso? Sin él, al recargar la página el caso
  aparece sin decidir.
- ¿Hace falta una clave de idempotencia para evitar decisiones duplicadas?

## 3. Pestañas que siguen en demostración

Estas pantallas aún leen `apps/web/lib/mock-data.ts` y muestran la etiqueta
**"Datos de demostración"**. No existe contrato para ellas. Propuesta de lo que se necesita:

| Pestaña | Datos que hoy son demo | Endpoint necesario (propuesto) |
|---|---|---|
| Overview | Cola de excepciones, actividad, módulos | `GET /screening/overview` |
| Massive | Lotes y filas con excepciones | `GET /screening/batches`, `GET /screening/batches/{id}/exceptions` |
| API Alerts | Alertas que requieren resolución | `GET /screening/alerts?status=needs_resolution` |
| Evidence | Casos y línea de tiempo | `GET /screening/evidence`, `GET /screening/evidence/{id}` |
| Sources | Fuentes y estado de sincronización | `GET /screening/sources` |
| Policy | Reglas y umbrales | `GET /screening/policy` |

Cuando existan, se conectan igual que Individual: servicio en servidor + adaptador, sin
rediseñar la pantalla.
