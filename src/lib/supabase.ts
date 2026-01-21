import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database Types
export type Profile = {
  id: string
  name: string
  age?: number
  goal: string
  level: string
  days_per_week: number
  created_at: string
}

export type Workout = {
  id: string
  user_id: string
  workout_type: string
  distance: number
  duration: number
  pace: string
  calories: number
  route?: any // GeoJSON
  completed_at: string
}

export type Achievement = {
  id: string
  user_id: string
  achievement_type: string
  unlocked_at: string
}

export type TrainingPlan = {
  id: string
  name: string
  description: string
  level: string
  duration_weeks: number
  trainer: string
  workouts: any[]
}
