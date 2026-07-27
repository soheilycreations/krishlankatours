import { Landmark, Waves, Trees, Clock3 } from "lucide-react";
import Reveal from "@/components/Reveal";

interface StatItem {
  icon: typeof Landmark;
  value: string;
  label: string;
  color: string;
}

export default function SriLankaStats({
  stats,
}: {
  stats: { value: string; label: string }[];
}) {
  const icons = [Landmark, Trees, Waves, Clock3];
  const colors = ["text-amber-600", "text-emerald-600", "text-rose-500", "text-violet-600"];

  const items: StatItem[] = stats.map((s, i) => ({
    icon: icons[i % icons.length],
    value: s.value,
    label: s.label,
    color: colors[i % colors.length],
  }));

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6">
      {items.map((item, i) => {
        const Icon = item.icon;
        return (
          <Reveal key={item.label} delay={i * 0.07} className="text-center">
            <Icon className={`${item.color} mx-auto mb-2`} size={22} strokeWidth={1.75} />
            <p className="font-display text-2xl sm:text-3xl text-navy">{item.value}</p>
            <p className="font-body text-xs text-ink-text/55 mt-1">{item.label}</p>
          </Reveal>
        );
      })}
    </div>
  );
}
