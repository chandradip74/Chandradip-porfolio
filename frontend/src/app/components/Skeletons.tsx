/** Reusable skeleton shimmer block */
export function SkeletonBlock({ className = "" }: { className?: string }) {
  return (
    <div
      className={`animate-pulse bg-gradient-to-r from-muted via-muted/60 to-muted bg-[length:200%_100%] rounded-xl ${className}`}
      style={{ animation: "shimmer 1.6s infinite linear" }}
    />
  );
}

/* ─── Hero / Profile Skeleton (Home page) ─── */
export function HeroSkeleton() {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden pt-20">
      <div className="relative max-w-7xl mx-auto px-6 lg:px-12 w-full pt-16 pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left text */}
          <div className="space-y-6 order-2 lg:order-1">
            <SkeletonBlock className="h-6 w-40 rounded-full" />
            <div className="space-y-3">
              <SkeletonBlock className="h-16 w-3/4" />
              <SkeletonBlock className="h-16 w-1/2" />
            </div>
            <SkeletonBlock className="h-6 w-32" />
            <SkeletonBlock className="h-24 w-full max-w-lg" />
            <div className="flex gap-4">
              <SkeletonBlock className="h-12 w-36 rounded-xl" />
              <SkeletonBlock className="h-12 w-28 rounded-xl" />
            </div>
          </div>
          {/* Right image */}
          <div className="order-1 lg:order-2 flex justify-center lg:justify-end">
            <SkeletonBlock className="w-72 h-[400px] sm:w-80 sm:h-[480px] lg:w-[400px] rounded-3xl" />
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─── Services Grid Skeleton ─── */
export function ServicesGridSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="p-8 rounded-3xl bg-card border border-border space-y-4">
          <SkeletonBlock className="h-48 w-full rounded-2xl" />
          <SkeletonBlock className="h-7 w-3/5" />
          <SkeletonBlock className="h-4 w-full" />
          <SkeletonBlock className="h-4 w-4/5" />
          <div className="flex gap-2 flex-wrap">
            <SkeletonBlock className="h-6 w-16 rounded-full" />
            <SkeletonBlock className="h-6 w-20 rounded-full" />
            <SkeletonBlock className="h-6 w-14 rounded-full" />
          </div>
        </div>
      ))}
    </div>
  );
}

/* ─── Process Steps Skeleton ─── */
export function ProcessSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="p-8 rounded-3xl bg-background border border-border space-y-4">
          <SkeletonBlock className="h-14 w-14 rounded-2xl" />
          <SkeletonBlock className="h-7 w-1/2" />
          <SkeletonBlock className="h-4 w-full" />
          <SkeletonBlock className="h-4 w-4/5" />
        </div>
      ))}
    </div>
  );
}

/* ─── Projects Grid Skeleton ─── */
export function ProjectsSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="rounded-3xl overflow-hidden bg-card border border-border">
          <SkeletonBlock className="h-64 sm:h-80 w-full rounded-none" />
          <div className="p-8 space-y-4">
            <SkeletonBlock className="h-7 w-2/3" />
            <SkeletonBlock className="h-4 w-full" />
            <SkeletonBlock className="h-4 w-3/4" />
            <div className="flex gap-2 flex-wrap pt-2">
              {Array.from({ length: 4 }).map((_, j) => (
                <SkeletonBlock key={j} className="h-7 w-7 rounded-full" />
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

/* ─── Achievement Cards Skeleton ─── */
export function AchievementsSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="rounded-3xl overflow-hidden bg-card border border-border">
          <SkeletonBlock className="h-40 w-full rounded-none" />
          <div className="p-8 space-y-4">
            <div className="flex items-start justify-between">
              <SkeletonBlock className="h-12 w-12 rounded-xl" />
              <SkeletonBlock className="h-6 w-20 rounded-full" />
            </div>
            <SkeletonBlock className="h-6 w-3/4" />
            <SkeletonBlock className="h-3 w-1/3" />
            <SkeletonBlock className="h-4 w-full" />
            <SkeletonBlock className="h-4 w-4/5" />
          </div>
        </div>
      ))}
    </div>
  );
}

/* ─── Technologies Grid Skeleton ─── */
export function TechnologiesSkeleton() {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
      {Array.from({ length: 8 }).map((_, i) => (
        <div key={i} className="flex flex-col items-center gap-4 p-8 rounded-2xl bg-card border border-border">
          <SkeletonBlock className="h-10 w-10 rounded-xl" />
          <SkeletonBlock className="h-4 w-20" />
        </div>
      ))}
    </div>
  );
}

/* ─── Journey Timeline Skeleton ─── */
export function JourneySkeleton() {
  return (
    <div className="space-y-12">
      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i} className="relative flex items-start gap-8">
          <div className="hidden sm:block flex-1" />
          <div className="ml-14 sm:ml-0 flex-1 p-6 rounded-2xl bg-card border border-border space-y-3">
            <div className="flex items-center justify-between">
              <SkeletonBlock className="h-6 w-16 rounded-full" />
              <SkeletonBlock className="h-4 w-20" />
            </div>
            <SkeletonBlock className="h-6 w-2/3" />
            <SkeletonBlock className="h-4 w-full" />
            <SkeletonBlock className="h-4 w-3/4" />
          </div>
        </div>
      ))}
    </div>
  );
}
