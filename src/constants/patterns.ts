/**
 * RGex Pattern Constants
 * Pre-defined regex patterns for common use cases
 */

import type { HumanTextPattern } from '../../types/index.js';

// Common regex patterns
export const REGEX_PATTERNS = {
	// Email patterns
	EMAIL:
		"^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$",

	// URL patterns
	URL: '^https?:\\/\\/(www\\.)?[-a-zA-Z0-9@:%._\\+~#=]{1,256}\\.[a-zA-Z0-9()]{1,6}\\b([-a-zA-Z0-9()@:%_\\+.~#?&//=]*)$',

	// Phone patterns
	PHONE: '^\\+?[1-9]\\d{4,14}$',

	// Date and time patterns
	DATE: '^\\d{4}-\\d{2}-\\d{2}$',
	TIME: '^([01]?[0-9]|2[0-3]):[0-5][0-9](:[0-5][0-9])?$',

	// Number patterns
	INTEGER: '^-?\\d+$',
	DECIMAL: '^-?\\d+(\\.\\d+)?$',
	POSITIVE_INTEGER: '^[1-9]\\d*$',
	POSITIVE_DECIMAL: '^([1-9]\\d*|0)(\\.\\d+)?$',

	// Identifier patterns
	UUID: '^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$',
	MONGO_ID: '^[0-9a-fA-F]{24}$',

	// Network patterns
	IPV4: '^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$',
	IPV6: '^(([0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:)|fe80:(:[0-9a-fA-F]{0,4}){0,4}%[0-9a-zA-Z]+|::(ffff(:0{1,4})?:)?((25[0-5]|(2[0-4]|1?[0-9])?[0-9])\\.){3}(25[0-5]|(2[0-4]|1?[0-9])?[0-9])|([0-9a-fA-F]{1,4}:){1,4}:((25[0-5]|(2[0-4]|1?[0-9])?[0-9])\\.){3}(25[0-5]|(2[0-4]|1?[0-9])?[0-9]))$',
	DOMAIN: '^(?:[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?.)+[a-zA-Z]{2,}$',
	MAC_ADDRESS: '^([0-9A-Fa-f]{2}[:-]){5}([0-9A-Fa-f]{2})$',

	// Format patterns
	HEX_COLOR: '^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$',
	SLUG: '^[a-z0-9]+(?:-[a-z0-9]+)*$',
	USERNAME: '^[a-zA-Z0-9_]{3,20}$',

	// Financial patterns
	CREDIT_CARD:
		'^(?:4[0-9]{12}(?:[0-9]{3})?|5[1-5][0-9]{14}|3[47][0-9]{13}|3[0-9]{13}|6(?:011|5[0-9]{2})[0-9]{12})$',

	// Security patterns
	STRONG_PASSWORD:
		'^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[!@#$%^&*()_+\\-=\\[\\]{};\':"\\\\|,.<>\\/?]).{8,}$',

	// Basic character classes
	DIGITS_ONLY: '^\\d+$',
	LETTERS_ONLY: '^[a-zA-Z]+$',
	ALPHANUMERIC: '^[a-zA-Z0-9]+$',
	NO_SPACES: '^\\S+$',

	// Encoding patterns
	BASE64: '^[A-Za-z0-9+/]*={0,2}$',
} as const;

// Human-readable pattern mappings
export const HUMAN_PATTERNS: Record<string, HumanTextPattern> = {
	email: {
		type: 'email',
		pattern: REGEX_PATTERNS.EMAIL,
		description: 'Valid email address',
		examples: ['user@example.com', 'test.email+tag@domain.co.uk'],
	},

	phone: {
		type: 'phone',
		pattern: REGEX_PATTERNS.PHONE,
		description: 'Phone number with optional country code',
		examples: ['+1234567890', '1234567890'],
	},

	url: {
		type: 'url',
		pattern: REGEX_PATTERNS.URL,
		description: 'HTTP or HTTPS URL',
		examples: ['https://example.com', 'http://test.org/path'],
	},

	date: {
		type: 'date',
		pattern: REGEX_PATTERNS.DATE,
		description: 'Date in YYYY-MM-DD format',
		examples: ['2023-12-25', '2024-01-01'],
	},

	time: {
		type: 'time',
		pattern: REGEX_PATTERNS.TIME,
		description: 'Time in HH:MM or HH:MM:SS format',
		examples: ['14:30', '09:15:30'],
	},

	number: {
		type: 'number',
		pattern: REGEX_PATTERNS.DECIMAL,
		description: 'Integer or decimal number',
		examples: ['123', '-45.67', '0.5'],
	},

	uuid: {
		type: 'custom',
		pattern: REGEX_PATTERNS.UUID,
		description: 'UUID (Universally Unique Identifier)',
		examples: ['123e4567-e89b-12d3-a456-426614174000'],
	},

	ipv4: {
		type: 'custom',
		pattern: REGEX_PATTERNS.IPV4,
		description: 'IPv4 address',
		examples: ['192.168.1.1', '127.0.0.1'],
	},

	hexcolor: {
		type: 'custom',
		pattern: REGEX_PATTERNS.HEX_COLOR,
		description: 'Hexadecimal color code',
		examples: ['#ff0000', '#f00'],
	},
};

// Keyword mappings for human text recognition
export const PATTERN_KEYWORDS: Record<string, string[]> = {
	email: ['email', 'e-mail', 'mail address', '@'],
	phone: ['phone', 'telephone', 'mobile', 'cell'],
	url: ['url', 'link', 'website', 'http', 'https'],
	date: ['date', 'yyyy-mm-dd', 'iso date'],
	time: ['time', 'hh:mm', 'hour', 'minute'],
	number: ['number', 'numeric', 'digit', 'integer', 'decimal'],
	uuid: ['uuid', 'guid', 'unique identifier'],
	ipv4: ['ip', 'ipv4', 'ip address'],
	hexcolor: ['color', 'hex', 'hexadecimal', '#'],
};

// Common words to avoid in passwords
export const COMMON_PASSWORDS = [
	'password',
	'123456',
	'qwerty',
	'admin',
	'login',
	'welcome',
	'dragon',
	'princess',
	'letmein',
	'monkey',
	'sunshine',
	'master',
	'shadow',
	'football',
	'baseball',
	'superman',
	'michael',
	'ninja',
	'mustang',
	'computer',
];

// Special characters for password validation
export const SPECIAL_CHARS = '!@#$%^&*()_+\\-=\\[\\]{};\':"\\\\|,.<>\\/?';
export const SYMBOLS = '[^\\w\\s]';
export const UNICODE_RANGE = '[^\\x00-\\x7F]';
