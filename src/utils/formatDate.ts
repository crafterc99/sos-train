import { formatDistanceToNow, format } from 'date-fns'

export function formatRelative(date: string | Date): string {
  return formatDistanceToNow(new Date(date), { addSuffix: true })
}

export function formatShort(date: string | Date): string {
  return format(new Date(date), 'MMM d, yyyy')
}

export function formatFull(date: string | Date): string {
  return format(new Date(date), 'MMMM d, yyyy h:mm a')
}

export function formatTime(date: string | Date): string {
  return format(new Date(date), 'h:mm a')
}
