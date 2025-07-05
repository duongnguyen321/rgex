/**
 * Positional Pattern Handlers
 * Handles "starts with", "ends with", and "contains" patterns
 */

import type { TextExtractionResult } from '../../types/index.js';
import { STARTS_WITH, ENDS_WITH, CONTAINS } from '../constants/patterns.js';
import { calculateConfidence } from './helpers.js';

/**
 * Parse positional patterns like "starts with X", "ends with Y", "contains Z"
 */
export function parsePositionalPatterns(
	textForCapture: string,
	testValue?: string
): TextExtractionResult | null {
	const suggestions: string[] = [];

	// Handle "starts with X" patterns
	const startsWithMatch = textForCapture.match(
		/starts?\s+with\s+['""]?([^'""\s]+)['""]?/i
	);
	if (startsWithMatch && startsWithMatch[1]) {
		const targetText = startsWithMatch[1];
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
		/ends?\s+with\s+['""]?([^'""\s]+)['""]?/i
	);
	if (endsWithMatch && endsWithMatch[1]) {
		const targetText = endsWithMatch[1];
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
		/contains?\s+['""]?([^'""\s]+)['""]?/i
	);
	if (containsMatch && containsMatch[1]) {
		const targetText = containsMatch[1];
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
