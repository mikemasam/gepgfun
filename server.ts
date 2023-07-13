import express, { Express, Request, Response } from "express";
import route, { Res } from "./src/route";
import {
  BillCancelResponse,
  BillSubmissionRequestAck,
} from "./src/gepg-objects";
import { buildXml, parseXml } from "./src/utils";
import sendControlNumber from "./src/make.controlnumber";
export default function server() {
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
        sendControlNumber(billInfo.BillId);
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

  app.listen(3005, () => {
    console.log("GePG mock App started 1");
  });
}
