'use client';

import { useState } from 'react';
import { UrlInputForm } from '@/components/url-input-form';
import { BarChart3, Palette, Briefcase, Shield, Zap, Users } from 'lucide-react';

const features = [
  {
    icon: BarChart3,
    title: 'Profile Analysis',
    description: 'Get a comprehensive breakdown of your skills, strengths, and areas for improvement.',
    color: 'bg-blue-50 text-blue-600',
  },
  {
    icon: Palette,
    title: 'Banner Concepts',
    description: 'Receive personalized LinkedIn banner design ideas that match your professional brand.',
    color: 'bg-purple-50 text-purple-600',
  },
  {
    icon: Briefcase,
    title: 'Job Matches',
    description: 'Discover job opportunities aligned with your experience, skills, and career goals.',
    color: 'bg-emerald-50 text-emerald-600',
  },
];

const steps = [
  { number: '01', title: 'Upload or paste', description: 'Share your LinkedIn profile via PDF or text' },
  { number: '02', title: 'AI analyzes', description: 'Our AI processes your profile in seconds' },
  { number: '03', title: 'Get insights', description: 'Receive actionable recommendations' },
];

export default function Home() {
  const [demoText, setDemoText] = useState('');

  return (
    <div className="relative">
      {/* Hero Section */}
      <section className="relative overflow-hidden px-6 pb-20 pt-16 sm:pb-28 sm:pt-24">
        {/* Background dot pattern */}
        <div className="dot-pattern absolute inset-0 opacity-40" />
        
        <div className="relative mx-auto max-w-6xl">
          <div className="flex flex-col lg:flex-row lg:items-start lg:gap-16">
            {/* Left: Hero content */}
            <div className="flex-1 text-center lg:pt-8 lg:text-left">
              {/* Badge */}
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-3.5 py-1.5 text-sm font-medium text-primary">
                <Zap className="h-3.5 w-3.5" />
                AI-powered LinkedIn analysis
              </div>

              {/* Headline */}
              <h1 className="text-balance text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
                Analyze your LinkedIn profile with{' '}
                <span className="gradient-text">AI</span>
              </h1>

              {/* Subheadline */}
              <p className="mx-auto mt-6 max-w-xl text-pretty text-lg text-muted-foreground lg:mx-0">
                Get a complete profile breakdown, banner design ideas, and job 
                recommendations in seconds.
              </p>

              {/* Trust indicators */}
              <div className="mt-8 flex flex-wrap items-center justify-center gap-6 lg:justify-start">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Shield className="h-4 w-4 text-success" />
                  <span>Your data is secure</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Users className="h-4 w-4 text-primary" />
                  <span>10K+ profiles analyzed</span>
                </div>
              </div>
            </div>

            {/* Right: Form card */}
            <div className="mx-auto mt-12 w-full max-w-lg lg:mx-0 lg:mt-0">
              <div className="glass-card soft-shadow-lg rounded-2xl p-6 sm:p-8">
                <UrlInputForm defaultText={demoText} />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="border-y border-border/60 bg-muted/30 px-6 py-20">
        <div className="mx-auto max-w-6xl">
          <div className="mb-12 text-center">
            <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
              How it works
            </h2>
            <p className="mt-3 text-muted-foreground">
              Get started in three simple steps
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            {steps.map((step, index) => (
              <div key={step.number} className="relative text-center">
                {index < steps.length - 1 && (
                  <div className="absolute left-1/2 top-8 hidden h-px w-full bg-border md:block" />
                )}
                <div className="relative mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-card soft-shadow border border-border/60">
                  <span className="text-xl font-bold text-primary">{step.number}</span>
                </div>
                <h3 className="mb-2 font-semibold">{step.title}</h3>
                <p className="text-sm text-muted-foreground">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="px-6 py-20">
        <div className="mx-auto max-w-6xl">
          <div className="mb-12 text-center">
            <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
              Everything you need to stand out
            </h2>
            <p className="mt-3 text-muted-foreground">
              Comprehensive AI-powered tools to optimize your professional presence
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="group rounded-xl border border-border/60 bg-card p-6 soft-shadow transition-all hover:border-primary/30 hover:shadow-md"
              >
                <div className={`mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl ${feature.color}`}>
                  <feature.icon className="h-6 w-6" />
                </div>
                <h3 className="mb-2 text-lg font-semibold">{feature.title}</h3>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="border-t border-border/60 bg-gradient-to-b from-primary/5 to-transparent px-6 py-20">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
            Ready to optimize your profile?
          </h2>
          <p className="mt-3 text-muted-foreground">
            Join thousands of professionals who have improved their LinkedIn presence with AI-powered insights.
          </p>
          <button className="gradient-btn mt-8 rounded-xl px-8 py-3 text-base font-semibold text-white">
            Get Started Free
          </button>
        </div>
      </section>
    </div>
  );
}
