/**
 * Technology-related Combined Pattern Handlers
 */

import type { TextExtractionResult } from '../../../types/index.js';
import { calculateConfidence } from '../helpers.js';

/**
 * Parses combined patterns specifically related to technology identifiers.
 * @param text - The normalized text to search for patterns.
 * @param testValue - An optional string to test the generated pattern against.
 * @returns A `TextExtractionResult` if a match is found, otherwise `null`.
 */
export function parseTechnologyCombined(
	text: string,
	testValue?: string
): TextExtractionResult | null {
	// Handle "docker image tag with registry and version"
	if (
		text.includes('docker image') &&
		text.includes('tag') &&
		text.includes('version')
	) {
		const dockerImagePattern = '^[a-z0-9._/-]+:[a-zA-Z0-9._-]+$';
		let confidence = 0.85;

		if (testValue) {
			const regex = new RegExp(dockerImagePattern);
			const testPassed = regex.test(testValue);
			confidence = calculateConfidence(confidence, true, testPassed);
		}

		return {
			success: true,
			pattern: new RegExp(dockerImagePattern),
			confidence,
			description: 'Docker image tag with registry and version',
			suggestions: [],
		};
	}

	// Handle "kubernetes pod name with deployment and random suffix"
	if (
		text.includes('kubernetes pod') &&
		text.includes('deployment') &&
		text.includes('random suffix')
	) {
		const k8sPodPattern = '^[a-z0-9-]+-[a-z0-9]{6,10}$';
		let confidence = 0.8;

		if (testValue) {
			const regex = new RegExp(k8sPodPattern);
			const testPassed = regex.test(testValue);
			confidence = calculateConfidence(confidence, true, testPassed);
		}

		return {
			success: true,
			pattern: new RegExp(k8sPodPattern),
			confidence,
			description: 'Kubernetes pod name with deployment and random suffix',
			suggestions: [],
		};
	}

	// Handle "git commit hash with 7 or 40 hex characters"
	if (
		text.includes('git commit') &&
		text.includes('7 or 40') &&
		text.includes('hex')
	) {
		const gitCommitPattern = '^[a-f0-9]{7}([a-f0-9]{33})?$';
		let confidence = 0.85;

		if (testValue) {
			const regex = new RegExp(gitCommitPattern);
			const testPassed = regex.test(testValue);
			confidence = calculateConfidence(confidence, true, testPassed);
		}

		return {
			success: true,
			pattern: new RegExp(gitCommitPattern),
			confidence,
			description: 'Git commit hash with 7 or 40 hex characters',
			suggestions: [],
		};
	}

	return null;
}
