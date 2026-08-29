export function ProgressBar({ raised, target }: { raised: number; target: number | null }) {
  if (!target || target <= 0) return null;
  const pct = Math.min(100, Math.round((raised / target) * 100));

  return (
    <div>
      <div className="progress-track">
        <div className="progress-fill" style={{ width: `${pct}%` }} />
      </div>
      <div className="progress-label">
        {raised.toLocaleString('ru-RU')} из {target.toLocaleString('ru-RU')} ₽ ({pct}%)
      </div>
    </div>
  );
}
