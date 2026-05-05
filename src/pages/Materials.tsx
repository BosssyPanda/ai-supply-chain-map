import { Beaker, Mountain, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';
import { ContentSection, MainContentGrid, PageShell, RightRail } from '../components/layout/PageShell';
import { HeroSection, InsightPanel, ReportTable, RiskBadge, SectionHeader, StageFlow, StatCard, type ReportTableColumn } from '../components/report';
import { loadExplorerData } from '../data/loaders';
import type { SupplyChainNode } from '../data/schema';

const data = loadExplorerData();

export function Materials(): JSX.Element {
  const materials = data.nodes.filter((node) => node.type === 'material' || node.type === 'mineral');
  const companies = data.nodes.filter((node) => node.type === 'company');
  const materialCompanies = companies.filter((node) => /material|mineral|copper|chemical|rare|wafer|silicon/i.test([node.layer, node.description, node.tags.join(' ')].join(' ')));
  const highConfidence = materials.filter((node) => node.confidence === 'high');

  const columns: ReportTableColumn<SupplyChainNode>[] = [
    { id: 'material', header: 'Material', render: (node) => <span className="font-semibold text-foreground">{node.label}</span> },
    { id: 'role', header: 'AI use case', render: (node) => node.description, className: 'min-w-[320px]' },
    { id: 'used-in', header: 'Used in', render: (node) => node.whyItMatters },
    { id: 'risk', header: 'Bottleneck risk', render: (node) => node.bottleneckLevel ? <RiskBadge level={node.bottleneckLevel} /> : 'Data pending' },
    { id: 'confidence', header: 'Confidence', render: (node) => node.confidence ?? 'Data pending' },
  ];

  return (
    <PageShell>
      <HeroSection
        title="The Materials Behind AI"
        subtitle="AI infrastructure depends on materials and minerals that support chips, packaging, power delivery, cooling, and data-center build-out."
        action={<Link to="/sources" className="text-sm font-semibold text-accent">How to read this report</Link>}
        stats={
          <>
            <StatCard icon={<Mountain className="h-4 w-4" />} label="Mapped materials" value={materials.length} context="Material and mineral nodes" />
            <StatCard icon={<Beaker className="h-4 w-4" />} label="Mapped companies" value={materialCompanies.length} context="Company rows with material signals" to="/companies" />
            <StatCard icon={<ShieldCheck className="h-4 w-4" />} label="High-confidence mappings" value={highConfidence.length} context="Material rows marked high confidence" />
          </>
        }
      />

      <MainContentGrid className="mt-8">
        <div className="space-y-6">
          <ContentSection>
            <SectionHeader eyebrow="The materials stack at a glance" title="Foundational material groups" description="Current mapped material and mineral rows from the research data." />
            <div className="p-5">
              <StageFlow
                activeId={materials[0]?.id}
                items={materials.slice(0, 5).map((node) => ({
                  id: node.id,
                  title: node.label,
                  description: node.description,
                  meta: node.whyItMatters,
                }))}
              />
            </div>
          </ContentSection>

          <ContentSection>
            <SectionHeader title="Mapped materials and minerals" />
            <div className="p-5 pt-0">
              <ReportTable columns={columns} rows={materials} getRowKey={(node) => node.id} />
            </div>
          </ContentSection>
        </div>

        <RightRail>
          <InsightPanel title="Why materials matter" eyebrow="Focus">
            <p>Material constraints can ripple into power infrastructure, chipmaking, packaging, cooling, and data-center delivery timelines.</p>
          </InsightPanel>
          <InsightPanel title="Research boundary">
            <p>Material coverage reflects current source-backed rows. Missing supplier, geography, or confidence fields remain pending.</p>
          </InsightPanel>
        </RightRail>
      </MainContentGrid>
    </PageShell>
  );
}
