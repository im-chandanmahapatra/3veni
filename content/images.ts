/**
 * Static image imports: Next gives every image intrinsic dimensions (no layout shift) and an automatic blur
 * placeholder (audit M8). Files stay in /public/images so existing URLs keep working.
 */
import aranyaRidge from '@/public/images/plots/aranya-ridge.webp';
import earthStudy from '@/public/images/plots/earth-architecture-study.webp';
import pranaValley from '@/public/images/plots/prana-valley.webp';
import shilaCrest from '@/public/images/plots/shila-crest.webp';
import taruOchre from '@/public/images/plots/taru-ochre.webp';
import vatikaBanyan from '@/public/images/plots/vatika-banyan.webp';
import mittiCourtyard from '@/public/images/homes/mitti-courtyard.webp';
import shilaPavilion from '@/public/images/homes/shila-pavilion.webp';
import vanaVerandah from '@/public/images/homes/vana-verandah.webp';
import emblem from '@/public/images/brand/3veni-emblem.webp';
import logo from '@/public/images/brand/3veni-logo.webp';

export const IMG = {
  aranyaRidge,
  earthStudy,
  pranaValley,
  shilaCrest,
  taruOchre,
  vatikaBanyan,
  mittiCourtyard,
  shilaPavilion,
  vanaVerandah,
  emblem,
  logo,
} as const;
