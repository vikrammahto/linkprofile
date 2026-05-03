import { fetchLinkedInProfile } from "@/lib/proxycurl"
import { analyzeProfile } from "@/lib/ai/profile-analysis"
import { generateBannerConcept } from "@/lib/ai/banner"
import { fetchJobRecommendations } from "@/lib/jobs"

export const maxDuration = 60

export async function POST(req: Request) {
  try {
    const { url, rawText } = await req.json()

    if (!url && !rawText) {
      return Response.json({ error: "URL or text required" }, { status: 400 })
    }

    let profile: Record<string, unknown>

    if (rawText) {
      // Use raw text as profile data
      profile = { 
        raw: rawText, 
        summary: rawText,
        experience: rawText,
        skills: [],
        location: ""
      }
    } else {
      // Fetch from Proxycurl if API key is available
      if (!process.env.PROXYCURL_API_KEY) {
        // Return mock profile for demo/testing
        profile = getMockProfile(url)
      } else {
        try {
          profile = await fetchLinkedInProfile(url)
        } catch (error) {
          console.error("[v0] Proxycurl error:", error)
          // Fall back to mock profile
          profile = getMockProfile(url)
        }
      }
    }

    const [a, b, j] = await Promise.allSettled([
      analyzeProfile(profile),
      generateBannerConcept(profile),
      fetchJobRecommendations(profile),
    ])

    console.log("[v0] Analysis result:", a.status, a.status === "rejected" ? a.reason : "ok")
    console.log("[v0] Banner result:", b.status, b.status === "rejected" ? b.reason : "ok")
    console.log("[v0] Jobs result:", j.status, j.status === "rejected" ? j.reason : "ok")

    return Response.json({
      analysis: a.status === "fulfilled" ? a.value : null,
      banner: b.status === "fulfilled" ? b.value : null,
      jobs: j.status === "fulfilled" ? j.value : null,
    })
  } catch (error) {
    console.error("[v0] API route error:", error)
    return Response.json(
      { error: error instanceof Error ? error.message : "Something went wrong" },
      { status: 500 }
    )
  }
}

function getMockProfile(url: string): Record<string, unknown> {
  // Extract username from URL for personalization
  const username = url.split("/in/")[1]?.split("/")[0] ?? "user"
  
  return {
    full_name: username.replace(/-/g, " ").replace(/\b\w/g, c => c.toUpperCase()),
    headline: "Software Engineer | Full Stack Developer",
    summary: "Passionate software engineer with 5+ years of experience building web applications. Expertise in React, Node.js, and cloud technologies. Strong problem-solving skills and a track record of delivering high-quality solutions.",
    location: "San Francisco, CA",
    skills: ["JavaScript", "TypeScript", "React", "Node.js", "Python", "AWS", "Docker"],
    experience: [
      {
        title: "Senior Software Engineer",
        company: "Tech Company",
        duration: "2021 - Present",
        description: "Leading development of scalable web applications"
      },
      {
        title: "Software Engineer",
        company: "Startup Inc",
        duration: "2019 - 2021",
        description: "Built core product features and improved performance"
      }
    ],
    education: [
      {
        degree: "B.S. Computer Science",
        school: "University",
        year: "2019"
      }
    ]
  }
}
