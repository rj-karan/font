// ============================================================================
// Centralized integration → visual identity mapping.
// ----------------------------------------------------------------------------
// We deliberately do NOT download third-party raster logos (licensing +
// quality risk in an offline sandbox). Instead every integration gets a
// consistent SVG "brand chip": a fixed-size rounded square in the vendor's
// primary brand color with either a lucide glyph or the vendor's initials,
// rendered by <IntegrationLogo /> (src/components/common/IntegrationLogo.tsx).
// This keeps sizing and visual weight perfectly consistent across the whole
// app (source pills, integration cards, repository badges, top-bar chips).
// ============================================================================

import {
  Github,
  Gitlab,
  Cloud,
  MessageSquare,
  Ticket,
  Radar,
  Bug,
  ShieldHalf,
  UserCheck,
  ScanSearch,
  Package,
  type LucideIcon,
} from 'lucide-react';

export interface IntegrationVisual {
  label: string;
  color: string; // brand-ish accent used for the chip background
  icon: LucideIcon;
}

export const INTEGRATION_VISUALS: Record<string, IntegrationVisual> = {
  github: { label: 'GitHub', color: '#24292e', icon: Github },
  gitlab: { label: 'GitLab', color: '#e2492a', icon: Gitlab },
  aws: { label: 'AWS', color: '#ff9900', icon: Cloud },
  azure: { label: 'Azure', color: '#0078d4', icon: Cloud },
  gcp: { label: 'GCP', color: '#4285f4', icon: Cloud },
  slack: { label: 'Slack', color: '#611f69', icon: MessageSquare },
  jira: { label: 'Jira', color: '#0052cc', icon: Ticket },
  siem: { label: 'SIEM', color: '#8b949e', icon: Radar },
  edr: { label: 'EDR', color: '#8b949e', icon: ShieldHalf },
  xdr: { label: 'XDR', color: '#06b6d4', icon: Radar },
  bugbounty: { label: 'Bug Bounty', color: '#7c3aed', icon: Bug },
  iam: { label: 'IAM', color: '#f97316', icon: UserCheck },
  sast: { label: 'SAST', color: '#2563eb', icon: ScanSearch },
  sca: { label: 'SCA', color: '#22c55e', icon: Package },
};

export function getIntegrationVisual(key: string): IntegrationVisual {
  return INTEGRATION_VISUALS[key] ?? { label: key, color: '#8b949e', icon: ShieldHalf };
}
