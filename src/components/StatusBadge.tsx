interface StatusBadgeProps {
  status: string;
  className?: string;
}

/**
 * Ledger status. The palette is deliberately narrow: settled things are green,
 * waiting things are gold, everything else is quiet.
 */
const styles: Record<string, string> = {
  paid: "border-[rgba(44,122,86,0.28)] bg-[rgba(44,122,86,0.08)] text-positive",
  joined: "border-[rgba(44,122,86,0.28)] bg-[rgba(44,122,86,0.08)] text-positive",
  completed: "border-[rgba(44,122,86,0.28)] bg-[rgba(44,122,86,0.08)] text-positive",
  active: "border-[rgba(212,175,55,0.45)] bg-gold-50 text-gold-700",
  live: "border-[rgba(212,175,55,0.45)] bg-gold-50 text-gold-700",
  pending: "border-[rgba(176,141,40,0.3)] bg-[rgba(212,175,55,0.1)] text-gold-700",
  failed: "border-[rgba(176,59,54,0.3)] bg-[rgba(176,59,54,0.07)] text-negative",
};

export default function StatusBadge({ status, className = "" }: StatusBadgeProps) {
  const key = status.toLowerCase();
  const tone = styles[key] ?? "border-line bg-cream text-muted";

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-medium tracking-luxe-sm uppercase ${tone} ${className}`}
    >
      <span
        aria-hidden
        className="h-1.5 w-1.5 rounded-full bg-current opacity-70"
      />
      {status}
    </span>
  );
}
