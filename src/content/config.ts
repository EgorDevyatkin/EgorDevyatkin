import { defineCollection, z } from 'astro:content';

const workouts = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    sport: z.enum(['running', 'cycling', 'gym', 'hiking', 'swimming', 'other']),
    durationLabel: z.string(),
    durationMinutes: z.number(),
    distanceKm: z.number().optional(),
    avgHr: z.number().optional(),
    avgPace: z.string().optional(),
    avgSpeed: z.string().optional(),
    calories: z.number().optional(),
    location: z.string().optional(),
    source: z.enum(['coros', 'manual']),
  }),
});

export const collections = { workouts };
