/**
 * Business-related Combined Pattern Handlers
 */

import type { TextExtractionResult } from '../../../types/index.js';
import { calculateConfidence } from '../helpers.js';

/**
 * Parses combined patterns specifically related to business identifiers.
 * @param text - The normalized text to search for patterns.
 * @param testValue - An optional string to test the generated pattern against.
 * @returns A `TextExtractionResult` if a match is found, otherwise `null`.
 */
export function parseBusinessCombined(
	text: string,
	testValue?: string
): TextExtractionResult | null {
	// Handle "employee id with department prefix and 4 digit number"
	if (
		text.includes('employee id') &&
		text.includes('department') &&
		text.includes('prefix') &&
		text.includes('4 digit')
	) {
		const employeeIdPattern = '^[A-Z]{2,4}-\\d{4}$';
		let confidence = 0.85;

		if (testValue) {
			const regex = new RegExp(employeeIdPattern);
			const testPassed = regex.test(testValue);
			confidence = calculateConfidence(confidence, true, testPassed);
		}

		return {
			success: true,
			pattern: new RegExp(employeeIdPattern),
			confidence,
			description: 'Employee ID with department prefix and 4 digit number',
			suggestions: [],
		};
	}

	// Handle "invoice number with year and sequential number"
	if (
		text.includes('invoice') &&
		text.includes('year') &&
		text.includes('sequential')
	) {
		const invoicePattern = '^INV-(20\\d{2})-\\d{6}$';
		let confidence = 0.85;

		if (testValue) {
			const regex = new RegExp(invoicePattern);
			const testPassed = regex.test(testValue);
			confidence = calculateConfidence(confidence, true, testPassed);
		}

		return {
			success: true,
			pattern: new RegExp(invoicePattern),
			confidence,
			description: 'Invoice number with year and sequential number',
			suggestions: [],
		};
	}

	// Handle "product sku with category letters and numeric code"
	if (
		text.includes('product sku') &&
		text.includes('category') &&
		text.includes('letters') &&
		text.includes('numeric')
	) {
		const productSkuPattern = '^[A-Z]{3}-\\d{5}$';
		let confidence = 0.85;

		if (testValue) {
			const regex = new RegExp(productSkuPattern);
			const testPassed = regex.test(testValue);
			confidence = calculateConfidence(confidence, true, testPassed);
		}

		return {
			success: true,
			pattern: new RegExp(productSkuPattern),
			confidence,
			description: 'Product SKU with category letters and numeric code',
			suggestions: [],
		};
	}

	return null;
}
