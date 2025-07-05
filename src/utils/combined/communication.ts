/**
 * Communication-related Combined Pattern Handlers
 */

import type { TextExtractionResult } from '../../../types/index.js';
import { calculateConfidence } from '../helpers.js';

/**
 * Parses combined patterns specifically related to communication platforms.
 * @param text - The normalized text to search for patterns.
 * @param testValue - An optional string to test the generated pattern against.
 * @returns A `TextExtractionResult` if a match is found, otherwise `null`.
 */
export function parseCommunicationCombined(
	text: string,
	testValue?: string
): TextExtractionResult | null {
	// Handle "slack channel name with hash and lowercase letters"
	if (
		text.includes('slack channel') &&
		text.includes('hash') &&
		text.includes('lowercase')
	) {
		const slackChannelPattern = '^#[a-z0-9-_]+$';
		let confidence = 0.85;

		if (testValue) {
			const regex = new RegExp(slackChannelPattern);
			const testPassed = regex.test(testValue);
			confidence = calculateConfidence(confidence, true, testPassed);
		}

		return {
			success: true,
			pattern: new RegExp(slackChannelPattern),
			confidence,
			description: 'Slack channel name with hash and lowercase letters',
			suggestions: [],
		};
	}

	// Handle "discord username with discriminator number"
	if (
		text.includes('discord') &&
		text.includes('username') &&
		text.includes('discriminator')
	) {
		const discordPattern = '^[a-zA-Z0-9_.-]{2,32}#\\d{4}$';
		let confidence = 0.85;

		if (testValue) {
			const regex = new RegExp(discordPattern);
			const testPassed = regex.test(testValue);
			confidence = calculateConfidence(confidence, true, testPassed);
		}

		return {
			success: true,
			pattern: new RegExp(discordPattern),
			confidence,
			description: 'Discord username with discriminator number',
			suggestions: [],
		};
	}

	// Handle "mention with at symbol and alphanumeric username"
	if (
		text.includes('mention') &&
		text.includes('at symbol') &&
		text.includes('alphanumeric')
	) {
		const mentionPattern = '^@[a-zA-Z0-9_.]+$';
		let confidence = 0.8;

		if (testValue) {
			const regex = new RegExp(mentionPattern);
			const testPassed = regex.test(testValue);
			confidence = calculateConfidence(confidence, true, testPassed);
		}

		return {
			success: true,
			pattern: new RegExp(mentionPattern),
			confidence,
			description: 'Mention with at symbol and alphanumeric username',
			suggestions: [],
		};
	}

	return null;
}
