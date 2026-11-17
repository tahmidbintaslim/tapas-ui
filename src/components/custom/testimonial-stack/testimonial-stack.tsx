import { cn } from "@/lib/utils";
import { Quote } from "lucide-react";
import React from "react";

export interface StackTestimonial {
  quote: string;
  author: string;
  role?: string;
  /** Image URL; initials are shown without one */
  avatar?: string;
}

export interface TestimonialStackProps extends Omit<React.ComponentProps<"section">, "title"> {
  title?: string;
  description?: string;
  items: StackTestimonial[];
}

/** One quote card. Shared by the plain and motion versions. */
export function StackCard({ item, className }: { item: StackTestimonial; className?: string }) {
  return (
    <figure className={cn("flex h-full flex-col rounded-2xl border bg-card p-6 text-left shadow-sm sm:p-8", className)}>
      <Quote aria-hidden="true" className="size-6 fill-primary/15 text-primary" />
      <blockquote className="mt-4 flex-1 text-lg leading-relaxed text-pretty">{item.quote}</blockquote>
      <figcaption className="mt-6 flex items-center gap-3 border-t pt-5">
        {item.avatar ? (
          // eslint-disable-next-line @next/next/no-img-element -- plain img keeps the section framework-agnostic
          <img src={item.avatar} alt="" className="size-10 rounded-full object-cover" />
        ) : (
          <span aria-hidden="true" className="grid size-10 place-items-center rounded-full bg-muted text-sm font-semibold">
            {item.author.charAt(0)}
          </span>
        )}
        <span className="text-sm">
          <span className="block font-medium">{item.author}</span>
          {item.role && <span className="block text-muted-foreground">{item.role}</span>}
        </span>
      </figcaption>
    </figure>
  );
}

/** Heading shared by both versions. */
export function StackHeading({ title, description }: Pick<TestimonialStackProps, "title" | "description">) {
  return (
    <>
      {title && <h2 className="text-center text-3xl font-bold tracking-tight text-balance">{title}</h2>}
      {description && <p className="mx-auto mt-3 max-w-2xl text-center text-pretty text-muted-foreground">{description}</p>}
    </>
  );
}

export const stackGrid = "mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3";

/** Quotes in a simple grid. The motion version stacks them like a deck. */
export function TestimonialStack({ title, description, items, className, ...props }: TestimonialStackProps) {
  return (
    <section className={cn("mx-auto max-w-6xl px-4 py-16", className)} {...props}>
      <StackHeading title={title} description={description} />
      {items.length > 0 && (
        <ul className={stackGrid}>
          {items.map((item) => (
            <li key={item.author + item.quote}>
              <StackCard item={item} />
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
