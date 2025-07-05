/**
 * Security Pattern Handlers
 * Handles password and security-related patterns
 */

import type { TextExtractionResult } from '../../types/index.js';
import { calculateConfidence } from './helpers.js';

/**
 * Parses text for security-related patterns and returns a corresponding regex.
 *
 * It understands phrases like:
 * - "password no dictionary words"
 * - "strong password 8 characters"
 *
 * @param textForCapture The text to parse for security patterns.
 * @param testValue Optional string to test the generated regex against for confidence scoring.
 * @returns A `TextExtractionResult` object if a pattern is found, otherwise `null`.
 */
export function parseSecurityPatterns(
	textForCapture: string,
	testValue?: string
): TextExtractionResult | null {
	const suggestions: string[] = [];

	// Handle "password no dictionary words" or "password without common words"
	if (
		textForCapture.includes('password') &&
		(textForCapture.includes('no dictionary') ||
			textForCapture.includes('without common') ||
			textForCapture.includes('no common words') ||
			textForCapture.includes('exclude dictionary'))
	) {
		const passwordNoDictionary =
			'^(?!.*(password|123456|qwerty|admin|welcome|letmein|monkey|dragon|master|shadow|abc123|password123|admin123|welcome123|iloveyou|princess|football|baseball|superman|michael|computer|login)).{8,}$';

		let confidence: number = 0.75;

		if (testValue) {
			const regex = new RegExp(passwordNoDictionary, 'i');
			const testPassed = regex.test(testValue);
			confidence = calculateConfidence(confidence, true, testPassed);
		}

		return {
			success: true,
			pattern: new RegExp(passwordNoDictionary, 'i'),
			confidence,
			description: 'Password without common dictionary words',
			suggestions,
		};
	}

	// Handle "strong password 8 characters" or "complex password minimum 8"
	if (
		textForCapture.includes('password') &&
		(textForCapture.includes('strong') || textForCapture.includes('complex')) &&
		textForCapture.includes('8')
	) {
		const strongPassword8 =
			'^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[!@#$%^&*()_+\\-=\\[\\]{};\':"\\\\|,.<>\\/?]).{8,}$';

		let confidence: number = 0.8;

		if (testValue) {
			const regex = new RegExp(strongPassword8);
			const testPassed = regex.test(testValue);
			confidence = calculateConfidence(confidence, true, testPassed);
		}

		return {
			success: true,
			pattern: new RegExp(strongPassword8),
			confidence,
			description:
				'Strong password: minimum 8 characters with uppercase, lowercase, number, and special character',
			suggestions,
		};
	}

	return null;
}
