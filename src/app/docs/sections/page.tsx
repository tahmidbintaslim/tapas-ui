import { pageMeta } from "@/app/_site/meta";
import { SectionCard } from "../../_site/section-card";
import { GROUPED, SECTIONS, groupColor, groupId } from "../../_site/sections";
import { DocsHeader } from "../_ui";

export const metadata = pageMeta("Sections | Tapas UI", "Every Tapas UI section and card, each installable with one shadcn CLI command.", "/docs/sections");

export default function SectionsIndex() {
  return (
    <div className="space-y-14">
      <DocsHeader
        crumb="Components"
        title="Sections"
        lead={`${SECTIONS.length} sections and cards, in plain and motion versions. Open one to preview it in your colors, read its props and copy the install command.`}
      >
        {/* Jump links: one per group, in sidebar order. */}
        <nav aria-label="Section groups" className="pt-2">
          <ul className="flex flex-wrap gap-2 text-[13px]">
            {GROUPED.map((g) => (
              <li key={g.name}>
                <a
                  href={`#${groupId(g.name)}`}
                  className="inline-flex min-h-9 items-center gap-2 rounded-full border bg-card px-3 text-muted-foreground transition-colors hover:border-brand/50 hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
                >
                  <span aria-hidden="true" className="size-2 rounded-full" style={{ background: groupColor(g.name) }} />
                  {g.name}
                  <span className="text-xs tabular-nums">{g.items.length}</span>
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </DocsHeader>
      {GROUPED.map((group) => (
        <section key={group.name} aria-labelledby={groupId(group.name)} className="scroll-mt-24 space-y-5">
          <div className="space-y-1.5">
            <h2 id={groupId(group.name)} className="flex scroll-mt-24 items-center gap-2.5 text-[22px] font-semibold tracking-tight">
              <span aria-hidden="true" className="size-2.5 rounded-full" style={{ background: groupColor(group.name) }} />
              {group.name}
            </h2>
            <p className="max-w-[68ch] text-muted-foreground">{group.blurb}</p>
          </div>
          <ul className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {group.items.map((s) => (
              <li key={s.slug}>
                <SectionCard section={s} />
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
}
