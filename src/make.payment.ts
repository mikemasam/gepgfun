import { ParsedArgs } from "minimist";
import { Payment, PaymentSpInfo } from "./gepg-objects";
import { buildXml, parseXml, segfalt } from "./utils";
import axios, { AxiosRequestConfig } from "axios";

export default async function makePayment(
  app$argv: ParsedArgs,
  bill_id: string,
  control_number: string,
  amount: string,
  currency: string
) {
  const url: string =
    app$argv.callback || (process.env.URL_PAYMENT_CALLBACK as string);
  if (!url) segfalt(-1, "Invalid callback url");
  const payment: Payment = {
    bill_id,
    control_number,
    amount,
    currency,
    provider: "gepgfun",
    account_number: Math.random().toString(),
    receipt: Math.random().toString(),
  };
  const response = PaymentSpInfo(payment);
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
    `Control number ${payment.control_number} payment submitted with ${ack.TrxStsCode} ack`
  );
  return true;
}
