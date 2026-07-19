import { Link } from 'react-router-dom'
import { ShieldCheck, UserRound, HardHat, ArrowRight } from 'lucide-react'
import { orgInfo } from '../data/mockData'

const roles = [
  {
    to: '/government',
    icon: ShieldCheck,
    title: 'Government / Admin',
    desc: 'Monitor incidents, coordinate rescue teams, and manage relief operations nationwide.',
    tone: 'from-brand-crimson to-brand-crimsondeep',
  },
  {
    to: '/citizen',
    icon: UserRound,
    title: 'Citizen',
    desc: 'Send SOS alerts, report disasters, find nearby shelters, and request relief.',
    tone: 'from-brand-blue to-[#0A2E6E]',
  },
  {
    to: '/volunteer',
    icon: HardHat,
    title: 'Volunteer',
    desc: 'View assigned tasks, navigate to mission sites, and log field activity.',
    tone: 'from-status-safe to-[#127A3F]',
  },
]

export default function Landing() {
  return (
    <div className="min-h-screen bg-base flex flex-col items-center justify-center px-6 py-16">
      <div className="text-center mb-12 max-w-xl">
        <div className="mx-auto mb-5 h-14 w-14 rounded-full bg-gradient-to-br from-brand-crimson to-brand-crimsondeep flex items-center justify-center font-display font-semibold shadow-panel">
          NP
        </div>
        <p className="text-xs font-mono tracking-widest text-brand-crimson uppercase">
          {orgInfo.country}
        </p>
        <h1 className="font-display text-3xl sm:text-4xl font-semibold text-ink-primary mt-2">
          Nepal Disaster Risk Management
        </h1>
        <p className="text-ink-muted mt-3">
          Choose a role to preview its dashboard. {orgInfo.location}.
        </p>
      </div>

      <div className="grid gap-5 sm:grid-cols-3 max-w-4xl w-full">
        {roles.map((r) => (
          <Link
            key={r.to}
            to={r.to}
            className="group rounded-2xl border border-base-border bg-base-surface p-6 flex flex-col gap-4 hover:border-white/20 transition-colors shadow-panel"
          >
            <div
              className={`h-11 w-11 rounded-xl bg-gradient-to-br ${r.tone} flex items-center justify-center`}
            >
              <r.icon size={20} />
            </div>
            <div>
              <h2 className="font-display font-semibold text-ink-primary">{r.title}</h2>
              <p className="text-sm text-ink-muted mt-1.5 leading-relaxed">{r.desc}</p>
            </div>
            <span className="mt-auto inline-flex items-center gap-1.5 text-sm text-ink-secondary group-hover:text-ink-primary transition-colors">
              Open dashboard
              <ArrowRight size={15} className="group-hover:translate-x-0.5 transition-transform" />
            </span>
          </Link>
        ))}
      </div>
    </div>
  )
}
