/**
 * Language-related Combined Pattern Handlers
 */

import type { TextExtractionResult } from '../../../types/index.js';
import { calculateConfidence } from '../helpers.js';

/**
 * Parses combined patterns specifically related to multi-language text.
 * @param text - The normalized text to search for patterns.
 * @param testValue - An optional string to test the generated pattern against.
 * @returns A `TextExtractionResult` if a match is found, otherwise `null`.
 */
export function parseLanguageCombined(
	text: string,
	testValue?: string
): TextExtractionResult | null {
	// Handle "text with unicode letters numbers and common punctuation"
	if (
		text.includes('unicode letters') &&
		text.includes('numbers') &&
		text.includes('common punctuation')
	) {
		const unicodeTextPattern = '^[\\p{L}\\p{N}\\p{P}\\s]+$';
		let confidence = 0.8;

		if (testValue) {
			const regex = new RegExp(unicodeTextPattern, 'u');
			const testPassed = regex.test(testValue);
			confidence = calculateConfidence(confidence, true, testPassed);
		}

		return {
			success: true,
			pattern: new RegExp(unicodeTextPattern, 'u'),
			confidence,
			description: 'Text with unicode letters, numbers, and common punctuation',
			suggestions: [],
		};
	}

	// Handle "name with international characters and optional middle initial"
	if (
		text.includes('name') &&
		text.includes('international characters') &&
		text.includes('optional middle initial')
	) {
		const internationalNamePattern =
			'^[\\p{L}\\s]+([\\p{L}]\\.\\s)?[\\p{L}\\s]+$';
		let confidence = 0.8;

		if (testValue) {
			const regex = new RegExp(internationalNamePattern, 'u');
			const testPassed = regex.test(testValue);
			confidence = calculateConfidence(confidence, true, testPassed);
		}

		return {
			success: true,
			pattern: new RegExp(internationalNamePattern, 'u'),
			confidence,
			description:
				'Name with international characters and optional middle initial',
			suggestions: [],
		};
	}

	return null;
}
