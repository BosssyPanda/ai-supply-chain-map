import { describe, expect, it } from 'vitest';
import {
  getConfidenceBadge,
  getRiskBadge,
  getSourceStatusBadge,
  getStatusBadge,
} from './badgeRules';

describe('report badge rules', () => {
  it('maps company status values to allowed report badge concepts', () => {
    expect(getStatusBadge('us_listed_public')).toMatchObject({ label: 'U.S.-listed', tone: 'verified' });
    expect(getStatusBadge('us_listed_adr')).toMatchObject({ label: 'ADR', tone: 'partial' });
    expect(getStatusBadge('private')).toMatchObject({ label: 'Private', tone: 'pending' });
    expect(getStatusBadge('state_owned')).toMatchObject({ label: 'State-owned', tone: 'pending' });
    expect(getStatusBadge('non_us_listed')).toMatchObject({ label: 'Non-U.S.-listed', tone: 'pending' });
    expect(getStatusBadge('watchlist_private_ipo_spac')).toMatchObject({ label: 'Watchlist', tone: 'pending' });
    expect(getStatusBadge('etf_optional')).toBeUndefined();
  });

  it('maps severity and confidence to sparse semantic report badges', () => {
    expect(getRiskBadge('critical')).toMatchObject({ label: 'Critical', tone: 'critical' });
    expect(getRiskBadge('high')).toMatchObject({ label: 'High', tone: 'high' });
    expect(getRiskBadge('medium')).toMatchObject({ label: 'Medium', tone: 'medium' });
    expect(getRiskBadge('low')).toMatchObject({ label: 'Low', tone: 'low' });

    expect(getConfidenceBadge('high')).toMatchObject({ label: 'High', tone: 'verified' });
    expect(getConfidenceBadge('medium')).toMatchObject({ label: 'Medium', tone: 'partial' });
    expect(getConfidenceBadge('low')).toMatchObject({ label: 'Low', tone: 'pending' });
  });

  it('maps source coverage to verified, partial, and pending states', () => {
    expect(getSourceStatusBadge({ sourceCount: 3, confidence: 'high' })).toMatchObject({ label: 'Verified', tone: 'verified' });
    expect(getSourceStatusBadge({ sourceCount: 1, confidence: 'medium' })).toMatchObject({ label: 'Partial', tone: 'partial' });
    expect(getSourceStatusBadge({ sourceCount: 0, confidence: 'high' })).toMatchObject({ label: 'Pending', tone: 'pending' });
    expect(getSourceStatusBadge({ sourceCount: 2, confidence: 'low' })).toMatchObject({ label: 'Partial', tone: 'partial' });
  });
});
