import { UrlInputForm } from '@/components/url-input-form';
import type { ReactNode } from 'react';
import {
  BarChart3,
  BriefcaseBusiness,
  ImageIcon,
  Rocket,
  ShieldCheck,
  Sparkles,
  Target,
  Zap,
} from 'lucide-react';

const trustLogos = [
  { name: 'Google', className: 'text-[#4285f4]' },
  { name: 'Microsoft', className: 'text-[#737373]' },
  { name: 'amazon', className: 'text-black' },
  { name: 'Meta', className: 'text-[#0866ff]' },
  { name: 'NETFLIX', className: 'text-[#e50914]' },
];

const valueProps = [
  {
    icon: Zap,
    title: 'Fast & Accurate',
    body: 'AI analyzes your profile in seconds',
  },
  {
    icon: ShieldCheck,
    title: 'Private & Secure',
    body: 'Your data is encrypted and never stored',
  },
  {
    icon: Target,
    title: 'Personalized',
    body: 'Tailored insights just for you',
  },
  {
    icon: Rocket,
    title: 'Career Focused',
    body: 'Built to help you grow faster',
  },
];

export default function Home() {
  return (
    <div className="relative isolate overflow-hidden bg-[linear-gradient(180deg,#ffffff_0%,#fbfcff_48%,#f4f8ff_100%)]">
      <div className="absolute inset-0 -z-20 bg-[linear-gradient(rgba(79,70,229,0.035)_1px,transparent_1px),linear-gradient(90deg,rgba(79,70,229,0.035)_1px,transparent_1px)] bg-[size:32px_32px]" />
      <div className="absolute top-48 left-[-180px] -z-10 h-[420px] w-[420px] rounded-full bg-fuchsia-400/35 blur-[90px]" />
      <div className="absolute top-[670px] right-[-160px] -z-10 h-[520px] w-[520px] rounded-full bg-blue-500/40 blur-[105px]" />
      <Sparkles className="absolute top-72 left-10 hidden h-9 w-9 text-white drop-shadow-[0_0_18px_rgba(124,58,237,0.35)] md:block" />
      <Sparkles className="absolute top-64 right-[14%] hidden h-9 w-9 text-indigo-100 md:block" />

      <section className="mx-auto flex w-full max-w-6xl flex-col items-center px-4 pt-16 pb-16 sm:px-6 lg:pt-20">
        <div className="mx-auto max-w-4xl text-center">
          <div className="mx-auto mb-7 inline-flex items-center gap-2 rounded-full bg-indigo-100 px-5 py-2 text-sm font-semibold text-indigo-700">
            <Sparkles className="h-4 w-4 text-amber-400" />
            AI-powered LinkedIn analysis
          </div>
          <h1 className="text-5xl leading-[1.08] font-extrabold text-balance text-slate-950 sm:text-6xl lg:text-7xl">
            Analyze your LinkedIn profile with{' '}
            <span className="bg-gradient-to-r from-violet-700 to-blue-500 bg-clip-text text-transparent">
              AI
            </span>
          </h1>
          <p className="mx-auto mt-7 max-w-2xl text-xl leading-8 text-pretty text-slate-600">
            Get a complete profile breakdown, banner design ideas, and job
            recommendations in seconds.
          </p>
        </div>

        <div className="mt-12 grid w-full items-start gap-8 lg:grid-cols-[minmax(0,1.45fr)_minmax(320px,0.85fr)]">
          <UrlInputForm />

          <aside className="grid gap-5 lg:pt-0">
            <InsightCard
              icon={<BarChart3 className="h-7 w-7" />}
              iconClassName="from-violet-400 to-violet-700"
              title="Profile Analysis"
              body="Get a detailed breakdown of your skills, strengths, and areas to improve."
            >
              <div className="mt-5 rounded-xl bg-white p-4 shadow-sm">
                <Metric
                  label="Communication"
                  value="92%"
                  className="bg-violet-500"
                />
                <Metric
                  label="Leadership"
                  value="75%"
                  className="bg-violet-500"
                />
                <Metric
                  label="Problem Solving"
                  value="60%"
                  className="bg-blue-500"
                />
              </div>
            </InsightCard>

            <InsightCard
              icon={<ImageIcon className="h-7 w-7" />}
              iconClassName="from-sky-400 to-blue-600"
              title="Banner Concepts"
              body="Personalized LinkedIn banner ideas that reflect your professional brand."
            >
              <div className="mt-5 grid grid-cols-3 gap-3">
                <div className="h-12 rounded-lg bg-[linear-gradient(135deg,#17084a,#7c3aed_48%,#101a5c)]" />
                <div className="h-12 rounded-lg bg-[linear-gradient(135deg,#74d5ff,#1d4ed8_58%,#233876)]" />
                <div className="h-12 rounded-lg bg-[linear-gradient(135deg,#d8e2ef,#516f9c_48%,#263b57)]" />
              </div>
            </InsightCard>

            <InsightCard
              icon={<BriefcaseBusiness className="h-7 w-7" />}
              iconClassName="from-emerald-400 to-green-600"
              title="Job Matches"
              body="Discover roles that match your profile and career goals."
            >
              <div className="mt-5 flex flex-wrap gap-2">
                {['Product Manager', 'AI/ML Engineer', 'Growth Engineer'].map(
                  (role) => (
                    <span
                      key={role}
                      className="rounded-full border border-emerald-200 bg-white px-4 py-1.5 text-xs font-semibold text-slate-800"
                    >
                      {role}
                    </span>
                  ),
                )}
                <span className="rounded-full bg-emerald-50 px-4 py-1.5 text-xs font-semibold text-slate-600">
                  +12 more
                </span>
              </div>
            </InsightCard>
          </aside>
        </div>

        <section
          id="examples"
          className="mt-16 flex w-full flex-col items-center gap-7"
        >
          <p className="text-xs font-bold tracking-[0.22em] text-slate-500 uppercase">
            Trusted by professionals at
          </p>
          <div className="flex w-full max-w-3xl flex-wrap items-center justify-center gap-x-11 gap-y-5">
            {trustLogos.map((logo) => (
              <span
                key={logo.name}
                className={`text-2xl font-bold ${logo.className}`}
              >
                {logo.name}
              </span>
            ))}
          </div>

          <div className="w-full max-w-2xl rounded-3xl border border-slate-200 bg-white/90 p-7 shadow-[0_18px_50px_rgba(51,65,130,0.10)]">
            <div className="flex gap-5">
              <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-full bg-gradient-to-br from-blue-200 to-violet-200">
                <div className="absolute inset-x-5 top-4 h-8 rounded-full bg-slate-900" />
                <div className="absolute inset-x-4 bottom-0 h-11 rounded-t-full bg-blue-600" />
                <div className="absolute top-7 left-5 h-3 w-3 rounded-full bg-white" />
                <div className="absolute top-7 right-5 h-3 w-3 rounded-full bg-white" />
              </div>
              <div>
                <p className="text-lg leading-7 text-slate-950">
                  &quot;LinkProfile gave me insights I never knew about my
                  profile. The banner ideas are fire and the job recommendations
                  were spot on!&quot;
                </p>
                <div className="mt-5 flex items-center gap-4">
                  <div className="grid h-8 w-8 grid-cols-2 overflow-hidden rounded-sm">
                    <span className="bg-[#f25022]" />
                    <span className="bg-[#7fba00]" />
                    <span className="bg-[#00a4ef]" />
                    <span className="bg-[#ffb900]" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-950">
                      Arjun Sharma
                    </p>
                    <p className="text-sm text-slate-500">
                      Product Manager @ Microsoft
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex gap-4">
            <span className="h-2 w-2 rounded-full bg-violet-600" />
            <span className="h-2 w-2 rounded-full bg-indigo-200" />
            <span className="h-2 w-2 rounded-full bg-indigo-200" />
            <span className="h-2 w-2 rounded-full bg-indigo-200" />
            <span className="h-2 w-2 rounded-full bg-indigo-200" />
          </div>
        </section>

        <section
          id="how-it-works"
          className="mt-7 grid w-full gap-0 overflow-hidden rounded-2xl border border-slate-200 bg-white/90 shadow-[0_18px_60px_rgba(51,65,130,0.10)] sm:grid-cols-2 lg:grid-cols-4"
        >
          {valueProps.map((item) => (
            <div
              key={item.title}
              className="flex gap-4 p-7 lg:border-r lg:border-slate-200/80 lg:last:border-r-0"
            >
              <item.icon className="mt-1 h-5 w-5 shrink-0 text-violet-600" />
              <div>
                <h2 className="text-sm font-bold text-slate-950">
                  {item.title}
                </h2>
                <p className="mt-1 text-sm leading-5 text-slate-600">
                  {item.body}
                </p>
              </div>
            </div>
          ))}
        </section>
      </section>
    </div>
  );
}

function InsightCard({
  icon,
  iconClassName,
  title,
  body,
  children,
}: {
  icon: ReactNode;
  iconClassName: string;
  title: string;
  body: string;
  children: ReactNode;
}) {
  return (
    <div className="rounded-3xl border border-indigo-100 bg-white/80 p-7 shadow-[0_20px_70px_rgba(51,65,130,0.10)] backdrop-blur">
      <div className="flex gap-5">
        <div
          className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br text-white shadow-lg ${iconClassName}`}
        >
          {icon}
        </div>
        <div>
          <h2 className="text-lg font-bold text-slate-950">{title}</h2>
          <p className="mt-4 text-sm leading-6 text-slate-600">{body}</p>
        </div>
      </div>
      {children}
    </div>
  );
}

function Metric({
  label,
  value,
  className,
}: {
  label: string;
  value: string;
  className: string;
}) {
  return (
    <div className="grid grid-cols-[110px_1fr] items-center gap-4 py-1.5 text-xs text-slate-700">
      <span>{label}</span>
      <div className="h-2 rounded-full bg-slate-100">
        <div
          className={`h-full rounded-full ${className}`}
          style={{ width: value }}
        />
      </div>
    </div>
  );
}
