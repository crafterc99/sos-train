export function getPlaybackUrl(playbackId: string): string {
  return `https://stream.mux.com/${playbackId}.m3u8`
}

export function getThumbnailUrl(playbackId: string, options?: { time?: number; width?: number }): string {
  const params = new URLSearchParams()
  if (options?.time) params.set('time', String(options.time))
  if (options?.width) params.set('width', String(options.width))
  const query = params.toString()
  return `https://image.mux.com/${playbackId}/thumbnail.jpg${query ? `?${query}` : ''}`
}
