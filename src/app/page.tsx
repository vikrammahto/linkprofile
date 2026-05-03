'use client';

import { useState } from 'react';
import { UrlInputForm } from '@/components/url-input-form';
import { Zap, Target, Palette, Briefcase, ArrowRight, CheckCircle2 } from 'lucide-react';

const features = [
  {
    icon: Target,
    title: 'Profile Analysis',
    description: 'Get detailed insights on your profile strength and areas for improvement',
  },
  {
    icon: Palette,
    title: 'Banner Design',
    description: 'AI-generated banner concepts tailored to your professional brand',
  },
  {
    icon: Briefcase,
    title: 'Job Matching',
    description: 'Discover job opportunities that align with your skills and experience',
  },
];

const benefits = [
  'AI-powered analysis in seconds',
  'Actionable improvement suggestions',
  'Professional banner concepts',
  'Personalized job recommendations',
];

export default function Home() {
  const [demoText, setDemoText] = useState('');

  return (
    <div className="relative">
      {/* Hero gradient glow */}
      <div className="hero-glow" />
      
      {/* Grid background */}
      <div className="grid-bg absolute inset-0" />

      {/* Hero Section */}
      <section className="relative px-6 pb-24 pt-20">
        <div className="mx-auto max-w-6xl">
          <div className="flex flex-col items-center text-center">
            {/* Badge */}
            <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-1.5 text-sm text-primary">
              <Zap className="h-3.5 w-3.5" />
              <span>AI-Powered Profile Analysis</span>
            </div>

            {/* Headline */}
            <h1 className="max-w-4xl text-balance text-5xl font-bold tracking-tight sm:text-6xl lg:text-7xl">
              Optimize your LinkedIn profile with{' '}
              <span className="bg-gradient-to-r from-primary via-purple-400 to-pink-400 bg-clip-text text-transparent">
                AI insights
              </span>
            </h1>

            {/* Subheadline */}
            <p className="mt-6 max-w-2xl text-pretty text-lg text-muted-foreground sm:text-xl">
              Upload your LinkedIn profile and get instant analysis, professional banner 
              concepts, and personalized job recommendations powered by AI.
            </p>

            {/* Benefits list */}
            <div className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
              {benefits.map((benefit) => (
                <div key={benefit} className="flex items-center gap-2 text-sm text-muted-foreground">
                  <CheckCircle2 className="h-4 w-4 text-success" />
                  <span>{benefit}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Form Section */}
          <div className="mx-auto mt-16 max-w-2xl">
            <div className="glow rounded-2xl border border-border/50 bg-card/50 p-6 backdrop-blur-sm sm:p-8">
              <UrlInputForm defaultText={demoText} />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="relative border-t border-border/50 px-6 py-24">
        <div className="mx-auto max-w-6xl">
          <div className="mb-16 text-center">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Everything you need to stand out
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Comprehensive tools to analyze, optimize, and elevate your professional presence.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="group rounded-xl border border-border/50 bg-card/30 p-6 transition-all hover:border-primary/30 hover:bg-card/50"
              >
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary transition-colors group-hover:bg-primary/20">
                  <feature.icon className="h-6 w-6" />
                </div>
                <h3 className="mb-2 text-lg font-semibold">{feature.title}</h3>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {feature.description}
                </p>
                <div className="mt-4 flex items-center text-sm font-medium text-primary opacity-0 transition-opacity group-hover:opacity-100">
                  Learn more <ArrowRight className="ml-1 h-4 w-4" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Social Proof Section */}
      <section className="relative border-t border-border/50 px-6 py-16">
        <div className="mx-auto max-w-6xl">
          <p className="mb-8 text-center text-sm font-medium uppercase tracking-wider text-muted-foreground">
            Trusted by professionals worldwide
          </p>
          <div className="flex flex-wrap items-center justify-center gap-x-12 gap-y-6 opacity-50">
            {['Google', 'Microsoft', 'Amazon', 'Meta', 'Apple'].map((company) => (
              <span key={company} className="text-xl font-semibold text-muted-foreground">
                {company}
              </span>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
