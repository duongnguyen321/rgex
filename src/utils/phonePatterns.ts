/**
 * Phone Pattern Handlers
 * Handles various phone number pattern variations
 */

import type { TextExtractionResult } from '../../types/index.js';
import { calculateConfidence } from './helpers.js';

/**
 * Parses text for phone number patterns and returns a corresponding regex.
 *
 * It understands phrases like:
 * - "us phone number"
 * - "phone with dashes"
 * - "phone with country code" / "international phone"
 *
 * @param textForCapture The text to parse for phone number patterns.
 * @param testValue Optional string to test the generated regex against for confidence scoring.
 * @returns A `TextExtractionResult` object if a pattern is found, otherwise `null`.
 */
export function parsePhonePatterns(
	textForCapture: string,
	testValue?: string
): TextExtractionResult | null {
	const suggestions: string[] = [];

	// Handle "us phone number" or "american phone"
	if (
		textForCapture.includes('phone') &&
		(textForCapture.includes('us ') ||
			textForCapture.includes('american') ||
			textForCapture.includes('usa') ||
			textForCapture.includes('united states'))
	) {
		const usPhoneFormat =
			'^(\\+1[-\\s]?)?(\\(?[0-9]{3}\\)?[-\\s]?[0-9]{3}[-\\s]?[0-9]{4})$';

		let confidence: number = 0.8;

		if (testValue) {
			const regex = new RegExp(usPhoneFormat);
			const testPassed = regex.test(testValue);
			confidence = calculateConfidence(confidence, true, testPassed);
		}

		return {
			success: true,
			pattern: new RegExp(usPhoneFormat),
			confidence,
			description: 'US phone number format (with optional +1)',
			suggestions,
		};
	}

	// Handle "phone with dashes" or "phone format xxx-xxx-xxxx"
	if (
		textForCapture.includes('phone') &&
		(textForCapture.includes('with dash') ||
			textForCapture.includes('with hyphen') ||
			textForCapture.includes('xxx-xxx') ||
			textForCapture.includes('dash format'))
	) {
		const phoneWithDashes = '^\\d{3}-\\d{3}-\\d{4}$';

		let confidence: number = 0.8;

		if (testValue) {
			const regex = new RegExp(phoneWithDashes);
			const testPassed = regex.test(testValue);
			confidence = calculateConfidence(confidence, true, testPassed);
		}

		return {
			success: true,
			pattern: new RegExp(phoneWithDashes),
			confidence,
			description: 'Phone number with dash format (xxx-xxx-xxxx)',
			suggestions,
		};
	}

	// Handle "phone with country code"
	if (
		textForCapture.includes('phone') &&
		(textForCapture.includes('country code') ||
			textForCapture.includes('international'))
	) {
		const phoneWithCountryCode = '^\\+[1-9]\\d{1,4}[1-9]\\d{4,14}$';

		let confidence: number = 0.8;

		if (testValue) {
			const regex = new RegExp(phoneWithCountryCode);
			const testPassed = regex.test(testValue);
			confidence = calculateConfidence(confidence, true, testPassed);
		}

		return {
			success: true,
			pattern: new RegExp(phoneWithCountryCode),
			confidence,
			description: 'Phone number with required country code',
			suggestions,
		};
	}

	return null;
}
