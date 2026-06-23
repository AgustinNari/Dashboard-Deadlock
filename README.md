# Deadlock Playtest Analytics

Dashboard local para presentar el TPO de Ciencia de Datos sobre una solución analítica para el playtest de Deadlock.

## Stack

- React + Vite
- TypeScript
- Recharts
- Datos mock locales sin backend
- CSS propio

## Cómo correr

```bash
npm install
npm run dev
```

Luego abrir la URL local que muestre Vite, normalmente `http://localhost:5173`.

## Qué incluye

- Filtros interactivos por versión, región, mapa, MMR y período.
- KPIs de winrate, abandono, crash rate, FPS, satisfacción e intención de retorno.
- Secciones de balance de héroes, rendimiento en partida, rendimiento técnico y experiencia/retención.
- Tablas de señales de desbalance y errores críticos.
- Vista final de Data Mining Preview con predicciones simuladas.

Los datos son ficticios y están diseñados para simular hechos del modelo dimensional: `Fact_PartidaJugador`, `Fact_EventoGameplay`, `Fact_ErrorTecnico` y `Fact_Feedback`.
