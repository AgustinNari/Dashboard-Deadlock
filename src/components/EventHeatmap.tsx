interface HeatmapRow {
  phase: string;
  minutes: { label: string; value: number }[];
}

export function EventHeatmap({ rows }: { rows: HeatmapRow[] }) {
  const maxValue = Math.max(...rows.flatMap((row) => row.minutes.map((minute) => minute.value)), 1);

  return (
    <div className="heatmap">
      {rows.map((row) => (
        <div className="heatmap-row" key={row.phase}>
          <span>{row.phase}</span>
          <div className="heatmap-cells">
            {row.minutes.map((minute) => {
              const intensity = minute.value / maxValue;
              return (
                <div
                  className="heatmap-cell"
                  key={minute.label}
                  title={`${minute.label}: ${minute.value} eventos`}
                  style={{
                    background: `rgba(68, 190, 154, ${0.18 + intensity * 0.74})`,
                    boxShadow: intensity > 0.72 ? '0 0 18px rgba(68,190,154,.36)' : undefined,
                  }}
                >
                  <strong>{minute.value}</strong>
                  <small>{minute.label}</small>
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
