/**
 * Date and Time-related Combined Pattern Handlers
 */

import type { TextExtractionResult } from '../../../types/index.js';
import { calculateConfidence } from '../helpers.js';

/**
 * Parses combined patterns specifically related to dates and times.
 * @param text - The normalized text to search for patterns.
 * @param testValue - An optional string to test the generated pattern against.
 * @returns A `TextExtractionResult` if a match is found, otherwise `null`.
 */
export function parseDateTimeCombined(
	text: string,
	testValue?: string
): TextExtractionResult | null {
	// Handle "date in MM/DD/YYYY format between 2000 and 2030"
	if (
		text.includes('date') &&
		text.includes('mm/dd/yyyy') &&
		text.includes('between') &&
		text.includes('2000') &&
		text.includes('2030')
	) {
		const dateRangeMMDDYYYY =
			'^(0[1-9]|1[0-2])\\/(0[1-9]|[12]\\d|3[01])\\/(200[0-9]|201[0-9]|202[0-9]|2030)$';

		let confidence = 0.9;

		if (testValue) {
			const regex = new RegExp(dateRangeMMDDYYYY);
			const testPassed = regex.test(testValue);
			confidence = calculateConfidence(confidence, true, testPassed);
		}

		return {
			success: true,
			pattern: new RegExp(dateRangeMMDDYYYY),
			confidence,
			description: 'Date in MM/DD/YYYY format between 2000 and 2030',
			suggestions: [],
		};
	}

	// Handle "datetime with timezone and milliseconds"
	if (
		text.includes('datetime') &&
		text.includes('timezone') &&
		text.includes('milliseconds')
	) {
		const datetimeTimezoneMs =
			'^\\d{4}-\\d{2}-\\d{2}T\\d{2}:\\d{2}:\\d{2}\\.\\d{3}[+-]\\d{2}:\\d{2}$';

		let confidence = 0.85;

		if (testValue) {
			const regex = new RegExp(datetimeTimezoneMs);
			const testPassed = regex.test(testValue);
			confidence = calculateConfidence(confidence, true, testPassed);
		}

		return {
			success: true,
			pattern: new RegExp(datetimeTimezoneMs),
			confidence,
			description: 'DateTime with timezone and milliseconds (ISO 8601)',
			suggestions: [],
		};
	}

	return null;
}
