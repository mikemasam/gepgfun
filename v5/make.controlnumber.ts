import { ParsedArgs } from "minimist";
import { BillSubReq, BillSubmisionResponse } from "./gepg-objects";
import { buildXml, parseXml, segfalt } from "../lib/utils";
import axios, { AxiosRequestConfig } from "axios";

export default async function makeControlNumber(
  app$argv: ParsedArgs,
  billSubReq: BillSubReq,
  _control_number: string | undefined,
): Promise<string | false> {
  const url: string =
    app$argv.callback || (process.env.URL_CONTROL_NUMBER_CALLBACK as string);
  if (!url) segfalt(-1, "Invalid callback url");
  const control_number =
    _control_number ??
    ("55" + (Math.random() + "")).replace(".", "").slice(0, 10);
  const response = BillSubmisionResponse(billSubReq, control_number);
  const body = await buildXml(response);
  const opts: AxiosRequestConfig = {
    responseType: "text",
    headers: {
      "Content-Type": "application/xml",
      Accept: "application/xml",
    },
  };
  const [envelop, err] = await axios
    .post(url, body, opts)
    .then((r) => r.data)
    .then(async (text) => [await parseXml(text)])
    .catch((err) => {
      console.log(`Control Number request failed`, err);
      return [null, "Invalid control number request ack xml"];
    });

  const ack = envelop?.Gepg?.billSubResAck;
  if (!ack) {
    console.log(err ?? `Control Number request failed`);
    return false;
  }
  const bill = {
    control_number,
    bill_id: billSubReq.BillDtls.BillDtl.BillId,
  };
  console.log(
    `Control number ${control_number} submitted with ${ack.AckStsCode} ack`,
  );
  if (app$argv.v) console.log(bill);
  return control_number;
}
