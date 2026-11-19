/**
 * Three warm pools of light behind the landing hero, one per plate color.
 * Static and decorative; the dot field on top supplies the pointer response.
 */
export function HeroCanvas({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative isolate overflow-hidden">
      <div aria-hidden="true" className="absolute inset-x-0 -top-48 -z-10 mx-auto h-[40rem] max-w-6xl">
        <div className="absolute top-0 left-[8%] size-[28rem] rounded-full bg-[radial-gradient(closest-side,color-mix(in_oklch,var(--olive)_18%,transparent),transparent)]" />
        <div className="absolute top-10 left-1/2 size-[34rem] -translate-x-1/2 rounded-full bg-[radial-gradient(closest-side,color-mix(in_oklch,var(--saffron)_24%,transparent),transparent)]" />
        <div className="absolute top-0 right-[8%] size-[28rem] rounded-full bg-[radial-gradient(closest-side,color-mix(in_oklch,var(--paprika)_20%,transparent),transparent)]" />
      </div>
      {children}
    </div>
  );
}
