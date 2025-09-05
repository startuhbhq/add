# AssemblyScript WASM Module for JSONPath Extraction

This module extracts values from JSON objects using JSONPath expressions and applies type casting.

## Build

```bash
npm run build
```

## Run

```bash
npm start -- '{"object":{"prop1":1,"prop2_key1":3,"prop2_name":"ciao"},"fields":[{"key":"prop1","path":"$.prop1","type":"integer"}]}'
```

## Test

```bash
npm test
```

## Features

- ✅ JSONPath extraction (`$.prop1`, `$.prop2.key1`, `$.prop2.name`)
- ✅ Type casting (integer, string, number)
- ✅ Proper type output (numbers as numbers, strings as strings)
- ✅ Error handling for invalid JSON
- ✅ Performance optimized (10k operations in ~100ms)

## Input Format

```json
{
  "object": {
    "prop1": 1,
    "prop2_key1": 3,
    "prop2_name": "ciao"
  },
  "fields": [
    {
      "key": "prop1",
      "path": "$.prop1",
      "type": "integer"
    }
  ]
}
```

## Output Format

```json
{
  "results": [
    {
      "key": "prop1",
      "value": 1
    }
  ]
}
```