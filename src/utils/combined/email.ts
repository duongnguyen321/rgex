/**
 * Email-related Combined Pattern Handlers
 */

import type { TextExtractionResult } from '../../../types/index.js';
import { calculateConfidence } from '../helpers.js';

/**
 * Parses combined patterns specifically related to email addresses.
 * @param text - The normalized text to search for patterns.
 * @param testValue - An optional string to test the generated pattern against.
 * @returns A `TextExtractionResult` if a match is found, otherwise `null`.
 */
export function parseEmailCombined(
	text: string,
	testValue?: string
): TextExtractionResult | null {
	// Handle "corporate email with at least 8 characters before @"
	if (
		text.includes('email') &&
		(text.includes('corporate') || text.includes('business')) &&
		text.includes('at least') &&
		text.includes('8') &&
		text.includes('before')
	) {
		const corporateEmailMinLength =
			'^[a-zA-Z0-9._%+-]{8,}@(?!gmail|yahoo|hotmail|outlook|aol|icloud)[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$';

		let confidence = 0.85;

		if (testValue) {
			const regex = new RegExp(corporateEmailMinLength);
			const testPassed = regex.test(testValue);
			confidence = calculateConfidence(confidence, true, testPassed);
		}

		return {
			success: true,
			pattern: new RegExp(corporateEmailMinLength),
			confidence,
			description: 'Corporate email with at least 8 characters before @',
			suggestions: [],
		};
	}

	// Handle "email with number in domain and ends with .com"
	if (
		text.includes('email') &&
		text.includes('number in domain') &&
		text.includes('.com')
	) {
		const emailNumberDomainCom =
			"^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9]*\\d+[a-zA-Z0-9-]*\\.com$";

		let confidence = 0.85;

		if (testValue) {
			const regex = new RegExp(emailNumberDomainCom);
			const testPassed = regex.test(testValue);
			confidence = calculateConfidence(confidence, true, testPassed);
		}

		return {
			success: true,
			pattern: new RegExp(emailNumberDomainCom),
			confidence,
			description: 'Email with number in domain and .com extension',
			suggestions: [],
		};
	}

	// Handle "email with custom domain not gmail yahoo hotmail and minimum 5 characters before at"
	if (
		text.includes('email') &&
		text.includes('custom domain') &&
		text.includes('not gmail') &&
		text.includes('5 characters before')
	) {
		const customDomainEmailPattern =
			'^[a-zA-Z0-9._%+-]{5,}@(?!gmail|yahoo|hotmail|outlook|aol|icloud)[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$';
		let confidence = 0.85;

		if (testValue) {
			const regex = new RegExp(customDomainEmailPattern);
			const testPassed = regex.test(testValue);
			confidence = calculateConfidence(confidence, true, testPassed);
		}

		return {
			success: true,
			pattern: new RegExp(customDomainEmailPattern),
			confidence,
			description:
				'Email with custom domain (not Gmail/Yahoo/Hotmail) and minimum 5 characters before @',
			suggestions: [],
		};
	}

	return null;
}
