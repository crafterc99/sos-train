import { useEffect, useRef, useState } from 'react'
import Hls from 'hls.js'
import clsx from 'clsx'
import { PlayIcon, PauseIcon, ArrowsPointingOutIcon } from '@heroicons/react/24/solid'

interface VideoPlayerProps {
  playbackId: string
  poster?: string
  className?: string
}

const SPEEDS = [0.5, 0.75, 1, 1.25, 1.5, 2]

export default function VideoPlayer({ playbackId, poster, className }: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [playing, setPlaying] = useState(false)
  const [progress, setProgress] = useState(0)
  const [duration, setDuration] = useState(0)
  const [currentTime, setCurrentTime] = useState(0)
  const [speed, setSpeed] = useState(1)
  const [showControls, setShowControls] = useState(true)
  const hideTimeout = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)

  const src = `https://stream.mux.com/${playbackId}.m3u8`
  const posterUrl = poster || `https://image.mux.com/${playbackId}/thumbnail.jpg?time=2&width=800`

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    if (Hls.isSupported()) {
      const hls = new Hls()
      hls.loadSource(src)
      hls.attachMedia(video)
      return () => hls.destroy()
    } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = src
    }
  }, [src])

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    const onTime = () => {
      setCurrentTime(video.currentTime)
      setProgress((video.currentTime / video.duration) * 100)
    }
    const onLoaded = () => setDuration(video.duration)
    const onPlay = () => setPlaying(true)
    const onPause = () => setPlaying(false)

    video.addEventListener('timeupdate', onTime)
    video.addEventListener('loadedmetadata', onLoaded)
    video.addEventListener('play', onPlay)
    video.addEventListener('pause', onPause)

    return () => {
      video.removeEventListener('timeupdate', onTime)
      video.removeEventListener('loadedmetadata', onLoaded)
      video.removeEventListener('play', onPlay)
      video.removeEventListener('pause', onPause)
    }
  }, [])

  const togglePlay = () => {
    const video = videoRef.current
    if (!video) return
    if (video.paused) video.play()
    else video.pause()
  }

  const seek = (e: React.MouseEvent<HTMLDivElement>) => {
    const video = videoRef.current
    if (!video || !duration) return
    const rect = e.currentTarget.getBoundingClientRect()
    const pct = (e.clientX - rect.left) / rect.width
    video.currentTime = pct * duration
  }

  const changeSpeed = () => {
    const video = videoRef.current
    if (!video) return
    const idx = SPEEDS.indexOf(speed)
    const next = SPEEDS[(idx + 1) % SPEEDS.length]
    video.playbackRate = next
    setSpeed(next)
  }

  const toggleFullscreen = () => {
    const el = containerRef.current
    if (!el) return
    if (document.fullscreenElement) document.exitFullscreen()
    else el.requestFullscreen()
  }

  const handleMouseMove = () => {
    setShowControls(true)
    if (hideTimeout.current) clearTimeout(hideTimeout.current)
    hideTimeout.current = setTimeout(() => {
      if (playing) setShowControls(false)
    }, 3000)
  }

  const formatTime = (sec: number) => {
    const m = Math.floor(sec / 60)
    const s = Math.floor(sec % 60)
    return `${m}:${s.toString().padStart(2, '0')}`
  }

  return (
    <div
      ref={containerRef}
      className={clsx('relative bg-black rounded-xl overflow-hidden group', className)}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => playing && setShowControls(false)}
    >
      <video
        ref={videoRef}
        poster={posterUrl}
        className="w-full aspect-video cursor-pointer"
        onClick={togglePlay}
        playsInline
      />

      {/* Controls overlay */}
      <div className={clsx(
        'absolute inset-0 flex flex-col justify-end transition-opacity duration-300',
        showControls ? 'opacity-100' : 'opacity-0'
      )}>
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />

        {/* Center play button */}
        {!playing && (
          <button
            onClick={togglePlay}
            className="absolute inset-0 flex items-center justify-center"
          >
            <div className="w-16 h-16 rounded-full bg-amber/90 flex items-center justify-center shadow-[0_0_30px_rgba(255,165,0,0.5)]">
              <PlayIcon className="w-8 h-8 text-charcoal ml-1" />
            </div>
          </button>
        )}

        {/* Bottom controls */}
        <div className="relative z-10 px-4 pb-4 space-y-2">
          {/* Progress bar */}
          <div
            className="h-1.5 bg-white/20 rounded-full cursor-pointer group/bar"
            onClick={seek}
          >
            <div
              className="h-full bg-amber rounded-full relative transition-all"
              style={{ width: `${progress}%` }}
            >
              <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-amber rounded-full opacity-0 group-hover/bar:opacity-100 transition-opacity" />
            </div>
          </div>

          {/* Controls row */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button onClick={togglePlay} className="text-white hover:text-amber transition-colors">
                {playing
                  ? <PauseIcon className="w-5 h-5" />
                  : <PlayIcon className="w-5 h-5" />
                }
              </button>
              <span className="text-xs text-white/60 font-medium tabular-nums">
                {formatTime(currentTime)} / {formatTime(duration)}
              </span>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={changeSpeed}
                className="text-xs font-bold text-white/60 hover:text-amber transition-colors px-1"
              >
                {speed}x
              </button>
              <button onClick={toggleFullscreen} className="text-white/60 hover:text-amber transition-colors">
                <ArrowsPointingOutIcon className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
