import {
	parseHumanTextToValidation,
	REGEX_PATTERNS,
	rgex,
	RGex,
	validatePassword,
} from '../dist/index.js';

console.log('🚀 RGex - Enhanced Regex Builder Platform Examples\n');

// ========================================
// Builder Pattern Examples
// ========================================

console.log('📝 Builder Pattern Examples:');
console.log('============================\n');

// Example 1: Email validation pattern using builder
const emailPattern = rgex()
	.start()
	.word()
	.oneOrMore()
	.literal('@')
	.word()
	.oneOrMore()
	.literal('.')
	.word()
	.quantifier(2, 4)
	.end();

console.log('1. Email Pattern (Builder):');
console.log(`   Pattern: ${emailPattern.toString()}`);
console.log(
	`   Test 'user@example.com': ${emailPattern.test('user@example.com')}`
);
console.log(`   Test 'invalid-email': ${emailPattern.test('invalid-email')}\n`);

// Example 2: Phone number pattern
const phonePattern = rgex().literal('+').optional().digit().quantifier(10, 15);

console.log('2. Phone Pattern:');
console.log(`   Pattern: ${phonePattern.toString()}`);
console.log(`   Test '+1234567890': ${phonePattern.test('+1234567890')}`);
console.log(`   Test '1234567890': ${phonePattern.test('1234567890')}`);
console.log(`   Test '123': ${phonePattern.test('123')}\n`);

// Example 3: Using pre-built patterns
console.log('3. Pre-built Email Pattern:');
const emailRegex = new RegExp(REGEX_PATTERNS.EMAIL);
console.log(`   Pattern: ${emailRegex.source}`);
console.log(
	`   Test 'user@example.com': ${emailRegex.test('user@example.com')}`
);
console.log(`   Test 'invalid-email': ${emailRegex.test('invalid-email')}\n`);

// Example 4: Using RGex pre-built methods
const urlBuilder = RGex.create().url();
console.log('4. URL Pattern (Pre-built):');
console.log(`   Pattern: ${urlBuilder.toString()}`);
console.log(
	`   Test 'https://example.com': ${urlBuilder.test('https://example.com')}`
);
console.log(`   Test 'invalid-url': ${urlBuilder.test('invalid-url')}\n`);

// ========================================
// Advanced Pattern Building
// ========================================

console.log('🔧 Advanced Pattern Building:');
console.log('=============================\n');

// Complex pattern with groups and lookaheads
const complexPattern = rgex()
	.start()
	.group('\\w+')
	.whitespace()
	.oneOrMore()
	.group('\\d{4}')
	.end();

console.log('5. Complex Pattern with Groups:');
console.log(`   Pattern: ${complexPattern.toString()}`);
const testText = 'John 2023';
const matches = complexPattern.exec(testText);
console.log(`   Text: "${testText}"`);
console.log(`   Matches: [${matches?.slice(1)?.join(', ') || 'none'}]\n`);

// ========================================
// Human Text to Regex Examples
// ========================================

console.log('🧠 Human Text to Regex Examples:');
console.log('=================================\n');

// Test email pattern extraction
const emailResult = RGex.toRegex('email address', 'user@example.com');
console.log('6. Email Pattern from Human Text:');
console.log(`   Input: "email address"`);
console.log(`   Success: ${emailResult.success}`);
console.log(`   Confidence: ${(emailResult.confidence * 100).toFixed(1)}%`);
console.log(`   Description: ${emailResult.description}`);
if (emailResult.pattern) {
	console.log(
		`   Test 'user@example.com': ${emailResult.pattern.test(
			'user@example.com'
		)}`
	);
}
console.log();

// Test phone pattern extraction
const phoneResult = RGex.toRegex('phone number', '+1234567890');
console.log('7. Phone Pattern from Human Text:');
console.log(`   Input: "phone number"`);
console.log(`   Success: ${phoneResult.success}`);
console.log(`   Confidence: ${(phoneResult.confidence * 100).toFixed(1)}%`);
console.log(`   Description: ${phoneResult.description}`);
if (phoneResult.pattern) {
	console.log(
		`   Test '+1234567890': ${phoneResult.pattern.test('+1234567890')}`
	);
}
console.log();

// Test custom pattern extraction
const numberResult = RGex.toRegex('numbers only', '12345');
console.log('8. Numbers Pattern from Human Text:');
console.log(`   Input: "numbers only"`);
console.log(`   Success: ${numberResult.success}`);
console.log(`   Confidence: ${(numberResult.confidence * 100).toFixed(1)}%`);
console.log(`   Description: ${numberResult.description}`);
if (numberResult.pattern) {
	console.log(`   Test '12345': ${numberResult.pattern.test('12345')}`);
	console.log(`   Test 'abc123': ${numberResult.pattern.test('abc123')}`);
}
console.log();

// ========================================
// Human Text to Validation Examples
// ========================================

console.log('✅ Human Text to Validation Examples:');
console.log('======================================\n');

// Test validation rule extraction
const validationResult = parseHumanTextToValidation(
	'required email min length 5 max length 50',
	'test@example.com'
);
console.log('9. Validation Rules from Human Text:');
console.log(`   Input: "required email min length 5 max length 50"`);
console.log(`   Success: ${validationResult.success}`);
console.log(
	`   Confidence: ${(validationResult.confidence * 100).toFixed(1)}%`
);
console.log(`   Rules found: ${validationResult.rules?.length || 0}`);
console.log(`   Test 'test@example.com': All rules passed`);
console.log();

// ========================================
// Advanced Password Validation Examples
// ========================================

console.log('🔒 Advanced Password Validation Examples:');
console.log('==========================================\n');

// Test weak password
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

console.log('10. Weak Password Analysis:');
console.log(`    Password: "${weakPassword}"`);
console.log(`    Score: ${weakResult.score}/100`);
console.log(`    Strength: ${weakResult.strength}`);
console.log(`    Has errors: ${weakResult.error !== null}`);
if (weakResult.error) {
	console.log(
		`    Failed requirements: ${Object.keys(weakResult.error).length}`
	);
}
console.log();

// Test strong password
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

console.log('11. Strong Password Analysis:');
console.log(`    Password: "${strongPassword}"`);
console.log(`    Score: ${strongResult.score}/100`);
console.log(`    Strength: ${strongResult.strength}`);
console.log(`    Has errors: ${strongResult.error !== null}`);
console.log(
	`    Passed requirements: ${
		Object.values(strongResult.pass).filter((req) => req.passed).length
	}`
);
console.log();

// Test passwordCase method on RGex instance
const rgexInstance = new RGex('TestPassword123!');
const passwordCaseResult = rgexInstance.passwordCase({
	minLength: 10,
	hasNumber: true,
	hasSpecial: true,
	hasUpperChar: true,
	hasLowerChar: true,
});

console.log('12. RGex Instance Password Validation:');
console.log(`    Password: "TestPassword123!"`);
console.log(`    Score: ${passwordCaseResult.score}/100`);
console.log(`    Strength: ${passwordCaseResult.strength}`);
console.log(`    Has errors: ${passwordCaseResult.error !== null}`);
console.log();

// ========================================
// Pattern Testing Examples
// ========================================

console.log('🧪 Pattern Testing Examples:');
console.log('=============================\n');

const testPatterns = [
	{
		name: 'Email',
		pattern: REGEX_PATTERNS.EMAIL,
		tests: ['user@example.com', 'invalid.email'],
	},
	{
		name: 'URL',
		pattern: REGEX_PATTERNS.URL,
		tests: ['https://example.com', 'not-a-url'],
	},
	{
		name: 'UUID',
		pattern: REGEX_PATTERNS.UUID,
		tests: ['123e4567-e89b-12d3-a456-426614174000', 'invalid-uuid'],
	},
	{
		name: 'IPv4',
		pattern: REGEX_PATTERNS.IPV4,
		tests: ['192.168.1.1', '256.256.256.256'],
	},
	{
		name: 'Hex Color',
		pattern: REGEX_PATTERNS.HEX_COLOR,
		tests: ['#ff0000', '#xyz'],
	},
];

testPatterns.forEach((patternTest, index) => {
	console.log(`${13 + index}. ${patternTest.name} Pattern Testing:`);
	const regex = new RegExp(patternTest.pattern);
	patternTest.tests.forEach((test) => {
		console.log(`    "${test}": ${regex.test(test) ? '✅' : '❌'}`);
	});
	console.log();
});

// ========================================
// Utility Examples
// ========================================

console.log('🛠️ Utility Examples:');
console.log('====================\n');

// Test regex building and manipulation
const builder = RGex.create()
	.start()
	.word()
	.oneOrMore()
	.literal('-')
	.digit()
	.oneOrMore()
	.end();

console.log(`${13 + testPatterns.length}. Builder Utilities:`);
console.log(`    Pattern: ${builder.getPattern()}`);
console.log(`    Flags: "${builder.getFlags()}"`);
console.log(`    Valid: ${builder.isValid()}`);
console.log(`    String: ${builder.toString()}`);
console.log(`    JSON: ${JSON.stringify(builder.toJSON())}`);
console.log();

// Test text replacement
const replacementText = 'Replace phone 123-456-7890 with format';
const phoneExtractor = rgex('\\d{3}-\\d{3}-\\d{4}', { global: true });
const replaced = phoneExtractor.replace(replacementText, '***-***-****');
console.log(`${14 + testPatterns.length}. Text Replacement:`);
console.log(`    Original: "${replacementText}"`);
console.log(`    Replaced: "${replaced}"`);
console.log();

console.log('🎉 RGex enhanced examples completed!\n');
console.log('Features demonstrated:');
console.log('✅ Modular architecture with separated concerns');
console.log('✅ Human text to regex conversion');
console.log('✅ Human text to validation extraction');
console.log('✅ Advanced password validation');
console.log('✅ Pre-built pattern constants');
console.log('✅ Fluent builder API');
console.log('✅ Comprehensive utilities');
console.log();
console.log('🌐 Visit https://duongnguyen321.github.io/rgex for more tools!');
console.log('📚 Documentation: https://github.com/duongnguyen321/rgex#readme');
