import { analyzeProfile } from "@/lib/ai/profile-analysis"
import { generateBannerConcept } from "@/lib/ai/banner"
import { fetchJobRecommendations } from "@/lib/jobs"

export const maxDuration = 60

export async function POST(req: Request) {
  try {
    const { rawText } = await req.json()

    if (!rawText || rawText.trim().length < 50) {
      return Response.json({ error: "Please provide at least 50 characters of profile text" }, { status: 400 })
    }

    // Parse the raw text into a structured profile object
    const profile = parseProfileText(rawText)

    console.log("[v0] Starting AI analysis with profile:", JSON.stringify(profile).slice(0, 200))

    const [a, b, j] = await Promise.allSettled([
      analyzeProfile(profile),
      generateBannerConcept(profile),
      fetchJobRecommendations(profile),
    ])

    console.log("[v0] Analysis result:", a.status, a.status === "rejected" ? String(a.reason) : "success")
    console.log("[v0] Banner result:", b.status, b.status === "rejected" ? String(b.reason) : "success")
    console.log("[v0] Jobs result:", j.status, j.status === "rejected" ? String(j.reason) : "success")

    return Response.json({
      analysis: a.status === "fulfilled" ? a.value : null,
      banner: b.status === "fulfilled" ? b.value : null,
      jobs: j.status === "fulfilled" ? j.value : null,
      errors: {
        analysis: a.status === "rejected" ? String(a.reason) : null,
        banner: b.status === "rejected" ? String(b.reason) : null,
        jobs: j.status === "rejected" ? String(j.reason) : null,
      }
    })
  } catch (error) {
    console.error("[v0] API route error:", error)
    return Response.json(
      { error: error instanceof Error ? error.message : "Something went wrong" },
      { status: 500 }
    )
  }
}

function parseProfileText(rawText: string): Record<string, unknown> {
  // Extract name from first line if it looks like a name
  const lines = rawText.trim().split("\n")
  const firstLine = lines[0]?.trim() ?? ""
  
  // Try to extract skills if mentioned
  const skillsMatch = rawText.match(/skills?[:\s]+([^\n]+)/i)
  const skills = skillsMatch 
    ? skillsMatch[1].split(/[,|]/).map(s => s.trim()).filter(Boolean)
    : []

  // Try to extract location
  const locationMatch = rawText.match(/(?:location|based in|from)[:\s]+([^\n]+)/i)
  const location = locationMatch ? locationMatch[1].trim() : ""

  return {
    full_name: firstLine.length < 50 ? firstLine : "Professional",
    raw: rawText,
    summary: rawText,
    experience: rawText,
    skills,
    location,
  }
}
