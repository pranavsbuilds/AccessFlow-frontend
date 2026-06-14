import SetupForm from './SetupForm';

export default function SetupPage() {
  return (
    <>
      {/* Ambient glow — exactly as in S1.1 */}
      <div className="ambient-glow" aria-hidden="true" />

      {/* Fixed glassmorphic navbar */}
      <nav className="fixed top-0 w-full z-50 px-6 py-6">
        <div className="max-w-7xl mx-auto flex justify-between items-center px-8 py-4 spatial-glass nav-pill bg-background/40">
          <div className="font-headline font-extrabold text-2xl tracking-tighter text-primary">
            SMART INTERVIEWER
            <span className="ml-2 px-2 py-0.5 border border-primary/30 rounded text-[10px] font-mono tracking-widest opacity-60 align-middle">
              v1.0
            </span>
          </div>
          <div className="flex items-center gap-6">
            <button className="w-12 h-12 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition-all text-on-surface hover:text-primary" aria-label="Settings">
              <span className="material-symbols-outlined text-2xl">settings</span>
            </button>
            <button className="w-12 h-12 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition-all text-on-surface hover:text-primary" aria-label="Account">
              <span className="material-symbols-outlined text-2xl">account_circle</span>
            </button>
          </div>
        </div>
      </nav>

      <main className="pt-40 pb-24 px-4 md:px-8 max-w-6xl mx-auto relative z-10">
        {/* Header */}
        <header className="text-center mb-24">
          <div className="inline-flex items-center gap-3 px-5 py-2 rounded-full bg-primary/15 border border-primary/30 mb-8">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse shadow-[0_0_8px_rgba(126,252,157,0.8)]" />
            <span className="font-mono text-xs tracking-widest text-primary font-bold">
              SYSTEM ACTIVE // CORE v4.2.P
            </span>
          </div>

          <h1 className="font-headline text-5xl md:text-7xl font-extrabold text-on-surface mb-8 tracking-tight">
            Set up your interview
          </h1>

          <div className="max-w-3xl mx-auto spatial-glass p-10 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-1.5 h-full bg-primary" />
            <p className="text-2xl font-medium text-on-surface-variant italic leading-relaxed">
              &ldquo;10 adaptive questions. Scored on{' '}
              <span className="text-primary font-extrabold">accuracy</span>, not filler.&rdquo;
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-8">
              <div className="flex items-center gap-3 text-sm font-mono uppercase tracking-widest text-primary">
                <span className="material-symbols-outlined text-xl">quiz</span> 10 Questions
              </div>
              <div className="flex items-center gap-3 text-sm font-mono uppercase tracking-widest text-primary">
                <span className="material-symbols-outlined text-xl">trending_up</span> Adaptive
              </div>
              <div className="flex items-center gap-3 text-sm font-mono uppercase tracking-widest text-primary">
                <span className="material-symbols-outlined text-xl">smart_toy</span> AI Scored
              </div>
            </div>
          </div>
        </header>

        {/* Interactive form — field + difficulty + start */}
        <SetupForm />
      </main>

      <footer className="mt-24 border-t border-white/10 py-16">
        <div className="max-w-7xl mx-auto px-8 flex justify-between items-center opacity-60">
          <div className="font-mono text-xs tracking-widest uppercase font-bold text-on-surface">
            © 2024 SMART_INTERVIEWER.SYS
          </div>
          <div className="flex gap-4">
            <div className="w-2 h-2 rounded-full bg-primary" />
            <div className="w-2 h-2 rounded-full bg-primary/60" />
            <div className="w-2 h-2 rounded-full bg-primary/30" />
          </div>
        </div>
      </footer>
    </>
  );
}
