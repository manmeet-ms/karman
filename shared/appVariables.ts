import { IconBrandTabler, IconFileSpark, IconGraph, IconHourglassEmpty, IconLayoutDashboard, IconChartLine, IconGitCommit, IconMessage, IconEye, IconBell, IconBulb } from '@tabler/icons-react';

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
        title: 'Advice',
        url: '/advice',
        icon: IconBulb,
    },

    {
        title: 'Beta',
        url: '/beta',
        icon: IconBrandTabler,
    },
];
