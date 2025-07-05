import { t2r } from '../dist/index.js';

// A simple assertion helper for this test file
function assert(condition: boolean, message: string) {
	if (!condition) {
		throw new Error(`Assertion failed: ${message}`);
	}
}

console.log('🧠 Running Comprehensive Human Text to Regex (t2r) Tests\n');

const tests = {
	'should handle basic email patterns': () => {
		let result = t2r('email');
		assert(result.success, 'Test "email": should succeed');
		assert(
			!!result.pattern && result.pattern.test('test@example.com'),
			'Test "email": should match a valid email'
		);

		result = t2r('email address');
		assert(result.success, 'Test "email address": should succeed');
		assert(
			!!result.pattern && result.pattern.test('user@domain.com'),
			'Test "email address": should match a valid email'
		);

		result = t2r('e-mail');
		assert(result.success, 'Test "e-mail": should succeed');
		assert(
			!!result.pattern && result.pattern.test('test@example.org'),
			'Test "e-mail": should match a valid email'
		);
	},

	'should handle phone number variations': () => {
		let result = t2r('phone');
		assert(result.success, 'Test "phone": should succeed');
		console.log(`   "phone" pattern: ${result.pattern?.source || 'undefined'}`);

		result = t2r('phone number');
		assert(result.success, 'Test "phone number": should succeed');
		console.log(
			`   "phone number" pattern: ${result.pattern?.source || 'undefined'}`
		);

		result = t2r('telephone');
		assert(result.success, 'Test "telephone": should succeed');
		console.log(
			`   "telephone" pattern: ${result.pattern?.source || 'undefined'}`
		);

		result = t2r('mobile');
		assert(result.success, 'Test "mobile": should succeed');
		console.log(
			`   "mobile" pattern: ${result.pattern?.source || 'undefined'}`
		);

		result = t2r('cell phone');
		assert(result.success, 'Test "cell phone": should succeed');
		console.log(
			`   "cell phone" pattern: ${result.pattern?.source || 'undefined'}`
		);
	},

	'should handle URL variations': () => {
		let result = t2r('url');
		assert(result.success, 'Test "url": should succeed');
		assert(
			!!result.pattern && result.pattern.test('https://example.com'),
			'Test "url": should match a valid URL'
		);

		result = t2r('website');
		assert(result.success, 'Test "website": should succeed');
		assert(
			!!result.pattern && result.pattern.test('https://www.example.com'),
			'Test "website": should match a valid website'
		);

		result = t2r('web address');
		assert(result.success, 'Test "web address": should succeed');
		assert(
			!!result.pattern && result.pattern.test('http://example.org'),
			'Test "web address": should match a valid web address'
		);
	},

	'should handle number patterns': () => {
		let result = t2r('number');
		assert(result.success, 'Test "number": should succeed');
		assert(
			!!result.pattern && result.pattern.test('123'),
			'Test "number": should match digits'
		);

		result = t2r('numbers only');
		assert(result.success, 'Test "numbers only": should succeed');
		assert(
			!!result.pattern && result.pattern.test('456789'),
			'Test "numbers only": should match only digits'
		);

		result = t2r('digit');
		assert(result.success, 'Test "digit": should succeed');
		assert(
			!!result.pattern && result.pattern.test('7'),
			'Test "digit": should match single digit'
		);

		result = t2r('integer');
		assert(result.success, 'Test "integer": should succeed');
		assert(
			!!result.pattern && result.pattern.test('42'),
			'Test "integer": should match integer'
		);
	},

	'should handle text patterns': () => {
		let result = t2r('letters only');
		assert(result.success, 'Test "letters only": should succeed');
		assert(
			!!result.pattern && result.pattern.test('abc'),
			'Test "letters only": should match letters'
		);

		result = t2r('word');
		assert(result.success, 'Test "word": should succeed');
		assert(
			!!result.pattern && result.pattern.test('hello'),
			'Test "word": should match word'
		);

		result = t2r('text');
		assert(result.success, 'Test "text": should succeed');
		assert(
			!!result.pattern && result.pattern.test('hello world'),
			'Test "text": should match text'
		);

		result = t2r('alphanumeric');
		assert(result.success, 'Test "alphanumeric": should succeed');
		assert(
			!!result.pattern && result.pattern.test('abc123'),
			'Test "alphanumeric": should match alphanumeric'
		);
	},

	'should handle date patterns': () => {
		let result = t2r('date');
		assert(result.success, 'Test "date": should succeed');
		console.log(`   "date" pattern: ${result.pattern?.source || 'undefined'}`);

		result = t2r('american date');
		assert(result.success, 'Test "american date": should succeed');
		assert(
			!!result.pattern && result.pattern.test('12/31/2024'),
			'Test "american date": should match MM/DD/YYYY'
		);

		result = t2r('date mm/dd/yyyy');
		assert(result.success, 'Test "date mm/dd/yyyy": should succeed');
		assert(
			!!result.pattern && result.pattern.test('01/15/2023'),
			'Test "date mm/dd/yyyy": should match MM/DD/YYYY format'
		);

		result = t2r('iso date');
		assert(result.success, 'Test "iso date": should succeed');
		console.log(
			`   "iso date" pattern: ${result.pattern?.source || 'undefined'}`
		);

		result = t2r('european date');
		assert(result.success, 'Test "european date": should succeed');
		console.log(
			`   "european date" pattern: ${result.pattern?.source || 'undefined'}`
		);
	},

	'should handle business/corporate email': () => {
		let result = t2r('business email');
		assert(result.success, 'Test "business email": should succeed');
		assert(
			!!result.pattern && result.pattern.test('test@mycompany.com'),
			'Test "business email": should match a corporate domain'
		);
		assert(
			!!result.pattern && !result.pattern.test('test@gmail.com'),
			'Test "business email": should not match a free provider like gmail'
		);

		result = t2r('corporate email');
		assert(result.success, 'Test "corporate email": should succeed');
		assert(
			!!result.pattern && result.pattern.test('employee@company.org'),
			'Test "corporate email": should match a corporate domain'
		);
		assert(
			!!result.pattern && !result.pattern.test('user@yahoo.com'),
			'Test "corporate email": should not match a free provider like yahoo'
		);

		result = t2r('work email');
		assert(result.success, 'Test "work email": should succeed');
		assert(
			!!result.pattern && !result.pattern.test('personal@hotmail.com'),
			'Test "work email": should not match a free provider like hotmail'
		);

		result = t2r('company email');
		assert(result.success, 'Test "company email": should succeed');
		assert(
			!!result.pattern && !result.pattern.test('user@outlook.com'),
			'Test "company email": should not match a free provider like outlook'
		);
	},

	'should handle international phone patterns': () => {
		let result = t2r('international phone');
		assert(result.success, 'Test "international phone": should succeed');
		console.log(
			`   "international phone" pattern: ${
				result.pattern?.source || 'undefined'
			}`
		);

		result = t2r('phone with country code');
		assert(result.success, 'Test "phone with country code": should succeed');
		assert(
			!!result.pattern && result.pattern.test('+1234567890'),
			'Test "phone with country code": should match phone with country code'
		);

		result = t2r('international phone number');
		assert(result.success, 'Test "international phone number": should succeed');
		assert(
			!!result.pattern && result.pattern.test('+44123456789'),
			'Test "international phone number": should match international format'
		);
	},

	'should handle password patterns': () => {
		let result = t2r('password');
		assert(result.success, 'Test "password": should succeed');
		console.log(
			`   "password" pattern: ${result.pattern?.source || 'undefined'}`
		);

		result = t2r('strong password');
		assert(result.success, 'Test "strong password": should succeed');
		console.log(
			`   "strong password" pattern: ${result.pattern?.source || 'undefined'}`
		);

		result = t2r('strong password 8 characters');
		assert(
			result.success,
			'Test "strong password 8 characters": should succeed'
		);
		assert(
			!!result.pattern && result.pattern.test('MyP@ssw0rd'),
			'Test "strong password 8 characters": should match strong password'
		);

		result = t2r('password no dictionary words');
		assert(
			result.success,
			'Test "password no dictionary words": should succeed'
		);
		assert(
			!!result.pattern && !result.pattern.test('password123'),
			'Test "password no dictionary words": should not match common words'
		);

		result = t2r('complex password minimum 8');
		assert(result.success, 'Test "complex password minimum 8": should succeed');
		console.log(
			`   "complex password minimum 8" pattern: ${
				result.pattern?.source || 'undefined'
			}`
		);
	},

	'should handle email variations': () => {
		let result = t2r('email without plus');
		assert(result.success, 'Test "email without plus": should succeed');
		assert(
			!!result.pattern && result.pattern.test('user@example.com'),
			'Test "email without plus": should match normal email'
		);
		assert(
			!!result.pattern && !result.pattern.test('user+tag@example.com'),
			'Test "email without plus": should not match email with plus'
		);

		result = t2r('email no plus sign');
		assert(result.success, 'Test "email no plus sign": should succeed');
		console.log(
			`   "email no plus sign" pattern: ${
				result.pattern?.source || 'undefined'
			}`
		);

		result = t2r('email exclude plus');
		assert(result.success, 'Test "email exclude plus": should succeed');
		console.log(
			`   "email exclude plus" pattern: ${
				result.pattern?.source || 'undefined'
			}`
		);
	},

	'should handle complex descriptive patterns': () => {
		let result = t2r('string that starts with "ID:"');
		console.log(`   "string that starts with ID:" success: ${result.success}`);
		console.log(
			`   "string that starts with ID:" pattern: ${
				result.pattern?.source || 'undefined'
			}`
		);
		console.log(
			`   "string that starts with ID:" description: ${result.description}`
		);

		result = t2r('text between 10 and 20 characters');
		console.log(
			`   "text between 10 and 20 characters" success: ${result.success}`
		);
		console.log(
			`   "text between 10 and 20 characters" pattern: ${
				result.pattern?.source || 'undefined'
			}`
		);
		console.log(
			`   "text between 10 and 20 characters" description: ${result.description}`
		);

		result = t2r('ends with .com');
		console.log(`   "ends with .com" success: ${result.success}`);
		console.log(
			`   "ends with .com" pattern: ${result.pattern?.source || 'undefined'}`
		);

		result = t2r('contains at least 3 numbers');
		console.log(`   "contains at least 3 numbers" success: ${result.success}`);
		console.log(
			`   "contains at least 3 numbers" pattern: ${
				result.pattern?.source || 'undefined'
			}`
		);

		result = t2r('starts with uppercase letter');
		console.log(`   "starts with uppercase letter" success: ${result.success}`);
		console.log(
			`   "starts with uppercase letter" pattern: ${
				result.pattern?.source || 'undefined'
			}`
		);
	},

	'should handle UUID and special formats': () => {
		let result = t2r('uuid');
		assert(result.success, 'Test "uuid": should succeed');
		console.log(`   "uuid" pattern: ${result.pattern?.source || 'undefined'}`);

		result = t2r('guid');
		assert(result.success, 'Test "guid": should succeed');
		console.log(`   "guid" pattern: ${result.pattern?.source || 'undefined'}`);

		result = t2r('hex color');
		assert(result.success, 'Test "hex color": should succeed');
		console.log(
			`   "hex color" pattern: ${result.pattern?.source || 'undefined'}`
		);

		result = t2r('ipv4');
		assert(result.success, 'Test "ipv4": should succeed');
		console.log(`   "ipv4" pattern: ${result.pattern?.source || 'undefined'}`);

		result = t2r('ip address');
		assert(result.success, 'Test "ip address": should succeed');
		console.log(
			`   "ip address" pattern: ${result.pattern?.source || 'undefined'}`
		);
	},

	'should handle credit card patterns': () => {
		let result = t2r('credit card');
		assert(result.success, 'Test "credit card": should succeed');
		console.log(
			`   "credit card" pattern: ${result.pattern?.source || 'undefined'}`
		);

		result = t2r('visa card');
		assert(result.success, 'Test "visa card": should succeed');
		console.log(
			`   "visa card" pattern: ${result.pattern?.source || 'undefined'}`
		);

		result = t2r('mastercard');
		assert(result.success, 'Test "mastercard": should succeed');
		console.log(
			`   "mastercard" pattern: ${result.pattern?.source || 'undefined'}`
		);
	},

	'should handle social security and identification': () => {
		let result = t2r('social security number');
		assert(result.success, 'Test "social security number": should succeed');
		console.log(
			`   "social security number" pattern: ${
				result.pattern?.source || 'undefined'
			}`
		);

		result = t2r('ssn');
		assert(result.success, 'Test "ssn": should succeed');
		console.log(`   "ssn" pattern: ${result.pattern?.source || 'undefined'}`);

		result = t2r('zip code');
		assert(result.success, 'Test "zip code": should succeed');
		console.log(
			`   "zip code" pattern: ${result.pattern?.source || 'undefined'}`
		);

		result = t2r('postal code');
		assert(result.success, 'Test "postal code": should succeed');
		console.log(
			`   "postal code" pattern: ${result.pattern?.source || 'undefined'}`
		);
	},

	'should handle time patterns': () => {
		let result = t2r('time');
		assert(result.success, 'Test "time": should succeed');
		console.log(`   "time" pattern: ${result.pattern?.source || 'undefined'}`);

		result = t2r('24 hour time');
		assert(result.success, 'Test "24 hour time": should succeed');
		console.log(
			`   "24 hour time" pattern: ${result.pattern?.source || 'undefined'}`
		);

		result = t2r('12 hour time');
		assert(result.success, 'Test "12 hour time": should succeed');
		console.log(
			`   "12 hour time" pattern: ${result.pattern?.source || 'undefined'}`
		);
	},

	'should handle username patterns': () => {
		let result = t2r('username');
		assert(result.success, 'Test "username": should succeed');
		console.log(
			`   "username" pattern: ${result.pattern?.source || 'undefined'}`
		);

		result = t2r('username with letters numbers and underscores');
		assert(
			result.success,
			'Test "username with letters numbers and underscores": should succeed'
		);
		console.log(
			`   "username with letters numbers and underscores" pattern: ${
				result.pattern?.source || 'undefined'
			}`
		);
	},

	'should handle failure cases gracefully': () => {
		let result = t2r('an imaginary and nonsensical pattern');
		assert(!result.success, 'Test "nonsense": should fail');
		assert(
			result.pattern === undefined,
			'Test "nonsense": should not return a pattern'
		);

		result = t2r('');
		assert(!result.success, 'Test empty string: should fail');

		result = t2r('xyzabc123randomtext');
		console.log(`   "xyzabc123randomtext" success: ${result.success}`);
		console.log(`   "xyzabc123randomtext" confidence: ${result.confidence}`);
	},

	'should handle positional patterns': () => {
		let result = t2r('starts with "ID:"');
		assert(result.success, 'Test "starts with ID:": should succeed');
		assert(
			!!result.pattern && result.pattern.test('ID:12345'),
			'Test "starts with ID:": should match text that starts with ID:'
		);
		assert(
			!!result.pattern && !result.pattern.test('12345ID:'),
			'Test "starts with ID:": should not match text that does not start with ID:'
		);

		result = t2r('ends with ".com"');
		assert(result.success, 'Test "ends with .com": should succeed');
		assert(
			!!result.pattern && result.pattern.test('example.com'),
			'Test "ends with .com": should match text that ends with .com'
		);
		assert(
			!!result.pattern && !result.pattern.test('.com example'),
			'Test "ends with .com": should not match text that does not end with .com'
		);

		result = t2r('contains "test"');
		assert(result.success, 'Test "contains test": should succeed');
		assert(
			!!result.pattern && result.pattern.test('this is a test string'),
			'Test "contains test": should match text that contains test'
		);
		assert(
			!!result.pattern && !result.pattern.test('this is a sample string'),
			'Test "contains test": should not match text that does not contain test'
		);
	},

	'should handle length constraint patterns': () => {
		let result = t2r('between 5 and 10 characters');
		assert(
			result.success,
			'Test "between 5 and 10 characters": should succeed'
		);
		assert(
			!!result.pattern && result.pattern.test('hello'),
			'Test "between 5 and 10 characters": should match 5-character string'
		);
		assert(
			!!result.pattern && result.pattern.test('helloworld'),
			'Test "between 5 and 10 characters": should match 10-character string'
		);
		assert(
			!!result.pattern && !result.pattern.test('hi'),
			'Test "between 5 and 10 characters": should not match 2-character string'
		);

		result = t2r('exactly 8 characters');
		assert(result.success, 'Test "exactly 8 characters": should succeed');
		assert(
			!!result.pattern && result.pattern.test('password'),
			'Test "exactly 8 characters": should match 8-character string'
		);
		assert(
			!!result.pattern && !result.pattern.test('pass'),
			'Test "exactly 8 characters": should not match 4-character string'
		);

		result = t2r('at least 6 characters');
		assert(result.success, 'Test "at least 6 characters": should succeed');
		assert(
			!!result.pattern && result.pattern.test('password'),
			'Test "at least 6 characters": should match 8-character string'
		);
		assert(
			!!result.pattern && !result.pattern.test('pass'),
			'Test "at least 6 characters": should not match 4-character string'
		);

		result = t2r('at most 5 characters');
		assert(result.success, 'Test "at most 5 characters": should succeed');
		assert(
			!!result.pattern && result.pattern.test('hello'),
			'Test "at most 5 characters": should match 5-character string'
		);
		assert(
			!!result.pattern && !result.pattern.test('hello world'),
			'Test "at most 5 characters": should not match 11-character string'
		);
	},

	'should handle network patterns': () => {
		let result = t2r('ipv6');
		assert(result.success, 'Test "ipv6": should succeed');
		console.log(`   "ipv6" pattern: ${result.pattern?.source || 'undefined'}`);

		result = t2r('mac address');
		assert(result.success, 'Test "mac address": should succeed');
		assert(
			!!result.pattern && result.pattern.test('00:1B:44:11:3A:B7'),
			'Test "mac address": should match MAC address with colons'
		);
		assert(
			!!result.pattern && result.pattern.test('00-1B-44-11-3A-B7'),
			'Test "mac address": should match MAC address with dashes'
		);

		result = t2r('domain name');
		assert(result.success, 'Test "domain name": should succeed');
		assert(
			!!result.pattern && result.pattern.test('example.com'),
			'Test "domain name": should match domain'
		);
		assert(
			!!result.pattern && result.pattern.test('subdomain.example.org'),
			'Test "domain name": should match subdomain'
		);
	},

	'should handle file patterns': () => {
		let result = t2r('file extension');
		assert(result.success, 'Test "file extension": should succeed');
		assert(
			!!result.pattern && result.pattern.test('document.pdf'),
			'Test "file extension": should match file with extension'
		);
		assert(
			!!result.pattern && !result.pattern.test('document'),
			'Test "file extension": should not match file without extension'
		);

		result = t2r('image file');
		assert(result.success, 'Test "image file": should succeed');
		assert(
			!!result.pattern && result.pattern.test('photo.jpg'),
			'Test "image file": should match JPG image'
		);
		assert(
			!!result.pattern && result.pattern.test('logo.png'),
			'Test "image file": should match PNG image'
		);
		assert(
			!!result.pattern && !result.pattern.test('document.pdf'),
			'Test "image file": should not match PDF document'
		);

		result = t2r('document file');
		assert(result.success, 'Test "document file": should succeed');
		assert(
			!!result.pattern && result.pattern.test('report.pdf'),
			'Test "document file": should match PDF document'
		);
		assert(
			!!result.pattern && result.pattern.test('letter.doc'),
			'Test "document file": should match DOC document'
		);
		assert(
			!!result.pattern && !result.pattern.test('photo.jpg'),
			'Test "document file": should not match image file'
		);
	},

	'should handle timestamp and datetime patterns': () => {
		let result = t2r('timestamp');
		assert(result.success, 'Test "timestamp": should succeed');
		assert(
			!!result.pattern && result.pattern.test('1640995200'),
			'Test "timestamp": should match 10-digit timestamp'
		);
		assert(
			!!result.pattern && result.pattern.test('1640995200000'),
			'Test "timestamp": should match 13-digit timestamp'
		);

		result = t2r('datetime');
		assert(result.success, 'Test "datetime": should succeed');
		assert(
			!!result.pattern && result.pattern.test('2023-12-25T10:30:00Z'),
			'Test "datetime": should match ISO datetime'
		);
		assert(
			!!result.pattern && result.pattern.test('2023-12-25T10:30:00.123Z'),
			'Test "datetime": should match ISO datetime with milliseconds'
		);
	},

	'should handle international postal codes': () => {
		let result = t2r('uk postcode');
		assert(result.success, 'Test "uk postcode": should succeed');
		assert(
			!!result.pattern && result.pattern.test('SW1A 1AA'),
			'Test "uk postcode": should match UK postcode'
		);

		result = t2r('german postcode');
		assert(result.success, 'Test "german postcode": should succeed');
		assert(
			!!result.pattern && result.pattern.test('10115'),
			'Test "german postcode": should match German postcode'
		);

		result = t2r('french postcode');
		assert(result.success, 'Test "french postcode": should succeed');
		assert(
			!!result.pattern && result.pattern.test('75001'),
			'Test "french postcode": should match French postcode'
		);
	},
};

let passed = 0;
let failed = 0;

for (const [name, testFn] of Object.entries(tests)) {
	console.log(`\n🔍 Testing: ${name}`);
	try {
		testFn();
		console.log(`✅ PASSED: ${name}`);
		passed++;
	} catch (e) {
		console.error(`❌ FAILED: ${name}`);
		console.error(`   Error: ${e.message}`);
		failed++;
	}
}

console.log(`\n📊 Final Test Summary: ${passed} passed, ${failed} failed.\n`);

if (failed > 0) {
	process.exit(1);
}
