/**
 * RGex - Type Definitions
 */

export interface RegexBuilderOptions {
	flags?: string;
	global?: boolean;
	ignoreCase?: boolean;
	multiline?: boolean;
	dotAll?: boolean;
	unicode?: boolean;
	sticky?: boolean;
}

export interface PasswordValidationOptions {
	minLength?: number;
	maxLength?: number;
	hasNumber?: boolean;
	hasSpecial?: boolean;
	hasUpperChar?: boolean;
	hasLowerChar?: boolean;
	hasSymbol?: boolean;
	hasUnicode?: boolean;
	noSequential?: boolean;
	noRepeating?: boolean;
	noCommonWords?: boolean;
	customPattern?: string;
}

export interface PasswordValidationResult {
	error: {
		message: string;
		requirements: string[];
	} | null;
	pass: {
		length: { passed: boolean; required: boolean; message: string };
		hasNumber: { passed: boolean; required: boolean; message: string };
		hasSpecial: { passed: boolean; required: boolean; message: string };
		hasUpperChar: { passed: boolean; required: boolean; message: string };
		hasLowerChar: { passed: boolean; required: boolean; message: string };
		hasSymbol: { passed: boolean; required: boolean; message: string };
		hasUnicode: { passed: boolean; required: boolean; message: string };
		noSequential: { passed: boolean; required: boolean; message: string };
		noRepeating: { passed: boolean; required: boolean; message: string };
		noCommonWords: { passed: boolean; required: boolean; message: string };
		customPattern: { passed: boolean; required: boolean; message: string };
	};
	score: number; // 0-100
	strength: 'very-weak' | 'weak' | 'fair' | 'good' | 'strong' | 'very-strong';
}

export interface HumanTextPattern {
	type:
		| 'email'
		| 'phone'
		| 'url'
		| 'date'
		| 'time'
		| 'number'
		| 'text'
		| 'custom';
	pattern: string;
	description: string;
	examples: string[];
}

export interface ValidationRule {
	name: string;
	pattern: RegExp;
	message: string;
	validator?: (value: string) => boolean;
}

export interface TextExtractionResult {
	success: boolean;
	pattern?: RegExp;
	description?: string;
	confidence: number;
	suggestions?: string[];
	error?: string;
}

export interface ValidationExtractionResult {
	success: boolean;
	rules?: ValidationRule[];
	description?: string;
	confidence: number;
	suggestions?: string[];
	error?: string;
}
