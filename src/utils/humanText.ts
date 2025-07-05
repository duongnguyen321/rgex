/**
 * RGex Human Text Parser
 * Converts human-readable text descriptions to regex patterns
 */

import type {
	TextExtractionResult,
	ValidationExtractionResult,
	ValidationRule,
} from '../../types/index.js';
import { HUMAN_PATTERNS, PATTERN_KEYWORDS } from '../constants/patterns.js';
import {
	VALIDATION_KEYWORDS,
	LENGTH_PATTERNS,
	VALIDATION_PATTERNS,
} from '../constants/validation.js';
import {
	normalizeText,
	extractNumbers,
	calculateConfidence,
	mergePatterns,
} from './helpers.js';
import { RGEX_CONFIG } from '../config/index.js';

// Import pattern handlers
import { parsePositionalPatterns } from './positionalPatterns.js';
import { parseLengthConstraints } from './lengthConstraints.js';
import { parseEmailPatterns } from './emailPatterns.js';
import { parsePhonePatterns } from './phonePatterns.js';
import { parseSecurityPatterns } from './securityPatterns.js';
import { parseDateTimePatterns } from './dateTimePatterns.js';
import { parseUrlPatterns } from './urlPatterns.js';
import { parseFinancialPatterns } from './financialPatterns.js';
import { parseTextFormattingPatterns } from './textFormattingPatterns.js';
import { parseCombinedPatterns } from './combinedPatterns.js';

/**
 * Parse human text and extract regex pattern
 */
export function parseHumanTextToRegex(
	humanText: string,
	testValue?: string
): TextExtractionResult {
	const normalizedText = normalizeText(humanText);
	let pattern = '';
	let confidence = 0;
	let description = '';
	const suggestions: string[] = [];
	let patternType: string | undefined;

	// Check for compound requirements first (e.g., "email have number in domain")
	const compoundResult = parseCompoundRequirements(
		normalizedText,
		testValue,
		humanText
	);
	if (compoundResult.success) {
		return compoundResult;
	}

	// Check for direct pattern matches
	for (const [key, patternInfo] of Object.entries(HUMAN_PATTERNS)) {
		const keywords = PATTERN_KEYWORDS[key] || [];
		const hasKeyword = keywords.some((keyword) =>
			normalizedText.includes(keyword.toLowerCase())
		);

		if (hasKeyword) {
			pattern = patternInfo.pattern;
			description = patternInfo.description;
			confidence = RGEX_CONFIG.defaults.humanTextConfidence.high;
			patternType = patternInfo.type;

			if (testValue) {
				const regex = new RegExp(pattern);
				const testPassed = regex.test(testValue);
				confidence = calculateConfidence(confidence, true, testPassed);

				if (!testPassed) {
					suggestions.push(
						`The test value "${testValue}" doesn't match the ${key} pattern`
					);
				}
			}

			break;
		}
	}

	// If no direct match, try to construct pattern from components
	if (!pattern) {
		const constructedResult = constructPatternFromText(
			normalizedText,
			testValue
		);
		pattern = constructedResult.pattern;
		confidence = constructedResult.confidence;
		description = constructedResult.description;
		suggestions.push(...constructedResult.suggestions);
	}

	// Add generic suggestions if confidence is low
	if (confidence < RGEX_CONFIG.defaults.humanTextConfidence.medium) {
		suggestions.push(
			'Try being more specific about the pattern you want',
			'Use keywords like: email, phone, number, date, etc.',
			'Provide a test value to improve accuracy'
		);

		// If confidence is extremely low, fail completely
		if (confidence < RGEX_CONFIG.defaults.humanTextConfidence.low) {
			return {
				success: false,
				pattern: undefined,
				confidence,
				description: 'Could not understand the text description',
				suggestions,
			};
		}
	}

	return {
		success: pattern.length > 0,
		pattern: new RegExp(pattern),
		confidence,
		description: description || 'Custom pattern extracted from text',
		suggestions,
	};
}

/**
 * Parse compound requirements using modular pattern handlers
 */
function parseCompoundRequirements(
	normalizedText: string,
	testValue?: string,
	originalText?: string
): TextExtractionResult {
	// Always use normalized text to ensure case-insensitive matching
	const textForCapture = normalizedText;

	// Try each pattern handler in order (combined patterns first for complex cases)
	const handlers = [
		parseCombinedPatterns,
		parsePositionalPatterns,
		parseLengthConstraints,
		parseEmailPatterns,
		parsePhonePatterns,
		parseSecurityPatterns,
		parseDateTimePatterns,
		parseUrlPatterns,
		parseFinancialPatterns,
		parseTextFormattingPatterns,
	];

	for (const handler of handlers) {
		// For positional patterns, we need to pass the original text to preserve case
		const result =
			handler === parsePositionalPatterns && originalText
				? handler(textForCapture, testValue, originalText)
				: handler(textForCapture, testValue);
		if (result) {
			return result;
		}
	}

	return {
		success: false,
		pattern: undefined,
		confidence: 0,
		description: '',
		suggestions: [],
	};
}

/**
 * Parse human text and extract validation rules by leveraging parseHumanTextToRegex.
 */
export function parseHumanTextToValidation(
	humanText: string,
	testValue?: string
): ValidationExtractionResult {
	const normalizedText = normalizeText(humanText);
	const rules: ValidationRule[] = [];
	let confidence = 0;
	const suggestions: string[] = [];

	// Keywords for validation that are not regex patterns
	const keywordVariations = {
		require: ['require', 'required', 'mandatory', 'must have', 'need'],
		strong: ['strong', 'secure', 'complex'],
	};

	// Check for 'required' keyword
	if (keywordVariations.require.some((v) => normalizedText.includes(v))) {
		rules.push(VALIDATION_PATTERNS.required());
		confidence = Math.max(
			confidence,
			RGEX_CONFIG.defaults.humanTextConfidence.medium
		);
	}

	// Check for 'strong password' keyword, which uses a validator function
	if (
		keywordVariations.strong.some((v) => normalizedText.includes(v)) &&
		normalizedText.includes('password')
	) {
		rules.push(VALIDATION_PATTERNS.strongPassword());
		confidence = Math.max(
			confidence,
			RGEX_CONFIG.defaults.humanTextConfidence.high
		);
	}

	// Use the main regex parser to extract a pattern-based rule
	const regexResult = parseHumanTextToRegex(humanText, testValue);

	if (regexResult.success && regexResult.pattern) {
		// Avoid adding a generic password rule if a strong one is already present
		const isGenericPassword =
			rules.some((r) => r.name === 'strongPassword') &&
			regexResult.description?.toLowerCase().includes('password');

		if (!isGenericPassword) {
			const customRule: ValidationRule = {
				name: regexResult.description || 'customPattern',
				pattern: regexResult.pattern,
				message:
					regexResult.description ||
					'Input does not match the required pattern',
			};
			rules.push(customRule);
			confidence = Math.max(confidence, regexResult.confidence);
			if (regexResult.suggestions) {
				suggestions.push(...regexResult.suggestions);
			}
		}
	}

	// Test extracted rules if test value is provided
	let allPassed = true;
	const caseUnPassed = [];
	if (testValue && rules.length > 0) {
		for (const rule of rules) {
			let passed = true;

			if (rule.validator) {
				passed = rule.validator(testValue);
			} else if (rule.pattern) {
				passed = rule.pattern.test(testValue);
			}

			if (!passed) {
				allPassed = false;
				caseUnPassed.push(rule.name);
				suggestions.push(
					`Test value fails rule: ${rule.name} - ${rule.message}`
				);
			}
		}

		confidence = calculateConfidence(confidence, true, allPassed);
	}

	// Add suggestions for improvement
	if (rules.length === 0) {
		suggestions.push(
			'No validation rules could be extracted.',
			'Try using keywords like: required, email, phone, min length, max length.',
			'Examples: "required email", "phone number", "minimum 8 characters".'
		);
	}

	return {
		success: rules.length > 0,
		rules,
		confidence,
		description: `Extracted ${rules.length} validation rule${
			rules.length === 1 ? '' : 's'
		} from text.`,
		suggestions,
		caseUnPassed,
		allPassed,
	};
}

/**
 * Construct pattern from text components
 */
function constructPatternFromText(
	normalizedText: string,
	testValue?: string
): {
	pattern: string;
	confidence: number;
	description: string;
	suggestions: string[];
} {
	const suggestions: string[] = [];
	let pattern = '';
	let confidence = 0;
	let description = '';

	// Look for specific pattern elements
	const patternElements: string[] = [];

	// Check for character classes
	if (
		normalizedText.includes('letter') ||
		normalizedText.includes('alphabetic')
	) {
		patternElements.push('[a-zA-Z]');
		confidence += 0.3;
	}

	if (normalizedText.includes('digit') || normalizedText.includes('number')) {
		patternElements.push('\\d');
		confidence += 0.3;
	}

	if (
		normalizedText.includes('space') ||
		normalizedText.includes('whitespace')
	) {
		patternElements.push('\\s');
		confidence += 0.2;
	}

	if (
		normalizedText.includes('any character') ||
		normalizedText.includes('anything')
	) {
		patternElements.push('.');
		confidence += 0.1;
	}

	// Check for quantifiers
	const numbers = extractNumbers(normalizedText);
	if (numbers.length > 0) {
		const num = numbers[0];
		if (normalizedText.includes('exactly')) {
			patternElements[patternElements.length - 1] += `{${num}}`;
			confidence += 0.2;
		} else if (normalizedText.includes('at least')) {
			patternElements[patternElements.length - 1] += `{${num},}`;
			confidence += 0.2;
		} else if (normalizedText.includes('at most')) {
			patternElements[patternElements.length - 1] += `{0,${num}}`;
			confidence += 0.2;
		}
	}

	// Check for anchors
	if (
		normalizedText.includes('start') ||
		normalizedText.includes('beginning')
	) {
		pattern = '^' + pattern;
		confidence += 0.1;
	}

	if (normalizedText.includes('end') || normalizedText.includes('ending')) {
		pattern += '$';
		confidence += 0.1;
	}

	// Combine pattern elements
	if (patternElements.length > 0) {
		pattern += mergePatterns(patternElements, false);
		description = `Pattern constructed from text components: ${patternElements.join(
			', '
		)}`;
	} else {
		// Fallback: create pattern from literal text
		const words = normalizedText.split(' ').filter((word) => word.length > 2);
		if (words.length > 0) {
			pattern = words
				.map((word) => word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'))
				.join('.*');
			confidence = 0.3;
			description = 'Literal text pattern created from keywords';
			suggestions.push('Consider using more specific pattern keywords');
		}
	}

	// Test against test value if provided
	if (testValue && pattern) {
		try {
			const regex = new RegExp(pattern);
			const testPassed = regex.test(testValue);
			confidence = calculateConfidence(confidence, true, testPassed);

			if (!testPassed) {
				suggestions.push(`Pattern doesn't match test value: "${testValue}"`);
			}
		} catch (error) {
			suggestions.push('Generated pattern is invalid');
			confidence = 0;
		}
	}

	return {
		pattern,
		confidence: Math.min(confidence, 1),
		description,
		suggestions,
	};
}

/**
 * Get pattern suggestions based on text content
 */
export function getPatternSuggestions(text: string): string[] {
	const normalizedText = normalizeText(text);
	const suggestions: string[] = [];

	// Check what patterns might be relevant
	for (const [key, keywords] of Object.entries(PATTERN_KEYWORDS)) {
		const hasPartialMatch = keywords.some((keyword) =>
			normalizedText.includes(keyword.substring(0, 3))
		);

		if (hasPartialMatch) {
			suggestions.push(`Did you mean "${key}"? Try: ${keywords.join(', ')}`);
		}
	}

	// General suggestions
	if (suggestions.length === 0) {
		suggestions.push(
			'Available patterns: email, phone, url, date, time, number, uuid, ip address',
			'Use descriptive keywords like "email address" or "phone number"',
			'Provide specific requirements like "minimum 8 characters" or "numbers only"'
		);
	}

	return suggestions.slice(0, 5); // Limit suggestions
}

// ============================================
// SHORTER EXPORT ALIASES FOR CONVENIENCE
// ============================================

/**
 * Short alias for parseHumanTextToRegex
 * Convert human text to regex pattern
 */
export const humanToRegex = parseHumanTextToRegex;

/**
 * Short alias for parseHumanTextToRegex
 * Convert human text to regex pattern
 */
export const textToRegex = parseHumanTextToRegex;

/**
 * Short alias for parseHumanTextToValidation
 * Convert human text to validation rules
 */
export const humanToValidation = parseHumanTextToValidation;

/**
 * Short alias for parseHumanTextToValidation
 * Convert human text to validation rules
 */
export const textToValidation = parseHumanTextToValidation;

/**
 * Short alias for getPatternSuggestions
 * Get pattern suggestions for text
 */
export const getSuggestions = getPatternSuggestions;

/**
 * Short alias for getPatternSuggestions
 * Get pattern suggestions for text
 */
export const textToSuggestions = getPatternSuggestions;

/**
 * Short alias for parseHumanTextToRegex
 * Convert human text to regex pattern
 */
export const h2r = parseHumanTextToRegex; // human to regex

/**
 * Short alias for parseHumanTextToRegex
 * Convert human text to regex pattern
 */
export const t2r = parseHumanTextToRegex; // text to regex

/**
 * Short alias for parseHumanTextToValidation
 * Convert human text to validation rules
 */
export const h2v = parseHumanTextToValidation; // human to validation

/**
 * Short alias for parseHumanTextToValidation
 * Convert human text to validation rules
 */
export const t2v = parseHumanTextToValidation; // text to validation

/**
 * Short alias for getPatternSuggestions
 * Get pattern suggestions for text
 */
export const suggest = getPatternSuggestions;
