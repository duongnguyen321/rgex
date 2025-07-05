/**
 * Password-related Combined Pattern Handlers
 */

import type { TextExtractionResult } from '../../../types/index.js';
import { calculateConfidence } from '../helpers.js';

/**
 * Parses combined patterns specifically related to passwords.
 * @param text - The normalized text to search for patterns.
 * @param testValue - An optional string to test the generated pattern against.
 * @returns A `TextExtractionResult` if a match is found, otherwise `null`.
 */
export function parsePasswordCombined(
	text: string,
	testValue?: string
): TextExtractionResult | null {
	// Handle "password with uppercase lowercase number special and no dictionary words minimum 12 characters"
	if (
		text.includes('password') &&
		text.includes('uppercase') &&
		text.includes('lowercase') &&
		text.includes('number') &&
		text.includes('special') &&
		text.includes('no dictionary') &&
		text.includes('12')
	) {
		const complexPassword12 =
			'^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[!@#$%^&*()_+\\-=\\[\\]{};\':"\\\\|,.<>\\/?])(?!.*(password|123456|qwerty|admin|welcome|letmein|monkey|dragon|master|shadow|abc123|password123|admin123|welcome123|iloveyou|princess|football|baseball|superman|michael|computer|login)).{12,}$';

		let confidence = 0.9;

		if (testValue) {
			const regex = new RegExp(complexPassword12, 'i');
			const testPassed = regex.test(testValue);
			confidence = calculateConfidence(confidence, true, testPassed);
		}

		return {
			success: true,
			pattern: new RegExp(complexPassword12, 'i'),
			confidence,
			description:
				'Complex password: 12+ chars, mixed case, number, special, no dictionary words',
			suggestions: [],
		};
	}

	// Handle "password with at least 3 numbers and 2 special characters minimum 10 characters"
	if (
		text.includes('password') &&
		text.includes('at least 3 numbers') &&
		text.includes('2 special characters') &&
		text.includes('10')
	) {
		const passwordMultiRequirements =
			'^(?=(?:.*\\d){3,})(?=(?:.*[!@#$%^&*()_+\\-=\\[\\]{};\':"\\\\|,.<>\\/?]){2,}).{10,}$';

		let confidence = 0.85;

		if (testValue) {
			const regex = new RegExp(passwordMultiRequirements);
			const testPassed = regex.test(testValue);
			confidence = calculateConfidence(confidence, true, testPassed);
		}

		return {
			success: true,
			pattern: new RegExp(passwordMultiRequirements),
			confidence,
			description:
				'Password with at least 3 numbers, 2 special characters, minimum 10 chars',
			suggestions: [],
		};
	}

	// Handle "password with 2 uppercase 2 lowercase 2 numbers 2 special minimum 12 characters no common words"
	if (
		text.includes('password') &&
		text.includes('2 uppercase') &&
		text.includes('2 lowercase') &&
		text.includes('2 numbers') &&
		text.includes('2 special') &&
		text.includes('12 characters') &&
		text.includes('no common words')
	) {
		const complexPasswordPattern =
			'^(?=(?:.*[A-Z]){2,})(?=(?:.*[a-z]){2,})(?=(?:.*\\d){2,})(?=(?:.*[!@#$%^&*()_+\\-=\\[\\]{};\':"\\\\|,.<>\\/?]){2,})(?!.*(password|123456|qwerty|admin|welcome|letmein|monkey|dragon|master|shadow|abc123|password123|admin123|welcome123|iloveyou|princess|football|baseball|superman|michael|computer|login)).{12,}$';
		let confidence = 0.9;

		if (testValue) {
			const regex = new RegExp(complexPasswordPattern, 'i');
			const testPassed = regex.test(testValue);
			confidence = calculateConfidence(confidence, true, testPassed);
		}

		return {
			success: true,
			pattern: new RegExp(complexPasswordPattern, 'i'),
			confidence,
			description:
				'Complex password: 2+ uppercase, 2+ lowercase, 2+ numbers, 2+ special, 12+ chars, no common words',
			suggestions: [],
		};
	}

	return null;
}
