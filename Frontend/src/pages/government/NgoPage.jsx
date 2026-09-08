import { Building2 } from 'lucide-react'

export default function NgoPage() {
  return (
    <div className="max-w-2xl space-y-4">
      <div className="flex items-center gap-3">
        <Building2 size={22} className="text-ink-primary" />
        <h1 className="font-display text-xl font-semibold text-ink-primary">NGO Management</h1>
      </div>

      <div className="rounded-xl border border-base-border bg-base-surface p-5 shadow-panel text-sm text-ink-secondary leading-relaxed">
        <p>
          There's no NGO data model in the system yet — no way to register a partner organization, track their
          service area, or link their supply drops to shelters and resources. Rather than fake a list of NGOs
          with invented names and numbers, this page is being upfront that the feature doesn't exist yet.
        </p>
        <p className="mt-3">
          Building it properly would mean: an <code className="text-ink-primary">NGO</code> model (name, contact,
          registration number, service areas), a way to link NGO contributions to{' '}
          <code className="text-ink-primary">Resource</code> records so donations show up in inventory, and
          admin-only routes to manage them — the same CRUD pattern already used for shelters and resources in this
          codebase. That's a real, scoped backend task, not something to bolt on as static content.
        </p>
      </div>
    </div>
  )
}
