# Deadlock Playtest Analytics

Prototipo local de dashboard analítico para explorar métricas simuladas de un playtest competitivo. El proyecto representa cómo un Data Warehouse puede alimentar indicadores de balance, rendimiento técnico, experiencia de jugadores y modelos predictivos.

## Objetivo

Centralizar métricas simuladas del playtest y ofrecer una vista analítica sobre:

- balance de héroes;
- rendimiento en partida;
- estabilidad técnica;
- feedback y retención;
- predicción de abandono y retorno.

## Stack

- React
- Vite
- TypeScript
- Recharts
- CSS propio
- Datos simulados locales

## Datos simulados

El proyecto no utiliza datos reales. Los datasets locales simulan partidas, eventos de gameplay, errores técnicos, feedback, versiones del juego, regiones, mapas, héroes y perfiles de jugadores.

No existe conexión con un backend, servicios externos ni APIs. Los datos no representan información oficial de Valve o Deadlock.

## Modelo analítico representado

Facts:

- `Fact_PartidaJugador`
- `Fact_EventoGameplay`
- `Fact_ErrorTecnico`
- `Fact_Feedback`

Dimensiones:

- `Dim_Jugador`
- `Dim_Personaje`
- `Dim_Habilidad`
- `Dim_Objeto`
- `Dim_Mapa`
- `Dim_VersionJuego`
- `Dim_Tiempo`
- `Dim_TipoError`
- `Dim_CategoriaFeedback`
- `Dim_Region`

En el modelo dimensional, los héroes del juego se representan mediante `Dim_Personaje`. Las builds se reconstruyen desde eventos de compra en `Fact_EventoGameplay` vinculados a `Dim_Objeto`.

## Funcionalidades

- Filtros interactivos por versión, región, mapa, rango competitivo (ELO/MMR) y período.
- KPIs de tasa de victoria (winrate), abandono por héroe, brecha ganador/perdedor, tasa de crashes, FPS, satisfacción e intención / retención estimada.
- Badges de Riesgo de balance, Riesgo técnico, Riesgo de retención y Estable.
- Gráficos y ranking de balance de héroes.
- Métricas de duración, abandono y eventos por fase de partida.
- Análisis de errores técnicos, FPS y latencia.
- Distribución de feedback y señales de retención.
- Vista predictiva / Data Mining simulada para abandono y retorno al siguiente playtest.

## Cómo ejecutar

```bash
npm install
npm run dev
```

Vite mostrará la URL local de desarrollo, normalmente `http://localhost:5173`.

## Build

```bash
npm run build
```

La versión de producción se genera en `dist`. Recharts puede producir una advertencia no bloqueante por el tamaño del bundle durante el build.

## Alcance

Este proyecto es un prototipo analítico local con datos simulados. Su alcance se limita a la exploración visual de métricas de playtest y no representa una herramienta oficial de Valve o Deadlock.
