# Deadlock Playtest Analytics

Tablero local para presentar el TPO de Ciencia de Datos sobre una solución analítica para el playtest de Deadlock. La interfaz simula una herramienta interna de análisis de playtest con foco en balance, rendimiento en partida, estabilidad técnica y experiencia/retención del jugador.

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
- KPIs de tasa de victoria (winrate), abandono, tasa de crashes, FPS, satisfacción e intención de retorno.
- Badges de alerta: Riesgo de balance, Riesgo técnico, Riesgo de retención y Estable.
- Cobertura visual del modelo dimensional con facts y dimensiones compartidas.
- Secciones de balance de héroes, rendimiento en partida, rendimiento técnico y experiencia/retención del jugador.
- Tablas de señales de desbalance y errores críticos.
- Vista predictiva / Data Mining con predicciones simuladas.

Los datos son ficticios y están diseñados para simular hechos del modelo dimensional: `Fact_PartidaJugador`, `Fact_EventoGameplay`, `Fact_ErrorTecnico` y `Fact_Feedback`, junto con dimensiones como `Dim_Jugador`, `Dim_Tiempo`, `Dim_VersionJuego`, `Dim_Partida` y `Dim_Region`.

## Verificación

El proyecto compila con:

```bash
npm run build
```

Puede aparecer una advertencia no bloqueante de Vite/Recharts sobre el tamaño del bundle generado. No impide ejecutar ni presentar el tablero.
