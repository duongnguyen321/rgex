/**
 * Transportation-related Combined Pattern Handlers
 */

import type { TextExtractionResult } from '../../../types/index.js';
import { calculateConfidence } from '../helpers.js';

/**
 * Parses combined patterns specifically related to transportation identifiers.
 * @param text - The normalized text to search for patterns.
 * @param testValue - An optional string to test the generated pattern against.
 * @returns A `TextExtractionResult` if a match is found, otherwise `null`.
 */
export function parseTransportationCombined(
	text: string,
	testValue?: string
): TextExtractionResult | null {
	// Handle "license plate with 3 letters and 4 numbers"
	if (
		text.includes('license plate') &&
		text.includes('3 letters') &&
		text.includes('4 numbers')
	) {
		const licensePlatePattern = '^[A-Z]{3}-\\d{4}$';
		let confidence = 0.85;

		if (testValue) {
			const regex = new RegExp(licensePlatePattern);
			const testPassed = regex.test(testValue);
			confidence = calculateConfidence(confidence, true, testPassed);
		}

		return {
			success: true,
			pattern: new RegExp(licensePlatePattern),
			confidence,
			description: 'License plate with 3 letters and 4 numbers',
			suggestions: [],
		};
	}

	// Handle "flight number with airline code and digits"
	if (
		text.includes('flight number') &&
		text.includes('airline code') &&
		text.includes('digits')
	) {
		const flightNumberPattern = '^[A-Z]{2}\\d{3,4}$';
		let confidence = 0.85;

		if (testValue) {
			const regex = new RegExp(flightNumberPattern);
			const testPassed = regex.test(testValue);
			confidence = calculateConfidence(confidence, true, testPassed);
		}

		return {
			success: true,
			pattern: new RegExp(flightNumberPattern),
			confidence,
			description: 'Flight number with airline code and digits',
			suggestions: [],
		};
	}

	// Handle "tracking number with carrier prefix and alphanumeric code"
	if (
		text.includes('tracking number') &&
		text.includes('carrier prefix') &&
		text.includes('alphanumeric')
	) {
		const trackingPattern =
			'^(1Z[0-9A-Z]{14,16}|[0-9]{12,14}|[A-Z]{3}[0-9A-Z]{10,12})$';
		let confidence = 0.8;

		if (testValue) {
			const regex = new RegExp(trackingPattern);
			const testPassed = regex.test(testValue);
			confidence = calculateConfidence(confidence, true, testPassed);
		}

		return {
			success: true,
			pattern: new RegExp(trackingPattern),
			confidence,
			description: 'Tracking number with carrier prefix and alphanumeric code',
			suggestions: [],
		};
	}

	return null;
}
