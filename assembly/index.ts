// Enable WASI and use its Console
// import { Console } from "as-wasi/assembly/index.ts";

// Top-level code runs at start
// Console.log("Hello from AssemblyScript + WASI!");
export function add(a: i32, b: i32): i32 { return a + b; }

