/**
 * RGex - A powerful, chainable regex builder platform
 * Enhanced with AI-powered features and modular architecture
 */

// Re-export types
export type {
	RegexBuilderOptions,
	PasswordValidationOptions,
	PasswordValidationResult,
	HumanTextPattern,
	ValidationRule,
	TextExtractionResult,
	ValidationExtractionResult,
} from '../types/index.js';

// Import for local use
import { RGex } from './core/RGex.js';
import type { RegexBuilderOptions } from '../types/index.js';

// Re-export core class
export { RGex } from './core/RGex.js';

// Re-export utilities
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
} from './utils/helpers.js';

export {
	parseHumanTextToRegex,
	parseHumanTextToValidation,
	getPatternSuggestions,
	// Shorter aliases for convenience
	humanToRegex,
	humanToValidation,
	getSuggestions,
	// Text-based aliases
	textToRegex,
	textToValidation,
	textToSuggestions,
	// Ultra-short aliases
	h2r,
	h2v,
	suggest,
	t2r,
	t2v,
} from './utils/humanText.js';

export {
	validatePassword,
	hasSequentialChars,
	hasRepeatingChars,
	hasCommonWords,
	getPasswordSuggestions,
	generateStrongPassword,
} from './utils/password.js';

// Re-export constants
export {
	REGEX_PATTERNS,
	HUMAN_PATTERNS,
	PATTERN_KEYWORDS,
	COMMON_PASSWORDS,
	SPECIAL_CHARS,
	SYMBOLS,
	UNICODE_RANGE,
} from './constants/patterns.js';

export {
	VALIDATION_PATTERNS,
	VALIDATION_KEYWORDS,
	LENGTH_PATTERNS,
} from './constants/validation.js';

// Re-export configuration
export { RGEX_CONFIG } from './config/index.js';

// Legacy function export for backward compatibility
export function rgex(pattern?: string, options?: RegexBuilderOptions): RGex {
	return new RGex(pattern, options);
}

// Default export for convenience
export default RGex;
