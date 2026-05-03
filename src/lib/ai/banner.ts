import Anthropic from "@anthropic-ai/sdk"
import type { BannerConcept } from "@/types/analysis"

const anthropic = new Anthropic()

export async function generateBannerConcept(
  profileData: Record<string, unknown>
): Promise<BannerConcept> {
  const message = await anthropic.messages.create({
    model: "claude-opus-4-5",
    max_tokens: 800,
    messages: [
      {
        role: "user",
        content: `Based on this LinkedIn profile generate a banner design concept.
Return ONLY valid JSON with no markdown and no backticks matching:
{
  "theme": "minimal|bold|creative|corporate",
  "primaryColor": "hex string",
  "accentColor": "hex string",
  "tagline": "string max 8 words",
  "visualElements": ["string"],
  "layoutDescription": "string",
  "imagePrompt": "string detailed prompt for AI image generator"
}
Profile: ${JSON.stringify(profileData)}`,
      },
    ],
  })

  const textContent = message.content.find((block) => block.type === "text")
  if (!textContent || textContent.type !== "text") {
    throw new Error("No text response from Claude")
  }

  try {
    return JSON.parse(textContent.text) as BannerConcept
  } catch {
    throw new Error("Failed to parse banner concept JSON: " + textContent.text)
  }
}
