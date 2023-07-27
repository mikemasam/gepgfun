import server from "./server";
import makePayment from "./src/make.payment";
import makeControlNumber from "./src/make.controlnumber";
import dotenv from "dotenv";
dotenv.config();
const end = (code: number, message: string) => {
  if (code == 0) {
    console.log(message);
  } else {
    console.error(message);
  }
  process.exit(code);
};
const argv = process.argv;
const action = argv[2];
const param = argv[3];
if (action == "serve") {
  server();
} else if (action == "payment") {
  if (!param) {
    end(-1, "Invalid bill information bill:control_number:amount:currency");
  }
  const params: string[] = param.split(":");
  if (params.length != 4) {
    end(-1, "Invalid bill information bill:control_number:amount:currency");
  }

  makePayment(params[0], params[1], params[2], params[3]);
} else if (action == "control_number") {
  if (!param) {
    end(-1, "Invalid bill information arg - bill");
  }
  const params: string[] = param.split(":");
  if (params.length != 1) {
    end(-1, "Invalid bill information arg - bill");
  }
  makeControlNumber(params[0]);
} else {
  console.log(`
Command required:\n
- server - start gepg server\n
- payment bill:control_number:amount:currency - make payment\n
- control_number bill - generate control number\n
`);
}
