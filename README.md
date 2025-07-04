# RGex - Powerful Regex Builder Platform

[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Bun](https://img.shields.io/badge/Bun-000000?style=flat-square&logo=bun&logoColor=white)](https://bun.sh/)

A modern, chainable regex builder with intuitive methods and comprehensive validation utilities. Build complex regular expressions using readable, fluent syntax instead of cryptic regex patterns. Now featuring AI-powered human text parsing and advanced password validation.

## ✨ Features

- 🔗 **Chainable API**: Build regex patterns using intuitive method chaining
- ✅ **Built-in Validators**: 20+ validation methods for common data types
- 🎯 **Pre-built Patterns**: Ready-to-use patterns for emails, URLs, phones, etc.
- 🧠 **AI Text Parsing**: Convert human descriptions to regex patterns and validation rules
- 🔒 **Advanced Password Validation**: Detailed password strength analysis with scoring
- 🚀 **TypeScript Support**: Full type safety and IntelliSense support
- 🧪 **Comprehensive Testing**: Extensive test suite ensuring reliability
- 📦 **Zero Dependencies**: Lightweight with no external dependencies

## 🚀 Quick Start

```bash
# Install dependencies
bun install

# Run examples
bun run examples

# Run tests
bun test

# Run help/reference
bun run help
```

## 📁 Project Structure

```
rgex/
├── src/           # Main source code
│   └── index.ts   # Core RGex implementation
├── types/         # TypeScript type definitions
│   └── index.ts   # Interface definitions
├── examples/      # Usage examples
│   └── examples.ts
├── test/          # Test suite
│   └── rgex.test.ts
├── scripts/       # Utility scripts
│   └── scripts.ts # Help/reference guide
├── index.ts       # Root export (for backward compatibility)
├── package.json   # Package configuration
└── README.md      # This file
```

## 📖 Basic Usage

### Creating Patterns

```typescript
import { rgex, patterns, RGex } from './index.js';

// Simple email pattern
const emailPattern = rgex()
	.startWith('')
	.letter()
	.oneOrMore()
	.constant('@')
	.letter()
	.oneOrMore()
	.constant('.')
	.letter()
	.repeat(2, 4)
	.endWith('');

console.log(emailPattern.test('user@example.com')); // true
```

### Using Pre-built Patterns

```typescript
// Validate common data types
console.log(patterns.email().test('user@example.com')); // true
console.log(patterns.url().test('https://example.com')); // true
console.log(patterns.phone().test('+1234567890')); // true
```

### Built-in Validation Methods

```typescript
const validator = new RGex();

console.log(validator.isEmail('user@example.com')); // true
console.log(validator.isUUID('123e4567-e89b-12d3-a456-426614174000')); // true
console.log(validator.isPhone('+1234567890')); // true
```

## 🔧 API Reference

### Builder Methods

#### Basic Patterns

- `startWith(value)` - Match at beginning of string
- `endWith(value)` - Match at end of string
- `include(value)` - Include pattern anywhere
- `constant(value)` - Exact string match (escaped)
- `capture(pattern)` - Create capture group
- `raw(pattern)` - Add raw regex pattern

#### Character Classes

- `digit()` - Match any digit (0-9)
- `letter()` - Match any letter (a-z, A-Z)
- `word()` - Match word character (letter, digit, underscore)
- `whitespace()` - Match whitespace character
- `anyChar()` - Match any character except newline
- `wordBoundary()` - Match word boundary

#### Quantifiers

- `optional()` - Make previous pattern optional (?)
- `oneOrMore()` - One or more of previous pattern (+)
- `zeroOrMore()` - Zero or more of previous pattern (\*)
- `repeat(n)` - Repeat exactly n times
- `repeat(min, max)` - Repeat between min and max times

#### Grouping and Logic

- `anyOf(values)` - Match any of the provided values
- `noneOf(values)` - Match none of the provided values
- `group(pattern)` - Non-capturing group
- `or(pattern)` - OR condition

#### Lookarounds

- `lookahead(pattern)` - Positive lookahead
- `negativeLookahead(pattern)` - Negative lookahead
- `lookbehind(pattern)` - Positive lookbehind
- `negativeLookbehind(pattern)` - Negative lookbehind

### Validation Methods

#### Network & Web

- `isEmail(text)` - Valid email address
- `isLink(text)` - Valid HTTP/HTTPS URL
- `isIP(text)` - Valid IP address (IPv4 or IPv6)
- `isIPv4(text)` - Valid IPv4 address
- `isIPv6(text)` - Valid IPv6 address
- `isDomain(text)` - Valid domain name
- `isPort(text)` - Valid port number (1-65535)
- `isMAC(text)` - Valid MAC address

#### Identifiers

- `isUUID(text)` - Valid UUID (v1-v5)
- `isMongoID(text)` - Valid MongoDB ObjectID
- `isUsername(text)` - Valid username (3-20 chars, alphanumeric + underscore)
- `isSlug(text)` - Valid URL slug

#### Financial & Personal

- `isPhone(text)` - Valid phone number (international format)
- `isCreditCard(text)` - Valid credit card number

#### Date & Time

- `isDate(text)` - Valid date (YYYY-MM-DD)
- `isTime(text)` - Valid time (HH:MM or HH:MM:SS)

#### Format & Encoding

- `isHexColor(text)` - Valid hex color (#fff or #ffffff)
- `isJSON(text)` - Valid JSON string
- `isBase64(text)` - Valid base64 encoded string

#### Security

- `isPassword(text, options?)` - Password strength validation
  ```typescript
  validator.isPassword('StrongPass123!', {
  	minLength: 8,
  	requireUppercase: true,
  	requireLowercase: true,
  	requireNumbers: true,
  	requireSpecialChars: true,
  });
  ```

### Utility Methods

- `test(text)` - Test if pattern matches
- `exec(text)` - Execute regex and return matches
- `match(text)` - Find all matches
- `replace(text, replacement)` - Replace matches
- `split(text)` - Split string by pattern
- `toRegex()` - Convert to native RegExp
- `toString()` - Get pattern string
- `toStringWithFlags()` - Get pattern with flags

### Pre-built Patterns

```typescript
patterns.email(); // Email validation
patterns.url(); // URL validation
patterns.phone(); // Phone number
patterns.creditCard(); // Credit card
patterns.ipv4(); // IPv4 address
patterns.uuid(); // UUID
patterns.mongoId(); // MongoDB ObjectID
patterns.hexColor(); // Hex color
patterns.slug(); // URL slug
patterns.username(); // Username
patterns.strongPassword(); // Strong password
```

## 🧠 AI-Powered Features

### Human Text to Regex

Convert natural language descriptions into regex patterns:

```typescript
// Convert human descriptions to regex patterns
const emailResult = RGex.toRegex('email address', 'user@example.com');
console.log(emailResult);
// {
//   success: true,
//   pattern: /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/,
//   description: 'Valid email address',
//   confidence: 0.95,
//   suggestions: ['user@example.com', 'test.email+tag@domain.co.uk']
// }

const phoneResult = RGex.toRegex('phone number', '+1234567890');
const customResult = RGex.toRegex('numbers only', '12345');
```

**Supported Descriptions:**

- `'email address'`, `'email'`, `'e-mail'`
- `'phone number'`, `'telephone'`, `'mobile'`
- `'url'`, `'website'`, `'link'`
- `'date'`, `'yyyy-mm-dd'`
- `'time'`, `'hh:mm'`
- `'numbers only'`, `'digits only'`
- `'letters only'`, `'alphabetic'`
- `'alphanumeric'`
- `'uuid'`, `'guid'`
- `'ip address'`, `'ipv4'`
- `'hex color'`, `'color'`

### Human Text to Validation

Extract validation rules from natural language:

```typescript
// Convert human descriptions to validation rules
const emailValidation = RGex.toValidate(
	'required email min length 5 max length 50',
	'test@example.com'
);
console.log(emailValidation);
// {
//   success: true,
//   rules: [
//     { name: 'required', pattern: /.+/, message: 'This field is required' },
//     { name: 'email', pattern: /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@.../, message: 'Please enter a valid email address' },
//     { name: 'minLength', pattern: /.{5,}/, message: 'Minimum length is 5 characters' },
//     { name: 'maxLength', pattern: /^.{0,50}$/, message: 'Maximum length is 50 characters' }
//   ],
//   confidence: 1.0,
//   description: 'Extracted 4 validation rules'
// }

// Use extracted rules for validation
const testValue = 'user@example.com';
const allPassed = emailValidation.rules!.every((rule) => {
	return rule.validator
		? rule.validator(testValue)
		: rule.pattern.test(testValue);
});
```

**Supported Validation Descriptions:**

- `'required'` - Field is required
- `'email'` - Valid email format
- `'phone'` - Valid phone number
- `'url'` - Valid URL format
- `'min length N'` - Minimum length constraint
- `'max length N'` - Maximum length constraint
- `'numbers only'` - Only numeric characters
- `'letters only'` - Only alphabetic characters
- `'alphanumeric'` - Letters and numbers only
- `'no spaces'` - No whitespace allowed
- `'strong password'` - Strong password requirements

## 🔒 Advanced Password Validation

Comprehensive password analysis with detailed scoring and strength assessment:

```typescript
const rgex = new RGex();

// Advanced password validation with detailed results
const result = rgex.passwordCase('MyStr0ng!P@ssw0rd', {
	minLength: 8,
	maxLength: 128,
	hasNumber: true,
	hasSpecial: true,
	hasUpperChar: true,
	hasLowerChar: true,
	noSequential: true,
	noRepeating: true,
	noCommonWords: true,
	customPattern: '.*[A-Z]{2,}.*', // At least 2 consecutive uppercase letters
});

console.log(result);
// {
//   error: null, // No validation errors
//   pass: {
//     minLength: true,
//     maxLength: true,
//     hasNumber: true,
//     hasSpecial: true,
//     hasUpperChar: true,
//     hasLowerChar: true,
//     noSequential: true,
//     noRepeating: true,
//     noCommonWords: true,
//     customPattern: true
//   },
//   score: 100, // 0-100 strength score
//   strength: 'very-strong' // 'very-weak' | 'weak' | 'fair' | 'good' | 'strong' | 'very-strong'
// }
```

### Password Validation Options

```typescript
interface PasswordValidationOptions {
	minLength?: number; // Minimum password length (default: 8)
	maxLength?: number; // Maximum password length (default: 128)
	hasNumber?: boolean; // Require at least one number (default: true)
	hasSpecial?: boolean; // Require special characters (default: true)
	hasUpperChar?: boolean; // Require uppercase letters (default: true)
	hasLowerChar?: boolean; // Require lowercase letters (default: true)
	hasSymbol?: boolean; // Require symbols (default: false)
	hasUnicode?: boolean; // Require unicode characters (default: false)
	noSequential?: boolean; // Prohibit sequential characters like 'abc' (default: false)
	noRepeating?: boolean; // Prohibit repeating characters like 'aaa' (default: false)
	noCommonWords?: boolean; // Prohibit common words like 'password' (default: false)
	customPattern?: string; // Custom regex pattern requirement (default: undefined)
}
```

### Password Strength Examples

```typescript
// Weak password analysis
const weak = rgex.passwordCase('password123', {
	hasNumber: true,
	hasSpecial: true,
	hasUpperChar: true,
	noCommonWords: true,
});
// Result: { error: { hasSpecial: true, hasUpperChar: true, noCommonWords: true },
//          score: 45, strength: 'fair' }

// Strong password analysis
const strong = rgex.passwordCase('MyStr0ng!P@ssw0rd', {
	minLength: 8,
	hasNumber: true,
	hasSpecial: true,
	hasUpperChar: true,
	hasLowerChar: true,
	noSequential: true,
	noRepeating: true,
	noCommonWords: true,
});
// Result: { error: null, score: 100, strength: 'very-strong' }
```

## 📚 Examples

### Email Validation

```typescript
// Method 1: Builder pattern
const emailPattern = rgex()
	.startWith('')
	.raw('[a-zA-Z0-9._%+-]+')
	.constant('@')
	.raw('[a-zA-Z0-9.-]+')
	.constant('.')
	.raw('[a-zA-Z]{2,}')
	.endWith('');

// Method 2: Pre-built pattern
const isValidEmail = patterns.email().test('user@example.com');

// Method 3: Validation method
const validator = new RGex();
const isEmail = validator.isEmail('user@example.com');
```

### Password Strength

```typescript
const strongPassword = rgex()
	.lookahead('.*[a-z]') // Must contain lowercase
	.lookahead('.*[A-Z]') // Must contain uppercase
	.lookahead('.*\\d') // Must contain digit
	.lookahead('.*[!@#$%^&*]') // Must contain special char
	.anyChar()
	.repeat(8, 128); // 8-128 characters

console.log(strongPassword.test('Password123!')); // true
```

### Data Extraction

```typescript
// Extract emails from text
const emailExtractor = rgex('[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}', {
	global: true,
});

const text = 'Contact us at support@example.com or sales@company.org';
const emails = text.match(emailExtractor.toRegex());
// Result: ['support@example.com', 'sales@company.org']
```

### Log Parsing

```typescript
const logPattern = rgex()
	.capture('\\d{4}-\\d{2}-\\d{2}') // Date
	.whitespace()
	.capture('\\d{2}:\\d{2}:\\d{2}') // Time
	.whitespace()
	.capture('[A-Z]+') // Log level
	.whitespace()
	.capture('.*') // Message
	.endWith('');

const logEntry = '2023-12-25 14:30:45 ERROR Something went wrong';
const matches = logPattern.exec(logEntry);
// matches[1] = '2023-12-25'
// matches[2] = '14:30:45'
// matches[3] = 'ERROR'
// matches[4] = 'Something went wrong'
```

### Complex Validation Chain

```typescript
const complexPattern = rgex()
	.startWith('')
	.capture('[a-zA-Z]+') // Name
	.whitespace()
	.oneOrMore()
	.capture('\\d{4}') // Year
	.whitespace()
	.optional()
	.capture('[a-zA-Z]*') // Optional suffix
	.endWith('');

const result = complexPattern.exec('John 2023 Jr');
// result[1] = 'John', result[2] = '2023', result[3] = 'Jr'
```

## 🏗️ Advanced Usage

### Custom Flags

```typescript
const pattern = rgex('test', {
	global: true,
	ignoreCase: true,
	multiline: true,
});

// Or using individual flags
const pattern2 = rgex('test', { flags: 'gim' });
```

### Chaining with Conditions

```typescript
const conditionalPattern = rgex()
	.startWith('')
	.group('http|https')
	.constant('://')
	.group('www\\.')
	.optional()
	.word()
	.oneOrMore()
	.constant('.')
	.letter()
	.repeat(2, 6)
	.raw('(/.*)?')
	.endWith('');
```

### Custom Validation Logic

```typescript
class CustomValidator extends RGex {
	isCustomFormat(text: string): boolean {
		// Your custom validation logic
		const pattern = this.startWith('CUSTOM_')
			.digit()
			.repeat(4)
			.constant('_')
			.letter()
			.repeat(2);

		return pattern.test(text);
	}
}
```

## 🧪 Testing

Run the comprehensive test suite:

```bash
# Run all tests
bun test

# Run examples
bun run examples

# Run specific test file
bun run test.ts
```

The test suite includes:

- ✅ Builder pattern functionality
- ✅ All validation methods
- ✅ Pre-built patterns
- ✅ Utility methods
- ✅ Edge cases and error handling
- ✅ Real-world usage examples

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Add tests for your changes
4. Run the test suite (`bun test`)
5. Commit your changes (`git commit -m 'Add amazing feature'`)
6. Push to the branch (`git push origin feature/amazing-feature`)
7. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Inspired by the need for more readable regex construction
- Built with [Bun](https://bun.sh/) for blazing fast performance
- TypeScript for type safety and developer experience

---

Made with ❤️ for developers who want readable regex patterns
