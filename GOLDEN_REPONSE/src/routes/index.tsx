import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, FileSearch, Sparkles, Target, MessageSquare, TrendingUp, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Prestige — AI Resume Analyzer & Interview Coach" },
      { name: "description", content: "Score your resume against any job description, surface missing keywords, and generate tailored interview questions in seconds." },
    ],
  }),
  component: Landing,
});

function Landing() {
  return (
    <div className="min-h-screen bg-background">
      <Nav />
      <Hero />
      <Features />
      <Workflow />
      <CTA />
      <Footer />
    </div>
  );
}

function Nav() {
  return (
    <header className="sticky top-0 z-40 backdrop-blur-md bg-background/70 border-b border-border/60">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 font-display text-xl font-extrabold tracking-tight">
          <span className="size-8 rounded-lg bg-gradient-emerald grid place-items-center text-gold shadow-prestige">P</span>
          Prestige
        </Link>
        <nav className="hidden md:flex items-center gap-8 text-sm text-muted-foreground">
          <a href="#features" className="hover:text-foreground transition">Features</a>
          <a href="#workflow" className="hover:text-foreground transition">How it works</a>
        </nav>
        <div className="flex items-center gap-2">
          <Link to="/login"><Button variant="ghost" size="sm">Sign in</Button></Link>
          <Link to="/login"><Button size="sm" className="bg-primary text-primary-foreground hover:bg-accent">Get started</Button></Link>
        </div>
      </div>
    </header>
  );
}

function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 -z-10 bg-gradient-emerald opacity-[0.04]" />
      <div className="max-w-7xl mx-auto px-6 pt-24 pb-20 text-center">
        <div className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1 text-xs font-medium text-muted-foreground shadow-soft">
          <Sparkles className="size-3.5 text-gold" />
          AI-powered career intelligence
        </div>
        <h1 className="mt-8 font-display text-5xl sm:text-7xl font-extrabold tracking-tight max-w-4xl mx-auto leading-[1.05]">
          Make every resume <span className="text-gold">interview-ready</span>.
        </h1>
        <p className="mt-6 text-lg text-muted-foreground max-w-2xl mx-auto">
          Upload your resume, paste a job description, and get an ATS score, missing-keyword report,
          and a personalized interview question bank — in under a minute.
        </p>
        <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
          <Link to="/login">
            <Button size="lg" className="bg-primary text-primary-foreground hover:bg-accent h-12 px-6 text-base">
              Analyze my resume <ArrowRight className="ml-2 size-4" />
            </Button>
          </Link>
          <a href="#features">
            <Button size="lg" variant="outline" className="h-12 px-6 text-base">See how it works</Button>
          </a>
        </div>

        <div className="mt-20 mx-auto max-w-5xl rounded-3xl border border-border bg-card shadow-prestige overflow-hidden">
          <div className="grid md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-border">
            <Stat label="Avg ATS uplift" value="+34%" />
            <Stat label="Interview Qs / minute" value="20+" />
            <Stat label="Resumes parsed" value="PDF · DOCX" />
          </div>
        </div>
      </div>
    </section>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="p-8 text-left">
      <div className="font-display text-3xl font-extrabold text-foreground">{value}</div>
      <div className="mt-1 text-sm text-muted-foreground">{label}</div>
    </div>
  );
}

const FEATURES = [
  { icon: FileSearch, title: "Smart resume parsing", body: "Extract skills, experience, education and projects from PDF or DOCX with AI structured output." },
  { icon: Target, title: "ATS score vs job", body: "Semantic match against any job description with keyword, skill, and experience subscores." },
  { icon: MessageSquare, title: "Tailored interview prep", body: "Technical, behavioral and project questions generated from your resume and target role." },
  { icon: TrendingUp, title: "Skill gap roadmap", body: "Actionable recommendations: certifications, courses, projects and quick wins." },
  { icon: ShieldCheck, title: "Private & secure", body: "Your resumes are stored privately with row-level security. You own your data." },
  { icon: Sparkles, title: "Real-time AI insights", body: "Streaming AI feedback the moment your resume is uploaded." },
];

function Features() {
  return (
    <section id="features" className="py-24 border-t border-border/60">
      <div className="max-w-7xl mx-auto px-6">
        <div className="max-w-2xl">
          <h2 className="font-display text-4xl font-extrabold tracking-tight">Built for candidates who refuse to be filtered out.</h2>
          <p className="mt-4 text-muted-foreground text-lg">Every feature designed around one outcome: more interviews, faster.</p>
        </div>
        <div className="mt-12 grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {FEATURES.map((f) => (
            <div key={f.title} className="group relative rounded-2xl border border-border bg-card p-6 shadow-soft hover:shadow-prestige transition">
              <div className="size-10 rounded-xl bg-primary/5 grid place-items-center text-primary mb-4 group-hover:bg-primary group-hover:text-primary-foreground transition">
                <f.icon className="size-5" />
              </div>
              <h3 className="font-display text-lg font-bold">{f.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{f.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Workflow() {
  const steps = [
    { n: "01", t: "Upload", d: "Drag-and-drop a PDF or DOCX resume." },
    { n: "02", t: "Paste the job", d: "Drop in any job description you're targeting." },
    { n: "03", t: "Get scored", d: "ATS subscores, missing keywords, and actionable fixes." },
    { n: "04", t: "Prepare", d: "Generate a personalized interview question bank instantly." },
  ];
  return (
    <section id="workflow" className="py-24 bg-gradient-emerald text-primary-foreground">
      <div className="max-w-7xl mx-auto px-6">
        <h2 className="font-display text-4xl font-extrabold tracking-tight max-w-2xl">From upload to offer-ready in four steps.</h2>
        <div className="mt-12 grid md:grid-cols-4 gap-6">
          {steps.map((s) => (
            <div key={s.n} className="rounded-2xl bg-white/5 border border-white/10 p-6 backdrop-blur">
              <div className="text-gold font-display font-extrabold text-2xl">{s.n}</div>
              <h3 className="mt-3 font-display text-xl font-bold">{s.t}</h3>
              <p className="mt-1 text-sm text-primary-foreground/70">{s.d}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function CTA() {
  return (
    <section className="py-24">
      <div className="max-w-4xl mx-auto px-6 text-center">
        <h2 className="font-display text-5xl font-extrabold tracking-tight">Your next interview starts here.</h2>
        <p className="mt-4 text-lg text-muted-foreground">Free to try. No credit card required.</p>
        <Link to="/login" className="inline-block mt-8">
          <Button size="lg" className="bg-primary text-primary-foreground hover:bg-accent h-12 px-8 text-base">
            Get started for free <ArrowRight className="ml-2 size-4" />
          </Button>
        </Link>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="border-t border-border/60 py-10">
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between text-sm text-muted-foreground">
        <div>© {new Date().getFullYear()} Prestige</div>
        <div className="font-display font-semibold text-foreground">Career intelligence, distilled.</div>
      </div>
    </footer>
  );
}
