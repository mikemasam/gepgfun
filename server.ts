import express, { Express, Request, Response } from "express";
import route, { Res } from "./src/route";
import {
  BillCancelResponse,
  BillSubmissionRequestAck,
} from "./src/gepg-objects";
import { buildXml, parseXml } from "./src/utils";
import sendControlNumber from "./src/make.controlnumber";
import { ParsedArgs } from "minimist";
export default function server(app$argv: ParsedArgs) {
  const app: Express = express();
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(express.raw({ type: "application/*" }));

  const url: string = process.env.URL_CONTROL_NUMBER_CALLBACK as string;
  console.log(url);
  app.post(
    "/api/bill/sigqrequest",
    route(async (req: Request, res: Response) => {
      //console.log(req);
      const envelop = await parseXml(req.body.toString());
      const bill = envelop.Gepg.gepgBillSubReq;
      const billInfo = bill.BillTrxInf;
      //console.log(billInfo);
      setTimeout(() => {
        sendControlNumber(app$argv, billInfo.BillId);
      }, 3000);
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

  const port = app$argv.port || 3005;
  app.listen(port, () => {
    console.log(`GePGfun App started :${port}`);
  });
}
