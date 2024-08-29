import { buildXml, parseXml, sleep } from "../lib/utils";
import sendControlNumber from "./make.controlnumber";
import makePayment from "./make.payment";
import express, { Express, Request, Response } from "express";
import { ParsedArgs } from "minimist";
import {
  BillCancelResponse,
  BillInfo,
  BillSubmissionRequestAck,
} from "./gepg-objects";
import { Res } from "../lib/route";

async function controlRequestEvents(app$argv: ParsedArgs, billInfo: BillInfo) {
  sleep(2000);
  const control_number = await sendControlNumber(
    app$argv,
    billInfo.BillId,
    billInfo.PayCntrNum,
  );
  if (!control_number) return;
  if (app$argv.autopay) {
    sleep(2000);
    await makePayment(
      app$argv,
      billInfo.BillId,
      control_number,
      billInfo.BillAmt,
      billInfo.Ccy,
    );
  }
}

export async function routeRequestControlNumber(req: Request, res: Response) {
  let app$argv: ParsedArgs = (req as any).app$argv as any;
  const envelop = await parseXml(req.body.toString());
  console.log(envelop);
  const bill = envelop.Gepg.gepgBillSubReq;
  const billInfo: BillInfo = bill.BillTrxInf;
  controlRequestEvents(app$argv, billInfo);
  const out: Res = {
    content: await buildXml(BillSubmissionRequestAck()),
  };
  return out;
}

export async function routeReuseControlNumber(req: Request, res: Response) {
  let app$argv: ParsedArgs = (req as any).app$argv as any;
  const envelop = await parseXml(req.body.toString());
  const bill = envelop.Gepg.gepgBillSubReq;
  const billInfo: BillInfo = bill.BillTrxInf;
  controlRequestEvents(app$argv, billInfo);
  const out: Res = {
    content: await buildXml(BillSubmissionRequestAck()),
  };
  return out;
}
export async function routeCancelControlNumber(req: Request, res: Response) {
  const envelop = await parseXml(req.body.toString());
  const out: Res = {
    content: await buildXml(BillCancelResponse()),
  };
  return out;
}
