

export default function Features() {
  return (
    <section className="py-16 md:py-24 lg:py-32">
        <div className="container max-w-3xl">
            <h1 className="mb-8 text-4xl font-bold tracking-tight md:text-5xl">Design & Features</h1>
            <div className="prose prose-lg dark:prose-invert text-muted-foreground">
                <p className="mb-6">The design principle is simple: remove negotiation. Every feature exists to close a loophole. Every screen answers one question only: did you obey or not.</p>
                
                <h2 className="text-2xl font-semibold mb-4 text-foreground">Immutable Time Blocks</h2>
                <p className="mb-6">Time is segmented into immutable blocks. Once locked, they are law. Editing them mid-day is treated as failure, not flexibility. Activities are logged at the moment they occur, not retroactively, to prevent narrative rewriting. Hourly check-ins exist to collapse memory gaps. If you don’t record, the system assumes absence, not compliance.</p>
                
                <h2 className="text-2xl font-semibold mb-4 text-foreground">Violation Logging</h2>
                <p className="mb-6">Violations are first-class data. They are not errors; they are outcomes. Each violation triggers deterministic consequences—points loss, alarms, lockouts, public logs. Rewards exist, but they are smaller and rarer than penalties, because behavior is shaped faster by loss than gain.</p>
                
                <h2 className="text-2xl font-semibold mb-4 text-foreground">Restrained Interface</h2>
                <p className="mb-6">The interface is intentionally restrained. No decorative comfort. No celebratory dopamine loops. Colors signal state only: neutral, warning, failure, compliance. Typography prioritizes clarity and density over personality. The app should feel like a control panel, not a companion.</p>
                
                <h2 className="text-2xl font-semibold mb-4 text-foreground">Vertical Accountability</h2>
                <p className="mb-6">All data is user-centric and isolated. Every action ties directly to the user identity. No shared states. No ambient social validation. Accountability is vertical, not horizontal—between you and the system, not you and a crowd.</p>
                
                <h2 className="text-2xl font-semibold mb-4 text-foreground">Planning Philosophy</h2>
                <p className="mb-6">Planning favors extensibility of enforcement, not features. New modules must answer one question: does this reduce ambiguity or increase pressure? If it adds choice, it is rejected. If it adds friction to failure, it is accepted.</p>
                
                <p className="font-bold text-foreground">This is not a habit app. It is a governance system. It is built to function when willpower collapses. If it feels harsh, it is working.</p>
            </div>
        </div>
    </section>
  )
}
