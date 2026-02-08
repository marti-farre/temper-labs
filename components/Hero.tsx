export default function Hero() {
  return (
    <section className="max-w-content mx-auto px-4 pt-16 pb-8 text-center">
      <h2 className="text-4xl sm:text-5xl font-bold tracking-tight mb-4">
        Red team your LLM in{" "}
        <span className="text-accent">30 seconds</span>
      </h2>
      <p className="text-secondary text-lg max-w-[600px] mx-auto leading-relaxed">
        Test your system prompt against 15 adversarial attacks before deploying
        to production.
      </p>
    </section>
  );
}
