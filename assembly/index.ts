import { JSON } from "json-as/assembly";

// @external("env", "log") declare function hostLog(msg: string): void;

@json
class Input { a!: i32; b!: i32; }

@json
class Output { sum!: i32; }

export function run(input: string): string {
  // const res = JSON.parse(input);
  const obj = JSON.parse<Input>(input); // throws if invalid
  const sum = obj.a + obj.b;
  return JSON.stringify<Output>({ sum });
}
