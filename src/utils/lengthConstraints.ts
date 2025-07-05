/**
 * Length Constraint Pattern Handlers
 * Handles "between X and Y characters", "exactly X characters", etc.
 */

import type { TextExtractionResult } from '../../types/index.js';
import {
	BETWEEN_LENGTH,
	EXACT_LENGTH,
	MIN_LENGTH,
	MAX_LENGTH,
} from '../constants/patterns.js';
import { calculateConfidence } from './helpers.js';

/**
 * Parse length constraint patterns like "between X and Y characters", "exactly X characters"
 */
export function parseLengthConstraints(
	textForCapture: string,
	testValue?: string
): TextExtractionResult | null {
	const suggestions: string[] = [];

	// Handle "between X and Y characters" patterns
	const betweenMatch = textForCapture.match(
		/between\s+(\d+)\s+and\s+(\d+)\s+characters?/i
	);
	if (betweenMatch && betweenMatch[1] && betweenMatch[2]) {
		const min = parseInt(betweenMatch[1]);
		const max = parseInt(betweenMatch[2]);
		const pattern = BETWEEN_LENGTH(min, max);
		let confidence = 0.9;

		if (testValue) {
			const regex = new RegExp(pattern);
			const testPassed = regex.test(testValue);
			confidence = calculateConfidence(confidence, true, testPassed);
		}

		return {
			success: true,
			pattern: new RegExp(pattern),
			confidence,
			description: `Text between ${min} and ${max} characters`,
			suggestions,
		};
	}

	// Handle "exactly X characters" patterns
	const exactMatch = textForCapture.match(/exactly\s+(\d+)\s+characters?/i);
	if (exactMatch && exactMatch[1]) {
		const length = parseInt(exactMatch[1]);
		const pattern = EXACT_LENGTH(length);
		let confidence = 0.9;

		if (testValue) {
			const regex = new RegExp(pattern);
			const testPassed = regex.test(testValue);
			confidence = calculateConfidence(confidence, true, testPassed);
		}

		return {
			success: true,
			pattern: new RegExp(pattern),
			confidence,
			description: `Text with exactly ${length} characters`,
			suggestions,
		};
	}

	// Handle "at least X characters" patterns
	const minMatch = textForCapture.match(/at\s+least\s+(\d+)\s+characters?/i);
	if (minMatch && minMatch[1]) {
		const min = parseInt(minMatch[1]);
		const pattern = MIN_LENGTH(min);
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
			description: `Text with at least ${min} characters`,
			suggestions,
		};
	}

	// Handle "at most X characters" patterns
	const maxMatch = textForCapture.match(/at\s+most\s+(\d+)\s+characters?/i);
	if (maxMatch && maxMatch[1]) {
		const max = parseInt(maxMatch[1]);
		const pattern = MAX_LENGTH(max);
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
			description: `Text with at most ${max} characters`,
			suggestions,
		};
	}

	// Handle "minimum X characters" patterns
	const minimumMatch = textForCapture.match(/minimum\s+(\d+)\s+characters?/i);
	if (minimumMatch && minimumMatch[1]) {
		const min = parseInt(minimumMatch[1]);
		const pattern = MIN_LENGTH(min);
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
			description: `Text with minimum ${min} characters`,
			suggestions,
		};
	}

	// Handle "maximum X characters" patterns
	const maximumMatch = textForCapture.match(/maximum\s+(\d+)\s+characters?/i);
	if (maximumMatch && maximumMatch[1]) {
		const max = parseInt(maximumMatch[1]);
		const pattern = MAX_LENGTH(max);
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
			description: `Text with maximum ${max} characters`,
			suggestions,
		};
	}

	return null;
}
