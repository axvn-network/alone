import { STRATEGY_AT_A_GLANCE } from "@/constants/strategy";

/** Structural counts only; these cards deliberately avoid financial or performance metrics. */
export default function StrategyAtAGlance() {
  return (
    <dl className="grid gap-3 sm:grid-cols-3" aria-label="Tổng quan lộ trình">
      {STRATEGY_AT_A_GLANCE.map(({ value, label, description, icon: Icon }) => (
        <div key={label} className="rounded-xl border border-gvi-gold/15 bg-gvi-deep p-5">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-gvi-gold/10 text-gvi-gold">
              <Icon className="h-5 w-5" aria-hidden="true" />
            </span>
            <div>
              <dd className="text-2xl font-semibold leading-none text-gvi-ivory">{value}</dd>
              <dt className="mt-1 text-xs font-semibold uppercase tracking-wider text-gvi-silver/70">{label}</dt>
            </div>
          </div>
          <p className="mt-4 text-xs leading-relaxed text-gvi-silver/65">{description}</p>
        </div>
      ))}
    </dl>
  );
}
