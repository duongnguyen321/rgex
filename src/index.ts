/**
 * # RGex - Powerful Regex Builder Platform
 *
 * A comprehensive, chainable regex builder with AI-powered natural language processing,
 * advanced pattern matching, and extensive validation capabilities.
 *
 * ## 🚀 Core Features
 *
 * ### 1. **RGex Builder Class**
 * Chainable regex construction with fluent API:
 * ```typescript
 * const emailRegex = new RGex()
 *   .startsWith()
 *   .oneOrMore('[a-zA-Z0-9._%+-]')
 *   .literal('@')
 *   .oneOrMore('[a-zA-Z0-9.-]')
 *   .literal('.')
 *   .between(2, 4, '[a-zA-Z]')
 *   .endsWith()
 *   .build();
 * ```
 *
 * ### 2. **Natural Language Processing (T2R & T2V)**
 * Convert human text to regex patterns and validation rules:
 *
 * #### Text-to-Regex (T2R)
 * ```typescript
 * // Simple patterns
 * t2r("email address") // Returns comprehensive email regex
 * t2r("phone number") // Returns phone number regex
 * t2r("starts with hello") // Returns /^hello/
 *
 * // Complex business patterns
 * t2r("Employee ID with department prefix and 4 digit number")
 * // Returns: /^[A-Z]{2,4}-\d{4}$/
 *
 * t2r("Invoice number with year and sequential number")
 * // Returns: /^INV-(20\d{2})-\d{6}$/
 *
 * t2r("API key with prefix and 32 character hex string")
 * // Returns: /^sk_[0-9a-f]{32}$/
 * ```
 *
 * #### Text-to-Validation (T2V)
 * ```typescript
 * // Password validation
 * t2v("strong password") // Returns comprehensive password validator
 * t2v("password with 2 uppercase 2 lowercase 2 numbers 2 special chars")
 *
 * // Business validation
 * t2v("business email address") // Excludes free providers
 * t2v("phone number US format") // Validates US phone formats
 * ```
 *
 * ### 3. **Advanced Pattern Categories**
 *
 * #### 🏢 Business & Professional
 * - Employee IDs with department prefixes
 * - Invoice numbers with year sequences
 * - Product SKUs with category codes
 * - Customer reference numbers
 *
 * #### 🔐 Security & Authentication
 * - Two-factor authentication codes
 * - API keys with prefixes
 * - JWT tokens with base64 parts
 * - Session tokens and UUIDs
 *
 * #### 💰 Financial & Banking
 * - IBAN codes with country validation
 * - Bitcoin addresses with base58 encoding
 * - SWIFT codes with bank identifiers
 * - Credit card numbers with Luhn validation
 *
 * #### 🏥 Healthcare Identifiers
 * - Medical record numbers
 * - Prescription numbers
 * - NPI healthcare provider numbers
 * - Patient ID formats
 *
 * #### 🎓 Educational Systems
 * - Student IDs with year prefixes
 * - Course codes with departments
 * - Grade formats with modifiers
 * - Academic year patterns
 *
 * #### 🚗 Transportation
 * - License plates by region
 * - Flight numbers with airlines
 * - Tracking numbers for carriers
 * - Vehicle identification numbers
 *
 * #### 💻 Technology & Development
 * - Docker image tags
 * - Kubernetes pod names
 * - Git commit hashes
 * - Semantic version numbers
 *
 * #### 🌍 International Support
 * - Unicode text patterns
 * - International names with accents
 * - Multi-language content validation
 * - Regional format variations
 *
 * ### 4. **Password Validation System**
 * ```typescript
 * // Comprehensive password validation
 * const result = validatePassword("MySecure123!");
 * // Returns: { isValid: true, score: 85, suggestions: [...] }
 *
 * // Generate strong passwords
 * const strongPassword = generateStrongPassword();
 * // Returns: "Kp9#mN2$vL8@qR5!"
 * ```
 *
 * ### 5. **Pattern Utilities**
 * ```typescript
 * // Escape special regex characters
 * escapeRegex("Hello (world)!") // "Hello \\(world\\)!"
 *
 * // Validate regex patterns
 * isValidRegex("^[a-z]+$") // true
 *
 * // Calculate pattern complexity
 * calculatePatternComplexity("^(?=.*[A-Z])(?=.*[a-z])(?=.*\\d).+$") // 0.75
 *
 * // Extract numbers from text
 * extractNumbers("Order #12345 costs $67.89") // [12345, 67.89]
 * ```
 *
 * ## 📊 Test Coverage
 * - **Total Tests**: 148+ comprehensive tests
 * - **Core RGex**: 114 tests for builder functionality
 * - **Human Text**: 23 tests for natural language processing
 * - **Combined Patterns**: 11 tests for complex multi-requirement patterns
 * - **Success Rate**: 100% passing
 *
 * ## 🔧 Advanced Usage
 *
 * ### Chaining Multiple Conditions
 * ```typescript
 * // Complex business validation
 * const pattern = t2r("Employee ID with department prefix and 4 digit number");
 * const validation = t2v("Employee ID with department prefix and 4 digit number");
 *
 * // Test the pattern
 * console.log(pattern.test("HR-1234")); // true
 * console.log(pattern.test("INVALID")); // false
 * ```
 *
 * ### Custom Pattern Suggestions
 * ```typescript
 * // Get pattern suggestions
 * const suggestions = getPatternSuggestions("phone");
 * // Returns: ["phone number", "phone number US format", "international phone"]
 *
 * // Get password suggestions
 * const pwdSuggestions = getPasswordSuggestions("weak123");
 * // Returns: ["Add uppercase letters", "Add special characters", ...]
 * ```
 *
 * ### International Support
 * ```typescript
 * // Unicode text validation
 * t2r("unicode text with letters numbers and punctuation")
 * // Supports: "Hello 世界! 123", "Café résumé naïve", "Москва Россия"
 *
 * // International names
 * t2r("international names with optional middle initial")
 * // Supports: "José María García", "李 小明", "John F. Kennedy"
 * ```
 *
 * ## 🎯 Performance Optimized
 * - **Bun Runtime**: Optimized for maximum performance
 * - **Pattern Caching**: Efficient regex compilation and reuse
 * - **Modular Architecture**: Tree-shaking friendly imports
 * - **Memory Efficient**: Minimal memory footprint
 *
 * ## 📚 Documentation Links
 * - **GitHub**: https://github.com/duongnguyen321/rgex
 * - **NPM**: https://www.npmjs.com/package/rgex
 * - **T2R & T2V Guide**: https://github.com/duongnguyen321/rgex/blob/main/T2R-T2V.md
 * - **Examples**: https://github.com/duongnguyen321/rgex/tree/main/examples
 *
 * @packageDocumentation
 * @module RGex
 * @category Main
 * @group Entry Point
 * @author duongnguyen321 - https://duonguyen.site
 */

// Re-export types
export type {
	RegexBuilderOptions,
	PasswordValidationOptions,
	PasswordValidationResult,
	HumanTextPattern,
	ValidationRule,
	TextExtractionResult,
	ValidationExtractionResult,
} from '../types/index.js';

// Import for local use
import { RGex } from './core/RGex.js';
import type { RegexBuilderOptions } from '../types/index.js';

// Re-export core class
export { RGex } from './core/RGex.js';

// Re-export utilities
export {
	escapeRegex,
	optionsToFlags,
	flagsToOptions,
	isValidRegex,
	normalizeText,
	extractNumbers,
	calculateConfidence,
	mergePatterns,
	generateTestData,
	isSpecialChar,
	calculatePatternComplexity,
	debounce,
	deepClone,
	isValidEmail,
	formatConfidence,
	isDevelopment,
	getTimestamp,
} from './utils/helpers.js';

export {
	parseHumanTextToRegex,
	parseHumanTextToValidation,
	getPatternSuggestions,
	// Shorter aliases for convenience
	humanToRegex,
	humanToValidation,
	getSuggestions,
	// Text-based aliases
	textToRegex,
	textToValidation,
	textToSuggestions,
	// Ultra-short aliases
	h2r,
	h2v,
	suggest,
	t2r,
	t2v,
} from './utils/humanText.js';

export {
	validatePassword,
	hasSequentialChars,
	hasRepeatingChars,
	hasCommonWords,
	getPasswordSuggestions,
	generateStrongPassword,
} from './utils/password.js';

// Re-export constants
export {
	REGEX_PATTERNS,
	HUMAN_PATTERNS,
	PATTERN_KEYWORDS,
	COMMON_PASSWORDS,
	SPECIAL_CHARS,
	SYMBOLS,
	UNICODE_RANGE,
} from './constants/patterns.js';

export {
	VALIDATION_PATTERNS,
	VALIDATION_KEYWORDS,
	LENGTH_PATTERNS,
} from './constants/validation.js';

// Re-export configuration
export { RGEX_CONFIG } from './config/index.js';

/**
 * Factory function to create a new `RGex` instance.
 *
 * This is a convenience function for a more functional approach, an alternative to `new RGex()`.
 *
 * @param pattern An initial regex pattern to start with.
 * @param options Configuration options for the RGex builder.
 * @returns A new `RGex` instance.
 */
export function rgex(pattern?: string, options?: RegexBuilderOptions): RGex {
	return new RGex(pattern, options);
}

// Default export for convenience
export default RGex;
