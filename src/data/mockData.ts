import {
  FeedbackFact,
  GamePhase,
  GameVersion,
  GameplayEventFact,
  MapName,
  MatchPlayerFact,
  MmrRange,
  Region,
  TechnicalErrorFact,
} from '../types';

export const versions: GameVersion[] = ['Patch 0.1', 'Patch 0.2', 'Patch 0.3', 'Patch 0.4'];
export const regions: Region[] = ['NA', 'EU', 'SA', 'SEA'];
export const maps: MapName[] = ['Mapa principal', 'Modo experimental', 'Test interno'];
export const mmrRanges: MmrRange[] = ['Bajo', 'Medio', 'Alto'];

export const heroes = [
  'Vesper',
  'Iron Saint',
  'Nyx Relay',
  'Copper Warden',
  'Morrow',
  'Seven Bells',
  'Harbor Geist',
  'Ash Circuit',
];

const heroProfiles = [
  { win: 0.58, pick: 1.28, kda: 3.1, damage: 23500 },
  { win: 0.54, pick: 1.05, kda: 2.7, damage: 21200 },
  { win: 0.46, pick: 0.86, kda: 2.1, damage: 18800 },
  { win: 0.43, pick: 0.72, kda: 1.9, damage: 17600 },
  { win: 0.51, pick: 1.1, kda: 2.45, damage: 20400 },
  { win: 0.56, pick: 1.18, kda: 2.95, damage: 22600 },
  { win: 0.49, pick: 0.92, kda: 2.3, damage: 19700 },
  { win: 0.52, pick: 0.97, kda: 2.55, damage: 20700 },
];

const versionTuning: Record<GameVersion, number> = {
  'Patch 0.1': -0.035,
  'Patch 0.2': -0.01,
  'Patch 0.3': 0.012,
  'Patch 0.4': 0.025,
};

const regionLatency: Record<Region, number> = { NA: 46, EU: 54, SA: 72, SEA: 94 };
const mapPressure: Record<MapName, number> = {
  'Mapa principal': 0,
  'Modo experimental': 0.025,
  'Test interno': 0.04,
};
const mmrSkill: Record<MmrRange, number> = { Bajo: -0.025, Medio: 0, Alto: 0.025 };

let matchId = 1;
export const matchPlayerFacts: MatchPlayerFact[] = versions.flatMap((version, versionIndex) =>
  regions.flatMap((region, regionIndex) =>
    maps.flatMap((map, mapIndex) =>
      mmrRanges.flatMap((mmr, mmrIndex) =>
        heroes.flatMap((hero, heroIndex) => {
          const profile = heroProfiles[heroIndex];
          const sampleSize = Math.round(18 * profile.pick + versionIndex + regionIndex + mapIndex);

          return Array.from({ length: sampleSize }, (_, row) => {
            const rhythm = ((row + heroIndex * 3 + regionIndex + mmrIndex) % 10) / 100;
            const winChance = profile.win + versionTuning[version] + mmrSkill[mmr] - mapPressure[map] + rhythm - 0.045;
            const won = ((row * 17 + heroIndex * 11 + versionIndex * 7 + regionIndex) % 100) < winChance * 100;
            const abandoned = ((row * 13 + mapIndex * 9 + regionIndex * 4 + heroIndex) % 100) < (6 + mapPressure[map] * 160 + (mmr === 'Bajo' ? 4 : 0));
            const deaths = 2 + ((row + heroIndex + mapIndex) % 8);
            const kda = Math.max(1.2, profile.kda + mmrSkill[mmr] * 6 + (won ? 0.35 : -0.25));

            return {
              id: matchId++,
              version,
              region,
              map,
              mmr,
              hero,
              won,
              abandoned,
              duration: 24 + versionIndex * 1.2 + mapIndex * 2.4 + ((row + heroIndex) % 12),
              kills: Math.round(kda * 1.6 + (row % 5)),
              deaths,
              assists: Math.round(kda * 2.1 + ((row + 2) % 6)),
              damage: Math.round(profile.damage * (0.9 + ((row % 9) / 40)) + mmrIndex * 950),
              fps: Math.round(126 - regionIndex * 5 - mapIndex * 7 + versionIndex * 4 - (row % 11)),
              latency: Math.round(regionLatency[region] + mapIndex * 8 + (row % 18)),
            };
          });
        }),
      ),
    ),
  ),
);

const phases: GamePhase[] = ['Early', 'Mid', 'Late'];
let eventId = 1;
export const gameplayEventFacts: GameplayEventFact[] = versions.flatMap((version, versionIndex) =>
  regions.flatMap((region, regionIndex) =>
    maps.flatMap((map, mapIndex) =>
      mmrRanges.flatMap((mmr, mmrIndex) =>
        phases.flatMap((phase, phaseIndex) =>
          Array.from({ length: 8 }, (_, minuteIndex) => {
            const minute = phaseIndex * 10 + minuteIndex + 1;
            const phaseMultiplier = phase === 'Early' ? 0.82 : phase === 'Mid' ? 1.25 : 1.04;
            const count = Math.round((10 + versionIndex * 2 + mmrIndex * 1.5 + mapIndex * 2 + (minuteIndex % 3)) * phaseMultiplier);

            return {
              id: eventId++,
              version,
              region,
              map,
              mmr,
              minute,
              phase,
              eventType: minuteIndex % 4 === 0 ? 'Objective' : minuteIndex % 3 === 0 ? 'Teamfight' : minuteIndex % 2 === 0 ? 'Economy swing' : 'Kill',
              count: Math.max(3, count - regionIndex),
            };
          }),
        ),
      ),
    ),
  ),
);

let errorId = 1;
export const technicalErrorFacts: TechnicalErrorFact[] = versions.flatMap((version, versionIndex) =>
  regions.flatMap((region, regionIndex) =>
    maps.flatMap((map, mapIndex) =>
      mmrRanges.flatMap((mmr, mmrIndex) =>
        (['Crash', 'Disconnect', 'Render hitch', 'Packet loss', 'Audio desync'] as const).map((type, typeIndex) => {
          const base = type === 'Crash' ? 7 : type === 'Disconnect' ? 10 : type === 'Render hitch' ? 15 : type === 'Packet loss' ? 12 : 6;
          const patchStability = [1.28, 1.08, 0.9, 0.72][versionIndex];
          const networkStress = type === 'Packet loss' || type === 'Disconnect' ? regionIndex * 2.6 : regionIndex * 0.7;
          const mapStress = mapIndex * (type === 'Render hitch' ? 4.2 : 1.8);
          const occurrences = Math.round((base + networkStress + mapStress + mmrIndex + typeIndex) * patchStability);

          return {
            id: errorId++,
            version,
            region,
            map,
            mmr,
            type,
            severity: type === 'Crash' || occurrences > 17 ? 'Alta' : occurrences > 10 ? 'Media' : 'Baja',
            occurrences,
            affectedPlayers: Math.round(occurrences * (1.5 + typeIndex * 0.2)),
          };
        }),
      ),
    ),
  ),
);

let feedbackId = 1;
export const feedbackFacts: FeedbackFact[] = versions.flatMap((version, versionIndex) =>
  regions.flatMap((region, regionIndex) =>
    maps.flatMap((map, mapIndex) =>
      mmrRanges.flatMap((mmr, mmrIndex) =>
        (['Balance', 'Rendimiento', 'Matchmaking', 'Claridad visual', 'Diversión'] as const).map((category, categoryIndex) => {
          const patchLift = versionIndex * 0.28;
          const mapPenalty = mapIndex * 0.22;
          const categoryPenalty = category === 'Rendimiento' ? regionIndex * 0.13 : category === 'Balance' ? mmrIndex * 0.12 : 0;
          const satisfaction = Math.max(4.8, Math.min(9.2, 6.65 + patchLift - mapPenalty - categoryPenalty + ((categoryIndex + mmrIndex) % 3) * 0.18));
          const returnIntent = Math.max(48, Math.min(91, satisfaction * 9.5 + versionIndex * 2 - mapIndex * 4 - (category === 'Matchmaking' ? 5 : 0)));

          return {
            id: feedbackId++,
            version,
            region,
            map,
            mmr,
            category,
            satisfaction: Number(satisfaction.toFixed(1)),
            returnIntent: Math.round(returnIntent),
            profile: categoryIndex === 0 ? 'Competitivo' : categoryIndex === 1 ? 'Tester técnico' : categoryIndex === 2 ? 'Nuevo jugador' : 'Casual',
            responses: 28 + versionIndex * 4 + regionIndex * 2 + mmrIndex * 3 - mapIndex,
          };
        }),
      ),
    ),
  ),
);
