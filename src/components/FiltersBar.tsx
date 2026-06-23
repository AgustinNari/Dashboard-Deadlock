import { SlidersHorizontal } from 'lucide-react';
import { maps, mmrRanges, regions, versions } from '../data/mockData';
import { Filters, Period } from '../types';

const periods: Period[] = ['7 días', '14 días', '30 días'];

interface FiltersBarProps {
  filters: Filters;
  onChange: (filters: Filters) => void;
}

export function FiltersBar({ filters, onChange }: FiltersBarProps) {
  const update = <K extends keyof Filters>(key: K, value: Filters[K]) => onChange({ ...filters, [key]: value });

  return (
    <div className="filters-shell">
      <div className="filters-title">
        <SlidersHorizontal size={18} />
        <span>Playtest scope</span>
      </div>
      <label>
        Versión
        <select value={filters.version} onChange={(event) => update('version', event.target.value as Filters['version'])}>
          <option>Todos</option>
          {versions.map((version) => (
            <option key={version}>{version}</option>
          ))}
        </select>
      </label>
      <label>
        Región
        <select value={filters.region} onChange={(event) => update('region', event.target.value as Filters['region'])}>
          <option>Todas</option>
          {regions.map((region) => (
            <option key={region}>{region}</option>
          ))}
        </select>
      </label>
      <label>
        Mapa
        <select value={filters.map} onChange={(event) => update('map', event.target.value as Filters['map'])}>
          <option>Todos</option>
          {maps.map((map) => (
            <option key={map}>{map}</option>
          ))}
        </select>
      </label>
      <label>
        MMR
        <select value={filters.mmr} onChange={(event) => update('mmr', event.target.value as Filters['mmr'])}>
          <option>Todos</option>
          {mmrRanges.map((mmr) => (
            <option key={mmr}>{mmr}</option>
          ))}
        </select>
      </label>
      <label>
        Período
        <select value={filters.period} onChange={(event) => update('period', event.target.value as Period)}>
          {periods.map((period) => (
            <option key={period}>{period}</option>
          ))}
        </select>
      </label>
    </div>
  );
}
