
import { 
    IconBarbell, 
    IconBook, 
    IconBrain, 
    IconCrown, 
    IconFlame, 
    IconHammer, 
    IconPlant, 
    IconRocket, 
    IconShieldCheck, 
    IconTargetArrow 
} from "@tabler/icons-react";

export const EVENT_POINTS = {
  TIMEBLOCK_COMPLETE_CREDIT: 20, // ✅
  ALL_DAILY_COMPLETE_CREDIT: 100,
  VIOLATION_RESOLVED_CREDIT: 5, // ✅
  DIARY_WRITING_CREDIT: 5,
  RITUAL_CREATED_CREDIT: 5,
  RITUAL_COMPLETE_CREDIT: 10,
  URGE_LOGGED_CREDIT: 10,
  URGE_RESISTED_CREDIT: 50,
  MOOD_LOGGED_CREDIT: 5,
  MOOD_IMPROVEMENT_CREDIT: 5,
  NEW_STREAK_CREDIT: 50,
  EXTEND_STREAK_CREDIT: 10,

  RITUAL_MISS_PENALTY: -10,
  URGE_FAILURE_PENALTY: -100,
  BLOCK_MISS_PENALTY: -40, // ✅
  STREAK_BREAK_PENALTY: -100,
  VIOLATION_PENALTY: -60, // ✅
  TIMER_RESET_PENALTY: -800, // ✅
  PUNISHMENT_TRIGGER_PENALTY: -30,
  DEFAULT: 0,
} as const;

export type EventPointKey = keyof typeof EVENT_POINTS;

export const RANK_TABLE = [
  {
    rankId: 0,
    name: "Novice",
    minPoints: 1,
    emoji: "🌱",
    icon: IconPlant,
    color: "bg-emerald-500/15 text-emerald-500 border border-emerald-500/30",
    
  },
  {
    rankId: 1,
    name: "Disciple",
    minPoints: 500,
    emoji: "📘",
    icon: IconBook,
    color: "bg-sky-500/15 text-sky-500 border border-sky-500/30",
    
  },
  {
    rankId: 2,
    name: "Apprentice",
    minPoints: 900,
    emoji: "🛠️",
    icon: IconHammer,
    color: "bg-blue-500/15 text-blue-500 border border-blue-500/30",
    
  },
  {
    rankId: 3,
    name: "Focused Worker",
    minPoints: 1300,
    emoji: "🎯",
    icon: IconTargetArrow,
    color: "bg-indigo-500/15 text-indigo-500 border border-indigo-500/30",
    
  },
  {
    rankId: 4,
    name: "Discipline Knight",
    minPoints: 2000,
    emoji: "🛡️",
    icon: IconShieldCheck,
    color: "bg-violet-500/15 text-violet-500 border border-violet-500/30",
    
  },
  {
    rankId: 5,
    name: "Self-Controller",
    minPoints: 3200,
    emoji: "🧠",
    icon: IconBrain,
    color: "bg-fuchsia-500/15 text-fuchsia-500 border border-fuchsia-500/30",
    
  },
  {
    rankId: 6,
    name: "Iron-Willed",
    minPoints: 5200,
    emoji: "🏋️",
    icon: IconBarbell,
    color: "bg-amber-500/15 text-amber-600 border border-amber-500/30",
    
  },
  {
    rankId: 7,
    name: "Relentless",
    minPoints: 8200,
    emoji: "🔥",
    icon: IconFlame,
    color: "bg-orange-500/15 text-orange-500 border border-orange-500/30",
    
  },
  {
    rankId: 8,
    name: "Discipline Master",
    minPoints: 13000,
    emoji: "👑",
    icon: IconCrown,
    color: "bg-rose-500/15 text-rose-500 border border-rose-500/30",
    
  },
  {
    rankId: 9,
    name: "Ascendant",
    minPoints: 20000,
    emoji: "🚀",
    icon: IconRocket,
    color: "bg-slate-900 text-slate-100 border border-slate-800 dark:bg-slate-100 dark:text-slate-900",
    
  },
];

export function getRankUtil(userAvailablePoints: number) {
  // Handle negatives → stick to first rank
  if (userAvailablePoints < RANK_TABLE[0].minPoints) {
    return {
      currentRank: RANK_TABLE[0],
      nextRank: RANK_TABLE[1],
    };
  }

  for (let i = 0; i < RANK_TABLE.length; i++) {
    const rank = RANK_TABLE[i];
    const nextRank = RANK_TABLE[i + 1];

    if (!nextRank || userAvailablePoints < nextRank.minPoints) {
      // Either we’re at the last rank, or points fall before the next threshold
      return {
        currentRank: rank,
        nextRank: nextRank ?? rank, // if last rank, next = same
      };
    }
  }

  // Fallback (shouldn’t be hit)
  return {
    currentRank: RANK_TABLE[0],
    nextRank: RANK_TABLE[1],
  };
}
