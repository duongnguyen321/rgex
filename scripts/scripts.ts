#!/usr/bin/env bun

console.log('🚀 RGex - Regex Builder Platform');
console.log('=================================\n');

console.log('📋 Available Scripts:');
console.log('  bun test              - Run comprehensive test suite');
console.log('  bun run examples      - See examples of all features');
console.log('  bun run dev           - Run the main index file');
console.log('  bun build             - Build for production');
console.log('  bun run lint          - Check TypeScript types');
console.log('  bun start             - Quick start with examples\n');

console.log('🔧 Quick API Overview:');
console.log('======================\n');

console.log('📝 Builder Methods:');
console.log('  .startWith(text)      - Match at beginning');
console.log('  .endWith(text)        - Match at end');
console.log('  .include(text)        - Include anywhere');
console.log('  .constant(text)       - Exact match (escaped)');
console.log('  .capture(pattern)     - Create capture group');
console.log('  .digit()              - Match digits (0-9)');
console.log('  .letter()             - Match letters (a-z, A-Z)');
console.log('  .word()               - Match word characters');
console.log('  .whitespace()         - Match whitespace');
console.log('  .optional()           - Make previous optional (?)');
console.log('  .oneOrMore()          - One or more (+)');
console.log('  .zeroOrMore()         - Zero or more (*)');
console.log('  .repeat(n)            - Repeat exactly n times');
console.log('  .repeat(min, max)     - Repeat between min-max times');
console.log('  .lookahead(pattern)   - Positive lookahead');
console.log('  .raw(pattern)         - Add raw regex pattern\n');

console.log('✅ Validation Methods:');
console.log('  .isEmail(text)        - Valid email address');
console.log('  .isLink(text)         - Valid HTTP/HTTPS URL');
console.log('  .isPhone(text)        - Valid phone number');
console.log('  .isIP(text)           - Valid IP address (v4/v6)');
console.log('  .isUUID(text)         - Valid UUID');
console.log('  .isMongoID(text)      - Valid MongoDB ObjectID');
console.log('  .isCreditCard(text)   - Valid credit card');
console.log('  .isDate(text)         - Valid date (YYYY-MM-DD)');
console.log('  .isTime(text)         - Valid time (HH:MM)');
console.log('  .isHexColor(text)     - Valid hex color');
console.log('  .isSlug(text)         - Valid URL slug');
console.log('  .isUsername(text)     - Valid username');
console.log('  .isDomain(text)       - Valid domain name');
console.log('  .isPort(text)         - Valid port number');
console.log('  .isMAC(text)          - Valid MAC address');
console.log('  .isJSON(text)         - Valid JSON string');
console.log('  .isBase64(text)       - Valid base64 string');
console.log('  .isPassword(text, opts) - Password strength');
console.log('  .passwordCase(pwd, opts) - Detailed password validation\n');

console.log('🎯 Pre-built Patterns:');
console.log('  patterns.email()      - Email validation pattern');
console.log('  patterns.url()        - URL validation pattern');
console.log('  patterns.phone()      - Phone number pattern');
console.log('  patterns.uuid()       - UUID pattern');
console.log('  patterns.ipv4()       - IPv4 address pattern');
console.log('  patterns.hexColor()   - Hex color pattern');
console.log('  patterns.slug()       - URL slug pattern');
console.log('  patterns.username()   - Username pattern\n');

console.log('🔨 Utility Methods:');
console.log('  .test(text)           - Test if pattern matches');
console.log('  .exec(text)           - Execute and get matches');
console.log('  .match(text)          - Find all matches');
console.log('  .replace(text, repl)  - Replace matches');
console.log('  .split(text)          - Split by pattern');
console.log('  .toRegex()            - Convert to RegExp');
console.log('  .toString()           - Get pattern string');
console.log('  RGex.toRegex(text, val) - Convert human text to regex');
console.log('  RGex.toValidate(text, val) - Extract validation rules\n');

console.log('💡 Quick Examples:');
console.log('====================\n');

console.log('// Import the library');
console.log("import { rgex, patterns, RGex } from '../src/index.js';\n");

console.log('// 1. Simple email validation');
console.log('const emailPattern = rgex()');
console.log('  .letter().oneOrMore()');
console.log('  .constant("@")');
console.log('  .letter().oneOrMore()');
console.log('  .constant(".")');
console.log('  .letter().repeat(2, 4);');
console.log('console.log(emailPattern.test("user@example.com")); // true\n');

console.log('// 2. Using pre-built patterns');
console.log(
	'console.log(patterns.email().test("user@example.com")); // true\n'
);

console.log('// 3. Using validation methods');
console.log('const validator = new RGex();');
console.log('console.log(validator.isEmail("user@example.com")); // true\n');

console.log('// 4. Complex pattern with capture groups');
console.log('const logPattern = rgex()');
console.log('  .capture("\\\\d{4}-\\\\d{2}-\\\\d{2}")  // Date');
console.log('  .whitespace()');
console.log('  .capture("\\\\d{2}:\\\\d{2}:\\\\d{2}")  // Time');
console.log('  .whitespace()');
console.log('  .capture("[A-Z]+")                // Level');
console.log('  .whitespace()');
console.log('  .capture(".*");                   // Message\n');

console.log('// 5. Password strength validation');
console.log('const strongPassword = rgex()');
console.log('  .lookahead(".*[a-z]")      // Must contain lowercase');
console.log('  .lookahead(".*[A-Z]")      // Must contain uppercase');
console.log('  .lookahead(".*\\\\d")       // Must contain digit');
console.log('  .lookahead(".*[!@#$%^&*]") // Must contain special char');
console.log('  .anyChar().repeat(8, 128); // 8-128 characters\n');

console.log('🎉 Ready to build amazing regex patterns!');
console.log('Run `bun run examples` to see more comprehensive examples.');
console.log('Run `bun test` to see all features being tested.');
