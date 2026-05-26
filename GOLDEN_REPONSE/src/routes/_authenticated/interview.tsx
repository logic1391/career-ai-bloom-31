import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { useServerFn } from "@tanstack/react-start";
import { generateInterview } from "@/lib/ai.functions";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/interview")({
  validateSearch: (s: Record<string, unknown>) => ({ resumeId: (s.resumeId as string) ?? "" }),
  component: Interview,
});

const CAT_COLORS: Record<string, string> = {
  technical: "bg-accent/10 text-accent",
  behavioral: "bg-gold/15 text-foreground",
  project: "bg-primary/10 text-primary",
  hr: "bg-secondary text-secondary-foreground",
};

function Interview() {
  const { resumeId } = Route.useSearch();
  const [resumes, setResumes] = useState<any[]>([]);
  const [selected, setSelected] = useState(resumeId);
  const [jobTitle, setJobTitle] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [difficulty, setDifficulty] = useState<"junior"|"mid"|"senior">("mid");
  const [loading, setLoading] = useState(false);
  const [questions, setQuestions] = useState<any[] | null>(null);
  const run = useServerFn(generateInterview);

  useEffect(() => {
    supabase.from("resumes").select("*").order("created_at", { ascending: false }).then(({ data }) => {
      setResumes(data ?? []);
      if (!selected && data?.[0]) setSelected(data[0].id);
    });
  }, []);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const resume = resumes.find((r) => r.id === selected);
    if (!resume || !jobTitle) return toast.error("Select resume and enter a target role");
    setLoading(true); setQuestions(null);
    try {
      const r = await run({ data: { resumeText: resume.raw_text, jobTitle, jobDescription, difficulty } });
      setQuestions(r.questions);
      const { data: { user } } = await supabase.auth.getUser();
      await supabase.from("interview_sessions").insert({
        user_id: user!.id, resume_id: resume.id, job_title: jobTitle, job_description: jobDescription, difficulty, questions: r.questions,
      });
      toast.success(`Generated ${r.questions.length} questions`);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Generation failed");
    } finally { setLoading(false); }
  };

  return (
    <div className="grid lg:grid-cols-[400px_1fr] gap-8">
      <Card className="p-6 h-fit">
        <h2 className="font-display text-2xl font-extrabold">Interview Prep</h2>
        <p className="text-sm text-muted-foreground mt-1">AI-tailored question bank.</p>
        <form onSubmit={submit} className="mt-6 space-y-4">
          <div>
            <Label>Resume</Label>
            <select value={selected} onChange={(e) => setSelected(e.target.value)} className="mt-1.5 w-full h-10 rounded-md border border-input bg-background px-3 text-sm">
              <option value="">Select a resume</option>
              {resumes.map((r) => <option key={r.id} value={r.id}>{r.file_name}</option>)}
            </select>
          </div>
          <div>
            <Label htmlFor="jt">Target role</Label>
            <Input id="jt" required value={jobTitle} onChange={(e) => setJobTitle(e.target.value)} placeholder="Senior Backend Engineer" className="mt-1.5" />
          </div>
          <div>
            <Label>Level</Label>
            <div className="mt-1.5 flex gap-2">
              {(["junior","mid","senior"] as const).map((d) => (
                <button key={d} type="button" onClick={() => setDifficulty(d)}
                  className={`flex-1 h-10 rounded-md text-sm font-medium capitalize border transition ${difficulty === d ? "bg-primary text-primary-foreground border-primary" : "border-input hover:bg-muted"}`}>
                  {d}
                </button>
              ))}
            </div>
          </div>
          <div>
            <Label htmlFor="jd">Job description (optional)</Label>
            <Textarea id="jd" value={jobDescription} onChange={(e) => setJobDescription(e.target.value)} rows={6} className="mt-1.5" />
          </div>
          <Button type="submit" disabled={loading} className="w-full bg-primary text-primary-foreground hover:bg-accent">
            {loading ? "Generating…" : "Generate questions"}
          </Button>
        </form>
      </Card>

      <div>
        {!questions && !loading && <Card className="p-12 text-center text-muted-foreground">Your tailored questions will appear here.</Card>}
        {loading && <Card className="p-12 text-center text-muted-foreground">Crafting personalized questions…</Card>}
        {questions && (
          <Card className="p-2">
            <Accordion type="single" collapsible>
              {questions.map((q, i) => (
                <AccordionItem key={i} value={`q${i}`}>
                  <AccordionTrigger className="px-4 hover:no-underline">
                    <div className="flex items-start gap-3 text-left">
                      <span className={`text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full font-semibold ${CAT_COLORS[q.category] ?? "bg-muted"}`}>{q.category}</span>
                      <span className="font-medium">{q.question}</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="px-4 space-y-3">
                    <div>
                      <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">Sample answer</div>
                      <p className="text-sm leading-relaxed">{q.sample_answer}</p>
                    </div>
                    <div className="rounded-md bg-gold/10 p-3">
                      <div className="text-xs font-semibold text-foreground uppercase tracking-wider mb-1">Tip</div>
                      <p className="text-sm leading-relaxed">{q.tip}</p>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </Card>
        )}
      </div>
    </div>
  );
}