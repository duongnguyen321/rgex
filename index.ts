/**
 * RGex Entry Point
 * Provides backward compatibility and main exports
 */

// Export everything from the main source
export * from './src/index';

// Default export for convenience
export { default } from './src/index';

// Show installation message on first import (only once)
if (typeof globalThis !== 'undefined' && !(globalThis as any).__RGEX_LOADED__) {
	(globalThis as any).__RGEX_LOADED__ = true;

	// Check if we should show the welcome message
	let shouldShowWelcome = false;

	try {
		// Check Node.js environment
		if (typeof process !== 'undefined' && process?.env) {
			shouldShowWelcome =
				process.env.NODE_ENV !== 'production' &&
				process.env.RGEX_WELCOME !== 'false';
		}
		// Check for bundler-injected environment variables
		else if (typeof globalThis !== 'undefined') {
			const global = globalThis as any;
			if (global.process?.env) {
				shouldShowWelcome =
					global.process.env.NODE_ENV !== 'production' &&
					global.process.env.RGEX_WELCOME !== 'false';
			} else {
				// Default to showing in environments without process.env
				shouldShowWelcome = true;
			}
		} else {
			// Default for other environments
			shouldShowWelcome = true;
		}
	} catch {
		// If any error occurs, default to showing the message
		shouldShowWelcome = true;
	}

	if (shouldShowWelcome) {
		const welcome = `
🎉 RGex loaded! Enhanced regex building platform
🌐 Visit: https://codetails.site for more tools
📚 Documentation: https://github.com/duongnguyen321/rgex#readme
`;

		// Use a timeout to avoid blocking the main thread
		setTimeout(() => {
			console.log(welcome);
		}, 0);
	}
}
