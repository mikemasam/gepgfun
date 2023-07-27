import { ParsedArgs } from "minimist";
import { BillSubmisionResponse } from "./gepg-objects";
import { buildXml, parseXml, segfalt } from "./utils";

export default async function makeControlNumber(
  app$argv: ParsedArgs,
  bill_id: string
) {
  const url: string =
    app$argv.callback || (process.env.URL_CONTROL_NUMBER_CALLBACK as string);
  if (!url) segfalt(-1, "Invalid callback url");
  const control_number = ("55" + (Math.random() + ""))
    .replace(".", "")
    .slice(0, 10);
  const response = BillSubmisionResponse(bill_id, control_number);
  const body = await buildXml(response);
  const opts: RequestInit = {
    method: "POST",
    body: body,
    headers: {
      "content-type": "application/xml",
    },
  };
  const [envelop, err] = await fetch(url, opts)
    .then((r) => r.text())
    .then(async (text) => {
      return [await parseXml(text)];
    })
    .catch((err) => {
      console.log(`Control Number request failed`, err);
      return [null, "Invalid control number request ack xml"];
    });

  const ack = envelop?.Gepg?.gepgBillSubRespAck;
  if (!ack) {
    console.log(err ?? `Control Number request failed`);
    return;
  }
  console.log(
    `Control number ${control_number} submitted with ${ack.TrxStsCode} ack`
  );
}
