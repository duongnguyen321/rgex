/**
 * URL-related Combined Pattern Handlers
 */

import type { TextExtractionResult } from '../../../types/index.js';
import { calculateConfidence } from '../helpers.js';

/**
 * Parses combined patterns specifically related to URLs and domains.
 * @param text - The normalized text to search for patterns.
 * @param testValue - An optional string to test the generated pattern against.
 * @returns A `TextExtractionResult` if a match is found, otherwise `null`.
 */
export function parseUrlCombined(
	text: string,
	testValue?: string
): TextExtractionResult | null {
	// Handle "https url with subdomain and no query parameters"
	if (
		text.includes('https') &&
		text.includes('url') &&
		text.includes('subdomain') &&
		text.includes('no query')
	) {
		const httpsSubdomainNoQuery =
			'^https:\\/\\/[a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?\\.[a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?\\.[a-zA-Z]{2,}(\\/[^?]*)?$';

		let confidence = 0.85;

		if (testValue) {
			const regex = new RegExp(httpsSubdomainNoQuery);
			const testPassed = regex.test(testValue);
			confidence = calculateConfidence(confidence, true, testPassed);
		}

		return {
			success: true,
			pattern: new RegExp(httpsSubdomainNoQuery),
			confidence,
			description: 'HTTPS URL with subdomain and no query parameters',
			suggestions: [],
		};
	}

	// Handle "url with specific port and path but no fragment"
	if (
		text.includes('url') &&
		text.includes('port') &&
		text.includes('path') &&
		text.includes('no fragment')
	) {
		const urlPortPathNoFragment =
			'^https?:\\/\\/[a-zA-Z0-9.-]+:[0-9]{1,5}\\/[^#]*(?<!#.*)$';

		let confidence = 0.8;

		if (testValue) {
			const regex = new RegExp(urlPortPathNoFragment);
			const testPassed = regex.test(testValue);
			confidence = calculateConfidence(confidence, true, testPassed);
		}

		return {
			success: true,
			pattern: new RegExp(urlPortPathNoFragment),
			confidence,
			description: 'URL with specific port and path but no fragment',
			suggestions: [],
		};
	}

	return null;
}
