/**
 * RGex Core Class
 * Main regex builder with fluent API and AI-powered features
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

	constructor(pattern: string = '', options: RegexBuilderOptions = {}) {
		this.pattern = pattern;
		this.options = { ...RGEX_CONFIG.defaults.flags, ...options };
	}

	/**
	 * Create a new RGex instance
	 */
	static create(pattern: string = '', options: RegexBuilderOptions = {}): RGex {
		return new RGex(pattern, options);
	}

	/**
	 * Convert human text to regex pattern (Static method)
	 */
	static toRegex(humanText: string, testValue?: string): TextExtractionResult {
		return parseHumanTextToRegex(humanText, testValue);
	}

	/**
	 * Convert human text to validation rules (Static method)
	 */
	static toValidate(
		humanText: string,
		testValue?: string
	): ValidationExtractionResult {
		return parseHumanTextToValidation(humanText, testValue);
	}

	/**
	 * Get pattern suggestions for human text
	 */
	static getSuggestions(text: string): string[] {
		return getPatternSuggestions(text);
	}

	/**
	 * Create RGex instance from human text description (Static method)
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
	 * Replace current pattern with human text description (Instance method)
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
	 * Add literal text (escaped)
	 */
	literal(text: string): RGex {
		this.pattern += escapeRegex(text);
		return this;
	}

	/**
	 * Add raw regex pattern
	 */
	raw(pattern: string): RGex {
		this.pattern += pattern;
		return this;
	}

	/**
	 * Add character class
	 */
	charClass(chars: string, negate: boolean = false): RGex {
		const escaped = chars.replace(/[\]\\^-]/g, '\\$&');
		this.pattern += negate ? `[^${escaped}]` : `[${escaped}]`;
		return this;
	}

	/**
	 * Add digit pattern
	 */
	digit(): RGex {
		this.pattern += '\\d';
		return this;
	}

	/**
	 * Add word character pattern
	 */
	word(): RGex {
		this.pattern += '\\w';
		return this;
	}

	/**
	 * Add whitespace pattern
	 */
	whitespace(): RGex {
		this.pattern += '\\s';
		return this;
	}

	/**
	 * Add any character pattern
	 */
	any(): RGex {
		this.pattern += '.';
		return this;
	}

	/**
	 * Add start anchor
	 */
	start(): RGex {
		if (!this.pattern.startsWith('^')) {
			this.pattern = '^' + this.pattern;
		}
		return this;
	}

	/**
	 * Add end anchor
	 */
	end(): RGex {
		if (!this.pattern.endsWith('$')) {
			this.pattern += '$';
		}
		return this;
	}

	/**
	 * Add OR operator
	 */
	or(pattern: string): RGex {
		this.pattern += `|${pattern}`;
		return this;
	}

	/**
	 * Add quantifiers
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
	 * Zero or more
	 */
	zeroOrMore(): RGex {
		this.pattern += '*';
		return this;
	}

	/**
	 * One or more
	 */
	oneOrMore(): RGex {
		this.pattern += '+';
		return this;
	}

	/**
	 * Zero or one (optional)
	 */
	optional(): RGex {
		this.pattern += '?';
		return this;
	}

	/**
	 * Add group (capturing)
	 */
	group(pattern: string): RGex {
		this.pattern += `(${pattern})`;
		return this;
	}

	/**
	 * Add non-capturing group
	 */
	nonCapturingGroup(pattern: string): RGex {
		this.pattern += `(?:${pattern})`;
		return this;
	}

	/**
	 * Add lookahead
	 */
	lookahead(pattern: string, negative: boolean = false): RGex {
		this.pattern += negative ? `(?!${pattern})` : `(?=${pattern})`;
		return this;
	}

	/**
	 * Add lookbehind
	 */
	lookbehind(pattern: string, negative: boolean = false): RGex {
		this.pattern += negative ? `(?<!${pattern})` : `(?<=${pattern})`;
		return this;
	}

	// Pre-built patterns

	/**
	 * Email pattern
	 */
	email(): RGex {
		this.pattern += REGEX_PATTERNS.EMAIL;
		return this;
	}

	/**
	 * URL pattern
	 */
	url(): RGex {
		this.pattern += REGEX_PATTERNS.URL;
		return this;
	}

	/**
	 * Phone pattern
	 */
	phone(): RGex {
		this.pattern += REGEX_PATTERNS.PHONE;
		return this;
	}

	/**
	 * Date pattern (YYYY-MM-DD)
	 */
	date(): RGex {
		this.pattern += REGEX_PATTERNS.DATE;
		return this;
	}

	/**
	 * Time pattern (HH:MM or HH:MM:SS)
	 */
	time(): RGex {
		this.pattern += REGEX_PATTERNS.TIME;
		return this;
	}

	/**
	 * Number pattern (integer or decimal)
	 */
	number(): RGex {
		this.pattern += REGEX_PATTERNS.DECIMAL;
		return this;
	}

	/**
	 * UUID pattern
	 */
	uuid(): RGex {
		this.pattern += REGEX_PATTERNS.UUID;
		return this;
	}

	/**
	 * IPv4 pattern
	 */
	ipv4(): RGex {
		this.pattern += REGEX_PATTERNS.IPV4;
		return this;
	}

	/**
	 * Hex color pattern
	 */
	hexColor(): RGex {
		this.pattern += REGEX_PATTERNS.HEX_COLOR;
		return this;
	}

	// Options and flags

	/**
	 * Set global flag
	 */
	global(enabled: boolean = true): RGex {
		this.options.global = enabled;
		return this;
	}

	/**
	 * Set case insensitive flag
	 */
	ignoreCase(enabled: boolean = true): RGex {
		this.options.ignoreCase = enabled;
		return this;
	}

	/**
	 * Set multiline flag
	 */
	multiline(enabled: boolean = true): RGex {
		this.options.multiline = enabled;
		return this;
	}

	/**
	 * Set dotAll flag
	 */
	dotAll(enabled: boolean = true): RGex {
		this.options.dotAll = enabled;
		return this;
	}

	/**
	 * Set unicode flag
	 */
	unicode(enabled: boolean = true): RGex {
		this.options.unicode = enabled;
		return this;
	}

	/**
	 * Set sticky flag
	 */
	sticky(enabled: boolean = true): RGex {
		this.options.sticky = enabled;
		return this;
	}

	// Password validation method

	/**
	 * Advanced password validation with comprehensive analysis
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
	 * Test the pattern against a string
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
	 * Execute the pattern against a string
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
	 * Find all matches
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
	 * Replace matches
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
	 * Split string by pattern
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
	 * Check if pattern is valid
	 */
	isValid(): boolean {
		return isValidRegex(this.pattern);
	}

	/**
	 * Get the pattern string
	 */
	getPattern(): string {
		return this.pattern;
	}

	/**
	 * Get the flags string
	 */
	getFlags(): string {
		return optionsToFlags(this.options);
	}

	/**
	 * Build the final RegExp object
	 */
	build(): RegExp {
		const flags = optionsToFlags(this.options);
		return new RegExp(this.pattern, flags);
	}

	/**
	 * Clone the current instance
	 */
	clone(): RGex {
		return new RGex(this.pattern, { ...this.options });
	}

	/**
	 * Reset the pattern and options
	 */
	reset(): RGex {
		this.pattern = '';
		this.options = { ...RGEX_CONFIG.defaults.flags };
		return this;
	}

	/**
	 * Convert to string representation
	 */
	toString(): string {
		const flags = optionsToFlags(this.options);
		return `/${this.pattern}/${flags}`;
	}

	/**
	 * Convert to JSON representation
	 */
	toJSON(): { pattern: string; flags: string; valid: boolean } {
		return {
			pattern: this.pattern,
			flags: this.getFlags(),
			valid: this.isValid(),
		};
	}

	/**
	 * Create from JSON representation
	 */
	static fromJSON(json: { pattern: string; flags?: string }): RGex {
		const rgex = new RGex(json.pattern);

		if (json.flags) {
			for (const flag of json.flags) {
				switch (flag) {
					case 'g':
						rgex.global();
						break;
					case 'i':
						rgex.ignoreCase();
						break;
					case 'm':
						rgex.multiline();
						break;
					case 's':
						rgex.dotAll();
						break;
					case 'u':
						rgex.unicode();
						break;
					case 'y':
						rgex.sticky();
						break;
				}
			}
		}

		return rgex;
	}

	// Static utility methods

	/**
	 * Escape a string for use in regex
	 */
	static escape(text: string): string {
		return escapeRegex(text);
	}

	/**
	 * Validate a regex pattern
	 */
	static validate(pattern: string): boolean {
		return isValidRegex(pattern);
	}

	/**
	 * Normalize text for processing
	 */
	static normalize(text: string): string {
		return normalizeText(text);
	}

	// ============================================
	// SHORTER STATIC METHOD ALIASES
	// ============================================

	/**
	 * Short alias for toRegex
	 */
	static h2r = RGex.toRegex;

	/**
	 * Short alias for toValidate
	 */
	static h2v = RGex.toValidate;

	/**
	 * Short alias for humanText
	 */
	static human = RGex.humanText;

	/**
	 * Short alias for getSuggestions
	 */
	static suggest = RGex.getSuggestions;
}
