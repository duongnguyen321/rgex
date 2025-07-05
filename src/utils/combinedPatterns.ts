/**
 * Combined Pattern Handlers
 * Handles complex patterns that combine multiple requirements
 */

import type { TextExtractionResult } from '../../types/index.js';
import { calculateConfidence } from './helpers.js';

/**
 * Parse complex combined patterns that require multiple conditions
 */
export function parseCombinedPatterns(
	textForCapture: string,
	testValue?: string
): TextExtractionResult | null {
	const suggestions: string[] = [];
	const normalizedText = textForCapture.toLowerCase();

	// COMPLEX EMAIL COMBINATIONS
	// ==========================

	// Handle "corporate email with at least 8 characters before @"
	if (
		normalizedText.includes('email') &&
		(normalizedText.includes('corporate') ||
			normalizedText.includes('business')) &&
		normalizedText.includes('at least') &&
		normalizedText.includes('8') &&
		normalizedText.includes('before')
	) {
		const corporateEmailMinLength =
			'^[a-zA-Z0-9._%+-]{8,}@(?!gmail|yahoo|hotmail|outlook|aol|icloud)[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$';

		let confidence = 0.85;

		if (testValue) {
			const regex = new RegExp(corporateEmailMinLength);
			const testPassed = regex.test(testValue);
			confidence = calculateConfidence(confidence, true, testPassed);
		}

		return {
			success: true,
			pattern: new RegExp(corporateEmailMinLength),
			confidence,
			description: 'Corporate email with at least 8 characters before @',
			suggestions,
		};
	}

	// Handle "email with number in domain and ends with .com"
	if (
		normalizedText.includes('email') &&
		normalizedText.includes('number in domain') &&
		normalizedText.includes('.com')
	) {
		const emailNumberDomainCom =
			"^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9]*\\d+[a-zA-Z0-9-]*\\.com$";

		let confidence = 0.85;

		if (testValue) {
			const regex = new RegExp(emailNumberDomainCom);
			const testPassed = regex.test(testValue);
			confidence = calculateConfidence(confidence, true, testPassed);
		}

		return {
			success: true,
			pattern: new RegExp(emailNumberDomainCom),
			confidence,
			description: 'Email with number in domain and .com extension',
			suggestions,
		};
	}

	// ADVANCED PHONE COMBINATIONS
	// ===========================

	// Handle "US phone number with area code and exactly 10 digits"
	if (
		normalizedText.includes('phone') &&
		normalizedText.includes('us') &&
		normalizedText.includes('area code') &&
		normalizedText.includes('10 digits')
	) {
		const usPhone10Digits =
			'^\\(?[2-9][0-8][0-9]\\)?[\\s-]*[0-9]{3}[\\s-]*[0-9]{4}$';

		let confidence = 0.9;

		if (testValue) {
			const regex = new RegExp(usPhone10Digits);
			const testPassed = regex.test(testValue);
			confidence = calculateConfidence(confidence, true, testPassed);
		}

		return {
			success: true,
			pattern: new RegExp(usPhone10Digits),
			confidence,
			description: 'US phone number with valid area code and exactly 10 digits',
			suggestions,
		};
	}

	// Handle "international phone with country code and between 10 to 15 digits"
	if (
		normalizedText.includes('phone') &&
		normalizedText.includes('international') &&
		normalizedText.includes('country code') &&
		normalizedText.includes('between') &&
		normalizedText.includes('10') &&
		normalizedText.includes('15')
	) {
		const intlPhoneRange = '^\\+[1-9]\\d{0,3}[\\s-]+(?:\\d[\\s-]*){6,}\\d$';

		let confidence = 0.85;

		if (testValue) {
			const regex = new RegExp(intlPhoneRange);
			const testPassed = regex.test(testValue);
			confidence = calculateConfidence(confidence, true, testPassed);
		}

		return {
			success: true,
			pattern: new RegExp(intlPhoneRange),
			confidence,
			description: 'International phone with country code, 10-15 digits total',
			suggestions,
		};
	}

	// COMPLEX PASSWORD COMBINATIONS
	// =============================

	// Handle "password with uppercase lowercase number special and no dictionary words minimum 12 characters"
	if (
		normalizedText.includes('password') &&
		normalizedText.includes('uppercase') &&
		normalizedText.includes('lowercase') &&
		normalizedText.includes('number') &&
		normalizedText.includes('special') &&
		normalizedText.includes('no dictionary') &&
		normalizedText.includes('12')
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
			suggestions,
		};
	}

	// Handle "password with at least 3 numbers and 2 special characters minimum 10 characters"
	if (
		normalizedText.includes('password') &&
		normalizedText.includes('at least 3 numbers') &&
		normalizedText.includes('2 special characters') &&
		normalizedText.includes('10')
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
			suggestions,
		};
	}

	// URL AND DOMAIN COMBINATIONS
	// ===========================

	// Handle "https url with subdomain and no query parameters"
	if (
		normalizedText.includes('https') &&
		normalizedText.includes('url') &&
		normalizedText.includes('subdomain') &&
		normalizedText.includes('no query')
	) {
		const httpsSubdomainNoQuery =
			'^https:\\/\\/[a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?\\.[a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?\\.[a-zA-Z]{2,}(\\/[^?]*)?$';

		let confidence = 0.85;

		if (testValue) {
			const regex = new RegExp(httpsSubdomainNoQuery);
			const testPassed = regex.test(testValue);
			confidence = calculateConfidence(confidence, true, testPassed);
		}

		return {
			success: true,
			pattern: new RegExp(httpsSubdomainNoQuery),
			confidence,
			description: 'HTTPS URL with subdomain and no query parameters',
			suggestions,
		};
	}

	// Handle "url with specific port and path but no fragment"
	if (
		normalizedText.includes('url') &&
		normalizedText.includes('port') &&
		normalizedText.includes('path') &&
		normalizedText.includes('no fragment')
	) {
		const urlPortPathNoFragment =
			'^https?:\\/\\/[a-zA-Z0-9.-]+:[0-9]{1,5}\\/[^#]*(?<!#.*)$';

		let confidence = 0.8;

		if (testValue) {
			const regex = new RegExp(urlPortPathNoFragment);
			const testPassed = regex.test(testValue);
			confidence = calculateConfidence(confidence, true, testPassed);
		}

		return {
			success: true,
			pattern: new RegExp(urlPortPathNoFragment),
			confidence,
			description: 'URL with specific port and path but no fragment',
			suggestions,
		};
	}

	// DATE AND TIME COMBINATIONS
	// ==========================

	// Handle "date in MM/DD/YYYY format between 2000 and 2030"
	if (
		normalizedText.includes('date') &&
		normalizedText.includes('mm/dd/yyyy') &&
		normalizedText.includes('between') &&
		normalizedText.includes('2000') &&
		normalizedText.includes('2030')
	) {
		const dateRangeMMDDYYYY =
			'^(0[1-9]|1[0-2])\\/(0[1-9]|[12]\\d|3[01])\\/(200[0-9]|201[0-9]|202[0-9]|2030)$';

		let confidence = 0.9;

		if (testValue) {
			const regex = new RegExp(dateRangeMMDDYYYY);
			const testPassed = regex.test(testValue);
			confidence = calculateConfidence(confidence, true, testPassed);
		}

		return {
			success: true,
			pattern: new RegExp(dateRangeMMDDYYYY),
			confidence,
			description: 'Date in MM/DD/YYYY format between 2000 and 2030',
			suggestions,
		};
	}

	// Handle "datetime with timezone and milliseconds"
	if (
		normalizedText.includes('datetime') &&
		normalizedText.includes('timezone') &&
		normalizedText.includes('milliseconds')
	) {
		const datetimeTimezoneMs =
			'^\\d{4}-\\d{2}-\\d{2}T\\d{2}:\\d{2}:\\d{2}\\.\\d{3}[+-]\\d{2}:\\d{2}$';

		let confidence = 0.85;

		if (testValue) {
			const regex = new RegExp(datetimeTimezoneMs);
			const testPassed = regex.test(testValue);
			confidence = calculateConfidence(confidence, true, testPassed);
		}

		return {
			success: true,
			pattern: new RegExp(datetimeTimezoneMs),
			confidence,
			description: 'DateTime with timezone and milliseconds (ISO 8601)',
			suggestions,
		};
	}

	// FINANCIAL COMBINATIONS
	// ======================

	// Handle "credit card with expiry date and cvv"
	if (
		normalizedText.includes('credit card') &&
		normalizedText.includes('expiry') &&
		normalizedText.includes('cvv')
	) {
		const creditCardWithExpiryCvv =
			'^(?:4[0-9]{12}(?:[0-9]{3})?|5[1-5][0-9]{14}|3[47][0-9]{13})\\s+(0[1-9]|1[0-2])\\/\\d{2}\\s+\\d{3,4}$';

		let confidence = 0.85;

		if (testValue) {
			const regex = new RegExp(creditCardWithExpiryCvv);
			const testPassed = regex.test(testValue);
			confidence = calculateConfidence(confidence, true, testPassed);
		}

		return {
			success: true,
			pattern: new RegExp(creditCardWithExpiryCvv),
			confidence,
			description: 'Credit card number with expiry date (MM/YY) and CVV',
			suggestions,
		};
	}

	// Handle "bank account with routing number and account number"
	if (
		normalizedText.includes('bank account') &&
		normalizedText.includes('routing') &&
		normalizedText.includes('account number')
	) {
		const bankAccountFull = '^\\d{9}\\s+\\d{4,17}$'; // Routing number (9 digits) + Account number (4-17 digits)

		let confidence = 0.8;

		if (testValue) {
			const regex = new RegExp(bankAccountFull);
			const testPassed = regex.test(testValue);
			confidence = calculateConfidence(confidence, true, testPassed);
		}

		return {
			success: true,
			pattern: new RegExp(bankAccountFull),
			confidence,
			description:
				'Bank account with routing number (9 digits) and account number (4-17 digits)',
			suggestions,
		};
	}

	// ADVANCED TEXT COMBINATIONS
	// ==========================

	// Handle "alphanumeric with dashes and underscores between 5 and 50 characters"
	if (
		normalizedText.includes('alphanumeric') &&
		normalizedText.includes('dashes') &&
		normalizedText.includes('underscores') &&
		normalizedText.includes('between') &&
		normalizedText.includes('5') &&
		normalizedText.includes('50')
	) {
		const alphanumericDashUnderscore = '^[a-zA-Z0-9_-]{5,50}$';

		let confidence = 0.85;

		if (testValue) {
			const regex = new RegExp(alphanumericDashUnderscore);
			const testPassed = regex.test(testValue);
			confidence = calculateConfidence(confidence, true, testPassed);
		}

		return {
			success: true,
			pattern: new RegExp(alphanumericDashUnderscore),
			confidence,
			description: 'Alphanumeric with dashes and underscores, 5-50 characters',
			suggestions,
		};
	}

	// Handle "text that starts with capital letter and contains at least one number"
	if (
		normalizedText.includes('starts with capital') &&
		normalizedText.includes('contains') &&
		normalizedText.includes('at least one number')
	) {
		const capitalStartWithNumber = '^[A-Z].*\\d.*$';

		let confidence = 0.8;

		if (testValue) {
			const regex = new RegExp(capitalStartWithNumber);
			const testPassed = regex.test(testValue);
			confidence = calculateConfidence(confidence, true, testPassed);
		}

		return {
			success: true,
			pattern: new RegExp(capitalStartWithNumber),
			confidence,
			description:
				'Text starting with capital letter and containing at least one number',
			suggestions,
		};
	}

	// NETWORK AND SECURITY COMBINATIONS
	// =================================

	// Handle "ipv4 address with specific subnet mask"
	if (
		normalizedText.includes('ipv4') &&
		normalizedText.includes('subnet mask')
	) {
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
			suggestions,
		};
	}

	// Handle "mac address with colons and uppercase letters"
	if (
		normalizedText.includes('mac address') &&
		normalizedText.includes('colons') &&
		normalizedText.includes('uppercase')
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
			suggestions,
		};
	}

	// FILE AND FORMAT COMBINATIONS
	// ============================

	// Handle "filename with extension and no spaces or special characters"
	if (
		normalizedText.includes('filename') &&
		normalizedText.includes('extension') &&
		normalizedText.includes('no spaces') &&
		(normalizedText.includes('no special') ||
			normalizedText.includes('special characters'))
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
			suggestions,
		};
	}

	// Handle "json object with specific required fields"
	if (
		normalizedText.includes('json') &&
		normalizedText.includes('required fields')
	) {
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
			suggestions,
		};
	}

	// BUSINESS & PROFESSIONAL PATTERNS
	// =================================

	// Handle "employee id with department prefix and 4 digit number"
	if (
		normalizedText.includes('employee id') &&
		normalizedText.includes('department') &&
		normalizedText.includes('prefix') &&
		normalizedText.includes('4 digit')
	) {
		const employeeIdPattern = '^[A-Z]{2,4}-\\d{4}$';
		let confidence = 0.85;

		if (testValue) {
			const regex = new RegExp(employeeIdPattern);
			const testPassed = regex.test(testValue);
			confidence = calculateConfidence(confidence, true, testPassed);
		}

		return {
			success: true,
			pattern: new RegExp(employeeIdPattern),
			confidence,
			description: 'Employee ID with department prefix and 4 digit number',
			suggestions,
		};
	}

	// Handle "invoice number with year and sequential number"
	if (
		normalizedText.includes('invoice') &&
		normalizedText.includes('year') &&
		normalizedText.includes('sequential')
	) {
		const invoicePattern = '^INV-(20\\d{2})-\\d{6}$';
		let confidence = 0.85;

		if (testValue) {
			const regex = new RegExp(invoicePattern);
			const testPassed = regex.test(testValue);
			confidence = calculateConfidence(confidence, true, testPassed);
		}

		return {
			success: true,
			pattern: new RegExp(invoicePattern),
			confidence,
			description: 'Invoice number with year and sequential number',
			suggestions,
		};
	}

	// Handle "product sku with category letters and numeric code"
	if (
		normalizedText.includes('product sku') &&
		normalizedText.includes('category') &&
		normalizedText.includes('letters') &&
		normalizedText.includes('numeric')
	) {
		const productSkuPattern = '^[A-Z]{3}-\\d{5}$';
		let confidence = 0.85;

		if (testValue) {
			const regex = new RegExp(productSkuPattern);
			const testPassed = regex.test(testValue);
			confidence = calculateConfidence(confidence, true, testPassed);
		}

		return {
			success: true,
			pattern: new RegExp(productSkuPattern),
			confidence,
			description: 'Product SKU with category letters and numeric code',
			suggestions,
		};
	}

	// ADVANCED SECURITY PATTERNS
	// ===========================

	// Handle "two factor authentication code 6 digits with optional spaces"
	if (
		normalizedText.includes('two factor') &&
		normalizedText.includes('6 digits') &&
		normalizedText.includes('optional spaces')
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
			suggestions,
		};
	}

	// Handle "api key with prefix and 32 character hex string"
	if (
		normalizedText.includes('api key') &&
		normalizedText.includes('prefix') &&
		normalizedText.includes('32 character') &&
		normalizedText.includes('hex')
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
			suggestions,
		};
	}

	// Handle "jwt token with three base64 parts separated by dots"
	if (
		normalizedText.includes('jwt') &&
		normalizedText.includes('three') &&
		normalizedText.includes('base64') &&
		normalizedText.includes('dots')
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
			suggestions,
		};
	}

	// COMMUNICATION PATTERNS
	// ======================

	// Handle "slack channel name with hash and lowercase letters"
	if (
		normalizedText.includes('slack channel') &&
		normalizedText.includes('hash') &&
		normalizedText.includes('lowercase')
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
			suggestions,
		};
	}

	// Handle "discord username with discriminator number"
	if (
		normalizedText.includes('discord') &&
		normalizedText.includes('username') &&
		normalizedText.includes('discriminator')
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
			suggestions,
		};
	}

	// Handle "mention with at symbol and alphanumeric username"
	if (
		normalizedText.includes('mention') &&
		normalizedText.includes('at symbol') &&
		normalizedText.includes('alphanumeric')
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
			suggestions,
		};
	}

	// FINANCIAL & BANKING PATTERNS
	// ============================

	// Handle "iban with country code and check digits"
	if (
		normalizedText.includes('iban') &&
		normalizedText.includes('country code') &&
		normalizedText.includes('check digits')
	) {
		const ibanPattern = '^[A-Z]{2}\\d{2}[A-Z0-9]{15,30}$';
		let confidence = 0.85;

		if (testValue) {
			const regex = new RegExp(ibanPattern);
			const testPassed = regex.test(testValue);
			confidence = calculateConfidence(confidence, true, testPassed);
		}

		return {
			success: true,
			pattern: new RegExp(ibanPattern),
			confidence,
			description: 'IBAN with country code and check digits',
			suggestions,
		};
	}

	// Handle "bitcoin address with 1 or 3 prefix and base58 characters"
	if (
		normalizedText.includes('bitcoin') &&
		normalizedText.includes('1 or 3 prefix') &&
		normalizedText.includes('base58')
	) {
		const bitcoinPattern = '^[13][a-km-zA-HJ-NP-Z1-9]{25,34}$';
		let confidence = 0.85;

		if (testValue) {
			const regex = new RegExp(bitcoinPattern);
			const testPassed = regex.test(testValue);
			confidence = calculateConfidence(confidence, true, testPassed);
		}

		return {
			success: true,
			pattern: new RegExp(bitcoinPattern),
			confidence,
			description: 'Bitcoin address with 1 or 3 prefix and base58 characters',
			suggestions,
		};
	}

	// Handle "swift code with 8 or 11 characters bank identifier"
	if (
		normalizedText.includes('swift') &&
		normalizedText.includes('8 or 11 characters') &&
		normalizedText.includes('bank')
	) {
		const swiftPattern = '^[A-Z]{4}[A-Z]{2}[A-Z0-9]{2}([A-Z0-9]{3})?$';
		let confidence = 0.85;

		if (testValue) {
			const regex = new RegExp(swiftPattern);
			const testPassed = regex.test(testValue);
			confidence = calculateConfidence(confidence, true, testPassed);
		}

		return {
			success: true,
			pattern: new RegExp(swiftPattern),
			confidence,
			description: 'SWIFT code with 8 or 11 characters bank identifier',
			suggestions,
		};
	}

	// COMPLEX VALIDATION PATTERNS
	// ===========================

	// Handle "password with 2 uppercase 2 lowercase 2 numbers 2 special minimum 12 characters no common words"
	if (
		normalizedText.includes('password') &&
		normalizedText.includes('2 uppercase') &&
		normalizedText.includes('2 lowercase') &&
		normalizedText.includes('2 numbers') &&
		normalizedText.includes('2 special') &&
		normalizedText.includes('12 characters') &&
		normalizedText.includes('no common words')
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
			suggestions,
		};
	}

	// Handle "email with custom domain not gmail yahoo hotmail and minimum 5 characters before at"
	if (
		normalizedText.includes('email') &&
		normalizedText.includes('custom domain') &&
		normalizedText.includes('not gmail') &&
		normalizedText.includes('5 characters before')
	) {
		const customDomainEmailPattern =
			'^[a-zA-Z0-9._%+-]{5,}@(?!gmail|yahoo|hotmail|outlook|aol|icloud)[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$';
		let confidence = 0.85;

		if (testValue) {
			const regex = new RegExp(customDomainEmailPattern);
			const testPassed = regex.test(testValue);
			confidence = calculateConfidence(confidence, true, testPassed);
		}

		return {
			success: true,
			pattern: new RegExp(customDomainEmailPattern),
			confidence,
			description:
				'Email with custom domain (not Gmail/Yahoo/Hotmail) and minimum 5 characters before @',
			suggestions,
		};
	}

	// Handle "phone number with country code area code and exactly 10 digits total"
	if (
		normalizedText.includes('phone') &&
		normalizedText.includes('country code') &&
		normalizedText.includes('area code') &&
		normalizedText.includes('exactly 10 digits')
	) {
		const specificPhonePattern =
			'^\\+1[\\s-]?\\(?[2-9][0-8][0-9]\\)?[\\s-]?[0-9]{3}[\\s-]?[0-9]{4}$';
		let confidence = 0.9;

		if (testValue) {
			const regex = new RegExp(specificPhonePattern);
			const testPassed = regex.test(testValue);
			confidence = calculateConfidence(confidence, true, testPassed);
		}

		return {
			success: true,
			pattern: new RegExp(specificPhonePattern),
			confidence,
			description:
				'Phone number with country code, area code, and exactly 10 digits total',
			suggestions,
		};
	}

	// HEALTHCARE & MEDICAL PATTERNS
	// ==============================

	// Handle "medical record number with facility code and patient id"
	if (
		normalizedText.includes('medical record') &&
		normalizedText.includes('facility code') &&
		normalizedText.includes('patient id')
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
			suggestions,
		};
	}

	// Handle "prescription number with pharmacy code and sequence"
	if (
		normalizedText.includes('prescription') &&
		normalizedText.includes('pharmacy code') &&
		normalizedText.includes('sequence')
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
			suggestions,
		};
	}

	// Handle "npi number with 10 digits healthcare provider"
	if (
		normalizedText.includes('npi') &&
		normalizedText.includes('10 digits') &&
		normalizedText.includes('healthcare')
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
			suggestions,
		};
	}

	// EDUCATION PATTERNS
	// ==================

	// Handle "student id with year and sequence number"
	if (
		normalizedText.includes('student id') &&
		normalizedText.includes('year') &&
		normalizedText.includes('sequence')
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
			suggestions,
		};
	}

	// Handle "course code with department and number"
	if (
		normalizedText.includes('course code') &&
		normalizedText.includes('department') &&
		normalizedText.includes('number')
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
			suggestions,
		};
	}

	// Handle "grade with letter and optional plus or minus"
	if (
		normalizedText.includes('grade') &&
		normalizedText.includes('letter') &&
		normalizedText.includes('optional plus or minus')
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
			suggestions,
		};
	}

	// TRANSPORTATION PATTERNS
	// =======================

	// Handle "license plate with 3 letters and 4 numbers"
	if (
		normalizedText.includes('license plate') &&
		normalizedText.includes('3 letters') &&
		normalizedText.includes('4 numbers')
	) {
		const licensePlatePattern = '^[A-Z]{3}-\\d{4}$';
		let confidence = 0.85;

		if (testValue) {
			const regex = new RegExp(licensePlatePattern);
			const testPassed = regex.test(testValue);
			confidence = calculateConfidence(confidence, true, testPassed);
		}

		return {
			success: true,
			pattern: new RegExp(licensePlatePattern),
			confidence,
			description: 'License plate with 3 letters and 4 numbers',
			suggestions,
		};
	}

	// Handle "flight number with airline code and digits"
	if (
		normalizedText.includes('flight number') &&
		normalizedText.includes('airline code') &&
		normalizedText.includes('digits')
	) {
		const flightNumberPattern = '^[A-Z]{2}\\d{3,4}$';
		let confidence = 0.85;

		if (testValue) {
			const regex = new RegExp(flightNumberPattern);
			const testPassed = regex.test(testValue);
			confidence = calculateConfidence(confidence, true, testPassed);
		}

		return {
			success: true,
			pattern: new RegExp(flightNumberPattern),
			confidence,
			description: 'Flight number with airline code and digits',
			suggestions,
		};
	}

	// Handle "tracking number with carrier prefix and alphanumeric code"
	if (
		normalizedText.includes('tracking number') &&
		normalizedText.includes('carrier prefix') &&
		normalizedText.includes('alphanumeric')
	) {
		const trackingPattern =
			'^(1Z[0-9A-Z]{14,16}|[0-9]{12,14}|[A-Z]{3}[0-9A-Z]{10,12})$';
		let confidence = 0.8;

		if (testValue) {
			const regex = new RegExp(trackingPattern);
			const testPassed = regex.test(testValue);
			confidence = calculateConfidence(confidence, true, testPassed);
		}

		return {
			success: true,
			pattern: new RegExp(trackingPattern),
			confidence,
			description: 'Tracking number with carrier prefix and alphanumeric code',
			suggestions,
		};
	}

	// TECHNOLOGY PATTERNS
	// ===================

	// Handle "docker image tag with registry and version"
	if (
		normalizedText.includes('docker image') &&
		normalizedText.includes('tag') &&
		normalizedText.includes('version')
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
			suggestions,
		};
	}

	// Handle "kubernetes pod name with deployment and random suffix"
	if (
		normalizedText.includes('kubernetes pod') &&
		normalizedText.includes('deployment') &&
		normalizedText.includes('random suffix')
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
			suggestions,
		};
	}

	// Handle "git commit hash with 7 or 40 hex characters"
	if (
		normalizedText.includes('git commit') &&
		normalizedText.includes('7 or 40') &&
		normalizedText.includes('hex')
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
			suggestions,
		};
	}

	// MULTI-LANGUAGE PATTERNS
	// ========================

	// Handle "text with unicode letters numbers and common punctuation"
	if (
		normalizedText.includes('unicode letters') &&
		normalizedText.includes('numbers') &&
		normalizedText.includes('common punctuation')
	) {
		const unicodeTextPattern = '^[\\p{L}\\p{N}\\p{P}\\s]+$';
		let confidence = 0.8;

		if (testValue) {
			const regex = new RegExp(unicodeTextPattern, 'u');
			const testPassed = regex.test(testValue);
			confidence = calculateConfidence(confidence, true, testPassed);
		}

		return {
			success: true,
			pattern: new RegExp(unicodeTextPattern, 'u'),
			confidence,
			description: 'Text with unicode letters, numbers, and common punctuation',
			suggestions,
		};
	}

	// Handle "name with international characters and optional middle initial"
	if (
		normalizedText.includes('name') &&
		normalizedText.includes('international characters') &&
		normalizedText.includes('optional middle initial')
	) {
		const internationalNamePattern =
			'^[\\p{L}\\s]+([\\p{L}]\\.\\s)?[\\p{L}\\s]+$';
		let confidence = 0.8;

		if (testValue) {
			const regex = new RegExp(internationalNamePattern, 'u');
			const testPassed = regex.test(testValue);
			confidence = calculateConfidence(confidence, true, testPassed);
		}

		return {
			success: true,
			pattern: new RegExp(internationalNamePattern, 'u'),
			confidence,
			description:
				'Name with international characters and optional middle initial',
			suggestions,
		};
	}

	// ADVANCED FILE PATTERNS
	// ======================

	// Handle "file path with unix style forward slashes and no spaces"
	if (
		normalizedText.includes('file path') &&
		normalizedText.includes('unix style') &&
		normalizedText.includes('forward slashes') &&
		normalizedText.includes('no spaces')
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
			suggestions,
		};
	}

	// Handle "semantic version with major minor patch and optional prerelease"
	if (
		normalizedText.includes('semantic version') &&
		normalizedText.includes('major minor patch') &&
		normalizedText.includes('optional prerelease')
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
			suggestions,
		};
	}

	// Handle "log entry with timestamp level and message"
	if (
		normalizedText.includes('log entry') &&
		normalizedText.includes('timestamp') &&
		normalizedText.includes('level') &&
		normalizedText.includes('message')
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
			suggestions,
		};
	}

	return null;
}
