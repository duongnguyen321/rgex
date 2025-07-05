/**
 * Security-related Combined Pattern Handlers
 */

import type { TextExtractionResult } from '../../../types/index.js';
import { calculateConfidence } from '../helpers.js';

/**
 * Parses combined patterns specifically related to security identifiers.
 * @param text - The normalized text to search for patterns.
 * @param testValue - An optional string to test the generated pattern against.
 * @returns A `TextExtractionResult` if a match is found, otherwise `null`.
 */
export function parseSecurityCombined(
	text: string,
	testValue?: string
): TextExtractionResult | null {
	// Handle "ipv4 address with specific subnet mask"
	if (text.includes('ipv4') && text.includes('subnet mask')) {
		const ipv4WithSubnet =
			'^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\/(?:[0-9]|[1-2][0-9]|3[0-2])$';

		let confidence = 0.85;

		if (testValue) {
			const regex = new RegExp(ipv4WithSubnet);
			const testPassed = regex.test(testValue);
			confidence = calculateConfidence(confidence, true, testPassed);
		}

		return {
			success: true,
			pattern: new RegExp(ipv4WithSubnet),
			confidence,
			description: 'IPv4 address with CIDR subnet mask notation',
			suggestions: [],
		};
	}

	// Handle "mac address with colons and uppercase letters"
	if (
		text.includes('mac address') &&
		text.includes('colons') &&
		text.includes('uppercase')
	) {
		const macAddressColonUpper =
			'^[A-F0-9]{2}:[A-F0-9]{2}:[A-F0-9]{2}:[A-F0-9]{2}:[A-F0-9]{2}:[A-F0-9]{2}$';

		let confidence = 0.85;

		if (testValue) {
			const regex = new RegExp(macAddressColonUpper);
			const testPassed = regex.test(testValue);
			confidence = calculateConfidence(confidence, true, testPassed);
		}

		return {
			success: true,
			pattern: new RegExp(macAddressColonUpper),
			confidence,
			description: 'MAC address with colons and uppercase letters',
			suggestions: [],
		};
	}

	// Handle "two factor authentication code 6 digits with optional spaces"
	if (
		text.includes('two factor') &&
		text.includes('6 digits') &&
		text.includes('optional spaces')
	) {
		const twoFactorPattern = '^\\d{3}\\s?\\d{3}$';
		let confidence = 0.9;

		if (testValue) {
			const regex = new RegExp(twoFactorPattern);
			const testPassed = regex.test(testValue);
			confidence = calculateConfidence(confidence, true, testPassed);
		}

		return {
			success: true,
			pattern: new RegExp(twoFactorPattern),
			confidence,
			description:
				'Two factor authentication code with 6 digits and optional spaces',
			suggestions: [],
		};
	}

	// Handle "api key with prefix and 32 character hex string"
	if (
		text.includes('api key') &&
		text.includes('prefix') &&
		text.includes('32 character') &&
		text.includes('hex')
	) {
		const apiKeyPattern = '^sk_[0-9a-f]{32}$';
		let confidence = 0.9;

		if (testValue) {
			const regex = new RegExp(apiKeyPattern);
			const testPassed = regex.test(testValue);
			confidence = calculateConfidence(confidence, true, testPassed);
		}

		return {
			success: true,
			pattern: new RegExp(apiKeyPattern),
			confidence,
			description: 'API key with prefix and 32 character hex string',
			suggestions: [],
		};
	}

	// Handle "jwt token with three base64 parts separated by dots"
	if (
		text.includes('jwt') &&
		text.includes('three') &&
		text.includes('base64') &&
		text.includes('dots')
	) {
		const jwtPattern = '^[A-Za-z0-9_-]+\\.[A-Za-z0-9_-]+\\.[A-Za-z0-9_-]+$';
		let confidence = 0.85;

		if (testValue) {
			const regex = new RegExp(jwtPattern);
			const testPassed = regex.test(testValue);
			confidence = calculateConfidence(confidence, true, testPassed);
		}

		return {
			success: true,
			pattern: new RegExp(jwtPattern),
			confidence,
			description: 'JWT token with three base64 parts separated by dots',
			suggestions: [],
		};
	}

	return null;
}
