import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import type { Program, Workout } from '@/types'

export function usePrograms() {
  return useQuery({
    queryKey: ['programs'],
    queryFn: async (): Promise<Program[]> => {
      const { data, error } = await supabase
        .from('programs')
        .select('*')
        .eq('is_published', true)
        .order('created_at', { ascending: false })
      if (error) throw error
      return data
    },
  })
}

export function useProgram(id: string) {
  return useQuery({
    queryKey: ['programs', id],
    queryFn: async (): Promise<Program & { workouts: Workout[] }> => {
      const { data: program, error } = await supabase
        .from('programs')
        .select('*')
        .eq('id', id)
        .single()
      if (error) throw error

      const { data: workouts } = await supabase
        .from('workouts')
        .select('*')
        .eq('program_id', id)
        .eq('is_published', true)
        .order('order_index')

      return { ...program, workouts: workouts || [] }
    },
    enabled: !!id,
  })
}

export function useWorkout(id: string) {
  return useQuery({
    queryKey: ['workouts', id],
    queryFn: async () => {
      const { data: workout, error } = await supabase
        .from('workouts')
        .select('*')
        .eq('id', id)
        .single()
      if (error) throw error

      const { data: exercises } = await supabase
        .from('workout_exercises')
        .select('*, exercise:exercises(*)')
        .eq('workout_id', id)
        .order('order_index')

      return { ...workout, exercises: exercises || [] }
    },
    enabled: !!id,
  })
}

export function useExercises(filters?: { muscleGroup?: string; equipment?: string; search?: string }) {
  return useQuery({
    queryKey: ['exercises', filters],
    queryFn: async () => {
      let query = supabase.from('exercises').select('*').order('name')

      if (filters?.muscleGroup) {
        query = query.contains('muscle_groups', [filters.muscleGroup])
      }
      if (filters?.equipment) {
        query = query.contains('equipment', [filters.equipment])
      }
      if (filters?.search) {
        query = query.ilike('name', `%${filters.search}%`)
      }

      const { data, error } = await query
      if (error) throw error
      return data
    },
  })
}

export function useExercise(id: string) {
  return useQuery({
    queryKey: ['exercises', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('exercises')
        .select('*')
        .eq('id', id)
        .single()
      if (error) throw error
      return data
    },
    enabled: !!id,
  })
}

export function useMarkWorkoutComplete() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ workoutId, notes, durationMinutes }: {
      workoutId: string
      notes?: string
      durationMinutes?: number
    }) => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Not authenticated')

      const { data, error } = await supabase
        .from('workout_logs')
        .insert({
          user_id: user.id,
          workout_id: workoutId,
          notes,
          duration_minutes: durationMinutes,
        })
        .select()
        .single()
      if (error) throw error
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['workout_logs'] })
      queryClient.invalidateQueries({ queryKey: ['dashboard'] })
    },
  })
}
