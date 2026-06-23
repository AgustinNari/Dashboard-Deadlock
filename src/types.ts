export type GameVersion = 'Patch 0.1' | 'Patch 0.2' | 'Patch 0.3' | 'Patch 0.4';
export type Region = 'NA' | 'EU' | 'SA' | 'SEA';
export type MapName = 'Mapa principal' | 'Modo experimental' | 'Test interno';
export type MmrRange = 'Bajo' | 'Medio' | 'Alto';
export type Period = '7 días' | '14 días' | '30 días';
export type GamePhase = 'Early' | 'Mid' | 'Late';
export type AlertLevel = 'ok' | 'warning' | 'danger';

export interface Filters {
  version: GameVersion | 'Todos';
  region: Region | 'Todas';
  map: MapName | 'Todos';
  mmr: MmrRange | 'Todos';
  period: Period;
}

export interface MatchPlayerFact {
  id: number;
  version: GameVersion;
  region: Region;
  map: MapName;
  mmr: MmrRange;
  hero: string;
  won: boolean;
  abandoned: boolean;
  duration: number;
  kills: number;
  deaths: number;
  assists: number;
  damage: number;
  fps: number;
  latency: number;
}

export interface GameplayEventFact {
  id: number;
  version: GameVersion;
  region: Region;
  map: MapName;
  mmr: MmrRange;
  minute: number;
  phase: GamePhase;
  eventType: 'Kill' | 'Objective' | 'Teamfight' | 'Economy swing';
  count: number;
}

export interface TechnicalErrorFact {
  id: number;
  version: GameVersion;
  region: Region;
  map: MapName;
  mmr: MmrRange;
  type: 'Crash' | 'Disconnect' | 'Render hitch' | 'Packet loss' | 'Audio desync';
  severity: 'Alta' | 'Media' | 'Baja';
  occurrences: number;
  affectedPlayers: number;
}

export interface FeedbackFact {
  id: number;
  version: GameVersion;
  region: Region;
  map: MapName;
  mmr: MmrRange;
  category: 'Balance' | 'Rendimiento' | 'Matchmaking' | 'Claridad visual' | 'Diversión';
  satisfaction: number;
  returnIntent: number;
  profile: 'Competitivo' | 'Casual' | 'Nuevo jugador' | 'Tester técnico';
  responses: number;
}
