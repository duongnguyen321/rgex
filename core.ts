/**
 * @fileoverview Core RGex Entry Point - Exports only the RGex class and essential types for minimal bundle size
 * @module Core
 * @category Core
 * @group RGex Builder
 * @author duongnguyen321 - https://duonguyen.site
 */
export type { RegexBuilderOptions } from './types/index.js';
export { RGex } from './src/core/RGex.js';
export { RGEX_CONFIG } from './src/config/index.js';

// Import for local use
import { RGex } from './src/core/RGex.js';
import type { RegexBuilderOptions } from './types/index.js';

/**
 * Factory function to create a new `RGex` instance.
 */
export function rgex(pattern?: string, options?: RegexBuilderOptions): RGex {
	return new RGex(pattern, options);
}

export default RGex;
