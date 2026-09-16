import { type FormEvent, useId, useState } from 'react';

interface SearchBarProps {
  query: string;
  onQueryChange: (value: string) => void;
  onSearch: (city: string) => void;
  disabled?: boolean;
}

export default function SearchBar({
  query,
  onQueryChange,
  onSearch,
  disabled = false,
}: SearchBarProps) {
  const inputId = useId();
  const errorId = useId();
  const [validationMessage, setValidationMessage] = useState<string | undefined>(undefined);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmed = query.trim();
    if (!trimmed) {
      setValidationMessage('Digite o nome de uma cidade.');
      return;
    }

    setValidationMessage(undefined);
    onSearch(trimmed);
  };

  return (
    <form role="search" aria-busy={disabled} onSubmit={handleSubmit} className="w-full">
      <label htmlFor={inputId} className="mb-2 block text-sm font-medium text-white/80">
        Buscar cidade
      </label>
      <div className="flex gap-2 rounded-2xl border border-white/10 bg-white/5 p-2 shadow-glass backdrop-blur-md">
        <input
          id={inputId}
          type="search"
          value={query}
          onChange={(event) => {
            onQueryChange(event.target.value);
            if (validationMessage) setValidationMessage(undefined);
          }}
          disabled={disabled}
          aria-describedby={validationMessage ? errorId : undefined}
          placeholder="Digite o nome de uma cidade"
          className="min-w-0 flex-1 rounded-xl bg-transparent px-3 py-2 text-white placeholder-white/50 outline-none focus-visible:ring-2 focus-visible:ring-accent-400 disabled:cursor-not-allowed disabled:opacity-50"
        />
        <button
          type="submit"
          disabled={disabled}
          className="rounded-xl bg-accent-400 px-4 py-2 font-medium text-night-900 transition-colors hover:bg-accent-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-400 disabled:cursor-not-allowed disabled:bg-accent-400 disabled:opacity-50 disabled:hover:bg-accent-400"
        >
          Buscar
        </button>
      </div>
      {validationMessage && (
        <p id={errorId} role="alert" className="mt-2 text-sm text-white/80">
          {validationMessage}
        </p>
      )}
    </form>
  );
}
