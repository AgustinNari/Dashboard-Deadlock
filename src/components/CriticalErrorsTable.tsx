import { TechnicalErrorFact } from '../types';

export function CriticalErrorsTable({ rows }: { rows: TechnicalErrorFact[] }) {
  return (
    <div className="table-wrap">
      <table>
        <thead>
          <tr>
            <th>Tipo</th>
            <th>Versión</th>
            <th>Región</th>
            <th>Mapa</th>
            <th>Severidad</th>
            <th>Ocurrencias</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.id}>
              <td className="hero-name">{row.type}</td>
              <td>{row.version}</td>
              <td>{row.region}</td>
              <td>{row.map}</td>
              <td>
                <span className={`status-pill ${row.severity === 'Alta' ? 'danger' : 'warning'}`}>{row.severity}</span>
              </td>
              <td>{row.occurrences}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
