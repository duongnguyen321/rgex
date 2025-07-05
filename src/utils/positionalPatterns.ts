/**
 * Positional Pattern Handlers
 * Handles "starts with", "ends with", and "contains" patterns
 */

import type { TextExtractionResult } from '../../types/index.js';
import { STARTS_WITH, ENDS_WITH, CONTAINS } from '../constants/patterns.js';
import { calculateConfidence } from './helpers.js';

/**
 * Parses text for positional patterns and returns a corresponding regex.
 *
 * It understands phrases like:
 * - "starts with '...'"
 * - "ends with '...'"
 * - "contains '...'"
 *
 * @param textForCapture The text to parse for positional patterns.
 * @param testValue Optional string to test the generated regex against for confidence scoring.
 * @param originalText Optional original, case-sensitive text to preserve casing in the regex.
 * @returns A `TextExtractionResult` object if a pattern is found, otherwise `null`.
 */
export function parsePositionalPatterns(
	textForCapture: string,
	testValue?: string,
	originalText?: string
): TextExtractionResult | null {
	const suggestions: string[] = [];

	// Handle "starts with X" patterns
	const startsWithMatch = textForCapture.match(
		/starts?\s+with\s+['""]([^'""]+)['""]|starts?\s+with\s+([^\s]+)/i
	);
	if (startsWithMatch && (startsWithMatch[1] || startsWithMatch[2])) {
		// Use original text to preserve case if available
		let targetText = startsWithMatch[1] || startsWithMatch[2] || '';
		if (originalText) {
			const originalMatch = originalText.match(
				/starts?\s+with\s+['""]([^'""]+)['""]|starts?\s+with\s+([^\s]+)/i
			);
			if (originalMatch && (originalMatch[1] || originalMatch[2])) {
				targetText = originalMatch[1] || originalMatch[2] || '';
			}
		}

		const pattern = STARTS_WITH(targetText);
		let confidence = 0.85;

		if (testValue) {
			const regex = new RegExp(pattern);
			const testPassed = regex.test(testValue);
			confidence = calculateConfidence(confidence, true, testPassed);
		}

		return {
			success: true,
			pattern: new RegExp(pattern),
			confidence,
			description: `Text that starts with "${targetText}"`,
			suggestions,
		};
	}

	// Handle "ends with X" patterns
	const endsWithMatch = textForCapture.match(
		/ends?\s+with\s+['""]([^'""]+)['""]|ends?\s+with\s+([^\s]+)/i
	);
	if (endsWithMatch && (endsWithMatch[1] || endsWithMatch[2])) {
		// Use original text to preserve case if available
		let targetText = endsWithMatch[1] || endsWithMatch[2] || '';
		if (originalText) {
			const originalMatch = originalText.match(
				/ends?\s+with\s+['""]([^'""]+)['""]|ends?\s+with\s+([^\s]+)/i
			);
			if (originalMatch && (originalMatch[1] || originalMatch[2])) {
				targetText = originalMatch[1] || originalMatch[2] || '';
			}
		}

		const pattern = ENDS_WITH(targetText);
		let confidence = 0.85;

		if (testValue) {
			const regex = new RegExp(pattern);
			const testPassed = regex.test(testValue);
			confidence = calculateConfidence(confidence, true, testPassed);
		}

		return {
			success: true,
			pattern: new RegExp(pattern),
			confidence,
			description: `Text that ends with "${targetText}"`,
			suggestions,
		};
	}

	// Handle "contains X" patterns
	const containsMatch = textForCapture.match(
		/contains?\s+['""]([^'""]+)['""]|contains?\s+([^\s]+)/i
	);
	if (containsMatch && (containsMatch[1] || containsMatch[2])) {
		// Use original text to preserve case if available
		let targetText = containsMatch[1] || containsMatch[2] || '';
		if (originalText) {
			const originalMatch = originalText.match(
				/contains?\s+['""]([^'""]+)['""]|contains?\s+([^\s]+)/i
			);
			if (originalMatch && (originalMatch[1] || originalMatch[2])) {
				targetText = originalMatch[1] || originalMatch[2] || '';
			}
		}

		const pattern = CONTAINS(targetText);
		let confidence = 0.8;

		if (testValue) {
			const regex = new RegExp(pattern);
			const testPassed = regex.test(testValue);
			confidence = calculateConfidence(confidence, true, testPassed);
		}

		return {
			success: true,
			pattern: new RegExp(pattern),
			confidence,
			description: `Text that contains "${targetText}"`,
			suggestions,
		};
	}

	return null;
}
