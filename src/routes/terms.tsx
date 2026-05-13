import { createFileRoute } from "@tanstack/react-router";
import { PageHero } from "@/components/site/PageHero";

export const Route = createFileRoute("/terms")({
  head: () => ({
    meta: [
      { title: "Terms of Service — JZ Linen & Laundry" },
      {
        name: "description",
        content: "Terms of service governing use of JZ Linen & Laundry services and website.",
      },
    ],
  }),
  component: Terms,
});

function Terms() {
  return (
    <>
      <PageHero eyebrow="Legal" title="Terms of Service" sub="Last updated 1 January 2026." />
      <section className="container-page py-16">
        <article className="prose mx-auto max-w-3xl text-foreground [&_h2]:font-display [&_h2]:mt-10 [&_h2]:text-2xl [&_h2]:font-bold [&_p]:mt-3 [&_p]:text-muted-foreground [&_ul]:mt-3 [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:text-muted-foreground">
          <p>
            These terms govern your use of services provided by JZ Linen & Laundry Ltd. By engaging
            our services or using our website, you agree to be bound by them.
          </p>
          <h2>Services</h2>
          <p>
            We provide commercial linen rental, laundry processing and related logistics. Specific
            scope is defined in your service agreement.
          </p>
          <h2>Pricing & payment</h2>
          <p>
            Quotes are valid for 30 days. Invoices are payable within 14 days unless otherwise
            agreed in writing.
          </p>
          <h2>Pickup & delivery</h2>
          <p>
            We provide collection and delivery within scheduled windows. Customers are responsible
            for safe access and accurate item counts.
          </p>
          <h2>Loss & damage</h2>
          <p>
            Reasonable wear and tear is expected. Items lost or damaged through customer fault are
            chargeable per our rate card.
          </p>
          <h2>Termination</h2>
          <p>
            Rolling contracts may be terminated with 30 days' written notice. Outstanding balances
            remain payable.
          </p>
          <h2>Liability</h2>
          <p>
            Our liability is limited to the value of the affected service in line with industry
            standards. Nothing limits liability for death or personal injury caused by negligence.
          </p>
          <h2>Governing law</h2>
          <p>These terms are governed by the laws of England and Wales.</p>
        </article>
      </section>
    </>
  );
}
