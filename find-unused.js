// execute:
// node find-unused.js

const fs = require('fs');
const path = require('path');

function findUnusedFiles() {
  const srcDir = './src';
  const allFiles = [];
  const usedImports = new Set();

  // Get all JS/JSX/TS files
  function getAllFiles(dir) {
    const items = fs.readdirSync(dir);
    items.forEach(item => {
      const fullPath = path.join(dir, item);
      const stat = fs.statSync(fullPath);

      if (stat.isDirectory()) {
        getAllFiles(fullPath);
      } else if (
        fullPath.endsWith('.js') ||
        fullPath.endsWith('.jsx') ||
        fullPath.endsWith('.ts') ||
        fullPath.endsWith('.tsx')
      ) {
        allFiles.push(fullPath);

        // Read file and find imports
        const content = fs.readFileSync(fullPath, 'utf8');
        const importMatches = content.matchAll(/from\s+['"]([^'"]+)['"]/g);
        for (const match of importMatches) {
          usedImports.add(match[1]);
        }

        const requireMatches = content.matchAll(/require\s*\(\s*['"]([^'"]+)['"]\s*\)/g);
        for (const match of requireMatches) {
          usedImports.add(match[1]);
        }
      }
    });
  }

  getAllFiles(srcDir);

  console.log('🔍 Checking for unused files...\n');

  // Files that should NEVER be eliminated (core application files only)
  const neverEliminate = [
    // Core application files
    'App.js', 'App.jsx', 'App.ts', 'App.tsx',
    'main.js', 'main.jsx', 'main.ts', 'main.tsx',
    'index.js', 'index.jsx', 'index.ts', 'index.tsx',

    // Entry points and routers
    'router.js', 'router.jsx', 'routes.js', 'routes.jsx',
    'Router.js', 'Router.jsx', 'Routes.js', 'Routes.jsx',

    // Context providers
    'AuthContext.js', 'AuthContext.jsx',
    'AppContext.js', 'AppContext.jsx',

    // Configuration files
    'config.js', 'config.jsx',
    'constants.js', 'constants.jsx',

    // Service files
    'api.js', 'api.jsx',
    'auth.js', 'auth.jsx',
    'services.js', 'services.jsx',

    // Utility files that might be used dynamically
    'utils.js', 'utils.jsx',
    'helpers.js', 'helpers.jsx',
    'common.js', 'common.jsx',

    // Your specific authserver-frontend files
    'NavBar.js', 'NavBar.jsx',
    'DynamicField.js', 'DynamicField.jsx',
    'EditApp.js', 'EditApp.jsx',
    'ThisApp.js', 'ThisApp.jsx'
  ];

  // First pass: Identify which source files are used
  const usedSourceFiles = new Set();

  allFiles.forEach(file => {
    const fileName = path.basename(file);
    const relativePath = path.relative(srcDir, file);
    const importPath = './' + relativePath.replace(/\\/g, '/').replace(/\.[^/.]+$/, '');

    // Skip test files in first pass
    if (file.includes('.test.') || file.includes('.spec.')) {
      return;
    }

    // Check if this file should never be eliminated
    const shouldNeverEliminate = neverEliminate.some(pattern => {
      if (typeof pattern === 'string') {
        return fileName === pattern;
      }
      return false;
    });

    if (shouldNeverEliminate) {
      usedSourceFiles.add(file);
      return;
    }

    let isUsed = false;

    // Check if this file is imported anywhere
    for (const usedImport of usedImports) {
      if (
        usedImport.includes(relativePath.replace(/\.[^/.]+$/, '')) ||
        usedImport.endsWith(importPath) ||
        usedImport.includes(path.basename(file, path.extname(file)))
      ) {
        isUsed = true;
        break;
      }
    }

    // Check for dynamic imports and other usage patterns
    if (!isUsed) {
      const fileContent = fs.readFileSync(file, 'utf8');

      const hasDynamicImport = fileContent.includes('React.lazy') ||
                              fileContent.includes('import(');

      const isContextProvider = fileContent.includes('createContext') ||
                               fileContent.includes('Context.Provider');

      const isHookFile = fileName.startsWith('use') &&
                        (fileContent.includes('export function') ||
                         fileContent.includes('export const') ||
                         fileContent.includes('export default'));

      const hasExports = fileContent.includes('export ') &&
                        !fileContent.includes('export default function') &&
                        !fileContent.includes('export default class');

      if (hasDynamicImport || isContextProvider || isHookFile || hasExports) {
        isUsed = true; // Mark as used for test file consideration
      }
    }

    if (isUsed) {
      usedSourceFiles.add(file);
    }
  });

  // Second pass: Check all files and handle test files intelligently
  allFiles.forEach(file => {
    const fileName = path.basename(file);
    const relativePath = path.relative(srcDir, file);
    const importPath = './' + relativePath.replace(/\\/g, '/').replace(/\.[^/.]+$/, '');

    // Check if this is a test file
    const isTestFile = file.includes('.test.') || file.includes('.spec.');

    if (isTestFile) {
      // Find the corresponding source file for this test
      const sourceFilePath = file.replace(/\.test\./, '.').replace(/\.spec\./, '.');

      // Check if the source file exists and is used
      if (fs.existsSync(sourceFilePath)) {
        const sourceFileKey = sourceFilePath.replace(/\\/g, '/');
        if (usedSourceFiles.has(sourceFileKey)) {
          console.log(`✅ TEST KEPT: ${file} (source file is used)`);
          return;
        } else {
          console.log(`🚨 UNUSED TEST: ${file} (source file is unused)`);
          return;
        }
      } else {
        // If we can't find the source file, the test is probably unused
        console.log(`🚨 UNUSED TEST: ${file} (no corresponding source file)`);
        return;
      }
    }

    // For non-test files, use the same logic as before
    const shouldNeverEliminate = neverEliminate.some(pattern => {
      if (typeof pattern === 'string') {
        return fileName === pattern;
      }
      return false;
    });

    if (shouldNeverEliminate) {
      console.log(`✅ PROTECTED: ${file} (never eliminate)`);
      return;
    }

    let isUsed = false;

    // Check if this file is imported anywhere
    for (const usedImport of usedImports) {
      if (
        usedImport.includes(relativePath.replace(/\.[^/.]+$/, '')) ||
        usedImport.endsWith(importPath) ||
        usedImport.includes(path.basename(file, path.extname(file)))
      ) {
        isUsed = true;
        break;
      }
    }

    // Check for dynamic usage (same as first pass)
    if (!isUsed) {
      const fileContent = fs.readFileSync(file, 'utf8');

      const hasDynamicImport = fileContent.includes('React.lazy') ||
                              fileContent.includes('import(');

      const isContextProvider = fileContent.includes('createContext') ||
                               fileContent.includes('Context.Provider');

      const isHookFile = fileName.startsWith('use') &&
                        (fileContent.includes('export function') ||
                         fileContent.includes('export const') ||
                         fileContent.includes('export default'));

      const hasExports = fileContent.includes('export ') &&
                        !fileContent.includes('export default function') &&
                        !fileContent.includes('export default class');

      if (hasDynamicImport || isContextProvider || isHookFile || hasExports) {
        console.log(`🔶 REVIEW: ${file} (has exports/dynamic usage)`);
        return;
      }
    }

    if (!isUsed) {
      // Check if it's a component (Capitalized)
      const isComponent = /[A-Z]/.test(path.basename(file, path.extname(file))[0]);

      if (isComponent) {
        console.log(`🚨 UNUSED COMPONENT: ${file}`);
      } else {
        console.log(`⚠️  Possibly unused: ${file}`);
      }
    }
  });

  console.log('\n✅ Scan complete!');
  console.log('\n📋 Legend:');
  console.log('✅ PROTECTED - Core files that should never be eliminated');
  console.log('✅ TEST KEPT - Test files for source files that are being kept');
  console.log('🔶 REVIEW - Files that need manual review');
  console.log('🚨 UNUSED COMPONENT - React components not imported anywhere');
  console.log('🚨 UNUSED TEST - Test files for unused source files');
  console.log('⚠️  Possibly unused - Other files not imported anywhere');
  console.log('\n💡 Tip: Test files are only kept if their corresponding source file is used!');
}

findUnusedFiles();