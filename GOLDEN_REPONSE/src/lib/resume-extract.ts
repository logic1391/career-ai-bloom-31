// Browser-side resume text extraction (PDF + DOCX).
export async function extractResumeText(file: File): Promise<string> {
  const ext = file.name.split(".").pop()?.toLowerCase();
  if (ext === "pdf") {
    const pdfjs: any = await import("pdfjs-dist");
    const worker: any = await import("pdfjs-dist/build/pdf.worker.min.mjs?url");
    pdfjs.GlobalWorkerOptions.workerSrc = worker.default;
    const buf = await file.arrayBuffer();
    const doc = await pdfjs.getDocument({ data: buf }).promise;
    let text = "";
    for (let i = 1; i <= doc.numPages; i++) {
      const page = await doc.getPage(i);
      const content = await page.getTextContent();
      text += content.items.map((it: any) => it.str).join(" ") + "\n";
    }
    return text.trim();
  }
  if (ext === "docx") {
    const mammoth: any = await import("mammoth/mammoth.browser" as any);
    const buf = await file.arrayBuffer();
    const res = await mammoth.extractRawText({ arrayBuffer: buf });
    return res.value.trim();
  }
  throw new Error("Unsupported file. Please upload a PDF or DOCX.");
}