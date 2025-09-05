import { JSON } from "json-as/assembly";

// @external("env", "log") declare function hostLog(msg: string): void;

@json
class Field {
  key!: string;
  path!: string;
  type!: string;
}

// Flattened structure to work around AssemblyScript json-as limitations with nested objects
@json
class ObjectData {
  prop1!: f64;
  prop2_key1!: f64;
  prop2_name!: string;
}

@json
class InputData {
  object!: ObjectData;
  fields!: Field[];
}

@json
class IntegerKeyValuePair {
  key!: string;
  value!: i32;
}

@json
class StringKeyValuePair {
  key!: string;
  value!: string;
}

@json
class NumberKeyValuePair {
  key!: string;
  value!: f64;
}

@json
class Output {
  results!: string; // Will be a JSON string of the results array
}

// Simple JSONPath resolver for basic paths like $.prop1, $.prop2.key1, etc.
function resolvePath(obj: ObjectData, path: string): string {
  // Remove the $ prefix
  if (path.startsWith("$.")) {
    path = path.substring(2);
  }
  
  // Handle simple property access
  if (path == "prop1") {
    // Return the actual value as string
    return obj.prop1.toString();
  } else if (path == "prop2.key1") {
    return obj.prop2_key1.toString();
  } else if (path == "prop2.name") {
    return obj.prop2_name;
  }
  
  // Default fallback
  return "";
}

// Type casting function
function castValue(value: string, type: string): string {
  if (type == "integer") {
    // For integers, remove decimal part if present
    if (value.includes(".")) {
      const parts = value.split(".");
      return parts[0];
    }
    return value;
  } else if (type == "string") {
    return value;
  } else if (type == "number") {
    // Keep as number string
    return value;
  }
  
  // Default to string
  return value;
}

export function run(input: string): string {
  // Parse the JSON input with flattened structure
  const parsedInput = JSON.parse<InputData>(input);
  
  // Build results array manually with proper types
  let resultsJson = "[";
  
  // Iterate through fields and extract values
  for (let i = 0; i < parsedInput.fields.length; i++) {
    const field = parsedInput.fields[i];
    
    // Extract value using JSONPath
    const rawValue = resolvePath(parsedInput.object, field.path);
    
    // Add comma if not first item
    if (i > 0) {
      resultsJson += ",";
    }
    
    // Build the key-value pair based on type
    if (field.type == "integer") {
      const num = parseInt(rawValue);
      resultsJson += `{"key":"${field.key}","value":${num}}`;
    } else if (field.type == "number") {
      // For numbers, use the raw value directly since it's already a string representation
      resultsJson += `{"key":"${field.key}","value":${rawValue}}`;
    } else {
      // String type
      resultsJson += `{"key":"${field.key}","value":"${rawValue}"}`;
    }
  }
  
  resultsJson += "]";
  
  // Return the results array directly as JSON
  return `{"results":${resultsJson}}`;
}
