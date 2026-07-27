import { createSupabaseServerClient } from "@/lib/supabase/server";
import { saveVehicle, deleteVehicle, toggleVehicle } from "@/app/admin/actions";
import { AlertTriangle, Car, Plus } from "lucide-react";

export const dynamic = "force-dynamic";

const TYPES = ["car", "van", "suv", "minibus", "coach"];

function VehicleForm({ vehicle }: { vehicle?: Record<string, unknown> }) {
  const v = vehicle ?? {};
  return (
    <form action={saveVehicle} className="grid sm:grid-cols-2 gap-4 bg-paper-2/50 rounded-xl p-5">
      {vehicle ? <input type="hidden" name="id" value={String(v.id)} /> : null}
      <div>
        <label className="block font-stamp text-[10px] uppercase tracking-wide text-ink-text/50 mb-1.5">Name *</label>
        <input name="name" defaultValue={String(v.name ?? "")} required className="w-full bg-white border border-navy/12 rounded-lg px-3 py-2.5 font-body text-sm text-navy focus:border-blue outline-none" />
      </div>
      <div className="grid grid-cols-3 gap-3">
        <div>
          <label className="block font-stamp text-[10px] uppercase tracking-wide text-ink-text/50 mb-1.5">Type</label>
          <select name="type" defaultValue={String(v.type ?? "car")} className="w-full bg-white border border-navy/12 rounded-lg px-2 py-2.5 font-body text-sm text-navy outline-none">
            {TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>
        <div>
          <label className="block font-stamp text-[10px] uppercase tracking-wide text-ink-text/50 mb-1.5">Seats</label>
          <input name="seats" type="number" min={1} max={60} defaultValue={Number(v.seats ?? 4)} className="w-full bg-white border border-navy/12 rounded-lg px-3 py-2.5 font-body text-sm text-navy outline-none" />
        </div>
        <div>
          <label className="block font-stamp text-[10px] uppercase tracking-wide text-ink-text/50 mb-1.5">Order</label>
          <input name="sort_order" type="number" defaultValue={Number(v.sort_order ?? 0)} className="w-full bg-white border border-navy/12 rounded-lg px-3 py-2.5 font-body text-sm text-navy outline-none" />
        </div>
      </div>
      <div className="sm:col-span-2">
        <label className="block font-stamp text-[10px] uppercase tracking-wide text-ink-text/50 mb-1.5">Description</label>
        <input name="description" defaultValue={String(v.description ?? "")} className="w-full bg-white border border-navy/12 rounded-lg px-3 py-2.5 font-body text-sm text-navy outline-none" />
      </div>
      <div className="sm:col-span-2">
        <label className="block font-stamp text-[10px] uppercase tracking-wide text-ink-text/50 mb-1.5">Image URL (optional)</label>
        <input name="image_url" defaultValue={String(v.image_url ?? "")} placeholder="https://..." className="w-full bg-white border border-navy/12 rounded-lg px-3 py-2.5 font-body text-sm text-navy outline-none" />
      </div>
      <div className="sm:col-span-2 flex items-center justify-between">
        <label className="flex items-center gap-2 font-body text-sm text-ink-text/70">
          <input type="checkbox" name="active" defaultChecked={v.active !== false} className="accent-blue w-4 h-4" />
          Visible in planner
        </label>
        <button className="inline-flex items-center gap-1.5 bg-blue text-white px-5 py-2.5 rounded-full font-body text-sm font-medium hover:bg-blue-light transition-colors">
          <Plus size={14} /> {vehicle ? "Save changes" : "Add vehicle"}
        </button>
      </div>
    </form>
  );
}

export default async function VehiclesAdminPage() {
  const supabase = await createSupabaseServerClient();
  if (!supabase) {
    return (
      <div className="bg-white rounded-2xl border border-navy/10 p-8 text-center">
        <AlertTriangle className="text-clay mx-auto mb-3" size={28} />
        <p className="font-body text-sm text-ink-text/60">Not connected yet — contact your developer.</p>
      </div>
    );
  }

  const { data: vehicles, error } = await supabase
    .from("vehicles")
    .select("*")
    .order("sort_order")
    .order("created_at");

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-2xl text-navy">Vehicles</h1>
        <p className="font-body text-sm text-ink-text/55 mt-1">
          These appear in the &quot;Choose your ride&quot; step of the custom trip planner.
        </p>
      </div>

      {error?.message.includes("does not exist") && (
        <div className="bg-clay/10 border border-clay/30 rounded-xl p-4 font-body text-sm text-ink-text/70">
          The vehicles table doesn&apos;t exist yet — run{" "}
          <code className="font-stamp text-xs">supabase/migration-custom-planner.sql</code> in the
          Supabase SQL editor first.
        </div>
      )}

      <div className="bg-white rounded-2xl border border-navy/10 p-6">
        <h2 className="font-display text-lg text-navy mb-4">Add a vehicle</h2>
        <VehicleForm />
      </div>

      <div className="space-y-5">
        {(vehicles ?? []).map((v) => (
          <details key={v.id} className="bg-white rounded-2xl border border-navy/10 overflow-hidden">
            <summary className="flex items-center gap-4 px-6 py-4 cursor-pointer select-none">
              <span className={`w-9 h-9 rounded-full flex items-center justify-center ${v.active ? "bg-blue/10 text-blue" : "bg-navy/5 text-navy/30"}`}>
                <Car size={17} />
              </span>
              <span className="flex-1">
                <span className="font-display text-base text-navy block">{v.name}</span>
                <span className="font-body text-xs text-ink-text/50">
                  {v.type} · {v.seats} seats {v.active ? "" : "· hidden"}
                </span>
              </span>
              <form action={toggleVehicle}>
                <input type="hidden" name="id" value={v.id} />
                <input type="hidden" name="next" value={String(!v.active)} />
                <button className="font-body text-xs px-3 py-1.5 rounded-full border border-navy/15 text-ink-text/60 hover:border-blue hover:text-blue transition-colors">
                  {v.active ? "Hide" : "Show"}
                </button>
              </form>
              <form action={deleteVehicle}>
                <input type="hidden" name="id" value={v.id} />
                <button className="font-body text-xs px-3 py-1.5 rounded-full border border-navy/15 text-ink-text/60 hover:border-red-400 hover:text-red-500 transition-colors">
                  Delete
                </button>
              </form>
            </summary>
            <div className="px-6 pb-6 border-t border-navy/8 pt-5">
              <VehicleForm vehicle={v} />
            </div>
          </details>
        ))}
      </div>
    </div>
  );
}
