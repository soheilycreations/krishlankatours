import Link from "next/link";
import Image from "next/image";
import { LogOut } from "lucide-react";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { signOut } from "@/app/admin/actions";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createSupabaseServerClient();
  const user = supabase ? (await supabase.auth.getUser()).data.user : null;

  return (
    <div className="min-h-screen bg-paper-2">
      <header className="bg-navy text-white">
        <div className="mx-auto max-w-5xl px-5 sm:px-8 h-16 flex items-center justify-between">
          <Link href="/admin" className="flex items-center gap-2.5">
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
          {user && (
            <form action={signOut} className="flex items-center gap-4">
              <span className="font-body text-xs text-white/50 hidden sm:inline">
                {user.email}
              </span>
              <button
                type="submit"
                className="flex items-center gap-1.5 font-body text-sm text-white/70 hover:text-white transition-colors"
              >
                <LogOut size={15} /> Sign out
              </button>
            </form>
          )}
        </div>
      </header>
      <main className="mx-auto max-w-5xl px-5 sm:px-8 py-10">{children}</main>
    </div>
  );
}
