"use client";

export default function Footer() {
  return (
    <footer className="py-8 px-6 text-center">
      <p className="text-text-tertiary text-xs">
        Built by{" "}
        <span className="text-text-secondary">Mart&iacute;</span> &middot;{" "}
        <a
          href="https://github.com/marti-farre"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-text-secondary transition-colors"
        >
          GitHub
        </a>{" "}
        &middot;{" "}
        <a
          href="https://www.linkedin.com/in/marti-farre/"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-text-secondary transition-colors"
        >
          LinkedIn
        </a>
      </p>
    </footer>
  );
}
