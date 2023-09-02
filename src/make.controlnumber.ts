import { ParsedArgs } from "minimist";
import { BillSubmisionResponse } from "./gepg-objects";
import { buildXml, parseXml, segfalt } from "./utils";
import axios, { AxiosRequestConfig } from "axios";

export default async function makeControlNumber(
  app$argv: ParsedArgs,
  bill_id: string
): Promise<string | false> {
  const url: string =
    app$argv.callback || (process.env.URL_CONTROL_NUMBER_CALLBACK as string);
  if (!url) segfalt(-1, "Invalid callback url");
  const control_number = ("55" + (Math.random() + ""))
    .replace(".", "")
    .slice(0, 10);
  const response = BillSubmisionResponse(bill_id, control_number);
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
    .then(async (text) => [await parseXml(text)])
    .catch((err) => {
      console.log(`Control Number request failed`, err);
      return [null, "Invalid control number request ack xml"];
    });

  const ack = envelop?.Gepg?.gepgBillSubRespAck;
  if (!ack) {
    console.log(err ?? `Control Number request failed`);
    return false;
  }
  const bill = {
    control_number,
    bill_id,
  };
  console.log(
    `Control number ${control_number} submitted with ${ack.TrxStsCode} ack`
  );
  if (app$argv.v) console.log(bill);
  return control_number;
}
