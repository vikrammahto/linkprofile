import { generateText, Output } from "ai"
import { z } from "zod"
import type { BannerConcept } from "@/types/analysis"

const bannerConceptSchema = z.object({
  theme: z.enum(["minimal", "bold", "creative", "corporate"]),
  primaryColor: z.string(),
  accentColor: z.string(),
  tagline: z.string(),
  visualElements: z.array(z.string()),
  layoutDescription: z.string(),
  imagePrompt: z.string(),
})

export async function generateBannerConcept(
  profileData: Record<string, unknown>
): Promise<BannerConcept> {
  const result = await generateText({
    model: "anthropic/claude-sonnet-4",
    messages: [
      {
        role: "user",
        content: `Based on this LinkedIn profile generate a creative banner design concept for their LinkedIn profile header.
The tagline should be max 8 words and capture their professional essence.
The imagePrompt should be detailed enough for an AI image generator.
Profile: ${JSON.stringify(profileData)}`,
      },
    ],
    output: Output.object({ schema: bannerConceptSchema }),
  })

  if (!result.object) {
    throw new Error("Failed to generate banner concept")
  }

  return result.object as BannerConcept
}
