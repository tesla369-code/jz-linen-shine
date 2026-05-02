export function PageHero({ eyebrow, title, sub }: { eyebrow?: string; title: string; sub?: string }) {
  return (
    <section className="bg-hero text-primary-foreground">
      <div className="container-page py-16 lg:py-24">
        {eyebrow && <span className="text-xs font-bold uppercase tracking-[0.25em] text-white/70">{eyebrow}</span>}
        <h1 className="mt-3 max-w-3xl font-display text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl">{title}</h1>
        {sub && <p className="mt-5 max-w-2xl text-lg text-white/80">{sub}</p>}
      </div>
    </section>
  );
}
