import { motion } from 'motion/react';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { cn } from '../../lib/cn';
import { pendingCopy } from '../../lib/reportSelectors';
import type { AtlasStage } from './atlasStages';

export function AtlasFloatingCard({
  stage,
  isActive,
  isOverview,
  isHandoff = false,
}: {
  stage: AtlasStage;
  isActive: boolean;
  isOverview: boolean;
  isHandoff?: boolean;
}): JSX.Element {
  const mappedExamples = stage.mappedExamples.length > 0 ? stage.mappedExamples.join(', ') : pendingCopy;
  const showDetails = isActive && !isHandoff;
  const showOverviewSummary = isOverview && !showDetails && !isHandoff;

  return (
    <motion.article
      className={cn(
        'absolute hidden rounded-lg border border-white/14 bg-[#081626]/82 text-white backdrop-blur-xl xl:block',
        showDetails ? 'w-[min(17rem,23vw)] p-4 shadow-[0_24px_70px_rgba(2,6,23,0.46)]' : 'w-44 p-3 shadow-[0_14px_35px_rgba(2,6,23,0.26)]',
        stage.scene.cardClassName,
        showDetails ? 'z-20 border-white/28 bg-[#0b1b2f]/92' : 'z-10',
      )}
      initial={false}
      animate={{
        opacity: isHandoff ? 0.18 : isOverview || isActive ? 1 : 0.54,
        y: showDetails ? -6 : isHandoff ? 8 : 0,
        scale: showDetails ? 1.02 : 0.92,
      }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em]" style={{ color: stage.scene.accent }}>
            {stage.step}
          </p>
          <h3 className="mt-1 text-base font-semibold leading-tight text-white">{stage.title}</h3>
        </div>
        <span className="mt-0.5 h-2.5 w-2.5 shrink-0 rounded-full shadow-[0_0_22px_currentColor]" style={{ color: stage.scene.accent, backgroundColor: stage.scene.accent }} />
      </div>

      {showOverviewSummary ? <p className="mt-2 line-clamp-2 text-xs leading-5 text-white/58">{stage.description}</p> : null}

      {showDetails ? <p className="mt-3 text-sm leading-6 text-white/68">{stage.description}</p> : null}

      {showDetails ? (
        <div className="mt-4 space-y-2 border-t border-white/10 pt-3 text-xs leading-5 text-white/58">
          <p>
            <span className="font-semibold text-white/76">Mapped examples:</span> {mappedExamples}
          </p>
          <p>
            <span className="font-semibold text-white/76">Key inputs:</span> {stage.keyEnablers.slice(0, 2).join(', ')}
          </p>
        </div>
      ) : null}

      {showDetails ? (
        <Link to={stage.href} className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-white transition hover:text-blue-200 focus:outline-none focus:ring-2 focus:ring-accent/50">
          Explore stage
          <ArrowRight className="h-4 w-4" />
        </Link>
      ) : null}
    </motion.article>
  );
}
