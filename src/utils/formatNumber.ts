export function formatWeight(kg: number, unit: 'kg' | 'lbs' = 'lbs'): string {
  if (unit === 'lbs') {
    return `${Math.round(kg * 2.205)} lbs`
  }
  return `${kg} kg`
}

export function formatDuration(minutes: number): string {
  if (minutes < 60) return `${minutes} min`
  const h = Math.floor(minutes / 60)
  const m = minutes % 60
  return m ? `${h}h ${m}m` : `${h}h`
}

export function formatCurrency(cents: number): string {
  return `$${(cents / 100).toFixed(2)}`
}
