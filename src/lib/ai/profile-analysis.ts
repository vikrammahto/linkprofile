import Anthropic from "@anthropic-ai/sdk"
import type { ProfileAnalysis } from "@/types/analysis"

const anthropic = new Anthropic()

export async function analyzeProfile(
  profileData: Record<string, unknown>
): Promise<ProfileAnalysis> {
  const message = await anthropic.messages.create({
    model: "claude-opus-4-5",
    max_tokens: 1500,
    system: "You are a professional career coach and LinkedIn optimization expert.",
    messages: [
      {
        role: "user",
        content: `Analyze this LinkedIn profile and return ONLY valid JSON with no markdown and no backticks, matching this exact schema:
{
  "summary": "string",
  "topSkills": ["string"],
  "strengths": [{ "label": "string", "description": "string" }],
  "gaps": [{ "label": "string", "suggestion": "string" }],
  "seniorityLevel": "Junior|Mid|Senior|Lead|Executive",
  "industryFit": ["string"],
  "profileScore": "number 0-100"
}
Profile data: ${JSON.stringify(profileData, null, 2)}`,
      },
    ],
  })

  const textContent = message.content.find((block) => block.type === "text")
  if (!textContent || textContent.type !== "text") {
    throw new Error("No text response from Claude")
  }

  try {
    return JSON.parse(textContent.text) as ProfileAnalysis
  } catch {
    throw new Error("Failed to parse profile analysis JSON: " + textContent.text)
  }
}
