import {
	rgex,
	RGex,
	REGEX_PATTERNS,
	validatePassword,
	parseHumanTextToValidation,
} from '../dist/index.js';

// Simple test runner
class TestRunner {
	private tests: Array<{ name: string; fn: () => void }> = [];
	private passed = 0;
	private failed = 0;

	test(name: string, fn: () => void) {
		this.tests.push({ name, fn });
	}

	assert(condition: boolean, message: string) {
		if (condition) {
			console.log(`✅ ${message}`);
			this.passed++;
		} else {
			console.log(`❌ ${message}`);
			this.failed++;
		}
	}

	assertEquals(actual: any, expected: any, message: string) {
		this.assert(
			actual === expected,
			`${message} (expected: ${expected}, got: ${actual})`
		);
	}

	assertMatch(pattern: RegExp, text: string, message: string) {
		this.assert(
			pattern.test(text),
			`${message} - "${text}" should match ${pattern}`
		);
	}

	assertNoMatch(pattern: RegExp, text: string, message: string) {
		this.assert(
			!pattern.test(text),
			`${message} - "${text}" should not match ${pattern}`
		);
	}

	run() {
		console.log('🧪 Running RGex Tests\n');
		console.log('===================\n');

		this.tests.forEach(({ name, fn }) => {
			console.log(`📋 ${name}`);
			try {
				fn();
			} catch (error) {
				console.log(`❌ Test failed with error: ${error}`);
				this.failed++;
			}
			console.log();
		});

		console.log('📊 Test Results:');
		console.log(`✅ Passed: ${this.passed}`);
		console.log(`❌ Failed: ${this.failed}`);
		console.log(`📈 Total: ${this.passed + this.failed}\n`);

		if (this.failed === 0) {
			console.log('🎉 All tests passed!');
		} else {
			console.log('💥 Some tests failed!');
		}
	}
}

const test = new TestRunner();

// ========================================
// Builder Pattern Tests
// ========================================

test.test('Basic Builder Methods', () => {
	const pattern = rgex().literal('hello');
	test.assertEquals(pattern.toString(), '/hello/', 'literal() should work');

	const startPattern = rgex().start().literal('test');
	test.assertEquals(startPattern.toString(), '/^test/', 'start() should add ^');

	const endPattern = rgex().literal('test').end();
	test.assertEquals(endPattern.toString(), '/test$/', 'end() should add $');

	const digitPattern = rgex().digit();
	test.assertEquals(digitPattern.toString(), '/\\d/', 'digit() should add \\d');
});

test.test('Chaining Methods', () => {
	const chained = rgex()
		.start()
		.literal('hello')
		.whitespace()
		.oneOrMore()
		.word()
		.zeroOrMore()
		.literal('world')
		.end();

	test.assertEquals(
		chained.toString(),
		'/^hello\\s+\\w*world$/',
		'method chaining should work'
	);
});

test.test('Quantifiers', () => {
	const optional = rgex().literal('a').optional();
	test.assertEquals(optional.toString(), '/a?/', 'optional() should add ?');

	const oneOrMore = rgex().literal('a').oneOrMore();
	test.assertEquals(oneOrMore.toString(), '/a+/', 'oneOrMore() should add +');

	const zeroOrMore = rgex().literal('a').zeroOrMore();
	test.assertEquals(zeroOrMore.toString(), '/a*/', 'zeroOrMore() should add *');

	const exactRepeat = rgex().literal('a').quantifier(3);
	test.assertEquals(
		exactRepeat.toString(),
		'/a{3}/',
		'quantifier(n) should add {n}'
	);

	const rangeRepeat = rgex().literal('a').quantifier(2, 5);
	test.assertEquals(
		rangeRepeat.toString(),
		'/a{2,5}/',
		'quantifier(min, max) should add {min,max}'
	);
});

test.test('Capture Groups', () => {
	const captured = rgex().group('\\d+');
	test.assertEquals(
		captured.toString(),
		'/(\\d+)/',
		'group() should add parentheses'
	);

	const nonCaptured = rgex().raw('(?:abc|def)');
	test.assertEquals(
		nonCaptured.toString(),
		'/(?:abc|def)/',
		'raw() with non-capturing pattern should work'
	);
});

test.test('Lookaheads and Lookbehinds', () => {
	const positiveLookahead = rgex().lookahead('test', false);
	test.assertEquals(
		positiveLookahead.toString(),
		'/(?=test)/',
		'lookahead() should work'
	);

	const negativeLookahead = rgex().lookahead('test', true);
	test.assertEquals(
		negativeLookahead.toString(),
		'/(?!test)/',
		'negative lookahead should work'
	);

	const positiveLookbehind = rgex().lookbehind('test', false);
	test.assertEquals(
		positiveLookbehind.toString(),
		'/(?<=test)/',
		'lookbehind() should work'
	);

	const negativeLookbehind = rgex().lookbehind('test', true);
	test.assertEquals(
		negativeLookbehind.toString(),
		'/(?<!test)/',
		'negative lookbehind should work'
	);
});

// ========================================
// Pre-built Pattern Tests
// ========================================

test.test('Pre-built Pattern Constants', () => {
	const emailRegex = new RegExp(REGEX_PATTERNS.EMAIL);
	test.assertMatch(
		emailRegex,
		'user@example.com',
		'Email pattern should match valid email'
	);
	test.assertNoMatch(
		emailRegex,
		'invalid.email',
		'Email pattern should not match invalid email'
	);

	const urlRegex = new RegExp(REGEX_PATTERNS.URL);
	test.assertMatch(
		urlRegex,
		'https://example.com',
		'URL pattern should match valid URL'
	);
	test.assertNoMatch(
		urlRegex,
		'not-a-url',
		'URL pattern should not match invalid URL'
	);

	const uuidRegex = new RegExp(REGEX_PATTERNS.UUID);
	test.assertMatch(
		uuidRegex,
		'123e4567-e89b-12d3-a456-426614174000',
		'UUID pattern should match valid UUID'
	);
	test.assertNoMatch(
		uuidRegex,
		'invalid-uuid',
		'UUID pattern should not match invalid UUID'
	);
});

test.test('Pre-built Builder Methods', () => {
	const emailBuilder = RGex.create().email();
	const emailRegex = new RegExp(emailBuilder.getPattern());
	test.assertMatch(
		emailRegex,
		'user@example.com',
		'Email builder should match valid email'
	);
	test.assertNoMatch(
		emailRegex,
		'invalid.email',
		'Email builder should not match invalid email'
	);

	const urlBuilder = RGex.create().url();
	const urlRegex = new RegExp(urlBuilder.getPattern());
	test.assertMatch(
		urlRegex,
		'https://example.com',
		'URL builder should match valid URL'
	);
	test.assertNoMatch(
		urlRegex,
		'not-a-url',
		'URL builder should not match invalid URL'
	);
});

// ========================================
// Utility Methods Tests
// ========================================

test.test('Utility Methods', () => {
	const pattern = rgex('\\d+');

	test.assert(pattern.test('123'), 'test() should work');
	test.assert(!pattern.test('abc'), 'test() should return false for non-match');

	const matches = pattern.exec('abc123def');
	test.assert(matches !== null, 'exec() should return matches');
	test.assertEquals(matches?.[0], '123', 'exec() should return correct match');

	const replaced = pattern.replace('abc123def', 'XXX');
	test.assertEquals(replaced, 'abcXXXdef', 'replace() should work');

	const splitPattern = rgex(',');
	const parts = splitPattern.split('a,b,c');
	test.assertEquals(
		parts.length,
		3,
		'split() should create correct number of parts'
	);
	test.assertEquals(parts[0], 'a', 'split() should work correctly');
});

test.test('Regex Flags', () => {
	const global = rgex('test', { global: true });
	test.assert(global.getFlags().includes('g'), 'Global flag should be set');

	const caseInsensitive = rgex('test', { ignoreCase: true });
	test.assert(
		caseInsensitive.getFlags().includes('i'),
		'Case insensitive flag should be set'
	);

	const multiline = rgex('test', { multiline: true });
	test.assert(
		multiline.getFlags().includes('m'),
		'Multiline flag should be set'
	);
});

test.test('Complex Real-world Example', () => {
	const datePattern = rgex()
		.start()
		.group('\\d{4}')
		.literal('-')
		.group('\\d{2}')
		.literal('-')
		.group('\\d{2}')
		.end();

	const matches = datePattern.exec('2023-12-25');
	test.assert(matches !== null, 'Date pattern should match');
	test.assertEquals(matches?.[1], '2023', 'Should capture year');
	test.assertEquals(matches?.[2], '12', 'Should capture month');
	test.assertEquals(matches?.[3], '25', 'Should capture day');
});

// ========================================
// Human Text to Regex Tests
// ========================================

test.test('Human Text to Regex', () => {
	const emailResult = RGex.toRegex('email address', 'user@example.com');
	test.assert(emailResult.success, 'Should extract email pattern successfully');
	test.assert(
		emailResult.confidence > 0.8,
		'Should have high confidence for email'
	);
	test.assert(emailResult.pattern !== null, 'Should return a pattern');
	test.assert(
		!!emailResult.pattern?.test('user@example.com'),
		'Pattern should validate emails'
	);

	const phoneResult = RGex.toRegex('phone number', '+1234567890');
	test.assert(phoneResult.success, 'Should extract phone pattern successfully');
	test.assert(
		phoneResult.confidence > 0.8,
		'Should have high confidence for phone'
	);
	test.assert(
		!!phoneResult.pattern?.test('+1234567890'),
		'Pattern should validate phones'
	);

	const numberResult = RGex.toRegex('numbers only', '12345');
	test.assert(
		numberResult.success,
		'Should extract custom pattern successfully'
	);
	test.assert(
		!!numberResult.pattern?.test('12345'),
		'Pattern should validate numbers only'
	);
	test.assert(
		!numberResult.pattern?.test('abc123'),
		'Pattern should reject letters'
	);

	const unknownResult = RGex.toRegex('xyzzy quantum flux gibberish', 'test');
	test.assert(
		!unknownResult.success || unknownResult.confidence < 0.5,
		'Should fail for unknown patterns'
	);
	test.assert(
		typeof unknownResult.description === 'string',
		'Should provide error message'
	);
});

// ========================================
// Human Text to Validation Tests
// ========================================

test.test('Human Text to Validation', () => {
	const emailValidation = parseHumanTextToValidation(
		'required email address',
		'test@example.com'
	);
	test.assert(emailValidation.success, 'Should extract email validation rules');
	test.assert(
		(emailValidation.rules?.length || 0) >= 2,
		'Should have at least 2 rules (required and email pattern)'
	);
	test.assert(
		emailValidation.confidence > 0,
		'Should have positive confidence'
	);
	test.assert(
		!!emailValidation.rules?.some((r) => r.name === 'required'),
		'Should contain a required rule'
	);
	test.assert(
		!!emailValidation.rules?.some((r) => r.pattern instanceof RegExp),
		'Should contain a regex pattern rule'
	);

	const passwordValidation = parseHumanTextToValidation(
		'strong password min length 8',
		'Test123!@#'
	);
	test.assert(
		passwordValidation.success,
		'Should extract password validation rules'
	);
	test.assert(
		!!passwordValidation.rules?.some((r) => r.name === 'strongPassword'),
		'Should include the strongPassword validator rule'
	);
	test.assert(
		!!passwordValidation.rules?.some((r) => r.pattern?.source.includes('{8,}')),
		'Should include a regex rule with min length 8'
	);

	const lengthValidation = parseHumanTextToValidation(
		'text between 5 and 10 characters',
		'testing'
	);
	test.assert(
		lengthValidation.success,
		'Should extract length validation rules'
	);
	test.assertEquals(
		lengthValidation.rules?.length,
		1,
		'Should have exactly 1 rule for length range'
	);
	const lengthRule = lengthValidation.rules?.[0];
	test.assert(
		!!lengthRule?.pattern?.test('12345'),
		'Length pattern should match min length'
	);
	test.assert(
		!!lengthRule?.pattern?.test('1234567890'),
		'Length pattern should match max length'
	);
	test.assert(
		!lengthRule?.pattern?.test('1234'),
		'Length pattern should not match below min length'
	);
	test.assert(
		!lengthRule?.pattern?.test('12345678901'),
		'Length pattern should not match above max length'
	);

	const complexValidation = parseHumanTextToValidation(
		'required email between 10 and 50 characters',
		'test@example.com'
	);
	test.assert(
		complexValidation.success,
		'Should extract multiple validation rules'
	);
	test.assert(
		(complexValidation.rules?.length || 0) >= 2,
		'Should have at least 2 rules for complex query'
	);
});

// ========================================
// Advanced Password Validation Tests
// ========================================

test.test('Advanced Password Validation', () => {
	const weakPassword = 'password123';
	const weakResult = validatePassword(weakPassword, {
		minLength: 8,
		maxLength: 50,
		hasNumber: true,
		hasSpecial: true,
		hasUpperChar: true,
		hasLowerChar: true,
		noCommonWords: true,
	});

	test.assert(weakResult.error !== null, 'Weak password should have errors');
	test.assert(
		['weak', 'fair', 'strong'].includes(weakResult.strength),
		'Should be classified as weak/fair'
	);
	test.assert(weakResult.score >= 0, 'Should have valid score');
	test.assert(
		!weakResult.pass.hasSpecial.passed,
		'Should fail special char requirement'
	);
	test.assert(
		!weakResult.pass.hasUpperChar.passed,
		'Should fail uppercase requirement'
	);
	test.assert(
		!weakResult.pass.noCommonWords.passed,
		'Should fail common words check'
	);

	const strongPassword = 'MyStr0ng!P@ssw0rd2024';
	const strongResult = validatePassword(strongPassword, {
		minLength: 8,
		maxLength: 50,
		hasNumber: true,
		hasSpecial: true,
		hasUpperChar: true,
		hasLowerChar: true,
		noSequential: true,
		noRepeating: true,
		noCommonWords: true,
	});

	test.assert(
		strongResult.error === null,
		'Strong password should have no errors'
	);
	test.assert(
		['strong', 'very-strong'].includes(strongResult.strength),
		'Should be classified as strong'
	);
	test.assert(strongResult.score >= 80, 'Should have high score');
	test.assert(strongResult.pass.length.passed, 'Should pass length check');
	test.assert(strongResult.pass.hasNumber.passed, 'Should pass number check');
	test.assert(
		strongResult.pass.hasSpecial.passed,
		'Should pass special char check'
	);

	const customPatternPassword = 'AdminUser2024!';
	const customResult = validatePassword(customPatternPassword, {
		minLength: 10,
		hasNumber: true,
		hasSpecial: true,
		hasUpperChar: true,
		hasLowerChar: true,
		customPattern: '.*[A-Z].*[A-Z].*', // At least 2 uppercase letters (not necessarily consecutive)
		noCommonWords: true,
	});

	test.assert(
		customResult.pass.customPattern.passed,
		'Should pass custom pattern'
	);
	test.assert(customResult.score >= 60, 'Should have decent score');

	// Test sequential characters
	const sequentialPassword = 'Abcd1234!';
	const sequentialResult = validatePassword(sequentialPassword, {
		minLength: 8,
		noSequential: true,
	});
	test.assert(
		!sequentialResult.pass.noSequential.passed,
		'Should detect sequential characters'
	);
	test.assert(sequentialResult.error !== null, 'Should fail sequential check');

	// Test repeating characters
	const repeatingPassword = 'Aaa111!!';
	const repeatingResult = validatePassword(repeatingPassword, {
		minLength: 8,
		noRepeating: true,
	});
	test.assert(
		!repeatingResult.pass.noRepeating.passed,
		'Should detect repeating characters'
	);
	test.assert(repeatingResult.error !== null, 'Should fail repeating check');

	// Test very short password
	const shortPassword = '123';
	const shortResult = validatePassword(shortPassword, {
		minLength: 8,
	});
	test.assert(
		!shortResult.pass.length.passed,
		'Should fail basic length check'
	);
	test.assert(shortResult.strength === 'very-weak', 'Should be very weak');
});

test.test('Password Strength Scoring', () => {
	const veryWeakPassword = '123';
	const veryWeakResult = validatePassword(veryWeakPassword, {});
	test.assert(veryWeakResult.strength === 'very-weak', 'Should be very weak');
	test.assert(veryWeakResult.score <= 20, 'Should have very low score');

	const weakPassword = 'password';
	const weakResult = validatePassword(weakPassword, {});
	test.assert(weakResult.strength === 'weak', 'Should be weak');
	test.assert(weakResult.score <= 40, 'Should have low score');

	const fairPassword = 'Password123';
	const fairResult = validatePassword(fairPassword, {});
	test.assert(
		fairResult.score > 40 && fairResult.score <= 60,
		'Should have fair score'
	);

	const goodPassword = 'Password123!';
	const goodResult = validatePassword(goodPassword, {});
	test.assert(
		goodResult.score > 60 && goodResult.score <= 80,
		'Should have good score'
	);

	const strongPassword = 'MyVeryStr0ng!P@ssw0rd2024';
	const strongResult = validatePassword(strongPassword, {});
	test.assert(strongResult.score > 80, 'Should have strong score');
});

// ========================================
// Error Handling Tests
// ========================================

test.test('Error Handling for New Features', () => {
	const unknownPattern = RGex.toRegex(
		'completely unknown pattern type',
		'test'
	);
	test.assert(!unknownPattern.success, 'Should fail for unknown patterns');
	test.assert(
		typeof unknownPattern.description === 'string',
		'Should provide error message'
	);
	test.assert(
		Array.isArray(unknownPattern.suggestions),
		'Should provide suggestions'
	);

	const unknownValidation = parseHumanTextToValidation(
		'unknown validation type',
		'test'
	);
	test.assert(
		!unknownValidation.success,
		'Should fail for unknown validation types'
	);
	test.assert(
		typeof unknownValidation.description === 'string',
		'Should provide error message'
	);
	test.assert(
		Array.isArray(unknownValidation.suggestions),
		'Should provide suggestions'
	);

	const invalidCustomPattern = validatePassword('TestPassword123!', {
		customPattern: '[invalid regex pattern',
	});
	test.assert(
		!invalidCustomPattern.pass.customPattern.passed,
		'Should fail with invalid custom pattern'
	);
	test.assert(
		invalidCustomPattern.error !== null,
		'Should not pass custom pattern check'
	);
});

// ========================================
// Builder Utility Tests
// ========================================

test.test('Builder Utilities', () => {
	const builder = RGex.create()
		.start()
		.word()
		.oneOrMore()
		.literal('-')
		.digit()
		.oneOrMore()
		.end();

	test.assertEquals(
		builder.getPattern(),
		'^\\w+-\\d+$',
		'getPattern() should return pattern string'
	);
	test.assertEquals(
		builder.getFlags(),
		'',
		'getFlags() should return flags string'
	);
	test.assert(
		builder.isValid(),
		'isValid() should return true for valid pattern'
	);
	test.assert(
		builder.toString().includes('\\w+-\\d+'),
		'toString() should include pattern'
	);

	const json = builder.toJSON();
	test.assert(typeof json === 'object', 'toJSON() should return object');
	test.assert(!!json.pattern, 'JSON should include pattern');
	test.assert(
		typeof json.valid === 'boolean',
		'JSON should include valid flag'
	);
});

test.test('passwordCase Method on RGex Instance', () => {
	const rgexInstance = new RGex('TestPassword123!');
	const result = rgexInstance.passwordCase({
		minLength: 10,
		hasNumber: true,
		hasSpecial: true,
		hasUpperChar: true,
		hasLowerChar: true,
	});

	test.assert(typeof result.score === 'number', 'Should return numeric score');
	test.assert(
		typeof result.strength === 'string',
		'Should return strength classification'
	);
	test.assert(typeof result.pass === 'object', 'Should return pass object');
	test.assert(
		result.error === null || typeof result.error === 'object',
		'Should return error object or null'
	);
});

// Run all tests
test.run();
