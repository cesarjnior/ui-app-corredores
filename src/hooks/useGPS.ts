'use client'

import { useState, useEffect, useCallback } from 'react'
import { GPSTracker, GPSPosition, formatPace, formatDistance, formatDuration } from '@/lib/gps'

export function useGPS() {
  const [tracker] = useState(() => new GPSTracker())
  const [isTracking, setIsTracking] = useState(false)
  const [currentPosition, setCurrentPosition] = useState<GPSPosition | null>(null)
  const [distance, setDistance] = useState(0)
  const [duration, setDuration] = useState(0)
  const [pace, setPace] = useState('0:00')
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let interval: NodeJS.Timeout

    if (isTracking) {
      const startTime = Date.now()
      
      interval = setInterval(() => {
        const elapsed = (Date.now() - startTime) / 1000
        setDuration(elapsed)
        
        const route = tracker.getRoute()
        setDistance(route.totalDistance)
        
        if (route.averageSpeed > 0) {
          setPace(formatPace(route.averageSpeed))
        }
      }, 1000)
    }

    return () => {
      if (interval) clearInterval(interval)
    }
  }, [isTracking, tracker])

  const startTracking = useCallback(() => {
    tracker.start()
    setIsTracking(true)
    setError(null)
  }, [tracker])

  const stopTracking = useCallback(() => {
    tracker.stop()
    setIsTracking(false)
  }, [tracker])

  const resetTracking = useCallback(() => {
    tracker.reset()
    setDistance(0)
    setDuration(0)
    setPace('0:00')
    setCurrentPosition(null)
  }, [tracker])

  return {
    isTracking,
    currentPosition,
    distance: formatDistance(distance),
    distanceMeters: distance,
    duration: formatDuration(duration),
    durationSeconds: duration,
    pace,
    error,
    startTracking,
    stopTracking,
    resetTracking,
    route: tracker.getRoute(),
  }
}
