import { BillSubmisionResponse } from "./gepg-objects";
import { buildXml, parseXml } from "./utils";

export default async function makeControlNumber(bill_id: string) {
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
  const url: string = process.env.URL_CONTROL_NUMBER_CALLBACK as string;
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
