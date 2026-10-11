import { AlertTriangle } from "lucide-react";

/** Error banner for admin list pages (set via ?error=... by server actions). */
export default function AdminFlash({ error }: { error?: string | string[] }) {
  const message = Array.isArray(error) ? error[0] : error;
  if (!message) return null;
  return (
    <div
      role="alert"
      className="flex items-start gap-2 bg-red-50 border border-red-200 rounded-xl p-4 font-body text-sm text-red-700"
    >
      <AlertTriangle size={16} className="mt-0.5 shrink-0" />
      <span>{message.slice(0, 300)}</span>
    </div>
  );
}
