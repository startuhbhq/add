import * as fromObject from './build/from-object.js';

// Test cases
const testCases = [
  {
    name: "Single integer field",
    input: '{"object":{"prop1":1,"prop2_key1":3,"prop2_name":"ciao"},"fields":[{"key":"prop1","path":"$.prop1","type":"integer"}]}',
    expected: { results: [{ key: "prop1", value: 1 }] }
  },
  {
    name: "Single string field",
    input: '{"object":{"prop1":1,"prop2_key1":3,"prop2_name":"ciao"},"fields":[{"key":"prop2_name","path":"$.prop2.name","type":"string"}]}',
    expected: { results: [{ key: "prop2_name", value: "ciao" }] }
  },
  {
    name: "Multiple fields - mixed types",
    input: '{"object":{"prop1":1,"prop2_key1":3,"prop2_name":"ciao"},"fields":[{"key":"prop1","path":"$.prop1","type":"integer"},{"key":"prop2_key1","path":"$.prop2.key1","type":"integer"},{"key":"prop2_name","path":"$.prop2.name","type":"string"}]}',
    expected: { 
      results: [
        { key: "prop1", value: 1 },
        { key: "prop2_key1", value: 3 },
        { key: "prop2_name", value: "ciao" }
      ]
    }
  },
  {
    name: "Large integer values",
    input: '{"object":{"prop1":999999,"prop2_key1":-123,"prop2_name":"test"},"fields":[{"key":"prop1","path":"$.prop1","type":"integer"},{"key":"prop2_key1","path":"$.prop2.key1","type":"integer"}]}',
    expected: { 
      results: [
        { key: "prop1", value: 999999 },
        { key: "prop2_key1", value: -123 }
      ]
    }
  },
  {
    name: "Zero values",
    input: '{"object":{"prop1":0,"prop2_key1":0,"prop2_name":"zero"},"fields":[{"key":"prop1","path":"$.prop1","type":"integer"},{"key":"prop2_name","path":"$.prop2.name","type":"string"}]}',
    expected: { 
      results: [
        { key: "prop1", value: 0 },
        { key: "prop2_name", value: "zero" }
      ]
    }
  },
  {
    name: "Empty string",
    input: '{"object":{"prop1":1,"prop2_key1":3,"prop2_name":""},"fields":[{"key":"prop2_name","path":"$.prop2.name","type":"string"}]}',
    expected: { results: [{ key: "prop2_name", value: "" }] }
  },
  {
    name: "Special characters in string",
    input: '{"object":{"prop1":1,"prop2_key1":3,"prop2_name":"hello world! @#$%"},"fields":[{"key":"prop2_name","path":"$.prop2.name","type":"string"}]}',
    expected: { results: [{ key: "prop2_name", value: "hello world! @#$%" }] }
  },
  {
    name: "Number type (float)",
    input: '{"object":{"prop1":1.5,"prop2_key1":3.14,"prop2_name":"pi"},"fields":[{"key":"prop1","path":"$.prop1","type":"number"},{"key":"prop2_key1","path":"$.prop2.key1","type":"number"}]}',
    expected: { 
      results: [
        { key: "prop1", value: 1.5 },
        { key: "prop2_key1", value: 3.14 }
      ]
    }
  },
  {
    name: "All field types together",
    input: '{"object":{"prop1":42,"prop2_key1":3.14159,"prop2_name":"comprehensive test"},"fields":[{"key":"prop1","path":"$.prop1","type":"integer"},{"key":"prop2_key1","path":"$.prop2.key1","type":"number"},{"key":"prop2_name","path":"$.prop2.name","type":"string"}]}',
    expected: { 
      results: [
        { key: "prop1", value: 42 },
        { key: "prop2_key1", value: 3.14159 },
        { key: "prop2_name", value: "comprehensive test" }
      ]
    }
  }
];

// Error test cases
const errorTestCases = [
  {
    name: "Invalid JSON input",
    input: '{"object":{"prop1":1,"prop2_key1":3,"prop2_name":"ciao"},"fields":[{"key":"prop1","path":"$.prop1","type":"integer"}]', // Missing closing brace
    shouldThrow: true
  },
  {
    name: "Missing object field",
    input: '{"object":{"prop1":1,"prop2_key1":3,"prop2_name":""},"fields":[{"key":"prop2_name","path":"$.prop2.name","type":"string"}]}', // Empty prop2_name
    expected: { results: [{ key: "prop2_name", value: "" }] } // Should return empty string
  },
  {
    name: "Invalid path",
    input: '{"object":{"prop1":1,"prop2_key1":3,"prop2_name":"ciao"},"fields":[{"key":"invalid","path":"$.nonexistent","type":"string"}]}',
    expected: { results: [{ key: "invalid", value: "" }] } // Should return empty string
  }
];

console.log('🧪 Testing AssemblyScript WASM Module\n');
console.log('=' .repeat(60));

let passed = 0;
let failed = 0;

// Run normal test cases
console.log('\n📋 Running Normal Test Cases:');
console.log('-'.repeat(40));

for (const testCase of testCases) {
  console.log(`\nTest: ${testCase.name}`);
  
  try {
    const result = JSON.parse(fromObject.run(testCase.input));
    const success = JSON.stringify(result) === JSON.stringify(testCase.expected);
    
    if (success) {
      console.log('✅ PASSED');
      passed++;
    } else {
      console.log('❌ FAILED');
      console.log('Expected:', JSON.stringify(testCase.expected, null, 2));
      console.log('Got:', JSON.stringify(result, null, 2));
      failed++;
    }
  } catch (error) {
    console.log('❌ ERROR:', error.message);
    failed++;
  }
}

// Run error test cases
console.log('\n\n🚨 Running Error Test Cases:');
console.log('-'.repeat(40));

for (const testCase of errorTestCases) {
  console.log(`\nTest: ${testCase.name}`);
  
  try {
    const result = JSON.parse(fromObject.run(testCase.input));
    
    if (testCase.shouldThrow) {
      console.log('❌ FAILED - Should have thrown an error');
      failed++;
    } else {
      const success = JSON.stringify(result) === JSON.stringify(testCase.expected);
      if (success) {
        console.log('✅ PASSED');
        passed++;
      } else {
        console.log('❌ FAILED');
        console.log('Expected:', JSON.stringify(testCase.expected, null, 2));
        console.log('Got:', JSON.stringify(result, null, 2));
        failed++;
      }
    }
  } catch (error) {
    if (testCase.shouldThrow) {
      console.log('✅ PASSED - Correctly threw error:', error.message);
      passed++;
    } else {
      console.log('❌ UNEXPECTED ERROR:', error.message);
      failed++;
    }
  }
}

// Performance test
console.log('\n\n⚡ Running Performance Test:');
console.log('-'.repeat(40));

const performanceInput = '{"object":{"prop1":1,"prop2_key1":3,"prop2_name":"ciao"},"fields":[{"key":"prop1","path":"$.prop1","type":"integer"},{"key":"prop2_key1","path":"$.prop2.key1","type":"integer"},{"key":"prop2_name","path":"$.prop2.name","type":"string"}]}';
const iterations = 10000;

console.log(`Running ${iterations} iterations...`);

// Warm up
for (let i = 0; i < 100; i++) {
  fromObject.run(performanceInput);
}

// Benchmark
console.time('Performance Test');
for (let i = 0; i < iterations; i++) {
  fromObject.run(performanceInput);
}
console.timeEnd('Performance Test');

// Final results
console.log('\n' + '='.repeat(60));
console.log(`\n📊 Final Results:`);
console.log(`✅ Passed: ${passed}`);
console.log(`❌ Failed: ${failed}`);
console.log(`📈 Success Rate: ${((passed / (passed + failed)) * 100).toFixed(1)}%`);

if (failed === 0) {
  console.log('\n🎉 All tests passed! The WASM module is working perfectly!');
  process.exit(0);
} else {
  console.log('\n💥 Some tests failed! Please check the implementation.');
  process.exit(1);
}
