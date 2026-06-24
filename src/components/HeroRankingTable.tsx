interface HeroRow {
  hero: string;
  played: number;
  winrate: number;
  pickRate: number;
  kda: number;
  avgDamage: number;
  alert: string;
  alertLevel: string;
}

export function HeroRankingTable({ rows }: { rows: HeroRow[] }) {
  return (
    <div className="table-wrap">
      <table>
        <thead>
          <tr>
            <th>Personaje</th>
            <th>Tasa de victoria</th>
            <th>Tasa de selección</th>
            <th>KDA</th>
            <th>Daño prom.</th>
            <th>Señal</th>
          </tr>
        </thead>
        <tbody>
          {[...rows]
            .sort((a, b) => b.winrate - a.winrate)
            .map((row) => (
              <tr key={row.hero}>
                <td className="hero-name">{row.hero}</td>
                <td>{row.winrate}%</td>
                <td>{row.pickRate}%</td>
                <td>{row.kda}</td>
                <td>{row.avgDamage.toLocaleString('es-AR')}</td>
                <td>
                  <span className={`status-pill ${row.alertLevel}`}>{row.alert}</span>
                </td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
}
