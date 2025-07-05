/**
 * File and Format-related Combined Pattern Handlers
 */

import type { TextExtractionResult } from '../../../types/index.js';
import { calculateConfidence } from '../helpers.js';

/**
 * Parses combined patterns specifically related to files, paths, and formats.
 * @param text - The normalized text to search for patterns.
 * @param testValue - An optional string to test the generated pattern against.
 * @returns A `TextExtractionResult` if a match is found, otherwise `null`.
 */
export function parseFileCombined(
	text: string,
	testValue?: string
): TextExtractionResult | null {
	// Handle "filename with extension and no spaces or special characters"
	if (
		text.includes('filename') &&
		text.includes('extension') &&
		text.includes('no spaces') &&
		(text.includes('no special') || text.includes('special characters'))
	) {
		const filenameClean = '^[a-zA-Z0-9._-]+\\.[a-zA-Z0-9]{1,4}$';

		let confidence = 0.8;

		if (testValue) {
			const regex = new RegExp(filenameClean);
			const testPassed = regex.test(testValue);
			confidence = calculateConfidence(confidence, true, testPassed);
		}

		return {
			success: true,
			pattern: new RegExp(filenameClean),
			confidence,
			description:
				'Clean filename with extension, no spaces or special characters',
			suggestions: [],
		};
	}

	// Handle "json object with specific required fields"
	if (text.includes('json') && text.includes('required fields')) {
		const jsonWithRequiredFields =
			'^\\{(?=.*"id"\\s*:\\s*\\d+)(?=.*"name"\\s*:\\s*"[^"]*")(?=.*"email"\\s*:\\s*"[^"]*@[^"]*").*\\}$';

		let confidence = 0.75;

		if (testValue) {
			const regex = new RegExp(jsonWithRequiredFields);
			const testPassed = regex.test(testValue);
			confidence = calculateConfidence(confidence, true, testPassed);
		}

		return {
			success: true,
			pattern: new RegExp(jsonWithRequiredFields),
			confidence,
			description:
				'JSON object with required fields: id (number), name (string), email (string)',
			suggestions: [],
		};
	}

	// Handle "file path with unix style forward slashes and no spaces"
	if (
		text.includes('file path') &&
		text.includes('unix style') &&
		text.includes('forward slashes') &&
		text.includes('no spaces')
	) {
		const unixPathPattern = '^(\\.{1,2})?/[^\\s]+$';
		let confidence = 0.85;

		if (testValue) {
			const regex = new RegExp(unixPathPattern);
			const testPassed = regex.test(testValue);
			confidence = calculateConfidence(confidence, true, testPassed);
		}

		return {
			success: true,
			pattern: new RegExp(unixPathPattern),
			confidence,
			description: 'File path with Unix style forward slashes and no spaces',
			suggestions: [],
		};
	}

	// Handle "semantic version with major minor patch and optional prerelease"
	if (
		text.includes('semantic version') &&
		text.includes('major minor patch') &&
		text.includes('optional prerelease')
	) {
		const semverPattern =
			'^(0|[1-9]\\d*)\\.(0|[1-9]\\d*)\\.(0|[1-9]\\d*)(?:-((?:0|[1-9]\\d*|\\d*[a-zA-Z-][0-9a-zA-Z-]*)(?:\\.(?:0|[1-9]\\d*|\\d*[a-zA-Z-][0-9a-zA-Z-]*))*))?(?:\\+([0-9a-zA-Z-]+(?:\\.[0-9a-zA-Z-]+)*))?$';
		let confidence = 0.9;

		if (testValue) {
			const regex = new RegExp(semverPattern);
			const testPassed = regex.test(testValue);
			confidence = calculateConfidence(confidence, true, testPassed);
		}

		return {
			success: true,
			pattern: new RegExp(semverPattern),
			confidence,
			description:
				'Semantic version with major.minor.patch and optional prerelease',
			suggestions: [],
		};
	}

	// Handle "log entry with timestamp level and message"
	if (
		text.includes('log entry') &&
		text.includes('timestamp') &&
		text.includes('level') &&
		text.includes('message')
	) {
		const logEntryPattern =
			'^\\d{4}-\\d{2}-\\d{2} \\d{2}:\\d{2}:\\d{2} (DEBUG|INFO|WARN|ERROR|FATAL) .+$';
		let confidence = 0.85;

		if (testValue) {
			const regex = new RegExp(logEntryPattern);
			const testPassed = regex.test(testValue);
			confidence = calculateConfidence(confidence, true, testPassed);
		}

		return {
			success: true,
			pattern: new RegExp(logEntryPattern),
			confidence,
			description: 'Log entry with timestamp, level, and message',
			suggestions: [],
		};
	}

	return null;
}
