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

  let jobs: JSearchJob[] = []

  // Step 2: Fetch jobs from JSearch API (if key available)
  if (process.env.JSEARCH_API_KEY) {
    try {
      const searchParams = new URLSearchParams({
        query,
        location,
        num_pages: "1",
      })

      const response = await fetch(
        `https://jsearch.p.rapidapi.com/search?${searchParams.toString()}`,
        {
          headers: {
            "X-RapidAPI-Key": process.env.JSEARCH_API_KEY,
            "X-RapidAPI-Host": "jsearch.p.rapidapi.com",
          },
        }
      )

      if (response.ok) {
        const data = await response.json()
        jobs = (data.data ?? []).slice(0, 8)
      }
    } catch (error) {
      console.error("[v0] JSearch API error:", error)
    }
  }

  // Use mock jobs if no real jobs found
  if (jobs.length === 0) {
    jobs = getMockJobs(query)
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

function getMockJobs(query: string): JSearchJob[] {
  return [
    {
      job_title: "Senior Software Engineer",
      employer_name: "Google",
      job_apply_link: "https://careers.google.com",
      job_city: "San Francisco",
      job_country: "USA",
      job_description: `We are looking for a ${query} expert to join our team. You will work on cutting-edge projects and collaborate with talented engineers worldwide.`,
    },
    {
      job_title: "Full Stack Developer",
      employer_name: "Meta",
      job_apply_link: "https://careers.meta.com",
      job_city: "Menlo Park",
      job_country: "USA",
      job_description: `Join Meta's engineering team to build products used by billions. Experience with ${query} is preferred.`,
    },
    {
      job_title: "Software Engineer II",
      employer_name: "Microsoft",
      job_apply_link: "https://careers.microsoft.com",
      job_city: "Seattle",
      job_country: "USA",
      job_description: `Microsoft is hiring engineers with ${query} skills to work on Azure cloud services and developer tools.`,
    },
    {
      job_title: "Backend Engineer",
      employer_name: "Stripe",
      job_apply_link: "https://stripe.com/jobs",
      job_city: "San Francisco",
      job_country: "USA",
      job_description: `Help build the economic infrastructure for the internet. Strong ${query} background required.`,
    },
  ]
}
