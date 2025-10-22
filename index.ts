#!/usr/bin/env node
import server from "./server";
import dotenv from "dotenv";
import minimist, { ParsedArgs } from "minimist";
import { segfalt } from "./lib/utils";
dotenv.config();

const app$argv: ParsedArgs = minimist(process.argv.slice(2), {
  default: {},
});

const action = app$argv._[0];
const param = app$argv._[1];
if (app$argv.autoPay != undefined) throw "autoPay is not an option.";
if (action == "serve") {
  server(app$argv);
} else {
  console.log(`
Commands:\n
- server - start gepg server (v4 & v5)\n
`);
}
