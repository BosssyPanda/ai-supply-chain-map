import { AlertTriangle, Building2, Database, HelpCircle, Network, Star } from 'lucide-react';
import { Link } from 'react-router-dom';
import { ContentSection, MainContentGrid, PageShell, RightRail } from '../components/layout/PageShell';
import { CompanyMiniCard, HeroSection, InsightPanel, SectionHeader, StatCard } from '../components/report';
import { getResearchStats, loadExplorerData } from '../data/loaders';

const data = loadExplorerData();
const researchStats = getResearchStats();

export function Overview(): JSX.Element {
  const companies = data.nodes.filter((node) => node.type === 'company');
  const critical = data.nodes.filter((node) => node.bottleneckLevel === 'critical');
  const watchlist = data.nodes.filter((node) => node.status === 'watchlist_private_ipo_spac' || node.type === 'watchlist');
  const highConfidence = data.nodes.filter((node) => node.confidence === 'high');

  return (
    <PageShell>
      <HeroSection
        title="The AI Supply Chain, Explained"
        subtitle="Tracing the critical infrastructure behind AI, from models and chips to data centers, power, cooling, and the raw materials that make it all possible."
        action={
          <Link to="/sources" className="inline-flex items-center gap-2 text-sm font-semibold text-accent">
            <HelpCircle className="h-4 w-4" />
            How to read this report
          </Link>
        }
        stats={
          <>
            <StatCard icon={<AlertTriangle className="h-4 w-4" />} label="Critical bottlenecks" value={critical.length} context="Mapped from current research rows" to="/bottlenecks" />
            <StatCard icon={<Building2 className="h-4 w-4" />} label="Companies" value={companies.length} context="CSV-backed company mappings" to="/companies" />
            <StatCard icon={<Network className="h-4 w-4" />} label="High-confidence nodes" value={highConfidence.length} context="Mapped across the research graph" to="/sources" />
            <StatCard icon={<Database className="h-4 w-4" />} label="Sources" value={researchStats.sources} context="Rows in sources.csv" to="/sources" />
          </>
        }
      />

      <MainContentGrid className="mt-8">
        <div className="space-y-6">
          <ContentSection>
            <SectionHeader
              eyebrow="The AI supply chain at a glance"
              title="AI infrastructure layers"
              description="A CSV-backed outline of the current supply-chain map. Each layer opens the preserved graph for deeper inspection."
              action={
                <Link to="/supply-chain" className="text-sm font-semibold text-accent">
                  Open supply-chain map
                </Link>
              }
            />
            <div className="grid gap-4 p-5 md:grid-cols-2 xl:grid-cols-4">
              {data.nodes
                .filter((node) => node.level === 1)
                .slice(0, 8)
                .map((node) => (
                  <Link key={node.id} to={`/supply-chain?focus=${node.id}`} className="rounded-lg border border-border bg-surface p-4 transition hover:border-accent/45 hover:bg-accent-soft/40">
                    <p className="font-semibold text-foreground">{node.label}</p>
                    <p className="mt-2 line-clamp-3 text-sm leading-6 text-muted-foreground">{node.description}</p>
                  </Link>
                ))}
            </div>
          </ContentSection>

          <ContentSection>
            <SectionHeader title="Critical bottleneck categories" description="Severity reflects mapped research fields, not an investment recommendation." />
            <div className="grid gap-3 p-5 md:grid-cols-2">
              {critical.slice(0, 10).map((node) => (
                <Link key={node.id} to={`/supply-chain?focus=${node.id}`} className="rounded-lg border border-border bg-surface p-4 transition hover:border-critical/45">
                  <p className="font-semibold text-foreground">{node.label}</p>
                  <p className="mt-1 text-sm text-muted-foreground">{node.layer}</p>
                </Link>
              ))}
            </div>
          </ContentSection>
        </div>

        <RightRail>
          <InsightPanel title="Why this report matters" eyebrow="Focus">
            <p>
              AI infrastructure depends on linked constraints across chips, data centers, power, cooling, materials, and source-backed company mappings.
            </p>
          </InsightPanel>
          <InsightPanel title="Names to watch" eyebrow="Research monitoring" action={<Link to="/watchlist">View names to watch</Link>}>
            <div className="space-y-3">
              {watchlist.slice(0, 3).map((node) => (
                <CompanyMiniCard key={node.id} company={node} to={node.type === 'company' ? `/companies/${node.id}` : undefined} />
              ))}
            </div>
          </InsightPanel>
          <InsightPanel title="Research-only boundary">
            <p>No buy, sell, or price-target recommendations. The product presents mapped exposure, bottleneck relevance, confidence, and sources.</p>
          </InsightPanel>
          <InsightPanel title="Research status" eyebrow="Data boundary">
            <p>Counts and relationships are derived from the current CSV-backed data. Missing fields remain visible as pending rather than filled with illustrative values.</p>
          </InsightPanel>
        </RightRail>
      </MainContentGrid>
    </PageShell>
  );
}
