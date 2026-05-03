import { generateText, Output } from "ai"
import { z } from "zod"
import type { JobMatch } from "@/types/analysis"

const jobScoresSchema = z.array(z.object({
  matchScore: z.number().min(0).max(100),
  matchReason: z.string(),
}))

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

  // Step 3: Score jobs with AI
  const jobsForScoring = jobs.map((job) => ({
    job_title: job.job_title,
    employer_name: job.employer_name,
    job_description: job.job_description?.slice(0, 300) ?? "",
  }))

  const result = await generateText({
    model: "anthropic/claude-sonnet-4",
    messages: [
      {
        role: "user",
        content: `Score these job listings against this profile. Return one score per job in the same order.
Profile: ${JSON.stringify(profileData)}
Jobs: ${JSON.stringify(jobsForScoring)}`,
      },
    ],
    output: Output.object({ schema: jobScoresSchema }),
  })

  if (!result.object) {
    throw new Error("Failed to generate job scores")
  }

  const scores = result.object

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
