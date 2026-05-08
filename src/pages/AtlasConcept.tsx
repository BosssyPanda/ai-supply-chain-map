import { lazy, Suspense } from 'react';

const AtlasConceptPage = lazy(() => import('../components/atlas/AtlasConceptPage').then((module) => ({ default: module.AtlasConceptPage })));

export function AtlasConcept(): JSX.Element {
  return (
    <Suspense
      fallback={
        <div className="grid min-h-[70vh] place-items-center bg-[#030814] px-6 text-center text-sm text-white/64">
          Loading atlas...
        </div>
      }
    >
      <AtlasConceptPage />
    </Suspense>
  );
}
