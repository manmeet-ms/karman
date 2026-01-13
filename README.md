# Karman (Postgres Edition)

## About
Karman is a comprehensive discipline and habit-tracking application designed to enforce accountability through a rigid system of Timeblocks, Rituals, and Urge tracking. Unlike passive habit trackers, Karman actively monitors adherence to schedules and penalizes deviations, aiming to gamify self-discipline with high stakes and detailed analytics.

## Philosophy
*Inherited from the original MERN stack implementation.*

The core philosophy of Karman is built on **active enforcement**:
1.  **MVP defined by Logic, not UI**: The Minimum Viable Product was defined by the ability to track urges, detect violations, and punish behavior—not just by having a pretty dashboard.
2.  **The "Silent Failure" Lesson**: A critical lesson from the previous iteration was that "silent failures" (like a Service Worker not registering on mobile) break the entire feedback loop. Reliability on the device you carry everywhere (mobile) is paramount.
3.  **Behavior-Driven**: The system is designed to mirror human behavioral patterns—tracking triggers for urges, enforcing daily rituals, and calculating a "Discipline Score" based on consistency.
4.  **Consequences**: The system believes in "Shame/Motivation." Missed blocks or rituals aren't just ignored; they are logged as Violations and can trigger negative reinforcement (e.g., public shaming logs or Discord webhooks).

## New Postgres & Stack Features
Moving to a Postgres + Next.js stack introduces several architectural improvements:

### 1. Robust Data Modeling (Prisma)
- **Relational Integrity**: Unlike the document-based previous stack, this version uses a strictly relational schema. Users are the central entity, and all activities (Timeblocks, Urges, Rituals) are relationally linked with cascading deletes.
- **Native Enums**: We leverage Postgres enums for strict typing on:
    - `UrgeTypeEnum` (Procrastination, Doomscroll, etc.)
    - `ViolationTypeEnum` (Missed Block, Failed Timer, etc.)
    - `TxnType` (Points transactions for Gamification)

### 2. Next.js App Directory
- **Server-Side Rendering**: Improved performance and SEO for the dashboard and marketing pages.
- **API Routes**: Backend logic is now co-located with the frontend in `app/api/`, simplifying the architecture from a separate Express backend.
- **Layouts**: Utilizing `layout.tsx` for consistent specific headers (e.g., dynamic actions in the dashboard header).

### 3. Enhanced Feature Set
- **Cron Integration**: Dedicated API endpoints for cron jobs to check violations (`api/cron/violations`) automatically.
- **Advice System**: A community-driven advice sharing system with tagging (`AdviceTag`) and user ownership.
- **Long-term Modules**: New structure for tracking long-term goals and agreements.

## Project Structure

```text
karman/
├── app/
│   ├── (application)/       # Main App Logic
│   │   └── (dashboard)/     # Authenticated user views
│   │       ├── advice/      # Community Advice
│   │       ├── analytics/   # Stats & Charts
│   │       ├── chronos/     # Timers & Focus
│   │       ├── diary/       # Daily Reflection
│   │       ├── timeline/    # Hourly Check-ins
│   │       └── urges/       # Urge Tracking
│   ├── (marketing)/         # Public facing pages
│   └── api/                 # Backend Enpoints
│       ├── auth/            # NextAuth / OAuth
│       ├── cron/            # Scheduled tasks
│       └── ...              # Feature-specific APIs
├── components/
│   ├── ui/                  # Shadcn UI Components
│   └── Forms/               # Logic-heavy form components
├── contexts/                # React Contexts (PageMeta, etc.)
├── prisma/
│   └── schema.prisma        # Database Definition
└── public/                  # Static assets & Service Worker
```
