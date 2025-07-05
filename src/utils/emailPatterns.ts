/**
 * Email Pattern Handlers
 * Handles various email pattern variations
 */

import type { TextExtractionResult } from '../../types/index.js';
import { calculateConfidence } from './helpers.js';

/**
 * Parse email-related patterns
 */
export function parseEmailPatterns(
	textForCapture: string,
	testValue?: string
): TextExtractionResult | null {
	const suggestions: string[] = [];

	// Handle "email have number in domain"
	if (
		textForCapture.includes('email') &&
		(textForCapture.includes('number in domain') ||
			textForCapture.includes('digit in domain'))
	) {
		const emailWithNumberInDomain =
			"^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9]*\\d+[a-zA-Z0-9-]*(?:\\.[a-zA-Z0-9]*\\d*[a-zA-Z0-9-]*)*$";

		let confidence: number = 0.8;

		if (testValue) {
			const regex = new RegExp(emailWithNumberInDomain);
			const testPassed = regex.test(testValue);
			confidence = calculateConfidence(confidence, true, testPassed);

			if (!testPassed) {
				suggestions.push(
					`The test value "${testValue}" doesn't match the email with number in domain pattern`,
					'Try emails like: user@domain123.com, test@abc1.org'
				);
			}
		}

		return {
			success: true,
			pattern: new RegExp(emailWithNumberInDomain),
			confidence,
			description: 'Email address with at least one number in the domain',
			suggestions,
		};
	}

	// Handle "email with .com domain" or "email ending with .com"
	if (
		textForCapture.includes('email') &&
		(textForCapture.includes('.com domain') ||
			textForCapture.includes('ending with .com') ||
			textForCapture.includes('only .com') ||
			textForCapture.includes('com domain'))
	) {
		const emailComOnly =
			"^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*\\.com$";

		let confidence: number = 0.8;

		if (testValue) {
			const regex = new RegExp(emailComOnly);
			const testPassed = regex.test(testValue);
			confidence = calculateConfidence(confidence, true, testPassed);
		}

		return {
			success: true,
			pattern: new RegExp(emailComOnly),
			confidence,
			description: 'Email address with .com domain only',
			suggestions,
		};
	}

	// Handle "corporate email" or "business email"
	if (
		textForCapture.includes('email') &&
		(textForCapture.includes('corporate') ||
			textForCapture.includes('business') ||
			textForCapture.includes('company') ||
			textForCapture.includes('work'))
	) {
		const corporateEmail =
			'^[a-zA-Z0-9._%+-]+@(?!gmail|yahoo|hotmail|outlook|aol|icloud)[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$';

		let confidence: number = 0.75;

		if (testValue) {
			const regex = new RegExp(corporateEmail);
			const testPassed = regex.test(testValue);
			confidence = calculateConfidence(confidence, true, testPassed);
		}

		return {
			success: true,
			pattern: new RegExp(corporateEmail),
			confidence,
			description: 'Corporate email address (excludes common free providers)',
			suggestions,
		};
	}

	// Handle "email without plus" or "email no plus sign"
	if (
		textForCapture.includes('email') &&
		(textForCapture.includes('without plus') ||
			textForCapture.includes('no plus') ||
			textForCapture.includes('exclude plus'))
	) {
		const emailNoPlus =
			"^[a-zA-Z0-9.!#$%&'*_=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$";

		let confidence: number = 0.8;

		if (testValue) {
			const regex = new RegExp(emailNoPlus);
			const testPassed = regex.test(testValue);
			confidence = calculateConfidence(confidence, true, testPassed);
		}

		return {
			success: true,
			pattern: new RegExp(emailNoPlus),
			confidence,
			description: 'Email address without plus signs',
			suggestions,
		};
	}

	return null;
}
