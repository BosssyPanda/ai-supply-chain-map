import { Bell, CalendarClock, Database, Search, Shield, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';
import { ContentSection, MainContentGrid, PageShell, RightRail } from '../components/layout/PageShell';
import {
  ChapterCard,
  DataPendingState,
  HeroSection,
  InsightPanel,
  ReportTable,
  SectionHeader,
  StatCard,
  type ReportTableColumn,
} from '../components/report';
import { getResearchCsvSnapshot, loadExplorerData } from '../data/loaders';
import { getDerivedReportStats, pendingCopy } from '../lib/reportSelectors';

const data = loadExplorerData();
const snapshot = getResearchCsvSnapshot();

type AlertCategory = {
  id: string;
  category: string;
  purpose: string;
  currentState: string;
  source: string;
};

const alertCategories: AlertCategory[] = [
  {
    id: 'bottleneck-severity',
    category: 'Bottleneck severity changes',
    purpose: 'Monitor when criticality or severity fields are upgraded or downgraded.',
    currentState: pendingCopy,
    source: 'nodes.csv / edges.csv',
  },
  {
    id: 'company-role',
    category: 'Company role updates',
    purpose: 'Track role, segment, listing status, and source confidence changes.',
    currentState: pendingCopy,
    source: 'company CSV rows',
  },
  {
    id: 'source-updates',
    category: 'Source updates',
    purpose: 'Surface new source rows, reliability changes, and accessed-date updates.',
    currentState: pendingCopy,
    source: 'sources.csv',
  },
  {
    id: 'material-risk',
    category: 'Material risk updates',
    purpose: 'Monitor material bottleneck, geography, supplier, and confidence changes.',
    currentState: pendingCopy,
    source: 'materials and supplier mapping rows',
  },
];

export function Alerts(): JSX.Element {
  const stats = getDerivedReportStats(data, snapshot);
  const columns: ReportTableColumn<AlertCategory>[] = [
    { id: 'category', header: 'Alert category', render: (row) => <span className="font-semibold text-foreground">{row.category}</span>, className: 'min-w-[240px]' },
    { id: 'purpose', header: 'What it would monitor', render: (row) => row.purpose, className: 'min-w-[360px]' },
    { id: 'state', header: 'Current state', render: () => <DataPendingState /> },
    { id: 'source', header: 'Research source', render: (row) => row.source },
  ];

  return (
    <PageShell>
      <HeroSection
        title="Research Alerts"
        subtitle="A monitoring-style chapter for future changes in bottleneck severity, company roles, sources, and material risk. Step 3 keeps this intentional without pretending live alert automation exists."
        stats={
          <>
            <StatCard icon={<Shield className="h-4 w-4" />} label="Alert categories" value={alertCategories.length} context="Defined monitoring lanes" />
            <StatCard icon={<Bell className="h-4 w-4" />} label="Live alerts" value={pendingCopy} context="Automation not implemented in Step 3" />
            <StatCard icon={<Database className="h-4 w-4" />} label="Source rows watched" value={stats.sources} context="Potential source-update input" to="/sources" />
            <StatCard icon={<CalendarClock className="h-4 w-4" />} label="Last updated" value={stats.latestSourceDate ?? pendingCopy} context="Latest source date" />
          </>
        }
      />

      <MainContentGrid className="mt-8">
        <div className="space-y-6">
          <ContentSection>
            <SectionHeader title="Monitoring lanes" description="These are research operations categories, not trading signals." />
            <div className="grid gap-4 p-5 md:grid-cols-2">
              <ChapterCard icon={<Shield className="h-4 w-4" />} title="Bottleneck severity changes" description="Detect material changes to critical, high, medium, or low severity fields." meta={<DataPendingState />} />
              <ChapterCard icon={<Search className="h-4 w-4" />} title="Company role updates" description="Track changes to role, market segment, status, geography, confidence, or attached sources." meta={<DataPendingState />} />
              <ChapterCard icon={<Database className="h-4 w-4" />} title="Source updates" description="Show new source rows, stale source dates, and reliability changes." meta={<DataPendingState />} />
              <ChapterCard icon={<Zap className="h-4 w-4" />} title="Material risk updates" description="Monitor minerals, supplier mapping, geography, and material bottleneck fields." meta={<DataPendingState />} />
            </div>
          </ContentSection>

          <ReportTable
            title="Alert definitions"
            description="Future feature framing only. No automated alert feed is active in this step."
            action={<Link to="/sources">View source methodology</Link>}
            columns={columns}
            rows={alertCategories}
            getRowKey={(row) => row.id}
          />
        </div>

        <RightRail>
          <InsightPanel title="Why this page exists">
            <p>Research maps age as new source rows arrive, bottlenecks change, and companies move between private, public, ADR, or non-investable categories. This page makes that future monitoring surface intentional.</p>
          </InsightPanel>
          <InsightPanel title="Current implementation state" eyebrow="Step 3 boundary">
            <p>There is no live alert engine, subscription system, or background monitor in Step 3. Every unavailable value is marked as {pendingCopy}.</p>
          </InsightPanel>
          <InsightPanel title="Research-only boundary">
            <p>Alerts will describe source or mapping changes. They should stay research-only and avoid investment-advice or timing-signal framing.</p>
          </InsightPanel>
        </RightRail>
      </MainContentGrid>
    </PageShell>
  );
}
