/**
 * RGex Password Validation Utilities
 * Advanced password strength analysis and validation
 */

import type {
	PasswordValidationOptions,
	PasswordValidationResult,
} from '../../types/index.js';
import {
	COMMON_PASSWORDS,
	SPECIAL_CHARS,
	SYMBOLS,
	UNICODE_RANGE,
} from '../constants/patterns.js';
import { RGEX_CONFIG } from '../config/index.js';

/**
 * Validates a password against a comprehensive set of rules and provides a detailed analysis.
 *
 * @param password The password string to validate.
 * @param options A `PasswordValidationOptions` object to customize the validation rules.
 * @returns A `PasswordValidationResult` object containing the validation details.
 */
export function validatePassword(
	password: string,
	options: PasswordValidationOptions = {}
): PasswordValidationResult {
	const opts = { ...RGEX_CONFIG.defaults.passwordValidation, ...options };

	const results = {
		length: checkLength(password, opts.minLength, opts.maxLength),
		hasNumber: checkHasNumber(password, opts.hasNumber),
		hasSpecial: checkHasSpecial(password, opts.hasSpecial),
		hasUpperChar: checkHasUpperChar(password, opts.hasUpperChar),
		hasLowerChar: checkHasLowerChar(password, opts.hasLowerChar),
		hasSymbol: checkHasSymbol(password, opts.hasSymbol),
		hasUnicode: checkHasUnicode(password, opts.hasUnicode),
		noSequential: checkNoSequential(password, opts.noSequential),
		noRepeating: checkNoRepeating(password, opts.noRepeating),
		noCommonWords: checkNoCommonWords(password, opts.noCommonWords),
		customPattern: checkCustomPattern(password, opts.customPattern),
	};

	const failedRequirements: string[] = [];
	let passedCount = 0;

	// Check each requirement
	for (const [key, result] of Object.entries(results)) {
		if (result.required && !result.passed) {
			failedRequirements.push(result.message);
		}
		if (result.passed) {
			passedCount++;
		}
	}

	// Calculate score (0-100) - Use comprehensive scoring instead of just requirement-based
	const score = calculatePasswordScore(password, results, passedCount);

	// Determine strength
	const strength = calculatePasswordStrength(
		score,
		password.length,
		passedCount
	);

	return {
		error:
			failedRequirements.length > 0
				? {
						message: 'Password does not meet requirements',
						requirements: failedRequirements,
				  }
				: null,
		pass: results,
		score,
		strength,
	};
}

/**
 * Checks if the password meets the length requirements.
 * @param password The password to check.
 * @param minLength The minimum required length.
 * @param maxLength The maximum allowed length.
 * @returns An object indicating if the check passed, if it was required, and a message.
 * @internal
 */
function checkLength(
	password: string,
	minLength: number,
	maxLength?: number
): { passed: boolean; required: boolean; message: string } {
	const length = password.length;
	const passed =
		length >= minLength && (maxLength === undefined || length <= maxLength);

	let message = '';
	if (maxLength !== undefined) {
		message = `Password must be between ${minLength} and ${maxLength} characters`;
	} else {
		message = `Password must be at least ${minLength} characters`;
	}

	return {
		passed,
		required: true,
		message,
	};
}

/**
 * Checks if the password contains at least one number.
 * @param password The password to check.
 * @param required Whether this check is required.
 * @returns An object indicating if the check passed and if it was required.
 * @internal
 */
function checkHasNumber(
	password: string,
	required: boolean
): { passed: boolean; required: boolean; message: string } {
	const passed = /\d/.test(password);
	return {
		passed,
		required,
		message: 'Password must contain at least one number',
	};
}

/**
 * Checks if the password contains at least one special character.
 * @param password The password to check.
 * @param required Whether this check is required.
 * @returns An object indicating if the check passed and if it was required.
 * @internal
 */
function checkHasSpecial(
	password: string,
	required: boolean
): { passed: boolean; required: boolean; message: string } {
	const pattern = new RegExp(`[${SPECIAL_CHARS}]`);
	const passed = pattern.test(password);
	return {
		passed,
		required,
		message: 'Password must contain at least one special character',
	};
}

/**
 * Checks if the password contains at least one uppercase letter.
 * @param password The password to check.
 * @param required Whether this check is required.
 * @returns An object indicating if the check passed and if it was required.
 * @internal
 */
function checkHasUpperChar(
	password: string,
	required: boolean
): { passed: boolean; required: boolean; message: string } {
	const passed = /[A-Z]/.test(password);
	return {
		passed,
		required,
		message: 'Password must contain at least one uppercase letter',
	};
}

/**
 * Checks if the password contains at least one lowercase letter.
 * @param password The password to check.
 * @param required Whether this check is required.
 * @returns An object indicating if the check passed and if it was required.
 * @internal
 */
function checkHasLowerChar(
	password: string,
	required: boolean
): { passed: boolean; required: boolean; message: string } {
	const passed = /[a-z]/.test(password);
	return {
		passed,
		required,
		message: 'Password must contain at least one lowercase letter',
	};
}

/**
 * Checks if the password contains at least one symbol.
 * @param password The password to check.
 * @param required Whether this check is required.
 * @returns An object indicating if the check passed and if it was required.
 * @internal
 */
function checkHasSymbol(
	password: string,
	required: boolean
): { passed: boolean; required: boolean; message: string } {
	const pattern = new RegExp(SYMBOLS);
	const passed = pattern.test(password);
	return {
		passed,
		required,
		message: 'Password must contain at least one symbol',
	};
}

/**
 * Checks if the password contains at least one Unicode character.
 * @param password The password to check.
 * @param required Whether this check is required.
 * @returns An object indicating if the check passed and if it was required.
 * @internal
 */
function checkHasUnicode(
	password: string,
	required: boolean
): { passed: boolean; required: boolean; message: string } {
	const pattern = new RegExp(UNICODE_RANGE);
	const passed = pattern.test(password);
	return {
		passed,
		required,
		message: 'Password must contain at least one unicode character',
	};
}

/**
 * Checks if the password contains sequential characters (e.g., "abc", "123").
 * @param password The password to check.
 * @param required Whether this check is required.
 * @returns An object indicating if the check passed and if it was required.
 * @internal
 */
function checkNoSequential(
	password: string,
	required: boolean
): { passed: boolean; required: boolean; message: string } {
	if (!required) {
		return { passed: true, required: false, message: '' };
	}

	const passed = !hasSequentialChars(password);
	return {
		passed,
		required,
		message: 'Password must not contain sequential characters (e.g., 123, abc)',
	};
}

/**
 * Checks if the password contains repeating characters (e.g., "aaa", "111").
 * @param password The password to check.
 * @param required Whether this check is required.
 * @returns An object indicating if the check passed and if it was required.
 * @internal
 */
function checkNoRepeating(
	password: string,
	required: boolean
): { passed: boolean; required: boolean; message: string } {
	if (!required) {
		return { passed: true, required: false, message: '' };
	}

	const passed = !hasRepeatingChars(password);
	return {
		passed,
		required,
		message: 'Password must not contain repeating characters (e.g., aaa, 111)',
	};
}

/**
 * Checks if the password is one of the commonly used passwords.
 * @param password The password to check.
 * @param required Whether this check is required.
 * @returns An object indicating if the check passed and if it was required.
 * @internal
 */
function checkNoCommonWords(
	password: string,
	required: boolean
): { passed: boolean; required: boolean; message: string } {
	if (!required) {
		return { passed: true, required: false, message: '' };
	}

	const passed = !hasCommonWords(password);
	return {
		passed,
		required,
		message: 'Password must not contain common words or patterns',
	};
}

/**
 * Checks if the password matches a custom regex pattern.
 * @param password The password to check.
 * @param customPattern A custom regex pattern to test against.
 * @returns An object indicating if the check passed, if it was required, and a message.
 * @internal
 */
function checkCustomPattern(
	password: string,
	customPattern?: string | RegExp
): { passed: boolean; required: boolean; message: string } {
	if (!customPattern) {
		return { passed: true, required: false, message: '' };
	}

	try {
		const pattern =
			typeof customPattern === 'string'
				? new RegExp(customPattern)
				: customPattern;
		const passed = pattern.test(password);
		return {
			passed,
			required: true,
			message: 'Password must match the custom pattern',
		};
	} catch (error) {
		return {
			passed: false,
			required: true,
			message: 'Invalid custom pattern provided',
		};
	}
}

/**
 * Detects if a string contains sequential characters (e.g., "abc" or "123").
 *
 * @param password The string to check.
 * @param minLength The minimum length of a sequence to be considered sequential. Defaults to 3.
 * @returns `true` if sequential characters are found, otherwise `false`.
 */
export function hasSequentialChars(
	password: string,
	minLength: number = 3
): boolean {
	for (let i = 0; i <= password.length - minLength; i++) {
		const slice = password.slice(i, i + minLength);

		// Check for sequential numbers
		if (/^\d+$/.test(slice)) {
			let isSequential = true;
			for (let j = 1; j < slice.length; j++) {
				const prev = slice[j - 1]!;
				const curr = slice[j]!;
				if (parseInt(curr, 10) !== parseInt(prev, 10) + 1) {
					isSequential = false;
					break;
				}
			}
			if (isSequential) return true;
		}

		// Check for sequential letters
		if (/^[a-zA-Z]+$/.test(slice)) {
			let isSequential = true;
			for (let j = 1; j < slice.length; j++) {
				if (slice.charCodeAt(j) !== slice.charCodeAt(j - 1) + 1) {
					isSequential = false;
					break;
				}
			}
			if (isSequential) return true;
		}
	}

	return false;
}

/**
 * Detects if a string contains repeating characters (e.g., "aaa" or "111").
 *
 * @param password The string to check.
 * @param minLength The minimum number of repeating characters to be considered a repetition. Defaults to 3.
 * @returns `true` if repeating characters are found, otherwise `false`.
 */
export function hasRepeatingChars(
	password: string,
	minLength: number = 3
): boolean {
	for (let i = 0; i <= password.length - minLength; i++) {
		const slice = password.slice(i, i + minLength);
		if (slice.split('').every((char) => char === slice[0])) {
			return true;
		}
	}
	return false;
}

/**
 * Checks if a password is found in the list of common passwords.
 *
 * @param password The password to check.
 * @returns `true` if the password is in the common list, otherwise `false`.
 */
export function hasCommonWords(password: string): boolean {
	const lowerPassword = password.toLowerCase();
	return COMMON_PASSWORDS.some((commonWord) =>
		lowerPassword.includes(commonWord.toLowerCase())
	);
}

/**
 * Calculates a strength score for the password based on various criteria.
 * @param password The password string.
 * @param results The results from individual validation checks.
 * @param passedCount The number of passed validation checks.
 * @returns A score from 0 to 100.
 * @internal
 */
function calculatePasswordScore(
	password: string,
	results: any,
	passedCount: number
): number {
	let score = 0;

	// Length scoring (0-30 points)
	const length = password.length;
	if (length >= 12) score += 30;
	else if (length >= 10) score += 25;
	else if (length >= 8) score += 20;
	else if (length >= 6) score += 15;
	else if (length >= 4) score += 10;
	else score += 5;

	// Character diversity scoring (0-40 points)
	if (results.hasLowerChar.passed) score += 5;
	if (results.hasUpperChar.passed) score += 5;
	if (results.hasNumber.passed) score += 10;
	if (results.hasSpecial.passed) score += 15;
	if (results.hasSymbol.passed) score += 5;

	// Security checks (0-30 points)
	if (results.noSequential.passed) score += 10;
	if (results.noRepeating.passed) score += 10;
	if (results.noCommonWords.passed) score += 10;

	// Bonus for custom pattern
	if (results.customPattern.passed && results.customPattern.required)
		score += 5;

	// Penalty for common words (even if not required)
	if (hasCommonWords(password)) score -= 20;

	// Harsh penalty for very short passwords
	if (length <= 3) score -= 30;
	else if (length < 6) score -= 10;

	return Math.max(0, Math.min(100, score));
}

/**
 * Determines the password strength level based on its score and other factors.
 * @param score The calculated password score.
 * @param length The length of the password.
 * @param passedRequirements The number of passed requirements.
 * @returns A string representing the password strength level.
 * @internal
 */
function calculatePasswordStrength(
	score: number,
	length: number,
	passedRequirements: number
): 'very-weak' | 'weak' | 'fair' | 'good' | 'strong' | 'very-strong' {
	// Base strength on score
	if (score < 20) return 'very-weak';
	if (score < 40) return 'weak';
	if (score < 60) return 'fair';
	if (score < 80) return 'good';

	// For high scores, consider additional factors
	if (score >= 80) {
		if (length >= 12 && passedRequirements >= 6) {
			return 'very-strong';
		}
		return 'strong';
	}

	return 'fair';
}

/**
 * Provides suggestions for improving a password based on failed validation checks.
 *
 * @param password The password that was tested.
 * @param options The validation options that were used.
 * @returns An array of string suggestions to improve the password.
 */
export function getPasswordSuggestions(
	password: string,
	options: PasswordValidationOptions = {}
): string[] {
	const result = validatePassword(password, options);
	const suggestions: string[] = [];

	if (result.error) {
		suggestions.push(...result.error.requirements);
	}

	// Additional suggestions based on strength
	if (result.strength === 'very-weak' || result.strength === 'weak') {
		suggestions.push(
			'Consider using a longer password (12+ characters)',
			'Mix uppercase and lowercase letters',
			'Include numbers and special characters',
			'Avoid common words and patterns'
		);
	} else if (result.strength === 'fair') {
		suggestions.push(
			'Add more character variety for better security',
			'Consider increasing the length further'
		);
	}

	return suggestions.slice(0, 5); // Limit to 5 suggestions
}

/**
 * Generates a strong, random password that adheres to specified criteria.
 *
 * @param length The desired length of the password. Defaults to 12.
 * @param options Options to customize the character sets to include in the generated password.
 * @returns A securely generated password string.
 */
export function generateStrongPassword(
	length: number = 12,
	options: Partial<PasswordValidationOptions> = {}
): string {
	const chars = {
		lowercase: 'abcdefghijklmnopqrstuvwxyz',
		uppercase: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
		numbers: '0123456789',
		special: '!@#$%^&*()_+-=[]{}|;:,.<>?',
		symbols: '~`!"#$%^&*()_+-=[]{}\\|;:\'",.<>?/',
	};

	let charSet = '';
	let password = '';

	// Ensure required character types
	if (options.hasLowerChar !== false) {
		charSet += chars.lowercase;
		password +=
			chars.lowercase[Math.floor(Math.random() * chars.lowercase.length)];
	}

	if (options.hasUpperChar !== false) {
		charSet += chars.uppercase;
		password +=
			chars.uppercase[Math.floor(Math.random() * chars.uppercase.length)];
	}

	if (options.hasNumber !== false) {
		charSet += chars.numbers;
		password += chars.numbers[Math.floor(Math.random() * chars.numbers.length)];
	}

	if (options.hasSpecial !== false) {
		charSet += chars.special;
		password += chars.special[Math.floor(Math.random() * chars.special.length)];
	}

	if (options.hasSymbol) {
		charSet += chars.symbols;
		password += chars.symbols[Math.floor(Math.random() * chars.symbols.length)];
	}

	// Fill remaining length
	while (password.length < length) {
		password += charSet[Math.floor(Math.random() * charSet.length)];
	}

	// Shuffle the password to avoid predictable patterns
	return password
		.split('')
		.sort(() => Math.random() - 0.5)
		.join('');
}
