/**
 * Healthcare-related Combined Pattern Handlers
 */

import type { TextExtractionResult } from '../../../types/index.js';
import { calculateConfidence } from '../helpers.js';

/**
 * Parses combined patterns specifically related to healthcare identifiers.
 * @param text - The normalized text to search for patterns.
 * @param testValue - An optional string to test the generated pattern against.
 * @returns A `TextExtractionResult` if a match is found, otherwise `null`.
 */
export function parseHealthcareCombined(
	text: string,
	testValue?: string
): TextExtractionResult | null {
	// Handle "medical record number with facility code and patient id"
	if (
		text.includes('medical record') &&
		text.includes('facility code') &&
		text.includes('patient id')
	) {
		const medicalRecordPattern = '^[A-Z]{3}-\\d{8}$';
		let confidence = 0.85;

		if (testValue) {
			const regex = new RegExp(medicalRecordPattern);
			const testPassed = regex.test(testValue);
			confidence = calculateConfidence(confidence, true, testPassed);
		}

		return {
			success: true,
			pattern: new RegExp(medicalRecordPattern),
			confidence,
			description: 'Medical record number with facility code and patient ID',
			suggestions: [],
		};
	}

	// Handle "prescription number with pharmacy code and sequence"
	if (
		text.includes('prescription') &&
		text.includes('pharmacy code') &&
		text.includes('sequence')
	) {
		const prescriptionPattern = '^RX-[A-Z]{3}-\\d{7}$';
		let confidence = 0.85;

		if (testValue) {
			const regex = new RegExp(prescriptionPattern);
			const testPassed = regex.test(testValue);
			confidence = calculateConfidence(confidence, true, testPassed);
		}

		return {
			success: true,
			pattern: new RegExp(prescriptionPattern),
			confidence,
			description: 'Prescription number with pharmacy code and sequence',
			suggestions: [],
		};
	}

	// Handle "npi number with 10 digits healthcare provider"
	if (
		text.includes('npi') &&
		text.includes('10 digits') &&
		text.includes('healthcare')
	) {
		const npiPattern = '^\\d{10}$';
		let confidence = 0.9;

		if (testValue) {
			const regex = new RegExp(npiPattern);
			const testPassed = regex.test(testValue);
			confidence = calculateConfidence(confidence, true, testPassed);
		}

		return {
			success: true,
			pattern: new RegExp(npiPattern),
			confidence,
			description: 'NPI number with 10 digits for healthcare provider',
			suggestions: [],
		};
	}

	return null;
}
