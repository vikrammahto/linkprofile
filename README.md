# ProfileIQ — LinkedIn Profile Analyzer Agent

AI-powered agent that analyzes your LinkedIn profile and returns a skills
breakdown, a custom banner design concept, and ranked job recommendations
in under 30 seconds.

## Hackathon

Zero to Agent by Vercel — v0 + MCPs track

## Features

- Profile score with strengths and improvement areas
- AI-generated LinkedIn banner concept with live color preview
- Job recommendations scored and ranked by profile fit

## Tech stack

Next.js 15, TypeScript, Tailwind CSS, shadcn/ui,
Vercel AI SDK + AI Gateway (Claude Sonnet 4), Vercel

## Local setup

1. git clone and cd into the project
2. npm install
3. cp .env.local.example .env.local
4. Fill in your API keys in .env.local
5. npm run dev

## Deploy

npx vercel --prod

## Architecture

Users paste their LinkedIn profile text directly (no scraping needed).
The /api/analyze route acts as an orchestrator agent that fans out three
parallel AI calls using Vercel AI SDK with AI Gateway (Claude Sonnet 4)
for profile analysis, banner generation, and job scoring via Promise.allSettled.
Results are stored in sessionStorage for the results page to consume.

Note: All AI calls use Vercel AI Gateway which is free in v0 - no API keys needed!
