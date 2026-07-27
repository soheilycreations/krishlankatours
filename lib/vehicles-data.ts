import { supabase, isSupabaseConfigured } from "@/lib/supabase";

export interface Vehicle {
  id: string;
  name: string;
  type: string;
  seats: number;
  description: string;
  imageUrl: string;
  active: boolean;
}

const FALLBACK_VEHICLES: Vehicle[] = [
  { id: "fallback-car", name: "Toyota Prius / Axio", type: "car", seats: 3, description: "Comfortable sedan, ideal for couples and solo travellers", imageUrl: "", active: true },
  { id: "fallback-van", name: "Toyota KDH High-Roof Van", type: "van", seats: 8, description: "Spacious air-conditioned van, great for families", imageUrl: "", active: true },
  { id: "fallback-suv", name: "Toyota Land Cruiser / SUV", type: "suv", seats: 5, description: "Premium ride with extra comfort for hill country roads", imageUrl: "", active: true },
];

export async function getVehicles(includeInactive = false): Promise<Vehicle[]> {
  if (!isSupabaseConfigured || !supabase) return FALLBACK_VEHICLES;
  let query = supabase.from("vehicles").select("*").order("sort_order").order("created_at");
  if (!includeInactive) query = query.eq("active", true);
  const { data, error } = await query;
  if (error || !data) return FALLBACK_VEHICLES;
  return data.map((row) => ({
    id: row.id,
    name: row.name,
    type: row.type,
    seats: row.seats,
    description: row.description ?? "",
    imageUrl: row.image_url ?? "",
    active: row.active,
  }));
}
