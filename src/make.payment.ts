//5509710266

import { Payment, PaymentSpInfo } from "./gepg-objects";
import { buildXml, parseXml } from "./utils";

export default async function makePayment(
  bill_id: string,
  control_number: string,
  amount: string,
  currency: string
) {
  const payment: Payment = {
    bill_id,
    control_number,
    amount,
    currency,
    provider: "gepgmock",
    account_number: Math.random().toString(),
    receipt: Math.random().toString(),
  };
  const response = PaymentSpInfo(payment);
  const body = await buildXml(response);
  const opts: RequestInit = {
    method: "POST",
    body: body,
    headers: {
      "content-type": "application/xml",
    },
  };
  const url: string = process.env.URL_PAYMENT_CALLBACK as string;
  const [envelop, err] = await fetch(url, opts)
    .then((r) => r.text())
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
    `Control number ${payment.control_number} payment submitted with ${ack.TrxStsCode} ack`
  );
  return true;
}
