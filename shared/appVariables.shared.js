import { IconBrandTabler, IconFileSpark, IconGraph, IconHourglassEmpty, IconLayoutDashboard, IconChartLine, IconGitCommit, IconMessage, IconEye, IconBell, IconBulb } from '@tabler/icons-react';

export const APP_VERSION = '6.0.0';
export const APP_NAME = 'Karman';

export const APP_SHORT_DESCRIPTION = 'External motivation is a crutch';
export let USERNAME = '@username';
// no slash!!!
export const BASE_API_URL_SHARED = 'http://localhost:3000/api';
// export const BASE_API_URL_SHARED ="https://karmanbe.onrender.com/api";
// export const BASE_API_URL_SHARED=  process.env.VITE_BACKEND_URL;

export const SIDENAV_DASH = [
    {
        title: 'Dashboard',
        url: '/',
        icon: IconLayoutDashboard,
        // icon: LayoutDashboardIcon,
    },
    {
        title: 'Agreement',
        url: '/agreement',
        icon: IconFileSpark,
        // icon: PaperclipIcon,
    },
    {
        title: 'Chronos',
        url: '/chronos',
        icon: IconHourglassEmpty,
    },
    // {
    //   title: "Positives",
    //   url: "/positives",
    //     icon: ArrowUpRightIcon,
    // },
    // {
    //   title: "Negatives",
    //   url: "/negatives",
    //     icon: ArrowDownRightIcon,
    // },
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
        // icon: IconTestPipe,
    },
    {
      title: "Global advice",
      url: "/advice",
    icon: IconBulb,
    },


    {
        title: 'Beta',
        url: '/beta',
        icon: IconBrandTabler,
        // icon: IconTestPipe,
    },
];
