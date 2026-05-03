export const maxDuration = 30

export async function POST(req: Request) {
  try {
    const formData = await req.formData()
    const file = formData.get("file") as File | null

    if (!file) {
      return Response.json({ error: "No file provided" }, { status: 400 })
    }

    if (file.type !== "application/pdf") {
      return Response.json({ error: "File must be a PDF" }, { status: 400 })
    }

    // Max 5MB
    if (file.size > 5 * 1024 * 1024) {
      return Response.json({ error: "File must be less than 5MB" }, { status: 400 })
    }

    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    // Dynamic import to handle CJS/ESM compatibility
    const pdfParseModule = await import("pdf-parse")
    const pdf = pdfParseModule.default ?? pdfParseModule

    const data = await pdf(buffer)
    const text = String(data.text ?? "").trim()

    if (!text || text.length < 50) {
      return Response.json(
        { error: "Could not extract enough text from the PDF. Please try pasting your profile text instead." },
        { status: 400 }
      )
    }

    return Response.json({ text })
  } catch (error) {
    console.error("[v0] PDF parse error:", error)
    return Response.json(
      { error: "Failed to parse PDF. Please try pasting your profile text instead." },
      { status: 500 }
    )
  }
}
