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
            className="bg-white border border-navy/8 shadow-sm rounded-2xl p-6"
          >
            <div className="w-11 h-11 rounded-full bg-paper-2 flex items-center justify-center mb-3.5">
              <Icon className="text-blue" size={20} />
            </div>
            <h3 className="font-display text-base text-navy mb-1.5">{item.title}</h3>
            <p className="font-body text-xs text-ink-text/55 leading-relaxed">{item.body}</p>
          </Reveal>
        );
      })}
    </div>
  );
}
