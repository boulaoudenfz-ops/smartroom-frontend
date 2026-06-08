export default function LoadingSkeleton() {
  return (
    <div className="p-8 space-y-6 animate-pulse">
      <div className="h-8 w-64 bg-brand-sand/50 rounded-xl" />
      <div className="h-4 w-48 bg-brand-sand/30 rounded-xl" />
      <div className="grid grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-28 glass-card" />
        ))}
      </div>
      <div className="grid grid-cols-3 gap-6">
        <div className="col-span-2 h-64 glass-card" />
        <div className="h-64 glass-card" />
      </div>
    </div>
  )
}