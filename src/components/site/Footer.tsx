import { Link } from "@tanstack/react-router";
import { Mail, MapPin, Phone, Clock, Facebook, Instagram, Linkedin } from "lucide-react";
import { SITE } from "@/lib/site";

export function Footer() {
  return (
    <footer className="mt-24 border-t border-border bg-[oklch(0.16_0.04_255)] text-[oklch(0.92_0.01_250)]">
      <div className="container-page grid gap-12 py-16 lg:grid-cols-4">
        <div>
          <div className="font-display text-2xl font-bold text-white">{SITE.name}</div>
          <p className="mt-3 text-sm leading-relaxed text-white/70">
            UK's trusted partner for premium commercial linen rental, laundry processing
            and timely delivery — serving hotels, restaurants, healthcare and spas since 2008.
          </p>
          <div className="mt-5 flex gap-3">
            <a href={SITE.social.facebook} aria-label="Facebook" className="rounded-md border border-white/15 p-2 hover:bg-white/10"><Facebook className="h-4 w-4" /></a>
            <a href={SITE.social.instagram} aria-label="Instagram" className="rounded-md border border-white/15 p-2 hover:bg-white/10"><Instagram className="h-4 w-4" /></a>
            <a href={SITE.social.linkedin} aria-label="LinkedIn" className="rounded-md border border-white/15 p-2 hover:bg-white/10"><Linkedin className="h-4 w-4" /></a>
          </div>
        </div>
        <div>
          <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-white">Company</h3>
          <ul className="space-y-2 text-sm text-white/70">
            <li><Link to="/about" className="hover:text-white">About Us</Link></li>
            <li><Link to="/services" className="hover:text-white">Services</Link></li>
            <li><Link to="/pricing" className="hover:text-white">Pricing</Link></li>
            <li><Link to="/gallery" className="hover:text-white">Gallery</Link></li>
            <li><Link to="/blog" className="hover:text-white">Blog</Link></li>
          </ul>
        </div>
        <div>
          <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-white">Get Started</h3>
          <ul className="space-y-2 text-sm text-white/70">
            <li><Link to="/quote" className="hover:text-white">Request a Quote</Link></li>
            <li><Link to="/book-pickup" className="hover:text-white">Book a Pickup</Link></li>
            <li><Link to="/contact" className="hover:text-white">Contact Us</Link></li>
            <li><Link to="/privacy" className="hover:text-white">Privacy Policy</Link></li>
            <li><Link to="/terms" className="hover:text-white">Terms of Service</Link></li>
          </ul>
        </div>
        <div>
          <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-white">Contact</h3>
          <ul className="space-y-3 text-sm text-white/70">
            <li className="flex gap-3"><MapPin className="mt-0.5 h-4 w-4 shrink-0 text-primary-glow" /><span>{SITE.address.street}<br />{SITE.address.city} {SITE.address.postcode}</span></li>
            <li className="flex gap-3"><Phone className="mt-0.5 h-4 w-4 shrink-0 text-primary-glow" /><a href={`tel:${SITE.phone}`} className="hover:text-white">{SITE.phoneDisplay}</a></li>
            <li className="flex gap-3"><Mail className="mt-0.5 h-4 w-4 shrink-0 text-primary-glow" /><a href={`mailto:${SITE.email}`} className="hover:text-white">{SITE.email}</a></li>
            <li className="flex gap-3"><Clock className="mt-0.5 h-4 w-4 shrink-0 text-primary-glow" />{SITE.hours}</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10">
        <div className="container-page flex flex-col items-center justify-between gap-3 py-5 text-xs text-white/60 sm:flex-row">
          <p>© {new Date().getFullYear()} {SITE.name}. All rights reserved.</p>
          <p>Registered in England & Wales · VAT GB 384 9923 11</p>
        </div>
      </div>
    </footer>
  );
}
