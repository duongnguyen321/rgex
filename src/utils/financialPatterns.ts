/**
 * Financial/ID Pattern Handlers
 * Handles credit cards, SSN, postal codes, etc.
 */

import type { TextExtractionResult } from '../../types/index.js';
import { calculateConfidence } from './helpers.js';

/**
 * Parses text for common financial and government ID-related patterns.
 *
 * This function identifies patterns for Visa credit cards, Social Security Numbers (SSN),
 * and US ZIP codes. It returns a structured result with the corresponding regex pattern,
 * a confidence score, and a description.
 *
 * @param textForCapture - The natural language text to be analyzed for patterns.
 * @param testValue - An optional string to test the generated pattern against for confidence scoring.
 * @returns A `TextExtractionResult` object if a pattern is successfully parsed, otherwise `null`.
 */
export function parseFinancialPatterns(
	textForCapture: string,
	testValue?: string
): TextExtractionResult | null {
	const suggestions: string[] = [];

	// Handle "credit card visa" or "visa card"
	if (
		(textForCapture.includes('credit') || textForCapture.includes('card')) &&
		textForCapture.includes('visa')
	) {
		const visaCard = '^4[0-9]{12}(?:[0-9]{3})?$';

		let confidence: number = 0.8;

		if (testValue) {
			const regex = new RegExp(visaCard);
			const testPassed = regex.test(testValue);
			confidence = calculateConfidence(confidence, true, testPassed);
		}

		return {
			success: true,
			pattern: new RegExp(visaCard),
			confidence,
			description: 'Visa credit card number',
			suggestions,
		};
	}

	// Handle "social security number" or "ssn"
	if (
		textForCapture.includes('social security') ||
		textForCapture.includes('ssn')
	) {
		const ssnPattern =
			'^(?!666|000|9\\d{2})\\d{3}-(?!00)\\d{2}-(?!0{4})\\d{4}$';

		let confidence: number = 0.8;

		if (testValue) {
			const regex = new RegExp(ssnPattern);
			const testPassed = regex.test(testValue);
			confidence = calculateConfidence(confidence, true, testPassed);
		}

		return {
			success: true,
			pattern: new RegExp(ssnPattern),
			confidence,
			description: 'US Social Security Number (XXX-XX-XXXX)',
			suggestions,
		};
	}

	// Handle "us zip code" or "postal code"
	if (
		(textForCapture.includes('zip') || textForCapture.includes('postal')) &&
		(textForCapture.includes('us') || textForCapture.includes('american'))
	) {
		const usZipCode = '^\\d{5}(-\\d{4})?$';

		let confidence: number = 0.8;

		if (testValue) {
			const regex = new RegExp(usZipCode);
			const testPassed = regex.test(testValue);
			confidence = calculateConfidence(confidence, true, testPassed);
		}

		return {
			success: true,
			pattern: new RegExp(usZipCode),
			confidence,
			description: 'US ZIP code (5 digits with optional +4)',
			suggestions,
		};
	}

	return null;
}
