import { motion } from 'motion/react';
import { ArrowRight, Database, HelpCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { AtlasCanvas } from './AtlasCanvas';
import { AtlasFloatingCard } from './AtlasFloatingCard';
import type { AtlasScrollState } from './AtlasScrollController';
import type { AtlasInsight, AtlasStage } from './atlasStages';

export function AtlasHeroShell({
  stages,
  insight,
  scrollState,
}: {
  stages: AtlasStage[];
  insight: AtlasInsight;
  scrollState: AtlasScrollState;
}): JSX.Element {
  const activeStage = scrollState.activeStage;
  const eyebrow = scrollState.isHandoff ? 'Report handoff' : activeStage ? `Stage ${activeStage.step}` : 'Atlas overview';
  const headline = scrollState.isHandoff ? 'Continue into the supply-chain report.' : activeStage ? activeStage.title : 'Understand the systems behind intelligence.';
  const summary = scrollState.isHandoff
    ? 'The immersive atlas resolves into the current report view, where each stage links back to the underlying supply-chain graph.'
    : activeStage
    ? activeStage.description
    : 'A working concept route for tracing the AI supply chain from models and compute to infrastructure, power, and physical inputs.';
  const primaryHref = activeStage?.href ?? '/supply-chain';
  const primaryLabel = scrollState.isHandoff ? 'Open full graph' : activeStage ? 'Explore this stage' : 'Open current graph';
  const dependencyStrip = scrollState.isHandoff ? stages.slice().reverse() : stages;

  return (
    <section className="relative min-h-[calc(100vh-7rem)] overflow-hidden py-8 lg:min-h-[720px] xl:min-h-[760px]" aria-labelledby="atlas-hero-title">
      <div className="absolute inset-0">
        <AtlasCanvas stages={stages} activeIndex={scrollState.activeIndex} isHandoff={scrollState.isHandoff} />
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_55%_38%,transparent_0%,rgba(3,8,20,0.18)_48%,rgba(3,8,20,0.7)_100%)]" />
        <div className="pointer-events-none absolute inset-y-0 left-0 w-[52%] bg-gradient-to-r from-[#030814] via-[#030814]/88 to-transparent" />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-[#030814] to-transparent" />
      </div>

      <div className="pointer-events-none absolute inset-x-0 top-2 z-10 hidden justify-center xl:flex" aria-hidden="true">
        <ol className="flex max-w-4xl items-center gap-2 rounded-lg border border-white/10 bg-[#07111f]/60 px-3 py-2 text-white/64 shadow-[0_20px_80px_rgba(2,6,23,0.28)] backdrop-blur-xl">
          {dependencyStrip.slice(0, 5).map((stage, index) => (
            <li key={stage.id} className="flex items-center gap-2">
              <span className="grid h-8 w-8 place-items-center rounded-md border border-white/12 bg-white/[0.06] text-[11px] font-semibold" style={{ color: stage.scene.accent }}>
                {stage.step}
              </span>
              <span className="max-w-28 truncate text-xs font-medium">{stage.title}</span>
              {index < dependencyStrip.length - 1 ? <ArrowRight className="h-3.5 w-3.5 text-white/34" /> : null}
            </li>
          ))}
        </ol>
      </div>

      {stages.map((stage, index) => (
        <AtlasFloatingCard key={stage.id} stage={stage} isActive={scrollState.activeIndex === index} isOverview={scrollState.isOverview} isHandoff={scrollState.isHandoff} />
      ))}

      <div className="relative z-20 flex min-h-[inherit] items-center">
        <div className="max-w-xl pb-16 pt-20">
          <p className="text-xs font-semibold uppercase tracking-[0.26em] text-blue-300">Immersive Supply-Chain Atlas</p>
          <motion.div
            key={scrollState.phase === 'handoff' ? 'handoff' : activeStage?.id ?? 'overview'}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, ease: 'easeOut' }}
          >
            <p className="mt-8 text-[11px] font-semibold uppercase tracking-[0.24em] text-white/46">{eyebrow}</p>
            <h1 id="atlas-hero-title" className="mt-3 font-display text-4xl leading-[1.04] text-white sm:text-5xl 2xl:text-6xl">
              {headline}
            </h1>
            <p className="mt-5 max-w-lg text-base leading-7 text-white/70 xl:text-lg xl:leading-8">{summary}</p>
          </motion.div>

          <div className="mt-7 flex flex-col gap-3 sm:flex-row">
            <Link
              to={primaryHref}
              className="inline-flex items-center justify-center gap-2 rounded-md bg-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-[0_18px_45px_rgba(37,99,235,0.28)] transition hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-300/70"
            >
              {primaryLabel}
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              to="/sources"
              className="inline-flex items-center justify-center gap-2 rounded-md border border-white/18 bg-white/[0.06] px-5 py-3 text-sm font-semibold text-white/84 transition hover:border-white/32 hover:bg-white/[0.1] focus:outline-none focus:ring-2 focus:ring-blue-300/50"
            >
              Read sources
              <HelpCircle className="h-4 w-4" />
            </Link>
          </div>

          <article className="mt-8 max-w-md rounded-lg border border-white/14 bg-[#081626]/72 p-5 text-white shadow-[0_22px_60px_rgba(2,6,23,0.24)] backdrop-blur-xl">
            <div className="flex items-start gap-4">
              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-lg border border-blue-300/25 bg-blue-400/10 text-blue-200">
                <Database className="h-5 w-5" />
              </span>
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-white/48">Research Insight</p>
                <h2 className="mt-1 text-lg font-semibold text-white">{insight.title}</h2>
                <p className="mt-2 text-sm leading-6 text-white/66">{insight.summary}</p>
                <p className="mt-3 text-xs font-medium text-white/48">Last updated: {insight.lastUpdated}</p>
              </div>
            </div>
          </article>
        </div>
      </div>

      <motion.div
        className="pointer-events-none absolute bottom-24 right-8 z-20 hidden max-w-xs rounded-lg border border-amber-200/22 bg-[#0b141f]/82 p-4 text-white shadow-[0_24px_70px_rgba(2,6,23,0.46)] backdrop-blur-xl xl:block"
        initial={false}
        animate={{ opacity: scrollState.isHandoff ? 1 : 0, y: scrollState.isHandoff ? 0 : 12 }}
        transition={{ duration: 0.32, ease: 'easeOut' }}
        aria-hidden={!scrollState.isHandoff}
      >
        <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-amber-200/80">Next</p>
        <p className="mt-2 text-sm leading-6 text-white/72">The atlas hands off to stage cards and the current report below.</p>
      </motion.div>

      <div className="absolute bottom-7 left-1/2 z-20 hidden -translate-x-1/2 items-center gap-3 rounded-full border border-white/12 bg-black/28 px-4 py-2 text-sm text-white/68 backdrop-blur lg:flex">
        <span className="h-5 w-3 rounded-full border border-white/38 before:mx-auto before:mt-1 before:block before:h-1.5 before:w-1.5 before:rounded-full before:bg-white/64" />
        <span>{scrollState.isHandoff ? 'Continue to the report below' : 'Scroll to explore the journey'}</span>
        <ArrowRight className="h-4 w-4 rotate-90" />
      </div>
    </section>
  );
}
