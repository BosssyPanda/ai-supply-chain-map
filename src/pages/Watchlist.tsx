import { Layers3, Rocket, Star, Users } from 'lucide-react';
import { Link } from 'react-router-dom';
import { ContentSection, MainContentGrid, PageShell, RightRail } from '../components/layout/PageShell';
import { ChapterCard, CompanyMiniCard, HeroSection, InsightPanel, ReportTable, SectionHeader, StatCard, StatusBadge, type ReportTableColumn } from '../components/report';
import { loadExplorerData } from '../data/loaders';
import type { SupplyChainNode } from '../data/schema';

const data = loadExplorerData();

export function Watchlist(): JSX.Element {
  const watchlist = data.nodes.filter((node) => node.type === 'watchlist' || node.status === 'watchlist_private_ipo_spac' || node.status === 'private');
  const upcoming = watchlist.filter((node) => node.publicPath || node.estimatedMaturity);
  const privateNames = watchlist.filter((node) => node.status === 'private' || node.type === 'watchlist');

  const columns: ReportTableColumn<SupplyChainNode>[] = [
    { id: 'company', header: 'Company', render: (node) => <span className="font-semibold text-foreground">{node.label}</span> },
    { id: 'segment', header: 'Segment', render: (node) => node.layer },
    { id: 'why', header: 'Why it matters', render: (node) => <span className="line-clamp-2">{node.whyItMatters || node.description}</span>, className: 'min-w-[320px]' },
    { id: 'status', header: 'Status', render: (node) => <StatusBadge status={node.status} /> },
    { id: 'timing', header: 'Timing / Catalyst', render: (node) => node.estimatedMaturity || node.publicPath || 'Monitoring only' },
  ];

  return (
    <PageShell>
      <HeroSection
        title="Names to Watch"
        subtitle="Upcoming IPOs, SPAC candidates, and emerging private companies worth tracking across the AI supply chain."
        action={<Link to="/sources" className="text-sm font-semibold text-accent">How to read this section</Link>}
        stats={
          <>
            <StatCard icon={<Rocket className="h-4 w-4" />} label="Upcoming public-path names" value={upcoming.length} context="Rows with maturity or public-path notes" />
            <StatCard icon={<Users className="h-4 w-4" />} label="Private companies tracked" value={privateNames.length} context="Separated from ranked public companies" />
            <StatCard icon={<Star className="h-4 w-4" />} label="Watchlist names" value={watchlist.length} context="Current CSV-backed watchlist scope" />
          </>
        }
      />

      <MainContentGrid className="mt-8">
        <div className="space-y-6">
          <ContentSection>
            <SectionHeader title="At a glance" />
            <div className="grid gap-4 p-5 md:grid-cols-3">
              <ChapterCard icon={<Rocket className="h-4 w-4" />} title="IPO pipeline" description="Companies preparing for public-market paths or later-stage financing signals." />
              <ChapterCard icon={<Users className="h-4 w-4" />} title="Private names" description="High-potential private companies shaping the AI supply chain." />
              <ChapterCard icon={<Layers3 className="h-4 w-4" />} title="Emerging suppliers" description="Early-stage infrastructure and component enablers to monitor." />
            </div>
          </ContentSection>

          <ContentSection>
            <SectionHeader title="Upcoming listings" action={<Link to="/companies" className="text-sm font-semibold text-accent">View company universe</Link>} />
            <div className="grid gap-4 p-5 md:grid-cols-2 xl:grid-cols-3">
              {watchlist.slice(0, 6).map((node) => (
                <CompanyMiniCard key={node.id} company={node} to={node.type === 'company' ? `/companies/${node.id}` : undefined} />
              ))}
            </div>
          </ContentSection>

          <ContentSection>
            <SectionHeader title="Companies worth following" />
            <div className="p-5 pt-0">
              <ReportTable columns={columns} rows={watchlist} getRowKey={(node) => node.id} />
            </div>
          </ContentSection>
        </div>

        <RightRail>
          <InsightPanel title="Focus" eyebrow="Monitoring">
            <p>Tracking names early helps identify future exposure to critical technologies before they appear in major public company datasets.</p>
          </InsightPanel>
          <InsightPanel title="What qualifies a name">
            <ul className="space-y-2">
              <li>Strategic role in the AI supply chain.</li>
              <li>Evidence of product traction or design wins.</li>
              <li>Near-term public path, funding, or maturity signal where known.</li>
            </ul>
          </InsightPanel>
        </RightRail>
      </MainContentGrid>
    </PageShell>
  );
}
