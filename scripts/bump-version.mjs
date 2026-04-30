/**
 * Bump patch version in package.json and sync to Cargo.toml
 */
import { readFileSync, writeFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const rootDir = join(__dirname, '..');
const packageJsonPath = join(rootDir, 'package.json');
const cargoTomlPath = join(rootDir, 'src-tauri', 'Cargo.toml');

// Read package.json
const packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf-8'));
const currentVersion = packageJson.version;

// Parse semver (e.g., 0.0.0 -> 0.0.1)
const [major, minor, patch] = currentVersion.split('.').map(Number);
const newVersion = `${major}.${minor}.${patch + 1}`;

// Update package.json
packageJson.version = newVersion;
writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2) + '\n');

// Update Cargo.toml
let cargoToml = readFileSync(cargoTomlPath, 'utf-8');
cargoToml = cargoToml.replace(
  /^version\s*=\s*"[^"]+"/m,
  `version = "${newVersion}"`,
);
writeFileSync(cargoTomlPath, cargoToml);

console.log(`Version bumped: ${currentVersion} → ${newVersion}`);
