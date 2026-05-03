import { fetchLinkedInProfile } from "@/lib/proxycurl"
import { analyzeProfile } from "@/lib/ai/profile-analysis"
import { generateBannerConcept } from "@/lib/ai/banner"
import { fetchJobRecommendations } from "@/lib/jobs"

export const maxDuration = 60

export async function POST(req: Request) {
  const { url, rawText } = await req.json()

  if (!url && !rawText) {
    return Response.json({ error: "URL or text required" }, { status: 400 })
  }

  const profile = url
    ? await fetchLinkedInProfile(url)
    : { raw: rawText, experience: rawText }

  const [a, b, j] = await Promise.allSettled([
    analyzeProfile(profile),
    generateBannerConcept(profile),
    fetchJobRecommendations(profile),
  ])

  return Response.json({
    analysis: a.status === "fulfilled" ? a.value : null,
    banner: b.status === "fulfilled" ? b.value : null,
    jobs: j.status === "fulfilled" ? j.value : null,
  })
}
