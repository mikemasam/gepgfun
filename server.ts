import express, { Express, Request, Response } from "express";
import route, { Res } from "./lib/route";
import { buildXml, parseXml, sleep } from "./lib/utils";
import { ParsedArgs } from "minimist";
import {
  routeCancelControlNumber as routev4CancelControlNumber,
  routeRequestControlNumber as routev4RequestControlNumber,
  routeReuseControlNumber as routev4ReuseControlNumber,
} from "./v4/routes";
import { routev5Submission } from "./v5/routes";

export default function server(app$argv: ParsedArgs) {
  console.log("Starting server....");
  const app: Express = express();
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(express.raw({ type: "application/*" }));

  const url: string = process.env.URL_CONTROL_NUMBER_CALLBACK as string;
  if (!url) console.log(`URL_CONTROL_NUMBER_CALLBACK not provided`);
  if (app$argv.v) console.log(url);
  app.use((req, res, next) => {
    (req as any).app$argv = app$argv;
    next();
  })
  app.post("/api/bill/sigqrequest", route(routev4RequestControlNumber));
  app.post("/api/bill/sigqrequest_reuse", route(routev4ReuseControlNumber));
  app.post("/api/bill/sigcancel_request", route(routev4CancelControlNumber));
  app.post("/api/bill/20/submission", route(routev5Submission));

  if (app$argv.autopay) console.log("^ Auto Pay enabled");
  const port = app$argv.port || 3005;
  app.listen(port, () => {
    console.log(`GePGfun App started :${port}`);
  });
}
