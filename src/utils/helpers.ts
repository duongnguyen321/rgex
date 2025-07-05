/**
 * @fileoverview RGex Helper Utilities - Common utility functions used throughout the library
 * @module Utilities
 * @category Utilities
 * @group Helper Functions
 * @author duongnguyen321 - https://duonguyen.site
 */

import type { RegexBuilderOptions } from '../../types/index.js';

/**
 * Escapes special characters in a string for use in a regular expression.
 * @param text - The input string to escape.
 * @returns The escaped string, safe to be inserted into a regex.
 */
export function escapeRegex(text: string): string {
	return text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/**
 * Converts a `RegexBuilderOptions` object into a regex flags string (e.g., "gi").
 * @param options - The options object to convert.
 * @returns A string containing the regex flags.
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
 * Converts a regex flags string into a `RegexBuilderOptions` object.
 * @param flags - The flags string to convert.
 * @returns An options object representing the flags.
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
 * Validates if a given string is a syntactically correct regular expression pattern.
 * @param pattern - The regex pattern string to validate.
 * @returns `true` if the pattern is valid, otherwise `false`.
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
 * Cleans and normalizes a string by converting it to lowercase, trimming whitespace,
 * and collapsing multiple whitespace characters into a single space.
 * @param text - The string to normalize.
 * @returns The normalized string.
 */
export function normalizeText(text: string): string {
	return text.toLowerCase().trim().replace(/\s+/g, ' ');
}

/**
 * Extracts all numeric values from a string.
 * @param text - The string to extract numbers from.
 * @returns An array of numbers found in the string.
 */
export function extractNumbers(text: string): number[] {
	const matches = text.match(/\d+/g);
	return matches ? matches.map(Number) : [];
}

/**
 * Calculates a confidence score for a matched pattern.
 * The score is adjusted based on whether a test value was provided, if it passed,
 * and the complexity of the regex pattern itself.
 * @param baseScore - The initial confidence score.
 * @param hasTestValue - Whether a test value was provided.
 * @param testPassed - Whether the test value passed the regex validation.
 * @param complexity - A multiplier for the pattern's complexity.
 * @returns The calculated confidence score, clamped between 0 and 1.
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
 * Merges an array of regex pattern strings using the OR `|` operator.
 * @param patterns - An array of pattern strings to merge.
 * @param useGroups - If true, wraps the entire merged pattern in a non-capturing group.
 * @returns The combined regex pattern string.
 */
export function mergePatterns(
	patterns: string[],
	useGroups: boolean = true
): string {
	if (patterns.length === 0) return '';
	if (patterns.length === 1) return patterns[0] ?? '';

	const joinedPatterns = patterns.join('|');
	return useGroups ? `(?:${joinedPatterns})` : joinedPatterns;
}

/**
 * Generates sample test data for a given pattern type.
 * @param type - The type of data to generate (e.g., 'email', 'phone').
 * @returns An array of test strings, including both valid and invalid examples.
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
 * Checks if a single character is a special regex character.
 * @param char - The character to check.
 * @returns `true` if the character has a special meaning in regex, otherwise `false`.
 */
export function isSpecialChar(char: string): boolean {
	return /[.*+?^${}()|[\]\\]/.test(char);
}

/**
 * Calculates a complexity score for a regex pattern.
 * More complex features like lookarounds and groups increase the score.
 * @param pattern - The regex pattern string to analyze.
 * @returns A numeric complexity score.
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
 * Creates a debounced function that delays invoking `func` until after `wait` milliseconds
 * have elapsed since the last time the debounced function was invoked.
 * @param func - The function to debounce.
 * @param wait - The number of milliseconds to delay.
 * @returns The new debounced function.
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
 * Creates a deep clone of an object or array.
 * @param obj - The object to clone.
 * @returns A deep copy of the object.
 */
export function deepClone<T>(obj: T): T {
	if (obj === null || typeof obj !== 'object') return obj;
	if (obj instanceof Date) return new Date(obj.getTime()) as T;
	if (obj instanceof Array) return obj.map((item) => deepClone(item)) as T;
	if (obj instanceof Object) {
		const cloned = {} as { [key: string]: any };
		for (const key in obj) {
			if (obj.hasOwnProperty(key)) {
				cloned[key] = deepClone(obj[key]);
			}
		}
		return cloned as T;
	}
	throw new Error('Unable to clone object');
}

/**
 * Validates if a string is in a correct email format.
 * @param email - The email string to validate.
 * @returns `true` if the email format is valid, otherwise `false`.
 */
export function isValidEmail(email: string): boolean {
	const emailRegex =
		/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
	return emailRegex.test(email);
}

/**
 * Formats a confidence score (a number between 0 and 1) as a percentage string.
 * @param confidence - The confidence score.
 * @returns The formatted percentage string (e.g., "85%").
 */
export function formatConfidence(confidence: number): string {
	return `${Math.round(confidence * 100)}%`;
}

/**
 * Checks if the current environment is a development environment.
 * It checks `process.env.NODE_ENV` in both Node.js and browser-like environments.
 * @returns `true` if in a development environment, otherwise `false`.
 */
export function isDevelopment(): boolean {
	try {
		// Check Node.js environment
		if (typeof process !== 'undefined' && process?.env?.NODE_ENV) {
			return process.env.NODE_ENV === 'development';
		}

		// Check browser environment variables set by bundlers
		if (typeof globalThis !== 'undefined') {
			// Check for common bundler environment variables
			const global = globalThis as any;
			if (global.process?.env?.NODE_ENV) {
				return global.process.env.NODE_ENV === 'development';
			}
		}

		// Default to false in unknown environments
		return false;
	} catch {
		return false;
	}
}

/**
 * Gets the current timestamp in ISO 8601 format.
 * @returns The current timestamp as an ISO string.
 */
export function getTimestamp(): string {
	return new Date().toISOString();
}
