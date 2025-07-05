/**
 * Education-related Combined Pattern Handlers
 */

import type { TextExtractionResult } from '../../../types/index.js';
import { calculateConfidence } from '../helpers.js';

/**
 * Parses combined patterns specifically related to education identifiers.
 * @param text - The normalized text to search for patterns.
 * @param testValue - An optional string to test the generated pattern against.
 * @returns A `TextExtractionResult` if a match is found, otherwise `null`.
 */
export function parseEducationCombined(
	text: string,
	testValue?: string
): TextExtractionResult | null {
	// Handle "student id with year and sequence number"
	if (
		text.includes('student id') &&
		text.includes('year') &&
		text.includes('sequence')
	) {
		const studentIdPattern = '^(20\\d{2})-(\\d{6})$';
		let confidence = 0.85;

		if (testValue) {
			const regex = new RegExp(studentIdPattern);
			const testPassed = regex.test(testValue);
			confidence = calculateConfidence(confidence, true, testPassed);
		}

		return {
			success: true,
			pattern: new RegExp(studentIdPattern),
			confidence,
			description: 'Student ID with year and sequence number',
			suggestions: [],
		};
	}

	// Handle "course code with department and number"
	if (
		text.includes('course code') &&
		text.includes('department') &&
		text.includes('number')
	) {
		const courseCodePattern = '^[A-Z]{2,4}-\\d{3,4}$';
		let confidence = 0.85;

		if (testValue) {
			const regex = new RegExp(courseCodePattern);
			const testPassed = regex.test(testValue);
			confidence = calculateConfidence(confidence, true, testPassed);
		}

		return {
			success: true,
			pattern: new RegExp(courseCodePattern),
			confidence,
			description: 'Course code with department and number',
			suggestions: [],
		};
	}

	// Handle "grade with letter and optional plus or minus"
	if (
		text.includes('grade') &&
		text.includes('letter') &&
		text.includes('optional plus or minus')
	) {
		const gradePattern = '^[A-F][+-]?$';
		let confidence = 0.85;

		if (testValue) {
			const regex = new RegExp(gradePattern);
			const testPassed = regex.test(testValue);
			confidence = calculateConfidence(confidence, true, testPassed);
		}

		return {
			success: true,
			pattern: new RegExp(gradePattern),
			confidence,
			description: 'Grade with letter and optional plus or minus',
			suggestions: [],
		};
	}

	return null;
}
