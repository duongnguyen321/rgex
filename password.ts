/**
 * @fileoverview Password Entry Point - Exports only password validation functions for minimal bundle size
 * @module Password Validation
 * @category Utilities
 * @group Password Validation
 * @author duongnguyen321 - https://duonguyen.site
 */
export type {
	PasswordValidationOptions,
	PasswordValidationResult,
} from './types/index.js';
export {
	validatePassword,
	hasSequentialChars,
	hasRepeatingChars,
	hasCommonWords,
	getPasswordSuggestions,
	generateStrongPassword,
} from './src/utils/password.js';
