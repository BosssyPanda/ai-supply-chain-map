import { AlertTriangle, ArrowRight, Cpu, Database, Network, PackageOpen, Shield, ShieldCheck, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';
import { ContentSection, MainContentGrid, PageShell, RightRail } from '../components/layout/PageShell';
import {
  ChapterCard,
  CompanyMiniCard,
  ConfidenceIndicator,
  DataPendingState,
  HeroSection,
  InsightPanel,
  PendingCell,
  ReportTable,
  RiskBadge,
  SectionHeader,
  SourceStatusBadge,
  StatCard,
  type ReportTableColumn,
} from '../components/report';
import { loadExplorerData } from '../data/loaders';
import type { SupplyChainNode } from '../data/schema';
import { getBottleneckCategoryReports, getDerivedReportStats, getRankedBottleneckNodes, pendingCopy } from '../lib/reportSelectors';

const data = loadExplorerData();
const categoryIcons = [Cpu, Database, PackageOpen, Network, Zap, Shield];
const severityScale = ['critical', 'high', 'medium', 'low'] as const;

export function Bottlenecks(): JSX.Element {
  const stats = getDerivedReportStats(data);
  const categories = getBottleneckCategoryReports(data);
  const bottlenecks = getRankedBottleneckNodes(data);
  const highConfidence = bottlenecks.filter((node) => node.confidence === 'high').length;
  const exposedCompanies = uniqueById(categories.flatMap((category) => category.affectedCompanies)).slice(0, 6);

  const columns: ReportTableColumn<SupplyChainNode>[] = [
    { id: 'bottleneck', header: 'Bottleneck', render: (node) => <span className="font-semibold text-foreground">{node.label}</span>, className: 'min-w-[220px]' },
    { id: 'stage', header: 'Stage', render: (node) => node.layer },
    { id: 'severity', header: 'Severity', render: (node) => node.bottleneckLevel ? <RiskBadge level={node.bottleneckLevel} /> : <DataPendingState /> },
    { id: 'why', header: 'Why it matters', render: (node) => <span className="line-clamp-2">{node.whyItMatters || node.description || pendingCopy}</span>, className: 'min-w-[360px]' },
    { id: 'substitutability', header: 'Substitutability', render: (node) => node.substitutability || <PendingCell /> },
    { id: 'confidence', header: 'Confidence', render: (node) => node.confidence ? <ConfidenceIndicator confidence={node.confidence} /> : <PendingCell /> },
    { id: 'source-state', header: 'Source state', render: (node) => <SourceStatusBadge sourceCount={node.sourceIds.length} confidence={node.confidence} /> },
  ];

  return (
    <PageShell>
      <HeroSection
        title="Critical Bottlenecks in the AI Supply Chain"
        subtitle="Identifying where capacity constraints, supply concentration, and infrastructure dependencies matter most for AI build-out."
        stats={
          <>
            <StatCard icon={<AlertTriangle className="h-4 w-4" />} label="Critical bottlenecks" value={stats.criticalBottlenecks} context="Rows marked critical" />
            <StatCard icon={<Shield className="h-4 w-4" />} label="High-risk items" value={stats.highRiskItems} context="Critical or high severity" />
            <StatCard icon={<ShieldCheck className="h-4 w-4" />} label="High-confidence bottlenecks" value={highConfidence} context="Bottleneck rows marked high confidence" />
            <StatCard icon={<Zap className="h-4 w-4" />} label="Last updated" value={stats.latestSourceDate ?? pendingCopy} context="Latest source date" to="/sources" />
          </>
        }
      />

      <MainContentGrid className="mt-8">
        <div className="space-y-6">
          <ContentSection>
            <SectionHeader eyebrow="The bottleneck map at a glance" title="Six constraint categories" description="Categories are serious analytical lenses, not alert chips or trading signals." />
            <div className="grid gap-4 p-5 md:grid-cols-2 xl:grid-cols-3">
              {categories.map((category, index) => {
                const Icon = categoryIcons[index] ?? AlertTriangle;
                return (
                  <ChapterCard
                    key={category.id}
                    icon={<Icon className="h-4 w-4" />}
                    title={category.title}
                    description={category.whyItMatters}
                    meta={
                      <span className="space-y-1">
                        <span className="block">Stage: {category.stage}</span>
                        <span className="block">Constraint: {category.constraintType}</span>
                        <span className="block">Confidence: {category.confidence ? <ConfidenceIndicator confidence={category.confidence} /> : <DataPendingState />}</span>
                        <span className="mt-2 block">{category.severity ? <RiskBadge level={category.severity} /> : <DataPendingState />}</span>
                      </span>
                    }
                  />
                );
              })}
            </div>
            <div className="border-t border-border px-5 pb-5">
              <div className="mt-4 flex flex-wrap items-center justify-between gap-3 text-xs text-muted-foreground">
                <span className="font-semibold uppercase tracking-[0.16em]">Severity progression</span>
                <div className="flex flex-wrap items-center gap-2">
                  {severityScale.map((level) => (
                    <RiskBadge key={level} level={level} />
                  ))}
                </div>
              </div>
            </div>
          </ContentSection>

          <ContentSection>
            <SectionHeader eyebrow="Major bottleneck themes" title="Dependency chains behind the constraints" />
            <div className="grid gap-4 p-5 lg:grid-cols-3">
              <ThemeCard title="Why GPUs depend on HBM" from="GPU" to="HBM" description="Accelerators cannot deliver full performance without high-bandwidth memory and package capacity." />
              <ThemeCard title="Why data centers depend on transformers" from="Grid" to="Data centers" description="Power equipment and interconnection queues can constrain when compute capacity comes online." />
              <ThemeCard title="Why AI depends on power" from="Power" to="Compute" description="Energy availability and cooling reliability shape where AI infrastructure can grow." />
            </div>
          </ContentSection>

          <ReportTable
            title="Notable bottlenecks across the chain"
            action={<Link to="/sources">Methodology</Link>}
            columns={columns}
            rows={bottlenecks}
            getRowKey={(node) => node.id}
            note="Pending cells mark bottleneck attributes that remain source-needed; severity and confidence are shown only when present in the research data."
          />
        </div>

        <RightRail>
          <InsightPanel title="Why these bottlenecks matter">
            <p>Constraints in a few chokepoints can cascade across the AI supply chain, delaying deployments and limiting who can build at scale. Severity describes structural supply-chain relevance only.</p>
          </InsightPanel>

          <InsightPanel title="Key companies most exposed" eyebrow="Mapped companies">
            <div className="space-y-3">
              {exposedCompanies.map((company) => (
                <CompanyMiniCard key={company.id} company={company} to={company.type === 'company' ? `/companies/${company.id}` : undefined} />
              ))}
            </div>
            <Link to="/companies" className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-accent">
              View all companies
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </InsightPanel>

          <InsightPanel title="Methodology note" eyebrow="Research-only">
            <p>Bottleneck levels come from CSV-backed severity and criticality fields. This page stays research-only and does not provide investment advice.</p>
          </InsightPanel>

          <InsightPanel title="How to read severity" eyebrow="Report scale">
            <div className="space-y-2">
              <p><span className="font-semibold text-foreground">Critical</span> and <span className="font-semibold text-foreground">high</span> indicate structural constraints with stronger ripple risk.</p>
              <p><span className="font-semibold text-foreground">Medium</span> and <span className="font-semibold text-foreground">low</span> remain mapped where the dependency is relevant but less constraining.</p>
            </div>
          </InsightPanel>
        </RightRail>
      </MainContentGrid>
    </PageShell>
  );
}

function ThemeCard({ title, from, to, description }: { title: string; from: string; to: string; description: string }): JSX.Element {
  return (
    <article className="rounded-lg border border-border bg-surface p-4 shadow-report-soft">
      <h3 className="text-base font-semibold text-foreground">{title}</h3>
      <div className="mt-4 flex items-center gap-3 text-sm font-semibold text-muted-foreground">
        <span className="rounded-md border border-border bg-surface-muted px-3 py-2">{from}</span>
        <ArrowRight className="h-4 w-4 text-accent" />
        <span className="rounded-md border border-border bg-surface-muted px-3 py-2">{to}</span>
      </div>
      <p className="mt-4 text-sm leading-6 text-muted-foreground">{description}</p>
    </article>
  );
}

function uniqueById(nodes: SupplyChainNode[]): SupplyChainNode[] {
  const map = new Map<string, SupplyChainNode>();
  nodes.forEach((node) => {
    if (!map.has(node.id)) map.set(node.id, node);
  });
  return Array.from(map.values());
}
