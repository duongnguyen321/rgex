#!/usr/bin/env tsx

import { execSync } from 'child_process';
import { existsSync, mkdirSync } from 'fs';

const MODULES = [
	'core',
	'utils',
	'human-text',
	'password',
	'constants',
	'types',
];

function exec(cmd: string): void {
	try {
		execSync(cmd, { stdio: 'inherit' });
	} catch (error) {
		console.error(`Build failed: ${error}`);
		process.exit(1);
	}
}

function ensureDir(): void {
	if (!existsSync('dist')) mkdirSync('dist');
}

function buildAll(): void {
	console.log('Building...');
	ensureDir();

	// Build main + modules in one go
	const jsBuild = [
		'bun build index.ts --outdir dist --target node --minify --splitting --format esm',
		...MODULES.map(
			(m) =>
				`bun build ${m}.ts --outfile dist/${m}.js --target node --minify --format esm`
		),
	].join(' && ');

	exec(jsBuild);

	// Build all types in one go
	const typesBuild = [
		'tsc --emitDeclarationOnly',
		...MODULES.map(
			(m) =>
				`tsc ${m}.ts --declaration --emitDeclarationOnly --outDir dist --declarationMap`
		),
	].join(' && ');

	exec(typesBuild);

	console.log('✓ Build complete');
}

function buildDocs(): void {
	console.log('Building docs...');
	exec('typedoc --options typedoc.json');
	console.log('✓ Docs complete');
}

function buildCI(): void {
	console.log('CI Build...');
	exec('bun install');
	buildAll();
	buildDocs();
	exec('bun test');
	console.log('✓ CI complete');
}

const cmd = process.argv[2] || 'build';
const start = Date.now();

switch (cmd) {
	case 'build':
		buildAll();
		break;
	case 'docs':
		buildDocs();
		break;
	case 'full':
		buildAll();
		buildDocs();
		break;
	case 'ci':
		buildCI();
		break;
	default:
		console.log('Usage: tsx scripts/build.ts [build|docs|full|ci]');
		process.exit(1);
}

console.log(`Done in ${((Date.now() - start) / 1000).toFixed(1)}s`);
