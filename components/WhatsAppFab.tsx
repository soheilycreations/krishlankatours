"use client";

import { motion } from "framer-motion";

const WHATSAPP_URL =
  "https://wa.me/94779168959?text=Hi%20Krish%20Lanka%20Tours!%20I%27d%20like%20to%20plan%20a%20trip%20%F0%9F%8C%B4";

/** Floating WhatsApp button — always one tap away on every page. */
export default function WhatsAppFab() {
  return (
    <motion.a
      href={WHATSAPP_URL}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with us on WhatsApp"
      initial={{ opacity: 0, scale: 0.6 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 1, type: "spring", stiffness: 260, damping: 18 }}
      className="fixed bottom-5 right-5 z-50 w-14 h-14 rounded-full bg-[#25D366] shadow-xl shadow-black/25 flex items-center justify-center hover:scale-110 transition-transform"
    >
      {/* pulse ring */}
      <span className="absolute inset-0 rounded-full bg-[#25D366] animate-ping opacity-25" />
      <svg viewBox="0 0 32 32" className="w-7 h-7 fill-white relative" aria-hidden="true">
        <path d="M16 3C9.4 3 4 8.3 4 14.9c0 2.6.9 5 2.3 7L4.2 28l6.3-2c1.7.9 3.5 1.4 5.5 1.4 6.6 0 12-5.3 12-11.9S22.6 3 16 3zm0 21.7c-1.8 0-3.4-.5-4.9-1.3l-.4-.2-3.7 1.2 1.2-3.5-.3-.4c-1-1.5-1.6-3.3-1.6-5.2 0-5.3 4.4-9.7 9.7-9.7s9.7 4.4 9.7 9.7-4.4 9.4-9.7 9.4zm5.3-7.1c-.3-.1-1.7-.9-2-1-.3-.1-.5-.1-.7.1-.2.3-.8 1-.9 1.2-.2.2-.3.2-.6.1-.3-.1-1.2-.5-2.3-1.4-.9-.8-1.5-1.7-1.6-2-.2-.3 0-.4.1-.6l.4-.5c.1-.2.2-.3.3-.5.1-.2 0-.4 0-.5 0-.1-.7-1.6-.9-2.2-.2-.6-.5-.5-.7-.5h-.6c-.2 0-.5.1-.8.4-.3.3-1 1-1 2.5s1.1 2.9 1.2 3.1c.1.2 2.1 3.2 5.1 4.5.7.3 1.3.5 1.7.6.7.2 1.4.2 1.9.1.6-.1 1.7-.7 2-1.4.2-.7.2-1.3.2-1.4-.1-.1-.3-.2-.6-.3z" />
      </svg>
    </motion.a>
  );
}
