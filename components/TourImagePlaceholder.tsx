import {
  PawPrint,
  Landmark,
  Mountain,
  Sailboat,
  Palmtree,
  Building2,
  ImageOff,
} from "lucide-react";
import type { TourCategory } from "@/lib/tours";

const categoryIcons: Record<TourCategory, typeof PawPrint> = {
  wildlife: PawPrint,
  heritage: Landmark,
  hillcountry: Mountain,
  wetland: Sailboat,
  coastal: Palmtree,
  city: Building2,
};

const categoryGradients: Record<TourCategory, string> = {
  wildlife: "from-emerald-900 to-emerald-700",
  heritage: "from-amber-900 to-amber-700",
  hillcountry: "from-teal-900 to-teal-700",
  wetland: "from-cyan-900 to-cyan-700",
  coastal: "from-rose-900 to-rose-700",
  city: "from-violet-900 to-violet-700",
};

export default function TourImagePlaceholder({
  category,
  label,
  className = "",
}: {
  category: TourCategory;
  label: string;
  className?: string;
}) {
  const Icon = categoryIcons[category] ?? ImageOff;
  const gradient = categoryGradients[category] ?? "from-navy to-navy-2";

  return (
    <div
      className={`flex flex-col items-center justify-center gap-2 bg-gradient-to-br ${gradient} ${className}`}
    >
      <Icon className="text-white/70" size={36} strokeWidth={1.5} />
      <span className="font-stamp text-[10px] uppercase tracking-widest text-white/40">
        {label}
      </span>
    </div>
  );
}
