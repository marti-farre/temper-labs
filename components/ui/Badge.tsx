import clsx from "clsx";

type BadgeVariant = "default" | "success" | "fail" | "accent";

interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  className?: string;
}

const variantStyles: Record<BadgeVariant, string> = {
  default: "bg-border text-text-secondary",
  success: "bg-success/10 text-success border-success/20",
  fail: "bg-fail/10 text-fail border-fail/20",
  accent: "bg-accent/10 text-accent border-accent/20",
};

export default function Badge({
  children,
  variant = "default",
  className,
}: BadgeProps) {
  return (
    <span
      className={clsx(
        "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border",
        variantStyles[variant],
        className
      )}
    >
      {children}
    </span>
  );
}
