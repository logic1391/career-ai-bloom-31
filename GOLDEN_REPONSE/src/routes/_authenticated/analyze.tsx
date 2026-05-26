import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { useServerFn } from "@tanstack/react-start";
import { analyzeATS } from "@/lib/ai.functions";
import { toast } from "sonner";
import { CheckCircle2, XCircle, Lightbulb } from "lucide-react";

export const Route = createFileRoute("/_authenticated/analyze")({
  validateSearch: (s: Record<string, unknown>) => ({ resumeId: (s.resumeId as string) ?? "" }),
  component: Analyze,
});

function Analyze() {
  const { resumeId } = Route.useSearch();
  const [resumes, setResumes] = useState<any[]>([]);
  const [selected, setSelected] = useState(resumeId);
  const [jobTitle, setJobTitle] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const run = useServerFn(analyzeATS);

  useEffect(() => {
    supabase.from("resumes").select("*").order("created_at", { ascending: false }).then(({ data }) => {
      setResumes(data ?? []);
      if (!selected && data?.[0]) setSelected(data[0].id);
    });
  }, []);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const resume = resumes.find((r) => r.id === selected);
    if (!resume) return toast.error("Select a resume");
    setLoading(true); setResult(null);
    try {
      const r = await run({ data: { resumeText: resume.raw_text, jobTitle, jobDescription } });
      setResult(r);
      const { data: { user } } = await supabase.auth.getUser();
      await supabase.from("analyses").insert({
        user_id: user!.id, resume_id: resume.id, job_title: jobTitle, job_description: jobDescription,
        overall_score: r.overall_score, keyword_score: r.keyword_score, skills_score: r.skills_score,
        experience_score: r.experience_score, semantic_score: r.semantic_score,
        matched_keywords: r.matched_keywords, missing_keywords: r.missing_keywords,
        strengths: r.strengths, improvements: r.improvements, recommended_skills: r.recommended_skills,
      });
      toast.success("Analysis complete");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Analysis failed");
    } finally { setLoading(false); }
  };

  return (
    <div className="grid lg:grid-cols-[400px_1fr] gap-8">
      <Card className="p-6 h-fit">
        <h2 className="font-display text-2xl font-extrabold">ATS Analyzer</h2>
        <p className="text-sm text-muted-foreground mt-1">Score your resume against any job.</p>
        <form onSubmit={submit} className="mt-6 space-y-4">
          <div>
            <Label>Resume</Label>
            <select value={selected} onChange={(e) => setSelected(e.target.value)} className="mt-1.5 w-full h-10 rounded-md border border-input bg-background px-3 text-sm">
              <option value="">Select a resume</option>
              {resumes.map((r) => <option key={r.id} value={r.id}>{r.file_name}</option>)}
            </select>
          </div>
          <div>
            <Label htmlFor="jt">Job title</Label>
            <Input id="jt" value={jobTitle} onChange={(e) => setJobTitle(e.target.value)} placeholder="Senior Frontend Engineer" className="mt-1.5" />
          </div>
          <div>
            <Label htmlFor="jd">Job description</Label>
            <Textarea id="jd" required value={jobDescription} onChange={(e) => setJobDescription(e.target.value)} rows={10} placeholder="Paste the full job description…" className="mt-1.5" />
          </div>
          <Button type="submit" disabled={loading || !selected} className="w-full bg-primary text-primary-foreground hover:bg-accent">
            {loading ? "Analyzing…" : "Run ATS analysis"}
          </Button>
        </form>
      </Card>

      <div>
        {!result && !loading && (
          <Card className="p-12 text-center text-muted-foreground">Run an analysis to see results here.</Card>
        )}
        {loading && <Card className="p-12 text-center text-muted-foreground">AI is reviewing your resume…</Card>}
        {result && (
          <div className="space-y-6">
            <Card className="p-8 bg-gradient-emerald text-primary-foreground">
              <div className="text-sm uppercase tracking-wider text-primary-foreground/70">Overall ATS score</div>
              <div className="font-display text-7xl font-extrabold text-gold mt-2">{result.overall_score}</div>
              <Progress value={result.overall_score} className="mt-4 bg-white/10" />
            </Card>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                ["Keywords", result.keyword_score], ["Skills", result.skills_score],
                ["Experience", result.experience_score], ["Semantic", result.semantic_score],
              ].map(([k, v]) => (
                <Card key={k as string} className="p-5">
                  <div className="text-xs text-muted-foreground">{k}</div>
                  <div className="font-display text-3xl font-extrabold mt-1">{v as number}</div>
                  <Progress value={v as number} className="mt-2 h-1.5" />
                </Card>
              ))}
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <Card className="p-6">
                <h3 className="font-display font-bold flex items-center gap-2 mb-3"><CheckCircle2 className="size-4 text-accent" />Strengths</h3>
                <ul className="space-y-2 text-sm">{result.strengths.map((s: string, i: number) => <li key={i} className="text-muted-foreground">• {s}</li>)}</ul>
              </Card>
              <Card className="p-6">
                <h3 className="font-display font-bold flex items-center gap-2 mb-3"><Lightbulb className="size-4 text-gold" />Improvements</h3>
                <ul className="space-y-2 text-sm">{result.improvements.map((s: string, i: number) => <li key={i} className="text-muted-foreground">• {s}</li>)}</ul>
              </Card>
              <Card className="p-6">
                <h3 className="font-display font-bold mb-3">Matched keywords</h3>
                <div className="flex flex-wrap gap-1.5">{result.matched_keywords.map((k: string) => <span key={k} className="text-xs px-2 py-1 rounded-full bg-accent/10 text-accent">{k}</span>)}</div>
              </Card>
              <Card className="p-6">
                <h3 className="font-display font-bold flex items-center gap-2 mb-3"><XCircle className="size-4 text-destructive" />Missing keywords</h3>
                <div className="flex flex-wrap gap-1.5">{result.missing_keywords.map((k: string) => <span key={k} className="text-xs px-2 py-1 rounded-full bg-destructive/10 text-destructive">{k}</span>)}</div>
              </Card>
              <Card className="p-6 md:col-span-2">
                <h3 className="font-display font-bold mb-3">Recommended skills to add</h3>
                <div className="flex flex-wrap gap-1.5">{result.recommended_skills.map((k: string) => <span key={k} className="text-xs px-2 py-1 rounded-full bg-gold/15 text-foreground">{k}</span>)}</div>
              </Card>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}