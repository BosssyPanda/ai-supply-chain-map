import { AlertTriangle, ShieldCheck, TriangleAlert } from 'lucide-react';
import { Link } from 'react-router-dom';
import { ContentSection, MainContentGrid, PageShell, RightRail } from '../components/layout/PageShell';
import { ChapterCard, HeroSection, InsightPanel, ReportTable, RiskBadge, SectionHeader, StatCard, type ReportTableColumn } from '../components/report';
import { loadExplorerData } from '../data/loaders';
import type { SupplyChainNode } from '../data/schema';

const data = loadExplorerData();

export function Bottlenecks(): JSX.Element {
  const bottlenecks = data.nodes.filter((node) => node.bottleneckLevel);
  const critical = bottlenecks.filter((node) => node.bottleneckLevel === 'critical');
  const high = bottlenecks.filter((node) => node.bottleneckLevel === 'high');
  const highConfidence = bottlenecks.filter((node) => node.confidence === 'high');

  const columns: ReportTableColumn<SupplyChainNode>[] = [
    { id: 'bottleneck', header: 'Bottleneck', render: (node) => <span className="font-semibold text-foreground">{node.label}</span> },
    { id: 'stage', header: 'Stage', render: (node) => node.layer },
    { id: 'severity', header: 'Severity', render: (node) => <RiskBadge level={node.bottleneckLevel} /> },
    { id: 'why', header: 'Why it matters', render: (node) => <span className="line-clamp-2">{node.whyItMatters || node.description}</span>, className: 'min-w-[360px]' },
    { id: 'confidence', header: 'Confidence', render: (node) => node.confidence ?? 'Data pending' },
  ];

  return (
    <PageShell>
      <HeroSection
        title="Critical Bottlenecks in the AI Supply Chain"
        subtitle="Identifying where capacity constraints, supply concentration, and infrastructure dependencies matter most for AI build-out."
        stats={
          <>
            <StatCard icon={<AlertTriangle className="h-4 w-4" />} label="Critical bottlenecks" value={critical.length} context="Rows marked critical" />
            <StatCard icon={<TriangleAlert className="h-4 w-4" />} label="High-risk categories" value={high.length} context="Rows marked high severity" />
            <StatCard icon={<ShieldCheck className="h-4 w-4" />} label="High-confidence mappings" value={highConfidence.length} context="Source-backed bottleneck rows" />
          </>
        }
      />

      <MainContentGrid className="mt-8">
        <div className="space-y-6">
          <ContentSection>
            <SectionHeader eyebrow="The bottleneck map at a glance" title="Highest-severity mapped areas" />
            <div className="grid gap-4 p-5 md:grid-cols-2 xl:grid-cols-3">
              {bottlenecks.slice(0, 6).map((node) => (
                <ChapterCard
                  key={node.id}
                  icon={<AlertTriangle className="h-4 w-4" />}
                  title={node.label}
                  description={node.description}
                  meta={<RiskBadge level={node.bottleneckLevel} />}
                  action={<Link to={`/supply-chain?focus=${node.id}`}>Explore in graph</Link>}
                />
              ))}
            </div>
          </ContentSection>

          <ContentSection>
            <SectionHeader title="Notable bottlenecks across the chain" />
            <div className="p-5 pt-0">
              <ReportTable columns={columns} rows={bottlenecks} getRowKey={(node) => node.id} />
            </div>
          </ContentSection>
        </div>

        <RightRail>
          <InsightPanel title="Why these bottlenecks matter">
            <p>Constraints in a few chokepoints can cascade across the AI supply chain, delaying deployments and raising infrastructure dependency risk.</p>
          </InsightPanel>
          <InsightPanel title="Research-only boundary">
            <p>Severity describes mapped supply-chain constraint relevance. It is not a trading signal or investment recommendation.</p>
          </InsightPanel>
        </RightRail>
      </MainContentGrid>
    </PageShell>
  );
}
