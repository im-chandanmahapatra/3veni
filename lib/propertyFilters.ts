import type {
  EnquiryFormValues,
  EnquiryValidationErrors,
  LandPlot,
  PlotCategory,
  PlotSortOption,
} from '@/types/property';

export function filterAndSortPlots(
  plots: LandPlot[],
  category: PlotCategory,
  sortBy: PlotSortOption,
  searchQuery = ''
): LandPlot[] {
  const normalizedQuery = searchQuery.trim().toLowerCase();

  const filtered = plots.filter((plot) => {
    const matchesCategory = category === 'All' || plot.category === category;
    if (!matchesCategory) return false;

    if (!normalizedQuery) return true;
    return (
      plot.name.toLowerCase().includes(normalizedQuery) ||
      plot.location.toLowerCase().includes(normalizedQuery) ||
      plot.regionLabel.toLowerCase().includes(normalizedQuery) ||
      plot.shortDescription.toLowerCase().includes(normalizedQuery) ||
      plot.facing.toLowerCase().includes(normalizedQuery)
    );
  });

  const sorted = [...filtered];
  switch (sortBy) {
    case 'area-desc':
      sorted.sort((a, b) => b.areaSqFt - a.areaSqFt);
      break;
    case 'area-asc':
      sorted.sort((a, b) => a.areaSqFt - b.areaSqFt);
      break;
    case 'featured':
    default:
      break;
  }

  return sorted;
}

export function formatPlotArea(areaSqFt: number): string {
  if (!Number.isFinite(areaSqFt) || areaSqFt <= 0) {
    return 'Area on request';
  }
  const formattedSqFt = areaSqFt.toLocaleString('en-IN');
  if (areaSqFt >= 10890) {
    const acres = (areaSqFt / 43560).toFixed(2);
    return `${formattedSqFt} sq. ft. (${acres} Acre)`;
  }
  return `${formattedSqFt} sq. ft.`;
}

export function sanitizeEnquiryValues(raw: Partial<EnquiryFormValues>): EnquiryFormValues {
  return {
    fullName: String(raw.fullName ?? '').trim().slice(0, 120),
    phone: String(raw.phone ?? '').trim().slice(0, 32),
    email: String(raw.email ?? '').trim().slice(0, 160),
    interestedIn: String(raw.interestedIn ?? '').trim().slice(0, 140),
    preferredLocation: String(raw.preferredLocation ?? '').trim().slice(0, 140),
    message: String(raw.message ?? '').trim().slice(0, 1500),
    companyWebsite: String(raw.companyWebsite ?? '').trim().slice(0, 200),
  };
}

export function validateEnquiryForm(values: EnquiryFormValues): EnquiryValidationErrors {
  const errors: EnquiryValidationErrors = {};

  const trimmedName = values.fullName.trim();
  if (!trimmedName) {
    errors.fullName = 'Please enter your full name.';
  } else if (trimmedName.length < 2) {
    errors.fullName = 'Name must be at least 2 characters.';
  } else if (trimmedName.length > 100) {
    errors.fullName = 'Name must be 100 characters or fewer.';
  }

  const digitsOnly = values.phone.replace(/[^\d]/g, '');
  if (!values.phone.trim()) {
    errors.phone = 'Please provide a contact phone number.';
  } else if (digitsOnly.length < 10 || digitsOnly.length > 15) {
    errors.phone = 'Enter a valid 10 to 15 digit phone number.';
  }

  const trimmedEmail = values.email.trim();
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  if (!trimmedEmail) {
    errors.email = 'Please enter your email address.';
  } else if (!emailRegex.test(trimmedEmail) || trimmedEmail.length > 150) {
    errors.email = 'Enter a valid email address (e.g., name@domain.com).';
  }

  if (!values.interestedIn.trim()) {
    errors.interestedIn = 'Please select what you are enquiring about.';
  }

  if (!values.preferredLocation.trim()) {
    errors.preferredLocation = 'Please select a preferred land format or corridor.';
  }

  const trimmedMessage = values.message.trim();
  if (trimmedMessage.length > 0 && trimmedMessage.length < 8) {
    errors.message = 'If adding a note, please write at least 8 characters.';
  } else if (trimmedMessage.length > 1200) {
    errors.message = 'Notes must be 1,200 characters or fewer.';
  }

  return errors;
}
