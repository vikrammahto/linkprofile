export interface ProfileAnalysis {
  summary: string
  topSkills: string[]
  strengths: { label: string; description: string }[]
  gaps: { label: string; suggestion: string }[]
  seniorityLevel: "Junior" | "Mid" | "Senior" | "Lead" | "Executive"
  industryFit: string[]
  profileScore: number
}

export interface BannerConcept {
  theme: "minimal" | "bold" | "creative" | "corporate"
  primaryColor: string
  accentColor: string
  tagline: string
  visualElements: string[]
  layoutDescription: string
  imagePrompt: string
}

export interface JobMatch {
  job_title: string
  employer_name: string
  job_apply_link: string
  job_city: string
  job_country: string
  matchScore: number
  matchReason: string
}

export interface AnalysisResult {
  analysis: ProfileAnalysis | null
  banner: BannerConcept | null
  jobs: JobMatch[] | null
}
