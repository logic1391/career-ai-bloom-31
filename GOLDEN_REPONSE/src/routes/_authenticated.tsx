import { createFileRoute, Outlet, useNavigate, Link, useRouterState } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { LogOut, Sparkles } from "lucide-react";

export const Route = createFileRoute("/_authenticated")({
  component: AuthLayout,
});

function AuthLayout() {
  const navigate = useNavigate();
  const [checked, setChecked] = useState(false);
  const [email, setEmail] = useState<string | null>(null);
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (!data.session) navigate({ to: "/login" });
      else { setEmail(data.session.user.email ?? null); setChecked(true); }
    });
  }, [navigate]);

  if (!checked) return <div className="min-h-screen grid place-items-center text-muted-foreground">Loading…</div>;

  const signOut = async () => { await supabase.auth.signOut(); navigate({ to: "/" }); };

  const links = [
    { to: "/dashboard", label: "Dashboard" },
    { to: "/analyze", label: "ATS Analyzer" },
    { to: "/interview", label: "Interview Prep" },
  ];

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link to="/dashboard" className="font-display text-xl font-extrabold flex items-center gap-2">
            <span className="size-8 rounded-lg bg-gradient-emerald text-gold grid place-items-center">P</span>
            Prestige
          </Link>
          <nav className="hidden md:flex items-center gap-1">
            {links.map((l) => (
              <Link key={l.to} to={l.to} className={`px-3 py-2 rounded-md text-sm font-medium transition ${pathname === l.to ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground hover:bg-muted"}`}>
                {l.label}
              </Link>
            ))}
          </nav>
          <div className="flex items-center gap-3">
            <span className="text-xs text-muted-foreground hidden sm:inline">{email}</span>
            <Button variant="ghost" size="sm" onClick={signOut}><LogOut className="size-4" /></Button>
          </div>
        </div>
      </header>
      <main className="max-w-7xl mx-auto px-6 py-10"><Outlet /></main>
    </div>
  );
}