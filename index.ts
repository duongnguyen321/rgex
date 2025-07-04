/**
 * RGex Entry Point
 * Provides backward compatibility and main exports
 */

// Export everything from the main source
export * from './src/index.ts';

// Default export for convenience
export { default } from './src/index.ts';

// Show installation message on first import (only once)
if (typeof globalThis !== 'undefined' && !(globalThis as any).__RGEX_LOADED__) {
	(globalThis as any).__RGEX_LOADED__ = true;

	// Only show in development or when explicitly requested
	if (
		process?.env?.NODE_ENV !== 'production' &&
		process?.env?.RGEX_WELCOME !== 'false'
	) {
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
