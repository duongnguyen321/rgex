/**
 * @fileoverview RGex Pattern Constants - Pre-defined regex patterns for common use cases
 * @module Constants
 * @category Constants
 * @group Pattern Definitions
 * @author duongnguyen321 - https://duonguyen.site
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

	// File and data patterns
	FILE_EXTENSION: '^.*\\.[a-zA-Z0-9]{1,10}$',
	IMAGE_FILE: '^.*\\.(jpg|jpeg|png|gif|bmp|svg|webp|ico)$',
	DOCUMENT_FILE: '^.*\\.(pdf|doc|docx|txt|rtf|odt)$',
	TIMESTAMP: '^[0-9]{10,13}$',
	ISO_DATETIME: '^\\d{4}-\\d{2}-\\d{2}T\\d{2}:\\d{2}:\\d{2}(\\.\\d{3})?Z?$',

	// Financial patterns
	CREDIT_CARD:
		'^(?:4[0-9]{12}(?:[0-9]{3})?|5[1-5][0-9]{14}|3[47][0-9]{13}|3[0-9]{13}|6(?:011|5[0-9]{2})[0-9]{12})$',
	VISA_CARD: '^4[0-9]{12}(?:[0-9]{3})?$',
	MASTERCARD: '^5[1-5][0-9]{14}$',
	AMEX: '^3[47][0-9]{13}$',

	// Security patterns
	PASSWORD: '^.{6,}$',
	STRONG_PASSWORD:
		'^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[!@#$%^&*()_+\\-=\\[\\]{};\':"\\\\|,.<>\\/?]).{8,}$',

	// Basic character classes
	DIGITS_ONLY: '^\\d+$',
	LETTERS_ONLY: '^[a-zA-Z]+$',
	ALPHANUMERIC: '^[a-zA-Z0-9]+$',
	NO_SPACES: '^\\S+$',
	TEXT: '^[a-zA-Z0-9\\s.,!?;:\'"-]+$',

	// Postal/Address patterns
	US_ZIP_CODE: '^\\d{5}(-\\d{4})?$',
	CANADIAN_POSTAL_CODE: '^[A-Za-z]\\d[A-Za-z][ -]?\\d[A-Za-z]\\d$',
	UK_POSTCODE: '^[A-Z]{1,2}[0-9][A-Z0-9]? [0-9][ABD-HJLNP-UW-Z]{2}$',
	GERMAN_POSTCODE: '^\\d{5}$',
	FRENCH_POSTCODE: '^\\d{5}$',

	// Government ID patterns
	SSN: '^(?!666|000|9\\d{2})\\d{3}-(?!00)\\d{2}-(?!0{4})\\d{4}$',

	// Encoding patterns
	BASE64: '^[A-Za-z0-9+/]*={0,2}$',

	// Cryptocurrency patterns
	BITCOIN_ADDRESS: '^[13][a-km-zA-HJ-NP-Z1-9]{25,34}$',
	ETHEREUM_ADDRESS: '^0x[a-fA-F0-9]{40}$',

	// Banking patterns
	IBAN: '^[A-Z]{2}[0-9]{2}[A-Z0-9]{4,30}$',
	SWIFT_CODE: '^[A-Z]{4}[A-Z]{2}[A-Z0-9]{2}([A-Z0-9]{3})?$',

	// ISBN patterns
	ISBN_10: '^(?:\\d{9}[\\dX]|\\d{10})$',
	ISBN_13: '^97[89]\\d{10}$',

	// Version and development patterns
	SEMVER:
		'^(0|[1-9]\\d*)\\.(0|[1-9]\\d*)\\.(0|[1-9]\\d*)(?:-((?:0|[1-9]\\d*|\\d*[a-zA-Z-][0-9a-zA-Z-]*)(?:\\.(?:0|[1-9]\\d*|\\d*[a-zA-Z-][0-9a-zA-Z-]*))*))?(?:\\+([0-9a-zA-Z-]+(?:\\.[0-9a-zA-Z-]+)*))?$',
	JWT_TOKEN: '^[A-Za-z0-9-_]+\\.[A-Za-z0-9-_]+\\.[A-Za-z0-9-_.+/=]*$',
	GIT_COMMIT: '^[a-f0-9]{7,40}$',

	// Social media and platform patterns
	GITHUB_USERNAME: '^[a-z\\d](?:[a-z\\d]|-(?=[a-z\\d])){0,38}$',
	TWITTER_HANDLE: '^@?(\\w){1,15}$',
	DISCORD_ID: '^\\d{17,19}$',
	SLACK_USER_ID: '^U[A-Z0-9]{8,10}$',
	YOUTUBE_VIDEO_ID: '^[a-zA-Z0-9_-]{11}$',

	// Cloud and infrastructure patterns
	AWS_S3_BUCKET: '^[a-z0-9][a-z0-9.-]{1,61}[a-z0-9]$',
	DOCKER_IMAGE:
		'^[a-z0-9]+(?:[._-][a-z0-9]+)*(?:\\/[a-z0-9]+(?:[._-][a-z0-9]+)*)*(?::[a-zA-Z0-9._-]+)?$',
	K8S_RESOURCE_NAME: '^[a-z0-9]([-a-z0-9]*[a-z0-9])?$',
	NPM_PACKAGE: '^(?:@[a-z0-9-*~][a-z0-9-*._~]*\\/)?[a-z0-9-~][a-z0-9-._~]*$',

	// International phone (E.164)
	E164_PHONE: '^\\+[1-9]\\d{1,14}$',

	// Additional platform patterns
	LINKEDIN_PROFILE:
		'^https:\\/\\/(www\\.)?linkedin\\.com\\/in\\/[a-zA-Z0-9-]+\\/?$',
	GOOGLE_DRIVE_ID: '^[a-zA-Z0-9-_]{25,}$',
	FIREBASE_PROJECT_ID: '^[a-z0-9-]{6,30}$',
	AZURE_RESOURCE_GROUP: '^[a-zA-Z0-9._()-]{1,90}$',
} as const;

// Human-readable pattern mappings
export const HUMAN_PATTERNS: Record<string, HumanTextPattern> = {
	// Network patterns (specific first)
	ipv6: {
		type: 'custom',
		pattern: REGEX_PATTERNS.IPV6,
		description: 'IPv6 address',
		examples: ['2001:0db8:85a3:0000:0000:8a2e:0370:7334', '::1'],
	},

	ipv4: {
		type: 'custom',
		pattern: REGEX_PATTERNS.IPV4,
		description: 'IPv4 address',
		examples: ['192.168.1.1', '127.0.0.1'],
	},

	macaddress: {
		type: 'custom',
		pattern: REGEX_PATTERNS.MAC_ADDRESS,
		description: 'MAC address',
		examples: ['00:1B:44:11:3A:B7', '00-1B-44-11-3A-B7'],
	},

	domain: {
		type: 'custom',
		pattern: REGEX_PATTERNS.DOMAIN,
		description: 'Domain name',
		examples: ['example.com', 'subdomain.example.org'],
	},

	// Time and data patterns (specific first)
	timestamp: {
		type: 'custom',
		pattern: REGEX_PATTERNS.TIMESTAMP,
		description: 'Unix timestamp',
		examples: ['1640995200', '1640995200000'],
	},

	datetime: {
		type: 'custom',
		pattern: REGEX_PATTERNS.ISO_DATETIME,
		description: 'ISO datetime format',
		examples: ['2023-12-25T10:30:00Z', '2023-12-25T10:30:00.123Z'],
	},

	time: {
		type: 'time',
		pattern: REGEX_PATTERNS.TIME,
		description: 'Time in HH:MM or HH:MM:SS format',
		examples: ['14:30', '09:15:30'],
	},

	// International postal codes (specific first)
	ukpostcode: {
		type: 'custom',
		pattern: REGEX_PATTERNS.UK_POSTCODE,
		description: 'UK postcode',
		examples: ['SW1A 1AA', 'M1 1AA', 'B33 8TH'],
	},

	germanpostcode: {
		type: 'custom',
		pattern: REGEX_PATTERNS.GERMAN_POSTCODE,
		description: 'German postcode',
		examples: ['10115', '80331', '20095'],
	},

	frenchpostcode: {
		type: 'custom',
		pattern: REGEX_PATTERNS.FRENCH_POSTCODE,
		description: 'French postcode',
		examples: ['75001', '69001', '13001'],
	},

	zipcode: {
		type: 'custom',
		pattern: REGEX_PATTERNS.US_ZIP_CODE,
		description: 'US ZIP code',
		examples: ['12345', '12345-6789'],
	},

	postalcode: {
		type: 'custom',
		pattern: REGEX_PATTERNS.CANADIAN_POSTAL_CODE,
		description: 'Canadian postal code',
		examples: ['K1A 0A6', 'M5V 3L9'],
	},

	// Basic patterns
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

	guid: {
		type: 'custom',
		pattern: REGEX_PATTERNS.UUID,
		description: 'GUID (Globally Unique Identifier)',
		examples: ['123e4567-e89b-12d3-a456-426614174000'],
	},

	hexcolor: {
		type: 'custom',
		pattern: REGEX_PATTERNS.HEX_COLOR,
		description: 'Hexadecimal color code',
		examples: ['#ff0000', '#f00'],
	},

	// Text patterns
	letters: {
		type: 'text',
		pattern: REGEX_PATTERNS.LETTERS_ONLY,
		description: 'Letters only (alphabetic characters)',
		examples: ['abc', 'Hello', 'World'],
	},

	text: {
		type: 'text',
		pattern: REGEX_PATTERNS.TEXT,
		description:
			'General text with letters, numbers, spaces, and common punctuation',
		examples: ['hello world', 'Hello, World!', 'This is text.'],
	},

	alphanumeric: {
		type: 'text',
		pattern: REGEX_PATTERNS.ALPHANUMERIC,
		description: 'Alphanumeric characters only (letters and numbers)',
		examples: ['abc123', 'Test123', 'user1'],
	},

	// Security patterns
	password: {
		type: 'custom',
		pattern: REGEX_PATTERNS.PASSWORD,
		description: 'Basic password (minimum 6 characters)',
		examples: ['password123', 'mypass'],
	},

	// Financial patterns
	creditcard: {
		type: 'custom',
		pattern: REGEX_PATTERNS.CREDIT_CARD,
		description: 'Credit card number',
		examples: ['4111111111111111', '5555555555554444'],
	},

	visa: {
		type: 'custom',
		pattern: REGEX_PATTERNS.VISA_CARD,
		description: 'Visa credit card number',
		examples: ['4111111111111111', '4012888888881881'],
	},

	mastercard: {
		type: 'custom',
		pattern: REGEX_PATTERNS.MASTERCARD,
		description: 'Mastercard credit card number',
		examples: ['5555555555554444', '5105105105105100'],
	},

	// User patterns
	username: {
		type: 'text',
		pattern: REGEX_PATTERNS.USERNAME,
		description: 'Username (3-20 characters, letters, numbers, underscores)',
		examples: ['user123', 'john_doe', 'admin'],
	},

	ssn: {
		type: 'custom',
		pattern: REGEX_PATTERNS.SSN,
		description: 'US Social Security Number',
		examples: ['123-45-6789', '987-65-4321'],
	},

	// File patterns
	fileextension: {
		type: 'custom',
		pattern: REGEX_PATTERNS.FILE_EXTENSION,
		description: 'File with extension',
		examples: ['document.pdf', 'image.jpg', 'script.js'],
	},

	imagefile: {
		type: 'custom',
		pattern: REGEX_PATTERNS.IMAGE_FILE,
		description: 'Image file',
		examples: ['photo.jpg', 'logo.png', 'icon.svg'],
	},

	documentfile: {
		type: 'custom',
		pattern: REGEX_PATTERNS.DOCUMENT_FILE,
		description: 'Document file',
		examples: ['report.pdf', 'letter.doc', 'notes.txt'],
	},
};

// Keyword mappings for human text recognition
export const PATTERN_KEYWORDS: Record<string, string[]> = {
	email: ['email', 'e-mail', 'mail address', '@'],
	phone: ['phone', 'telephone', 'mobile', 'cell'],
	url: ['url', 'link', 'website', 'http', 'https', 'web address'],
	date: ['date', 'yyyy-mm-dd', 'iso date'],
	number: ['number', 'numeric', 'digit', 'integer', 'decimal'],
	uuid: ['uuid', 'unique identifier'],
	guid: ['guid', 'globally unique identifier'],
	ipv4: ['ipv4', 'ipv4 address', 'ip v4', 'ip address'],
	hexcolor: ['color', 'hex', 'hexadecimal', '#', 'hex color'],
	letters: ['letters only', 'alphabetic', 'letters', 'alpha', 'word'],
	text: ['text', 'general text'],
	password: ['password', 'pass', 'pwd'],
	creditcard: ['credit card', 'creditcard', 'card number'],
	visa: ['visa card', 'visa'],
	mastercard: ['mastercard', 'master card'],
	username: ['username', 'user name', 'handle'],
	ssn: ['social security number', 'ssn', 'social security'],
	zipcode: ['zip code', 'zipcode', 'zip'],
	postalcode: [
		'canadian postal code',
		'canada postal code',
		'canadian postcode',
		'postal code',
		'postcode',
	],
	alphanumeric: [
		'alphanumeric',
		'alphanumeric characters',
		'letters and numbers',
	],
	// Network patterns (more specific first)
	ipv6: ['ipv6', 'ipv6 address', 'ip version 6', 'ip v6'],
	macaddress: ['mac address', 'mac', 'hardware address', 'physical address'],
	domain: ['domain', 'domain name', 'hostname'],
	// File patterns
	fileextension: ['file extension', 'file with extension', 'filename'],
	imagefile: ['image file', 'image', 'picture file', 'photo file'],
	documentfile: ['document file', 'document', 'text file'],
	// Time and data patterns (more specific first)
	timestamp: ['timestamp', 'unix timestamp', 'epoch time'],
	datetime: ['datetime', 'iso datetime', 'date time', 'timestamp iso'],
	time: ['time format', 'hh:mm', 'hour', 'minute', 'time'],
	// International postal codes (more specific first)
	ukpostcode: ['uk postcode', 'uk postal code', 'british postcode'],
	germanpostcode: ['german postcode', 'german postal code', 'germany postcode'],
	frenchpostcode: ['french postcode', 'french postal code', 'france postcode'],
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

/**
 * Creates a regex pattern that matches the start of a string.
 * @param text - The text to match at the beginning.
 * @returns A regex pattern string.
 */
export const STARTS_WITH = (text: string) =>
	`^${text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}`;

/**
 * Creates a regex pattern that matches the end of a string.
 * @param text - The text to match at the end.
 * @returns A regex pattern string.
 */
export const ENDS_WITH = (text: string) =>
	`${text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`;

/**
 * Creates a regex pattern that matches if a string contains the given text.
 * @param text - The text to search for within the string.
 * @returns A regex pattern string.
 */
export const CONTAINS = (text: string) =>
	`.*${text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}.*`;

/**
 * Creates a regex pattern for an exact length.
 * @param n - The exact number of characters.
 * @returns A regex pattern string.
 */
export const EXACT_LENGTH = (n: number) => `^.{${n}}$`;

/**
 * Creates a regex pattern for a minimum length.
 * @param n - The minimum number of characters.
 * @returns A regex pattern string.
 */
export const MIN_LENGTH = (n: number) => `^.{${n},}$`;

/**
 * Creates a regex pattern for a maximum length.
 * @param n - The maximum number of characters.
 *
 * @returns A regex pattern string.
 */
export const MAX_LENGTH = (n: number) => `^.{0,${n}}$`;

/**
 * Creates a regex pattern for a length within a given range.
 * @param min - The minimum number of characters.
 * @param max - The maximum number of characters.
 * @returns A regex pattern string.
 */
export const BETWEEN_LENGTH = (min: number, max: number) =>
	`^.{${min},${max}}$`;
