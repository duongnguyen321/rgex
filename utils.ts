/**
 * @fileoverview Utilities Entry Point - Exports only utility functions for minimal bundle size
 * @module Utilities
 * @category Utilities
 * @group Helper Functions
 * @author duongnguyen321 - https://duonguyen.site
 */
export {
	escapeRegex,
	optionsToFlags,
	flagsToOptions,
	isValidRegex,
	normalizeText,
	extractNumbers,
	calculateConfidence,
	mergePatterns,
	generateTestData,
	isSpecialChar,
	calculatePatternComplexity,
	debounce,
	deepClone,
	isValidEmail,
	formatConfidence,
	isDevelopment,
	getTimestamp,
} from './src/utils/helpers.js';
