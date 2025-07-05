/**
 * Date/Time Pattern Handlers
 * Handles date and time format patterns
 */

import type { TextExtractionResult } from '../../types/index.js';
import { calculateConfidence } from './helpers.js';

/**
 * Parse date/time-related patterns
 */
export function parseDateTimePatterns(
	textForCapture: string,
	testValue?: string
): TextExtractionResult | null {
	const suggestions: string[] = [];

	// Handle "date format mm/dd/yyyy" or "american date"
	if (
		(textForCapture.includes('date') && textForCapture.includes('mm/dd')) ||
		(textForCapture.includes('date') && textForCapture.includes('american'))
	) {
		const mmddyyyyFormat =
			'^(0[1-9]|1[0-2])\\/(0[1-9]|[12]\\d|3[01])\\/(19|20)\\d{2}$';

		let confidence: number = 0.8;

		if (testValue) {
			const regex = new RegExp(mmddyyyyFormat);
			const testPassed = regex.test(testValue);
			confidence = calculateConfidence(confidence, true, testPassed);
		}

		return {
			success: true,
			pattern: new RegExp(mmddyyyyFormat),
			confidence,
			description: 'Date in MM/DD/YYYY format',
			suggestions,
		};
	}

	// Handle "date format dd/mm/yyyy" or "european date"
	if (
		(textForCapture.includes('date') && textForCapture.includes('dd/mm')) ||
		(textForCapture.includes('date') && textForCapture.includes('european'))
	) {
		const ddmmyyyyFormat =
			'^(0[1-9]|[12]\\d|3[01])\\/(0[1-9]|1[0-2])\\/(19|20)\\d{2}$';

		let confidence: number = 0.8;

		if (testValue) {
			const regex = new RegExp(ddmmyyyyFormat);
			const testPassed = regex.test(testValue);
			confidence = calculateConfidence(confidence, true, testPassed);
		}

		return {
			success: true,
			pattern: new RegExp(ddmmyyyyFormat),
			confidence,
			description: 'Date in DD/MM/YYYY format',
			suggestions,
		};
	}

	// Handle "age 18+" or "over 18" or "adult age"
	if (
		(textForCapture.includes('age') && textForCapture.includes('18')) ||
		textForCapture.includes('over 18') ||
		textForCapture.includes('adult')
	) {
		const age18Plus = '^(?:1[89]|[2-9]\\d|1[01]\\d|120)$'; // 18-120 years

		let confidence: number = 0.75;

		if (testValue) {
			const regex = new RegExp(age18Plus);
			const testPassed = regex.test(testValue);
			confidence = calculateConfidence(confidence, true, testPassed);
		}

		return {
			success: true,
			pattern: new RegExp(age18Plus),
			confidence,
			description: 'Age 18 or older (18-120)',
			suggestions,
		};
	}

	return null;
}
