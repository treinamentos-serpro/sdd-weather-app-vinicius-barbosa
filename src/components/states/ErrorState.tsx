interface ErrorStateProps {
  message?: string;
  onRetry: () => void;
}

export default function ErrorState({
  message = 'Não foi possível carregar os dados do clima.',
  onRetry,
}: ErrorStateProps) {
  return (
    <div
      role="alert"
      className="flex flex-col items-center gap-3 rounded-2xl border border-white/10 bg-white/5 p-8 text-center shadow-glass backdrop-blur-md"
    >
      <p className="text-sm text-white/80">{message}</p>
      <button
        type="button"
        onClick={onRetry}
        className="rounded-xl bg-accent-400 px-4 py-2 text-sm font-medium text-night-900 transition-colors hover:bg-accent-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-400"
      >
        Tentar novamente
      </button>
    </div>
  );
}
