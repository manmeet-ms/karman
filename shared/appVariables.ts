

import { IconBell, IconBulb, IconChartLine, IconEye, IconFileSpark, IconBarbell, IconBook, IconBrain, IconCrown, IconFlame, IconHammer, IconPlant, IconRocket, IconShieldCheck, IconTargetArrow, IconGitCommit, IconGraph, IconHourglassEmpty, IconLayoutDashboard, IconMessage } from '@tabler/icons-react';

export const APP_VERSION = '6.0.0';
export const APP_NAME = 'Karman';

export const APP_SHORT_DESCRIPTION = 'External motivation is a crutch';

// no slash!!!
export const BASE_API_URL_SHARED = 'http://localhost:3000/api';

export const SIDENAV_DASH = [
    {
        title: 'Dashboard',
        url: '/',
        icon: IconLayoutDashboard,
    },
    {
        title: 'Agreement',
        url: '/agreement',
        icon: IconFileSpark,
    },
    {
        title: 'Chronos',
        url: '/chronos',
        icon: IconHourglassEmpty,
    },
    {
        title: 'Analytics',
        url: '/analytics',
        icon: IconGraph,
    },
    {
        title: 'Leaderboard',
        url: '/leaderboard',
        icon: IconChartLine,
    },
    {
        title: 'Urges',
        url: '/urges',
        icon: IconEye,
    },
    {
        title: 'Diary',
        url: '/diary',
        icon: IconMessage,
    },
    {
        title: 'Timeline',
        url: '/timeline',
        icon: IconGitCommit,
    },
    {
        title: 'Reminders',
        url: '/reminders',
        icon: IconBell,
    },
    {
        title: 'Global',
        url: '/global',
        icon: IconBulb,
    },

    // {
    //     title: 'Beta',
    //     url: '/beta',
    //     icon: IconBrandTabler,
    // },
];

export const USER_POINTS_RANK_TABLE = [
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
