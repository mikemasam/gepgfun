import xml2js from "xml2js";

export async function buildXml(obj: any) {
  const b = new xml2js.Builder();
  return b.buildObject(obj);
}
export async function parseXml(str: string) {
  const [out, err] = await xml2js
    .parseStringPromise(str, {
      explicitArray: false,
    })
    .then((o) => [o, ""])
    .catch((err) => [false, err]);
  if (err) {
    console.log(str);
    throw "Invalid xml format";
  }
  return out;
}
export const segfalt = (code: number, message: string) => {
  if (code == 0) {
    console.log(message);
  } else {
    console.error(message);
  }
  process.exit(code);
};

export const sleep = async (time: number) => {
  return new Promise((reslv) => {
    setTimeout(reslv, time);
  });
};
