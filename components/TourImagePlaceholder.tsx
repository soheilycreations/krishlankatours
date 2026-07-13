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

  return (
    <div
      className={`flex flex-col items-center justify-center gap-2 bg-gradient-to-br from-navy to-navy-2 ${className}`}
    >
      <Icon className="text-blue-light/70" size={36} strokeWidth={1.5} />
      <span className="font-stamp text-[10px] uppercase tracking-widest text-white/40">
        {label}
      </span>
    </div>
  );
}
