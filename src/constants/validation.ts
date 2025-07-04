/**
 * RGex Validation Constants
 * Validation patterns and rules for different data types
 */

import type { ValidationRule } from '../../types/index.js';
import { REGEX_PATTERNS } from './patterns.js';

// Validation pattern factories
export const VALIDATION_PATTERNS = {
	required: (): ValidationRule => ({
		name: 'required',
		pattern: /.+/,
		message: 'This field is required',
		validator: (val: string) => val.trim().length > 0,
	}),

	email: (): ValidationRule => ({
		name: 'email',
		pattern: new RegExp(REGEX_PATTERNS.EMAIL),
		message: 'Please enter a valid email address',
	}),

	phone: (): ValidationRule => ({
		name: 'phone',
		pattern: new RegExp(REGEX_PATTERNS.PHONE),
		message: 'Please enter a valid phone number',
	}),

	url: (): ValidationRule => ({
		name: 'url',
		pattern: new RegExp(REGEX_PATTERNS.URL),
		message: 'Please enter a valid URL',
	}),

	minLength: (length: number): ValidationRule => ({
		name: 'minLength',
		pattern: new RegExp(`.{${length},}`),
		message: `Minimum length is ${length} characters`,
		validator: (val: string) => val.length >= length,
	}),

	maxLength: (length: number): ValidationRule => ({
		name: 'maxLength',
		pattern: new RegExp(`^.{0,${length}}$`),
		message: `Maximum length is ${length} characters`,
		validator: (val: string) => val.length <= length,
	}),

	numbersOnly: (): ValidationRule => ({
		name: 'numbersOnly',
		pattern: new RegExp(REGEX_PATTERNS.DIGITS_ONLY),
		message: 'Only numbers are allowed',
	}),

	lettersOnly: (): ValidationRule => ({
		name: 'lettersOnly',
		pattern: new RegExp(REGEX_PATTERNS.LETTERS_ONLY),
		message: 'Only letters are allowed',
	}),

	alphanumeric: (): ValidationRule => ({
		name: 'alphanumeric',
		pattern: new RegExp(REGEX_PATTERNS.ALPHANUMERIC),
		message: 'Only letters and numbers are allowed',
	}),

	noSpaces: (): ValidationRule => ({
		name: 'noSpaces',
		pattern: new RegExp(REGEX_PATTERNS.NO_SPACES),
		message: 'Spaces are not allowed',
	}),

	strongPassword: (): ValidationRule => ({
		name: 'strongPassword',
		pattern: new RegExp(REGEX_PATTERNS.STRONG_PASSWORD),
		message:
			'Password must contain uppercase, lowercase, number, and special character',
	}),

	uuid: (): ValidationRule => ({
		name: 'uuid',
		pattern: new RegExp(REGEX_PATTERNS.UUID, 'i'),
		message: 'Please enter a valid UUID',
	}),

	ipAddress: (): ValidationRule => ({
		name: 'ipAddress',
		pattern: new RegExp(`(${REGEX_PATTERNS.IPV4})|(${REGEX_PATTERNS.IPV6})`),
		message: 'Please enter a valid IP address',
	}),

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

	time: (): ValidationRule => ({
		name: 'time',
		pattern: new RegExp(REGEX_PATTERNS.TIME),
		message: 'Please enter a valid time (HH:MM or HH:MM:SS)',
	}),

	hexColor: (): ValidationRule => ({
		name: 'hexColor',
		pattern: new RegExp(REGEX_PATTERNS.HEX_COLOR),
		message: 'Please enter a valid hex color (#fff or #ffffff)',
	}),

	slug: (): ValidationRule => ({
		name: 'slug',
		pattern: new RegExp(REGEX_PATTERNS.SLUG),
		message:
			'Please enter a valid slug (lowercase letters, numbers, and hyphens only)',
	}),

	username: (): ValidationRule => ({
		name: 'username',
		pattern: new RegExp(REGEX_PATTERNS.USERNAME),
		message:
			'Username must be 3-20 characters long and contain only letters, numbers, and underscores',
	}),

	domain: (): ValidationRule => ({
		name: 'domain',
		pattern: new RegExp(REGEX_PATTERNS.DOMAIN),
		message: 'Please enter a valid domain name',
	}),

	creditCard: (): ValidationRule => ({
		name: 'creditCard',
		pattern: new RegExp(REGEX_PATTERNS.CREDIT_CARD),
		message: 'Please enter a valid credit card number',
	}),

	mongoId: (): ValidationRule => ({
		name: 'mongoId',
		pattern: new RegExp(REGEX_PATTERNS.MONGO_ID),
		message: 'Please enter a valid MongoDB ObjectID',
	}),

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

// Validation pattern keywords for human text recognition
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

// Length constraint patterns
export const LENGTH_PATTERNS = {
	'min length': VALIDATION_PATTERNS.minLength,
	'max length': VALIDATION_PATTERNS.maxLength,
	'minimum length': VALIDATION_PATTERNS.minLength,
	'maximum length': VALIDATION_PATTERNS.maxLength,
};
