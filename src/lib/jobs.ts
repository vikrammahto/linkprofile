import Anthropic from "@anthropic-ai/sdk"
import type { JobMatch } from "@/types/analysis"

const anthropic = new Anthropic()

interface JSearchJob {
  job_title: string
  employer_name: string
  job_apply_link: string
  job_city: string
  job_country: string
  job_description: string
}

export async function fetchJobRecommendations(
  profileData: Record<string, unknown>
): Promise<JobMatch[]> {
  // Step 1: Extract skills and location
  const skillsArray = profileData.skills as string[] | undefined
  const skills = skillsArray?.slice(0, 3) ?? []
  const location = (profileData.location as string) ?? ""
  const query = skills.length > 0 ? skills.join(" ") : "software engineer"

  // Step 2: Fetch jobs from JSearch API
  const searchParams = new URLSearchParams({
    query,
    location,
    num_pages: "1",
  })

  const response = await fetch(
    `https://jsearch.p.rapidapi.com/search?${searchParams.toString()}`,
    {
      headers: {
        "X-RapidAPI-Key": process.env.JSEARCH_API_KEY ?? "",
        "X-RapidAPI-Host": "jsearch.p.rapidapi.com",
      },
    }
  )

  if (!response.ok) {
    throw new Error("JSearch API error: " + response.status)
  }

  const data = await response.json()
  const jobs: JSearchJob[] = (data.data ?? []).slice(0, 8)

  if (jobs.length === 0) {
    return []
  }

  // Step 3: Score jobs with Claude
  const jobsForScoring = jobs.map((job) => ({
    job_title: job.job_title,
    employer_name: job.employer_name,
    job_description: job.job_description?.slice(0, 300) ?? "",
  }))

  const message = await anthropic.messages.create({
    model: "claude-opus-4-5",
    max_tokens: 1000,
    messages: [
      {
        role: "user",
        content: `Score these job listings against this profile.
Return ONLY a JSON array with one object per job in the same order:
[{ "matchScore": "number 0-100", "matchReason": "string max 15 words" }]
Profile: ${JSON.stringify(profileData)}
Jobs: ${JSON.stringify(jobsForScoring)}`,
      },
    ],
  })

  const textContent = message.content.find((block) => block.type === "text")
  if (!textContent || textContent.type !== "text") {
    throw new Error("No text response from Claude")
  }

  let scores: { matchScore: number; matchReason: string }[]
  try {
    scores = JSON.parse(textContent.text)
  } catch {
    throw new Error("Failed to parse job scores JSON: " + textContent.text)
  }

  // Step 4: Merge scores into jobs
  return jobs.map((job, index) => ({
    job_title: job.job_title,
    employer_name: job.employer_name,
    job_apply_link: job.job_apply_link,
    job_city: job.job_city,
    job_country: job.job_country,
    matchScore: scores[index]?.matchScore ?? 0,
    matchReason: scores[index]?.matchReason ?? "",
  }))
}
