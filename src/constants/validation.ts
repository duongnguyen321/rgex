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

	/**
	 * Creates a validation rule for a Social Security Number.
	 * @returns A validation rule object.
	 */
	ssn: (): ValidationRule => ({
		name: 'ssn',
		pattern: new RegExp(REGEX_PATTERNS.SSN),
		message: 'Please enter a valid Social Security Number (XXX-XX-XXXX)',
	}),

	/**
	 * Creates a validation rule for US ZIP codes.
	 * @returns A validation rule object.
	 */
	zipCode: (): ValidationRule => ({
		name: 'zipCode',
		pattern: new RegExp(REGEX_PATTERNS.US_ZIP_CODE),
		message: 'Please enter a valid ZIP code (12345 or 12345-6789)',
	}),

	/**
	 * Creates a validation rule for Canadian postal codes.
	 * @returns A validation rule object.
	 */
	postalCode: (): ValidationRule => ({
		name: 'postalCode',
		pattern: new RegExp(REGEX_PATTERNS.CANADIAN_POSTAL_CODE),
		message: 'Please enter a valid postal code (A1A 1A1)',
	}),

	/**
	 * Creates a validation rule for UK postcodes.
	 * @returns A validation rule object.
	 */
	ukPostcode: (): ValidationRule => ({
		name: 'ukPostcode',
		pattern: new RegExp(REGEX_PATTERNS.UK_POSTCODE),
		message: 'Please enter a valid UK postcode',
	}),

	/**
	 * Creates a validation rule for file extensions.
	 * @returns A validation rule object.
	 */
	fileExtension: (): ValidationRule => ({
		name: 'fileExtension',
		pattern: new RegExp(REGEX_PATTERNS.FILE_EXTENSION),
		message: 'Please enter a valid file with extension',
	}),

	/**
	 * Creates a validation rule for image files.
	 * @returns A validation rule object.
	 */
	imageFile: (): ValidationRule => ({
		name: 'imageFile',
		pattern: new RegExp(REGEX_PATTERNS.IMAGE_FILE),
		message: 'Please enter a valid image file (jpg, png, gif, etc.)',
	}),

	/**
	 * Creates a validation rule for document files.
	 * @returns A validation rule object.
	 */
	documentFile: (): ValidationRule => ({
		name: 'documentFile',
		pattern: new RegExp(REGEX_PATTERNS.DOCUMENT_FILE),
		message: 'Please enter a valid document file (pdf, doc, txt, etc.)',
	}),

	/**
	 * Creates a validation rule for timestamps.
	 * @returns A validation rule object.
	 */
	timestamp: (): ValidationRule => ({
		name: 'timestamp',
		pattern: new RegExp(REGEX_PATTERNS.TIMESTAMP),
		message: 'Please enter a valid timestamp',
	}),

	/**
	 * Creates a validation rule for ISO datetime format.
	 * @returns A validation rule object.
	 */
	isoDateTime: (): ValidationRule => ({
		name: 'isoDateTime',
		pattern: new RegExp(REGEX_PATTERNS.ISO_DATETIME),
		message: 'Please enter a valid ISO datetime (YYYY-MM-DDTHH:mm:ss.sssZ)',
	}),

	/**
	 * Creates a validation rule for Visa credit cards.
	 * @returns A validation rule object.
	 */
	visaCard: (): ValidationRule => ({
		name: 'visaCard',
		pattern: new RegExp(REGEX_PATTERNS.VISA_CARD),
		message: 'Please enter a valid Visa card number',
	}),

	/**
	 * Creates a validation rule for Mastercard credit cards.
	 * @returns A validation rule object.
	 */
	masterCard: (): ValidationRule => ({
		name: 'masterCard',
		pattern: new RegExp(REGEX_PATTERNS.MASTERCARD),
		message: 'Please enter a valid Mastercard number',
	}),

	/**
	 * Creates a validation rule for American Express credit cards.
	 * @returns A validation rule object.
	 */
	amexCard: (): ValidationRule => ({
		name: 'amexCard',
		pattern: new RegExp(REGEX_PATTERNS.AMEX),
		message: 'Please enter a valid American Express card number',
	}),

	/**
	 * Creates a validation rule for MAC addresses.
	 * @returns A validation rule object.
	 */
	macAddress: (): ValidationRule => ({
		name: 'macAddress',
		pattern: new RegExp(REGEX_PATTERNS.MAC_ADDRESS),
		message: 'Please enter a valid MAC address (XX:XX:XX:XX:XX:XX)',
	}),

	/**
	 * Creates a validation rule for Bitcoin addresses.
	 * @returns A validation rule object.
	 */
	bitcoinAddress: (): ValidationRule => ({
		name: 'bitcoinAddress',
		pattern: new RegExp(REGEX_PATTERNS.BITCOIN_ADDRESS),
		message: 'Please enter a valid Bitcoin address',
	}),

	/**
	 * Creates a validation rule for Ethereum addresses.
	 * @returns A validation rule object.
	 */
	ethereumAddress: (): ValidationRule => ({
		name: 'ethereumAddress',
		pattern: new RegExp(REGEX_PATTERNS.ETHEREUM_ADDRESS),
		message: 'Please enter a valid Ethereum address',
	}),

	/**
	 * Creates a validation rule for IBAN codes.
	 * @returns A validation rule object.
	 */
	iban: (): ValidationRule => ({
		name: 'iban',
		pattern: new RegExp(REGEX_PATTERNS.IBAN),
		message: 'Please enter a valid IBAN code',
	}),

	/**
	 * Creates a validation rule for SWIFT/BIC codes.
	 * @returns A validation rule object.
	 */
	swiftCode: (): ValidationRule => ({
		name: 'swiftCode',
		pattern: new RegExp(REGEX_PATTERNS.SWIFT_CODE),
		message: 'Please enter a valid SWIFT/BIC code',
	}),

	/**
	 * Creates a validation rule for ISBN-10 codes.
	 * @returns A validation rule object.
	 */
	isbn10: (): ValidationRule => ({
		name: 'isbn10',
		pattern: new RegExp(REGEX_PATTERNS.ISBN_10),
		message: 'Please enter a valid ISBN-10 code',
	}),

	/**
	 * Creates a validation rule for ISBN-13 codes.
	 * @returns A validation rule object.
	 */
	isbn13: (): ValidationRule => ({
		name: 'isbn13',
		pattern: new RegExp(REGEX_PATTERNS.ISBN_13),
		message: 'Please enter a valid ISBN-13 code',
	}),

	/**
	 * Creates a validation rule for semantic version numbers.
	 * @returns A validation rule object.
	 */
	semver: (): ValidationRule => ({
		name: 'semver',
		pattern: new RegExp(REGEX_PATTERNS.SEMVER),
		message: 'Please enter a valid semantic version (X.Y.Z)',
	}),

	/**
	 * Creates a validation rule for JWT tokens.
	 * @returns A validation rule object.
	 */
	jwtToken: (): ValidationRule => ({
		name: 'jwtToken',
		pattern: new RegExp(REGEX_PATTERNS.JWT_TOKEN),
		message: 'Please enter a valid JWT token',
	}),

	/**
	 * Creates a validation rule for GitHub usernames.
	 * @returns A validation rule object.
	 */
	githubUsername: (): ValidationRule => ({
		name: 'githubUsername',
		pattern: new RegExp(REGEX_PATTERNS.GITHUB_USERNAME, 'i'),
		message: 'Please enter a valid GitHub username',
	}),

	/**
	 * Creates a validation rule for Twitter handles.
	 * @returns A validation rule object.
	 */
	twitterHandle: (): ValidationRule => ({
		name: 'twitterHandle',
		pattern: new RegExp(REGEX_PATTERNS.TWITTER_HANDLE),
		message: 'Please enter a valid Twitter handle (max 15 characters)',
	}),

	/**
	 * Creates a validation rule for Discord user IDs.
	 * @returns A validation rule object.
	 */
	discordId: (): ValidationRule => ({
		name: 'discordId',
		pattern: new RegExp(REGEX_PATTERNS.DISCORD_ID),
		message: 'Please enter a valid Discord user ID',
	}),

	/**
	 * Creates a validation rule for YouTube video IDs.
	 * @returns A validation rule object.
	 */
	youtubeVideoId: (): ValidationRule => ({
		name: 'youtubeVideoId',
		pattern: new RegExp(REGEX_PATTERNS.YOUTUBE_VIDEO_ID),
		message: 'Please enter a valid YouTube video ID',
	}),

	/**
	 * Creates a validation rule for Google Drive file IDs.
	 * @returns A validation rule object.
	 */
	googleDriveId: (): ValidationRule => ({
		name: 'googleDriveId',
		pattern: new RegExp(REGEX_PATTERNS.GOOGLE_DRIVE_ID),
		message: 'Please enter a valid Google Drive file ID',
	}),

	/**
	 * Creates a validation rule for AWS S3 bucket names.
	 * @returns A validation rule object.
	 */
	s3BucketName: (): ValidationRule => ({
		name: 's3BucketName',
		pattern: new RegExp(REGEX_PATTERNS.AWS_S3_BUCKET),
		message: 'Please enter a valid S3 bucket name (3-63 chars, lowercase)',
	}),

	/**
	 * Creates a validation rule for Docker image names.
	 * @returns A validation rule object.
	 */
	dockerImage: (): ValidationRule => ({
		name: 'dockerImage',
		pattern: new RegExp(REGEX_PATTERNS.DOCKER_IMAGE),
		message: 'Please enter a valid Docker image name',
	}),

	/**
	 * Creates a validation rule for NPM package names.
	 * @returns A validation rule object.
	 */
	npmPackage: (): ValidationRule => ({
		name: 'npmPackage',
		pattern: new RegExp(REGEX_PATTERNS.NPM_PACKAGE),
		message: 'Please enter a valid NPM package name',
	}),

	/**
	 * Creates a validation rule for Git commit hashes (SHA-1).
	 * @returns A validation rule object.
	 */
	gitCommit: (): ValidationRule => ({
		name: 'gitCommit',
		pattern: new RegExp(REGEX_PATTERNS.GIT_COMMIT, 'i'),
		message: 'Please enter a valid Git commit hash',
	}),

	/**
	 * Creates a validation rule for Kubernetes resource names.
	 * @returns A validation rule object.
	 */
	k8sResourceName: (): ValidationRule => ({
		name: 'k8sResourceName',
		pattern: new RegExp(REGEX_PATTERNS.K8S_RESOURCE_NAME),
		message: 'Please enter a valid Kubernetes resource name',
	}),

	/**
	 * Creates a validation rule for LinkedIn profile URLs.
	 * @returns A validation rule object.
	 */
	linkedinProfile: (): ValidationRule => ({
		name: 'linkedinProfile',
		pattern: new RegExp(REGEX_PATTERNS.LINKEDIN_PROFILE),
		message: 'Please enter a valid LinkedIn profile URL',
	}),

	/**
	 * Creates a validation rule for Slack user IDs.
	 * @returns A validation rule object.
	 */
	slackUserId: (): ValidationRule => ({
		name: 'slackUserId',
		pattern: new RegExp(REGEX_PATTERNS.SLACK_USER_ID),
		message: 'Please enter a valid Slack user ID',
	}),

	/**
	 * Creates a validation rule for Twilio phone numbers (E.164 format).
	 * @returns A validation rule object.
	 */
	e164Phone: (): ValidationRule => ({
		name: 'e164Phone',
		pattern: new RegExp(REGEX_PATTERNS.E164_PHONE),
		message: 'Please enter a valid E.164 phone number (+1234567890)',
	}),

	/**
	 * Creates a validation rule for Firebase project IDs.
	 * @returns A validation rule object.
	 */
	firebaseProjectId: (): ValidationRule => ({
		name: 'firebaseProjectId',
		pattern: new RegExp(REGEX_PATTERNS.FIREBASE_PROJECT_ID),
		message: 'Please enter a valid Firebase project ID',
	}),

	/**
	 * Creates a validation rule for Azure resource group names.
	 * @returns A validation rule object.
	 */
	azureResourceGroup: (): ValidationRule => ({
		name: 'azureResourceGroup',
		pattern: new RegExp(REGEX_PATTERNS.AZURE_RESOURCE_GROUP),
		message: 'Please enter a valid Azure resource group name',
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
	ssn: VALIDATION_PATTERNS.ssn,
	'social security': VALIDATION_PATTERNS.ssn,
	'social security number': VALIDATION_PATTERNS.ssn,
	'zip code': VALIDATION_PATTERNS.zipCode,
	'postal code': VALIDATION_PATTERNS.postalCode,
	'uk postcode': VALIDATION_PATTERNS.ukPostcode,
	'file extension': VALIDATION_PATTERNS.fileExtension,
	'image file': VALIDATION_PATTERNS.imageFile,
	'document file': VALIDATION_PATTERNS.documentFile,
	timestamp: VALIDATION_PATTERNS.timestamp,
	'iso datetime': VALIDATION_PATTERNS.isoDateTime,
	'visa card': VALIDATION_PATTERNS.visaCard,
	mastercard: VALIDATION_PATTERNS.masterCard,
	'master card': VALIDATION_PATTERNS.masterCard,
	'amex card': VALIDATION_PATTERNS.amexCard,
	'american express': VALIDATION_PATTERNS.amexCard,
	'mac address': VALIDATION_PATTERNS.macAddress,
	'bitcoin address': VALIDATION_PATTERNS.bitcoinAddress,
	bitcoin: VALIDATION_PATTERNS.bitcoinAddress,
	'ethereum address': VALIDATION_PATTERNS.ethereumAddress,
	ethereum: VALIDATION_PATTERNS.ethereumAddress,
	iban: VALIDATION_PATTERNS.iban,
	'swift code': VALIDATION_PATTERNS.swiftCode,
	'bic code': VALIDATION_PATTERNS.swiftCode,
	'isbn 10': VALIDATION_PATTERNS.isbn10,
	isbn10: VALIDATION_PATTERNS.isbn10,
	'isbn 13': VALIDATION_PATTERNS.isbn13,
	isbn13: VALIDATION_PATTERNS.isbn13,
	semver: VALIDATION_PATTERNS.semver,
	'semantic version': VALIDATION_PATTERNS.semver,
	'jwt token': VALIDATION_PATTERNS.jwtToken,
	jwt: VALIDATION_PATTERNS.jwtToken,
	'github username': VALIDATION_PATTERNS.githubUsername,
	'twitter handle': VALIDATION_PATTERNS.twitterHandle,
	twitter: VALIDATION_PATTERNS.twitterHandle,
	'discord id': VALIDATION_PATTERNS.discordId,
	discord: VALIDATION_PATTERNS.discordId,
	'youtube video id': VALIDATION_PATTERNS.youtubeVideoId,
	'youtube id': VALIDATION_PATTERNS.youtubeVideoId,
	'google drive id': VALIDATION_PATTERNS.googleDriveId,
	's3 bucket': VALIDATION_PATTERNS.s3BucketName,
	's3 bucket name': VALIDATION_PATTERNS.s3BucketName,
	'docker image': VALIDATION_PATTERNS.dockerImage,
	'npm package': VALIDATION_PATTERNS.npmPackage,
	'git commit': VALIDATION_PATTERNS.gitCommit,
	'commit hash': VALIDATION_PATTERNS.gitCommit,
	'k8s resource': VALIDATION_PATTERNS.k8sResourceName,
	'kubernetes resource': VALIDATION_PATTERNS.k8sResourceName,
	'linkedin profile': VALIDATION_PATTERNS.linkedinProfile,
	linkedin: VALIDATION_PATTERNS.linkedinProfile,
	'slack user id': VALIDATION_PATTERNS.slackUserId,
	'slack id': VALIDATION_PATTERNS.slackUserId,
	'e164 phone': VALIDATION_PATTERNS.e164Phone,
	'international phone': VALIDATION_PATTERNS.e164Phone,
	'firebase project id': VALIDATION_PATTERNS.firebaseProjectId,
	firebase: VALIDATION_PATTERNS.firebaseProjectId,
	'azure resource group': VALIDATION_PATTERNS.azureResourceGroup,
	azure: VALIDATION_PATTERNS.azureResourceGroup,
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
