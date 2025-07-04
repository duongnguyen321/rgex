/**
 * RGex Configuration
 * Central configuration for the RGex library
 */

export const RGEX_CONFIG = {
	// Library metadata
	name: 'RGex',
	version: '1.0.0',
	description: 'A powerful, chainable regex builder platform',
	author: 'duongnguyen321',
	website: 'https://codetails.site',
	repository: 'https://github.com/duongnguyen321/rgex',

	// Default settings
	defaults: {
		passwordValidation: {
			minLength: 8,
			maxLength: 128,
			hasNumber: true,
			hasSpecial: true,
			hasUpperChar: true,
			hasLowerChar: true,
			hasSymbol: false,
			hasUnicode: false,
			noSequential: false,
			noRepeating: false,
			noCommonWords: false,
			customPattern: undefined,
		},

		humanTextConfidence: {
			high: 0.8,
			medium: 0.6,
			low: 0.4,
		},

		flags: {
			global: false,
			ignoreCase: false,
			multiline: false,
			dotAll: false,
			unicode: false,
			sticky: false,
		},
	},

	// Feature flags
	features: {
		humanTextParsing: true,
		advancedPasswordValidation: true,
		prebuiltPatterns: true,
		builderPattern: true,
		validationMethods: true,
	},

	// Error messages
	messages: {
		errors: {
			invalidPattern: 'Invalid regex pattern provided',
			unknownHumanText: 'Could not understand the text description',
			invalidCustomPattern: 'Invalid custom pattern in password validation',
			validationFailed: 'Validation failed for the provided input',
		},

		success: {
			patternExtracted: 'Successfully extracted pattern from human text',
			validationRulesExtracted: 'Successfully extracted validation rules',
			passwordAnalyzed: 'Password analysis completed',
		},
	},
} as const;

export type RGexConfig = typeof RGEX_CONFIG;
