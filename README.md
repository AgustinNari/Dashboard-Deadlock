# Deadlock Playtest Analytics

Tablero local para presentar el TPO de Ciencia de Datos sobre una solución analítica para el playtest de Deadlock. La interfaz simula una herramienta interna de análisis de playtest con foco en balance, rendimiento en partida, estabilidad técnica y experiencia/retención del jugador.

## Stack

- React + Vite
- TypeScript
- Recharts
- Datos simulados locales sin backend
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

## Relación con el TPO

El tablero representa una solución analítica para un playtest de Deadlock. Integra fuentes simuladas de partidas, telemetría de gameplay, héroes/personajes, logs técnicos y comentarios de jugadores. Esas fuentes alimentan KPIs de balance, rendimiento en partida, rendimiento técnico y experiencia/retención.

La sección de cobertura dimensional muestra cómo las métricas se apoyan en las facts principales del modelo: `Fact_PartidaJugador`, `Fact_EventoGameplay`, `Fact_ErrorTecnico` y `Fact_Feedback`. Las dimensiones compartidas permiten filtrar y comparar por jugador, tiempo, versión, partida y región.

La vista predictiva / Data Mining simula cómo el Data Warehouse podría servir como base para modelos de predicción de abandono y retorno al próximo playtest.

## Guion breve para presentar el dashboard

1. Presentar el objetivo del tablero: analizar un playtest desde balance, rendimiento, estabilidad y retención.
2. Mostrar los filtros globales por versión, región, mapa, MMR y período.
3. Explicar los KPIs principales: tasa de victoria, abandono, crashes, FPS, satisfacción e intención de retorno.
4. Recorrer Balance de héroes para detectar riesgo de balance o debilidad potencial.
5. Recorrer Rendimiento en partida para analizar duración, abandono por mapa y eventos por fase.
6. Recorrer Rendimiento técnico para priorizar errores, crashes, latencia y FPS.
7. Recorrer Experiencia y retención del jugador para conectar satisfacción, comentarios e intención de retorno.
8. Cerrar con la vista predictiva / Data Mining como posible evolución del TPO.

## Verificación

El proyecto compila con:

```bash
npm run build
```

Puede aparecer una advertencia no bloqueante de Vite/Recharts sobre el tamaño del bundle generado. No impide ejecutar ni presentar el tablero.
