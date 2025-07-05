/**
 * Text-related Combined Pattern Handlers
 */

import type { TextExtractionResult } from '../../../types/index.js';
import { calculateConfidence } from '../helpers.js';

/**
 * Parses combined patterns specifically related to generic text structures.
 * @param text - The normalized text to search for patterns.
 * @param testValue - An optional string to test the generated pattern against.
 * @returns A `TextExtractionResult` if a match is found, otherwise `null`.
 */
export function parseTextCombined(
	text: string,
	testValue?: string
): TextExtractionResult | null {
	// Handle "alphanumeric with dashes and underscores between 5 and 50 characters"
	if (
		text.includes('alphanumeric') &&
		text.includes('dashes') &&
		text.includes('underscores') &&
		text.includes('between') &&
		text.includes('5') &&
		text.includes('50')
	) {
		const alphanumericDashUnderscore = '^[a-zA-Z0-9_-]{5,50}$';

		let confidence = 0.85;

		if (testValue) {
			const regex = new RegExp(alphanumericDashUnderscore);
			const testPassed = regex.test(testValue);
			confidence = calculateConfidence(confidence, true, testPassed);
		}

		return {
			success: true,
			pattern: new RegExp(alphanumericDashUnderscore),
			confidence,
			description: 'Alphanumeric with dashes and underscores, 5-50 characters',
			suggestions: [],
		};
	}

	// Handle "text that starts with capital letter and contains at least one number"
	if (
		text.includes('starts with capital') &&
		text.includes('contains') &&
		text.includes('at least one number')
	) {
		const capitalStartWithNumber = '^[A-Z].*\\d.*$';

		let confidence = 0.8;

		if (testValue) {
			const regex = new RegExp(capitalStartWithNumber);
			const testPassed = regex.test(testValue);
			confidence = calculateConfidence(confidence, true, testPassed);
		}

		return {
			success: true,
			pattern: new RegExp(capitalStartWithNumber),
			confidence,
			description:
				'Text starting with capital letter and containing at least one number',
			suggestions: [],
		};
	}

	return null;
}
