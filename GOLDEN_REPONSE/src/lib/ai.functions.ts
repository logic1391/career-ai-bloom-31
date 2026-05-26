import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

const GATEWAY = "https://ai.gateway.lovable.dev/v1/chat/completions";
const MODEL = "google/gemini-3-flash-preview";

async function callAI(body: unknown) {
  const key = process.env.LOVABLE_API_KEY;
  if (!key) throw new Error("LOVABLE_API_KEY missing");
  const res = await fetch(GATEWAY, {
    method: "POST",
    headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    if (res.status === 429) throw new Error("Rate limit exceeded. Try again shortly.");
    if (res.status === 402) throw new Error("AI credits exhausted. Add credits in Workspace settings.");
    throw new Error(`AI gateway error: ${res.status}`);
  }
  return res.json();
}

function extractTool<T = any>(json: any): T {
  const tc = json.choices?.[0]?.message?.tool_calls?.[0];
  if (!tc) throw new Error("No structured response from AI");
  return JSON.parse(tc.function.arguments);
}

/* ---------- Parse resume ---------- */
export const parseResume = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d) => z.object({ text: z.string().min(20).max(50000) }).parse(d))
  .handler(async ({ data }): Promise<any> => {
    const json = await callAI({
      model: MODEL,
      messages: [
        { role: "system", content: "Extract structured candidate data from raw resume text. Be accurate; leave fields empty if unsure." },
        { role: "user", content: data.text.slice(0, 30000) },
      ],
      tools: [{
        type: "function",
        function: {
          name: "store_resume",
          parameters: {
            type: "object",
            properties: {
              name: { type: "string" },
              email: { type: "string" },
              phone: { type: "string" },
              headline: { type: "string" },
              summary: { type: "string" },
              skills: { type: "array", items: { type: "string" } },
              experience: { type: "array", items: { type: "object", properties: { role: { type: "string" }, company: { type: "string" }, period: { type: "string" }, description: { type: "string" } } } },
              education: { type: "array", items: { type: "object", properties: { degree: { type: "string" }, school: { type: "string" }, period: { type: "string" } } } },
              certifications: { type: "array", items: { type: "string" } },
              projects: { type: "array", items: { type: "object", properties: { name: { type: "string" }, description: { type: "string" } } } },
            },
            required: ["skills"],
          },
        },
      }],
      tool_choice: { type: "function", function: { name: "store_resume" } },
    });
    return extractTool(json);
  });

/* ---------- ATS analysis ---------- */
export const analyzeATS = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d) => z.object({
    resumeText: z.string().min(20).max(50000),
    jobTitle: z.string().max(200).optional(),
    jobDescription: z.string().min(20).max(20000),
  }).parse(d))
  .handler(async ({ data }): Promise<any> => {
    const json = await callAI({
      model: MODEL,
      messages: [
        { role: "system", content: "You are an expert ATS resume reviewer. Compare a resume against a job description and return structured scoring (0-100) using semantic matching, not naive keyword stuffing. Be honest and actionable." },
        { role: "user", content: `JOB TITLE: ${data.jobTitle ?? "(unspecified)"}\n\nJOB DESCRIPTION:\n${data.jobDescription}\n\nRESUME:\n${data.resumeText.slice(0, 25000)}` },
      ],
      tools: [{
        type: "function",
        function: {
          name: "store_analysis",
          parameters: {
            type: "object",
            properties: {
              overall_score: { type: "integer", minimum: 0, maximum: 100 },
              keyword_score: { type: "integer", minimum: 0, maximum: 100 },
              skills_score: { type: "integer", minimum: 0, maximum: 100 },
              experience_score: { type: "integer", minimum: 0, maximum: 100 },
              semantic_score: { type: "integer", minimum: 0, maximum: 100 },
              matched_keywords: { type: "array", items: { type: "string" } },
              missing_keywords: { type: "array", items: { type: "string" } },
              strengths: { type: "array", items: { type: "string" } },
              improvements: { type: "array", items: { type: "string" } },
              recommended_skills: { type: "array", items: { type: "string" } },
            },
            required: ["overall_score","keyword_score","skills_score","experience_score","semantic_score","matched_keywords","missing_keywords","strengths","improvements","recommended_skills"],
          },
        },
      }],
      tool_choice: { type: "function", function: { name: "store_analysis" } },
    });
    return extractTool(json);
  });

/* ---------- Interview questions ---------- */
export const generateInterview = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d) => z.object({
    resumeText: z.string().min(20).max(50000),
    jobTitle: z.string().max(200),
    jobDescription: z.string().max(20000).optional(),
    difficulty: z.enum(["junior","mid","senior"]),
  }).parse(d))
  .handler(async ({ data }): Promise<{ questions: Array<{ category: string; question: string; sample_answer: string; tip: string }> }> => {
    const json = await callAI({
      model: MODEL,
      messages: [
        { role: "system", content: "Generate a personalized interview prep set: technical, behavioral, project-based, and HR questions tailored to the candidate's resume and target role. Provide a strong sample answer and improvement tip for each." },
        { role: "user", content: `TARGET ROLE: ${data.jobTitle} (${data.difficulty})\n\nJOB CONTEXT:\n${data.jobDescription ?? "n/a"}\n\nRESUME:\n${data.resumeText.slice(0, 20000)}` },
      ],
      tools: [{
        type: "function",
        function: {
          name: "store_interview",
          parameters: {
            type: "object",
            properties: {
              questions: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    category: { type: "string", enum: ["technical","behavioral","project","hr"] },
                    question: { type: "string" },
                    sample_answer: { type: "string" },
                    tip: { type: "string" },
                  },
                  required: ["category","question","sample_answer","tip"],
                },
              },
            },
            required: ["questions"],
          },
        },
      }],
      tool_choice: { type: "function", function: { name: "store_interview" } },
    });
    return extractTool(json);
  });