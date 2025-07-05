/**
 * Combined Pattern Handlers
 * Handles complex patterns that combine multiple requirements by delegating to specialized parsers.
 */

import type { TextExtractionResult } from '../../types/index.js';
import {
	parseBusinessCombined,
	parseCommunicationCombined,
	parseDateTimeCombined,
	parseEducationCombined,
	parseEmailCombined,
	parseFileCombined,
	parseFinancialCombined,
	parseHealthcareCombined,
	parseLanguageCombined,
	parsePasswordCombined,
	parsePhoneCombined,
	parseSecurityCombined,
	parseTechnologyCombined,
	parseTextCombined,
	parseTransportationCombined,
	parseUrlCombined,
} from './combined/index.js';

/**
 * An array of specialized parser functions for combined patterns.
 * Each parser handles a specific category of patterns (e.g., email, phone).
 */
const combinedParsers = [
	parseEmailCombined,
	parsePhoneCombined,
	parsePasswordCombined,
	parseUrlCombined,
	parseDateTimeCombined,
	parseFinancialCombined,
	parseTextCombined,
	parseSecurityCombined,
	parseFileCombined,
	parseBusinessCombined,
	parseCommunicationCombined,
	parseHealthcareCombined,
	parseEducationCombined,
	parseTransportationCombined,
	parseTechnologyCombined,
	parseLanguageCombined,
];

/**
 * Parses complex combined patterns that require multiple conditions.
 * It iterates through a series of specialized parsers, each handling a different category of patterns.
 *
 * @param textForCapture - The natural language text to be analyzed for patterns.
 * @param testValue - An optional string to test the generated pattern against for confidence scoring.
 * @returns A `TextExtractionResult` object if a pattern is successfully parsed, otherwise `null`.
 */
export function parseCombinedPatterns(
	textForCapture: string,
	testValue?: string
): TextExtractionResult | null {
	const normalizedText = textForCapture.toLowerCase();

	for (const parser of combinedParsers) {
		const result = parser(normalizedText, testValue);
		if (result) {
			return result;
		}
	}

	return null;
}
