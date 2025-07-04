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
} from '../constants/validation.js';
import {
	normalizeText,
	extractNumbers,
	calculateConfidence,
	mergePatterns,
} from './helpers.js';
import { RGEX_CONFIG } from '../config/index.js';

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
 * Parse human text and extract validation rules
 */
export function parseHumanTextToValidation(
	humanText: string,
	testValue?: string
): ValidationExtractionResult {
	const normalizedText = normalizeText(humanText);
	const rules: ValidationRule[] = [];
	let confidence = 0;
	const suggestions: string[] = [];

	// Extract validation keywords
	for (const [keyword, factory] of Object.entries(VALIDATION_KEYWORDS)) {
		if (normalizedText.includes(keyword)) {
			try {
				const rule = (factory as () => ValidationRule)();
				rules.push(rule);
				confidence = Math.max(
					confidence,
					RGEX_CONFIG.defaults.humanTextConfidence.high
				);
			} catch (error) {
				suggestions.push(`Failed to create rule for: ${keyword}`);
			}
		}
	}

	// Extract length constraints
	const numbers = extractNumbers(normalizedText);
	for (const [keyword, factory] of Object.entries(LENGTH_PATTERNS)) {
		if (
			normalizedText.includes(keyword) &&
			numbers.length > 0 &&
			numbers[0] !== undefined
		) {
			try {
				const rule = factory(numbers[0]);
				rules.push(rule);
				confidence = Math.max(
					confidence,
					RGEX_CONFIG.defaults.humanTextConfidence.medium
				);
			} catch (error) {
				suggestions.push(`Failed to create length rule: ${keyword}`);
			}
		}
	}

	// Test extracted rules if test value provided
	if (testValue && rules.length > 0) {
		let allPassed = true;
		for (const rule of rules) {
			let passed = true;

			if (rule.validator) {
				passed = rule.validator(testValue);
			} else if (rule.pattern) {
				passed = rule.pattern.test(testValue);
			}

			if (!passed) {
				allPassed = false;
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
			'No validation rules could be extracted',
			'Try using keywords like: required, email, phone, min length, max length',
			'Be more specific about the validation requirements'
		);
	}

	return {
		success: rules.length > 0,
		rules,
		confidence,
		description: `Extracted ${rules.length} validation rule${
			rules.length === 1 ? '' : 's'
		} from text`,
		suggestions,
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
 * Extract keywords from normalized text
 */
function extractKeywords(text: string): string[] {
	const commonWords = [
		'the',
		'a',
		'an',
		'and',
		'or',
		'but',
		'in',
		'on',
		'at',
		'to',
		'for',
		'of',
		'with',
		'by',
	];
	return text
		.split(' ')
		.filter((word) => word.length > 2 && !commonWords.includes(word))
		.slice(0, 10); // Limit to first 10 keywords
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
