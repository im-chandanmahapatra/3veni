import { PARCELS } from '@/content/parcels';
import { RESIDENCES } from '@/content/residences';
import { GENERAL_INTERESTS } from '@/lib/enquiry/validation';

/**
 * Options for "Interested in" — parcel names, the two general topics, and each concept home as "(Future Updates)".
 * `?interest=` deep links are accepted only if they match one of these exactly (V1 echoed arbitrary text into the form).
 */
export const FUTURE_UPDATE_SUFFIX = ' (Future Updates)';

export function getInterestOptions(): string[] {
  return [
    ...PARCELS.map((p) => p.name),
    GENERAL_INTERESTS[0],
    ...RESIDENCES.map((r) => `${r.title}${FUTURE_UPDATE_SUFFIX}`),
    GENERAL_INTERESTS[1],
  ];
}

export function resolveInterest(raw: string | string[] | undefined): string | undefined {
  const value = (Array.isArray(raw) ? raw[0] : raw)?.trim();
  if (!value) return undefined;
  return getInterestOptions().find((o) => o === value);
}
