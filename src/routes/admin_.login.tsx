import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { PageHero } from "@/components/site/PageHero";
import { Button } from "@/components/ui/button";
import { Lock } from "lucide-react";
import { toast } from "sonner";
import { hasAdminSession, isAdminCredentials, setAdminSession } from "@/lib/local-users-store";

export const Route = createFileRoute("/admin_/login")({
  head: () => ({
    meta: [{ title: "Admin Login | JZ Linen" }, { name: "robots", content: "noindex,nofollow" }],
  }),
  component: AdminLogin,
});

function AdminLogin() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    if (hasAdminSession()) {
      navigate({ to: "/admin" });
    }
  }, [navigate]);

  return (
    <>
      <PageHero eyebrow="Admin" title="Sign in" sub="Enter your admin credentials to continue." />
      <section className="container-page py-16">
        <form
          className="mx-auto max-w-sm rounded-2xl border border-border bg-card p-6 shadow-card"
          onSubmit={(e) => {
            e.preventDefault();
            if (isAdminCredentials(username, password)) {
              setAdminSession();
              toast.success("Welcome back");
              navigate({ to: "/admin" });
            } else {
              toast.error("Invalid credentials");
            }
          }}
        >
          <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-primary-glow text-primary-foreground">
            <Lock className="h-5 w-5" />
          </div>
          <label className="mb-1.5 block text-sm font-medium">Username</label>
          <input
            type="text"
            autoComplete="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="h-11 w-full rounded-md border border-input bg-background px-3.5 text-sm outline-none focus:ring-2 focus:ring-ring"
          />
          <label className="mb-1.5 mt-4 block text-sm font-medium">Password</label>
          <input
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="h-11 w-full rounded-md border border-input bg-background px-3.5 text-sm outline-none focus:ring-2 focus:ring-ring"
          />
          <Button type="submit" variant="hero" size="lg" className="mt-5 w-full">
            Sign in
          </Button>
          <p className="mt-3 text-xs text-muted-foreground">
            Local-only gate — sets an isAdmin flag in this browser.
          </p>
        </form>
      </section>
    </>
  );
}
