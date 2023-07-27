#!/usr/bin/env node
import server from "./server";
import makePayment from "./src/make.payment";
import makeControlNumber from "./src/make.controlnumber";
import dotenv from "dotenv";
import minimist, { ParsedArgs } from "minimist";
import { segfalt } from "./src/utils";
dotenv.config();

const app$argv: ParsedArgs = minimist(process.argv.slice(2), {
  default: {},
});

const action = app$argv._[0];
const param = app$argv._[1];
if (action == "serve") {
  server(app$argv);
} else if (action == "payment") {
  if (!param) {
    segfalt(-1, "Invalid bill information bill:control_number:amount:currency");
  }
  const params: string[] = param.split(":");
  if (params.length != 4) {
    segfalt(-1, "Invalid bill information bill:control_number:amount:currency");
  }

  makePayment(app$argv, params[0], params[1], params[2], params[3]);
} else if (action == "control_number") {
  let _param = param + "";
  if (!_param) {
    segfalt(-1, "Invalid bill information arg - bill");
  }
  const params: string[] = _param.split(":");
  if (params.length != 1) {
    segfalt(-1, "Invalid bill information arg - bill");
  }
  makeControlNumber(app$argv, params[0]);
} else {
  console.log(`
Commands:\n
- server - start gepg server\n
- payment bill:control_number:amount:currency - make payment\n
- control_number bill - generate control number\n
`);
}
