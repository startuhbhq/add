// package.json must have: { "type": "module" }

globalThis.log = console.log; // satisfies env.log used by the wrapper

import * as add from './build/add.js';

const result = add.run('{"a":1,"b":2}');
console.log('result:', result);
