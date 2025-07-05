#!/usr/bin/env bun

/**
 * RGex Modular Imports Demo
 * This demonstrates how to import only the parts you need for a lighter bundle
 */

console.log('🚀 RGex Modular Imports Demo\n');

// Example 1: Import only the core RGex class (57KB instead of 63KB)
import { RGex } from '../dist/core.js';

console.log('📦 Example 1: Core RGex only (57KB)');
const regex = new RGex().start().email().end().build();
console.log('Email regex:', regex.toString());
console.log('Test email:', regex.test('test@example.com'));

// Example 2: Import only utilities (2.7KB instead of 63KB)
import { escapeRegex, extractNumbers, isValidEmail } from '../dist/utils.js';

console.log('\n🛠️ Example 2: Utilities only (2.7KB)');
console.log('Escape regex:', escapeRegex('Hello (world)!'));
console.log('Extract numbers:', extractNumbers('Age: 25, Score: 98.5'));
console.log('Is valid email:', isValidEmail('user@example.com'));

// Example 3: Import only human text parsing (50KB instead of 63KB)
import { parseHumanTextToRegex, t2r } from '../dist/human-text.js';

console.log('\n🔤 Example 3: Human text only (50KB)');
const phoneResult = parseHumanTextToRegex('phone number with country code');
console.log('Phone pattern:', phoneResult.pattern);
if (phoneResult.pattern) {
	console.log(
		'Phone regex test:',
		new RegExp(phoneResult.pattern).test('+1-555-123-4567')
	);
}

// Example 4: Import only password validation (13KB instead of 63KB)
import { validatePassword, generateStrongPassword } from '../dist/password.js';

console.log('\n🔒 Example 4: Password validation only (13KB)');
const passwordResult = validatePassword('MyPassword123!');
console.log('Password validation:', passwordResult.error === null);
console.log('Password score:', passwordResult.score);
console.log('Strong password:', generateStrongPassword());

// Example 5: Import only constants (12KB instead of 63KB)
import { REGEX_PATTERNS, COMMON_PASSWORDS } from '../dist/constants.js';

console.log('\n📋 Example 5: Constants only (12KB)');
console.log('Email pattern:', REGEX_PATTERNS.EMAIL);
console.log('Common passwords count:', COMMON_PASSWORDS.length);

console.log('\n✅ All modular imports working correctly!');
console.log('💡 Bundle size reduction: Up to 96% smaller (2.7KB vs 63KB)!');
