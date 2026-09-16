interface EmptyStateProps {
  title: string;
  hint?: string;
}

export default function EmptyState({ title, hint }: EmptyStateProps) {
  return (
    <div
      role="status"
      className="flex flex-col items-center gap-2 rounded-2xl border border-white/10 bg-white/5 p-8 text-center shadow-glass backdrop-blur-md"
    >
      <p className="text-base font-medium text-white/80">{title}</p>
      {hint && <p className="text-sm text-white/50">{hint}</p>}
    </div>
  );
}
