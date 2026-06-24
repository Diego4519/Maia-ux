# Demo MAIA UI — 24 jun 2026

## Completado

- Monorepo Shadcn (preset neutral) en `maia-platform/`
- Librería compartida: `packages/ui/` con 16+ componentes
- Fuentes: Montserrat + Outfit
- Sidebar completo con arquitectura de módulos comerciales
- Screening activo: Overview, Búsqueda, Resultados, Historial
- Resto de módulos visibles como "Próximamente"
- Datos mock para demo
- Reglas Cursor en `.cursor/rules/maia-ui.mdc`

## Cómo correr la demo

```powershell
cd "C:\Users\USUARIO\Desktop\Maia ux\maia-platform"
npm run dev
```

Abrir: http://localhost:3000

## Decisiones de diseño

- White-label neutro (colores por tenant en fase 2)
- Overview: solo 3 KPIs, sin dashboards sobrecargados
- Búsqueda: input + select preset + botón (estilo GS Intel)
- Sidebar colapsable para Screening

## Siguiente paso

- Validar flujos con Jean (wireframes PowerPoint)
- Añadir charts al monorepo
- Conectar backend cuando Valdez tenga API
- Refinar búsqueda masiva (upload Excel)

## Preguntas para la reunión

1. ¿Los sub-módulos de Screening están bien definidos?
2. ¿Unificamos búsqueda individual y masiva en una sola vista?
3. ¿Qué KPIs son prioritarios en Overview?
