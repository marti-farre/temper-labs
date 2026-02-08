export default function Header() {
  return (
    <header className="w-full border-b border-border">
      <div className="max-w-content mx-auto px-4 py-4 flex items-center justify-between">
        <h1 className="text-xl font-bold tracking-tight">
          <span className="text-accent">Temper</span>LLM
        </h1>
        <span className="text-xs text-secondary font-mono">v0.1</span>
      </div>
    </header>
  );
}
