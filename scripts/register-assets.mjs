// Test-only: lets Node's test runner import Next-style static image imports (`import img from '…/x.webp'`)
// by returning a StaticImageData stub. Registered AFTER tsx so this hook runs first.
import { register } from 'node:module';
register('./asset-loader.mjs', import.meta.url);
