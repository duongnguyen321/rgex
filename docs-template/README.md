# RGex Documentation

Welcome to the comprehensive documentation for **RGex** - A powerful, chainable regex builder with AI-powered features.

## 🚀 Quick Navigation

- [📖 **API Reference**](./globals.md) - Complete API documentation
- [🏗️ **Classes**](./classes/) - RGex class and methods
- [🔧 **Functions**](./functions/) - Utility functions
- [📋 **Interfaces**](./interfaces/) - Type definitions
- [📊 **Variables**](./variables/) - Constants and patterns

## 🌟 Key Features

### 🔗 Chainable API

Build regex patterns using intuitive method chaining:

```typescript
const emailRegex = RGex.create().start().email().end().build();
```

### 🧠 AI-Powered Text Parsing

Convert human descriptions to regex patterns:

```typescript
const result = RGex.toRegex('email address');
// Returns: { success: true, pattern: /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@.../ }
```

### 🔒 Advanced Password Validation

Comprehensive password strength analysis:

```typescript
const analysis = new RGex('MyPassword123!').passwordCase();
// Returns detailed scoring and validation results
```

## 📚 Documentation Sections

### Core Classes

- **[RGex](./classes/RGex.md)** - Main regex builder class with fluent API

### Key Functions

- **[parseHumanTextToRegex](./functions/parseHumanTextToRegex.md)** - Convert human text to regex
- **[parseHumanTextToValidation](./functions/parseHumanTextToValidation.md)** - Extract validation rules
- **[validatePassword](./functions/validatePassword.md)** - Password strength analysis

### Type Definitions

- **[TextExtractionResult](./interfaces/TextExtractionResult.md)** - Regex parsing results
- **[ValidationExtractionResult](./interfaces/ValidationExtractionResult.md)** - Validation results
- **[PasswordValidationResult](./interfaces/PasswordValidationResult.md)** - Password analysis results

### Constants & Patterns

- **[REGEX_PATTERNS](./variables/REGEX_PATTERNS.md)** - Pre-built regex patterns
- **[HUMAN_PATTERNS](./variables/HUMAN_PATTERNS.md)** - Human-readable pattern mappings

## 🔧 Installation & Usage

```bash
npm install rgex
```

```typescript
import { RGex, t2r } from 'rgex';

// Chainable API
const regex = RGex.create().email().build();

// AI-powered parsing
const result = t2r('phone number');

// Password validation
const analysis = new RGex('password123').passwordCase();
```

## 🎯 Examples

### Basic Usage

```typescript
// Email validation
const emailRegex = RGex.create().email();
console.log(emailRegex.test('user@example.com')); // true

// URL validation
const urlRegex = RGex.create().url();
console.log(urlRegex.test('https://example.com')); // true
```

### Advanced Patterns

```typescript
// Complex business pattern
const invoicePattern = t2r('invoice number with year and sequential number');
// Matches: INV-2024-001234

// Security pattern
const apiKeyPattern = t2r('api key with prefix and 32 character hex string');
// Matches: sk_1234567890abcdef1234567890abcdef
```

## 📊 Performance

- **Zero Dependencies** - Lightweight with no external dependencies
- **TypeScript Support** - Full type safety and IntelliSense
- **Comprehensive Testing** - 148+ tests ensuring reliability
- **Minified Build** - Optimized for production use

## 🔗 Links

- [GitHub Repository](https://github.com/duongnguyen321/rgex)
- [NPM Package](https://www.npmjs.com/package/rgex)
- [Issues & Support](https://github.com/duongnguyen321/rgex/issues)

---

_This documentation is automatically generated from the source code using TypeDoc._
