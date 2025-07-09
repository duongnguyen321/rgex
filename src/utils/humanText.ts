/**
 * RGex Human Text Parser
 * Converts human-readable text descriptions to regex patterns
 */

import type {
	TextExtractionResult,
	ValidationExtractionResult,
	ValidationRule,
} from '../../types/index.js';
import { HUMAN_PATTERNS, PATTERN_KEYWORDS } from '../constants/patterns.js';
import {
	VALIDATION_KEYWORDS,
	LENGTH_PATTERNS,
	VALIDATION_PATTERNS,
} from '../constants/validation.js';
import {
	normalizeText,
	extractNumbers,
	calculateConfidence,
	mergePatterns,
} from './helpers.js';
import { RGEX_CONFIG } from '../config/index.js';

// Import pattern handlers
import { parsePositionalPatterns } from './positionalPatterns.js';
import { parseLengthConstraints } from './lengthConstraints.js';
import { parseEmailPatterns } from './emailPatterns.js';
import { parsePhonePatterns } from './phonePatterns.js';
import { parseSecurityPatterns } from './securityPatterns.js';
import { parseDateTimePatterns } from './dateTimePatterns.js';
import { parseUrlPatterns } from './urlPatterns.js';
import { parseFinancialPatterns } from './financialPatterns.js';
import { parseTextFormattingPatterns } from './textFormattingPatterns.js';
import { parseCombinedPatterns } from './combinedPatterns.js';

/**
 * Parses a human-readable string to generate a regular expression.
 * It first attempts to find complex, compound patterns, then looks for direct keyword matches,
 * and finally falls back to constructing a pattern from individual text components.
 *
 * @param humanText - The natural language string describing the desired regex.
 * @param testValue - An optional string to test against the generated regex for confidence scoring.
 * @returns A `TextExtractionResult` object containing the generated pattern, confidence, and other metadata.
 */
export function parseHumanTextToRegex(
	humanText: string,
	testValue?: string
): TextExtractionResult {
	const normalizedText = normalizeText(humanText);
	let pattern = '';
	let confidence = 0;
	let description = '';
	const suggestions: string[] = [];
	let patternType: string | undefined;

	// Check for compound requirements first (e.g., "email have number in domain")
	const compoundResult = parseCompoundRequirements(
		normalizedText,
		testValue,
		humanText
	);
	if (compoundResult.success) {
		return compoundResult;
	}

	// Check for direct pattern matches
	for (const [key, patternInfo] of Object.entries(HUMAN_PATTERNS)) {
		const keywords = PATTERN_KEYWORDS[key] || [];
		const hasKeyword = keywords.some((keyword) =>
			normalizedText.includes(keyword.toLowerCase())
		);

		if (hasKeyword) {
			pattern = patternInfo.pattern;
			description = patternInfo.description;
			confidence = RGEX_CONFIG.defaults.humanTextConfidence.high;
			patternType = patternInfo.type;

			if (testValue) {
				const regex = new RegExp(pattern);
				const testPassed = regex.test(testValue);
				confidence = calculateConfidence(confidence, true, testPassed);

				if (!testPassed) {
					suggestions.push(
						`The test value "${testValue}" doesn't match the ${key} pattern`
					);
				}
			}

			break;
		}
	}

	// If no direct match, try to construct pattern from components
	if (!pattern) {
		const constructedResult = constructPatternFromText(
			normalizedText,
			testValue
		);
		pattern = constructedResult.pattern;
		confidence = constructedResult.confidence;
		description = constructedResult.description;
		suggestions.push(...constructedResult.suggestions);
	}

	// Add generic suggestions if confidence is low
	if (confidence < RGEX_CONFIG.defaults.humanTextConfidence.medium) {
		suggestions.push(
			'Try being more specific about the pattern you want',
			'Use keywords like: email, phone, number, date, etc.',
			'Provide a test value to improve accuracy'
		);

		// If confidence is extremely low, fail completely
		if (confidence < RGEX_CONFIG.defaults.humanTextConfidence.low) {
			return {
				success: false,
				pattern: undefined,
				confidence,
				description: 'Could not understand the text description',
				suggestions,
			};
		}
	}

	return {
		success: pattern.length > 0,
		pattern: new RegExp(pattern),
		confidence,
		description: description || 'Custom pattern extracted from text',
		suggestions,
	};
}

/**
 * Tries to find a match for complex, multi-part requirements by iterating through specialized parsers.
 * This function acts as a dispatcher to various parsing modules, each handling a specific domain
 * (e.g., positional, length, email).
 *
 * @param normalizedText - The lowercased, trimmed, and whitespace-normalized input text.
 * @param testValue - An optional string to test the generated pattern against.
 * @param originalText - The original, unmodified input text, needed for case-sensitive operations.
 * @returns A `TextExtractionResult` if a compound pattern is matched, otherwise a default failure object.
 */
function parseCompoundRequirements(
	normalizedText: string,
	testValue?: string,
	originalText?: string
): TextExtractionResult {
	// Always use normalized text to ensure case-insensitive matching
	const textForCapture = normalizedText;

	// Try each pattern handler in order (combined patterns first for complex cases)
	const handlers = [
		parseCombinedPatterns,
		parsePositionalPatterns,
		parseLengthConstraints,
		parseEmailPatterns,
		parsePhonePatterns,
		parseSecurityPatterns,
		parseDateTimePatterns,
		parseUrlPatterns,
		parseFinancialPatterns,
		parseTextFormattingPatterns,
	];

	for (const handler of handlers) {
		// For positional patterns, we need to pass the original text to preserve case
		const result =
			handler === parsePositionalPatterns && originalText
				? handler(textForCapture, testValue, originalText)
				: handler(textForCapture, testValue);
		if (result) {
			return result;
		}
	}

	return {
		success: false,
		pattern: undefined,
		confidence: 0,
		description: '',
		suggestions: [],
	};
}

/**
 * Parses a human-readable string to extract a set of validation rules.
 * It identifies keywords for common validation requirements (e.g., "required", "strong password")
 * and also leverages `parseHumanTextToRegex` to create pattern-based rules.
 *
 * @param humanText - The natural language string describing the validation requirements.
 * @param testValue - An optional string to test the extracted rules against.
 * @returns A `ValidationExtractionResult` object containing the rules, confidence, and other metadata.
 */
export function parseHumanTextToValidation(
	humanText: string,
	testValue?: string
): ValidationExtractionResult {
	const normalizedText = normalizeText(humanText);
	const rules: ValidationRule[] = [];
	let confidence = 0;
	const suggestions: string[] = [];

	// Keywords for validation that are not regex patterns
	const keywordVariations = {
		require: ['require', 'required', 'mandatory', 'must have', 'need'],
		strong: ['strong', 'secure', 'complex'],
	};

	// Check for 'required' keyword
	if (keywordVariations.require.some((v) => normalizedText.includes(v))) {
		rules.push(VALIDATION_PATTERNS.required());
		confidence = Math.max(
			confidence,
			RGEX_CONFIG.defaults.humanTextConfidence.medium
		);
	}

	// Check for 'strong password' keyword, which uses a validator function
	if (
		keywordVariations.strong.some((v) => normalizedText.includes(v)) &&
		normalizedText.includes('password')
	) {
		rules.push(VALIDATION_PATTERNS.strongPassword());
		confidence = Math.max(
			confidence,
			RGEX_CONFIG.defaults.humanTextConfidence.high
		);
	}

	// Use the main regex parser to extract a pattern-based rule
	const regexResult = parseHumanTextToRegex(humanText, testValue);

	if (regexResult.success && regexResult.pattern) {
		// Avoid adding a generic password rule if a strong one is already present
		const isGenericPassword =
			rules.some((r) => r.name === 'strongPassword') &&
			regexResult.description?.toLowerCase().includes('password');

		if (!isGenericPassword) {
			const customRule: ValidationRule = {
				name: regexResult.description || 'customPattern',
				pattern: regexResult.pattern,
				message:
					regexResult.description ||
					'Input does not match the required pattern',
			};
			rules.push(customRule);
			confidence = Math.max(confidence, regexResult.confidence);
			if (regexResult.suggestions) {
				suggestions.push(...regexResult.suggestions);
			}
		}
	}

	// Test extracted rules if test value is provided
	let allPassed = true;
	const caseUnPassed = [];
	if (testValue && rules.length > 0) {
		for (const rule of rules) {
			let passed = true;

			if (rule.validator) {
				passed = rule.validator(testValue);
			} else if (rule.pattern) {
				passed = rule.pattern.test(testValue);
			}

			if (!passed) {
				allPassed = false;
				caseUnPassed.push(rule.name);
				suggestions.push(
					`Test value fails rule: ${rule.name} - ${rule.message}`
				);
			}
		}

		confidence = calculateConfidence(confidence, true, allPassed);
	}

	// Add suggestions for improvement
	if (rules.length === 0) {
		suggestions.push(
			'No validation rules could be extracted.',
			'Try using keywords like: required, email, phone, min length, max length.',
			'Examples: "required email", "phone number", "minimum 8 characters".'
		);
	}

	return {
		success: rules.length > 0,
		rules,
		confidence,
		description: `Extracted ${rules.length} validation rule${
			rules.length === 1 ? '' : 's'
		} from text.`,
		suggestions,
		caseUnPassed,
		allPassed,
	};
}

/**
 * Constructs a regex pattern from individual components and keywords found in the text
 * when no direct or compound pattern is matched. Enhanced to handle complex, multi-part
 * descriptions and logical operators.
 *
 * @param normalizedText - The lowercased, trimmed, and whitespace-normalized input text.
 * @param testValue - An optional string to test the generated pattern against.
 * @returns An object containing the constructed pattern, confidence score, description, and suggestions.
 */
function constructPatternFromText(
	normalizedText: string,
	testValue?: string
): {
	pattern: string;
	confidence: number;
	description: string;
	suggestions: string[];
} {
	const suggestions: string[] = [];
	let pattern = '';
	let confidence = 0;
	let description = '';

	// Enhanced text analysis for complex descriptions
	const analysisResult = analyzeComplexText(normalizedText);
	if (analysisResult && analysisResult.pattern) {
		pattern = analysisResult.pattern;
		confidence = analysisResult.confidence;
		description = analysisResult.description;
		suggestions.push(...analysisResult.suggestions);
	} else {
		// Fallback to original pattern construction
		const originalResult = constructBasicPattern(normalizedText);
		pattern = originalResult.pattern;
		confidence = originalResult.confidence;
		description = originalResult.description;
		suggestions.push(...originalResult.suggestions);
	}

	// Test against test value if provided
	if (testValue && pattern) {
		try {
			const regex = new RegExp(pattern);
			const testPassed = regex.test(testValue);
			confidence = calculateConfidence(confidence, true, testPassed);

			if (!testPassed) {
				suggestions.push(`Pattern doesn't match test value: "${testValue}"`);
			}
		} catch (error) {
			suggestions.push('Generated pattern is invalid');
			confidence = 0;
		}
	}

	return {
		pattern,
		confidence: Math.min(confidence, 1),
		description,
		suggestions,
	};
}

/**
 * Analyzes complex text descriptions to extract sophisticated patterns.
 * Handles multi-sentence descriptions, logical operators, and advanced requirements.
 *
 * @param text - The normalized text to analyze.
 * @returns An object with pattern information or null if no complex pattern found.
 */
function analyzeComplexText(text: string): {
	pattern: string;
	confidence: number;
	description: string;
	suggestions: string[];
} | null {
	const suggestions: string[] = [];

	// Handle multi-sentence descriptions
	const sentences = text.split(/[.!?]+/).filter((s) => s.trim().length > 0);
	if (sentences.length > 1) {
		const multiSentenceResult = parseMultiSentenceDescription(sentences);
		if (multiSentenceResult) {
			return multiSentenceResult;
		}
	}

	// Handle logical operators (AND, OR, NOT)
	const logicalResult = parseLogicalOperators(text);
	if (logicalResult) {
		return logicalResult;
	}

	// Handle complex length and character requirements
	const complexLengthResult = parseComplexLengthRequirements(text);
	if (complexLengthResult) {
		return complexLengthResult;
	}

	// Handle conditional patterns ("if...then", "when...must")
	const conditionalResult = parseConditionalPatterns(text);
	if (conditionalResult) {
		return conditionalResult;
	}

	// Handle advanced character composition requirements
	const compositionResult = parseAdvancedCharacterComposition(text);
	if (compositionResult) {
		return compositionResult;
	}

	// Handle pattern combinations and sequences
	const sequenceResult = parsePatternSequences(text);
	if (sequenceResult) {
		return sequenceResult;
	}

	return null;
}

/**
 * Parses multi-sentence descriptions to extract combined patterns.
 */
function parseMultiSentenceDescription(sentences: string[]): {
	pattern: string;
	confidence: number;
	description: string;
	suggestions: string[];
} | null {
	const patterns: string[] = [];
	const descriptions: string[] = [];
	let totalConfidence = 0;

	for (const sentence of sentences) {
		const trimmed = sentence.trim();
		if (trimmed.length === 0) continue;

		// Try to extract pattern from each sentence
		const basicResult = constructBasicPattern(trimmed);
		if (basicResult.pattern && basicResult.confidence > 0.3) {
			patterns.push(basicResult.pattern);
			descriptions.push(basicResult.description);
			totalConfidence += basicResult.confidence;
		}
	}

	if (patterns.length > 1) {
		// Combine patterns with AND logic (all must match)
		const combinedPattern = `^(?=.*${patterns.join(')(?=.*')}).*$`;
		return {
			pattern: combinedPattern,
			confidence: totalConfidence / patterns.length,
			description: `Combined requirements: ${descriptions.join(', ')}`,
			suggestions: ['Multi-part requirements combined with AND logic'],
		};
	}

	return null;
}

/**
 * Parses text with logical operators (AND, OR, NOT).
 */
function parseLogicalOperators(text: string): {
	pattern: string;
	confidence: number;
	description: string;
	suggestions: string[];
} | null {
	// Handle explicit AND operations - but only if both parts seem pattern-related
	if (text.includes(' and ') || text.includes(' & ')) {
		const parts = text.split(/\s+(?:and|&)\s+/);
		if (parts.length > 1) {
			// Check if the parts actually represent pattern components
			const meaningfulParts = parts.filter((part) => {
				const partAnalysis = checkForMeaningfulPatternKeywords(part.trim());
				return partAnalysis.found || hasPatternStructure(part.trim());
			});

			// Only treat as logical AND if most parts are pattern-related
			if (meaningfulParts.length >= Math.ceil(parts.length * 0.7)) {
				const patterns: string[] = [];
				for (const part of parts) {
					const basicResult = constructBasicPattern(part.trim());
					if (basicResult.pattern) {
						patterns.push(basicResult.pattern);
					}
				}
				if (patterns.length > 1) {
					return {
						pattern: `^(?=.*${patterns.join(')(?=.*')}).*$`,
						confidence: 0.7,
						description: `All conditions must be met: ${parts.join(', ')}`,
						suggestions: ['Using AND logic to combine multiple requirements'],
					};
				}
			}
		}
	}

	// Handle explicit OR operations - with similar pattern context checking
	if (text.includes(' or ') || text.includes(' | ')) {
		const parts = text.split(/\s+(?:or|\|)\s+/);
		if (parts.length > 1) {
			// Check if the parts actually represent pattern alternatives
			const meaningfulParts = parts.filter((part) => {
				const partAnalysis = checkForMeaningfulPatternKeywords(part.trim());
				return partAnalysis.found || hasPatternStructure(part.trim());
			});

			// Only treat as logical OR if most parts are pattern-related
			if (meaningfulParts.length >= Math.ceil(parts.length * 0.7)) {
				const patterns: string[] = [];
				for (const part of parts) {
					const basicResult = constructBasicPattern(part.trim());
					if (basicResult.pattern) {
						patterns.push(basicResult.pattern);
					}
				}
				if (patterns.length > 1) {
					return {
						pattern: `^(${patterns.join('|')})$`,
						confidence: 0.7,
						description: `Any of these conditions: ${parts.join(', ')}`,
						suggestions: ['Using OR logic to allow multiple alternatives'],
					};
				}
			}
		}
	}

	// Handle NOT operations
	if (
		text.includes('not ') ||
		text.includes('without ') ||
		text.includes('exclude ')
	) {
		const notMatch = text.match(
			/(?:not|without|exclude)\s+([^,.\s]+(?:\s+[^,.\s]+)*)/
		);
		if (notMatch && notMatch[1]) {
			const excludePattern = notMatch[1];
			const escapedExclude = excludePattern.replace(
				/[.*+?^${}()|[\]\\]/g,
				'\\$&'
			);
			return {
				pattern: `^(?!.*${escapedExclude}).*$`,
				confidence: 0.6,
				description: `Text that does not contain: ${excludePattern}`,
				suggestions: ['Using negative lookahead to exclude specific content'],
			};
		}
	}

	return null;
}

/**
 * Checks if a text fragment has pattern-like structure (contains pattern keywords or format indicators).
 */
function hasPatternStructure(text: string): boolean {
	// Look for pattern-like structures
	const patternIndicators = [
		/\d+/, // Contains numbers (might be length specs)
		/contains?/i, // Contains "contains"
		/starts?\s+with/i, // "starts with"
		/ends?\s+with/i, // "ends with"
		/between\s+\d+/i, // "between X"
		/at\s+least/i, // "at least"
		/minimum|maximum/i, // min/max
		/exactly\s+\d+/i, // "exactly N"
		/characters?/i, // "character(s)"
		/letters?/i, // "letter(s)"
		/digits?/i, // "digit(s)"
		/numbers?/i, // "number(s)"
	];

	return patternIndicators.some((indicator) => indicator.test(text));
}

/**
 * Parses complex length requirements with multiple constraints.
 */
function parseComplexLengthRequirements(text: string): {
	pattern: string;
	confidence: number;
	description: string;
	suggestions: string[];
} | null {
	// Handle "between X and Y but not exactly Z"
	const complexBetween = text.match(
		/between\s+(\d+)\s+and\s+(\d+).*(?:not|except).*exactly\s+(\d+)/
	);
	if (
		complexBetween &&
		complexBetween[1] &&
		complexBetween[2] &&
		complexBetween[3]
	) {
		const min = parseInt(complexBetween[1]);
		const max = parseInt(complexBetween[2]);
		const except = parseInt(complexBetween[3]);
		if (except >= min && except <= max) {
			return {
				pattern: `^(?!.{${except}}$).{${min},${max}}$`,
				confidence: 0.8,
				description: `Between ${min} and ${max} characters, but not exactly ${except}`,
				suggestions: ['Using negative lookahead to exclude specific length'],
			};
		}
	}

	// Handle "at least X but less than Y"
	const atLeastLessThan = text.match(
		/at least\s+(\d+).*(?:but|and).*less than\s+(\d+)/
	);
	if (atLeastLessThan && atLeastLessThan[1] && atLeastLessThan[2]) {
		const min = parseInt(atLeastLessThan[1]);
		const max = parseInt(atLeastLessThan[2]) - 1;
		return {
			pattern: `^.{${min},${max}}$`,
			confidence: 0.8,
			description: `At least ${min} but less than ${max + 1} characters`,
			suggestions: ['Complex length range with exclusive upper bound'],
		};
	}

	return null;
}

/**
 * Parses conditional patterns with if-then logic.
 */
function parseConditionalPatterns(text: string): {
	pattern: string;
	confidence: number;
	description: string;
	suggestions: string[];
} | null {
	// Handle "if contains X then must have Y"
	const ifThenMatch = text.match(
		/if.*contains?\s+([^,\s]+).*then.*(?:must|should)\s+(?:have|contain)\s+([^,\s]+)/
	);
	if (ifThenMatch && ifThenMatch[1] && ifThenMatch[2]) {
		const condition = ifThenMatch[1];
		const requirement = ifThenMatch[2];
		const escapedCondition = condition.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
		const escapedRequirement = requirement.replace(
			/[.*+?^${}()|[\]\\]/g,
			'\\$&'
		);

		return {
			pattern: `^(?=.*${escapedCondition})(?=.*${escapedRequirement}).*$`,
			confidence: 0.7,
			description: `If contains ${condition}, then must have ${requirement}`,
			suggestions: ['Using conditional logic with positive lookaheads'],
		};
	}

	// Handle "when X is present, Y is required"
	const whenMatch = text.match(
		/when\s+([^,\s]+).*(?:present|exists).*([^,\s]+).*(?:required|needed)/
	);
	if (whenMatch && whenMatch[1] && whenMatch[2]) {
		const trigger = whenMatch[1];
		const required = whenMatch[2];
		const escapedTrigger = trigger.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
		const escapedRequired = required.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

		return {
			pattern: `^(?=.*${escapedTrigger})(?=.*${escapedRequired}).*$`,
			confidence: 0.7,
			description: `When ${trigger} is present, ${required} is required`,
			suggestions: ['Implementing conditional requirements'],
		};
	}

	return null;
}

/**
 * Parses advanced character composition requirements.
 */
function parseAdvancedCharacterComposition(text: string): {
	pattern: string;
	confidence: number;
	description: string;
	suggestions: string[];
} | null {
	// Handle "mix of letters numbers and symbols with specific counts"
	const mixWithCounts = text.match(
		/(?:mix|combination).*(\d+).*(?:letter|alphabetic).*(\d+).*(?:number|digit).*(\d+).*(?:symbol|special)/
	);
	if (
		mixWithCounts &&
		mixWithCounts[1] &&
		mixWithCounts[2] &&
		mixWithCounts[3]
	) {
		const letterCount = parseInt(mixWithCounts[1]);
		const numberCount = parseInt(mixWithCounts[2]);
		const symbolCount = parseInt(mixWithCounts[3]);

		return {
			pattern: `^(?=(?:.*[a-zA-Z]){${letterCount}})(?=(?:.*\\d){${numberCount}})(?=(?:.*[^a-zA-Z0-9\\s]){${symbolCount}}).+$`,
			confidence: 0.8,
			description: `Mix with exactly ${letterCount} letters, ${numberCount} numbers, ${symbolCount} symbols`,
			suggestions: [
				'Using multiple positive lookaheads for character count requirements',
			],
		};
	}

	// Handle "predominantly letters with occasional numbers"
	if (
		text.includes('predominantly') &&
		text.includes('letter') &&
		text.includes('occasional') &&
		text.includes('number')
	) {
		return {
			pattern: '^[a-zA-Z]*\\d{1,3}[a-zA-Z]*$',
			confidence: 0.6,
			description: 'Predominantly letters with 1-3 numbers',
			suggestions: ['Approximate pattern for predominantly letter content'],
		};
	}

	// Handle "alternating pattern" requirements
	if (
		text.includes('alternating') &&
		text.includes('letter') &&
		text.includes('number')
	) {
		return {
			pattern: '^(?:[a-zA-Z]\\d)+[a-zA-Z]?$',
			confidence: 0.7,
			description: 'Alternating letters and numbers',
			suggestions: ['Pattern for strict alternating sequence'],
		};
	}

	return null;
}

/**
 * Parses pattern sequences and ordering requirements.
 */
function parsePatternSequences(text: string): {
	pattern: string;
	confidence: number;
	description: string;
	suggestions: string[];
} | null {
	// Handle "starts with letters followed by numbers then symbols"
	const sequenceMatch = text.match(
		/starts?\s+with\s+(\w+).*followed\s+by\s+(\w+).*then\s+(\w+)/
	);
	if (
		sequenceMatch &&
		sequenceMatch[1] &&
		sequenceMatch[2] &&
		sequenceMatch[3]
	) {
		const first = sequenceMatch[1];
		const second = sequenceMatch[2];
		const third = sequenceMatch[3];

		const patterns: Record<string, string> = {
			letter: '[a-zA-Z]+',
			letters: '[a-zA-Z]+',
			number: '\\d+',
			numbers: '\\d+',
			digit: '\\d+',
			digits: '\\d+',
			symbol: '[^a-zA-Z0-9\\s]+',
			symbols: '[^a-zA-Z0-9\\s]+',
			special: '[^a-zA-Z0-9\\s]+',
		};

		const firstPattern = patterns[first] || `[${first}]+`;
		const secondPattern = patterns[second] || `[${second}]+`;
		const thirdPattern = patterns[third] || `[${third}]+`;

		return {
			pattern: `^${firstPattern}${secondPattern}${thirdPattern}$`,
			confidence: 0.8,
			description: `Sequence: ${first} → ${second} → ${third}`,
			suggestions: ['Strict sequence pattern with ordered components'],
		};
	}

	// Handle "repeating pattern of X"
	const repeatingMatch = text.match(
		/repeating\s+(?:pattern\s+of\s+)?([^,\s]+)(?:\s+(\d+)\s+times)?/
	);
	if (repeatingMatch && repeatingMatch[1]) {
		const unit = repeatingMatch[1];
		const times = repeatingMatch[2] ? parseInt(repeatingMatch[2]) : '';
		const quantifier = times ? `{${times}}` : '+';

		return {
			pattern: `^(?:${unit.replace(
				/[.*+?^${}()|[\]\\]/g,
				'\\$&'
			)})${quantifier}$`,
			confidence: 0.7,
			description: `Repeating pattern: ${unit}${
				times ? ` (${times} times)` : ' (one or more)'
			}`,
			suggestions: ['Pattern for repeating sequences'],
		};
	}

	return null;
}

/**
 * Constructs a basic pattern using the original logic as fallback.
 */
function constructBasicPattern(normalizedText: string): {
	pattern: string;
	confidence: number;
	description: string;
	suggestions: string[];
} {
	const suggestions: string[] = [];
	let pattern = '';
	let confidence = 0;
	let description = '';

	// Look for specific pattern elements
	const patternElements: string[] = [];

	// Enhanced character class detection
	if (
		normalizedText.includes('letter') ||
		normalizedText.includes('alphabetic') ||
		normalizedText.includes('alpha')
	) {
		if (
			normalizedText.includes('uppercase') ||
			normalizedText.includes('capital')
		) {
			patternElements.push('[A-Z]');
		} else if (
			normalizedText.includes('lowercase') ||
			normalizedText.includes('small')
		) {
			patternElements.push('[a-z]');
		} else {
			patternElements.push('[a-zA-Z]');
		}
		confidence += 0.3;
	}

	if (
		normalizedText.includes('digit') ||
		normalizedText.includes('number') ||
		normalizedText.includes('numeric')
	) {
		patternElements.push('\\d');
		confidence += 0.3;
	}

	if (
		normalizedText.includes('space') ||
		normalizedText.includes('whitespace')
	) {
		patternElements.push('\\s');
		confidence += 0.2;
	}

	if (
		normalizedText.includes('any character') ||
		normalizedText.includes('anything')
	) {
		patternElements.push('.');
		confidence += 0.1;
	}

	// Enhanced special character detection
	if (
		normalizedText.includes('special') ||
		normalizedText.includes('symbol') ||
		normalizedText.includes('punctuation')
	) {
		if (normalizedText.includes('common')) {
			patternElements.push('[!@#$%^&*()_+\\-=\\[\\]{};\':"\\\\|,.<>\\/?]');
		} else {
			patternElements.push('[^a-zA-Z0-9\\s]');
		}
		confidence += 0.2;
	}

	// Enhanced quantifier detection
	const numbers = extractNumbers(normalizedText);
	if (numbers.length > 0) {
		const num = numbers[0];
		const lastElementIndex = patternElements.length - 1;

		if (normalizedText.includes('exactly')) {
			if (lastElementIndex >= 0) {
				patternElements[lastElementIndex] += `{${num}}`;
			}
			confidence += 0.2;
		} else if (
			normalizedText.includes('at least') ||
			normalizedText.includes('minimum')
		) {
			if (lastElementIndex >= 0) {
				patternElements[lastElementIndex] += `{${num},}`;
			}
			confidence += 0.2;
		} else if (
			normalizedText.includes('at most') ||
			normalizedText.includes('maximum')
		) {
			if (lastElementIndex >= 0) {
				patternElements[lastElementIndex] += `{0,${num}}`;
			}
			confidence += 0.2;
		} else if (numbers.length > 1) {
			// Handle "between X and Y"
			const secondNum = numbers[1];
			if (normalizedText.includes('between')) {
				if (lastElementIndex >= 0) {
					patternElements[lastElementIndex] += `{${num},${secondNum}}`;
				}
				confidence += 0.3;
			}
		}
	}

	// Enhanced anchor detection
	if (
		normalizedText.includes('start') ||
		normalizedText.includes('beginning') ||
		normalizedText.includes('begin')
	) {
		pattern = '^' + pattern;
		confidence += 0.1;
	}

	if (
		normalizedText.includes('end') ||
		normalizedText.includes('ending') ||
		normalizedText.includes('finish')
	) {
		pattern += '$';
		confidence += 0.1;
	}

	// Combine pattern elements
	if (patternElements.length > 0) {
		pattern += mergePatterns(patternElements, false);
		description = `Pattern constructed from components: ${patternElements.join(
			', '
		)}`;
	} else {
		// Enhanced fallback with meaningful keyword detection
		const words = normalizedText.split(' ').filter((word) => word.length > 2);
		if (words.length > 0) {
			// Check if text contains meaningful pattern-related keywords
			const meaningfulKeywords =
				checkForMeaningfulPatternKeywords(normalizedText);

			if (meaningfulKeywords.found) {
				// Handle common pattern keywords even in fallback
				const enhancedWords = words.map((word) => {
					if (word === 'email') return '[^\\s@]+@[^\\s@]+\\.[^\\s@]+';
					if (word === 'phone')
						return '\\(?\\d{3}\\)?[-\\s]?\\d{3}[-\\s]?\\d{4}';
					if (word === 'url') return 'https?://[^\\s]+';
					if (word === 'date') return '\\d{1,2}[/-]\\d{1,2}[/-]\\d{2,4}';
					return word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
				});

				pattern = enhancedWords.join('.*');
				confidence = Math.max(0.3, meaningfulKeywords.confidence);
				description = 'Enhanced literal pattern with keyword recognition';
				suggestions.push(
					'Consider using more specific pattern keywords for better results'
				);
			} else {
				// This appears to be nonsensical text - set very low confidence
				pattern = words
					.map((word) => word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'))
					.join('.*');
				confidence = 0.1; // Very low confidence for nonsensical text
				description =
					'Literal text pattern (low confidence - appears to be random text)';
				suggestions.push(
					'The text appears to be random or nonsensical',
					'Try using recognized pattern keywords like: email, phone, number, date, etc.',
					'Use more specific pattern descriptions for better results'
				);
			}
		}
	}

	return {
		pattern,
		confidence: Math.min(confidence, 1),
		description,
		suggestions,
	};
}

/**
 * Checks if the text contains meaningful pattern-related keywords.
 * Used to distinguish between valid pattern descriptions and nonsensical text.
 */
function checkForMeaningfulPatternKeywords(text: string): {
	found: boolean;
	confidence: number;
	keywords: string[];
} {
	// List of high-value pattern-related keywords (specific and meaningful)
	const highValueKeywords = [
		// Basic patterns - very specific
		'email',
		'phone',
		'url',
		'date',
		'time',
		'uuid',
		'ip',
		'address',
		// Character types - specific
		'letter',
		'digit',
		'number',
		'character',
		'alpha',
		'numeric',
		'alphanumeric',
		'uppercase',
		'lowercase',
		'capital',
		'special',
		'symbol',
		'punctuation',
		// Quantifiers and constraints - specific
		'exactly',
		'minimum',
		'maximum',
		'between',
		'least',
		'most',
		'length',
		// Positional - specific
		'start',
		'end',
		'begin',
		'beginning',
		'ending',
		'finish',
		'contains',
		'starts',
		'ends',
		'followed',
		'preceded',
		// Common data types - specific
		'password',
		'username',
		'credit',
		'card',
		'social',
		'security',
		'zip',
		'postal',
		'code',
		'isbn',
		'guid',
		'mac',
		'hex',
		'binary',
		'decimal',
		// Text formatting - specific
		'space',
		'spaces',
		'whitespace',
		'tab',
		'newline',
		'word',
		'words',
		// Validation terms - specific
		'required',
		'optional',
		'mandatory',
		'strong',
		'weak',
		'secure',
		'complex',
	];

	// List of medium-value keywords (less specific, need multiple to be meaningful)
	const mediumValueKeywords = [
		'and',
		'or',
		'not',
		'without',
		'exclude',
		'include',
		'format',
		'match',
		'regex',
		'expression',
		'valid',
		'invalid',
		'characters',
		'char',
		'chars',
		'sentence',
		'paragraph',
		'line',
		'text',
		'simple',
	];

	// List of low-value keywords (very generic, shouldn't count much)
	const lowValueKeywords = [
		'pattern', // Too generic on its own
	];

	const foundKeywords: string[] = [];
	let totalRelevance = 0;
	let highValueCount = 0;
	let mediumValueCount = 0;
	let lowValueCount = 0;

	// Count high-value keywords
	for (const keyword of highValueKeywords) {
		if (text.includes(keyword)) {
			foundKeywords.push(keyword);
			highValueCount++;
			totalRelevance += 0.4; // High weight for specific keywords
		}
	}

	// Count medium-value keywords
	for (const keyword of mediumValueKeywords) {
		if (text.includes(keyword)) {
			foundKeywords.push(keyword);
			mediumValueCount++;
			totalRelevance += 0.2; // Medium weight
		}
	}

	// Count low-value keywords
	for (const keyword of lowValueKeywords) {
		if (text.includes(keyword)) {
			foundKeywords.push(keyword);
			lowValueCount++;
			totalRelevance += 0.05; // Very low weight
		}
	}

	// Calculate total word count to check ratio
	const words = text.split(' ').filter((word) => word.length > 2);
	const totalWords = words.length;

	// Meaningful content requires:
	// 1. At least one high-value keyword, OR
	// 2. At least two medium-value keywords (and no random words), OR
	// 3. A very good ratio of meaningful to total words (50%+) with at least 2 meaningful words
	const meaningfulWordCount = highValueCount + mediumValueCount;
	const meaningfulRatio = totalWords > 0 ? meaningfulWordCount / totalWords : 0;

	// Check for obviously nonsensical words that should disqualify the text
	const nonsensicalWords = [
		'imaginary',
		'nonsensical',
		'random',
		'gibberish',
		'fake',
		'test123',
		'xyz',
		'abc123',
	];
	const hasNonsensicalWords = nonsensicalWords.some((word) =>
		text.includes(word)
	);

	const isMeaningful =
		!hasNonsensicalWords && // Exclude obviously nonsensical text
		(highValueCount >= 1 || // At least one specific keyword
			(mediumValueCount >= 2 && meaningfulRatio >= 0.5) || // At least two medium keywords with good ratio
			(meaningfulRatio >= 0.6 && meaningfulWordCount >= 2)); // Very good ratio with multiple meaningful words

	// Cap confidence and require meaningful content
	const confidence = isMeaningful ? Math.min(totalRelevance, 0.8) : 0;

	return {
		found: isMeaningful && foundKeywords.length > 0,
		confidence,
		keywords: foundKeywords,
	};
}

/**
 * Provides regex pattern suggestions based on keywords found in the input text.
 * @param text - The user-provided text to analyze for suggestions.
 * @returns An array of string suggestions, limited to the top 5 most relevant.
 */
export function getPatternSuggestions(text: string): string[] {
	const normalizedText = normalizeText(text);
	const suggestions: string[] = [];

	// Check what patterns might be relevant
	for (const [key, keywords] of Object.entries(PATTERN_KEYWORDS)) {
		const hasPartialMatch = keywords.some((keyword) =>
			normalizedText.includes(keyword.substring(0, 3))
		);

		if (hasPartialMatch) {
			suggestions.push(`Did you mean "${key}"? Try: ${keywords.join(', ')}`);
		}
	}

	// General suggestions
	if (suggestions.length === 0) {
		suggestions.push(
			'Available patterns: email, phone, url, date, time, number, uuid, ip address',
			'Use descriptive keywords like "email address" or "phone number"',
			'Provide specific requirements like "minimum 8 characters" or "numbers only"'
		);
	}

	return suggestions.slice(0, 5); // Limit suggestions
}

// ============================================
// SHORTER EXPORT ALIASES FOR CONVENIENCE
// ============================================

/**
 * Converts human-readable text descriptions into regular expression patterns.
 * This is a convenient alias for `parseHumanTextToRegex` that provides the same functionality
 * with natural language processing to understand pattern requirements.
 *
 * @param humanText - Natural language description of the desired regex pattern.
 *   Examples: "email address", "phone number with dashes", "text that starts with A"
 * @param testValue - Optional test string to validate the generated pattern against
 *   and improve confidence scoring. If provided, the function will test the pattern
 *   and adjust confidence based on whether the test passes.
 * @returns A `TextExtractionResult` object containing:
 *   - `success`: Boolean indicating if pattern generation succeeded
 *   - `pattern`: Generated RegExp object (undefined if failed)
 *   - `confidence`: Number between 0-1 indicating pattern reliability
 *   - `description`: Human-readable description of the generated pattern
 *   - `suggestions`: Array of helpful suggestions for improvement
 *
 * @example
 * ```typescript
 * // Basic email pattern
 * const result = humanToRegex("email address");
 * console.log(result.pattern); // /^[^\s@]+@[^\s@]+\.[^\s@]+$/
 *
 * // Complex positional pattern
 * const startPattern = humanToRegex("starts with 'user_' followed by numbers");
 *
 * // With test validation
 * const phoneResult = humanToRegex("US phone number", "+1-555-123-4567");
 * console.log(phoneResult.confidence); // Higher confidence due to successful test
 * ```
 */
export const humanToRegex = parseHumanTextToRegex;

/**
 * Transforms textual pattern descriptions into executable regular expressions.
 * This is an intuitive alias for `parseHumanTextToRegex` that emphasizes text-to-regex
 * conversion capability, supporting complex multi-part requirements and natural language.
 *
 * @param humanText - Descriptive text explaining the pattern requirements.
 *   Supports complex descriptions like: "alphanumeric with dashes between 5 and 50 characters",
 *   "email that contains numbers in domain", "text starting with capital and ending with period"
 * @param testValue - Optional validation string to test pattern accuracy and boost confidence.
 *   When provided, the generated regex is tested against this value to ensure correctness.
 * @returns Complete `TextExtractionResult` with pattern, confidence metrics, and guidance:
 *   - `success`: Whether the text was successfully parsed into a pattern
 *   - `pattern`: The generated RegExp ready for use (null if parsing failed)
 *   - `confidence`: Reliability score from 0.0 (low) to 1.0 (high confidence)
 *   - `description`: Clear explanation of what the pattern matches
 *   - `suggestions`: Actionable advice for improving pattern or handling edge cases
 *
 * @example
 * ```typescript
 * // Simple pattern conversion
 * const digits = textToRegex("exactly 5 digits");
 * // Result: /^\d{5}$/
 *
 * // Complex compound pattern
 * const complex = textToRegex("username that starts with letter, contains numbers, and is 3-20 characters");
 *
 * // Financial pattern with validation
 * const creditCard = textToRegex("credit card number", "4532-1234-5678-9012");
 * if (creditCard.success) {
 *   console.log(`Pattern confidence: ${creditCard.confidence}`);
 * }
 * ```
 */
export const textToRegex = parseHumanTextToRegex;

/**
 * Extracts validation rules from human-readable requirement descriptions.
 * This alias for `parseHumanTextToValidation` converts natural language validation
 * requirements into structured validation rule objects with patterns and functions.
 *
 * @param humanText - Natural language describing validation requirements.
 *   Examples: "required email", "strong password with special characters",
 *   "optional phone number", "text between 10 and 100 characters"
 * @param testValue - Optional input to validate against the extracted rules.
 *   Helps determine rule accuracy and provides immediate feedback on compliance.
 * @returns Comprehensive `ValidationExtractionResult` containing:
 *   - `success`: Boolean indicating successful rule extraction
 *   - `rules`: Array of `ValidationRule` objects with patterns, validators, and messages
 *   - `confidence`: Overall confidence in the extracted validation logic
 *   - `description`: Summary of extracted validation requirements
 *   - `suggestions`: Helpful tips for improving validation or fixing issues
 *   - `allPassed`: Boolean indicating if test value passes all rules (when provided)
 *   - `caseUnPassed`: Array of rule names that failed validation (when test provided)
 *
 * @example
 * ```typescript
 * // Basic required field
 * const emailValidation = humanToValidation("required email address");
 * // Returns rules for: required field + email format
 *
 * // Complex password requirements
 * const passwordRules = humanToValidation("strong password minimum 8 characters");
 *
 * // With immediate testing
 * const result = humanToValidation("required phone number", "555-1234");
 * console.log(result.allPassed); // true/false
 * console.log(result.caseUnPassed); // ["required", "phoneFormat"] if failed
 * ```
 */
export const humanToValidation = parseHumanTextToValidation;

/**
 * Converts descriptive text into structured validation rule sets.
 * This practical alias for `parseHumanTextToValidation` specializes in transforming
 * textual validation requirements into actionable validation logic with error messages.
 *
 * @param humanText - Textual description of validation needs and constraints.
 *   Supports complex scenarios: "mandatory email with custom domain",
 *   "secure password with mixed case and symbols", "conditional phone number format"
 * @param testValue - Optional sample input for immediate rule testing and validation.
 *   Provides real-time feedback on whether the input meets the described requirements.
 * @returns Detailed `ValidationExtractionResult` with comprehensive validation data:
 *   - `success`: Indicates whether meaningful validation rules were extracted
 *   - `rules`: Structured array of validation rules with patterns and custom validators
 *   - `confidence`: Numeric confidence score reflecting extraction accuracy
 *   - `description`: Human-friendly summary of the validation requirements
 *   - `suggestions`: Constructive guidance for improving validation or input format
 *   - `allPassed`: Overall validation status when test value is provided
 *   - `caseUnPassed`: Specific validation rules that failed (helps with debugging)
 *
 * @example
 * ```typescript
 * // Form field validation
 * const usernameRules = textToValidation("required username 3-20 characters alphanumeric only");
 *
 * // Multi-constraint validation
 * const complexRules = textToValidation("password minimum 12 characters with uppercase lowercase numbers symbols");
 *
 * // Real-time validation feedback
 * const validation = textToValidation("required credit card", "4532-1234-5678-9012");
 * validation.rules.forEach(rule => {
 *   if (rule.pattern && !rule.pattern.test("4532-1234-5678-9012")) {
 *     console.log(`Failed: ${rule.message}`);
 *   }
 * });
 * ```
 */
export const textToValidation = parseHumanTextToValidation;

/**
 * Provides intelligent pattern suggestions based on partial or unclear text input.
 * This helpful alias for `getPatternSuggestions` analyzes user input and offers
 * relevant pattern recommendations, keywords, and examples to guide pattern creation.
 *
 * @param text - Partial or unclear text input that needs pattern suggestions.
 *   Can be incomplete words, typos, or vague descriptions that need clarification.
 *   Examples: "emai", "phon numb", "date tim", "secur password"
 * @returns Array of helpful suggestion strings (limited to top 5 most relevant):
 *   - Pattern keyword suggestions based on partial matches
 *   - Available pattern types and their trigger keywords
 *   - Example phrases that work well with the parser
 *   - General guidance for improving pattern descriptions
 *
 * @example
 * ```typescript
 * // Get suggestions for partial input
 * const suggestions = getSuggestions("emai");
 * // Returns: ["Did you mean 'email'? Try: email, email address, e-mail"]
 *
 * // Help with unclear input
 * const phoneHelp = getSuggestions("phone");
 * // Returns suggestions for phone patterns, formats, and examples
 *
 * // General pattern guidance
 * const general = getSuggestions("xyz123");
 * // Returns: ["Available patterns: email, phone, url, date...", "Use descriptive keywords..."]
 * ```
 */
export const getSuggestions = getPatternSuggestions;

/**
 * Generates contextual pattern suggestions from text analysis.
 * This intelligent alias for `getPatternSuggestions` analyzes input text and provides
 * smart recommendations for pattern creation, helping users discover available patterns
 * and improve their natural language descriptions.
 *
 * @param text - Input text to analyze for pattern suggestion opportunities.
 *   Accepts typos, partial words, unclear descriptions, or exploratory queries.
 *   The function intelligently matches against known pattern keywords and provides guidance.
 * @returns Curated array of suggestion strings (maximum 5) including:
 *   - Corrections for misspelled pattern keywords
 *   - Lists of available pattern types with trigger words
 *   - Example phrases that demonstrate proper usage
 *   - Best practices for writing clear pattern descriptions
 *
 * @example
 * ```typescript
 * // Typo correction
 * const corrections = textToSuggestions("emial addres");
 * // Returns suggestions to use "email address"
 *
 * // Pattern discovery
 * const discovery = textToSuggestions("number");
 * // Returns various number patterns: phone, credit card, zip code, etc.
 *
 * // Blank slate guidance
 * const help = textToSuggestions("");
 * // Returns: ["Available patterns: email, phone, url...", "Use descriptive keywords..."]
 * ```
 */
export const textToSuggestions = getPatternSuggestions;

/**
 * Quick human-to-regex conversion with abbreviated syntax.
 * This compact alias for `parseHumanTextToRegex` provides the same powerful
 * natural language processing in a shortened form ideal for rapid development
 * and inline pattern generation.
 *
 * @param humanText - Concise natural language pattern description.
 *   Same capabilities as the full function: complex patterns, compound requirements,
 *   positional constraints, and specialized domain patterns (email, phone, etc.)
 * @param testValue - Optional validation string for confidence boosting and accuracy testing.
 *   When provided, tests the generated pattern and adjusts confidence accordingly.
 * @returns Standard `TextExtractionResult` with full pattern generation results:
 *   - `success`: Pattern generation success indicator
 *   - `pattern`: Generated RegExp object for immediate use
 *   - `confidence`: Reliability score from 0.0 to 1.0
 *   - `description`: Clear explanation of pattern behavior
 *   - `suggestions`: Improvement recommendations and usage tips
 *
 * @example
 * ```typescript
 * // Quick email pattern
 * const email = h2r("email");
 *
 * // Rapid validation setup
 * const phone = h2r("US phone", "+1-555-0123");
 * if (phone.success && phone.confidence > 0.8) {
 *   // Use phone.pattern for validation
 * }
 *
 * // Inline pattern generation
 * const isValid = h2r("starts with A ends with Z").pattern?.test("AMAZING");
 * ```
 */
export const h2r = parseHumanTextToRegex; // human to regex

/**
 * Efficient text-to-regex transformation with streamlined syntax.
 * This abbreviated alias for `parseHumanTextToRegex` maintains full functionality
 * while providing a more concise interface for frequent pattern generation tasks
 * and integration into larger text processing workflows.
 *
 * @param humanText - Descriptive text specifying the desired regex pattern behavior.
 *   Supports all pattern types: simple keywords, complex multi-part requirements,
 *   length constraints, character classes, and specialized format patterns.
 * @param testValue - Optional test input for pattern validation and confidence calculation.
 *   Enables immediate verification that the generated pattern works as expected.
 * @returns Complete `TextExtractionResult` object with comprehensive pattern data:
 *   - `success`: Whether text parsing and pattern generation succeeded
 *   - `pattern`: Ready-to-use RegExp object (undefined if generation failed)
 *   - `confidence`: Numerical confidence score indicating pattern reliability
 *   - `description`: Human-readable explanation of the pattern's matching behavior
 *   - `suggestions`: Actionable advice for pattern improvement or troubleshooting
 *
 * @example
 * ```typescript
 * // Compact pattern creation
 * const uuid = t2r("uuid format");
 * const valid = uuid.pattern?.test("550e8400-e29b-41d4-a716-446655440000");
 *
 * // Quick validation pipeline
 * const result = t2r("alphanumeric 8-16 chars", "password123");
 * console.log(`Confidence: ${result.confidence}, Valid: ${result.success}`);
 *
 * // Streamlined error handling
 * const pattern = t2r("complex requirement").pattern || /fallback/;
 * ```
 */
export const t2r = parseHumanTextToRegex; // text to regex

/**
 * Rapid human-to-validation conversion with concise syntax.
 * This short alias for `parseHumanTextToValidation` offers the same comprehensive
 * validation rule extraction capabilities in a compact form perfect for quick
 * validation setup and dynamic rule generation.
 *
 * @param humanText - Natural language validation requirements description.
 *   Handles complex validation scenarios: required fields, format constraints,
 *   length requirements, character composition rules, and custom validation logic.
 * @param testValue - Optional input for immediate validation testing and rule verification.
 *   Provides instant feedback on whether the input meets the described requirements.
 * @returns Full `ValidationExtractionResult` with detailed validation information:
 *   - `success`: Successful validation rule extraction indicator
 *   - `rules`: Array of structured validation rules with patterns and messages
 *   - `confidence`: Overall extraction confidence and rule reliability score
 *   - `description`: Summary of extracted validation requirements
 *   - `suggestions`: Helpful guidance for validation improvement
 *   - `allPassed`: Whether test value passes all extracted rules (when provided)
 *   - `caseUnPassed`: List of failed validation rule names (when test provided)
 *
 * @example
 * ```typescript
 * // Quick validation setup
 * const rules = h2v("required email strong password");
 *
 * // Inline validation checking
 * const check = h2v("phone number", "555-1234");
 * if (check.allPassed) console.log("Valid phone number");
 *
 * // Dynamic rule generation
 * const userRules = h2v(userInput).rules;
 * userRules.forEach(rule => validateField(inputValue, rule));
 * ```
 */
export const h2v = parseHumanTextToValidation; // human to validation

/**
 * Streamlined text-to-validation rule conversion.
 * This efficient alias for `parseHumanTextToValidation` provides full validation
 * rule extraction capabilities with abbreviated syntax ideal for form validation,
 * input checking, and automated validation pipeline creation.
 *
 * @param humanText - Textual description of validation constraints and requirements.
 *   Supports comprehensive validation scenarios: mandatory fields, format validation,
 *   security requirements, length constraints, and complex multi-rule validation.
 * @param testValue - Optional test input for immediate rule application and validation feedback.
 *   Enables real-time validation testing and confidence adjustment based on actual data.
 * @returns Comprehensive `ValidationExtractionResult` with complete validation context:
 *   - `success`: Indicates successful validation rule parsing and extraction
 *   - `rules`: Structured validation rules ready for implementation
 *   - `confidence`: Numeric confidence in the extracted validation logic
 *   - `description`: Clear summary of validation requirements and behavior
 *   - `suggestions`: Constructive feedback for validation improvement
 *   - `allPassed`: Overall validation status for provided test input
 *   - `caseUnPassed`: Specific rules that failed validation (debugging aid)
 *
 * @example
 * ```typescript
 * // Rapid form validation
 * const formRules = t2v("required username email password minimum 8 characters");
 *
 * // Conditional validation
 * const emailCheck = t2v("optional email format", userEmail);
 * if (userEmail && !emailCheck.allPassed) showError("Invalid email");
 *
 * // Batch validation processing
 * const inputs = ["required name", "phone number", "age between 18 and 100"];
 * const validators = inputs.map(desc => t2v(desc));
 * ```
 */
export const t2v = parseHumanTextToValidation; // text to validation

/**
 * Smart pattern suggestion generator with minimal syntax.
 * This compact alias for `getPatternSuggestions` provides intelligent pattern
 * recommendations and guidance using the same sophisticated analysis capabilities
 * in a streamlined interface perfect for user assistance and pattern discovery.
 *
 * @param text - Input text requiring pattern suggestions or clarification.
 *   Can include partial words, typos, unclear descriptions, or exploratory queries
 *   that need intelligent interpretation and helpful recommendations.
 * @returns Curated array of relevant suggestion strings (top 5 most helpful):
 *   - Smart corrections for common typos and partial matches
 *   - Available pattern categories with descriptive keywords
 *   - Example usage patterns and best practices
 *   - General guidance for effective pattern description
 *
 * @example
 * ```typescript
 * // Quick suggestion lookup
 * const help = suggest("phon");
 * // Returns phone pattern suggestions and keywords
 *
 * // Typo assistance
 * const fixes = suggest("emial addres");
 * // Suggests "email address" with proper keywords
 *
 * // Pattern discovery
 * const options = suggest("date");
 * // Returns various date format options and examples
 * ```
 */
export const suggest = getPatternSuggestions;
