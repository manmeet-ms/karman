import { IconBrandTabler, IconFileSpark, IconGraph, IconHourglassEmpty, IconLayoutDashboard } from "@tabler/icons-react";
import { CctvIcon, ChartLineIcon, GitCommitHorizontalIcon, MessageSquareIcon } from "lucide-react";

export const APP_VERSION = "6.0.0";
export const APP_NAME = "Karman";

export const APP_SHORT_DESCRIPTION = "External motivation is a crutch";
export let USERNAME = "@username";
// no slash!!!
export const BASE_API_URL_SHARED = "http://localhost:3000/api";
// export const BASE_API_URL_SHARED ="https://karmanbe.onrender.com/api";
// export const BASE_API_URL_SHARED=  process.env.VITE_BACKEND_URL;


export const SIDENAV_DASH = [
  {
    title: "Dashboard",
    url: "/",
    icon: IconLayoutDashboard,
    // icon: LayoutDashboardIcon,
  },
  {
    title: "Agreement",
    url: "/agreement",
    icon: IconFileSpark,
    // icon: PaperclipIcon,
  },
  {
    title: "Chronos",
    url: "/chronos",
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
    title: "Analytics",
    url: "/analytics",
    icon: IconGraph,
  },
  {
    title: "Leaderboard",
    url: "/leaderboard",
    icon: ChartLineIcon,
  },
  {
    title: "Urges",
    url: "/urges",
    icon: CctvIcon,
  },
  {
    title: "Messages",
    url: "/discord",
    icon: MessageSquareIcon,
  },
  {
    title: "Timeline",
    url: "/timeline",
    icon: GitCommitHorizontalIcon,
  },
  {
    title: "Beta",
    url: "/beta",
    icon: IconBrandTabler,
    // icon: IconTestPipe,
  },
  // {
  //   title: "Book Notes",
  //   url: "/book-notes",
  // icon: IconBook,
  // },
];
