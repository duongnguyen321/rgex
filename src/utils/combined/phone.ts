/**
 * Phone Number-related Combined Pattern Handlers
 */

import type { TextExtractionResult } from '../../../types/index.js';
import { calculateConfidence } from '../helpers.js';

/**
 * Parses combined patterns specifically related to phone numbers.
 * @param text - The normalized text to search for patterns.
 * @param testValue - An optional string to test the generated pattern against.
 * @returns A `TextExtractionResult` if a match is found, otherwise `null`.
 */
export function parsePhoneCombined(
	text: string,
	testValue?: string
): TextExtractionResult | null {
	// Handle "US phone number with area code and exactly 10 digits"
	if (
		text.includes('phone') &&
		text.includes('us') &&
		text.includes('area code') &&
		text.includes('10 digits')
	) {
		const usPhone10Digits =
			'^\\(?[2-9][0-8][0-9]\\)?[\\s-]*[0-9]{3}[\\s-]*[0-9]{4}$';

		let confidence = 0.9;

		if (testValue) {
			const regex = new RegExp(usPhone10Digits);
			const testPassed = regex.test(testValue);
			confidence = calculateConfidence(confidence, true, testPassed);
		}

		return {
			success: true,
			pattern: new RegExp(usPhone10Digits),
			confidence,
			description: 'US phone number with valid area code and exactly 10 digits',
			suggestions: [],
		};
	}

	// Handle "international phone with country code and between 10 to 15 digits"
	if (
		text.includes('phone') &&
		text.includes('international') &&
		text.includes('country code') &&
		text.includes('between') &&
		text.includes('10') &&
		text.includes('15')
	) {
		const intlPhoneRange = '^\\+[1-9]\\d{0,3}[\\s-]+(?:\\d[\\s-]*){6,}\\d$';

		let confidence = 0.85;

		if (testValue) {
			const regex = new RegExp(intlPhoneRange);
			const testPassed = regex.test(testValue);
			confidence = calculateConfidence(confidence, true, testPassed);
		}

		return {
			success: true,
			pattern: new RegExp(intlPhoneRange),
			confidence,
			description: 'International phone with country code, 10-15 digits total',
			suggestions: [],
		};
	}

	// Handle "phone number with country code area code and exactly 10 digits total"
	if (
		text.includes('phone') &&
		text.includes('country code') &&
		text.includes('area code') &&
		text.includes('exactly 10 digits')
	) {
		const specificPhonePattern =
			'^\\+1[\\s-]?\\(?[2-9][0-8][0-9]\\)?[\\s-]?[0-9]{3}[\\s-]?[0-9]{4}$';
		let confidence = 0.9;

		if (testValue) {
			const regex = new RegExp(specificPhonePattern);
			const testPassed = regex.test(testValue);
			confidence = calculateConfidence(confidence, true, testPassed);
		}

		return {
			success: true,
			pattern: new RegExp(specificPhonePattern),
			confidence,
			description:
				'Phone number with country code, area code, and exactly 10 digits total',
			suggestions: [],
		};
	}

	return null;
}
