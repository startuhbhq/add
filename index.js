import * as fromObject from './build/from-object.js';

// Get the JSON input from command line arguments
const inputJson = process.argv[2];

if (!inputJson) {
  console.error('Usage: npm start -- \'{"object": {...}, "fields": [...]}\'');
  process.exit(1);
}

try {
  const result = JSON.parse(fromObject.run(inputJson));
  console.log('result:', result);
} catch (error) {
  console.error('Error:', error.message);
  process.exit(1);
}
