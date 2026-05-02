import { createFileRoute } from "@tanstack/react-router";
import { PageHero } from "@/components/site/PageHero";
import g1 from "@/assets/gallery-towels.jpg";
import g2 from "@/assets/gallery-restaurant.jpg";
import g3 from "@/assets/gallery-medical.jpg";
import g4 from "@/assets/gallery-spa.jpg";
import g5 from "@/assets/gallery-pickup.jpg";
import g6 from "@/assets/gallery-facility.jpg";

export const Route = createFileRoute("/gallery")({
  head: () => ({
    meta: [
      { title: "Gallery — Inside JZ Linen & Laundry" },
      { name: "description", content: "A look inside our processing facility, finished linens and delivery operations across the UK." },
      { property: "og:title", content: "Gallery — JZ Linen & Laundry" },
      { property: "og:description", content: "Inside our facility and finished linen work." },
    ],
  }),
  component: Gallery,
});

const ITEMS = [
  { src: g1, label: "Hotel bath towels" },
  { src: g6, label: "Processing floor" },
  { src: g2, label: "Restaurant tablecloths" },
  { src: g4, label: "Spa rolled towels" },
  { src: g3, label: "Healthcare bedding" },
  { src: g5, label: "Daily logistics" },
];

function Gallery() {
  return (
    <>
      <PageHero eyebrow="Gallery" title="Inside the operation." sub="A look at our facility, our finishes and the team behind every immaculate delivery." />
      <section className="container-page py-16">
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
          {ITEMS.map((it, i) => (
            <figure key={i} className="group relative overflow-hidden rounded-2xl shadow-card">
              <img src={it.src} alt={it.label} loading="lazy" width={1024} height={1024} className="aspect-square w-full object-cover transition-transform duration-500 group-hover:scale-105" />
              <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-4 text-sm font-semibold text-white opacity-0 transition-opacity group-hover:opacity-100">
                {it.label}
              </figcaption>
            </figure>
          ))}
        </div>
      </section>
    </>
  );
}
