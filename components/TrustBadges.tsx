import { ShieldCheck, Clock, Languages, Route } from "lucide-react";
import Reveal from "@/components/Reveal";

const icons = [Route, Clock, Languages, ShieldCheck];

export default function TrustBadges({
  items,
}: {
  items: { title: string; body: string }[];
}) {
  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
      {items.map((item, i) => {
        const Icon = icons[i % icons.length];
        return (
          <Reveal
            key={item.title}
            delay={i * 0.07}
            className="bg-ink-2 border border-gold/15 rounded-2xl p-6"
          >
            <Icon className="text-gold mb-3.5" size={24} />
            <h3 className="font-display text-base text-paper mb-1.5">{item.title}</h3>
            <p className="font-body text-xs text-paper/55 leading-relaxed">{item.body}</p>
          </Reveal>
        );
      })}
    </div>
  );
}
