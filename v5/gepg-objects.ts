export function BillSubmisionResponse(
  billSubReq: BillSubReq,
  control_number: string,
) {
  return {
    Gepg: {
      billSubRes: {
        BillHdr: {
          ResId: billSubReq.BillHdr.ReqId,
          ReqId: billSubReq.BillHdr.ReqId,
          GrpBillId: billSubReq.BillHdr.GrpBillId,
          CustCntrNum: control_number,
          ResSts: "GS",
          ResStsCode: "7101",
          ResStsDesc: "Successful",
        },
        BillDtls: {
          BillDtl: {
            BillId: billSubReq.BillDtls.BillDtl.BillId,
            BillCntrNum: control_number,
            BillStsCode: "7101",
            BillStsDesc: "Successful",
          },
        },
      },
      signature: "SignatureGoesHere",
    },
  };
}
export function BillSubmissionRequestAck(billSubReq: BillSubReq) {
  return {
    Gepg: {
      billSubReqAck: {
        AckId: "GW2021020513" + Math.random(),
        ReqId: billSubReq.BillHdr.ReqId,
        AckStsCode: 7101,
        AckStsDesc: "Successful",
      },
      gepgSignature: "-",
    },
  };
}
export interface TmpPayment {
  control_number: string;
  receipt: string;
  provider: string;
  account_number: string;
}
export interface Envelop {
  Gepg: Gepg;
}

export interface Gepg {
  billSubReq: BillSubReq;
  signature: string;
}

export interface BillSubReq {
  BillHdr: BillHdr;
  BillDtls: BillDtls;
}

export interface BillDtls {
  BillDtl: BillDtl;
}

export interface BillDtl {
  BillId: string;
  SpCode: string;
  CollCentCode: string;
  BillDesc: string;
  CustTin: string;
  CustId: string;
  CustIdTyp: string;
  CustAccnt: string;
  CustName: string;
  CustCellNum: string;
  CustEmail: string;
  BillGenDt: Date;
  BillExprDt: Date;
  BillGenBy: string;
  BillApprBy: string;
  BillAmt: string;
  BillEqvAmt: string;
  MinPayAmt: string;
  Ccy: string;
  ExchRate: string;
  BillPayOpt: string;
  PayPlan: string;
  PayLimTyp: string;
  PayLimAmt: string;
  CollPsp: string;
  BillItems: BillItems;
  BillCntrNum?: string;
}

export interface BillItems {
  BillItem: BillItem;
}

export interface BillItem {
  RefBillId: string;
  SubSpCode: string;
  GfsCode: string;
  BillItemRef: string;
  UseItemRefOnPay: string;
  BillItemAmt: string;
  BillItemEqvAmt: string;
  CollSp: string;
}

export interface BillHdr {
  ReqId: string;
  SpGrpCode: string;
  SysCode: string;
  BillTyp: string;
  PayTyp: string;
  GrpBillId: string;
}
