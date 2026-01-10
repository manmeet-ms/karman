
import { z } from "zod";
import { ViolationTypeEnum, UrgeTypeEnum, UrgeTriggerEnum, UrgeLocationEnum } from "@/generated/prisma/client";

// Points
export const ApplyPointsSchema = z.object({
  event: z.string().min(1)
});

// Timeblocks
export const CreateTimeblockSchema = z.object({
    task: z.string().min(1),
    description: z.string().optional(),
    startTime: z.string().regex(/^\d{2}:\d{2}$/, "Invalid time format format HH:mm"),
    endTime: z.string().regex(/^\d{2}:\d{2}$/, "Invalid time format format HH:mm"),
    date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format YYYY-MM-DD"),
    strict: z.boolean().optional().default(true),
    completed: z.boolean().optional().default(false)
});

export const UpdateTimeblockSchema = z.object({
    completed: z.boolean().optional(),
    task: z.string().optional(),
    description: z.string().optional()
});

// Hourly Checkin
export const CreateHourlyCheckinSchema = z.object({
    note: z.string().optional().default("def: No Activity Shared"),
    tag: z.string().optional().default("def: No activity"),
    context: z.string().optional(),
    mood: z.object({ 
        // Define mood structure if complex
        moodType: z.string(),
        intensity: z.number().int().optional(),
        notes: z.string().optional()
    }).optional()
});

export const UpdateHourlyCheckinSchema = z.object({
    note: z.string().optional(),
    tag: z.string().optional(),
    context: z.string().optional()
});

// Ritual
export const CreateRitualSchema = z.object({
    vow: z.string().min(1)
});

// Violation
export const LogViolationSchema = z.object({
    type: z.nativeEnum(ViolationTypeEnum),
    timeBlockId: z.string().optional()
});

// Timer
export const CreateTimerSchema = z.object({
    codename: z.string().min(1),
    title: z.string().min(1),
    description: z.string().optional(),
    failures: z.number().int().default(0),
    timerStarted: z.string().optional().default(() => new Date().toISOString()),
    perks: z.any().optional(),
    punishments: z.any().optional(),
    alternates: z.any().optional(),
    quoteFlashingAllowed: z.boolean().optional(),
    pulseTheme: z.string().optional()
});

export const UpdateTimerSchema = z.object({
    action: z.enum(['reset']).optional()
});

// Urge
export const LogUrgeSchema = z.object({
    urgeIntensity: z.number().min(1).max(10).default(6),
    urgeType: z.nativeEnum(UrgeTypeEnum).default(UrgeTypeEnum.OTHER),
    urgeTrigger: z.nativeEnum(UrgeTriggerEnum).optional(),
    urgeLocation: z.nativeEnum(UrgeLocationEnum).optional(),
    urgeNotes: z.string().optional()
});

// Philosophy
export const CreatePhilosophyQuoteSchema = z.object({
    philosopher: z.any(),
    quotes: z.array(z.string())
});

// Push
export const SaveSubscriptionSchema = z.object({
    endpoint: z.string().url(),
    keys: z.object({
        p256dh: z.string(),
        auth: z.string()
    })
});

export const TriggerNotificationSchema = z.object({
    title: z.string(),
    body: z.string(),
    icon: z.string().optional(),
    badge: z.string().optional()
});
