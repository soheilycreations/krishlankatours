import Link from "next/link";
import Image from "next/image";
import { LogOut, LayoutDashboard, Map, Mail, MapPin, Send } from "lucide-react";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { signOut } from "@/app/admin/actions";

const navItems = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/enquiries", label: "Enquiries", icon: Mail },
  { href: "/admin/tours", label: "Tours", icon: Map },
  { href: "/admin/destinations", label: "Destinations", icon: MapPin },
  { href: "/admin/newsletter", label: "Newsletter", icon: Send },
];

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createSupabaseServerClient();
  const user = supabase ? (await supabase.auth.getUser()).data.user : null;

  let newCount = 0;
  if (supabase && user) {
    const { count } = await supabase
      .from("inquiries")
      .select("id", { count: "exact", head: true })
      .eq("status", "new");
    newCount = count ?? 0;
  }

  return (
    <div className="min-h-screen bg-paper-2 flex">
      <aside className="hidden md:flex flex-col w-60 shrink-0 bg-navy text-white min-h-screen">
        <Link href="/admin" className="flex items-center gap-2.5 px-6 h-16 border-b border-white/10">
          <span className="relative w-8 h-8 rounded-full bg-white flex items-center justify-center overflow-hidden shrink-0">
            <Image
              src="/images/logo-icon.png"
              alt=""
              width={28}
              height={28}
              className="object-contain w-7 h-7"
            />
          </span>
          <span className="font-display text-lg">Admin</span>
        </Link>

        <nav className="flex-1 py-6 flex flex-col gap-1 px-3">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center justify-between gap-3 px-3.5 py-2.5 rounded-lg font-body text-sm text-white/75 hover:bg-white/10 hover:text-white transition-colors"
              >
                <span className="flex items-center gap-3">
                  <Icon size={17} /> {item.label}
                </span>
                {item.href === "/admin/enquiries" && newCount > 0 && (
                  <span className="bg-clay text-navy text-[11px] font-bold rounded-full w-5 h-5 flex items-center justify-center">
                    {newCount}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {user && (
          <form action={signOut} className="px-6 py-5 border-t border-white/10">
            <p className="font-body text-xs text-white/40 mb-2 truncate">{user.email}</p>
            <button
              type="submit"
              className="flex items-center gap-1.5 font-body text-sm text-white/70 hover:text-white transition-colors"
            >
              <LogOut size={15} /> Sign out
            </button>
          </form>
        )}
      </aside>

      <div className="flex-1 min-w-0">
        <header className="md:hidden bg-navy text-white flex items-center justify-between px-5 h-16">
          <Link href="/admin" className="flex items-center gap-2.5">
            <span className="relative w-8 h-8 rounded-full bg-white flex items-center justify-center overflow-hidden shrink-0">
              <Image src="/images/logo-icon.png" alt="" width={28} height={28} className="object-contain w-7 h-7" />
            </span>
            <span className="font-display text-lg">Admin</span>
          </Link>
          {user && (
            <form action={signOut}>
              <button type="submit" className="flex items-center gap-1.5 font-body text-sm text-white/70">
                <LogOut size={15} />
              </button>
            </form>
          )}
        </header>

        <nav className="md:hidden flex overflow-x-auto gap-1 bg-white border-b border-navy/8 px-3 py-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full font-body text-xs text-ink-text/70 hover:bg-paper-2 whitespace-nowrap shrink-0"
              >
                <Icon size={13} /> {item.label}
                {item.href === "/admin/enquiries" && newCount > 0 && (
                  <span className="bg-blue text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                    {newCount}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        <main className="max-w-5xl mx-auto px-5 sm:px-8 py-10">{children}</main>
      </div>
    </div>
  );
}
