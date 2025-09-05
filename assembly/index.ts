import { JSON } from "json-as/assembly";

// @external("env", "log") declare function hostLog(msg: string): void;

@json
class Input { a!: i32; b!: i32; }

@json
class Output { result!: i32; }

export function run(input: string): string {
  // const res = JSON.parse(input);
  const obj = JSON.parse<Input>(input); // throws if invalid
  const result = obj.a + obj.b;
  return JSON.stringify<Output>({ result });
}
