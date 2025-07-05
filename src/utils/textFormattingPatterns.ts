/**
 * Text Formatting Pattern Handlers
 * Handles uppercase, spaces, alphanumeric patterns
 */

import type { TextExtractionResult } from '../../types/index.js';
import { calculateConfidence } from './helpers.js';

/**
 * Parses text for formatting patterns and returns a corresponding regex.
 *
 * It understands phrases like:
 * - "uppercase only" / "all caps"
 * - "no spaces"
 * - "alphanumeric only"
 *
 * @param textForCapture The text to parse for formatting patterns.
 * @param testValue Optional string to test the generated regex against for confidence scoring.
 * @returns A `TextExtractionResult` object if a pattern is found, otherwise `null`.
 */
export function parseTextFormattingPatterns(
	textForCapture: string,
	testValue?: string
): TextExtractionResult | null {
	const suggestions: string[] = [];

	// Handle "uppercase only" or "all caps"
	if (
		textForCapture.includes('uppercase') ||
		textForCapture.includes('all caps') ||
		textForCapture.includes('capital letters')
	) {
		const uppercaseOnly = '^[A-Z\\s]+$';

		let confidence: number = 0.8;

		if (testValue) {
			const regex = new RegExp(uppercaseOnly);
			const testPassed = regex.test(testValue);
			confidence = calculateConfidence(confidence, true, testPassed);
		}

		return {
			success: true,
			pattern: new RegExp(uppercaseOnly),
			confidence,
			description: 'Uppercase letters only (with spaces allowed)',
			suggestions,
		};
	}

	// Handle "no spaces" or "without spaces"
	if (
		textForCapture.includes('no spaces') ||
		textForCapture.includes('without spaces') ||
		textForCapture.includes('no whitespace')
	) {
		const noSpaces = '^\\S+$';

		let confidence: number = 0.8;

		if (testValue) {
			const regex = new RegExp(noSpaces);
			const testPassed = regex.test(testValue);
			confidence = calculateConfidence(confidence, true, testPassed);
		}

		return {
			success: true,
			pattern: new RegExp(noSpaces),
			confidence,
			description: 'Text without any spaces',
			suggestions,
		};
	}

	// Handle "alphanumeric only" or "letters and numbers"
	if (
		textForCapture.includes('alphanumeric') ||
		(textForCapture.includes('letters') &&
			textForCapture.includes('numbers') &&
			textForCapture.includes('only'))
	) {
		const alphanumericOnly = '^[a-zA-Z0-9]+$';

		let confidence: number = 0.8;

		if (testValue) {
			const regex = new RegExp(alphanumericOnly);
			const testPassed = regex.test(testValue);
			confidence = calculateConfidence(confidence, true, testPassed);
		}

		return {
			success: true,
			pattern: new RegExp(alphanumericOnly),
			confidence,
			description: 'Alphanumeric characters only (letters and numbers)',
			suggestions,
		};
	}

	return null;
}
