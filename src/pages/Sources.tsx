import { Database, ExternalLink, ShieldCheck } from 'lucide-react';
import { ContentSection, MainContentGrid, PageShell, RightRail } from '../components/layout/PageShell';
import { ConfidenceIndicator, HeroSection, InsightPanel, ReportTable, SectionHeader, StatCard, type ReportTableColumn } from '../components/report';
import { loadExplorerData } from '../data/loaders';
import type { Confidence, Source } from '../data/schema';

const data = loadExplorerData();

export function Sources(): JSX.Element {
  const datedSources = data.sources.filter((source) => source.dateAccessed);
  const highReliability = data.sources.filter((source) => source.reliabilityScore === 'high');

  const columns: ReportTableColumn<Source>[] = [
    {
      id: 'source',
      header: 'Source',
      render: (source) => (
        <a href={source.url} target="_blank" rel="noreferrer" className="inline-flex items-start gap-2 font-semibold text-foreground hover:text-accent">
          <span>{source.title}</span>
          <ExternalLink className="mt-0.5 h-3.5 w-3.5 shrink-0 text-accent" />
        </a>
      ),
      className: 'min-w-[360px]',
    },
    { id: 'publisher', header: 'Publisher', render: (source) => source.publisher },
    { id: 'accessed', header: 'Date accessed', render: (source) => source.dateAccessed ?? 'Data pending' },
    { id: 'confidence', header: 'Reliability', render: (source) => <ConfidenceIndicator confidence={toConfidence(source.reliabilityScore)} /> },
  ];

  return (
    <PageShell>
      <HeroSection
        title="Sources and Confidence"
        subtitle="A research-only index of the source rows that support the supply-chain map, company mappings, material rows, and bottleneck claims."
        stats={
          <>
            <StatCard icon={<Database className="h-4 w-4" />} label="Source rows" value={data.sources.length} context="Rows loaded from sources.csv" />
            <StatCard icon={<Database className="h-4 w-4" />} label="Dated sources" value={datedSources.length} context="Rows with accessed dates" />
            <StatCard icon={<ShieldCheck className="h-4 w-4" />} label="High reliability" value={highReliability.length} context="Rows marked high reliability" />
          </>
        }
      />

      <MainContentGrid className="mt-8">
        <ContentSection>
          <SectionHeader title="Source index" description="Source values come directly from the current CSV-backed data layer." />
          <div className="p-5 pt-0">
            <ReportTable columns={columns} rows={data.sources} getRowKey={(source) => source.id} />
          </div>
        </ContentSection>

        <RightRail>
          <InsightPanel title="How to read confidence">
            <p>Confidence and reliability are research metadata. Missing values remain visible as pending rather than being filled with illustrative placeholders.</p>
          </InsightPanel>
          <InsightPanel title="Data boundary">
            <p>This page does not add claims beyond the loaded source rows. Methodology and update-history details should stay tied to source-backed data.</p>
          </InsightPanel>
        </RightRail>
      </MainContentGrid>
    </PageShell>
  );
}

function toConfidence(value?: Confidence | string): Confidence | undefined {
  return value === 'high' || value === 'medium' || value === 'low' ? value : undefined;
}
