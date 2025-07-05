/**
 * Financial-related Combined Pattern Handlers
 */

import type { TextExtractionResult } from '../../../types/index.js';
import { calculateConfidence } from '../helpers.js';

/**
 * Parses combined patterns specifically related to financial data.
 * @param text - The normalized text to search for patterns.
 * @param testValue - An optional string to test the generated pattern against.
 * @returns A `TextExtractionResult` if a match is found, otherwise `null`.
 */
export function parseFinancialCombined(
	text: string,
	testValue?: string
): TextExtractionResult | null {
	// Handle "credit card with expiry date and cvv"
	if (
		text.includes('credit card') &&
		text.includes('expiry') &&
		text.includes('cvv')
	) {
		const creditCardWithExpiryCvv =
			'^(?:4[0-9]{12}(?:[0-9]{3})?|5[1-5][0-9]{14}|3[47][0-9]{13})\\s+(0[1-9]|1[0-2])\\/\\d{2}\\s+\\d{3,4}$';

		let confidence = 0.85;

		if (testValue) {
			const regex = new RegExp(creditCardWithExpiryCvv);
			const testPassed = regex.test(testValue);
			confidence = calculateConfidence(confidence, true, testPassed);
		}

		return {
			success: true,
			pattern: new RegExp(creditCardWithExpiryCvv),
			confidence,
			description: 'Credit card number with expiry date (MM/YY) and CVV',
			suggestions: [],
		};
	}

	// Handle "bank account with routing number and account number"
	if (
		text.includes('bank account') &&
		text.includes('routing') &&
		text.includes('account number')
	) {
		const bankAccountFull = '^\\d{9}\\s+\\d{4,17}$'; // Routing number (9 digits) + Account number (4-17 digits)

		let confidence = 0.8;

		if (testValue) {
			const regex = new RegExp(bankAccountFull);
			const testPassed = regex.test(testValue);
			confidence = calculateConfidence(confidence, true, testPassed);
		}

		return {
			success: true,
			pattern: new RegExp(bankAccountFull),
			confidence,
			description:
				'Bank account with routing number (9 digits) and account number (4-17 digits)',
			suggestions: [],
		};
	}

	// Handle "iban with country code and check digits"
	if (
		text.includes('iban') &&
		text.includes('country code') &&
		text.includes('check digits')
	) {
		const ibanPattern = '^[A-Z]{2}\\d{2}[A-Z0-9]{15,30}$';
		let confidence = 0.85;

		if (testValue) {
			const regex = new RegExp(ibanPattern);
			const testPassed = regex.test(testValue);
			confidence = calculateConfidence(confidence, true, testPassed);
		}

		return {
			success: true,
			pattern: new RegExp(ibanPattern),
			confidence,
			description: 'IBAN with country code and check digits',
			suggestions: [],
		};
	}

	// Handle "bitcoin address with 1 or 3 prefix and base58 characters"
	if (
		text.includes('bitcoin') &&
		text.includes('1 or 3 prefix') &&
		text.includes('base58')
	) {
		const bitcoinPattern = '^[13][a-km-zA-HJ-NP-Z1-9]{25,34}$';
		let confidence = 0.85;

		if (testValue) {
			const regex = new RegExp(bitcoinPattern);
			const testPassed = regex.test(testValue);
			confidence = calculateConfidence(confidence, true, testPassed);
		}

		return {
			success: true,
			pattern: new RegExp(bitcoinPattern),
			confidence,
			description: 'Bitcoin address with 1 or 3 prefix and base58 characters',
			suggestions: [],
		};
	}

	// Handle "swift code with 8 or 11 characters bank identifier"
	if (
		text.includes('swift') &&
		text.includes('8 or 11 characters') &&
		text.includes('bank')
	) {
		const swiftPattern = '^[A-Z]{4}[A-Z]{2}[A-Z0-9]{2}([A-Z0-9]{3})?$';
		let confidence = 0.85;

		if (testValue) {
			const regex = new RegExp(swiftPattern);
			const testPassed = regex.test(testValue);
			confidence = calculateConfidence(confidence, true, testPassed);
		}

		return {
			success: true,
			pattern: new RegExp(swiftPattern),
			confidence,
			description: 'SWIFT code with 8 or 11 characters bank identifier',
			suggestions: [],
		};
	}

	return null;
}
