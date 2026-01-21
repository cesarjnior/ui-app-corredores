'use client'

export type GPSPosition = {
  latitude: number
  longitude: number
  accuracy: number
  altitude?: number
  speed?: number
  timestamp: number
}

export type GPSRoute = {
  points: GPSPosition[]
  totalDistance: number
  averageSpeed: number
}

export class GPSTracker {
  private watchId: number | null = null
  private positions: GPSPosition[] = []
  private onUpdate?: (position: GPSPosition) => void
  private onError?: (error: GeolocationPositionError) => void

  constructor(
    onUpdate?: (position: GPSPosition) => void,
    onError?: (error: GeolocationPositionError) => void
  ) {
    this.onUpdate = onUpdate
    this.onError = onError
  }

  start() {
    if (!navigator.geolocation) {
      console.error('Geolocation não suportada')
      return
    }

    this.watchId = navigator.geolocation.watchPosition(
      (position) => {
        const gpsPosition: GPSPosition = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy,
          altitude: position.coords.altitude || undefined,
          speed: position.coords.speed || undefined,
          timestamp: position.timestamp,
        }
        
        this.positions.push(gpsPosition)
        this.onUpdate?.(gpsPosition)
      },
      (error) => {
        this.onError?.(error)
      },
      {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0,
      }
    )
  }

  stop() {
    if (this.watchId !== null) {
      navigator.geolocation.clearWatch(this.watchId)
      this.watchId = null
    }
  }

  getRoute(): GPSRoute {
    const totalDistance = this.calculateTotalDistance()
    const averageSpeed = this.calculateAverageSpeed()

    return {
      points: this.positions,
      totalDistance,
      averageSpeed,
    }
  }

  private calculateTotalDistance(): number {
    let distance = 0
    for (let i = 1; i < this.positions.length; i++) {
      distance += this.haversineDistance(
        this.positions[i - 1],
        this.positions[i]
      )
    }
    return distance
  }

  private calculateAverageSpeed(): number {
    if (this.positions.length < 2) return 0
    
    const totalTime = (this.positions[this.positions.length - 1].timestamp - this.positions[0].timestamp) / 1000 // segundos
    const totalDistance = this.calculateTotalDistance()
    
    return totalDistance / totalTime // m/s
  }

  private haversineDistance(pos1: GPSPosition, pos2: GPSPosition): number {
    const R = 6371e3 // Raio da Terra em metros
    const φ1 = (pos1.latitude * Math.PI) / 180
    const φ2 = (pos2.latitude * Math.PI) / 180
    const Δφ = ((pos2.latitude - pos1.latitude) * Math.PI) / 180
    const Δλ = ((pos2.longitude - pos1.longitude) * Math.PI) / 180

    const a =
      Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
      Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2)
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))

    return R * c
  }

  reset() {
    this.positions = []
  }
}

export function formatPace(metersPerSecond: number): string {
  if (metersPerSecond === 0) return '0:00'
  
  const minutesPerKm = 1000 / (metersPerSecond * 60)
  const minutes = Math.floor(minutesPerKm)
  const seconds = Math.round((minutesPerKm - minutes) * 60)
  
  return `${minutes}:${seconds.toString().padStart(2, '0')}`
}

export function formatDistance(meters: number): string {
  if (meters < 1000) {
    return `${meters.toFixed(0)}m`
  }
  return `${(meters / 1000).toFixed(2)}km`
}

export function formatDuration(seconds: number): string {
  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  const secs = Math.floor(seconds % 60)
  
  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }
  return `${minutes}:${secs.toString().padStart(2, '0')}`
}
