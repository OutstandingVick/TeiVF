export function SkeletonCard() {
  return (
    <div className="skeleton-card" aria-hidden="true">
      <div className="skeleton-line mid" />
      <div className="skeleton-line big" />
      <div className="skeleton-line" />
      <div className="skeleton-line mid" />
      <div className="skeleton-actions">
        <span />
        <span />
      </div>
    </div>
  );
}
