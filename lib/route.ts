import { Request, Response } from "express";

export interface Res {
  content: string;
  contentType?: string;
}
export default function route(
  clb: (req: Request, res: Response) => Promise<Res>,
) {
  return (req: Request, res: Response) => {
    clb(req, res).then((response: Res) => res.send(response.content));
  };
}
