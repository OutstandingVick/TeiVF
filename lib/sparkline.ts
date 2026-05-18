export function sparkPath(series: number[]) {
  const width = 160;
  const height = 86;
  const step = width / (series.length - 1);
  return series
    .map((point, index) => {
      const x = Math.round(index * step);
      const y = Math.round(height - (point / 100) * height);
      return `${index === 0 ? "M" : "L"}${x} ${y}`;
    })
    .join(" ");
}
