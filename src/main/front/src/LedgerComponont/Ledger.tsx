import { LedgerType } from "../TypeList";

interface LedgerProps {
    ledgerData: LedgerType[];
}

export default function Ledger({ ledgerData , ledgerDetail , date }: { ledgerData: LedgerType[] , ledgerDetail : any, date : string}) {

    return (
        <div className={"itemWarp"}>
            <div className={"ledgerBoxTop"}>
                {date}
            </div>

            <div className={"ledgerBoxBody"}>
                {ledgerData.map((ledger, index) => (
                    <div className={"ledgerItem"} key={index} onClick={() => ledgerDetail(ledger.fileOwnerNo)}>
                        <div> 가격 : {ledger.price} </div>
                        <div> 입/출금 : {ledger.ledgerType === "SAVE" ? "입금" : "출금"} </div>
                        <div className={"position-date"}> {ledger.regDate} </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
