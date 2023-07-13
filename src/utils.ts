import xml2js from "xml2js";

export async function buildXml(obj: any) {
  const b = new xml2js.Builder();
  return b.buildObject(obj);
}
export async function parseXml(str: string) {
  return xml2js.parseStringPromise(str, {
    explicitArray: false,
  });
}
