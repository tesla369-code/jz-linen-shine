import { MessageCircle, Phone, FileText } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { SITE, waLink } from "@/lib/site";

export function FloatingWidgets() {
  return (
    <>
      <a
        href={waLink()}
        target="_blank"
        rel="noopener"
        aria-label="Chat on WhatsApp"
        className="fixed bottom-24 right-5 z-50 hidden h-14 w-14 items-center justify-center rounded-full bg-whatsapp text-white shadow-elegant transition-transform hover:scale-110 md:bottom-6 md:flex"
      >
        <MessageCircle className="h-7 w-7" />
        <span className="absolute inset-0 -z-10 animate-ping rounded-full bg-whatsapp/40" />
      </a>
      <div className="fixed inset-x-0 bottom-0 z-50 grid grid-cols-3 border-t border-border bg-background/95 backdrop-blur md:hidden">
        <a
          href={`tel:${SITE.phone}`}
          className="flex flex-col items-center gap-1 py-2.5 text-xs font-medium"
        >
          <Phone className="h-5 w-5 text-primary" /> Call
        </a>
        <a
          href={waLink()}
          target="_blank"
          rel="noopener"
          className="flex flex-col items-center gap-1 border-x border-border py-2.5 text-xs font-medium"
        >
          <MessageCircle className="h-5 w-5 text-whatsapp" /> WhatsApp
        </a>
        <Link to="/quote" className="flex flex-col items-center gap-1 py-2.5 text-xs font-medium">
          <FileText className="h-5 w-5 text-primary" /> Quote
        </Link>
      </div>
    </>
  );
}
