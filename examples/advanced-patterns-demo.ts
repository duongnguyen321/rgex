/**
 * Advanced Combined Patterns Demo
 * Showcasing the enhanced t2r function with complex multi-requirement patterns
 */

import { t2r } from '../dist/index.js';

console.log('🚀 Advanced Combined Patterns Demo\n');
console.log('='.repeat(60));

// BUSINESS & PROFESSIONAL PATTERNS
console.log('\n📊 BUSINESS & PROFESSIONAL PATTERNS');
console.log('-'.repeat(40));

const businessPatterns = [
	{
		description: 'employee id with department prefix and 4 digit number',
		testCases: ['HR-1234', 'IT-5678', 'MKT-9999', 'HR-12'], // Last one should fail
	},
	{
		description: 'invoice number with year and sequential number',
		testCases: ['INV-2024-001234', 'INV-2023-999999', 'INV-24-001234'], // Last one should fail
	},
	{
		description: 'product sku with category letters and numeric code',
		testCases: ['ELE-12345', 'CLO-67890', 'FOO-99999', 'E-12345'], // Last one should fail
	},
];

businessPatterns.forEach(({ description, testCases }) => {
	console.log(`\n🔍 Pattern: "${description}"`);
	const result = t2r(description);
	console.log(`   Success: ${result.success}`);
	console.log(`   Confidence: ${result.confidence.toFixed(2)}`);
	console.log(`   Pattern: ${result.pattern?.source || 'N/A'}`);
	console.log(`   Description: ${result.description}`);

	testCases.forEach((testCase) => {
		const matches = result.pattern?.test(testCase) || false;
		console.log(
			`   Test "${testCase}": ${matches ? '✅ MATCH' : '❌ NO MATCH'}`
		);
	});
});

// ADVANCED SECURITY PATTERNS
console.log('\n🔐 ADVANCED SECURITY PATTERNS');
console.log('-'.repeat(40));

const securityPatterns = [
	{
		description: 'two factor authentication code 6 digits with optional spaces',
		testCases: ['123456', '123 456', '12345'], // Last one should fail
	},
	{
		description: 'api key with prefix and 32 character hex string',
		testCases: ['sk_1234567890abcdef1234567890abcdef', 'sk_123'], // Last one should fail
	},
	{
		description: 'jwt token with three base64 parts separated by dots',
		testCases: [
			'eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIn0.Gfx6VO9tcxwk6xqx9yYzSfebfeakZp5JYIgP_edcw_A',
			'eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIn0', // Missing signature
		],
	},
];

securityPatterns.forEach(({ description, testCases }) => {
	console.log(`\n🔍 Pattern: "${description}"`);
	const result = t2r(description);
	console.log(`   Success: ${result.success}`);
	console.log(`   Confidence: ${result.confidence.toFixed(2)}`);
	console.log(`   Pattern: ${result.pattern?.source || 'N/A'}`);
	console.log(`   Description: ${result.description}`);

	testCases.forEach((testCase) => {
		const matches = result.pattern?.test(testCase) || false;
		const displayCase =
			testCase.length > 50 ? testCase.substring(0, 50) + '...' : testCase;
		console.log(
			`   Test "${displayCase}": ${matches ? '✅ MATCH' : '❌ NO MATCH'}`
		);
	});
});

// COMMUNICATION PATTERNS
console.log('\n💬 COMMUNICATION PATTERNS');
console.log('-'.repeat(40));

const communicationPatterns = [
	{
		description: 'slack channel name with hash and lowercase letters',
		testCases: ['#general', '#dev-team-frontend', '#General'], // Last one should fail
	},
	{
		description: 'discord username with discriminator number',
		testCases: ['username#1234', 'cool_user#9999', 'username'], // Last one should fail
	},
	{
		description: 'mention with at symbol and alphanumeric username',
		testCases: ['@john_doe123', '@jane.smith', 'john_doe123'], // Last one should fail
	},
];

communicationPatterns.forEach(({ description, testCases }) => {
	console.log(`\n🔍 Pattern: "${description}"`);
	const result = t2r(description);
	console.log(`   Success: ${result.success}`);
	console.log(`   Confidence: ${result.confidence.toFixed(2)}`);
	console.log(`   Pattern: ${result.pattern?.source || 'N/A'}`);
	console.log(`   Description: ${result.description}`);

	testCases.forEach((testCase) => {
		const matches = result.pattern?.test(testCase) || false;
		console.log(
			`   Test "${testCase}": ${matches ? '✅ MATCH' : '❌ NO MATCH'}`
		);
	});
});

// FINANCIAL & BANKING PATTERNS
console.log('\n💰 FINANCIAL & BANKING PATTERNS');
console.log('-'.repeat(40));

const financialPatterns = [
	{
		description: 'iban with country code and check digits',
		testCases: [
			'GB82WEST12345698765432',
			'DE89370400440532013000',
			'GB82WEST123',
		], // Last one should fail
	},
	{
		description: 'bitcoin address with 1 or 3 prefix and base58 characters',
		testCases: [
			'1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa',
			'3J98t1WpEZ73CNmQviecrnyiWrnqRhWNLy',
			'2A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa',
		], // Last one should fail
	},
	{
		description: 'swift code with 8 or 11 characters bank identifier',
		testCases: ['DEUTDEFF', 'DEUTDEFF500', 'DEUT'], // Last one should fail
	},
];

financialPatterns.forEach(({ description, testCases }) => {
	console.log(`\n🔍 Pattern: "${description}"`);
	const result = t2r(description);
	console.log(`   Success: ${result.success}`);
	console.log(`   Confidence: ${result.confidence.toFixed(2)}`);
	console.log(`   Pattern: ${result.pattern?.source || 'N/A'}`);
	console.log(`   Description: ${result.description}`);

	testCases.forEach((testCase) => {
		const matches = result.pattern?.test(testCase) || false;
		console.log(
			`   Test "${testCase}": ${matches ? '✅ MATCH' : '❌ NO MATCH'}`
		);
	});
});

// COMPLEX VALIDATION PATTERNS
console.log('\n🔒 COMPLEX VALIDATION PATTERNS');
console.log('-'.repeat(40));

const validationPatterns = [
	{
		description:
			'password with 2 uppercase 2 lowercase 2 numbers 2 special minimum 12 characters no common words',
		testCases: ['MyStr0ng!Pass@2024', 'Password123!', 'MyStr0ng!Pass'], // Last two should fail
	},
	{
		description:
			'email with custom domain not gmail yahoo hotmail and minimum 5 characters before at',
		testCases: ['user12@company.com', 'user@gmail.com', 'usr@company.com'], // Last two should fail
	},
	{
		description:
			'phone number with country code area code and exactly 10 digits total',
		testCases: ['+1-555-123-4567', '+1 555 123 4567', '+1-555-123-456'], // Last one should fail
	},
];

validationPatterns.forEach(({ description, testCases }) => {
	console.log(`\n🔍 Pattern: "${description}"`);
	const result = t2r(description);
	console.log(`   Success: ${result.success}`);
	console.log(`   Confidence: ${result.confidence.toFixed(2)}`);
	console.log(`   Pattern: ${result.pattern?.source || 'N/A'}`);
	console.log(`   Description: ${result.description}`);

	testCases.forEach((testCase) => {
		const matches = result.pattern?.test(testCase) || false;
		console.log(
			`   Test "${testCase}": ${matches ? '✅ MATCH' : '❌ NO MATCH'}`
		);
	});
});

// TRANSPORTATION PATTERNS
console.log('\n🚗 TRANSPORTATION PATTERNS');
console.log('-'.repeat(40));

const transportationPatterns = [
	{
		description: 'license plate with 3 letters and 4 numbers',
		testCases: ['ABC-1234', 'XYZ-9876', 'AB-1234'], // Last one should fail
	},
	{
		description: 'flight number with airline code and digits',
		testCases: ['AA1234', 'UA567', 'A1234'], // Last one should fail
	},
	{
		description: 'tracking number with carrier prefix and alphanumeric code',
		testCases: ['1Z999AA1234567890', 'FDX1234567890', '123456789'],
	},
];

transportationPatterns.forEach(({ description, testCases }) => {
	console.log(`\n🔍 Pattern: "${description}"`);
	const result = t2r(description);
	console.log(`   Success: ${result.success}`);
	console.log(`   Confidence: ${result.confidence.toFixed(2)}`);
	console.log(`   Pattern: ${result.pattern?.source || 'N/A'}`);
	console.log(`   Description: ${result.description}`);

	testCases.forEach((testCase) => {
		const matches = result.pattern?.test(testCase) || false;
		console.log(
			`   Test "${testCase}": ${matches ? '✅ MATCH' : '❌ NO MATCH'}`
		);
	});
});

// TECHNOLOGY PATTERNS
console.log('\n💻 TECHNOLOGY PATTERNS');
console.log('-'.repeat(40));

const technologyPatterns = [
	{
		description: 'docker image tag with registry and version',
		testCases: ['nginx:1.21.0', 'mysql:latest', 'nginx'], // Last one should fail
	},
	{
		description: 'kubernetes pod name with deployment and random suffix',
		testCases: [
			'web-deployment-abc123',
			'api-service-xyz789',
			'web-deployment',
		],
	},
	{
		description: 'git commit hash with 7 or 40 hex characters',
		testCases: ['a1b2c3d', 'a1b2c3d4e5f6789012345678901234567890abcd', 'a1b2c'], // Last one should fail
	},
];

technologyPatterns.forEach(({ description, testCases }) => {
	console.log(`\n🔍 Pattern: "${description}"`);
	const result = t2r(description);
	console.log(`   Success: ${result.success}`);
	console.log(`   Confidence: ${result.confidence.toFixed(2)}`);
	console.log(`   Pattern: ${result.pattern?.source || 'N/A'}`);
	console.log(`   Description: ${result.description}`);

	testCases.forEach((testCase) => {
		const matches = result.pattern?.test(testCase) || false;
		console.log(
			`   Test "${testCase}": ${matches ? '✅ MATCH' : '❌ NO MATCH'}`
		);
	});
});

// INTERNATIONAL TEXT PATTERNS
console.log('\n🌍 INTERNATIONAL TEXT PATTERNS');
console.log('-'.repeat(40));

const internationalPatterns = [
	{
		description: 'text with unicode letters numbers and common punctuation',
		testCases: ['Hello 世界! 123', 'Café résumé naïve', 'Москва Россия'],
	},
	{
		description:
			'name with international characters and optional middle initial',
		testCases: ['José María García', '李 小明', 'John F. Kennedy'],
	},
];

internationalPatterns.forEach(({ description, testCases }) => {
	console.log(`\n🔍 Pattern: "${description}"`);
	const result = t2r(description);
	console.log(`   Success: ${result.success}`);
	console.log(`   Confidence: ${result.confidence.toFixed(2)}`);
	console.log(`   Pattern: ${result.pattern?.source || 'N/A'}`);
	console.log(`   Description: ${result.description}`);

	testCases.forEach((testCase) => {
		const matches = result.pattern?.test(testCase) || false;
		console.log(
			`   Test "${testCase}": ${matches ? '✅ MATCH' : '❌ NO MATCH'}`
		);
	});
});

// ADVANCED FILE PATTERNS
console.log('\n📁 ADVANCED FILE PATTERNS');
console.log('-'.repeat(40));

const filePatterns = [
	{
		description: 'file path with unix style forward slashes and no spaces',
		testCases: [
			'/home/user/documents/file.txt',
			'./relative/path/file.js',
			'/home/user/my file.txt',
		], // Last one should fail
	},
	{
		description:
			'semantic version with major minor patch and optional prerelease',
		testCases: ['1.2.3', '2.0.0-alpha.1', '1.0.0-beta+build.123', '1.2'], // Last one should fail
	},
	{
		description: 'log entry with timestamp level and message',
		testCases: [
			'2024-01-15 10:30:45 INFO Application started',
			'2024-01-15 10:30:45 ERROR Database connection failed',
			'Application started',
		], // Last one should fail
	},
];

filePatterns.forEach(({ description, testCases }) => {
	console.log(`\n🔍 Pattern: "${description}"`);
	const result = t2r(description);
	console.log(`   Success: ${result.success}`);
	console.log(`   Confidence: ${result.confidence.toFixed(2)}`);
	console.log(`   Pattern: ${result.pattern?.source || 'N/A'}`);
	console.log(`   Description: ${result.description}`);

	testCases.forEach((testCase) => {
		const matches = result.pattern?.test(testCase) || false;
		console.log(
			`   Test "${testCase}": ${matches ? '✅ MATCH' : '❌ NO MATCH'}`
		);
	});
});

console.log('\n' + '='.repeat(60));
console.log('✨ Demo Complete! The t2r function now supports:');
console.log('   • 🏢 Business & Professional identifiers');
console.log('   • 🔐 Advanced Security patterns');
console.log('   • 💬 Communication identifiers');
console.log('   • 💰 Financial & Banking patterns');
console.log('   • 🏥 Healthcare identifiers');
console.log('   • 🎓 Educational patterns');
console.log('   • 🚗 Transportation identifiers');
console.log('   • 💻 Technology patterns');
console.log('   • 🔒 Complex validation requirements');
console.log('   • 🌍 International text patterns');
console.log('   • 📁 Advanced file patterns');
console.log('   • And many more combined multi-requirement patterns!');
console.log('='.repeat(60));
