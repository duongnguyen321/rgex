# RGex - Powerful Regex Builder Platform

[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![NPM](https://img.shields.io/badge/NPM-CB3837?style=flat-square&logo=npm&logoColor=white)](https://www.npmjs.com/)

A modern, chainable regex builder with intuitive methods and comprehensive validation utilities. Build complex regular expressions using readable, fluent syntax instead of cryptic regex patterns. Now featuring AI-powered human text parsing and advanced password validation.

## ✨ Features

- 🔗 **Chainable API**: Build regex patterns using intuitive method chaining.
- ✅ **Pre-built Patterns**: Ready-to-use patterns for emails, URLs, phones, and more.
- 🧠 **AI Text Parsing**: Convert human descriptions to regex patterns and validation rules.
- 🔒 **Advanced Password Validation**: Detailed password strength analysis with scoring.
- 🚀 **TypeScript Support**: Full type safety and IntelliSense support.
- 🧪 **Comprehensive Testing**: Extensive test suite ensuring reliability.
- 📦 **Zero Dependencies**: Lightweight with no external dependencies.

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Run examples
npm run examples

# Run tests
npm test

# Run help/reference
npm run help
```

## 📁 Project Structure

```
rgex/
├── src/                    # Main source code
│   ├── core/               # Core RGex class and builder logic
│   │   └── RGex.ts
│   ├── utils/              # Utility functions
│   │   ├── helpers.ts
│   │   ├── humanText.ts    # AI-powered text parsing
│   │   └── password.ts     # Password validation
│   ├── constants/          # Pre-defined patterns and keywords
│   │   ├── patterns.ts
│   │   └── validation.ts
│   ├── config/             # Library configuration
│   │   └── index.ts
│   └── index.ts            # Main entry point for exports
├── types/                  # TypeScript type definitions
│   └── index.ts
├── examples/               # Usage examples
│   └── examples.ts
├── test/                   # Test suite
│   └── rgex.test.ts
├── scripts/                # Utility scripts
│   └── scripts.ts
├── package.json            # Package configuration
└── README.md               # This file
```

## 📖 Basic Usage

### Creating Patterns

```typescript
import { rgex } from './index.js';

// Simple email pattern
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

console.log(emailPattern.test('user@example.com')); // true
```

### Using Pre-built Patterns

```typescript
import { RGex } from './index.js';

// Validate common data types
console.log(RGex.create().email().test('user@example.com')); // true
console.log(RGex.create().url().test('https://example.com')); // true
console.log(RGex.create().phone().test('+1234567890')); // true
```

## 🔧 API Reference

### Builder Methods

- **`literal(text)`**: Adds literal text, escaping special characters.
- **`raw(pattern)`**: Adds a raw, unescaped regex pattern.
- **`digit()`**: Matches any digit (`\\d`).
- **`word()`**: Matches any word character (`\\w`).
- **`whitespace()`**: Matches any whitespace character (`\\s`).
- **`any()`**: Matches any character (`.`).
- **`start()`**: Asserts the start of the string (`^`).
- **`end()`**: Asserts the end of the string (`$`).
- **`or(pattern)`**: Adds an "or" condition (`|`).
- **`quantifier(min, max?)`**: Specifies a quantity range (`{min,max}`).
- **`zeroOrMore()`**: Appends `*`.
- **`oneOrMore()`**: Appends `+`.
- **`optional()`**: Appends `?`.
- **`group(pattern)`**: Creates a capturing group (`(...)`).
- **`nonCapturingGroup(pattern)`**: Creates a non-capturing group (`(?:...)`).
- **`lookahead(pattern, negative?)`**: Adds a positive or negative lookahead.
- **`lookbehind(pattern, negative?)`**: Adds a positive or negative lookbehind.

### Pre-built Patterns

- **`email()`**: Matches a standard email format.
- **`url()`**: Matches a standard URL.
- **`phone()`**: Matches a standard phone number.
- **`date()`**: Matches a date in `YYYY-MM-DD` format.
- **`time()`**: Matches a time in `HH:MM` or `HH:MM:SS` format.
- **`number()`**: Matches an integer or decimal number.
- **`uuid()`**: Matches a UUID.
- **`ipv4()`**: Matches an IPv4 address.
- **`hexColor()`**: Matches a hex color code.

### Utility Methods

- **`test(input)`**: Tests the pattern against a string.
- **`exec(input)`**: Executes the pattern and returns the match array.
- **`match(input)`**: Returns all matches in the string.
- **`replace(input, replacement)`**: Replaces matches with a string or function.
- **`split(input)`**: Splits a string by the pattern.
- **`build()`**: Builds and returns the `RegExp` object.
- **`isValid()`**: Checks if the current pattern is a valid regex.
- **`getPattern()`**: Returns the raw pattern string.
- **`getFlags()`**: Returns the flags string.
- **`clone()`**: Creates a copy of the `RGex` instance.
- **`reset()`**: Clears the pattern and options.
- **`toString()`**: Returns the string representation (`/pattern/flags`).

## 🧠 AI-Powered Features

### Human Text to Regex

Convert natural language descriptions into regex patterns:

```typescript
import { RGex } from './index.js';

const emailResult = RGex.toRegex('email address', 'user@example.com');
console.log(emailResult);
// {
//   success: true,
//   pattern: /.../,
//   description: 'Valid email address',
//   confidence: 0.95
// }
```

### Human Text to Validation

Extract validation rules from a description:

```typescript
import { parseHumanTextToValidation } from './index.js';

const validationResult = parseHumanTextToValidation(
	'required email min length 5 max length 50',
	'test@example.com'
);
console.log(validationResult);
// {
//   success: true,
//   rules: [ ... ],
//   confidence: 0.6
// }
```

## 🔒 Advanced Password Validation

Validate password strength with detailed analysis and scoring:

```typescript
import { validatePassword } from './index.js';

const result = validatePassword('MyStr0ng!P@ssw0rd2024', {
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

console.log(result);
// {
//   error: null,
//   pass: { ... }, // Detailed pass/fail for each rule
//   score: 100,
//   strength: 'very-strong'
// }
```

You can also use the `passwordCase` method on an `RGex` instance:

```typescript
import { RGex } from './index.js';

const result = new RGex('MyStr0ng!P@ssw0rd2024').passwordCase({
	minLength: 12,
	hasSpecial: true,
});
```

## 🤝 Contributing

Contributions are welcome! Please open an issue or submit a pull request if you have any suggestions or improvements.

## 📄 License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
