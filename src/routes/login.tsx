import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { z } from "zod";
import { toast } from "sonner";
import { Lock, UserPlus } from "lucide-react";
import { PageHero } from "@/components/site/PageHero";
import { Button } from "@/components/ui/button";
import {
  authenticateUser,
  createUser,
  isAdminCredentials,
  setAdminSession,
} from "@/lib/local-users-store";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Login or Sign Up | JZ Linen" },
      { name: "robots", content: "noindex,nofollow" },
    ],
  }),
  component: Login,
});

const loginSchema = z.object({
  identifier: z.string().trim().min(1, "Email or username required").max(255),
  password: z.string().min(1, "Password required").max(120),
});

const signupSchema = z.object({
  name: z.string().trim().min(2, "Name required").max(80),
  email: z.string().trim().email("Invalid email").max(255),
  phone: z.string().trim().min(7, "Phone required").max(20),
  password: z.string().min(6, "Password must be at least 6 characters").max(120),
});

function Login() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [loading, setLoading] = useState(false);

  return (
    <>
      <PageHero
        eyebrow="Account"
        title="Login or sign up."
        sub="Admin and customer accounts are stored locally in this browser."
      />
      <section className="container-page py-16">
        <div className="mx-auto max-w-md rounded-2xl border border-border bg-card p-6 shadow-card md:p-8">
          <div className="mb-5 grid grid-cols-2 gap-2 rounded-lg bg-muted p-1">
            <button
              type="button"
              onClick={() => setMode("login")}
              className={`h-10 rounded-md text-sm font-medium transition-colors ${mode === "login" ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"}`}
            >
              Login
            </button>
            <button
              type="button"
              onClick={() => setMode("signup")}
              className={`h-10 rounded-md text-sm font-medium transition-colors ${mode === "signup" ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"}`}
            >
              Sign Up
            </button>
          </div>

          <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-primary-glow text-primary-foreground">
            {mode === "login" ? <Lock className="h-5 w-5" /> : <UserPlus className="h-5 w-5" />}
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              setLoading(true);
              const form = e.currentTarget;
              const data = Object.fromEntries(new FormData(form));

              try {
                if (mode === "login") {
                  const parsed = loginSchema.safeParse(data);
                  if (!parsed.success) {
                    toast.error(parsed.error.issues[0].message);
                    return;
                  }

                  if (isAdminCredentials(parsed.data.identifier, parsed.data.password)) {
                    setAdminSession();
                    toast.success("Admin login successful");
                    navigate({ to: "/admin" });
                    return;
                  }

                  const user = authenticateUser(parsed.data.identifier, parsed.data.password);
                  if (!user) {
                    toast.error("No matching local user found");
                    return;
                  }

                  toast.success(`Welcome back, ${user.name}`);
                  navigate({ to: "/" });
                  return;
                }

                const parsed = signupSchema.safeParse(data);
                if (!parsed.success) {
                  toast.error(parsed.error.issues[0].message);
                  return;
                }

                createUser(parsed.data);
                toast.success("Account created and saved locally");
                form.reset();
                setMode("login");
              } catch (err) {
                const message =
                  err instanceof Error ? err.message : "Could not save account locally";
                toast.error(message);
              } finally {
                setLoading(false);
              }
            }}
          >
            {mode === "login" ? (
              <>
                <Field name="identifier" label="Email or admin username" autoComplete="username" />
                <Field
                  name="password"
                  label="Password"
                  type="password"
                  autoComplete="current-password"
                />
                <Button
                  type="submit"
                  variant="hero"
                  size="lg"
                  className="mt-5 w-full"
                  disabled={loading}
                >
                  {loading ? "Checking..." : "Login"}
                </Button>
              </>
            ) : (
              <>
                <Field name="name" label="Full name" autoComplete="name" />
                <Field name="email" label="Email" type="email" autoComplete="email" />
                <Field name="phone" label="Phone" type="tel" autoComplete="tel" />
                <Field
                  name="password"
                  label="Password"
                  type="password"
                  autoComplete="new-password"
                />
                <Button
                  type="submit"
                  variant="hero"
                  size="lg"
                  className="mt-5 w-full"
                  disabled={loading}
                >
                  {loading ? "Saving..." : "Create account"}
                </Button>
              </>
            )}
          </form>

          <p className="mt-3 text-xs text-muted-foreground">
            Local-only account data is visible to Admin on this browser.
          </p>
        </div>
      </section>
    </>
  );
}

function Field({
  name,
  label,
  type = "text",
  autoComplete,
}: {
  name: string;
  label: string;
  type?: string;
  autoComplete?: string;
}) {
  return (
    <div className="mt-4">
      <label htmlFor={name} className="mb-1.5 block text-sm font-medium">
        {label}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        required
        autoComplete={autoComplete}
        maxLength={255}
        className="h-11 w-full rounded-md border border-input bg-background px-3.5 text-sm outline-none focus:ring-2 focus:ring-ring"
      />
    </div>
  );
}
