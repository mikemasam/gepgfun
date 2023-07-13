import { Request, Response } from "express";

export interface Res {
  content: string;
  contentType?: string;
}
export default function route(
  clb: (req: Request, res: Response) => Promise<Res>
) {
  return (req: Request, res: Response) => {
    clb(req, res).then((response: any) => res.send(response));
  };
}
