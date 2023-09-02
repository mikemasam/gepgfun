import express, { Express, Request, Response } from "express";
import route, { Res } from "./src/route";
import {
  BillCancelResponse,
  BillInfo,
  BillSubmissionRequestAck,
} from "./src/gepg-objects";
import { buildXml, parseXml, sleep } from "./src/utils";
import sendControlNumber from "./src/make.controlnumber";
import { ParsedArgs } from "minimist";
import makePayment from "./src/make.payment";

async function controlRequestEvents(app$argv: ParsedArgs, billInfo: BillInfo) {
  sleep(2000);
  const control_number = await sendControlNumber(app$argv, billInfo.BillId);
  if (!control_number) return;
  if (app$argv.autopay) {
    sleep(2000);
    await makePayment(
      app$argv,
      billInfo.BillId,
      control_number,
      billInfo.BillAmt,
      billInfo.Ccy
    );
  }
}
export default function server(app$argv: ParsedArgs) {
  console.log("Starting server....");
  const app: Express = express();
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(express.raw({ type: "application/*" }));

  const url: string = process.env.URL_CONTROL_NUMBER_CALLBACK as string;
  if (app$argv.v) console.log(url);
  app.post(
    "/api/bill/sigqrequest",
    route(async (req: Request, res: Response) => {
      const envelop = await parseXml(req.body.toString());
      const bill = envelop.Gepg.gepgBillSubReq;
      const billInfo: BillInfo = bill.BillTrxInf;
      controlRequestEvents(app$argv, billInfo);
      const out: Res = {
        content: await buildXml(BillSubmissionRequestAck()),
      };
      return out;
    })
  );

  app.post(
    "/api/bill/sigcancel_request",
    route(async (req: Request, res: Response) => {
      const envelop = await parseXml(req.body.toString());
      const out: Res = {
        content: await buildXml(BillCancelResponse()),
      };
      return out;
    })
  );

  if (app$argv.autopay) console.log("^ Auto Pay enabled");
  const port = app$argv.port || 3005;
  app.listen(port, () => {
    console.log(`GePGfun App started :${port}`);
  });
}
