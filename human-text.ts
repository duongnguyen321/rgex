/**
 * @fileoverview Human Text Entry Point - Exports only human text parsing functions for minimal bundle size
 * @module Human Text Processing
 * @category Utilities
 * @group Human Text Processing
 * @author duongnguyen321 - https://duonguyen.site
 */
export type {
	HumanTextPattern,
	TextExtractionResult,
	ValidationExtractionResult,
} from './types/index.js';
export {
	parseHumanTextToRegex,
	parseHumanTextToValidation,
	getPatternSuggestions,
	humanToRegex,
	humanToValidation,
	getSuggestions,
	textToRegex,
	textToValidation,
	textToSuggestions,
	h2r,
	h2v,
	suggest,
	t2r,
	t2v,
} from './src/utils/humanText.js';
