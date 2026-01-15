
import { z } from "zod";

export const CreateTimerSchema = z.object({
  codename: z.string().min(1, "Codename is required"),
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  perks: z.any().optional(), // Using any for Json/complex types for now
  punishments: z.any().optional(),
  alternates: z.any().optional(),
  quoteFlashingAllowed: z.boolean().optional(),
  pulseTheme: z.string().optional(),
});

export const UpdateTimerSchema = z.object({
  action: z.enum(['reset', 'stop']),
  duration: z.number().optional(),
});

export type CreateTimerInput = z.infer<typeof CreateTimerSchema>;
export type UpdateTimerInput = z.infer<typeof UpdateTimerSchema>;

export const UpdateHourlyCheckinSchema = z.object({
  note: z.string().optional(),
  tag: z.string().optional(),
  mood: z.object({
      moodType: z.string(),
      intensity: z.number(),
      notes: z.string().optional(),
      tags: z.array(z.string()).optional(),
      trigger: z.string().optional(),
      location: z.string().optional(),
      physicalState: z.string().optional()
  }).optional()
});

export const CreatePhilosophyQuoteSchema = z.object({
  philosopher: z.any(),
  quote: z.any(),
});

export const ApplyPointsSchema = z.object({
  event: z.string(),
});

export const CreateRitualSchema = z.object({
  vow: z.string().min(1, "Vow is required"),
});

export const UpdateTimeblockSchema = z.object({
  completed: z.boolean().optional(),
  task: z.string().optional(),
  description: z.string().optional(),
  startTime: z.string().optional(),
  endTime: z.string().optional(),
});

export const CreateHourlyCheckinSchema = z.object({
  note: z.string().min(1, "Note is required"),
  tag: z.string().optional(),
  entryDate: z.string().optional(),
  context: z.string().optional(),
  mood: z.object({
      moodType: z.string(),
      intensity: z.number(),
      notes: z.string().optional(),
      tags: z.array(z.string()).optional(),
      trigger: z.string().optional(),
      location: z.string().optional(),
      physicalState: z.string().optional()
  }).optional()
});

