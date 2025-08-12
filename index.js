import * as add from './build/add.js';

const result = JSON.parse(add.run('{"a":1,"b":8}'));
console.log('result:', result);
