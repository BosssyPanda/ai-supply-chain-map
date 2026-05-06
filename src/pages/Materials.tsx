import { ArrowRight, Beaker, Factory, Mountain, Network, Shield, ShieldCheck, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';
import { ContentSection, MainContentGrid, PageShell, RightRail } from '../components/layout/PageShell';
import {
  ChapterCard,
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
import type { Confidence } from '../data/schema';
import { dataPending, getDerivedReportStats, getMaterialCategoryReports, pendingCopy } from '../lib/reportSelectors';

const data = loadExplorerData();
const snapshot = getResearchCsvSnapshot();
const categoryIcons = [Factory, Network, Shield, Beaker, Zap];

type SupplierRow = ReturnType<typeof getMaterialCategoryReports>[number]['supplierRows'][number];
type SupplierTableRow = {
  row: SupplierRow;
  category: ReturnType<typeof getMaterialCategoryReports>[number];
};

export function Materials(): JSX.Element {
  const stats = getDerivedReportStats(data, snapshot);
  const categories = getMaterialCategoryReports(data, snapshot);
  const supplierRows = categories.flatMap((category) => category.supplierRows.map((row) => ({ row, category }))).slice(0, 12);
  const highConfidenceCategories = categories.filter((category) => category.confidence === 'high').length;

  const columns: ReportTableColumn<SupplierTableRow>[] = [
    { id: 'company', header: 'Company / Proxy', render: ({ row }) => <span className="font-semibold text-foreground">{row.company_name}</span>, className: 'min-w-[210px]' },
    { id: 'focus', header: 'Material Focus', render: ({ row, category }) => row.mineral_or_material || category.title },
    { id: 'role', header: 'Supply Role', render: ({ row }) => row.role || row.mining_processing_refining || <DataPendingState />, className: 'min-w-[220px]' },
    { id: 'exposure', header: 'Exposure', render: ({ row }) => row.investable_under_project_rules === 'yes' ? 'Public proxy' : dataPending(row.investable_under_project_rules) },
    { id: 'risk', header: 'Bottleneck Risk', render: ({ category }) => category.bottleneckLevel ? <RiskBadge level={category.bottleneckLevel} /> : <DataPendingState /> },
    { id: 'strength', header: 'Why Relevant', render: ({ row }) => <span className="line-clamp-2">{row.why_relevant || pendingCopy}</span>, className: 'min-w-[340px]' },
  ];

  return (
    <PageShell>
      <HeroSection
        title="The Materials Behind AI"
        subtitle="AI infrastructure depends on a focused set of critical materials. From silicon and copper to rare earths, specialty chemicals, industrial gases, and battery materials, each layer plays a distinct role in powering compute at scale."
        action={<Link to="/sources" className="text-sm font-semibold text-accent">How to read this report</Link>}
        stats={
          <>
            <StatCard icon={<Mountain className="h-4 w-4" />} label="Critical materials" value={stats.materials} context="Rows in minerals_to_ai_inputs.csv" />
            <StatCard icon={<Factory className="h-4 w-4" />} label="Mapped supplier rows" value={stats.materialSuppliers} context="Rows in mineral_supplier_mapping.csv" to="/companies" />
            <StatCard icon={<ShieldCheck className="h-4 w-4" />} label="High-confidence categories" value={highConfidenceCategories} context="Of five material categories" to="/sources" />
            <StatCard icon={<Zap className="h-4 w-4" />} label="Last updated" value={stats.latestSourceDate ?? pendingCopy} context="Latest attached source date" to="/sources" />
          </>
        }
      />

      <MainContentGrid className="mt-8">
        <div className="space-y-6">
          <ContentSection>
            <SectionHeader eyebrow="The materials stack at a glance" title="Five foundational material layers" description="Categories are fixed around AI relevance, then populated from current material and supplier rows." />
            <div className="p-5">
              <StageFlow
                activeId="copper-conductors"
                items={categories.map((category, index) => {
                  const Icon = categoryIcons[index] ?? Beaker;
                  return {
                    id: category.id,
                    title: category.title,
                    description: category.usedIn,
                    icon: <Icon className="h-5 w-5" />,
                    meta: (
                      <span>
                        Key enablers
                        <br />
                        {category.keyEnablers.join(', ')}
                      </span>
                    ),
                  };
                })}
              />
            </div>
          </ContentSection>

          <ReportTable
            title="Notable companies across the materials chain"
            action={<Link to="/companies">View company universe</Link>}
            columns={columns}
            rows={supplierRows}
            getRowKey={({ row }) => row.supplier_id}
            emptyMessage="No supplier mappings are available for the current materials view."
          />

          <ContentSection>
            <SectionHeader title="Material category reports" description="Each card shows use case, bottleneck level, geography, public proxy, and source status." />
            <div className="grid gap-4 p-5 md:grid-cols-2 xl:grid-cols-3">
              {categories.map((category) => (
                <ChapterCard
                  key={category.id}
                  icon={<Beaker className="h-4 w-4" />}
                  title={category.title}
                  description={category.whyItMatters}
                  meta={
                    <span className="space-y-1">
                      <span className="block">Used in: {category.usedIn}</span>
                      <span className="block">Geography: {category.geography}</span>
                      <span className="block">Public proxy: {category.publicProxy?.company_name ?? pendingCopy}</span>
                      <span className="mt-2 block">{category.bottleneckLevel ? <RiskBadge level={category.bottleneckLevel} /> : <DataPendingState />}</span>
                    </span>
                  }
                  action={
                    <Link to="/sources" className="inline-flex items-center gap-1.5">
                      Source status
                      <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                  }
                />
              ))}
            </div>
          </ContentSection>
        </div>

        <RightRail>
          <InsightPanel title="Why copper and specialty materials matter" eyebrow="Focus">
            <p>Copper moves power and signal across the stack, while specialty chemicals and gases enable advanced node manufacturing and packaging. Constraints in these areas can ripple into chips, power, and data-center delivery.</p>
            <div className="mt-5 border-t border-border pt-4">
              <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">Key companies to watch</p>
              <div className="mt-3 space-y-2">
                {supplierRows.slice(0, 3).map(({ row }) => (
                  <div key={row.supplier_id} className="flex items-center justify-between gap-3 rounded-md border border-border bg-surface px-3 py-2 text-sm">
                    <span className="font-semibold text-foreground">{row.company_name}</span>
                    <span className="text-muted-foreground">{row.ticker_if_us_listed || row.country}</span>
                  </div>
                ))}
              </div>
            </div>
          </InsightPanel>

          <InsightPanel title="Sources and confidence" eyebrow="Research status">
            <p>Material coverage comes from mineral rows, supplier rows, and attached sources. Missing supplier geography, public proxies, or confidence remain marked as {pendingCopy}.</p>
            <div className="mt-4 flex flex-wrap gap-2">
              {categories.map((category) => (
                <span key={category.id}>{category.confidence ? <ConfidenceIndicator confidence={toConfidence(category.confidence)} /> : null}</span>
              ))}
            </div>
          </InsightPanel>
        </RightRail>
      </MainContentGrid>
    </PageShell>
  );
}

function toConfidence(value?: Confidence): Confidence | undefined {
  return value;
}
