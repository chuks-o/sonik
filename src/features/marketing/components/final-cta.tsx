
import { DotField } from "@/features/marketing/components/dot-field";
import { AuthLink } from "@/features/marketing/components/auth-link";

export function FinalCta() {
  return (
    <section className="px-5 pt-10 pb-24 sm:px-8 sm:pb-32">
      <div>
        <div className="mk-hairline relative mx-auto max-w-6xl overflow-hidden rounded-3xl border border-mk-border bg-mk-elevated/60 px-6 py-16 text-center sm:px-12 sm:py-20">
          <div
            aria-hidden="true"
            className="mk-drift pointer-events-none absolute -bottom-32 left-1/2 h-[420px] w-[720px] -translate-x-1/2 rounded-full opacity-70 blur-[90px]"
            style={{
              background: "var(--mk-bloom)",
              ["--drift-duration" as string]: "22s",
            }}
          />
          <DotField className="opacity-40" size={4} amplitude={34} />
          <div className="relative">
            <h2 className="mx-auto max-w-2xl text-[2rem] leading-[1.1] font-semibold tracking-[-0.03em] text-balance sm:text-5xl">
              Hear your own script in about ten seconds.
            </h2>
            <p className="mx-auto mt-5 max-w-lg text-[15px] leading-relaxed text-pretty text-mk-muted">
              Sign up, paste a paragraph, pick a voice. The free tier is enough
              to know whether Sonic belongs in your pipeline.
            </p>
            <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <AuthLink
                href="/sign-up"
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-mk-fg px-5 py-3.5 text-[14px] font-medium text-mk-bg transition-transform duration-200 hover:scale-[1.03] active:scale-95 sm:w-auto"
              >
                Start free
              </AuthLink>
              <AuthLink
                href="/sign-in"
                className="inline-flex w-full items-center justify-center rounded-xl border border-mk-border bg-mk-fill px-5 py-3.5 text-[14px] text-mk-fg transition-colors hover:bg-mk-fill-strong sm:w-auto"
              >
                Sign in
              </AuthLink>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
