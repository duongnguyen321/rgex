/**
 * RGex Validation Constants
 * Validation patterns and rules for different data types
 */

import type { ValidationRule } from '../../types/index.js';
import { REGEX_PATTERNS } from './patterns.js';

/**
 * A collection of factory functions for creating validation rules.
 * Each function returns a `ValidationRule` object.
 */
export const VALIDATION_PATTERNS = {
	/**
	 * Creates a validation rule for a required field.
	 * @returns A validation rule object.
	 */
	required: (): ValidationRule => ({
		name: 'required',
		pattern: /.+/,
		message: 'This field is required',
		validator: (val: string) => val.trim().length > 0,
	}),

	/**
	 * Creates a validation rule for an email address.
	 * @returns A validation rule object.
	 */
	email: (): ValidationRule => ({
		name: 'email',
		pattern: new RegExp(REGEX_PATTERNS.EMAIL),
		message: 'Please enter a valid email address',
	}),

	/**
	 * Creates a validation rule for a phone number.
	 * @returns A validation rule object.
	 */
	phone: (): ValidationRule => ({
		name: 'phone',
		pattern: new RegExp(REGEX_PATTERNS.PHONE),
		message: 'Please enter a valid phone number',
	}),

	/**
	 * Creates a validation rule for a URL.
	 * @returns A validation rule object.
	 */
	url: (): ValidationRule => ({
		name: 'url',
		pattern: new RegExp(REGEX_PATTERNS.URL),
		message: 'Please enter a valid URL',
	}),

	/**
	 * Creates a validation rule for a minimum length.
	 * @param length - The minimum required length.
	 * @returns A validation rule object.
	 */
	minLength: (length: number): ValidationRule => ({
		name: 'minLength',
		pattern: new RegExp(`.{${length},}`),
		message: `Minimum length is ${length} characters`,
		validator: (val: string) => val.length >= length,
	}),

	/**
	 * Creates a validation rule for a maximum length.
	 * @param length - The maximum allowed length.
	 * @returns A validation rule object.
	 */
	maxLength: (length: number): ValidationRule => ({
		name: 'maxLength',
		pattern: new RegExp(`^.{0,${length}}$`),
		message: `Maximum length is ${length} characters`,
		validator: (val: string) => val.length <= length,
	}),

	/**
	 * Creates a validation rule for numbers only.
	 * @returns A validation rule object.
	 */
	numbersOnly: (): ValidationRule => ({
		name: 'numbersOnly',
		pattern: new RegExp(REGEX_PATTERNS.DIGITS_ONLY),
		message: 'Only numbers are allowed',
	}),

	/**
	 * Creates a validation rule for letters only.
	 * @returns A validation rule object.
	 */
	lettersOnly: (): ValidationRule => ({
		name: 'lettersOnly',
		pattern: new RegExp(REGEX_PATTERNS.LETTERS_ONLY),
		message: 'Only letters are allowed',
	}),

	/**
	 * Creates a validation rule for alphanumeric characters.
	 * @returns A validation rule object.
	 */
	alphanumeric: (): ValidationRule => ({
		name: 'alphanumeric',
		pattern: new RegExp(REGEX_PATTERNS.ALPHANUMERIC),
		message: 'Only letters and numbers are allowed',
	}),

	/**
	 * Creates a validation rule that disallows spaces.
	 * @returns A validation rule object.
	 */
	noSpaces: (): ValidationRule => ({
		name: 'noSpaces',
		pattern: new RegExp(REGEX_PATTERNS.NO_SPACES),
		message: 'Spaces are not allowed',
	}),

	/**
	 * Creates a validation rule for a strong password.
	 * @returns A validation rule object.
	 */
	strongPassword: (): ValidationRule => ({
		name: 'strongPassword',
		pattern: new RegExp(REGEX_PATTERNS.STRONG_PASSWORD),
		message:
			'Password must contain uppercase, lowercase, number, and special character',
	}),

	/**
	 * Creates a validation rule for a UUID.
	 * @returns A validation rule object.
	 */
	uuid: (): ValidationRule => ({
		name: 'uuid',
		pattern: new RegExp(REGEX_PATTERNS.UUID, 'i'),
		message: 'Please enter a valid UUID',
	}),

	/**
	 * Creates a validation rule for an IP address (v4 or v6).
	 * @returns A validation rule object.
	 */
	ipAddress: (): ValidationRule => ({
		name: 'ipAddress',
		pattern: new RegExp(`(${REGEX_PATTERNS.IPV4})|(${REGEX_PATTERNS.IPV6})`),
		message: 'Please enter a valid IP address',
	}),

	/**
	 * Creates a validation rule for a date in YYYY-MM-DD format.
	 * @returns A validation rule object.
	 */
	date: (): ValidationRule => ({
		name: 'date',
		pattern: new RegExp(REGEX_PATTERNS.DATE),
		message: 'Please enter a valid date (YYYY-MM-DD)',
		validator: (val: string) => {
			if (!new RegExp(REGEX_PATTERNS.DATE).test(val)) return false;
			const date = new Date(val);
			return date instanceof Date && !isNaN(date.getTime());
		},
	}),

	/**
	 * Creates a validation rule for time in HH:MM or HH:MM:SS format.
	 * @returns A validation rule object.
	 */
	time: (): ValidationRule => ({
		name: 'time',
		pattern: new RegExp(REGEX_PATTERNS.TIME),
		message: 'Please enter a valid time (HH:MM or HH:MM:SS)',
	}),

	/**
	 * Creates a validation rule for a hex color code.
	 * @returns A validation rule object.
	 */
	hexColor: (): ValidationRule => ({
		name: 'hexColor',
		pattern: new RegExp(REGEX_PATTERNS.HEX_COLOR),
		message: 'Please enter a valid hex color (#fff or #ffffff)',
	}),

	/**
	 * Creates a validation rule for a URL slug.
	 * @returns A validation rule object.
	 */
	slug: (): ValidationRule => ({
		name: 'slug',
		pattern: new RegExp(REGEX_PATTERNS.SLUG),
		message:
			'Please enter a valid slug (lowercase letters, numbers, and hyphens only)',
	}),

	/**
	 * Creates a validation rule for a username.
	 * @returns A validation rule object.
	 */
	username: (): ValidationRule => ({
		name: 'username',
		pattern: new RegExp(REGEX_PATTERNS.USERNAME),
		message:
			'Username must be 3-20 characters long and contain only letters, numbers, and underscores',
	}),

	/**
	 * Creates a validation rule for a domain name.
	 * @returns A validation rule object.
	 */
	domain: (): ValidationRule => ({
		name: 'domain',
		pattern: new RegExp(REGEX_PATTERNS.DOMAIN),
		message: 'Please enter a valid domain name',
	}),

	/**
	 * Creates a validation rule for a credit card number.
	 * @returns A validation rule object.
	 */
	creditCard: (): ValidationRule => ({
		name: 'creditCard',
		pattern: new RegExp(REGEX_PATTERNS.CREDIT_CARD),
		message: 'Please enter a valid credit card number',
	}),

	/**
	 * Creates a validation rule for a MongoDB ObjectID.
	 * @returns A validation rule object.
	 */
	mongoId: (): ValidationRule => ({
		name: 'mongoId',
		pattern: new RegExp(REGEX_PATTERNS.MONGO_ID),
		message: 'Please enter a valid MongoDB ObjectID',
	}),

	/**
	 * Creates a validation rule for a base64 encoded string.
	 * @returns A validation rule object.
	 */
	base64: (): ValidationRule => ({
		name: 'base64',
		pattern: new RegExp(REGEX_PATTERNS.BASE64),
		message: 'Please enter a valid base64 encoded string',
		validator: (val: string) => {
			try {
				return btoa(atob(val)) === val;
			} catch {
				return false;
			}
		},
	}),

	/**
	 * Creates a validation rule for a JSON string.
	 * @returns A validation rule object.
	 */
	json: (): ValidationRule => ({
		name: 'json',
		pattern: /^[\s\S]*$/,
		message: 'Please enter valid JSON',
		validator: (val: string) => {
			try {
				JSON.parse(val);
				return true;
			} catch {
				return false;
			}
		},
	}),
};

/**
 * A mapping of human-readable keywords to validation rule factories.
 */
export const VALIDATION_KEYWORDS: Record<
	string,
	() => ValidationRule | ((param: number) => ValidationRule)
> = {
	required: VALIDATION_PATTERNS.required,
	email: VALIDATION_PATTERNS.email,
	phone: VALIDATION_PATTERNS.phone,
	url: VALIDATION_PATTERNS.url,
	'numbers only': VALIDATION_PATTERNS.numbersOnly,
	'digits only': VALIDATION_PATTERNS.numbersOnly,
	'letters only': VALIDATION_PATTERNS.lettersOnly,
	alphabetic: VALIDATION_PATTERNS.lettersOnly,
	alphanumeric: VALIDATION_PATTERNS.alphanumeric,
	'no spaces': VALIDATION_PATTERNS.noSpaces,
	'strong password': VALIDATION_PATTERNS.strongPassword,
	uuid: VALIDATION_PATTERNS.uuid,
	guid: VALIDATION_PATTERNS.uuid,
	'ip address': VALIDATION_PATTERNS.ipAddress,
	date: VALIDATION_PATTERNS.date,
	time: VALIDATION_PATTERNS.time,
	'hex color': VALIDATION_PATTERNS.hexColor,
	color: VALIDATION_PATTERNS.hexColor,
	slug: VALIDATION_PATTERNS.slug,
	username: VALIDATION_PATTERNS.username,
	domain: VALIDATION_PATTERNS.domain,
	'credit card': VALIDATION_PATTERNS.creditCard,
	'mongo id': VALIDATION_PATTERNS.mongoId,
	'mongodb id': VALIDATION_PATTERNS.mongoId,
	base64: VALIDATION_PATTERNS.base64,
	json: VALIDATION_PATTERNS.json,
};

/**
 * A mapping for length-related validation rule factories.
 */
export const LENGTH_PATTERNS = {
	'min length': VALIDATION_PATTERNS.minLength,
	'max length': VALIDATION_PATTERNS.maxLength,
	'minimum length': VALIDATION_PATTERNS.minLength,
	'maximum length': VALIDATION_PATTERNS.maxLength,
};
