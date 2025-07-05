# 📦 RGex Modular Imports

RGex now supports **modular imports** that allow you to import only the parts you need, significantly reducing your bundle size!

## 🎯 Why Modular Imports?

Instead of importing the entire 61KB library, you can now import specific modules:

- **Full import**: 61KB
- **Core only**: 57KB (6% smaller)
- **Utils only**: 2.6KB (96% smaller!)
- **Human text only**: 49KB (20% smaller)
- **Password only**: 13KB (79% smaller)
- **Constants only**: 12KB (80% smaller)

## 📋 Available Modules

### 1. Core Module (`rgex/core`)

```typescript
import { RGex, rgex } from 'rgex/core';

// Build regex patterns
const emailRegex = new RGex().start().email().end().build();
const phoneRegex = rgex('^\\+?[1-9]\\d{1,14}$');
```

**Size**: 57KB

### 2. Utils Module (`rgex/utils`)

```typescript
import { escapeRegex, extractNumbers, isValidEmail } from 'rgex/utils';

// Utility functions
const escaped = escapeRegex('Hello (world)!');
const numbers = extractNumbers('Order #12345 costs $67.89');
const isValid = isValidEmail('test@example.com');
```

**Size**: 2.6KB

### 3. Human Text Module (`rgex/human-text`)

```typescript
import { t2r, t2v, humanToRegex } from 'rgex/human-text';

// Convert human text to regex
const phonePattern = t2r('phone number');
const emailValidation = t2v('required email address');
```

**Size**: 49KB

### 4. Password Module (`rgex/password`)

```typescript
import { validatePassword, generateStrongPassword } from 'rgex/password';

// Password utilities
const password = generateStrongPassword(12);
const validation = validatePassword('MyPassword123!');
```

**Size**: 13KB

### 5. Constants Module (`rgex/constants`)

```typescript
import { REGEX_PATTERNS, COMMON_PASSWORDS } from 'rgex/constants';

// Pre-built patterns and constants
const emailPattern = REGEX_PATTERNS.EMAIL;
const weakPasswords = COMMON_PASSWORDS;
```

**Size**: 12KB

## 🚀 Usage Examples

### Lightweight Email Validator

```typescript
// Only 2.6KB instead of 61KB!
import { isValidEmail } from 'rgex/utils';

function validateEmail(email: string): boolean {
	return isValidEmail(email);
}
```

### Minimal Password Generator

```typescript
// Only 13KB instead of 61KB!
import { generateStrongPassword } from 'rgex/password';

function createPassword(): string {
	return generateStrongPassword(16);
}
```

### Text-to-Regex Converter

```typescript
// Only 49KB instead of 61KB!
import { t2r } from 'rgex/human-text';

function createPhoneValidator() {
	return t2r('US phone number').pattern;
}
```

## 📊 Bundle Size Comparison

| Import Style    | Bundle Size | Savings |
| --------------- | ----------- | ------- |
| Full import     | 61KB        | -       |
| Core only       | 57KB        | 6%      |
| Utils only      | 2.6KB       | **96%** |
| Human text only | 49KB        | 20%     |
| Password only   | 13KB        | 79%     |
| Constants only  | 12KB        | 80%     |

## 🔄 Migration Guide

### Before (Full Import)

```typescript
import { RGex, t2r, validatePassword } from 'rgex';
```

### After (Modular Import)

```typescript
import { RGex } from 'rgex/core';
import { t2r } from 'rgex/human-text';
import { validatePassword } from 'rgex/password';
```

## 💡 Best Practices

1. **Use specific modules** instead of the full import when possible
2. **Utils module** is perfect for simple validation functions
3. **Core module** when you need the chainable builder
4. **Human text module** for natural language processing
5. **Password module** for authentication features
6. **Constants module** for pre-built patterns

## 🛠️ TypeScript Support

All modules include full TypeScript support with JSDoc comments:

```typescript
import type { PasswordValidationResult } from 'rgex/password';
import { validatePassword } from 'rgex/password';

const result: PasswordValidationResult = validatePassword('test123');
```

## 📈 Performance Impact

- **Faster initial loading**: Smaller bundles load faster
- **Better tree-shaking**: Only include what you use
- **Reduced memory usage**: Less code in memory
- **Improved startup time**: Less JavaScript to parse

Choose the right module for your use case and enjoy the significantly smaller bundle sizes! 🎉
