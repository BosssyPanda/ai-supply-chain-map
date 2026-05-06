import { ArrowRight, CalendarClock, Layers3, Rocket, Shield, Sparkles, Star, Users } from 'lucide-react';
import { Link } from 'react-router-dom';
import { ContentSection, MainContentGrid, PageShell, RightRail } from '../components/layout/PageShell';
import {
  ChapterCard,
  CompanyMiniCard,
  DataPendingState,
  HeroSection,
  InsightPanel,
  PendingCell,
  ReportTable,
  SectionHeader,
  StatCard,
  StatusBadge,
  type ReportTableColumn,
} from '../components/report';
import { loadExplorerData } from '../data/loaders';
import type { SupplyChainNode } from '../data/schema';
import { getDerivedReportStats, getWatchlistGroups, pendingCopy } from '../lib/reportSelectors';

const data = loadExplorerData();

export function Watchlist(): JSX.Element {
  const groups = getWatchlistGroups(data);
  const stats = getDerivedReportStats(data);

  const columns: ReportTableColumn<SupplyChainNode>[] = [
    { id: 'company', header: 'Company', render: (node) => <span className="font-semibold text-foreground">{node.label}</span>, className: 'min-w-[210px]' },
    { id: 'segment', header: 'Segment', render: (node) => node.layer },
    { id: 'why', header: 'Why it matters', render: (node) => <span className="line-clamp-2">{node.whyItMatters || node.description || pendingCopy}</span>, className: 'min-w-[360px]' },
    { id: 'status', header: 'Status', render: (node) => <StatusBadge status={node.status} /> },
    { id: 'timing', header: 'Monitoring signal', render: (node) => node.publicPath || node.estimatedMaturity || <PendingCell /> },
    { id: 'confidence', header: 'Confidence', render: (node) => node.confidence || <PendingCell /> },
  ];

  return (
    <PageShell>
      <HeroSection
        title="Names to Watch"
        subtitle="Upcoming IPOs, SPAC candidates, and emerging private companies tracked for supply-chain relevance."
        action={<Link to="/sources" className="text-sm font-semibold text-accent">How to read this section</Link>}
        stats={
          <>
            <StatCard icon={<Rocket className="h-4 w-4" />} label="Public-path names" value={groups.publicPath.length} context="Rows with public-path notes" />
            <StatCard icon={<Users className="h-4 w-4" />} label="Private names tracked" value={groups.privateNames.length} context="Separated from public company tables" />
            <StatCard icon={<Star className="h-4 w-4" />} label="Near-term signals" value={groups.nearTermCatalysts.length} context="Maturity or public-path fields present" />
            <StatCard icon={<CalendarClock className="h-4 w-4" />} label="Last updated" value={stats.latestSourceDate ?? pendingCopy} context="Latest source date" to="/sources" />
          </>
        }
      />

      <MainContentGrid className="mt-8">
        <div className="space-y-6">
          <ContentSection>
            <SectionHeader title="At a glance" />
            <div className="grid gap-4 p-5 md:grid-cols-3">
              <ChapterCard icon={<Rocket className="h-4 w-4" />} title="IPO pipeline" description="Companies with public-path notes, S-1 references, or maturity signals in the research file." action={<span>{groups.publicPath.length} rows</span>} />
              <ChapterCard icon={<Users className="h-4 w-4" />} title="Private names" description="Private companies tracked for structural supply-chain relevance." action={<span>{groups.privateNames.length} rows</span>} />
              <ChapterCard icon={<Layers3 className="h-4 w-4" />} title="Emerging suppliers" description="Early-stage infrastructure, silicon, power, and component enablers to monitor." action={<span>{groups.emergingSuppliers.length} rows</span>} />
            </div>
          </ContentSection>

          <ContentSection>
            <SectionHeader title="Upcoming listings and public-path names" action={<Link to="/sources" className="text-sm font-semibold text-accent">View source status</Link>} />
            <div className="grid gap-4 p-5 md:grid-cols-2 xl:grid-cols-3">
              {(groups.publicPath.length > 0 ? groups.publicPath : groups.all).slice(0, 6).map((node) => (
                <CompanyMiniCard key={node.id} company={node} to={node.type === 'company' ? `/companies/${node.id}` : undefined} />
              ))}
            </div>
          </ContentSection>

          <ReportTable
            title="Tracked private and public-path names"
            description="Research tracking only. These rows are not investment advice."
            action={<Link to="/companies">View company universe</Link>}
            columns={columns}
            rows={groups.all}
            getRowKey={(node) => node.id}
            note="Pending cells mean the timing, maturity, or source-confidence field is not yet sourced enough for display."
          />
        </div>

        <RightRail>
          <InsightPanel title="Focus" eyebrow="Research tracking">
            <p>Tracking private and public-path names helps identify future exposure to critical technologies before they appear in the main public company universe.</p>
          </InsightPanel>

          <InsightPanel title="Key themes">
            <ul className="space-y-2">
              <li>Networking and interconnects</li>
              <li>Power and thermal infrastructure</li>
              <li>Memory and packaging bottlenecks</li>
              <li>Model and cloud demand formation</li>
            </ul>
          </InsightPanel>

          <InsightPanel title="What qualifies a name for inclusion">
            <div className="grid gap-2">
              <Criteria icon={<Shield className="h-4 w-4" />} text="Strategic role in the AI supply chain" />
              <Criteria icon={<Star className="h-4 w-4" />} text="Evidence of traction, product relevance, or design wins" />
              <Criteria icon={<CalendarClock className="h-4 w-4" />} text="Public-path, funding, maturity, or monitoring signal where known" />
              <Criteria icon={<Sparkles className="h-4 w-4" />} text="Potential impact on scalability, cost, or chokepoints" />
            </div>
          </InsightPanel>

          <InsightPanel title="Research-only boundary">
            <p>Watchlist rows are research tracking entries, not investment advice. Missing public-path or timing data shows as <DataPendingState />.</p>
            <Link to="/sources" className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-accent">
              Review methodology
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </InsightPanel>
        </RightRail>
      </MainContentGrid>
    </PageShell>
  );
}

function Criteria({ icon, text }: { icon: JSX.Element; text: string }): JSX.Element {
  return (
    <div className="flex items-center gap-3 rounded-md border border-border bg-surface px-3 py-2 text-sm text-muted-foreground">
      <span className="text-accent">{icon}</span>
      <span>{text}</span>
    </div>
  );
}
