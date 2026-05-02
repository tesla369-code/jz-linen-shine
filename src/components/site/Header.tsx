import { Link } from "@tanstack/react-router";
import { useState } from "react";
import { Menu, X, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SITE } from "@/lib/site";
import logo from "@/assets/logo.png";

const NAV = [
  { to: "/", label: "Home" },
  { to: "/about", label: "About" },
  { to: "/services", label: "Services" },
  { to: "/pricing", label: "Pricing" },
  { to: "/gallery", label: "Gallery" },
  { to: "/blog", label: "Blog" },
  { to: "/contact", label: "Contact" },
] as const;

export function Header() {
  const [open, setOpen] = useState(false);
  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/60 bg-background/80 backdrop-blur-xl">
      <div className="container-page flex h-16 items-center justify-between gap-4 lg:h-20">
        <Link to="/" className="flex items-center gap-3" aria-label={SITE.name}>
          <img
            src={logo}
            alt=""
            width={48}
            height={48}
            className="h-12 w-12 rounded-lg object-cover shadow-card ring-1 ring-border"
          />
          <div className="leading-tight">
            <div className="font-display text-lg font-bold tracking-tight">{SITE.short}</div>
            <div className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
              Linen & Laundry
            </div>
          </div>
        </Link>
        <nav className="hidden items-center gap-1 lg:flex" aria-label="Primary">
          {NAV.map((n) => (
            <Link
              key={n.to}
              to={n.to}
              className="rounded-md px-3 py-2 text-sm font-medium text-foreground/70 transition-colors hover:bg-accent hover:text-foreground"
              activeProps={{ className: "text-foreground bg-accent" }}
              activeOptions={{ exact: n.to === "/" }}
            >
              {n.label}
            </Link>
          ))}
        </nav>
        <div className="hidden items-center gap-2 lg:flex">
          <a
            href={`tel:${SITE.phone}`}
            className="flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium text-foreground/80 hover:text-foreground"
          >
            <Phone className="h-4 w-4" /> {SITE.phoneDisplay}
          </a>
          <Button asChild variant="silver" size="sm">
            <Link to="/book-pickup">Book Pickup</Link>
          </Button>
          <Button asChild variant="hero" size="sm">
            <Link to="/quote">Get Quote</Link>
          </Button>
        </div>
        <button
          className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-border lg:hidden"
          onClick={() => setOpen((v) => !v)}
          aria-label="Toggle menu"
          aria-expanded={open}
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>
      {open && (
        <div className="border-t border-border bg-background lg:hidden">
          <div className="container-page flex flex-col gap-1 py-3">
            {NAV.map((n) => (
              <Link
                key={n.to}
                to={n.to}
                onClick={() => setOpen(false)}
                className="rounded-md px-3 py-2.5 text-sm font-medium text-foreground/80 hover:bg-accent"
                activeProps={{ className: "bg-accent text-foreground" }}
                activeOptions={{ exact: n.to === "/" }}
              >
                {n.label}
              </Link>
            ))}
            <div className="mt-2 grid grid-cols-2 gap-2">
              <Button asChild variant="silver" size="sm">
                <Link to="/book-pickup" onClick={() => setOpen(false)}>Book Pickup</Link>
              </Button>
              <Button asChild variant="hero" size="sm">
                <Link to="/quote" onClick={() => setOpen(false)}>Get Quote</Link>
              </Button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
