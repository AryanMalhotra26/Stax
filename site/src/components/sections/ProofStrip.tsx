import { CountUp } from "@/components/motion/Reveal";
import { SITE } from "@/lib/site";

/**
 * Four facts, plain type, no cards (§3.1 §2). Answers "is this even relevant
 * to me" before the visitor has to scroll for it.
 */
export function ProofStrip() {
  return (
    <section aria-label="Key facts" className="bg-bone border-b border-line">
      <div className="container-stax section-y-sm">
        <dl className="grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-12">
          <Fact value={<CountUp to={SITE.facts.units} />} label="Suites" />
          <Fact value={<CountUp to={SITE.facts.beds} />} label="Beds" />
          <Fact
            value={
              <>
                <CountUp to={SITE.facts.shuttleMinutes} />
                <span className="text-[0.4em] font-semibold ml-1.5 self-end mb-[0.35em] tracking-normal">
                  MIN
                </span>
              </>
            }
            label="To Brock, by shuttle"
          />
          <Fact value="Sept" label="2027 move-in" suffix="’27" />
        </dl>
      </div>
    </section>
  );
}

function Fact({
  value,
  label,
  suffix,
}: {
  value: React.ReactNode;
  label: string;
  suffix?: string;
}) {
  return (
    <div>
      <dd className="text-stat flex items-baseline">
        {value}
        {suffix && <span className="sr-only">{suffix}</span>}
      </dd>
      <dt className="text-eyebrow uppercase mt-3.5 text-ink-soft">{label}</dt>
    </div>
  );
}
