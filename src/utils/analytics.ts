import {
  FeedbackFact,
  Filters,
  GameplayEventFact,
  MatchPlayerFact,
  TechnicalErrorFact,
} from '../types';
import {
  feedbackFacts,
  gameplayEventFacts,
  heroes,
  matchPlayerFacts,
  technicalErrorFacts,
  versions,
} from '../data/mockData';

const periodWeight = {
  '7 días': 0.48,
  '14 días': 0.72,
  '30 días': 1,
};

const phaseLabels = {
  Early: 'De Línea',
  Mid: 'Mid Game',
  Late: 'Late Game',
};

const errorLabels = {
  Crash: 'Crash',
  Disconnect: 'Desconexión',
  'Render hitch': 'Tirón de renderizado',
  'Packet loss': 'Pérdida de paquetes',
  'Audio desync': 'Desincronización de audio',
};

const percent = (value: number) => Number(value.toFixed(1));
const average = (values: number[]) => (values.length ? values.reduce((sum, value) => sum + value, 0) / values.length : 0);
const weightedAverage = (items: { value: number; weight: number }[]) => {
  const totalWeight = items.reduce((sum, item) => sum + item.weight, 0);
  return totalWeight ? items.reduce((sum, item) => sum + item.value * item.weight, 0) / totalWeight : 0;
};

const withinScope = (filters: Filters) => {
  const versionLimit = Math.max(1, Math.round(versions.length * periodWeight[filters.period]));
  const validVersions = versions.slice(-versionLimit);

  return {
    version: (value: string) => (filters.version === 'Todos' ? validVersions.includes(value as never) : value === filters.version),
    region: (value: string) => filters.region === 'Todas' || value === filters.region,
    map: (value: string) => filters.map === 'Todos' || value === filters.map,
    mmr: (value: string) => filters.mmr === 'Todos' || value === filters.mmr,
  };
};

export const getFilteredData = (filters: Filters) => {
  const scope = withinScope(filters);
  const matchRows = matchPlayerFacts.filter(
    (row) => scope.version(row.version) && scope.region(row.region) && scope.map(row.map) && scope.mmr(row.mmr),
  );
  const eventRows = gameplayEventFacts.filter(
    (row) => scope.version(row.version) && scope.region(row.region) && scope.map(row.map) && scope.mmr(row.mmr),
  );
  const errorRows = technicalErrorFacts.filter(
    (row) => scope.version(row.version) && scope.region(row.region) && scope.map(row.map) && scope.mmr(row.mmr),
  );
  const feedbackRows = feedbackFacts.filter(
    (row) => scope.version(row.version) && scope.region(row.region) && scope.map(row.map) && scope.mmr(row.mmr),
  );

  return { matchRows, eventRows, errorRows, feedbackRows };
};

export const buildDashboardModel = (filters: Filters) => {
  const { matchRows, eventRows, errorRows, feedbackRows } = getFilteredData(filters);
  const totalPlayers = Math.max(matchRows.length, 1);
  const crashOccurrences = errorRows.filter((row) => row.type === 'Crash').reduce((sum, row) => sum + row.occurrences, 0);

  const kpis = {
    winrate: percent((matchRows.filter((row) => row.won).length / totalPlayers) * 100),
    abandonment: percent((matchRows.filter((row) => row.abandoned).length / totalPlayers) * 100),
    crashRate: percent((crashOccurrences / totalPlayers) * 100),
    avgFps: Math.round(average(matchRows.map((row) => row.fps))),
    satisfaction: Number(weightedAverage(feedbackRows.map((row) => ({ value: row.satisfaction, weight: row.responses }))).toFixed(1)),
    returnIntent: percent(weightedAverage(feedbackRows.map((row) => ({ value: row.returnIntent, weight: row.responses })))),
    avgDuration: Number(average(matchRows.map((row) => row.duration)).toFixed(1)),
    winnerLoserGap: 0,
  };

  const combatContribution = (row: MatchPlayerFact) => row.damage + row.kills * 900 + row.assists * 450;
  const winnerContribution = average(matchRows.filter((row) => row.won).map(combatContribution));
  const loserContribution = average(matchRows.filter((row) => !row.won).map(combatContribution));
  kpis.winnerLoserGap = loserContribution
    ? percent((Math.abs(winnerContribution - loserContribution) / loserContribution) * 100)
    : 0;

  const heroRows = heroes.map((hero) => {
    const rows = matchRows.filter((row) => row.hero === hero);
    const played = rows.length;
    const deaths = rows.reduce((sum, row) => sum + row.deaths, 0);
    const kda = deaths ? rows.reduce((sum, row) => sum + row.kills + row.assists, 0) / deaths : 0;
    const winrate = played ? (rows.filter((row) => row.won).length / played) * 100 : 0;
    const pickRate = (played / totalPlayers) * 100;
    const abandonment = played ? (rows.filter((row) => row.abandoned).length / played) * 100 : 0;
    const avgDamage = average(rows.map((row) => row.damage));
    const alert = winrate > 55 && pickRate > 13 ? 'Riesgo de balance' : winrate < 45 ? 'Debilidad potencial' : 'Estable';

    return {
      hero,
      played,
      winrate: percent(winrate),
      pickRate: percent(pickRate),
      abandonment: percent(abandonment),
      kda: Number(kda.toFixed(2)),
      avgDamage: Math.round(avgDamage),
      alert,
      alertLevel: alert === 'Estable' ? 'ok' : winrate < 45 ? 'danger' : 'warning',
    };
  });

  const versionTrend = versions.map((version) => {
    const rows = matchRows.filter((row) => row.version === version);
    const versionErrors = errorRows.filter((row) => row.version === version);
    const versionFeedback = feedbackRows.filter((row) => row.version === version);

    return {
      version,
      winrate: rows.length ? percent((rows.filter((row) => row.won).length / rows.length) * 100) : 0,
      fps: Math.round(average(rows.map((row) => row.fps))),
      satisfaction: Number(weightedAverage(versionFeedback.map((row) => ({ value: row.satisfaction, weight: row.responses }))).toFixed(1)),
      errors: versionErrors.reduce((sum, row) => sum + row.occurrences, 0),
    };
  });

  const abandonmentByMap = ['Mapa principal', 'Modo experimental', 'Test interno'].map((map) => {
    const rows = matchRows.filter((row) => row.map === map);
    return {
      map,
      abandonment: rows.length ? percent((rows.filter((row) => row.abandoned).length / rows.length) * 100) : 0,
    };
  });

  const phaseDistribution = (['Early', 'Mid', 'Late'] as const).map((phase) => {
    const rows = eventRows.filter((row) => row.phase === phase);
    return {
      phase: phaseLabels[phase],
      events: rows.reduce((sum, row) => sum + row.count, 0),
      objectives: rows.filter((row) => row.eventType === 'Objective').reduce((sum, row) => sum + row.count, 0),
      fights: rows.filter((row) => row.eventType === 'Teamfight').reduce((sum, row) => sum + row.count, 0),
    };
  });

  const heatmap = (['Early', 'Mid', 'Late'] as const).map((phase) => ({
    phase: phaseLabels[phase],
    minutes: Array.from({ length: 8 }, (_, index) => {
      const rows = eventRows.filter((row) => row.phase === phase && row.minute % 10 === index + 1);
      return {
        label: `${phaseLabels[phase].slice(0, 1)}${index + 1}`,
        value: rows.reduce((sum, row) => sum + row.count, 0),
      };
    }),
  }));

  const errorsByVersion = versions.map((version) => ({
    version,
    errores: errorRows.filter((row) => row.version === version).reduce((sum, row) => sum + row.occurrences, 0),
    crashes: errorRows.filter((row) => row.version === version && row.type === 'Crash').reduce((sum, row) => sum + row.occurrences, 0),
  }));

  const fpsByRegion = ['NA', 'EU', 'SA', 'SEA'].map((region) => {
    const rows = matchRows.filter((row) => row.region === region);
    return {
      region,
      fps: Math.round(average(rows.map((row) => row.fps))),
      latency: Math.round(average(rows.map((row) => row.latency))),
    };
  });

  const errorsByType = (['Crash', 'Disconnect', 'Render hitch', 'Packet loss', 'Audio desync'] as const).map((type) => ({
    type,
    label: errorLabels[type],
    count: errorRows.filter((row) => row.type === type).reduce((sum, row) => sum + row.occurrences, 0),
  }));

  const criticalErrors = [...errorRows]
    .filter((row) => row.severity !== 'Baja')
    .sort((a, b) => b.occurrences - a.occurrences)
    .slice(0, 8);

  const feedbackByCategory = ['Balance', 'Rendimiento', 'Bug', 'Frustración', 'Diversión', 'Sugerencia'].map((category) => {
    const rows = feedbackRows.filter((row) => row.category === category);
    return {
      category,
      responses: rows.reduce((sum, row) => sum + row.responses, 0),
      satisfaction: Number(weightedAverage(rows.map((row) => ({ value: row.satisfaction, weight: row.responses }))).toFixed(1)),
    };
  });

  const profiles = ['Competitivo', 'Casual', 'Nuevo jugador', 'Tester técnico'].map((profile) => {
    const rows = feedbackRows.filter((row) => row.profile === profile);
    return {
      profile,
      returnIntent: percent(weightedAverage(rows.map((row) => ({ value: row.returnIntent, weight: row.responses })))),
      satisfaction: Number(weightedAverage(rows.map((row) => ({ value: row.satisfaction, weight: row.responses }))).toFixed(1)),
    };
  });

  const mining = [
    {
      label: 'Predicción de abandono',
      value: kpis.abandonment > 11 || kpis.crashRate > 5 ? 'Riesgo alto' : kpis.abandonment > 8 ? 'Riesgo medio' : 'Riesgo bajo',
      score: Math.min(92, Math.round(kpis.abandonment * 5.8 + kpis.crashRate * 3.2)),
    },
    {
      label: 'Retorno al próximo playtest',
      value: kpis.returnIntent < 64 || kpis.satisfaction < 6.4 ? 'Riesgo alto' : kpis.returnIntent < 74 ? 'Riesgo medio' : 'Riesgo bajo',
      score: Math.round(kpis.returnIntent),
    },
  ];

  return {
    kpis,
    heroRows,
    versionTrend,
    abandonmentByMap,
    phaseDistribution,
    heatmap,
    errorsByVersion,
    fpsByRegion,
    errorsByType,
    criticalErrors,
    feedbackByCategory,
    profiles,
    mining,
    matchRows: matchRows as MatchPlayerFact[],
    eventRows: eventRows as GameplayEventFact[],
    errorRows: errorRows as TechnicalErrorFact[],
    feedbackRows: feedbackRows as FeedbackFact[],
  };
};
