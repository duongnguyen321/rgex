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

# RGex Documentation Guide

## 📚 How to Access T2R-T2V Information

The comprehensive T2R (Text-to-Regex) and T2V (Text-to-Validation) functionality is now fully integrated into the main TypeDoc documentation. Here's how to find and use this information:

### 🔍 In the Generated Documentation

1. **Main Overview**: The homepage (`docs/index.html`) contains a comprehensive overview of all T2R-T2V features
2. **Function Documentation**: Individual functions like `t2r`, `t2v`, `h2r`, `h2v` are documented with full examples
3. **Pattern Categories**: All advanced pattern categories are documented with examples

### 📖 Key Documentation Sections

#### 1. **Natural Language Processing (T2R & T2V)**

- Location: Main documentation homepage
- Contains: Complete examples of text-to-regex and text-to-validation conversion
- Examples: From simple patterns to complex business requirements

#### 2. **Advanced Pattern Categories**

The documentation includes 11 comprehensive pattern categories:

- 🏢 **Business & Professional**: Employee IDs, Invoice numbers, Product SKUs
- 🔐 **Security & Authentication**: 2FA codes, API keys, JWT tokens
- 💰 **Financial & Banking**: IBAN codes, Bitcoin addresses, SWIFT codes
- 🏥 **Healthcare Identifiers**: Medical records, Prescription numbers
- 🎓 **Educational Systems**: Student IDs, Course codes, Grades
- 🚗 **Transportation**: License plates, Flight numbers, Tracking numbers
- 💻 **Technology & Development**: Docker tags, Git hashes, Kubernetes pods
- 🌍 **International Support**: Unicode text, International names
- 🔒 **Complex Validation**: Advanced password rules, Custom domains
- 📁 **Advanced File Patterns**: Unix paths, Semantic versions, Log entries

#### 3. **Function Reference**

- `t2r()` - Text to Regex conversion
- `t2v()` - Text to Validation conversion
- `h2r()` - Human text to Regex (alias)
- `h2v()` - Human text to Validation (alias)
- Plus all utility functions

### 🎯 Quick Access Links

In the generated documentation, you'll find:

- **Navigation Links**: Direct links to GitHub, NPM, and examples
- **Sidebar Links**: Quick access to the T2R & T2V Guide on GitHub
- **Search Functionality**: Search for specific patterns or functions
- **Enhanced Styling**: Beautiful, modern UI with syntax highlighting

### 🚀 Testing the Documentation

To verify the T2R-T2V functionality works as documented:

```bash
# Test basic functionality
bun -e "
import { t2r, t2v } from './index.ts';
console.log('Email regex:', t2r('email address').pattern.toString());
console.log('Business email validation:', t2v('business email address', 'user@company.com').allPassed);
"
```

### 📋 Documentation Features

The enhanced TypeDoc configuration includes:

- **Custom CSS**: Beautiful styling with gradients and animations
- **Enhanced Search**: Search in comments and documents
- **Comprehensive Navigation**: Multiple navigation options
- **Responsive Design**: Works on all devices
- **Dark Mode Support**: Automatic dark mode detection
- **Performance Optimized**: Fast loading and rendering

### 🔧 Regenerating Documentation

To regenerate the documentation with any changes:

```bash
bun run docs
```

This will rebuild the documentation with all the latest changes and ensure the T2R-T2V information is up to date.

---

**Note**: The T2R-T2V.md file is no longer needed as a separate entry point since all the information is now comprehensively integrated into the main documentation through the enhanced JSDoc comments in the source code.
