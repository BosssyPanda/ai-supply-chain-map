import { AlertTriangle, ArrowRight, Building2, Cloud, Cpu, Database, HelpCircle, Layers3, Mountain, Network, ShieldCheck, Zap } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { ContentSection, MainContentGrid, PageShell, RightRail } from '../components/layout/PageShell';
import {
  ChapterCard,
  CompanyMiniCard,
  ConfidenceIndicator,
  DataPendingState,
  HeroSection,
  InsightPanel,
  ReportTable,
  RiskBadge,
  SectionHeader,
  StageFlow,
  StatCard,
  type ReportTableColumn,
} from '../components/report';
import { getResearchCsvSnapshot, loadExplorerData } from '../data/loaders';
import type { SupplyChainNode } from '../data/schema';
import {
  dataPending,
  getDerivedReportStats,
  getFeaturedCompanies,
  getOverviewFocusCompanies,
  getOverviewStages,
  pendingCopy,
} from '../lib/reportSelectors';

const data = loadExplorerData();
const snapshot = getResearchCsvSnapshot();

const stageIcons = [Cloud, Cpu, Network, Zap, Mountain];

const chapterCards = [
  {
    title: 'Why AI depends on power',
    description: 'Large training and inference clusters turn power availability, grid interconnection, backup systems, and cooling into core infrastructure constraints.',
    bottleneck: 'Power & Cooling',
    to: '/bottlenecks',
  },
  {
    title: 'Why GPUs depend on HBM',
    description: 'Accelerators need high-bandwidth memory and advanced packaging. Capacity gaps in those components ripple into every compute buyer.',
    bottleneck: 'HBM Memory',
    to: '/supply-chain?focus=L2_HBM',
  },
  {
    title: 'Why data centers depend on transformers',
    description: 'Data-center deployment depends on power equipment, transmission capacity, and long-lead grid components as much as server availability.',
    bottleneck: 'Grid Equipment',
    to: '/bottlenecks',
  },
] as const;

export function Overview(): JSX.Element {
  const navigate = useNavigate();
  const stats = getDerivedReportStats(data, snapshot);
  const stages = getOverviewStages(data);
  const notableCompanies = getFeaturedCompanies(data, 5);
  const focusCompanies = getOverviewFocusCompanies(data, 3);

  const columns: ReportTableColumn<SupplyChainNode>[] = [
    {
      id: 'company',
      header: 'Company',
      render: (node) => (
        <div>
          <p className="font-semibold text-foreground">{node.label}</p>
          <p className="mt-0.5 text-xs text-muted-foreground">{dataPending(node.ticker)}</p>
        </div>
      ),
      className: 'min-w-[190px]',
    },
    { id: 'stage', header: 'Stage', render: (node) => node.layer, className: 'min-w-[180px]' },
    { id: 'role', header: 'Role', render: (node) => node.marketSegment || node.role || node.description, className: 'min-w-[240px]' },
    {
      id: 'exposure',
      header: 'Exposure',
      render: (node) => <span className="capitalize">{dataPending(node.purePlayScore)}</span>,
    },
    {
      id: 'risk',
      header: 'Bottleneck Risk',
      render: (node) => node.bottleneckLevel ? <RiskBadge level={node.bottleneckLevel} /> : <DataPendingState />,
    },
    {
      id: 'confidence',
      header: 'Confidence',
      render: (node) => node.confidence ? <ConfidenceIndicator confidence={node.confidence} /> : <DataPendingState />,
    },
  ];

  return (
    <PageShell>
      <HeroSection
        title="The AI Supply Chain, Explained"
        subtitle="Tracing the critical infrastructure behind AI — from models and chips to data centers, power, and the raw materials that make it all possible."
        action={
          <Link to="/sources" className="inline-flex items-center gap-2 text-sm font-semibold text-accent">
            <HelpCircle className="h-4 w-4" />
            How to read this report
          </Link>
        }
        stats={
          <>
            <StatCard icon={<AlertTriangle className="h-4 w-4" />} label="Critical bottlenecks" value={stats.criticalBottlenecks} context="Current rows marked critical" to="/bottlenecks" />
            <StatCard icon={<Building2 className="h-4 w-4" />} label="Mapped companies" value={stats.mappedCompanies} context="Public, private, and watchlist rows" to="/companies" />
            <StatCard icon={<ShieldCheck className="h-4 w-4" />} label="High-confidence mappings" value={`${stats.confidencePercent}%`} context="Share of scored nodes and edges" to="/sources" />
            <StatCard icon={<Database className="h-4 w-4" />} label="Last updated" value={stats.latestSourceDate ?? pendingCopy} context={`${stats.sources} source rows loaded`} to="/sources" />
          </>
        }
      />

      <MainContentGrid className="mt-8">
        <div className="space-y-6">
          <ContentSection>
            <SectionHeader
              eyebrow="AI supply chain at a glance"
              title="Five stages that explain the system"
              description="The overview compresses the larger research graph into a readable progression. The full graph remains available as the advanced explorer."
              action={
                <Link to="/supply-chain" className="inline-flex items-center gap-1.5 text-sm font-semibold text-accent">
                  Open advanced graph
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              }
            />
            <div className="p-5">
              <StageFlow
                activeId="data-centers-networking"
                items={stages.map((stage, index) => {
                  const Icon = stageIcons[index] ?? Network;
                  return {
                    id: stage.id,
                    title: `${index + 1}. ${stage.title}`,
                    description: stage.description,
                    icon: <Icon className="h-5 w-5" />,
                    meta: (
                      <span>
                        Key enablers
                        <br />
                        {stage.keyEnablers.join(', ')}
                      </span>
                    ),
                  };
                })}
              />
              <p className="mt-5 border-t border-border pt-4 text-center text-sm text-muted-foreground">
                Constraints in one stage can ripple across the entire AI infrastructure chain.
              </p>
            </div>
          </ContentSection>

          <ReportTable
            title="Notable companies across the supply chain"
            action={<Link to="/companies">View all companies</Link>}
            columns={columns}
            rows={notableCompanies}
            getRowKey={(node) => node.id}
            onRowClick={(node) => navigate(`/companies/${node.id}`)}
          />

          <ContentSection>
            <SectionHeader eyebrow="Editorial chapters" title="Where to explore deeper" description="Each chapter uses the same research data with a narrower lens." />
            <div className="grid gap-4 p-5 md:grid-cols-3">
              {chapterCards.map((chapter) => (
                <ChapterCard
                  key={chapter.title}
                  icon={<Layers3 className="h-4 w-4" />}
                  title={chapter.title}
                  description={chapter.description}
                  meta={
                    <span>
                      Key bottleneck: <span className="font-semibold text-foreground">{chapter.bottleneck}</span>
                    </span>
                  }
                  action={
                    <Link to={chapter.to} className="inline-flex items-center gap-1.5">
                      Explore chapter
                      <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                  }
                />
              ))}
            </div>
          </ContentSection>
        </div>

        <RightRail>
          <InsightPanel title="Why networking chips matter" eyebrow="Focus">
            <p>
              Networking chips move the data that training and inference depend on. As models scale, bandwidth demand can outpace supply, making switch silicon and optical components critical constraints.
            </p>
            <div className="mt-5 border-t border-border pt-4">
              <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">Key companies</p>
              <div className="mt-3 space-y-3">
                {focusCompanies.map((company) => (
                  <CompanyMiniCard key={company.id} company={company} to={`/companies/${company.id}`} />
                ))}
              </div>
            </div>
          </InsightPanel>

          <InsightPanel
            title="Methodology and sources"
            eyebrow="Credibility"
            action={
              <Link to="/sources" className="inline-flex items-center gap-1.5">
                View source methodology
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            }
          >
            <p>
              Mappings separate U.S.-listed companies, ADRs, private names, non-U.S.-listed bottlenecks, and non-investable chokepoints. Missing fields remain marked as {pendingCopy}.
            </p>
          </InsightPanel>

          <InsightPanel title="Research utilities" eyebrow="Advanced layer">
            <div className="space-y-2">
              <Link to="/comparisons" className="block rounded-md border border-border bg-surface px-3 py-2 text-sm font-semibold text-foreground hover:border-accent/45">
                Compare companies and stages
              </Link>
              <Link to="/alerts" className="block rounded-md border border-border bg-surface px-3 py-2 text-sm font-semibold text-foreground hover:border-accent/45">
                View research monitoring
              </Link>
            </div>
          </InsightPanel>
        </RightRail>
      </MainContentGrid>
    </PageShell>
  );
}
