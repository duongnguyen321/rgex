/**
 * URL Pattern Handlers
 * Handles URL-related patterns
 */

import type { TextExtractionResult } from '../../types/index.js';
import { calculateConfidence } from './helpers.js';

/**
 * Parse URL-related patterns
 */
export function parseUrlPatterns(
	textForCapture: string,
	testValue?: string
): TextExtractionResult | null {
	const suggestions: string[] = [];

	// Handle "url with https"
	if (textForCapture.includes('url') && textForCapture.includes('https')) {
		const httpsOnlyUrl =
			'^https:\\/\\/(www\\.)?[-a-zA-Z0-9@:%._\\+~#=]{1,256}\\.[a-zA-Z0-9()]{1,6}\\b([-a-zA-Z0-9()@:%_\\+.~#?&//=]*)$';

		let confidence: number = 0.8;

		if (testValue) {
			const regex = new RegExp(httpsOnlyUrl);
			const testPassed = regex.test(testValue);
			confidence = calculateConfidence(confidence, true, testPassed);
		}

		return {
			success: true,
			pattern: new RegExp(httpsOnlyUrl),
			confidence,
			description: 'HTTPS URL only',
			suggestions,
		};
	}

	// Handle "url without query" or "url no parameters"
	if (
		textForCapture.includes('url') &&
		(textForCapture.includes('without query') ||
			textForCapture.includes('no parameters') ||
			textForCapture.includes('no query') ||
			textForCapture.includes('clean url'))
	) {
		const urlNoQuery =
			'^https?:\\/\\/(www\\.)?[-a-zA-Z0-9@:%._\\+~#=]{1,256}\\.[a-zA-Z0-9()]{1,6}\\b([-a-zA-Z0-9()@:%_\\+.~#\\/=]*)(?!.*\\?)$';

		let confidence: number = 0.8;

		if (testValue) {
			const regex = new RegExp(urlNoQuery);
			const testPassed = regex.test(testValue);
			confidence = calculateConfidence(confidence, true, testPassed);
		}

		return {
			success: true,
			pattern: new RegExp(urlNoQuery),
			confidence,
			description: 'URL without query parameters',
			suggestions,
		};
	}

	return null;
}
