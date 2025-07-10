# RGex

[![npm version](https://img.shields.io/npm/v/rgex.svg)](https://www.npmjs.com/package/rgex)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![build status](https://img.shields.io/github/actions/workflow/status/duongnguyen321/rgex/ci.yml?branch=main)](https://github.com/duongnguyen321/rgex/actions/workflows/ci.yml)
[![license](https://img.shields.io/npm/l/rgex.svg)](https://github.com/duongnguyen321/rgex/blob/main/LICENSE)

A powerful, chainable regex builder platform with comprehensive validation utilities and natural language processing to convert human text into regular expressions.

## Features

- **Fluent Regex Builder**: Construct complex regular expressions with a simple, chainable API.
- **Text-to-Regex (t2r)**: Convert natural language descriptions into regex patterns.
- **Advanced Password Validation**: Analyze password strength against multiple criteria and generate strong passwords.
- **Pre-built Patterns**: A large library of common patterns for emails, URLs, credit cards, and more.
- **Modular & Lightweight**: Import only the features you need to keep your bundle size small.
- **Fully Typed**: Written in TypeScript for a great developer experience.

## Installation

```bash
npm install rgex
```

```bash
bun install rgex
```

## Quick Start

RGex offers multiple ways to create and use regular expressions, from natural language to a fluent builder.

### Text-to-Regex (`t2r`)

Instantly convert a human-readable string into a regex pattern.

```javascript
import { t2r } from 'rgex';

// Simple email pattern
const emailResult = t2r('email address');
const emailRegex = emailResult.pattern; // /^[a-zA-Z0-9...
console.log(emailRegex.test('test@example.com')); // true

// Complex pattern
const result = t2r('password with 2 uppercase, 2 numbers, and 12+ characters');
console.log(result.pattern.test('MyP@ssword123')); // true
```

### Fluent Builder (`rgex`)

Chain methods together to build a custom regex pattern.

```javascript
import { rgex } from 'rgex';

const pattern = rgex()
	.start()
	.literal('user-')
	.digit()
	.quantifier(4)
	.end()
	.build(); // /^user-\d{4}$/

console.log(pattern.test('user-1234')); // true
console.log(pattern.test('user-abcd')); // false
```

### Password Validation

Analyze password strength or generate a new strong password.

```javascript
import { validatePassword, generateStrongPassword } from 'rgex';

// Validate a password
const validation = validatePassword('WeakPass1');
console.log(validation.strength); // 'fair'
console.log(validation.score); // 55
console.log(validation.error); // { message: '...', requirements: ['...'] }

// Generate a strong password
const newPassword = generateStrongPassword(16);
// e.g., 'aB5!cDe6$fGh7#iJk'
console.log(newPassword);
```

## API Reference

### Top-Level Functions

#### `t2r(humanText, [testValue])`

Converts a human-readable text description into a regex pattern. This is the core of the natural language processing feature. Aliases: `h2r`, `textToRegex`, `humanToRegex`, `parseHumanTextToRegex`.

- **`humanText`**: `string` - The natural language description of the pattern.
- **`testValue`**: `string` (optional) - A string to test the generated pattern against to improve confidence.
- **Returns**: `TextExtractionResult` - An object containing the pattern, confidence score, and description.

```javascript
import { t2r } from 'rgex';

const result = t2r('url with https only');

if (result.success) {
	console.log(result.pattern);
	// /https:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/
	console.log(result.confidence); // e.g., 0.8
}
```

#### `rgex([pattern], [options])`

Factory function to create a new `RGex` builder instance.

- **`pattern`**: `string` (optional) - An initial regex pattern string.
- **`options`**: `RegexBuilderOptions` (optional) - Initial regex flags.
- **Returns**: A new `RGex` instance.

```javascript
import { rgex } from 'rgex';

const pattern = rgex('\\d{3}', { global: true });
console.log(pattern.toString()); // /\d{3}/g
```

### `RGex` Class

The core class for building regular expressions.

#### `new RGex([pattern], [options])` or `RGex.create([pattern], [options])`

Creates a new `RGex` instance.

```javascript
import { RGex } from 'rgex';

const builder = new RGex();
// or
const builder = RGex.create();
```

#### Builder Methods

All builder methods are chainable.

- `.start()`: Asserts the start of the string (`^`).
- `.end()`: Asserts the end of the string (`$`).
- `.literal(text)`: Appends a literal string, escaping special characters.
- `.raw(pattern)`: Appends a raw, unescaped regex pattern string.
- `.digit()`: Matches any digit (`\d`).
- `.word()`: Matches any word character (`\w`).
- `.whitespace()`: Matches any whitespace character (`\s`).
- `.any()`: Matches any character except newline (`.`).
- `.group(pattern)`: Creates a capturing group `(...)`.
- `.or(pattern)`: Appends an OR operator (`|`).
- `.quantifier(min, [max])`: Specifies repetitions `{min,max}`.
- `.oneOrMore()`: Appends `+`.
- `.zeroOrMore()`: Appends `*`.
- `.optional()`: Appends `?`.
- `.lookahead(pattern, [negative])`: Appends a positive `(?=...)` or negative `(?!...)` lookahead.
- `.lookbehind(pattern, [negative])`: Appends a positive `(?<=...)` or negative `(?<!...)` lookbehind.
- `.email()`, `.url()`, `.phone()`, etc.: Appends pre-built patterns.
- `.global(true)`, `.ignoreCase(true)`, etc.: Sets regex flags.
- `.build()`: Returns the final `RegExp` object.
- `.test(input)`: Tests the pattern against a string.

```javascript
import { RGex } from 'rgex';

const usernameRegex = RGex.create()
	.start()
	.charClass('a-zA-Z') // Must start with a letter
	.charClass('a-zA-Z0-9_')
	.quantifier(2, 19) // Followed by 2-19 word chars
	.end()
	.ignoreCase()
	.build(); // /^[a-zA-Z][a-zA-Z0-9_]{2,19}$/i

console.log(usernameRegex.test('ValidUser_123')); // true
```

### Password Utilities

#### `validatePassword(password, [options])`

Analyzes a password against a set of rules.

- **`password`**: `string` - The password to validate.
- **`options`**: `PasswordValidationOptions` (optional) - Customize validation rules (e.g., `minLength`, `hasNumber`).
- **Returns**: `PasswordValidationResult` - An object with score, strength, and pass/fail details for each rule.

```javascript
import { validatePassword } from 'rgex';

const result = validatePassword('P@ssw0rd123', {
	minLength: 10,
	noCommonWords: true,
});

console.log(result.strength); // 'strong'
console.log(result.score); // 85
```

#### `generateStrongPassword([length], [options])`

Generates a strong, random password.

- **`length`**: `number` (optional, default: 12) - The desired password length.
- **`options`**: `PasswordValidationOptions` (optional) - Customize required character sets.
- **Returns**: `string` - A securely generated password.

```javascript
import { generateStrongPassword } from 'rgex';

const password = generateStrongPassword(16, { hasSymbol: true });
console.log(password);
```

### Other Utility Functions

#### `escapeRegex(text)`

Escapes special regex characters in a string.

```javascript
import { escapeRegex } from 'rgex';

console.log(escapeRegex('hello (world)')); // 'hello \(world\)'
```

#### `isValidRegex(pattern)`

Checks if a string is a valid regex pattern.

```javascript
import { isValidRegex } from 'rgex';

console.log(isValidRegex('^[a-z]+$')); // true
console.log(isValidRegex('[a-z')); // false
```

### Constants

#### `REGEX_PATTERNS`

An object containing a large collection of pre-built regex patterns as strings.

```javascript
import { REGEX_PATTERNS } from 'rgex';

const uuidRegex = new RegExp(REGEX_PATTERNS.UUID);
console.log(uuidRegex.test('123e4567-e89b-12d3-a456-426614174000')); // true
```

#### `COMMON_PASSWORDS`

An array of common passwords used by the `validatePassword` function.

```javascript
import { COMMON_PASSWORDS } from 'rgex';

console.log(COMMON_PASSWORDS.includes('password')); // true
```

## Contributing

Contributions are welcome! Please feel free to submit a pull request or open an issue.

## License

This project is licensed under the [MIT License](https://github.com/duongnguyen321/rgex/blob/main/LICENSE).

> A project by [@duonguyen.site AKA codetails.site](https://codetails.site)
