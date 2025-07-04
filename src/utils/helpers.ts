/**
 * RGex Helper Utilities
 * Common utility functions used throughout the library
 */

import type { RegexBuilderOptions } from '../../types/index.js';

/**
 * Escape special regex characters in a string
 */
export function escapeRegex(text: string): string {
	return text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/**
 * Convert options object to regex flags string
 */
export function optionsToFlags(options: RegexBuilderOptions): string {
	const flags: string[] = [];

	if (options.global) flags.push('g');
	if (options.ignoreCase) flags.push('i');
	if (options.multiline) flags.push('m');
	if (options.dotAll) flags.push('s');
	if (options.unicode) flags.push('u');
	if (options.sticky) flags.push('y');

	if (options.flags) {
		for (const flag of options.flags) {
			if (!flags.includes(flag)) {
				flags.push(flag);
			}
		}
	}

	return flags.join('');
}

/**
 * Convert flags string to options object
 */
export function flagsToOptions(flags: string): RegexBuilderOptions {
	const options: RegexBuilderOptions = {};

	if (flags.includes('g')) options.global = true;
	if (flags.includes('i')) options.ignoreCase = true;
	if (flags.includes('m')) options.multiline = true;
	if (flags.includes('s')) options.dotAll = true;
	if (flags.includes('u')) options.unicode = true;
	if (flags.includes('y')) options.sticky = true;

	return options;
}

/**
 * Validate if a string is a valid regex pattern
 */
export function isValidRegex(pattern: string): boolean {
	try {
		new RegExp(pattern);
		return true;
	} catch {
		return false;
	}
}

/**
 * Clean and normalize input text for processing
 */
export function normalizeText(text: string): string {
	return text.toLowerCase().trim().replace(/\s+/g, ' ');
}

/**
 * Extract numeric values from text
 */
export function extractNumbers(text: string): number[] {
	const matches = text.match(/\d+/g);
	return matches ? matches.map(Number) : [];
}

/**
 * Calculate confidence score based on multiple factors
 */
export function calculateConfidence(
	baseScore: number,
	hasTestValue: boolean,
	testPassed: boolean,
	complexity: number = 1
): number {
	let confidence = baseScore;

	if (hasTestValue) {
		confidence += testPassed ? 0.15 : -0.2;
	}

	// Adjust for pattern complexity
	confidence *= complexity;

	return Math.max(0, Math.min(1, confidence));
}

/**
 * Merge multiple regex patterns with OR operator
 */
export function mergePatterns(
	patterns: string[],
	useGroups: boolean = true
): string {
	if (patterns.length === 0) return '';
	if (patterns.length === 1) return patterns[0] ?? '';

	const joinedPatterns = patterns.join('|');
	return useGroups ? `(${joinedPatterns})` : joinedPatterns;
}

/**
 * Generate random test data for pattern validation
 */
export function generateTestData(type: string): string[] {
	const testData: Record<string, string[]> = {
		email: ['test@example.com', 'user.name+tag@domain.co.uk', 'invalid.email'],
		phone: ['+1234567890', '1234567890', '123'],
		url: ['https://example.com', 'http://test.org/path', 'not-a-url'],
		number: ['123', '-45.67', '0.5', 'not-a-number'],
		date: ['2023-12-25', '2023-13-45', 'not-a-date'],
		time: ['14:30', '25:61', 'not-a-time'],
	};

	return testData[type] ?? [];
}

/**
 * Check if a character is a special regex character
 */
export function isSpecialChar(char: string): boolean {
	return /[.*+?^${}()|[\]\\]/.test(char);
}

/**
 * Count the complexity of a regex pattern
 */
export function calculatePatternComplexity(pattern: string): number {
	let complexity = 1;

	// Count special regex features
	const features = [
		/\(\?\=/, // Lookahead
		/\(\?\!/, // Negative lookahead
		/\(\?\<\=/, // Lookbehind
		/\(\?\<\!/, // Negative lookbehind
		/\{[\d,]+\}/, // Quantifiers
		/\[.*?\]/, // Character classes
		/\(.*?\)/, // Groups
		/\|/, // Alternation
		/\\[dwsWDS]/, // Character shortcuts
	];

	features.forEach((feature) => {
		const matches = pattern.match(feature);
		if (matches) complexity += matches.length * 0.1;
	});

	return Math.min(complexity, 2); // Cap at 2x
}

/**
 * Debounce function for performance optimization
 */
export function debounce<T extends (...args: any[]) => any>(
	func: T,
	wait: number
): (...args: Parameters<T>) => void {
	let timeout: ReturnType<typeof setTimeout> | null = null;

	return (...args: Parameters<T>) => {
		if (timeout) clearTimeout(timeout);
		timeout = setTimeout(() => func(...args), wait);
	};
}

/**
 * Deep clone an object
 */
export function deepClone<T>(obj: T): T {
	if (obj === null || typeof obj !== 'object') return obj;
	if (obj instanceof Date) return new Date(obj.getTime()) as T;
	if (obj instanceof Array) return obj.map((item) => deepClone(item)) as T;
	if (typeof obj === 'object') {
		const cloned = {} as T;
		for (const key in obj) {
			if (obj.hasOwnProperty(key)) {
				cloned[key] = deepClone(obj[key]);
			}
		}
		return cloned;
	}
	return obj;
}

/**
 * Validate an email address format
 */
export function isValidEmail(email: string): boolean {
	const emailRegex =
		/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
	return emailRegex.test(email);
}

/**
 * Format a confidence score as a percentage
 */
export function formatConfidence(confidence: number): string {
	return `${Math.round(confidence * 100)}%`;
}

/**
 * Check if running in development mode
 */
export function isDevelopment(): boolean {
	try {
		return process?.env?.NODE_ENV === 'development';
	} catch {
		return false;
	}
}

/**
 * Get current timestamp in ISO format
 */
export function getTimestamp(): string {
	return new Date().toISOString();
}
