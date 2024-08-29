import { ParsedArgs } from "minimist";
import { BillSubReq, TmpPayment } from "./gepg-objects";
import { buildXml, parseXml, segfalt } from "../lib/utils";
import axios, { AxiosRequestConfig } from "axios";

export default async function makePayment(
  app$argv: ParsedArgs,
  control_number: string,
  billSubReq: BillSubReq
) {
  const url: string =
    app$argv.callback || (process.env.URL_PAYMENT_CALLBACK as string);
  if (!url) segfalt(-1, "Invalid callback url");
  const payment: TmpPayment = {
    control_number,
    provider: "gepgfun",
    account_number: Math.random().toString(),
    receipt: Math.random().toString(),
  };
  const response = paymentContent(payment, billSubReq);
  const body = await buildXml(response);
  const opts: AxiosRequestConfig = {
    responseType: "text",
    headers: {
      "content-type": "application/xml",
    },
  };
  const [envelop, err] = await axios
    .post(url, body, opts)
    .then((r) => r.data)
    .then(async (text) => {
      return [await parseXml(text)];
    })
    .catch((err) => {
      console.log(`Payment request failed`, err);
      return [null, "Invalid payment ack xml"];
    });

  const ack = envelop?.Gepg?.gepgPmtSpInfoAck;
  if (!ack) {
    console.log(err ?? `Payment request failed`);
    return false;
  }
  console.log(
    `Control number ${payment.control_number} payment submitted with ${ack.TrxStsCode} ack`,
  );
  return true;
}

function paymentContent(p: TmpPayment, billSubReq: BillSubReq) {
  return {
    Gepg: {
      pmtSpNtfReq: {
        PmtHdr: {
          ReqId: billSubReq.BillHdr.ReqId,
          GrpBillId: billSubReq.BillHdr.GrpBillId,
          SpGrpCode: billSubReq.BillHdr.SpGrpCode,
          CustCntrNum: p.control_number,
          EntryCnt: 1,
        },
        PmtDtls: {
          PmtTrxDtl: [
            {
              SpCode: billSubReq.BillDtls.BillDtl.SpCode,
              BillId: billSubReq.BillDtls.BillDtl.BillId,
              BillCtrNum: p.control_number,
              PspCode: "PSP12312",
              PspName: p.provider,
              TrxId: p.receipt,
              PayRefId: p.receipt,
              BillAmt: billSubReq.BillDtls.BillDtl.BillAmt,
              PaidAmt: billSubReq.BillDtls.BillDtl.BillAmt,
              BillPayOpt: "1",
              Ccy: billSubReq.BillDtls.BillDtl.Ccy,
              CollAccNum: "000000000",
              TrxDtTm: new Date().toISOString().slice(0, 19),
              UsdPayChnl: "IB",
              TrdPtyTrxId: "112311323123",
              QtRefId: "",
              PyrCellNum: "255711111111",
              PyrEmail: "",
              PyrName: "gepgfun",
              Rsv1: "",
              Rsv2: "",
              Rsv3: "",
            }
          ],
        },
      },
      signature: "SignatureGoesHere",
    },
  };
}
