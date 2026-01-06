// vitest.setup.js
import { expect } from 'vitest';
import * as matchers from 'vitest-dom/matchers';

// Extend Vitest's expect method with the vitest-dom matchers
expect.extend(matchers);