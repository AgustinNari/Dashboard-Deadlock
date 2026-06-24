import { useMemo, useState } from 'react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ComposedChart,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { Activity, Bug, Database, Layers, Network, ShieldAlert, Sparkles, Users } from 'lucide-react';
import { CriticalErrorsTable } from './components/CriticalErrorsTable';
import { EventHeatmap } from './components/EventHeatmap';
import { FiltersBar } from './components/FiltersBar';
import { HeroRankingTable } from './components/HeroRankingTable';
import { KpiCard } from './components/KpiCard';
import { Panel } from './components/Panel';
import { buildDashboardModel } from './utils/analytics';
import { Filters } from './types';

const initialFilters: Filters = {
  version: 'Todos',
  region: 'Todas',
  map: 'Todos',
  mmr: 'Todos',
  period: '30 días',
};

const chartColors = {
  gold: '#d7a84f',
  green: '#44be9a',
  teal: '#4aa3b6',
  copper: '#c77746',
  blue: '#6f95d8',
  red: '#d96557',
};

const pieColors = ['#d7a84f', '#44be9a', '#d96557', '#c77746', '#6f95d8', '#8fcf6b'];

const dimensionalCoverage = [
  { kind: 'Fact', name: 'Fact_PartidaJugador', tone: 'gold' },
  { kind: 'Fact', name: 'Fact_EventoGameplay', tone: 'green' },
  { kind: 'Fact', name: 'Fact_ErrorTecnico', tone: 'red' },
  { kind: 'Fact', name: 'Fact_Feedback', tone: 'blue' },
  { kind: 'Dim', name: 'Dim_Personaje', tone: 'muted' },
  { kind: 'Dim', name: 'Dim_Habilidad', tone: 'muted' },
  { kind: 'Dim', name: 'Dim_Objeto', tone: 'muted' },
  { kind: 'Dim', name: 'Dim_Mapa', tone: 'muted' },
  { kind: 'Dim', name: 'Dim_Jugador', tone: 'muted' },
  { kind: 'Dim', name: 'Dim_Tiempo', tone: 'muted' },
  { kind: 'Dim', name: 'Dim_VersionJuego', tone: 'muted' },
  { kind: 'Dim', name: 'Dim_Partida', tone: 'muted' },
  { kind: 'Dim', name: 'Dim_Region', tone: 'muted' },
  { kind: 'Dim', name: 'Dim_TipoError', tone: 'muted' },
  { kind: 'Dim', name: 'Dim_CategoriaFeedback', tone: 'muted' },
];

function tooltipProps() {
  return {
    contentStyle: {
      background: '#101a18',
      border: '1px solid rgba(215, 168, 79, .46)',
      borderRadius: 8,
      color: '#f6eddc',
      boxShadow: '0 12px 28px rgba(0, 0, 0, .42)',
    },
    labelStyle: {
      color: '#f6eddc',
      fontWeight: 800,
    },
    itemStyle: {
      color: '#f6eddc',
    },
    wrapperStyle: {
      zIndex: 20,
    },
  };
}

export function App() {
  const [filters, setFilters] = useState<Filters>(initialFilters);
  const model = useMemo(() => buildDashboardModel(filters), [filters]);

  const crashLevel = model.kpis.crashRate > 5 ? 'danger' : model.kpis.crashRate > 3 ? 'warning' : 'ok';
  const satisfactionLevel = model.kpis.satisfaction < 6.4 ? 'danger' : model.kpis.satisfaction < 7 ? 'warning' : 'ok';
  const balanceLevel = model.heroRows.some((row) => row.alertLevel === 'danger')
    ? 'danger'
    : model.heroRows.some((row) => row.alertLevel === 'warning')
      ? 'warning'
      : 'ok';
  const retentionLevel = model.kpis.returnIntent < 64 || model.kpis.satisfaction < 6.4 ? 'danger' : model.kpis.returnIntent < 74 ? 'warning' : 'ok';
  const topReturn = [...model.profiles].sort((a, b) => b.returnIntent - a.returnIntent)[0];
  const lowReturn = [...model.profiles].sort((a, b) => a.returnIntent - b.returnIntent)[0];
  const riskLabel = (level: string, riskText: string) => (level === 'ok' ? 'Estable' : riskText);

  return (
    <main className="app-shell">
      <header className="hero">
        <div className="hero-grid" />
        <div className="hero-content">
          <div className="system-badge">
            <Database size={16} />
            Telemetría de playtest
          </div>
          <h1>Deadlock Playtest Analytics</h1>
          <p>Tablero Data Warehouse de playtest</p>
          <div className="hero-meta">
            <span>ELO/MMR, regiones y versiones</span>
            <span>Dataset simulado local</span>
            <span>Prototipo conceptual</span>
          </div>
        </div>
        <div className="radar-panel" aria-label="Estado operacional simulado">
          <span>Sincronización DW filtrada</span>
          <strong>{model.matchRows.length.toLocaleString('es-AR')}</strong>
          <small>registros filtrados</small>
        </div>
      </header>

      <FiltersBar filters={filters} onChange={setFilters} />

      <section className="command-strip" aria-label="Resumen de riesgos del playtest">
        <article>
          <Bug size={18} />
          <span>Riesgo técnico</span>
          <strong className={`status-pill ${crashLevel}`}>{riskLabel(crashLevel, 'Riesgo técnico')}</strong>
        </article>
        <article>
          <Users size={18} />
          <span>Riesgo de balance</span>
          <strong className={`status-pill ${balanceLevel}`}>{riskLabel(balanceLevel, 'Riesgo de balance')}</strong>
        </article>
        <article>
          <Network size={18} />
          <span>Riesgo de retención</span>
          <strong className={`status-pill ${retentionLevel}`}>{riskLabel(retentionLevel, 'Riesgo de retención')}</strong>
        </article>
      </section>

      <section className="kpi-grid">
        <KpiCard
          icon="winrate"
          label="Tasa de victoria (winrate)"
          value={`${model.kpis.winrate}%`}
          detail="Fact_PartidaJugador"
          signal="Estable"
        />
        <KpiCard
          icon="abandonment"
          label="Tasa de abandono"
          value={`${model.kpis.abandonment}%`}
          detail="salidas antes de cierre"
          signal={model.kpis.abandonment > 10 ? 'Riesgo de retención' : 'Estable'}
          level={model.kpis.abandonment > 10 ? 'warning' : 'ok'}
        />
        <KpiCard
          icon="crash"
          label="Tasa de crashes"
          value={`${model.kpis.crashRate}%`}
          detail="Fact_ErrorTecnico"
          signal={riskLabel(crashLevel, 'Riesgo técnico')}
          level={crashLevel}
        />
        <KpiCard icon="fps" label="FPS promedio" value={`${model.kpis.avgFps}`} detail="Sesiones de playtest" signal="Estable" />
        <KpiCard
          icon="satisfaction"
          label="Satisfacción promedio"
          value={`${model.kpis.satisfaction}/10`}
          detail="encuestas ponderadas"
          signal={satisfactionLevel === 'ok' ? 'Estable' : 'Riesgo de retención'}
          level={satisfactionLevel}
        />
        <KpiCard
          icon="return"
          label="Intención / retención estimada"
          value={`${model.kpis.returnIntent}%`}
          detail="aproximación entre sesiones"
          signal={riskLabel(retentionLevel, 'Riesgo de retención')}
          level={retentionLevel}
        />
      </section>

      <Panel
        title="Cobertura del modelo dimensional"
        eyebrow="Data Warehouse"
        description="Mapa rápido de las facts y dimensiones principales que alimentan el tablero. Las builds se reconstruyen desde eventos de compra en Fact_EventoGameplay vinculados a Dim_Objeto."
      >
        <div className="coverage-grid">
          {dimensionalCoverage.map((item) => (
            <article className={`coverage-node ${item.tone}`} key={item.name}>
              <span>{item.kind}</span>
              <strong>{item.name}</strong>
            </article>
          ))}
        </div>
      </Panel>

      <Panel
        title="Balance de personajes"
        eyebrow="Telemetría de personajes"
        description="Detecta personajes demasiado fuertes o débiles combinando tasa de victoria, tasa de selección (pick rate), KDA y daño promedio."
        badge={riskLabel(balanceLevel, 'Riesgo de balance')}
        badgeLevel={balanceLevel}
      >
        <div className="section-grid two">
          <div className="chart-box">
            <h3>Tasa de victoria (winrate) por personaje</h3>
            <ResponsiveContainer width="100%" height={290}>
              <BarChart data={model.heroRows} margin={{ top: 16, right: 18, left: 4, bottom: 42 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,.08)" />
                <XAxis dataKey="hero" stroke="#aab4bd" tick={{ fontSize: 11 }} angle={-24} textAnchor="end" height={70} />
                <YAxis stroke="#aab4bd" domain={[35, 65]} />
                <Tooltip {...tooltipProps()} cursor={{ fill: 'rgba(215,168,79,.08)' }} />
                <Bar dataKey="winrate" name="Tasa de victoria %" radius={[5, 5, 0, 0]}>
                  {model.heroRows.map((row) => (
                    <Cell key={row.hero} fill={row.winrate > 55 ? chartColors.gold : row.winrate < 45 ? chartColors.red : chartColors.green} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="chart-box">
            <h3>Tasa de selección (pick rate) y KDA promedio</h3>
            <ResponsiveContainer width="100%" height={290}>
              <ComposedChart data={model.heroRows} margin={{ top: 16, right: 20, left: 4, bottom: 42 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,.08)" />
                <XAxis dataKey="hero" stroke="#aab4bd" tick={{ fontSize: 11 }} angle={-24} textAnchor="end" height={70} />
                <YAxis yAxisId="left" stroke="#aab4bd" />
                <YAxis yAxisId="right" orientation="right" stroke="#aab4bd" />
                <Tooltip {...tooltipProps()} cursor={{ fill: 'rgba(74,163,182,.08)' }} />
                <Legend />
                <Bar yAxisId="left" dataKey="pickRate" name="Tasa de selección %" fill={chartColors.teal} radius={[5, 5, 0, 0]} />
                <Line yAxisId="right" type="monotone" dataKey="kda" name="KDA promedio" stroke={chartColors.gold} strokeWidth={3} dot={{ r: 3 }} />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </div>
        <HeroRankingTable rows={model.heroRows} />
      </Panel>

      <Panel
        title="Rendimiento en partida"
        eyebrow="Flujo de partida"
        description="Resume duración, abandono y eventos de gameplay para decidir si el ritmo de partida funciona por mapa, versión y rango competitivo (ELO/MMR)."
      >
        <div className="mini-strip">
          <div>
            <span>Duración promedio</span>
            <strong>{model.kpis.avgDuration} min</strong>
          </div>
          <div>
            <span>Eventos analizados</span>
            <strong>{model.eventRows.reduce((sum, row) => sum + row.count, 0).toLocaleString('es-AR')}</strong>
          </div>
          <div>
            <span>Fase más activa</span>
            <strong>{[...model.phaseDistribution].sort((a, b) => b.events - a.events)[0]?.phase}</strong>
          </div>
          <div>
            <span>Brecha ganador/perdedor</span>
            <strong>{model.kpis.winnerLoserGap}%</strong>
            <small>Índice de contribución en combate</small>
          </div>
        </div>
        <div className="section-grid three">
          <div className="chart-box">
            <h3>Abandono por mapa</h3>
            <ResponsiveContainer width="100%" height={235}>
              <BarChart data={model.abandonmentByMap} margin={{ top: 12, right: 12, left: 4, bottom: 18 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,.08)" />
                <XAxis dataKey="map" stroke="#aab4bd" tick={{ fontSize: 11 }} />
                <YAxis stroke="#aab4bd" />
                <Tooltip {...tooltipProps()} cursor={{ fill: 'rgba(201,119,70,.09)' }} />
                <Bar dataKey="abandonment" name="Abandono %" fill={chartColors.copper} radius={[5, 5, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="chart-box">
            <h3>Evolución por versión</h3>
            <ResponsiveContainer width="100%" height={235}>
              <LineChart data={model.versionTrend} margin={{ top: 12, right: 18, left: 4, bottom: 10 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,.08)" />
                <XAxis dataKey="version" stroke="#aab4bd" />
                <YAxis stroke="#aab4bd" />
                <Tooltip {...tooltipProps()} />
                <Legend />
                <Line type="monotone" dataKey="winrate" name="Tasa de victoria %" stroke={chartColors.gold} strokeWidth={3} />
                <Line type="monotone" dataKey="satisfaction" name="Satisfacción" stroke={chartColors.green} strokeWidth={3} />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div className="chart-box">
            <h3>Eventos por fase</h3>
            <ResponsiveContainer width="100%" height={235}>
              <BarChart data={model.phaseDistribution} margin={{ top: 12, right: 12, left: 4, bottom: 10 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,.08)" />
                <XAxis dataKey="phase" stroke="#aab4bd" />
                <YAxis stroke="#aab4bd" />
                <Tooltip {...tooltipProps()} />
                <Legend />
                <Bar dataKey="objectives" name="Objetivos" stackId="a" fill={chartColors.gold} radius={[5, 5, 0, 0]} />
                <Bar dataKey="fights" name="Peleas de equipo" stackId="a" fill={chartColors.green} radius={[5, 5, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="chart-box">
          <h3>Mapa de calor de eventos por minuto y fase</h3>
          <EventHeatmap rows={model.heatmap} />
        </div>
      </Panel>

      <Panel
        title="Rendimiento técnico"
        eyebrow="Estabilidad del cliente"
        description="Prioriza bugs, crashes, latencia y FPS para identificar versiones, regiones o mapas que degradan la experiencia del playtest."
        badge={riskLabel(crashLevel, 'Riesgo técnico')}
        badgeLevel={crashLevel}
      >
        <div className="section-grid two">
          <div className="chart-box">
            <h3>Errores técnicos por versión</h3>
            <ResponsiveContainer width="100%" height={260}>
              <ComposedChart data={model.errorsByVersion} margin={{ top: 14, right: 18, left: 4, bottom: 10 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,.08)" />
                <XAxis dataKey="version" stroke="#aab4bd" />
                <YAxis stroke="#aab4bd" />
                <Tooltip {...tooltipProps()} />
                <Legend />
                <Bar dataKey="errores" name="Errores" fill={chartColors.blue} radius={[5, 5, 0, 0]} />
                <Line type="monotone" dataKey="crashes" name="Crashes" stroke={chartColors.red} strokeWidth={3} />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
          <div className="chart-box">
            <h3>Crashes, desconexiones y errores por tipo</h3>
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={model.errorsByType} layout="vertical" margin={{ top: 12, right: 20, left: 98, bottom: 10 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,.08)" />
                <XAxis type="number" stroke="#aab4bd" />
                <YAxis type="category" dataKey="label" stroke="#aab4bd" width={156} tick={{ fontSize: 11 }} />
                <Tooltip {...tooltipProps()} cursor={{ fill: 'rgba(217,101,87,.08)' }} />
                <Bar dataKey="count" name="Ocurrencias" fill={chartColors.red} radius={[0, 5, 5, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="section-grid two">
          <div className="chart-box">
            <h3>FPS promedio por región</h3>
            <ResponsiveContainer width="100%" height={230}>
              <BarChart data={model.fpsByRegion} margin={{ top: 12, right: 14, left: 4, bottom: 10 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,.08)" />
                <XAxis dataKey="region" stroke="#aab4bd" />
                <YAxis stroke="#aab4bd" domain={[70, 140]} />
                <Tooltip {...tooltipProps()} />
                <Bar dataKey="fps" fill={chartColors.green} radius={[5, 5, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="chart-box">
            <h3>Latencia promedio por región</h3>
            <ResponsiveContainer width="100%" height={230}>
              <BarChart data={model.fpsByRegion} margin={{ top: 12, right: 14, left: 4, bottom: 10 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,.08)" />
                <XAxis dataKey="region" stroke="#aab4bd" />
                <YAxis stroke="#aab4bd" />
                <Tooltip {...tooltipProps()} />
                <Bar dataKey="latency" name="Latencia ms" fill={chartColors.copper} radius={[5, 5, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        <CriticalErrorsTable rows={model.criticalErrors} />
      </Panel>

      <Panel
        title="Experiencia y retención del jugador"
        eyebrow="Encuestas y comentarios"
        description="Analiza satisfacción y frustración. La intención de retorno se usa como aproximación de retención entre sesiones de playtest."
        badge={riskLabel(retentionLevel, 'Riesgo de retención')}
        badgeLevel={retentionLevel}
      >
        <div className="section-grid three">
          <div className="experience-card">
            <Activity />
            <span>Satisfacción promedio</span>
            <strong>{model.kpis.satisfaction}/10</strong>
            <small className={satisfactionLevel}>La alerta se activa por debajo de 6.4.</small>
          </div>
          <div className="experience-card">
            <Sparkles />
            <span>Intención / retención estimada</span>
            <strong>{model.kpis.returnIntent}%</strong>
            <small>Perfil más fuerte: {topReturn?.profile}</small>
          </div>
          <div className="experience-card">
            <ShieldAlert />
            <span>Mayor riesgo de no retorno</span>
            <strong>{lowReturn?.profile}</strong>
            <small>{lowReturn?.returnIntent}% de intención de retorno</small>
          </div>
        </div>
        <div className="section-grid two">
          <div className="chart-box">
            <h3>Comentarios por categoría</h3>
            <ResponsiveContainer width="100%" height={270}>
              <PieChart>
                <Pie
                  data={model.feedbackByCategory}
                  dataKey="responses"
                  nameKey="category"
                  innerRadius={60}
                  outerRadius={96}
                  paddingAngle={4}
                >
                  {model.feedbackByCategory.map((entry, index) => (
                    <Cell key={entry.category} fill={pieColors[index % pieColors.length]} />
                  ))}
                </Pie>
                <Tooltip {...tooltipProps()} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="chart-box">
            <h3>Perfiles por intención / retención estimada</h3>
            <ResponsiveContainer width="100%" height={270}>
              <BarChart data={model.profiles} margin={{ top: 12, right: 14, left: 4, bottom: 18 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,.08)" />
                <XAxis dataKey="profile" stroke="#aab4bd" tick={{ fontSize: 11 }} />
                <YAxis stroke="#aab4bd" domain={[45, 95]} />
                <Tooltip {...tooltipProps()} />
                <Bar dataKey="returnIntent" name="Retorno %" fill={chartColors.gold} radius={[5, 5, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </Panel>

      <Panel
        title="Vista predictiva / Data Mining"
        eyebrow="Capa predictiva simulada"
        description="Vista conceptual para mostrar cómo el Data Warehouse podría alimentar modelos de predicción de abandono y retorno al próximo playtest."
        className="mining-panel"
      >
        <div className="mining-grid">
          {model.mining.map((item) => (
            <article className={`mining-card ${item.value.includes('alto') ? 'danger' : item.value.includes('medio') ? 'warning' : 'ok'}`} key={item.label}>
              <Layers />
              <span>{item.label}</span>
              <strong>{item.value}</strong>
              <div className="score-bar">
                <i style={{ width: `${item.score}%` }} />
              </div>
              <small>Puntaje simulado: {item.score}/100</small>
            </article>
          ))}
        </div>
      </Panel>
    </main>
  );
}
