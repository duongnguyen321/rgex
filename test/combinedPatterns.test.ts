/**
 * Advanced Combined Patterns Tests
 * Testing complex multi-requirement regex patterns
 */

import { strict as assert } from 'assert';
import { t2r } from '../dist/index.js';

console.log('🚀 Running Advanced Combined Patterns Tests\n');

const advancedTests = {
	// BUSINESS & PROFESSIONAL PATTERNS
	'should handle business identifier combinations': () => {
		let result = t2r('employee id with department prefix and 4 digit number');
		assert(result.success, 'Employee ID pattern should succeed');
		assert(
			!!result.pattern && result.pattern.test('HR-1234'),
			'Should match department prefix with 4 digits'
		);
		assert(
			!!result.pattern && result.pattern.test('IT-5678'),
			'Should match IT department format'
		);
		assert(
			!!result.pattern && !result.pattern.test('HR-12'),
			'Should not match less than 4 digits'
		);

		result = t2r('invoice number with year and sequential number');
		assert(result.success, 'Invoice number pattern should succeed');
		assert(
			!!result.pattern && result.pattern.test('INV-2024-001234'),
			'Should match invoice format with year'
		);
		assert(
			!!result.pattern && !result.pattern.test('INV-24-001234'),
			'Should not match 2-digit year'
		);

		result = t2r('product sku with category letters and numeric code');
		assert(result.success, 'Product SKU pattern should succeed');
		assert(
			!!result.pattern && result.pattern.test('ELE-12345'),
			'Should match electronics category'
		);
		assert(
			!!result.pattern && result.pattern.test('CLO-67890'),
			'Should match clothing category'
		);
	},

	// ADVANCED SECURITY PATTERNS
	'should handle multi-factor authentication codes': () => {
		let result = t2r(
			'two factor authentication code 6 digits with optional spaces'
		);
		assert(result.success, '2FA code pattern should succeed');
		assert(
			!!result.pattern && result.pattern.test('123456'),
			'Should match 6 digits without spaces'
		);
		assert(
			!!result.pattern && result.pattern.test('123 456'),
			'Should match 6 digits with space'
		);
		assert(
			!!result.pattern && !result.pattern.test('12345'),
			'Should not match 5 digits'
		);

		result = t2r('api key with prefix and 32 character hex string');
		assert(result.success, 'API key pattern should succeed');
		assert(
			!!result.pattern &&
				result.pattern.test('sk_1234567890abcdef1234567890abcdef'),
			'Should match API key format'
		);
		assert(
			!!result.pattern && !result.pattern.test('sk_123'),
			'Should not match short key'
		);

		result = t2r('jwt token with three base64 parts separated by dots');
		assert(result.success, 'JWT token pattern should succeed');
		assert(
			!!result.pattern &&
				result.pattern.test(
					'eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIn0.Gfx6VO9tcxwk6xqx9yYzSfebfeakZp5JYIgP_edcw_A'
				),
			'Should match JWT format'
		);
		assert(
			!!result.pattern &&
				!result.pattern.test(
					'eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIn0'
				),
			'Should not match incomplete JWT'
		);
	},

	// COMMUNICATION PATTERNS
	'should handle communication identifiers': () => {
		let result = t2r('slack channel name with hash and lowercase letters');
		assert(result.success, 'Slack channel pattern should succeed');
		assert(
			!!result.pattern && result.pattern.test('#general'),
			'Should match simple channel name'
		);
		assert(
			!!result.pattern && result.pattern.test('#dev-team-frontend'),
			'Should match complex channel name'
		);
		assert(
			!!result.pattern && !result.pattern.test('#General'),
			'Should not match uppercase letters'
		);

		result = t2r('discord username with discriminator number');
		assert(result.success, 'Discord username pattern should succeed');
		assert(
			!!result.pattern && result.pattern.test('username#1234'),
			'Should match username with discriminator'
		);
		assert(
			!!result.pattern && !result.pattern.test('username'),
			'Should not match username without discriminator'
		);

		result = t2r('mention with at symbol and alphanumeric username');
		assert(result.success, 'Mention pattern should succeed');
		assert(
			!!result.pattern && result.pattern.test('@john_doe123'),
			'Should match mention format'
		);
		assert(
			!!result.pattern && result.pattern.test('@jane.smith'),
			'Should match mention with dot'
		);
		assert(
			!!result.pattern && !result.pattern.test('john_doe123'),
			'Should not match without @ symbol'
		);
	},

	// FINANCIAL & BANKING PATTERNS
	'should handle advanced financial patterns': () => {
		let result = t2r('iban with country code and check digits');
		assert(result.success, 'IBAN pattern should succeed');
		assert(
			!!result.pattern && result.pattern.test('GB82WEST12345698765432'),
			'Should match UK IBAN'
		);
		assert(
			!!result.pattern && result.pattern.test('DE89370400440532013000'),
			'Should match German IBAN'
		);
		assert(
			!!result.pattern && !result.pattern.test('GB82WEST123'),
			'Should not match short IBAN'
		);

		result = t2r('bitcoin address with 1 or 3 prefix and base58 characters');
		assert(result.success, 'Bitcoin address pattern should succeed');
		assert(
			!!result.pattern &&
				result.pattern.test('1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa'),
			'Should match P2PKH address'
		);
		assert(
			!!result.pattern &&
				result.pattern.test('3J98t1WpEZ73CNmQviecrnyiWrnqRhWNLy'),
			'Should match P2SH address'
		);
		assert(
			!!result.pattern &&
				!result.pattern.test('2A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa'),
			'Should not match invalid prefix'
		);

		result = t2r('swift code with 8 or 11 characters bank identifier');
		assert(result.success, 'SWIFT code pattern should succeed');
		assert(
			!!result.pattern && result.pattern.test('DEUTDEFF'),
			'Should match 8 character SWIFT'
		);
		assert(
			!!result.pattern && result.pattern.test('DEUTDEFF500'),
			'Should match 11 character SWIFT'
		);
		assert(
			!!result.pattern && !result.pattern.test('DEUT'),
			'Should not match short SWIFT'
		);
	},

	// HEALTHCARE & MEDICAL PATTERNS
	'should handle healthcare identifiers': () => {
		let result = t2r('medical record number with facility code and patient id');
		assert(result.success, 'Medical record pattern should succeed');
		assert(
			!!result.pattern && result.pattern.test('NYC-12345678'),
			'Should match medical record format'
		);
		assert(
			!!result.pattern && result.pattern.test('LAX-87654321'),
			'Should match different facility'
		);

		result = t2r('prescription number with pharmacy code and sequence');
		assert(result.success, 'Prescription pattern should succeed');
		assert(
			!!result.pattern && result.pattern.test('RX-CVS-1234567'),
			'Should match prescription format'
		);
		assert(
			!!result.pattern && result.pattern.test('RX-WAL-9876543'),
			'Should match different pharmacy'
		);

		result = t2r('npi number with 10 digits healthcare provider');
		assert(result.success, 'NPI pattern should succeed');
		assert(
			!!result.pattern && result.pattern.test('1234567890'),
			'Should match 10 digit NPI'
		);
		assert(
			!!result.pattern && !result.pattern.test('123456789'),
			'Should not match 9 digit number'
		);
	},

	// EDUCATION PATTERNS
	'should handle educational identifiers': () => {
		let result = t2r('student id with year and sequence number');
		assert(result.success, 'Student ID pattern should succeed');
		assert(
			!!result.pattern && result.pattern.test('2024-001234'),
			'Should match student ID format'
		);
		assert(
			!!result.pattern && result.pattern.test('2023-567890'),
			'Should match different year'
		);

		result = t2r('course code with department and number');
		assert(result.success, 'Course code pattern should succeed');
		assert(
			!!result.pattern && result.pattern.test('CS-101'),
			'Should match computer science course'
		);
		assert(
			!!result.pattern && result.pattern.test('MATH-2020'),
			'Should match math course'
		);
		assert(
			!!result.pattern && !result.pattern.test('CS'),
			'Should not match department only'
		);

		result = t2r('grade with letter and optional plus or minus');
		assert(result.success, 'Grade pattern should succeed');
		assert(
			!!result.pattern && result.pattern.test('A+'),
			'Should match A plus'
		);
		assert(
			!!result.pattern && result.pattern.test('B-'),
			'Should match B minus'
		);
		assert(
			!!result.pattern && result.pattern.test('C'),
			'Should match plain C'
		);
		assert(
			!!result.pattern && !result.pattern.test('Z'),
			'Should not match invalid grade'
		);
	},

	// TRANSPORTATION PATTERNS
	'should handle transportation identifiers': () => {
		let result = t2r('license plate with 3 letters and 4 numbers');
		assert(result.success, 'License plate pattern should succeed');
		assert(
			!!result.pattern && result.pattern.test('ABC-1234'),
			'Should match license plate format'
		);
		assert(
			!!result.pattern && result.pattern.test('XYZ-9876'),
			'Should match different plate'
		);
		assert(
			!!result.pattern && !result.pattern.test('AB-1234'),
			'Should not match 2 letters'
		);

		result = t2r('flight number with airline code and digits');
		assert(result.success, 'Flight number pattern should succeed');
		assert(
			!!result.pattern && result.pattern.test('AA1234'),
			'Should match American Airlines'
		);
		assert(
			!!result.pattern && result.pattern.test('UA567'),
			'Should match United Airlines'
		);
		assert(
			!!result.pattern && !result.pattern.test('A1234'),
			'Should not match single letter'
		);

		result = t2r('tracking number with carrier prefix and alphanumeric code');
		assert(result.success, 'Tracking number pattern should succeed');
		assert(
			!!result.pattern && result.pattern.test('1Z999AA1234567890'),
			'Should match UPS format'
		);
		assert(
			!!result.pattern && result.pattern.test('FDX1234567890'),
			'Should match FedEx format'
		);
	},

	// TECHNOLOGY PATTERNS
	'should handle technology identifiers': () => {
		let result = t2r('docker image tag with registry and version');
		assert(result.success, 'Docker image pattern should succeed');
		assert(
			!!result.pattern && result.pattern.test('nginx:1.21.0'),
			'Should match image with version'
		);
		assert(
			!!result.pattern && result.pattern.test('mysql:latest'),
			'Should match image with latest tag'
		);
		assert(
			!!result.pattern && !result.pattern.test('nginx'),
			'Should not match image without tag'
		);

		result = t2r('kubernetes pod name with deployment and random suffix');
		assert(result.success, 'Kubernetes pod pattern should succeed');
		assert(
			!!result.pattern && result.pattern.test('web-deployment-abc123'),
			'Should match pod name format'
		);
		assert(
			!!result.pattern && result.pattern.test('api-service-xyz789'),
			'Should match different service'
		);

		result = t2r('git commit hash with 7 or 40 hex characters');
		assert(result.success, 'Git commit pattern should succeed');
		assert(
			!!result.pattern && result.pattern.test('a1b2c3d'),
			'Should match short commit hash'
		);
		assert(
			!!result.pattern &&
				result.pattern.test('a1b2c3d4e5f6789012345678901234567890abcd'),
			'Should match full commit hash'
		);
		assert(
			!!result.pattern && !result.pattern.test('a1b2c'),
			'Should not match too short hash'
		);
	},

	// COMPLEX VALIDATION PATTERNS
	'should handle complex validation requirements': () => {
		let result = t2r(
			'password with 2 uppercase 2 lowercase 2 numbers 2 special minimum 12 characters no common words'
		);
		assert(result.success, 'Complex password pattern should succeed');
		assert(
			!!result.pattern && result.pattern.test('MyStr0ng!Pass@2024'),
			'Should match complex password'
		);
		assert(
			!!result.pattern && !result.pattern.test('Password123!'),
			'Should not match common word'
		);
		assert(
			!!result.pattern && !result.pattern.test('MyStr0ng!Pass'),
			'Should not match without enough numbers'
		);

		result = t2r(
			'email with custom domain not gmail yahoo hotmail and minimum 5 characters before at'
		);
		assert(result.success, 'Custom domain email pattern should succeed');
		assert(
			!!result.pattern && result.pattern.test('user12@company.com'),
			'Should match custom domain'
		);
		assert(
			!!result.pattern && !result.pattern.test('user@gmail.com'),
			'Should not match Gmail'
		);
		assert(
			!!result.pattern && !result.pattern.test('usr@company.com'),
			'Should not match short username'
		);

		result = t2r(
			'phone number with country code area code and exactly 10 digits total'
		);
		assert(result.success, 'Specific phone format should succeed');
		assert(
			!!result.pattern && result.pattern.test('+1-555-123-4567'),
			'Should match formatted phone'
		);
		assert(
			!!result.pattern && result.pattern.test('+1 555 123 4567'),
			'Should match space-separated phone'
		);
		assert(
			!!result.pattern && !result.pattern.test('+1-555-123-456'),
			'Should not match incomplete phone'
		);
	},

	// MULTI-LANGUAGE PATTERNS
	'should handle international text patterns': () => {
		let result = t2r(
			'text with unicode letters numbers and common punctuation'
		);
		assert(result.success, 'Unicode text pattern should succeed');
		assert(
			!!result.pattern && result.pattern.test('Hello 世界! 123'),
			'Should match mixed language text'
		);
		assert(
			!!result.pattern && result.pattern.test('Café résumé naïve'),
			'Should match accented characters'
		);
		assert(
			!!result.pattern && result.pattern.test('Москва Россия'),
			'Should match Cyrillic text'
		);

		result = t2r(
			'name with international characters and optional middle initial'
		);
		assert(result.success, 'International name pattern should succeed');
		assert(
			!!result.pattern && result.pattern.test('José María García'),
			'Should match Spanish name'
		);
		assert(
			!!result.pattern && result.pattern.test('李 小明'),
			'Should match Chinese name'
		);
		assert(
			!!result.pattern && result.pattern.test('John F. Kennedy'),
			'Should match name with middle initial'
		);
	},

	// ADVANCED FILE PATTERNS
	'should handle complex file patterns': () => {
		let result = t2r('file path with unix style forward slashes and no spaces');
		assert(result.success, 'Unix file path pattern should succeed');
		assert(
			!!result.pattern && result.pattern.test('/home/user/documents/file.txt'),
			'Should match Unix absolute path'
		);
		assert(
			!!result.pattern && result.pattern.test('./relative/path/file.js'),
			'Should match relative path'
		);
		assert(
			!!result.pattern && !result.pattern.test('/home/user/my file.txt'),
			'Should not match path with spaces'
		);

		result = t2r(
			'semantic version with major minor patch and optional prerelease'
		);
		assert(result.success, 'Semantic version pattern should succeed');
		assert(
			!!result.pattern && result.pattern.test('1.2.3'),
			'Should match basic version'
		);
		assert(
			!!result.pattern && result.pattern.test('2.0.0-alpha.1'),
			'Should match prerelease version'
		);
		assert(
			!!result.pattern && result.pattern.test('1.0.0-beta+build.123'),
			'Should match version with build metadata'
		);
		assert(
			!!result.pattern && !result.pattern.test('1.2'),
			'Should not match incomplete version'
		);

		result = t2r('log entry with timestamp level and message');
		assert(result.success, 'Log entry pattern should succeed');
		assert(
			!!result.pattern &&
				result.pattern.test('2024-01-15 10:30:45 INFO Application started'),
			'Should match log entry format'
		);
		assert(
			!!result.pattern &&
				result.pattern.test(
					'2024-01-15 10:30:45 ERROR Database connection failed'
				),
			'Should match error log entry'
		);
		assert(
			!!result.pattern && !result.pattern.test('Application started'),
			'Should not match message without timestamp'
		);
	},
};

// Run all tests
let passed = 0;
let failed = 0;

for (const [testName, testFn] of Object.entries(advancedTests)) {
	console.log(`🔍 Testing: ${testName}`);
	try {
		testFn();
		console.log(`✅ PASSED: ${testName}`);
		passed++;
	} catch (error) {
		console.log(`❌ FAILED: ${testName}`);
		console.log(`   Error: ${error.message}`);
		failed++;
	}
	console.log('');
}

console.log(
	`📊 Advanced Combined Patterns Test Summary: ${passed} passed, ${failed} failed.\n`
);
