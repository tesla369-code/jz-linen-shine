import { Link } from "@tanstack/react-router";
import { useState } from "react";
import { Menu, X, Phone, UserCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SITE } from "@/lib/site";
import logo from "@/assets/logo.png";

const NAV = [
  { to: "/", label: "Home" },
  { to: "/about", label: "About" },
  { to: "/services", label: "Services" },
  { to: "/gallery", label: "Gallery" },
  { to: "/blog", label: "Blog" },
  { to: "/contact", label: "Contact" },
] as const;

export function Header() {
  const [open, setOpen] = useState(false);
  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/60 bg-background/80 backdrop-blur-xl">
      <div className="container-page flex h-16 items-center justify-between gap-2 lg:h-[72px] lg:gap-3">
        <Link to="/" className="flex min-w-0 shrink items-center gap-2" aria-label={SITE.name}>
          <img
            src={logo}
            alt=""
            width={44}
            height={44}
            fetchPriority="high"
            className="h-9 w-9 shrink-0 rounded-lg object-cover shadow-card ring-1 ring-border lg:h-10 lg:w-10"
          />
          <div className="min-w-0 leading-tight">
            <div className="truncate font-display text-sm font-bold tracking-tight sm:text-base lg:text-base xl:text-lg">
              {SITE.short}
            </div>
            <div className="hidden text-[10px] uppercase tracking-[0.18em] text-muted-foreground sm:block xl:block">
              Linen & Laundry
            </div>
          </div>
        </Link>
        <nav className="hidden min-w-0 items-center gap-0 lg:flex" aria-label="Primary">
          {NAV.map((n) => (
            <Link
              key={n.to}
              to={n.to}
              className="whitespace-nowrap rounded-md px-2 py-2 text-[12.5px] font-medium text-foreground/70 transition-colors hover:bg-accent hover:text-foreground xl:px-3 xl:text-sm"
              activeProps={{ className: "text-foreground bg-accent" }}
              activeOptions={{ exact: n.to === "/" }}
            >
              {n.label}
            </Link>
          ))}
        </nav>
        <div className="hidden shrink-0 items-center gap-2 lg:flex">
          <a
            href={`tel:${SITE.phone}`}
            className="hidden items-center gap-2 rounded-md px-2 py-2 text-sm font-medium text-foreground/80 hover:text-foreground 2xl:flex"
          >
            <Phone className="h-4 w-4" /> {SITE.phoneDisplay}
          </a>
          <Button asChild variant="silver" size="sm" className="hidden xl:inline-flex">
            <Link to="/book-pickup">Book Pickup</Link>
          </Button>
          <Button asChild variant="outline" size="sm">
            <Link to="/login">
              <UserCircle className="h-4 w-4" /> Login / Sign Up
            </Link>
          </Button>
          <Button asChild variant="hero" size="sm">
            <Link to="/quote">Get Quote</Link>
          </Button>
        </div>
        <button
          className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-md border border-border lg:hidden"
          onClick={() => setOpen((v) => !v)}
          aria-label="Toggle menu"
          aria-expanded={open}
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>
      {open && (
        <div
          className="lg:hidden absolute inset-x-0 top-full border-t border-border bg-background/95 backdrop-blur-xl shadow-lg max-h-[calc(100vh-4rem)] overflow-y-auto overscroll-contain"
          role="dialog"
          aria-modal="true"
        >
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
            <a
              href={`tel:${SITE.phone}`}
              className="mt-1 flex items-center gap-2 rounded-md px-3 py-2.5 text-sm font-medium text-foreground/80 hover:bg-accent"
            >
              <Phone className="h-4 w-4 text-primary" /> {SITE.phoneDisplay}
            </a>
            <Button asChild variant="outline" size="sm" className="mt-2">
              <Link to="/login" onClick={() => setOpen(false)}>
                <UserCircle className="h-4 w-4" /> Login / Sign Up
              </Link>
            </Button>
            <div className="mt-2 grid grid-cols-2 gap-2">
              <Button asChild variant="silver" size="sm">
                <Link to="/book-pickup" onClick={() => setOpen(false)}>
                  Book Pickup
                </Link>
              </Button>
              <Button asChild variant="hero" size="sm">
                <Link to="/quote" onClick={() => setOpen(false)}>
                  Get Quote
                </Link>
              </Button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
