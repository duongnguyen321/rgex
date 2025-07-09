# RGex: The Intelligent Regex Toolkit

[![NPM Version](https://img.shields.io/npm/v/rgex?style=flat-square&color=CB3837&logo=npm)](https://www.npmjs.com/package/rgex)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Build Status](https://img.shields.io/github/actions/workflow/status/duongnguyen321/rgex/ci.yml?branch=main&style=flat-square)](https://github.com/duongnguyen321/rgex/actions/workflows/ci.yml)
[![License](https://img.shields.io/npm/l/rgex?style=flat-square&color=lightgrey)](https://github.com/duongnguyen321/rgex/LICENSE)

**RGex is a powerful, modern, and chainable regular expression builder for TypeScript and JavaScript.** It transforms cryptic regex syntax into a readable, fluent API. With features like human-text-to-regex parsing, advanced validation utilities, and a rich set of pre-built patterns, RGex simplifies even the most complex pattern-matching tasks.

## ✨ Key Features

- **🔗 Fluent & Chainable API**: Construct complex regex patterns with an intuitive, readable builder.
- **🧠 Human Text Intelligence**: Convert natural language descriptions into regex patterns (`t2r`) or validation rules (`t2v`). The intelligent parser understands simple keywords ("email"), complex sequences ("starts with letters, then numbers"), and logical conditions ("jwt or uuid").
- **🛡️ Advanced Validation**: A comprehensive suite of over 45 validation tools for passwords, emails, and dozens of modern data formats, including JWTs, cryptocurrency addresses, cloud resource identifiers, and international standards (IBAN, SemVer).
- **📚 Rich Pattern Library**: Includes over 50 ready-to-use constants and builder methods for common types like `EMAIL`, `URL`, `DATE`, and advanced patterns for `JWT`, `SEMVER`, `MONGO_ID`, `BITCOIN_ADDRESS`, `DOCKER_IMAGE`, and more.
- **🚀 TypeScript Native**: Built with TypeScript for full type safety, autocompletion, and a great developer experience.
- **📦 Zero Dependencies**: Lightweight and self-contained.

## 📦 Installation

```bash
npm install rgex
```

## 🚀 Core Concepts

RGex is built on three main pillars that you can use independently or together.

### 1. The `RGex` Fluent Builder

The `RGex` class is a chainable API for constructing patterns method-by-method. It's best for when you need full, granular control.

```typescript
import { RGex } from 'rgex';

const usernameRegex = RGex.create()
	.start()
	.charClass('a-zA-Z0-9_-') // Letters, numbers, underscore, hyphen
	.quantifier(3, 16) // 3 to 16 characters long
	.end()
	.build(); // -> /^[a-zA-Z0-9_-]{3,16}$/
```

### 2. Human Text to Regex (`t2r`)

For rapid development, `t2r` converts a description into a ready-to-use regex. It's powered by a sophisticated parser that understands a wide variety of patterns.

```typescript
import { t2r } from 'rgex';

// Generates a complex pattern with lookaheads for each requirement
const { pattern } = t2r(
	'password with 2 uppercase 2 lowercase 2 numbers 2 special chars'
);
```

_Aliases: `h2r`, `humanToRegex`, `textToRegex`, `parseHumanTextToRegex`_

### 3. Human Text to Validation (`t2v`)

Similarly, `t2v` creates a set of validation rules from a description. It's perfect for validating forms and data without writing regex.

```typescript
import { t2v } from 'rgex';

// Simple validation
const emailValidation = t2v('required email');

// Advanced validation using the rich pattern library
const apiTokenValidation = t2v(
	'valid jwt token or git commit hash',
	'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.e30.t-IDcSemACt8xhtWd80xX1cdO43a-G_jp49CV-inFpQ'
);

console.log(apiTokenValidation.allPassed); // true
```

_Aliases: `h2v`, `humanToValidation`, `textToValidation`, `parseHumanTextToValidation`_

---

## 📖 Full API Reference

The library exports a rich set of classes, functions, types, and constants.

### The `RGex` Class API

This is the core of the fluent builder pattern.

#### Static Methods

| Method                                  | Description                                                 |
| --------------------------------------- | ----------------------------------------------------------- |
| `RGex.create(pattern?, opts?)`          | Creates a new `RGex` instance.                              |
| `RGex.toRegex(text)` (`h2r`)            | Converts human text to a regex pattern.                     |
| `RGex.toValidate(text)` (`h2v`)         | Converts human text to validation rules.                    |
| `RGex.getSuggestions(text)` (`suggest`) | Gets pattern suggestions for a text string.                 |
| `RGex.humanText(text)`                  | Creates a `RGex` instance directly from a text description. |
| `RGex.fromJSON(json)`                   | Creates an instance from a JSON object.                     |
| `RGex.escape(text)`                     | Escapes special regex characters in a string.               |
| `RGex.validate(pattern)`                | Validates if a string is a valid regex pattern.             |
| `RGex.normalize(text)`                  | Normalizes text (e.g., removes diacritics).                 |

#### Builder & Pattern Methods

| Method                                        | Description                                     |
| --------------------------------------------- | ----------------------------------------------- |
| `.literal(text)`                              | Adds literal text, escaping special characters. |
| `.raw(pattern)`                               | Adds a raw, unescaped regex pattern.            |
| `.charClass(chars, negate?)`                  | Creates a character class like `[a-z0-9]`.      |
| `.digit()`, `.word()`, `.whitespace()`        | Adds `\d`, `\w`, or `\s`.                       |
| `.group(pattern)`                             | Creates a capturing group `(...)`.              |
| `.quantifier(min, max?)`                      | Specifies quantity, e.g., `{1,3}`.              |
| `.or(pattern)`                                | Adds an "or" condition (`\|`).                  |
| `.start()`, `.end()`                          | Anchors the pattern with `^` and `$`.           |
| `.lookahead(p, neg?)`, `.lookbehind(p, neg?)` | Adds lookarounds.                               |
| `.email()`, `.url()`, `.uuid()`, etc.         | Appends pre-built patterns for common types.    |

#### Flag & Execution Methods

| Method                               | Description                                                         |
| ------------------------------------ | ------------------------------------------------------------------- |
| `.ignoreCase()` / `.global()` / etc. | Sets regex flags (`i`, `g`, etc.).                                  |
| `.build()`                           | Builds and returns the final `RegExp` object.                       |
| `.test(input)`                       | Tests the pattern against a string.                                 |
| `.exec(input)`                       | Executes the pattern and returns match details.                     |
| `.clone()`                           | Creates a copy of the `RGex` instance.                              |
| `.reset()`                           | Clears the pattern and options.                                     |
| `.toString()`                        | Returns the string representation `/pattern/flags`.                 |
| `.toJSON()`                          | Returns a JSON representation of the pattern and flags.             |
| `.passwordCase(options?)`            | Performs detailed password strength analysis on the pattern string. |

### Standalone Functions

These can be imported and used directly without a `RGex` instance.

#### Password & Validation Utilities

| Function                        | Description                                                    |
| ------------------------------- | -------------------------------------------------------------- |
| `validatePassword(pass, opts?)` | Performs a comprehensive password strength analysis.           |
| `generateStrongPassword(opts?)` | Generates a cryptographically secure password.                 |
| `getPasswordSuggestions(pass)`  | Suggests improvements for a weak password.                     |
| `hasCommonWords(pass)`          | Checks if a password is in a list of common passwords.         |
| `hasSequentialChars(pass)`      | Checks for sequential characters (e.g., "abc", "123").         |
| `hasRepeatingChars(pass)`       | Checks for repeating character sequences (e.g., "aaa", "111"). |
| `isValidEmail(email)`           | Validates an email address.                                    |
| `isValidRegex(pattern)`         | Validates if a string is a valid regex pattern.                |

#### General & Helper Utilities

| Function                        | Description                                                             |
| ------------------------------- | ----------------------------------------------------------------------- |
| `escapeRegex(text)`             | Escapes special regex characters.                                       |
| `extractNumbers(text)`          | Extracts all numbers from a string.                                     |
| `normalizeText(text)`           | Removes diacritics and normalizes whitespace.                           |
| `mergePatterns(...patterns)`    | Combines multiple regex patterns into one.                              |
| `generateTestData(pattern)`     | Generates random test data that matches a regex.                        |
| `calculatePatternComplexity(p)` | Calculates a complexity score for a regex pattern.                      |
| `optionsToFlags(opts)`          | Converts a `RegexBuilderOptions` object to a flags string (e.g., "gi"). |
| `flagsToOptions(flags)`         | Converts a flags string to an options object.                           |

### Exported Constants

Use these constants to access pre-built patterns and character sets directly.

- **`REGEX_PATTERNS`**: An object containing over 50 ready-to-use regex patterns, including `EMAIL`, `URL`, `UUID`, `JWT`, `IPV4`, `SEMVER`, `CREDIT_CARD`, `MONGO_ID`, `BITCOIN_ADDRESS`, `DOCKER_IMAGE`, and more.
- **`HUMAN_PATTERNS`**: Maps human-readable phrases to their corresponding regex patterns.
- **`VALIDATION_PATTERNS`**: A collection of over 45 validation rule factories for common data types.
- **`PATTERN_KEYWORDS`**: Keywords used by `t2r` to identify pattern types.
- **`VALIDATION_KEYWORDS`**: A dictionary of over 100 keywords and aliases used by `t2v` to identify validation rules (e.g., 'ssn', 'social security', 'jwt').
- **`COMMON_PASSWORDS`**: A `Set` containing thousands of common passwords.
- **`SPECIAL_CHARS`**, **`SYMBOLS`**: Strings containing sets of special characters for password generation and validation.

### Exported Types

RGex is fully typed for a superior developer experience.

- **`RGex`**: The core class.
- **`RegexBuilderOptions`**: Options for the builder (e.g., `{ global: true }`).
- **`TextExtractionResult`**: The return type of `t2r`, containing the pattern, confidence, etc.
- **`ValidationExtractionResult`**: The return type of `t2v`, containing rules and pass/fail status.
- **`PasswordValidationOptions`**: Rules for password validation (e.g., `{ minLength: 8, hasUpper: true }`).
- **`PasswordValidationResult`**: The detailed analysis object returned by `validatePassword`.
- **`ValidationRule`**: A type representing a single validation rule.
- **`HumanTextPattern`**: The structure for defining human-to-regex mappings.

### Configuration

- **`RGEX_CONFIG`**: A global configuration object containing default settings, feature flags, and messages used by the library.

## 📚 Official Documentation

For a deep dive into every function, type, and constant, please see our **[Full API Documentation](https://duongnguyen321.github.io/rgex)**, which is automatically generated from the source code via [TypeDoc](https://typedoc.org/) and includes the **[Advanced T2R/T2V Patterns Guide](https://github.com/duongnguyen321/rgex/T2R-T2V.md)**.

## 🤝 Contributing

Contributions are welcome! Whether it's a bug report, a new feature, or an improvement to the documentation, please feel free to open an issue or submit a pull request.

## 📜 License

This project is licensed under the **MIT License**. See the [LICENSE](https://github.com/duongnguyen321/rgex/LICENSE) file for details.

> A project by [@duonguyen.site AKA codetails.site](https://codetails.site)
