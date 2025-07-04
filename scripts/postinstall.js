#!/usr/bin/env node

/**
 * RGex Post-install Script
 * Shows thank you message and website link
 */

const colors = {
	reset: '\x1b[0m',
	bright: '\x1b[1m',
	cyan: '\x1b[36m',
	green: '\x1b[32m',
	blue: '\x1b[34m',
	magenta: '\x1b[35m',
	yellow: '\x1b[33m',
};

const logo = `
${colors.cyan}┌─────────────────────────────────────────────────────────────┐
│                                                             │
│  ██████╗  ██████╗ ███████╗██╗  ██╗                          │
│  ██╔══██╗██╔════╝ ██╔════╝╚██╗██╔╝                          │
│  ██████╔╝██║  ███╗█████╗   ╚███╔╝                           │
│  ██╔══██╗██║   ██║██╔══╝   ██╔██╗                           │
│  ██║  ██║╚██████╔╝███████╗██╔╝ ██╗                          │
│  ╚═╝  ╚═╝ ╚═════╝ ╚══════╝╚═╝  ╚═╝                          │
│                                                             │
│             ${colors.yellow}A Powerful Regex Builder Platform${colors.cyan}              │
│                                                             │
└─────────────────────────────────────────────────────────────┘${colors.reset}
`;

const message = `
${colors.bright}${colors.green}🎉 Thank you for installing RGex! 🎉${colors.reset}

${colors.bright}Enhanced Features:${colors.reset}
${colors.blue}🔤${colors.reset} Human text to regex conversion
${colors.blue}✅${colors.reset} Intelligent validation extraction  
${colors.blue}🔒${colors.reset} Advanced password analysis
${colors.blue}⚡${colors.reset} Chainable regex builder API

${colors.bright}Get Started:${colors.reset}
${colors.yellow}import { RGex } from 'rgex';

// Convert human text to regex
const result = RGex.toRegex('email address', 'test@example.com');

// Build patterns fluently  
const regex = RGex.create()
  .start()
  .email()
  .end()
  .build();

// Advanced password validation
const validation = new RGex('myPassword123!').passwordCase();${colors.reset}

${colors.bright}${colors.magenta}🌐 Learn More: ${colors.cyan}https://codetails.site${colors.reset}

${colors.bright}Happy Coding! 🚀${colors.reset}
`;

// Only show message if not in CI environment
if (!process.env.CI && !process.env.SILENT_INSTALL) {
	console.log(logo);
	console.log(message);
}

// Track installation (anonymous)
try {
	// Optional: Add anonymous usage analytics here
	// This is commented out by default for privacy
	// const https = require('https');
	// const postData = JSON.stringify({
	//   event: 'install',
	//   package: 'rgex',
	//   version: require('../package.json').version,
	//   timestamp: new Date().toISOString()
	// });
	// const req = https.request({
	//   hostname: 'api.example.com',
	//   port: 443,
	//   path: '/analytics',
	//   method: 'POST',
	//   headers: {
	//     'Content-Type': 'application/json',
	//     'Content-Length': Buffer.byteLength(postData)
	//   }
	// }, (res) => {
	//   // Silent analytics
	// });
	// req.on('error', () => {
	//   // Silently ignore analytics errors
	// });
	// req.write(postData);
	// req.end();
} catch (error) {
	// Silently ignore any errors
}
