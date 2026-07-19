"use client";

import { useTransition } from "react";
import { Trash2 } from "lucide-react";
import { deleteDestination } from "@/app/admin/actions";

export default function DeleteDestinationButton({
  destinationId,
  destinationName,
}: {
  destinationId: string;
  destinationName: string;
}) {
  const [pending, startTransition] = useTransition();

  const handleDelete = () => {
    if (!confirm(`Delete "${destinationName}"? This can't be undone.`)) return;
    startTransition(() => {
      deleteDestination(destinationId);
    });
  };

  return (
    <button
      onClick={handleDelete}
      disabled={pending}
      aria-label="Delete"
      className="shrink-0 w-9 h-9 rounded-full border border-navy/15 flex items-center justify-center text-ink-text/50 hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition-colors disabled:opacity-50"
    >
      <Trash2 size={15} />
    </button>
  );
}
