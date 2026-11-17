import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Check } from "lucide-react";
import React from "react";

export type BillingPeriod = "monthly" | "yearly";

export interface MorphPlan {
  name: string;
  description?: string;
  /** Price per month on monthly billing */
  monthly: number;
  /** Price per year on yearly billing */
  yearly: number;
  features: string[];
  /** Any link, such as a checkout URL. `yearlyHref` (optional) is used while yearly is selected. */
  cta: { label: string; href: string; yearlyHref?: string };
  /** Highlights this plan */
  featured?: boolean;
}

export interface PriceMorphProps extends Omit<React.ComponentProps<"section">, "title"> {
  title?: string;
  description?: string;
  plans: MorphPlan[];
  currency?: string;
  monthlyLabel?: string;
  yearlyLabel?: string;
  /** Label on the featured plan */
  featuredLabel?: string;
}

/** Whole percent saved by paying yearly instead of twelve monthly payments; 0 when there is no saving. */
export function yearlySaving(plan: Pick<MorphPlan, "monthly" | "yearly">) {
  if (plan.monthly <= 0 || plan.yearly >= plan.monthly * 12) return 0;
  return Math.round((1 - plan.yearly / (plan.monthly * 12)) * 100);
}

// The switch is two radios; these classes read the checked one, so it works without JavaScript.
export const whenMonthly = "group-has-[[data-period-input=yearly]:checked]/morph:hidden";
export const whenYearly = "hidden group-has-[[data-period-input=yearly]:checked]/morph:inline-flex";

export function PeriodUnit({ period }: { period: BillingPeriod }) {
  return (
    <span className="text-sm text-muted-foreground">
      <span aria-hidden="true">/</span>
      <span className="sr-only">per </span>
      {period === "monthly" ? "month" : "year"}
    </span>
  );
}

export const saveBadge =
  "items-center rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-semibold text-primary ring-1 ring-primary/25 ring-inset dark:bg-primary/20";

/** Plain price area: both periods in the DOM, CSS shows the checked one. */
function StaticPrice({ plan, currency }: { plan: MorphPlan; currency: string }) {
  const saving = yearlySaving(plan);
  return (
    <>
      <span data-price data-period="monthly" className={cn("inline-flex items-baseline gap-1", whenMonthly)}>
        <span className="text-5xl font-semibold tracking-tight tabular-nums">
          {currency}
          {plan.monthly}
        </span>
        <PeriodUnit period="monthly" />
      </span>
      <span data-price data-period="yearly" className={cn("flex-wrap items-baseline gap-x-1 gap-y-2", whenYearly)}>
        <span className="text-5xl font-semibold tracking-tight tabular-nums">
          {currency}
          {plan.yearly}
        </span>
        <PeriodUnit period="yearly" />
        {saving > 0 && <span className={cn("ml-1 inline-flex self-center", saveBadge)}>Save {saving}%</span>}
      </span>
    </>
  );
}

/** Heading, period switch and plan cards. The motion version passes its own price area and controls the radios. */
export function MorphFrame({
  title = "Pricing",
  description,
  plans,
  currency = "$",
  monthlyLabel = "Monthly",
  yearlyLabel = "Yearly",
  featuredLabel = "Most popular",
  className,
  period,
  onPeriodChange,
  renderPrice,
  renderGlow,
  ...props
}: PriceMorphProps & {
  period?: BillingPeriod;
  onPeriodChange?: (p: BillingPeriod) => void;
  renderPrice?: (plan: MorphPlan) => React.ReactNode;
  /** Extra decoration inside the featured card */
  renderGlow?: () => React.ReactNode;
}) {
  const name = React.useId();
  const best = Math.max(0, ...plans.map(yearlySaving));
  const option = (value: BillingPeriod, label: string) => (
    <label className="relative inline-flex min-h-11 cursor-pointer items-center gap-2 rounded-full px-4 font-medium text-muted-foreground transition-colors has-[:checked]:bg-background has-[:checked]:text-foreground has-[:checked]:shadow-sm has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-ring sm:min-h-9">
      <input
        type="radio"
        name={name}
        value={value}
        data-period-input={value}
        className="sr-only"
        {...(onPeriodChange ? { checked: period === value, onChange: () => onPeriodChange(value) } : { defaultChecked: value === "monthly" })}
      />
      {label}
      {value === "yearly" && best > 0 && <span className="text-xs font-semibold text-primary">−{best}%</span>}
    </label>
  );
  return (
    <section className={cn("group/morph mx-auto max-w-6xl px-4 py-16 text-center", className)} {...props}>
      <h2 className="text-3xl font-bold tracking-tight text-balance">{title}</h2>
      {description && <p className="mx-auto mt-3 max-w-2xl text-pretty text-muted-foreground">{description}</p>}
      {plans.length > 0 && (
        <>
          <fieldset className="mx-auto mt-6 w-fit text-sm">
            <legend className="sr-only">Billing period</legend>
            <div className="inline-flex rounded-full border bg-muted p-1">
              {option("monthly", monthlyLabel)}
              {option("yearly", yearlyLabel)}
            </div>
          </fieldset>
          <ul className={cn("mx-auto mt-10 grid max-w-5xl items-stretch gap-6", plans.length > 2 ? "lg:grid-cols-3" : "md:grid-cols-2")}>
            {plans.map((plan) => (
              <li
                key={plan.name}
                aria-label={plan.name}
                className={cn(
                  "relative isolate flex flex-col overflow-hidden rounded-2xl border bg-card p-6 text-left",
                  plan.featured &&
                    "border-primary/60 shadow-[0_24px_60px_-28px_color-mix(in_oklch,var(--primary)_55%,transparent)] ring-1 ring-primary/30",
                )}
              >
                {plan.featured && (
                  <div
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(80%_60%_at_50%_0%,color-mix(in_oklch,var(--primary)_9%,transparent),transparent)]"
                  />
                )}
                {plan.featured && renderGlow?.()}
                <div className="flex items-center justify-between gap-2">
                  <h3 className="text-lg font-semibold">{plan.name}</h3>
                  {plan.featured && <Badge>{featuredLabel}</Badge>}
                </div>
                {plan.description && <p className="mt-1 text-sm text-muted-foreground">{plan.description}</p>}
                <p className="mt-6 flex min-h-12 flex-wrap items-baseline gap-1">{renderPrice ? renderPrice(plan) : <StaticPrice plan={plan} currency={currency} />}</p>
                <ul className="mt-6 flex-1 space-y-2.5 text-sm">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-start gap-2">
                      <Check aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-primary" />
                      {f}
                    </li>
                  ))}
                </ul>
                {/* With a yearly link there are two buttons and CSS shows the one for the checked period. */}
                <Button asChild size="lg" variant={plan.featured ? "default" : "outline"} className={cn("mt-8 h-11 w-full", plan.cta.yearlyHref && whenMonthly)}>
                  <a href={plan.cta.href}>{plan.cta.label}</a>
                </Button>
                {plan.cta.yearlyHref && (
                  <Button asChild size="lg" variant={plan.featured ? "default" : "outline"} className={cn("mt-8 h-11 w-full", whenYearly)}>
                    <a href={plan.cta.yearlyHref}>{plan.cta.label}</a>
                  </Button>
                )}
              </li>
            ))}
          </ul>
        </>
      )}
    </section>
  );
}

/**
 * Pricing tiers with a monthly/yearly switch and a "Save N%" badge on yearly.
 * The switch is two radios and CSS, so it works without JavaScript.
 */
export function PriceMorph(props: PriceMorphProps) {
  return <MorphFrame {...props} />;
}
