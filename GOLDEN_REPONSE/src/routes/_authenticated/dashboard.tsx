import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Upload, FileText, Target, MessageSquare, Trash2 } from "lucide-react";
import { extractResumeText } from "@/lib/resume-extract";
import { useServerFn } from "@tanstack/react-start";
import { parseResume } from "@/lib/ai.functions";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/dashboard")({ component: Dashboard });

function Dashboard() {
  const [resumes, setResumes] = useState<any[]>([]);
  const [uploading, setUploading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const parseFn = useServerFn(parseResume);

  const load = async () => {
    const { data } = await supabase.from("resumes").select("*").order("created_at", { ascending: false });
    setResumes(data ?? []);
  };
  useEffect(() => { load(); }, []);

  const handleUpload = async (file: File) => {
    setUploading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not signed in");
      const text = await extractResumeText(file);
      if (text.length < 30) throw new Error("Couldn't extract enough text from file");

      const path = `${user.id}/${Date.now()}-${file.name}`;
      const { error: upErr } = await supabase.storage.from("resumes").upload(path, file);
      if (upErr) throw upErr;

      toast.info("Parsing resume with AI…");
      const parsed = await parseFn({ data: { text } });

      const { error: insErr } = await supabase.from("resumes").insert({
        user_id: user.id, file_name: file.name, file_path: path, mime_type: file.type, raw_text: text, parsed,
      });
      if (insErr) throw insErr;
      toast.success("Resume parsed and saved");
      load();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Upload failed");
    } finally { setUploading(false); }
  };

  const remove = async (r: any) => {
    await supabase.storage.from("resumes").remove([r.file_path]);
    await supabase.from("resumes").delete().eq("id", r.id);
    load();
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-4xl font-extrabold">Your career workspace</h1>
        <p className="text-muted-foreground mt-1">Upload a resume to get AI parsing, ATS scoring, and tailored interview prep.</p>
      </div>

      <Card
        className="p-10 border-2 border-dashed border-border bg-card hover:border-accent transition cursor-pointer text-center"
        onClick={() => inputRef.current?.click()}
        onDrop={(e) => { e.preventDefault(); const f = e.dataTransfer.files?.[0]; if (f) handleUpload(f); }}
        onDragOver={(e) => e.preventDefault()}
      >
        <Upload className="size-10 mx-auto text-accent" />
        <h3 className="mt-4 font-display text-xl font-bold">{uploading ? "Processing…" : "Drop your resume here"}</h3>
        <p className="text-sm text-muted-foreground mt-1">PDF or DOCX · up to 5MB</p>
        <input ref={inputRef} type="file" accept=".pdf,.docx" hidden onChange={(e) => { const f = e.target.files?.[0]; if (f) handleUpload(f); }} />
      </Card>

      {resumes.length > 0 && (
        <div>
          <h2 className="font-display text-xl font-bold mb-4">Your resumes</h2>
          <div className="grid md:grid-cols-2 gap-4">
            {resumes.map((r) => (
              <Card key={r.id} className="p-5 flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <div className="flex items-center gap-2"><FileText className="size-4 text-accent" /><span className="font-semibold truncate">{r.file_name}</span></div>
                  <div className="mt-1 text-xs text-muted-foreground">{new Date(r.created_at).toLocaleString()}</div>
                  {r.parsed?.skills && (
                    <div className="mt-3 flex flex-wrap gap-1.5">
                      {r.parsed.skills.slice(0, 6).map((s: string) => (
                        <span key={s} className="text-xs px-2 py-0.5 rounded-full bg-secondary text-secondary-foreground">{s}</span>
                      ))}
                    </div>
                  )}
                  <div className="mt-4 flex gap-2">
                    <Link to="/analyze" search={{ resumeId: r.id } as any}><Button size="sm" variant="outline"><Target className="size-3.5 mr-1" />ATS Score</Button></Link>
                    <Link to="/interview" search={{ resumeId: r.id } as any}><Button size="sm" variant="outline"><MessageSquare className="size-3.5 mr-1" />Interview</Button></Link>
                  </div>
                </div>
                <Button size="icon" variant="ghost" onClick={() => remove(r)}><Trash2 className="size-4" /></Button>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}