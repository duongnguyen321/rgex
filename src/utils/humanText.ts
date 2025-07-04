/**
 * RGex Human Text Parser
 * Converts human-readable text descriptions to regex patterns
 */

import type {
	TextExtractionResult,
	ValidationExtractionResult,
	ValidationRule,
} from '../../types/index.js';
import { HUMAN_PATTERNS, PATTERN_KEYWORDS } from '../constants/patterns.js';
import {
	VALIDATION_KEYWORDS,
	LENGTH_PATTERNS,
	VALIDATION_PATTERNS,
} from '../constants/validation.js';
import {
	normalizeText,
	extractNumbers,
	calculateConfidence,
	mergePatterns,
} from './helpers.js';
import { RGEX_CONFIG } from '../config/index.js';

/**
 * Parse human text and extract regex pattern
 */
export function parseHumanTextToRegex(
	humanText: string,
	testValue?: string
): TextExtractionResult {
	const normalizedText = normalizeText(humanText);
	let pattern = '';
	let confidence = 0;
	let description = '';
	const suggestions: string[] = [];
	let patternType: string | undefined;

	// Check for compound requirements first (e.g., "email have number in domain")
	const compoundResult = parseCompoundRequirements(normalizedText, testValue);
	if (compoundResult.success) {
		return compoundResult;
	}

	// Check for direct pattern matches
	for (const [key, patternInfo] of Object.entries(HUMAN_PATTERNS)) {
		const keywords = PATTERN_KEYWORDS[key] || [];
		const hasKeyword = keywords.some((keyword) =>
			normalizedText.includes(keyword.toLowerCase())
		);

		if (hasKeyword) {
			pattern = patternInfo.pattern;
			description = patternInfo.description;
			confidence = RGEX_CONFIG.defaults.humanTextConfidence.high;
			patternType = patternInfo.type;

			if (testValue) {
				const regex = new RegExp(pattern);
				const testPassed = regex.test(testValue);
				confidence = calculateConfidence(confidence, true, testPassed);

				if (!testPassed) {
					suggestions.push(
						`The test value "${testValue}" doesn't match the ${key} pattern`
					);
				}
			}

			break;
		}
	}

	// If no direct match, try to construct pattern from components
	if (!pattern) {
		const constructedResult = constructPatternFromText(
			normalizedText,
			testValue
		);
		pattern = constructedResult.pattern;
		confidence = constructedResult.confidence;
		description = constructedResult.description;
		suggestions.push(...constructedResult.suggestions);
	}

	// Add generic suggestions if confidence is low
	if (confidence < RGEX_CONFIG.defaults.humanTextConfidence.medium) {
		suggestions.push(
			'Try being more specific about the pattern you want',
			'Use keywords like: email, phone, number, date, etc.',
			'Provide a test value to improve accuracy'
		);

		// If confidence is extremely low, fail completely
		if (confidence < RGEX_CONFIG.defaults.humanTextConfidence.low) {
			return {
				success: false,
				pattern: undefined,
				confidence,
				description: 'Could not understand the text description',
				suggestions,
			};
		}
	}

	return {
		success: pattern.length > 0,
		pattern: new RegExp(pattern),
		confidence,
		description: description || 'Custom pattern extracted from text',
		suggestions,
	};
}

/**
 * Parse compound requirements like "email have number in domain"
 */
function parseCompoundRequirements(
	normalizedText: string,
	testValue?: string
): TextExtractionResult {
	const suggestions: string[] = [];

	// EMAIL VARIATIONS
	// ================

	// Handle "email have number in domain"
	if (
		normalizedText.includes('email') &&
		(normalizedText.includes('number in domain') ||
			normalizedText.includes('digit in domain'))
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
		normalizedText.includes('email') &&
		(normalizedText.includes('.com domain') ||
			normalizedText.includes('ending with .com') ||
			normalizedText.includes('only .com') ||
			normalizedText.includes('com domain'))
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
		normalizedText.includes('email') &&
		(normalizedText.includes('corporate') ||
			normalizedText.includes('business') ||
			normalizedText.includes('company') ||
			normalizedText.includes('work'))
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
		normalizedText.includes('email') &&
		(normalizedText.includes('without plus') ||
			normalizedText.includes('no plus') ||
			normalizedText.includes('exclude plus'))
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

	// PHONE NUMBER VARIATIONS
	// =======================

	// Handle "us phone number" or "american phone"
	if (
		normalizedText.includes('phone') &&
		(normalizedText.includes('us ') ||
			normalizedText.includes('american') ||
			normalizedText.includes('usa') ||
			normalizedText.includes('united states'))
	) {
		const usPhoneFormat =
			'^(\\+1[-\\s]?)?(\\(?[0-9]{3}\\)?[-\\s]?[0-9]{3}[-\\s]?[0-9]{4})$';

		let confidence: number = 0.8;

		if (testValue) {
			const regex = new RegExp(usPhoneFormat);
			const testPassed = regex.test(testValue);
			confidence = calculateConfidence(confidence, true, testPassed);
		}

		return {
			success: true,
			pattern: new RegExp(usPhoneFormat),
			confidence,
			description: 'US phone number format (with optional +1)',
			suggestions,
		};
	}

	// Handle "phone with dashes" or "phone format xxx-xxx-xxxx"
	if (
		normalizedText.includes('phone') &&
		(normalizedText.includes('with dash') ||
			normalizedText.includes('with hyphen') ||
			normalizedText.includes('xxx-xxx') ||
			normalizedText.includes('dash format'))
	) {
		const phoneWithDashes = '^\\d{3}-\\d{3}-\\d{4}$';

		let confidence: number = 0.8;

		if (testValue) {
			const regex = new RegExp(phoneWithDashes);
			const testPassed = regex.test(testValue);
			confidence = calculateConfidence(confidence, true, testPassed);
		}

		return {
			success: true,
			pattern: new RegExp(phoneWithDashes),
			confidence,
			description: 'Phone number with dash format (xxx-xxx-xxxx)',
			suggestions,
		};
	}

	// Handle original "phone with country code"
	if (
		normalizedText.includes('phone') &&
		(normalizedText.includes('country code') ||
			normalizedText.includes('international'))
	) {
		const phoneWithCountryCode = '^\\+[1-9]\\d{1,4}[1-9]\\d{4,14}$';

		let confidence: number = 0.8;

		if (testValue) {
			const regex = new RegExp(phoneWithCountryCode);
			const testPassed = regex.test(testValue);
			confidence = calculateConfidence(confidence, true, testPassed);
		}

		return {
			success: true,
			pattern: new RegExp(phoneWithCountryCode),
			confidence,
			description: 'Phone number with required country code',
			suggestions,
		};
	}

	// PASSWORD SECURITY PATTERNS
	// ==========================

	// Handle "password no dictionary words" or "password without common words"
	if (
		normalizedText.includes('password') &&
		(normalizedText.includes('no dictionary') ||
			normalizedText.includes('without common') ||
			normalizedText.includes('no common words') ||
			normalizedText.includes('exclude dictionary'))
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
		normalizedText.includes('password') &&
		(normalizedText.includes('strong') || normalizedText.includes('complex')) &&
		normalizedText.includes('8')
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

	// DATE/TIME PATTERNS
	// ==================

	// Handle "date format mm/dd/yyyy" or "american date"
	if (
		(normalizedText.includes('date') && normalizedText.includes('mm/dd')) ||
		(normalizedText.includes('date') && normalizedText.includes('american'))
	) {
		const mmddyyyyFormat =
			'^(0[1-9]|1[0-2])\\/(0[1-9]|[12]\\d|3[01])\\/(19|20)\\d{2}$';

		let confidence: number = 0.8;

		if (testValue) {
			const regex = new RegExp(mmddyyyyFormat);
			const testPassed = regex.test(testValue);
			confidence = calculateConfidence(confidence, true, testPassed);
		}

		return {
			success: true,
			pattern: new RegExp(mmddyyyyFormat),
			confidence,
			description: 'Date in MM/DD/YYYY format',
			suggestions,
		};
	}

	// Handle "date format dd/mm/yyyy" or "european date"
	if (
		(normalizedText.includes('date') && normalizedText.includes('dd/mm')) ||
		(normalizedText.includes('date') && normalizedText.includes('european'))
	) {
		const ddmmyyyyFormat =
			'^(0[1-9]|[12]\\d|3[01])\\/(0[1-9]|1[0-2])\\/(19|20)\\d{2}$';

		let confidence: number = 0.8;

		if (testValue) {
			const regex = new RegExp(ddmmyyyyFormat);
			const testPassed = regex.test(testValue);
			confidence = calculateConfidence(confidence, true, testPassed);
		}

		return {
			success: true,
			pattern: new RegExp(ddmmyyyyFormat),
			confidence,
			description: 'Date in DD/MM/YYYY format',
			suggestions,
		};
	}

	// Handle "age 18+" or "over 18" or "adult age"
	if (
		(normalizedText.includes('age') && normalizedText.includes('18')) ||
		normalizedText.includes('over 18') ||
		normalizedText.includes('adult')
	) {
		const age18Plus = '^(?:1[89]|[2-9]\\d|1[01]\\d|120)$'; // 18-120 years

		let confidence: number = 0.75;

		if (testValue) {
			const regex = new RegExp(age18Plus);
			const testPassed = regex.test(testValue);
			confidence = calculateConfidence(confidence, true, testPassed);
		}

		return {
			success: true,
			pattern: new RegExp(age18Plus),
			confidence,
			description: 'Age 18 or older (18-120)',
			suggestions,
		};
	}

	// URL VARIATIONS
	// ==============

	// Handle original "url with https"
	if (normalizedText.includes('url') && normalizedText.includes('https')) {
		const httpsOnlyUrl =
			'^https:\\/\\/(www\\.)?[-a-zA-Z0-9@:%._\\+~#=]{1,256}\\.[a-zA-Z0-9()]{1,6}\\b([-a-zA-Z0-9()@:%_\\+.~#?&//=]*)$';

		let confidence: number = 0.8;

		if (testValue) {
			const regex = new RegExp(httpsOnlyUrl);
			const testPassed = regex.test(testValue);
			confidence = calculateConfidence(confidence, true, testPassed);
		}

		return {
			success: true,
			pattern: new RegExp(httpsOnlyUrl),
			confidence,
			description: 'HTTPS URL only',
			suggestions,
		};
	}

	// Handle "url without query" or "url no parameters"
	if (
		normalizedText.includes('url') &&
		(normalizedText.includes('without query') ||
			normalizedText.includes('no parameters') ||
			normalizedText.includes('no query') ||
			normalizedText.includes('clean url'))
	) {
		const urlNoQuery =
			'^https?:\\/\\/(www\\.)?[-a-zA-Z0-9@:%._\\+~#=]{1,256}\\.[a-zA-Z0-9()]{1,6}\\b([-a-zA-Z0-9()@:%_\\+.~#\\/=]*)(?!.*\\?)$';

		let confidence: number = 0.8;

		if (testValue) {
			const regex = new RegExp(urlNoQuery);
			const testPassed = regex.test(testValue);
			confidence = calculateConfidence(confidence, true, testPassed);
		}

		return {
			success: true,
			pattern: new RegExp(urlNoQuery),
			confidence,
			description: 'URL without query parameters',
			suggestions,
		};
	}

	// FINANCIAL/ID PATTERNS
	// =====================

	// Handle "credit card visa" or "visa card"
	if (
		(normalizedText.includes('credit') || normalizedText.includes('card')) &&
		normalizedText.includes('visa')
	) {
		const visaCard = '^4[0-9]{12}(?:[0-9]{3})?$';

		let confidence: number = 0.8;

		if (testValue) {
			const regex = new RegExp(visaCard);
			const testPassed = regex.test(testValue);
			confidence = calculateConfidence(confidence, true, testPassed);
		}

		return {
			success: true,
			pattern: new RegExp(visaCard),
			confidence,
			description: 'Visa credit card number',
			suggestions,
		};
	}

	// Handle "social security number" or "ssn"
	if (
		normalizedText.includes('social security') ||
		normalizedText.includes('ssn')
	) {
		const ssnPattern =
			'^(?!666|000|9\\d{2})\\d{3}-(?!00)\\d{2}-(?!0{4})\\d{4}$';

		let confidence: number = 0.8;

		if (testValue) {
			const regex = new RegExp(ssnPattern);
			const testPassed = regex.test(testValue);
			confidence = calculateConfidence(confidence, true, testPassed);
		}

		return {
			success: true,
			pattern: new RegExp(ssnPattern),
			confidence,
			description: 'US Social Security Number (XXX-XX-XXXX)',
			suggestions,
		};
	}

	// Handle "us zip code" or "postal code"
	if (
		(normalizedText.includes('zip') || normalizedText.includes('postal')) &&
		(normalizedText.includes('us') || normalizedText.includes('american'))
	) {
		const usZipCode = '^\\d{5}(-\\d{4})?$';

		let confidence: number = 0.8;

		if (testValue) {
			const regex = new RegExp(usZipCode);
			const testPassed = regex.test(testValue);
			confidence = calculateConfidence(confidence, true, testPassed);
		}

		return {
			success: true,
			pattern: new RegExp(usZipCode),
			confidence,
			description: 'US ZIP code (5 digits with optional +4)',
			suggestions,
		};
	}

	// TEXT FORMATTING
	// ===============

	// Handle "uppercase only" or "all caps"
	if (
		normalizedText.includes('uppercase') ||
		normalizedText.includes('all caps') ||
		normalizedText.includes('capital letters')
	) {
		const uppercaseOnly = '^[A-Z\\s]+$';

		let confidence: number = 0.8;

		if (testValue) {
			const regex = new RegExp(uppercaseOnly);
			const testPassed = regex.test(testValue);
			confidence = calculateConfidence(confidence, true, testPassed);
		}

		return {
			success: true,
			pattern: new RegExp(uppercaseOnly),
			confidence,
			description: 'Uppercase letters only (with spaces allowed)',
			suggestions,
		};
	}

	// Handle "no spaces" or "without spaces"
	if (
		normalizedText.includes('no spaces') ||
		normalizedText.includes('without spaces') ||
		normalizedText.includes('no whitespace')
	) {
		const noSpaces = '^\\S+$';

		let confidence: number = 0.8;

		if (testValue) {
			const regex = new RegExp(noSpaces);
			const testPassed = regex.test(testValue);
			confidence = calculateConfidence(confidence, true, testPassed);
		}

		return {
			success: true,
			pattern: new RegExp(noSpaces),
			confidence,
			description: 'Text without any spaces',
			suggestions,
		};
	}

	// Handle "alphanumeric only" or "letters and numbers"
	if (
		normalizedText.includes('alphanumeric') ||
		(normalizedText.includes('letters') &&
			normalizedText.includes('numbers') &&
			normalizedText.includes('only'))
	) {
		const alphanumericOnly = '^[a-zA-Z0-9]+$';

		let confidence: number = 0.8;

		if (testValue) {
			const regex = new RegExp(alphanumericOnly);
			const testPassed = regex.test(testValue);
			confidence = calculateConfidence(confidence, true, testPassed);
		}

		return {
			success: true,
			pattern: new RegExp(alphanumericOnly),
			confidence,
			description: 'Alphanumeric characters only (letters and numbers)',
			suggestions,
		};
	}

	return {
		success: false,
		pattern: undefined,
		confidence: 0,
		description: '',
		suggestions: [],
	};
}

/**
 * Parse human text and extract validation rules (Enhanced)
 */
export function parseHumanTextToValidation(
	humanText: string,
	testValue?: string
): ValidationExtractionResult {
	const normalizedText = normalizeText(humanText);
	const rules: ValidationRule[] = [];
	let confidence = 0;
	const suggestions: string[] = [];

	// Enhanced keyword matching with variations
	const keywordVariations = {
		require: ['require', 'required', 'mandatory', 'must have', 'need'],
		email: ['email', 'e-mail', 'mail', 'mail address'],
		phone: ['phone', 'telephone', 'mobile', 'cell phone'],
		url: ['url', 'link', 'website', 'web address'],
		password: ['password', 'pass', 'pwd'],
		strong: ['strong', 'secure', 'complex'],
		min: ['min', 'minimum', 'at least'],
		max: ['max', 'maximum', 'at most', 'no more than'],
		length: ['length', 'characters', 'chars', 'long'],
	};

	// Check for requirement keywords first
	let isRequired = false;
	for (const variation of keywordVariations['require']) {
		if (normalizedText.includes(variation)) {
			isRequired = true;
			break;
		}
	}

	// Add required rule if detected
	if (isRequired) {
		rules.push(VALIDATION_PATTERNS.required());
		confidence = Math.max(
			confidence,
			RGEX_CONFIG.defaults.humanTextConfidence.medium
		);
	}

	// Enhanced validation rule extraction
	for (const [baseKeyword, variations] of Object.entries(keywordVariations)) {
		if (baseKeyword === 'require') continue; // Already handled above

		const hasKeyword = variations.some((variation) =>
			normalizedText.includes(variation)
		);

		if (hasKeyword) {
			try {
				let rule: ValidationRule | null = null;

				// Map keywords to validation patterns
				switch (baseKeyword) {
					case 'email':
						rule = VALIDATION_PATTERNS.email();
						break;
					case 'phone':
						rule = VALIDATION_PATTERNS.phone();
						break;
					case 'url':
						rule = VALIDATION_PATTERNS.url();
						break;
					case 'password':
						// Check if strong password is mentioned
						const isStrong = keywordVariations['strong'].some((v) =>
							normalizedText.includes(v)
						);
						rule = isStrong
							? VALIDATION_PATTERNS.strongPassword()
							: VALIDATION_PATTERNS.required();
						break;
				}

				if (rule) {
					rules.push(rule);
					confidence = Math.max(
						confidence,
						RGEX_CONFIG.defaults.humanTextConfidence.high
					);
				}
			} catch (error) {
				suggestions.push(`Failed to create rule for: ${baseKeyword}`);
			}
		}
	}

	// Enhanced length constraint extraction
	const numbers = extractNumbers(normalizedText);
	if (numbers.length > 0) {
		const minKeywords = keywordVariations['min'];
		const maxKeywords = keywordVariations['max'];
		const lengthKeywords = keywordVariations['length'];

		const hasMinKeyword = minKeywords.some((k) => normalizedText.includes(k));
		const hasMaxKeyword = maxKeywords.some((k) => normalizedText.includes(k));
		const hasLengthKeyword = lengthKeywords.some((k) =>
			normalizedText.includes(k)
		);

		if (
			(hasMinKeyword || hasMaxKeyword) &&
			hasLengthKeyword &&
			numbers[0] !== undefined
		) {
			try {
				if (hasMinKeyword) {
					const rule = VALIDATION_PATTERNS.minLength(numbers[0]);
					rules.push(rule);
				}
				if (hasMaxKeyword) {
					const rule = VALIDATION_PATTERNS.maxLength(numbers[0]);
					rules.push(rule);
				}
				confidence = Math.max(
					confidence,
					RGEX_CONFIG.defaults.humanTextConfidence.medium
				);
			} catch (error) {
				suggestions.push(`Failed to create length rule`);
			}
		}
	}

	// Handle compound validation requirements
	if (
		normalizedText.includes('email') &&
		normalizedText.includes('number in domain')
	) {
		const customRule: ValidationRule = {
			name: 'emailWithNumberInDomain',
			pattern: new RegExp(
				"^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9]*\\d+[a-zA-Z0-9-]*(?:\\.[a-zA-Z0-9]*\\d*[a-zA-Z0-9-]*)*$"
			),
			message: 'Email must have at least one number in the domain',
		};
		rules.push(customRule);
		confidence = Math.max(
			confidence,
			RGEX_CONFIG.defaults.humanTextConfidence.high
		);
	}

	// Enhanced compound validation requirements
	// =========================================

	// Email with .com domain
	if (
		normalizedText.includes('email') &&
		(normalizedText.includes('.com domain') ||
			normalizedText.includes('ending with .com') ||
			normalizedText.includes('only .com') ||
			normalizedText.includes('com domain'))
	) {
		const customRule: ValidationRule = {
			name: 'emailComDomain',
			pattern: new RegExp(
				"^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*\\.com$"
			),
			message: 'Email must end with .com domain',
		};
		rules.push(customRule);
		confidence = Math.max(
			confidence,
			RGEX_CONFIG.defaults.humanTextConfidence.high
		);
	}

	// Corporate email validation
	if (
		normalizedText.includes('email') &&
		(normalizedText.includes('corporate') ||
			normalizedText.includes('business') ||
			normalizedText.includes('company') ||
			normalizedText.includes('work'))
	) {
		const customRule: ValidationRule = {
			name: 'corporateEmail',
			pattern: new RegExp(
				'^[a-zA-Z0-9._%+-]+@(?!gmail|yahoo|hotmail|outlook|aol|icloud)[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$'
			),
			message: 'Must be a corporate email address (not from free providers)',
		};
		rules.push(customRule);
		confidence = Math.max(
			confidence,
			RGEX_CONFIG.defaults.humanTextConfidence.high
		);
	}

	// Email without plus signs
	if (
		normalizedText.includes('email') &&
		(normalizedText.includes('without plus') ||
			normalizedText.includes('no plus') ||
			normalizedText.includes('exclude plus'))
	) {
		const customRule: ValidationRule = {
			name: 'emailNoPlus',
			pattern: new RegExp(
				"^[a-zA-Z0-9.!#$%&'*_=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$"
			),
			message: 'Email address cannot contain plus signs',
		};
		rules.push(customRule);
		confidence = Math.max(
			confidence,
			RGEX_CONFIG.defaults.humanTextConfidence.high
		);
	}

	// US phone number validation
	if (
		normalizedText.includes('phone') &&
		(normalizedText.includes('us ') ||
			normalizedText.includes('american') ||
			normalizedText.includes('usa') ||
			normalizedText.includes('united states'))
	) {
		const customRule: ValidationRule = {
			name: 'usPhoneNumber',
			pattern: new RegExp(
				'^(\\+1[-\\s]?)?(\\(?[0-9]{3}\\)?[-\\s]?[0-9]{3}[-\\s]?[0-9]{4})$'
			),
			message: 'Must be a valid US phone number format',
		};
		rules.push(customRule);
		confidence = Math.max(
			confidence,
			RGEX_CONFIG.defaults.humanTextConfidence.high
		);
	}

	// Phone with dash format
	if (
		normalizedText.includes('phone') &&
		(normalizedText.includes('with dash') ||
			normalizedText.includes('with hyphen') ||
			normalizedText.includes('xxx-xxx') ||
			normalizedText.includes('dash format'))
	) {
		const customRule: ValidationRule = {
			name: 'phoneDashFormat',
			pattern: new RegExp('^\\d{3}-\\d{3}-\\d{4}$'),
			message: 'Phone number must be in XXX-XXX-XXXX format',
		};
		rules.push(customRule);
		confidence = Math.max(
			confidence,
			RGEX_CONFIG.defaults.humanTextConfidence.high
		);
	}

	// Strong password with specific length
	if (
		normalizedText.includes('password') &&
		(normalizedText.includes('strong') || normalizedText.includes('complex')) &&
		normalizedText.includes('8')
	) {
		const customRule: ValidationRule = {
			name: 'strongPassword8',
			pattern: new RegExp(
				'^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[!@#$%^&*()_+\\-=\\[\\]{};\':"\\\\|,.<>\\/?]).{8,}$'
			),
			message:
				'Password must be at least 8 characters with uppercase, lowercase, number, and special character',
		};
		rules.push(customRule);
		confidence = Math.max(
			confidence,
			RGEX_CONFIG.defaults.humanTextConfidence.high
		);
	}

	// Password without dictionary words
	if (
		normalizedText.includes('password') &&
		(normalizedText.includes('no dictionary') ||
			normalizedText.includes('without common') ||
			normalizedText.includes('no common words') ||
			normalizedText.includes('exclude dictionary'))
	) {
		const customRule: ValidationRule = {
			name: 'passwordNoDictionary',
			pattern: new RegExp(
				'^(?!.*(password|123456|qwerty|admin|welcome|letmein|monkey|dragon|master|shadow|abc123|password123|admin123|welcome123|iloveyou|princess|football|baseball|superman|michael|computer|login)).{8,}$',
				'i'
			),
			message: 'Password cannot contain common dictionary words or patterns',
		};
		rules.push(customRule);
		confidence = Math.max(
			confidence,
			RGEX_CONFIG.defaults.humanTextConfidence.high
		);
	}

	// Date format validations
	if (
		(normalizedText.includes('date') && normalizedText.includes('mm/dd')) ||
		(normalizedText.includes('date') && normalizedText.includes('american'))
	) {
		const customRule: ValidationRule = {
			name: 'dateMMDDYYYY',
			pattern: new RegExp(
				'^(0[1-9]|1[0-2])\\/(0[1-9]|[12]\\d|3[01])\\/(19|20)\\d{2}$'
			),
			message: 'Date must be in MM/DD/YYYY format',
		};
		rules.push(customRule);
		confidence = Math.max(
			confidence,
			RGEX_CONFIG.defaults.humanTextConfidence.high
		);
	}

	if (
		(normalizedText.includes('date') && normalizedText.includes('dd/mm')) ||
		(normalizedText.includes('date') && normalizedText.includes('european'))
	) {
		const customRule: ValidationRule = {
			name: 'dateDDMMYYYY',
			pattern: new RegExp(
				'^(0[1-9]|[12]\\d|3[01])\\/(0[1-9]|1[0-2])\\/(19|20)\\d{2}$'
			),
			message: 'Date must be in DD/MM/YYYY format',
		};
		rules.push(customRule);
		confidence = Math.max(
			confidence,
			RGEX_CONFIG.defaults.humanTextConfidence.high
		);
	}

	// Age validation
	if (
		(normalizedText.includes('age') && normalizedText.includes('18')) ||
		normalizedText.includes('over 18') ||
		normalizedText.includes('adult')
	) {
		const customRule: ValidationRule = {
			name: 'age18Plus',
			pattern: new RegExp('^(?:1[89]|[2-9]\\d|1[01]\\d|120)$'),
			message: 'Age must be 18 or older',
			validator: (val: string) => {
				const age = parseInt(val);
				return !isNaN(age) && age >= 18 && age <= 120;
			},
		};
		rules.push(customRule);
		confidence = Math.max(
			confidence,
			RGEX_CONFIG.defaults.humanTextConfidence.high
		);
	}

	// URL validations
	if (
		normalizedText.includes('url') &&
		(normalizedText.includes('without query') ||
			normalizedText.includes('no parameters') ||
			normalizedText.includes('no query') ||
			normalizedText.includes('clean url'))
	) {
		const customRule: ValidationRule = {
			name: 'urlNoQuery',
			pattern: new RegExp(
				'^https?:\\/\\/(www\\.)?[-a-zA-Z0-9@:%._\\+~#=]{1,256}\\.[a-zA-Z0-9()]{1,6}\\b([-a-zA-Z0-9()@:%_\\+.~#\\/=]*)(?!.*\\?)$'
			),
			message: 'URL must not contain query parameters',
		};
		rules.push(customRule);
		confidence = Math.max(
			confidence,
			RGEX_CONFIG.defaults.humanTextConfidence.high
		);
	}

	// Financial/ID validations
	if (
		(normalizedText.includes('credit') || normalizedText.includes('card')) &&
		normalizedText.includes('visa')
	) {
		const customRule: ValidationRule = {
			name: 'visaCard',
			pattern: new RegExp('^4[0-9]{12}(?:[0-9]{3})?$'),
			message: 'Must be a valid Visa credit card number',
		};
		rules.push(customRule);
		confidence = Math.max(
			confidence,
			RGEX_CONFIG.defaults.humanTextConfidence.high
		);
	}

	if (
		normalizedText.includes('social security') ||
		normalizedText.includes('ssn')
	) {
		const customRule: ValidationRule = {
			name: 'socialSecurityNumber',
			pattern: new RegExp(
				'^(?!666|000|9\\d{2})\\d{3}-(?!00)\\d{2}-(?!0{4})\\d{4}$'
			),
			message: 'Must be a valid Social Security Number (XXX-XX-XXXX)',
		};
		rules.push(customRule);
		confidence = Math.max(
			confidence,
			RGEX_CONFIG.defaults.humanTextConfidence.high
		);
	}

	if (
		(normalizedText.includes('zip') || normalizedText.includes('postal')) &&
		(normalizedText.includes('us') || normalizedText.includes('american'))
	) {
		const customRule: ValidationRule = {
			name: 'usZipCode',
			pattern: new RegExp('^\\d{5}(-\\d{4})?$'),
			message: 'Must be a valid US ZIP code (5 digits with optional +4)',
		};
		rules.push(customRule);
		confidence = Math.max(
			confidence,
			RGEX_CONFIG.defaults.humanTextConfidence.high
		);
	}

	// Text formatting validations
	if (
		normalizedText.includes('uppercase') ||
		normalizedText.includes('all caps') ||
		normalizedText.includes('capital letters')
	) {
		const customRule: ValidationRule = {
			name: 'uppercaseOnly',
			pattern: new RegExp('^[A-Z\\s]+$'),
			message: 'Text must be in uppercase letters only',
		};
		rules.push(customRule);
		confidence = Math.max(
			confidence,
			RGEX_CONFIG.defaults.humanTextConfidence.high
		);
	}

	if (
		normalizedText.includes('no spaces') ||
		normalizedText.includes('without spaces') ||
		normalizedText.includes('no whitespace')
	) {
		const customRule: ValidationRule = {
			name: 'noSpaces',
			pattern: new RegExp('^\\S+$'),
			message: 'Text cannot contain any spaces',
		};
		rules.push(customRule);
		confidence = Math.max(
			confidence,
			RGEX_CONFIG.defaults.humanTextConfidence.high
		);
	}

	if (
		normalizedText.includes('alphanumeric') ||
		(normalizedText.includes('letters') &&
			normalizedText.includes('numbers') &&
			normalizedText.includes('only'))
	) {
		const customRule: ValidationRule = {
			name: 'alphanumericOnly',
			pattern: new RegExp('^[a-zA-Z0-9]+$'),
			message: 'Text must contain only letters and numbers',
		};
		rules.push(customRule);
		confidence = Math.max(
			confidence,
			RGEX_CONFIG.defaults.humanTextConfidence.high
		);
	}

	// Test extracted rules if test value provided
	if (testValue && rules.length > 0) {
		let allPassed = true;
		for (const rule of rules) {
			let passed = true;

			if (rule.validator) {
				passed = rule.validator(testValue);
			} else if (rule.pattern) {
				passed = rule.pattern.test(testValue);
			}

			if (!passed) {
				allPassed = false;
				suggestions.push(
					`Test value fails rule: ${rule.name} - ${rule.message}`
				);
			}
		}

		confidence = calculateConfidence(confidence, true, allPassed);
	}

	// Add suggestions for improvement
	if (rules.length === 0) {
		suggestions.push(
			'No validation rules could be extracted',
			'Try using keywords like: required, email, phone, min length, max length',
			'Be more specific about the validation requirements',
			'Examples: "required email", "phone number", "minimum 8 characters"'
		);
	}

	return {
		success: rules.length > 0,
		rules,
		confidence,
		description: `Extracted ${rules.length} validation rule${
			rules.length === 1 ? '' : 's'
		} from text`,
		suggestions,
	};
}

/**
 * Construct pattern from text components
 */
function constructPatternFromText(
	normalizedText: string,
	testValue?: string
): {
	pattern: string;
	confidence: number;
	description: string;
	suggestions: string[];
} {
	const suggestions: string[] = [];
	let pattern = '';
	let confidence = 0;
	let description = '';

	// Look for specific pattern elements
	const patternElements: string[] = [];

	// Check for character classes
	if (
		normalizedText.includes('letter') ||
		normalizedText.includes('alphabetic')
	) {
		patternElements.push('[a-zA-Z]');
		confidence += 0.3;
	}

	if (normalizedText.includes('digit') || normalizedText.includes('number')) {
		patternElements.push('\\d');
		confidence += 0.3;
	}

	if (
		normalizedText.includes('space') ||
		normalizedText.includes('whitespace')
	) {
		patternElements.push('\\s');
		confidence += 0.2;
	}

	if (
		normalizedText.includes('any character') ||
		normalizedText.includes('anything')
	) {
		patternElements.push('.');
		confidence += 0.1;
	}

	// Check for quantifiers
	const numbers = extractNumbers(normalizedText);
	if (numbers.length > 0) {
		const num = numbers[0];
		if (normalizedText.includes('exactly')) {
			patternElements[patternElements.length - 1] += `{${num}}`;
			confidence += 0.2;
		} else if (normalizedText.includes('at least')) {
			patternElements[patternElements.length - 1] += `{${num},}`;
			confidence += 0.2;
		} else if (normalizedText.includes('at most')) {
			patternElements[patternElements.length - 1] += `{0,${num}}`;
			confidence += 0.2;
		}
	}

	// Check for anchors
	if (
		normalizedText.includes('start') ||
		normalizedText.includes('beginning')
	) {
		pattern = '^' + pattern;
		confidence += 0.1;
	}

	if (normalizedText.includes('end') || normalizedText.includes('ending')) {
		pattern += '$';
		confidence += 0.1;
	}

	// Combine pattern elements
	if (patternElements.length > 0) {
		pattern += mergePatterns(patternElements, false);
		description = `Pattern constructed from text components: ${patternElements.join(
			', '
		)}`;
	} else {
		// Fallback: create pattern from literal text
		const words = normalizedText.split(' ').filter((word) => word.length > 2);
		if (words.length > 0) {
			pattern = words
				.map((word) => word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'))
				.join('.*');
			confidence = 0.3;
			description = 'Literal text pattern created from keywords';
			suggestions.push('Consider using more specific pattern keywords');
		}
	}

	// Test against test value if provided
	if (testValue && pattern) {
		try {
			const regex = new RegExp(pattern);
			const testPassed = regex.test(testValue);
			confidence = calculateConfidence(confidence, true, testPassed);

			if (!testPassed) {
				suggestions.push(`Pattern doesn't match test value: "${testValue}"`);
			}
		} catch (error) {
			suggestions.push('Generated pattern is invalid');
			confidence = 0;
		}
	}

	return {
		pattern,
		confidence: Math.min(confidence, 1),
		description,
		suggestions,
	};
}

/**
 * Get pattern suggestions based on text content
 */
export function getPatternSuggestions(text: string): string[] {
	const normalizedText = normalizeText(text);
	const suggestions: string[] = [];

	// Check what patterns might be relevant
	for (const [key, keywords] of Object.entries(PATTERN_KEYWORDS)) {
		const hasPartialMatch = keywords.some((keyword) =>
			normalizedText.includes(keyword.substring(0, 3))
		);

		if (hasPartialMatch) {
			suggestions.push(`Did you mean "${key}"? Try: ${keywords.join(', ')}`);
		}
	}

	// General suggestions
	if (suggestions.length === 0) {
		suggestions.push(
			'Available patterns: email, phone, url, date, time, number, uuid, ip address',
			'Use descriptive keywords like "email address" or "phone number"',
			'Provide specific requirements like "minimum 8 characters" or "numbers only"'
		);
	}

	return suggestions.slice(0, 5); // Limit suggestions
}

// ============================================
// SHORTER EXPORT ALIASES FOR CONVENIENCE
// ============================================

/**
 * Short alias for parseHumanTextToRegex
 * Convert human text to regex pattern
 */
export const humanToRegex = parseHumanTextToRegex;

/**
 * Short alias for parseHumanTextToRegex
 * Convert human text to regex pattern
 */
export const textToRegex = parseHumanTextToRegex;

/**
 * Short alias for parseHumanTextToValidation
 * Convert human text to validation rules
 */
export const humanToValidation = parseHumanTextToValidation;

/**
 * Short alias for parseHumanTextToValidation
 * Convert human text to validation rules
 */
export const textToValidation = parseHumanTextToValidation;

/**
 * Short alias for getPatternSuggestions
 * Get pattern suggestions for text
 */
export const getSuggestions = getPatternSuggestions;

/**
 * Short alias for getPatternSuggestions
 * Get pattern suggestions for text
 */
export const textToSuggestions = getPatternSuggestions;

/**
 * Ultra-short aliases for quick usage
 */
export const h2r = parseHumanTextToRegex; // human to regex
export const t2r = parseHumanTextToRegex; // text to regex
export const h2v = parseHumanTextToValidation; // human to validation
export const t2v = parseHumanTextToValidation; // text to validation
export const suggest = getPatternSuggestions;
