import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { PageHero } from "@/components/site/PageHero";
import { Button } from "@/components/ui/button";
import { Lock } from "lucide-react";
import { toast } from "sonner";
import { requireAdminProfile, signIn } from "@/lib/supabase-data";

export const Route = createFileRoute("/admin_/login")({
  head: () => ({
    meta: [{ title: "Admin Login | JZ Linen" }, { name: "robots", content: "noindex,nofollow" }],
  }),
  component: AdminLogin,
});

function AdminLogin() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    void requireAdminProfile().then((profile) => {
      if (profile) navigate({ to: "/admin" });
    });
  }, [navigate]);

  return (
    <>
      <PageHero
        eyebrow="Admin"
        title="Sign in"
        sub="Enter your admin account credentials to continue."
      />
      <section className="container-page py-16">
        <form
          className="mx-auto max-w-sm rounded-2xl border border-border bg-card p-6 shadow-card"
          onSubmit={async (e) => {
            e.preventDefault();
            setLoading(true);
            try {
              await signIn(email, password);
              const profile = await requireAdminProfile();
              if (!profile) {
                toast.error("This account does not have admin access");
                return;
              }
              toast.success("Welcome back");
              navigate({ to: "/admin" });
            } catch (err) {
              const message = err instanceof Error ? err.message : "Invalid credentials";
              toast.error(message);
            } finally {
              setLoading(false);
            }
          }}
        >
          <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-primary-glow text-primary-foreground">
            <Lock className="h-5 w-5" />
          </div>
          <label className="mb-1.5 block text-sm font-medium">Email</label>
          <input
            type="email"
            autoComplete="username"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="h-11 w-full rounded-md border border-input bg-background px-3.5 text-sm outline-none focus:ring-2 focus:ring-ring"
          />
          <label className="mb-1.5 mt-4 block text-sm font-medium">Password</label>
          <input
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="h-11 w-full rounded-md border border-input bg-background px-3.5 text-sm outline-none focus:ring-2 focus:ring-ring"
          />
          <Button type="submit" variant="hero" size="lg" className="mt-5 w-full" disabled={loading}>
            {loading ? "Checking..." : "Sign in"}
          </Button>
          <p className="mt-3 text-xs text-muted-foreground">
            Admin access requires a Supabase profile with role set to admin.
          </p>
        </form>
      </section>
    </>
  );
}
