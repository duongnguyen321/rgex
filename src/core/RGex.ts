/**
 * @class RGex
 * @classdesc The main class for building and manipulating regular expressions using a fluent, chainable API.
 * It also provides static methods for AI-powered text-to-regex and validation rule generation.
 */

import type {
	RegexBuilderOptions,
	PasswordValidationOptions,
	PasswordValidationResult,
	TextExtractionResult,
	ValidationExtractionResult,
} from '../../types/index.js';

import { REGEX_PATTERNS } from '../constants/patterns.js';
import { RGEX_CONFIG } from '../config/index.js';
import {
	escapeRegex,
	optionsToFlags,
	isValidRegex,
	normalizeText,
	calculateConfidence,
} from '../utils/helpers.js';
import {
	parseHumanTextToRegex,
	parseHumanTextToValidation,
	getPatternSuggestions,
} from '../utils/humanText.js';
import { validatePassword } from '../utils/password.js';

/**
 * Main RGex class with fluent API
 */
export class RGex {
	private pattern: string = '';
	private options: RegexBuilderOptions = {};

	/**
	 * Initializes a new instance of the RGex class.
	 * @param pattern - The initial regex pattern string.
	 * @param options - The initial regex options.
	 */
	constructor(pattern: string = '', options: RegexBuilderOptions = {}) {
		this.pattern = pattern;
		this.options = { ...RGEX_CONFIG.defaults.flags, ...options };
	}

	/**
	 * Creates a new RGex instance, providing a static entry point to the fluent API.
	 * @param pattern - The initial regex pattern.
	 * @param options - The regex options.
	 * @returns A new RGex instance.
	 */
	static create(pattern: string = '', options: RegexBuilderOptions = {}): RGex {
		return new RGex(pattern, options);
	}

	/**
	 * Converts a human-readable text description into a regex pattern.
	 * @param humanText - The natural language description of the pattern.
	 * @param testValue - An optional string to test the generated pattern against.
	 * @returns A result object containing the pattern and analysis.
	 */
	static toRegex(humanText: string, testValue?: string): TextExtractionResult {
		return parseHumanTextToRegex(humanText, testValue);
	}

	/**
	 * Converts a human-readable text description into a set of validation rules.
	 * @param humanText - The natural language description of the validation rules.
	 * @param testValue - An optional string to test the generated rules against.
	 * @returns A result object containing the validation rules.
	 */
	static toValidate(
		humanText: string,
		testValue?: string
	): ValidationExtractionResult {
		return parseHumanTextToValidation(humanText, testValue);
	}

	/**
	 * Gets pattern suggestions based on a human-readable text input.
	 * @param text - The input text to get suggestions for.
	 * @returns An array of suggested pattern keywords.
	 */
	static getSuggestions(text: string): string[] {
		return getPatternSuggestions(text);
	}

	/**
	 * Creates a new RGex instance from a human-readable text description.
	 * @param humanText - The natural language description of the pattern.
	 * @param testValue - An optional string to test the generated pattern against.
	 * @returns A new RGex instance.
	 */
	static humanText(humanText: string, testValue?: string): RGex {
		const result = parseHumanTextToRegex(humanText, testValue);

		if (result.success && result.pattern) {
			return new RGex(result.pattern.source, {
				global: result.pattern.global,
				ignoreCase: result.pattern.ignoreCase,
				multiline: result.pattern.multiline,
				dotAll: result.pattern.dotAll,
				unicode: result.pattern.unicode,
				sticky: result.pattern.sticky,
			});
		} else {
			// Return empty RGex if parsing failed, user can check isValid()
			return new RGex('(?!.*)', {}); // Pattern that never matches
		}
	}

	/**
	 * Replaces the current pattern with one generated from a human-readable text description.
	 * @param humanText - The natural language description of the pattern.
	 * @param testValue - An optional string to test the generated pattern against.
	 * @returns The current RGex instance for chaining.
	 */
	humanText(humanText: string, testValue?: string): RGex {
		const result = parseHumanTextToRegex(humanText, testValue);

		if (result.success && result.pattern) {
			this.pattern = result.pattern.source;
			// Preserve existing flags unless pattern has specific requirements
			return this;
		} else {
			// Set to non-matching pattern if parsing failed
			this.pattern = '(?!.*)'; // Pattern that never matches
			return this;
		}
	}

	// Builder Methods

	/**
	 * Appends a literal string to the pattern, escaping special regex characters.
	 * @param text - The literal string to append.
	 * @returns The current RGex instance for chaining.
	 */
	literal(text: string): RGex {
		this.pattern += escapeRegex(text);
		return this;
	}

	/**
	 * Appends a raw (unescaped) regex pattern string.
	 * @param pattern - The raw pattern string to append.
	 * @returns The current RGex instance for chaining.
	 */
	raw(pattern: string): RGex {
		this.pattern += pattern;
		return this;
	}

	/**
	 * Appends a character class to the pattern.
	 * @param chars - The characters to include in the class.
	 * @param negate - If true, creates a negated character class.
	 * @returns The current RGex instance for chaining.
	 */
	charClass(chars: string, negate: boolean = false): RGex {
		const escaped = chars.replace(/[\]\\^-]/g, '\\$&');
		this.pattern += negate ? `[^${escaped}]` : `[${escaped}]`;
		return this;
	}

	/**
	 * Appends a digit character class (\\d).
	 * @returns The current RGex instance for chaining.
	 */
	digit(): RGex {
		this.pattern += '\\d';
		return this;
	}

	/**
	 * Appends a word character class (\\w).
	 * @returns The current RGex instance for chaining.
	 */
	word(): RGex {
		this.pattern += '\\w';
		return this;
	}

	/**
	 * Appends a whitespace character class (\\s).
	 * @returns The current RGex instance for chaining.
	 */
	whitespace(): RGex {
		this.pattern += '\\s';
		return this;
	}

	/**
	 * Appends an "any character" pattern (.).
	 * @returns The current RGex instance for chaining.
	 */
	any(): RGex {
		this.pattern += '.';
		return this;
	}

	/**
	 * Adds a start-of-string anchor (^) to the beginning of the pattern.
	 * @returns The current RGex instance for chaining.
	 */
	start(): RGex {
		if (!this.pattern.startsWith('^')) {
			this.pattern = '^' + this.pattern;
		}
		return this;
	}

	/**
	 * Adds an end-of-string anchor ($) to the end of the pattern.
	 * @returns The current RGex instance for chaining.
	 */
	end(): RGex {
		if (!this.pattern.endsWith('$')) {
			this.pattern += '$';
		}
		return this;
	}

	/**
	 * Appends an OR operator (|) followed by another pattern.
	 * @param pattern - The alternative pattern.
	 * @returns The current RGex instance for chaining.
	 */
	or(pattern: string): RGex {
		this.pattern += `|${pattern}`;
		return this;
	}

	/**
	 * Appends a quantifier to the preceding element.
	 * @param min - The minimum number of repetitions.
	 * @param max - The maximum number of repetitions. Use Infinity for no upper limit.
	 * @returns The current RGex instance for chaining.
	 */
	quantifier(min: number, max?: number): RGex {
		if (max === undefined) {
			this.pattern += `{${min}}`;
		} else if (max === Infinity) {
			this.pattern += `{${min},}`;
		} else {
			this.pattern += `{${min},${max}}`;
		}
		return this;
	}

	/**
	 * Appends a zero-or-more quantifier (*).
	 * @returns The current RGex instance for chaining.
	 */
	zeroOrMore(): RGex {
		this.pattern += '*';
		return this;
	}

	/**
	 * Appends a one-or-more quantifier (+).
	 * @returns The current RGex instance for chaining.
	 */
	oneOrMore(): RGex {
		this.pattern += '+';
		return this;
	}

	/**
	 * Appends a zero-or-one quantifier (?).
	 * @returns The current RGex instance for chaining.
	 */
	optional(): RGex {
		this.pattern += '?';
		return this;
	}

	/**
	 * Wraps a pattern in a capturing group.
	 * @param pattern - The pattern to group.
	 * @returns The current RGex instance for chaining.
	 */
	group(pattern: string): RGex {
		this.pattern += `(${pattern})`;
		return this;
	}

	/**
	 * Wraps a pattern in a non-capturing group.
	 * @param pattern - The pattern to group.
	 * @returns The current RGex instance for chaining.
	 */
	nonCapturingGroup(pattern: string): RGex {
		this.pattern += `(?:${pattern})`;
		return this;
	}

	/**
	 * Appends a lookahead assertion.
	 * @param pattern - The pattern for the lookahead.
	 * @param negative - If true, creates a negative lookahead.
	 * @returns The current RGex instance for chaining.
	 */
	lookahead(pattern: string, negative: boolean = false): RGex {
		this.pattern += negative ? `(?!${pattern})` : `(?=${pattern})`;
		return this;
	}

	/**
	 * Appends a lookbehind assertion.
	 * @param pattern - The pattern for the lookbehind.
	 * @param negative - If true, creates a negative lookbehind.
	 * @returns The current RGex instance for chaining.
	 */
	lookbehind(pattern: string, negative: boolean = false): RGex {
		this.pattern += negative ? `(?<!${pattern})` : `(?<=${pattern})`;
		return this;
	}

	// Pre-built patterns

	/**
	 * Appends a pre-built email validation pattern.
	 * @returns The current RGex instance for chaining.
	 */
	email(): RGex {
		this.pattern += REGEX_PATTERNS.EMAIL;
		return this;
	}

	/**
	 * Appends a pre-built URL validation pattern.
	 * @returns The current RGex instance for chaining.
	 */
	url(): RGex {
		this.pattern += REGEX_PATTERNS.URL;
		return this;
	}

	/**
	 * Appends a pre-built phone number validation pattern.
	 * @returns The current RGex instance for chaining.
	 */
	phone(): RGex {
		this.pattern += REGEX_PATTERNS.PHONE;
		return this;
	}

	/**
	 * Appends a pre-built date (YYYY-MM-DD) validation pattern.
	 * @returns The current RGex instance for chaining.
	 */
	date(): RGex {
		this.pattern += REGEX_PATTERNS.DATE;
		return this;
	}

	/**
	 * Appends a pre-built time (HH:MM or HH:MM:SS) validation pattern.
	 * @returns The current RGex instance for chaining.
	 */
	time(): RGex {
		this.pattern += REGEX_PATTERNS.TIME;
		return this;
	}

	/**
	 * Appends a pre-built number (integer or decimal) validation pattern.
	 * @returns The current RGex instance for chaining.
	 */
	number(): RGex {
		this.pattern += REGEX_PATTERNS.DECIMAL;
		return this;
	}

	/**
	 * Appends a pre-built UUID validation pattern.
	 * @returns The current RGex instance for chaining.
	 */
	uuid(): RGex {
		this.pattern += REGEX_PATTERNS.UUID;
		return this;
	}

	/**
	 * Appends a pre-built IPv4 validation pattern.
	 * @returns The current RGex instance for chaining.
	 */
	ipv4(): RGex {
		this.pattern += REGEX_PATTERNS.IPV4;
		return this;
	}

	/**
	 * Appends a pre-built hex color code validation pattern.
	 * @returns The current RGex instance for chaining.
	 */
	hexColor(): RGex {
		this.pattern += REGEX_PATTERNS.HEX_COLOR;
		return this;
	}

	// Options and flags

	/**
	 * Enables or disables the global (g) flag.
	 * @param enabled - If true, the flag is enabled.
	 * @returns The current RGex instance for chaining.
	 */
	global(enabled: boolean = true): RGex {
		this.options.global = enabled;
		return this;
	}

	/**
	 * Enables or disables the ignore case (i) flag.
	 * @param enabled - If true, the flag is enabled.
	 * @returns The current RGex instance for chaining.
	 */
	ignoreCase(enabled: boolean = true): RGex {
		this.options.ignoreCase = enabled;
		return this;
	}

	/**
	 * Enables or disables the multiline (m) flag.
	 * @param enabled - If true, the flag is enabled.
	 * @returns The current RGex instance for chaining.
	 */
	multiline(enabled: boolean = true): RGex {
		this.options.multiline = enabled;
		return this;
	}

	/**
	 * Enables or disables the dotAll (s) flag.
	 * @param enabled - If true, the flag is enabled.
	 * @returns The current RGex instance for chaining.
	 */
	dotAll(enabled: boolean = true): RGex {
		this.options.dotAll = enabled;
		return this;
	}

	/**
	 * Enables or disables the unicode (u) flag.
	 * @param enabled - If true, the flag is enabled.
	 * @returns The current RGex instance for chaining.
	 */
	unicode(enabled: boolean = true): RGex {
		this.options.unicode = enabled;
		return this;
	}

	/**
	 * Enables or disables the sticky (y) flag.
	 * @param enabled - If true, the flag is enabled.
	 * @returns The current RGex instance for chaining.
	 */
	sticky(enabled: boolean = true): RGex {
		this.options.sticky = enabled;
		return this;
	}

	// Password validation method

	/**
	 * Performs advanced password validation using the current pattern as the password to test.
	 * @param options - The password validation criteria.
	 * @returns A result object with detailed analysis of the password's strength.
	 */
	passwordCase(
		options: PasswordValidationOptions = {}
	): PasswordValidationResult {
		// Use current pattern as test value if no pattern specified
		const testValue = this.pattern || '';
		return validatePassword(testValue, options);
	}

	// Utility methods

	/**
	 * Tests if the generated regex pattern matches a given string.
	 * @param input - The string to test.
	 * @returns True if the pattern matches, otherwise false.
	 */
	test(input: string): boolean {
		try {
			const regex = this.build();
			return regex.test(input);
		} catch {
			return false;
		}
	}

	/**
	 * Executes the regex pattern against a string and returns the match details.
	 * @param input - The string to execute the pattern on.
	 * @returns A `RegExpExecArray` if a match is found, otherwise null.
	 */
	exec(input: string): RegExpExecArray | null {
		try {
			const regex = this.build();
			return regex.exec(input);
		} catch {
			return null;
		}
	}

	/**
	 * Finds all matches of the pattern in a string.
	 * @param input - The string to search.
	 * @returns An array of matches, or null if no matches are found.
	 */
	match(input: string): string[] | null {
		try {
			const regex = this.build();
			return input.match(regex);
		} catch {
			return null;
		}
	}

	/**
	 * Replaces occurrences of the pattern in a string.
	 * @param input - The string to perform the replacement on.
	 * @param replacement - The string or function to use for replacement.
	 * @returns The modified string.
	 */
	replace(
		input: string,
		replacement: string | ((match: string, ...args: any[]) => string)
	): string {
		try {
			const regex = this.build();
			return input.replace(regex, replacement as any);
		} catch {
			return input;
		}
	}

	/**
	 * Splits a string using the regex pattern as a delimiter.
	 * @param input - The string to split.
	 * @returns An array of strings.
	 */
	split(input: string): string[] {
		try {
			const regex = this.build();
			return input.split(regex);
		} catch {
			return [input];
		}
	}

	/**
	 * Checks if the current regex pattern is syntactically valid.
	 * @returns True if the pattern is valid, otherwise false.
	 */
	isValid(): boolean {
		return isValidRegex(this.pattern);
	}

	/**
	 * Gets the raw regex pattern string.
	 * @returns The pattern string.
	 */
	getPattern(): string {
		return this.pattern;
	}

	/**
	 * Gets the flags string (e.g., "gi").
	 * @returns The flags string.
	 */
	getFlags(): string {
		return optionsToFlags(this.options);
	}

	/**
	 * Builds and returns the final `RegExp` object.
	 * @returns A `RegExp` object.
	 */
	build(): RegExp {
		const flags = optionsToFlags(this.options);
		return new RegExp(this.pattern, flags);
	}

	/**
	 * Creates a new RGex instance with the same pattern and options.
	 * @returns A new RGex instance.
	 */
	clone(): RGex {
		return new RGex(this.pattern, { ...this.options });
	}

	/**
	 * Resets the pattern and options to their initial state.
	 * @returns The current RGex instance for chaining.
	 */
	reset(): RGex {
		this.pattern = '';
		this.options = { ...RGEX_CONFIG.defaults.flags };
		return this;
	}

	/**
	 * Returns the string representation of the regex pattern.
	 * @returns The pattern string.
	 */
	toString(): string {
		const flags = optionsToFlags(this.options);
		return `/${this.pattern}/${flags}`;
	}

	/**
	 * Returns a JSON representation of the RGex instance.
	 * @returns An object containing the pattern, flags, and validity.
	 */
	toJSON(): { pattern: string; flags: string; valid: boolean } {
		return {
			pattern: this.pattern,
			flags: this.getFlags(),
			valid: this.isValid(),
		};
	}

	/**
	 * Creates a new RGex instance from a JSON object.
	 * @param json - An object containing the pattern and optional flags.
	 * @returns A new RGex instance.
	 * @throws Will throw an error if the pattern in the JSON is invalid.
	 */
	static fromJSON(json: { pattern: string; flags?: string }): RGex {
		if (!json || typeof json.pattern !== 'string') {
			throw new Error('Invalid JSON object provided for RGex.fromJSON');
		}

		if (!isValidRegex(json.pattern)) {
			throw new Error(`Invalid regex pattern provided: ${json.pattern}`);
		}

		const options: RegexBuilderOptions = {};
		if (json.flags) {
			if (json.flags.includes('g')) options.global = true;
			if (json.flags.includes('i')) options.ignoreCase = true;
			if (json.flags.includes('m')) options.multiline = true;
			if (json.flags.includes('s')) options.dotAll = true;
			if (json.flags.includes('u')) options.unicode = true;
			if (json.flags.includes('y')) options.sticky = true;
		}

		return new RGex(json.pattern, options);
	}

	// Static utility methods

	/**
	 * Escapes special characters in a string for use in a regex.
	 * @param text - The string to escape.
	 * @returns The escaped string.
	 */
	static escape(text: string): string {
		return escapeRegex(text);
	}

	/**
	 * Validates if a given string is a valid regex pattern.
	 * @param pattern - The pattern to validate.
	 * @returns True if the pattern is valid, otherwise false.
	 */
	static validate(pattern: string): boolean {
		return isValidRegex(pattern);
	}

	/**
	 * Normalizes text by converting to lowercase and removing extra whitespace.
	 * @param text - The text to normalize.
	 * @returns The normalized text.
	 */
	static normalize(text: string): string {
		return normalizeText(text);
	}

	// ============================================
	// SHORTER STATIC METHOD ALIASES
	// ============================================

	/**
	 * @deprecated Use RGex.toRegex instead.
	 * Alias for `RGex.toRegex`.
	 */
	static h2r = RGex.toRegex;

	/**
	 * @deprecated Use RGex.toValidate instead.
	 * Alias for `RGex.toValidate`.
	 */
	static h2v = RGex.toValidate;

	/**
	 * @deprecated Use RGex.humanText instead.
	 * Alias for `RGex.humanText`.
	 */
	static human = RGex.humanText;

	/**
	 * @deprecated Use RGex.getSuggestions instead.
	 * Alias for `RGex.getSuggestions`.
	 */
	static suggest = RGex.getSuggestions;
}
