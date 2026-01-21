// Tipos necessários para os planos de treino
export type WorkoutType = 'easy_run' | 'interval' | 'tempo' | 'long_run' | 'fartlek' | 'hill_repeats' | 'recovery_run'

export type WorkoutBlock = {
  type: 'warmup' | 'main' | 'cooldown' | 'run' | 'walk' | 'rest'
  duration: number // em minutos
  intensity?: string
  description?: string
  distance?: number // em km
  pace?: string // min/km
}

export type Workout = {
  id: string
  name: string
  type: WorkoutType
  description: string
  totalDuration: number // em minutos
  blocks: WorkoutBlock[]
  benefits: string[]
  difficulty: 'beginner' | 'intermediate' | 'advanced'
}

export type TrainingPlan = {
  id: string
  name: string
  trainer: string
  description: string
  level: 'beginner' | 'intermediate' | 'advanced'
  goal: string
  durationWeeks: number
  daysPerWeek: number
  weeks: {
    weekNumber: number
    focus: string
    workouts: Workout[]
  }[]
}

// Biblioteca de treinos base
const WORKOUTS_LIBRARY: Workout[] = [
  {
    id: 'easy-run-1',
    name: 'Corrida Leve',
    type: 'easy_run',
    description: 'Corrida confortável para desenvolvimento da base aeróbica',
    totalDuration: 30,
    blocks: [
      { type: 'warmup', duration: 5, description: 'Caminhada leve' },
      { type: 'run', duration: 20, intensity: 'easy', description: 'Corrida leve e conversível' },
      { type: 'cooldown', duration: 5, description: 'Caminhada de resfriamento' }
    ],
    benefits: ['Desenvolvimento aeróbico', 'Adaptação ao movimento'],
    difficulty: 'beginner'
  },
  {
    id: 'interval-1',
    name: 'Intervalado Básico',
    type: 'interval',
    description: 'Treino com alternância de intensidade para melhorar velocidade',
    totalDuration: 35,
    blocks: [
      { type: 'warmup', duration: 5, description: 'Aquecimento' },
      { type: 'run', duration: 2, intensity: 'moderate', description: 'Corrida moderada' },
      { type: 'rest', duration: 1, description: 'Caminhada de recuperação' },
      { type: 'run', duration: 2, intensity: 'moderate' },
      { type: 'rest', duration: 1 },
      { type: 'run', duration: 2, intensity: 'moderate' },
      { type: 'rest', duration: 1 },
      { type: 'cooldown', duration: 5, description: 'Resfriamento' }
    ],
    benefits: ['Melhoria da velocidade', 'Capacidade anaeróbica'],
    difficulty: 'intermediate'
  },
  {
    id: 'tempo-1',
    name: 'Treino de Ritmo',
    type: 'tempo',
    description: 'Corrida mantida em ritmo constante',
    totalDuration: 40,
    blocks: [
      { type: 'warmup', duration: 5 },
      { type: 'run', duration: 30, intensity: 'tempo', description: 'Ritmo constante e desafiador' },
      { type: 'cooldown', duration: 5 }
    ],
    benefits: ['Resistência', 'Controle de ritmo'],
    difficulty: 'intermediate'
  },
  {
    id: 'long-run-1',
    name: 'Corrida Longa',
    type: 'long_run',
    description: 'Corrida de longa duração para desenvolvimento de resistência',
    totalDuration: 60,
    blocks: [
      { type: 'warmup', duration: 5 },
      { type: 'run', duration: 50, intensity: 'easy', description: 'Corrida longa e confortável' },
      { type: 'cooldown', duration: 5 }
    ],
    benefits: ['Resistência muscular', 'Capacidade aeróbica'],
    difficulty: 'advanced'
  },
  {
    id: 'fartlek-1',
    name: 'Fartlek',
    type: 'fartlek',
    description: 'Treino de velocidade variável',
    totalDuration: 35,
    blocks: [
      { type: 'warmup', duration: 5 },
      { type: 'run', duration: 3, intensity: 'easy' },
      { type: 'run', duration: 1, intensity: 'fast', description: 'Aceleração' },
      { type: 'run', duration: 3, intensity: 'easy' },
      { type: 'run', duration: 1, intensity: 'fast' },
      { type: 'run', duration: 3, intensity: 'easy' },
      { type: 'run', duration: 1, intensity: 'fast' },
      { type: 'cooldown', duration: 5 }
    ],
    benefits: ['Velocidade', 'Variabilidade'],
    difficulty: 'intermediate'
  },
  {
    id: 'hill-repeats-1',
    name: 'Subidas',
    type: 'hill_repeats',
    description: 'Repetições de subida para força muscular',
    totalDuration: 40,
    blocks: [
      { type: 'warmup', duration: 5 },
      { type: 'run', duration: 2, intensity: 'moderate', description: 'Subida forte' },
      { type: 'walk', duration: 2, description: 'Descida caminhando' },
      { type: 'run', duration: 2, intensity: 'moderate' },
      { type: 'walk', duration: 2 },
      { type: 'run', duration: 2, intensity: 'moderate' },
      { type: 'walk', duration: 2 },
      { type: 'cooldown', duration: 5 }
    ],
    benefits: ['Força muscular', 'Técnica de corrida'],
    difficulty: 'advanced'
  }
]

// Função para gerar plano personalizado baseado no anamnese
export function generateCustomPlan(anamneseData: any): TrainingPlan {
  const {
    objetivoPrincipal,
    dataProva,
    distanciaAlvo,
    nivelAtividade,
    diasDisponiveis,
    jaCorreuAntes,
    maiorDistancia,
    lesaoRecente,
    dorAtual
  } = anamneseData

  // Mapear nível
  const level = nivelAtividade === 'sedentario' ? 'beginner' :
                nivelAtividade === 'leve' ? 'beginner' :
                nivelAtividade === 'moderado' ? 'intermediate' : 'advanced'

  const daysPerWeek = diasDisponiveis.length
  const hasInjury = lesaoRecente === 'sim' || dorAtual === 'sim'

  // CASO 1: Objetivo "Praticar para uma prova"
  if (objetivoPrincipal === 'prova') {
    const provaDate = new Date(dataProva)
    const today = new Date()
    const weeksUntilRace = Math.ceil((provaDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24 * 7))

    // Validar período (4-16 semanas)
    if (weeksUntilRace < 4 || weeksUntilRace > 16) {
      throw new Error('Período até a prova deve ser entre 4 e 16 semanas')
    }

    return generateRacePlan(weeksUntilRace, level, daysPerWeek, hasInjury)
  }

  // CASO 2: Outros objetivos - plano de 12 semanas
  return generateGeneralPlan(objetivoPrincipal, level, daysPerWeek, hasInjury, distanciaAlvo)
}

// Gera plano para prova
function generateRacePlan(weeksUntilRace: number, level: string, daysPerWeek: number, hasInjury: boolean): TrainingPlan {
  const weeks = []

  for (let weekNum = 1; weekNum <= weeksUntilRace; weekNum++) {
    const progress = weekNum / weeksUntilRace
    let focus = 'Base aeróbica'

    if (progress < 0.3) focus = 'Base e adaptação'
    else if (progress < 0.6) focus = 'Construção de volume'
    else if (progress < 0.8) focus = 'Qualidade e velocidade'
    else focus = 'Tapering e pico'

    const workouts = generateWeeklyWorkouts(level, daysPerWeek, focus, hasInjury, weekNum, weeksUntilRace)
    weeks.push({ weekNumber: weekNum, focus, workouts })
  }

  return {
    id: `race-${Date.now()}`,
    name: 'Plano Personalizado para Prova',
    trainer: 'Run Easy - Plano Personalizado',
    description: 'Plano periodizado focado na sua prova',
    level: level as any,
    goal: '5km', // será ajustado
    durationWeeks: weeksUntilRace,
    daysPerWeek,
    weeks
  }
}

// Gera plano geral (12 semanas)
function generateGeneralPlan(objetivo: string, level: string, daysPerWeek: number, hasInjury: boolean, distanciaAlvo?: string): TrainingPlan {
  const weeks = []

  for (let weekNum = 1; weekNum <= 12; weekNum++) {
    let focus = 'Criação de hábito'

    if (weekNum <= 4) focus = 'Adaptação e base'
    else if (weekNum <= 8) focus = 'Evolução gradual'
    else focus = 'Consolidação e manutenção'

    const workouts = generateWeeklyWorkouts(level, daysPerWeek, focus, hasInjury, weekNum, 12)
    weeks.push({ weekNumber: weekNum, focus, workouts })
  }

  return {
    id: `general-${Date.now()}`,
    name: 'Plano de Desenvolvimento Geral',
    trainer: 'Run Easy - Plano Personalizado',
    description: 'Plano focado no seu objetivo principal',
    level: level as any,
    goal: '5km', // será ajustado
    durationWeeks: 12,
    daysPerWeek,
    weeks
  }
}

// Gera treinos semanais
function generateWeeklyWorkouts(level: string, daysPerWeek: number, focus: string, hasInjury: boolean, weekNum: number, totalWeeks: number): Workout[] {
  const workouts: Workout[] = []
  const progress = weekNum / totalWeeks

  // Lógica de distribuição semanal
  const availableDays = ['segunda', 'terca', 'quarta', 'quinta', 'sexta', 'sabado', 'domingo']
  const trainingDays = availableDays.slice(0, daysPerWeek)

  for (let i = 0; i < daysPerWeek; i++) {
    let workoutType: WorkoutType = 'easy_run'
    let intensity = 'easy'

    // Lógica baseada no nível e progresso
    if (level === 'beginner') {
      if (i === 0) workoutType = 'easy_run'
      else if (i === 1 && progress > 0.3) workoutType = 'fartlek'
      else workoutType = 'easy_run'
    } else if (level === 'intermediate') {
      if (i === 0) workoutType = 'easy_run'
      else if (i === 1) workoutType = 'interval'
      else if (i === 2 && progress > 0.5) workoutType = 'tempo'
      else workoutType = 'easy_run'
    } else {
      // advanced
      if (i === 0) workoutType = 'easy_run'
      else if (i === 1) workoutType = 'interval'
      else if (i === 2) workoutType = 'tempo'
      else if (i === 3) workoutType = 'long_run'
      else if (i === 4) workoutType = 'hill_repeats'
      else workoutType = 'easy_run'
    }

    // Ajustar duração baseada no progresso
    let duration = 30
    if (level === 'beginner') {
      duration = 20 + Math.floor(progress * 25) // 20-45min
    } else if (level === 'intermediate') {
      duration = 30 + Math.floor(progress * 30) // 30-60min
    } else {
      duration = 45 + Math.floor(progress * 45) // 45-90min
    }

    // Criar workout personalizado
    const workout = createCustomWorkout(workoutType, duration, intensity, weekNum, i + 1)
    workouts.push(workout)
  }

  return workouts
}

// Cria workout personalizado
function createCustomWorkout(type: WorkoutType, duration: number, intensity: string, weekNum: number, dayNum: number): Workout {
  const baseWorkouts = WORKOUTS_LIBRARY.filter(w => w.type === type)
  const baseWorkout = baseWorkouts[0] || WORKOUTS_LIBRARY[0]

  // Ajustar blocos baseado na duração
  const adjustedBlocks = adjustWorkoutBlocks(baseWorkout.blocks, duration)

  return {
    id: `${type}-${weekNum}-${dayNum}-${Date.now()}`,
    name: `${baseWorkout.name} - Semana ${weekNum}`,
    type,
    description: baseWorkout.description,
    totalDuration: duration,
    blocks: adjustedBlocks,
    benefits: baseWorkout.benefits,
    difficulty: baseWorkout.difficulty
  }
}

// Ajusta blocos do treino para a duração desejada
function adjustWorkoutBlocks(blocks: WorkoutBlock[], targetDuration: number): WorkoutBlock[] {
  const totalOriginal = blocks.reduce((sum, block) => sum + block.duration, 0)
  const ratio = targetDuration / totalOriginal

  return blocks.map(block => ({
    ...block,
    duration: Math.round(block.duration * ratio)
  }))
}