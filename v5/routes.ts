import { ParsedArgs } from "minimist";
import { buildXml, parseXml, sleep } from "../lib/utils";
import express, { Express, Request, Response } from "express";
import { Res } from "../lib/route";
import { BillDtl, BillDtls, BillSubReq, BillSubmissionRequestAck, Envelop } from "./gepg-objects";
import makeControlNumber from "./make.controlnumber";
import makePayment from "./make.payment";

async function controlRequestEvents(app$argv: ParsedArgs, billSubReq: BillSubReq ) {
const billInfo: BillDtl = billSubReq.BillDtls.BillDtl;
  sleep(2000);
  const control_number = await makeControlNumber(
    app$argv,
    billSubReq,
    billInfo.BillCntrNum,
  );
  if (!control_number) return;
  if (app$argv.autopay) {
    sleep(2000);
    await makePayment(
      app$argv,
      control_number,
      billSubReq
    );
  }
}
export async function routev5Submission(req: Request, res: Response) {
  let app$argv: ParsedArgs = (req as any).app$argv as any;
  const envelop: Envelop = await parseXml(req.body.toString());
  console.log(envelop.Gepg.billSubReq.BillDtls.BillDtl.CustName);
  controlRequestEvents(app$argv, envelop.Gepg.billSubReq);
  const out: Res = {
    content: await buildXml(BillSubmissionRequestAck(envelop.Gepg.billSubReq)),
  };
  return out;
}