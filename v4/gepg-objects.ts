export function BillSubmissionRequestAck() {
  return {
    Gepg: {
      gepgBillSubReqAck: {
        TrxStsCode: 7101,
      },
      gepgSignature: "-",
    },
  };
}

export function BillSubmisionResponse(bill_id: string, control_number: string) {
  return {
    Gepg: {
      gepgBillSubResp: {
        BillTrxInf: {
          BillId: bill_id,
          PayCntrNum: control_number,
          TrxSts: "GS",
          TrxStsCode: 7101,
        },
      },
      gepgSignature: "-",
    },
  };
}

export function BillCancelResponse() {
  return {
    Gepg: {
      gepgBillCanclResp: {
        BillCanclTrxDt: {
          TrxStsCode: 7283,
        },
      },
      gepgSignature: "-",
    },
  };
}

export interface BillInfo {
  BillId: string;
  SubSpCode: string;
  SpSysId: string;
  BillAmt: string;
  MiscAmt: string;
  BillExprDt: string;
  PyrId: string;
  PyrName: string;
  BillDesc: string;
  BillGenDt: string;
  BillGenBy: string;
  BillApprBy: string;
  PyrCellNum: string;
  PyrEmail: string;
  Ccy: string;
  BillEqvAmt: string;
  RemFlag: string;
  BillPayOpt: string;
  BillItems: BillItem[];
  PayCntrNum: string;
}
export interface BillItem {
  BillItemRef: string;
  UseItemRefOnPay: string;
  BillItemAmt: string;
  BillItemEqvAmt: string;
  BillItemMiscAmt: string;
  GfsCode: string;
}
export interface TmpPayment {
  bill_id: string;
  control_number: string;
  amount: string;
  currency: string;
  receipt: string;
  provider: string;
  account_number: string;
}
export function PaymentSpInfo(payment: TmpPayment) {
  return {
    Gepg: {
      gepgPmtSpInfo: {
        PymtTrxInf: {
          TrxId: Math.random().toString(),
          SpCode: 1010,
          PayRefId: Math.random().toString(),
          BillId: payment.bill_id,
          PayCtrNum: payment.control_number,
          BillAmt: payment.amount,
          PaidAmt: payment.amount,
          BillPayOpt: 1,
          CCy: payment.currency,
          TrxDtTm: new Date().toISOString().slice(0, 19),
          UsdPayChnl: "IB",
          PyrCellNum: "255711111111",
          PyrEmail: "test@mail.local",
          PspReceiptNumber: payment.receipt,
          PspName: payment.provider,
          CtrAccNum: payment.account_number,
        },
      },
      gepgSignature: "-",
    },
  };
}
