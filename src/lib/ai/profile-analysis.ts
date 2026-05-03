import { generateText, Output } from "ai"
import { z } from "zod"
import type { ProfileAnalysis } from "@/types/analysis"

const profileAnalysisSchema = z.object({
  summary: z.string(),
  topSkills: z.array(z.string()),
  strengths: z.array(z.object({
    label: z.string(),
    description: z.string(),
  })),
  gaps: z.array(z.object({
    label: z.string(),
    suggestion: z.string(),
  })),
  seniorityLevel: z.enum(["Junior", "Mid", "Senior", "Lead", "Executive"]),
  industryFit: z.array(z.string()),
  profileScore: z.number().min(0).max(100),
})

export async function analyzeProfile(
  profileData: Record<string, unknown>
): Promise<ProfileAnalysis> {
  const { output } = await generateText({
    model: "anthropic/claude-sonnet-4.6",
    output: Output.object({ schema: profileAnalysisSchema }),
    messages: [
      {
        role: "user",
        content: `You are a professional career coach and LinkedIn optimization expert.
Analyze this LinkedIn profile and provide a comprehensive analysis.
Profile data: ${JSON.stringify(profileData, null, 2)}`,
      },
    ],
  })

  if (!output) {
    throw new Error("Failed to generate profile analysis")
  }

  return output as ProfileAnalysis
}
