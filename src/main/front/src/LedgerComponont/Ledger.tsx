import {LedgerType} from "../TypeList";
import {useEffect, useState} from "react";
import axios from "axios";

export default function Ledger({ ledger, landingEvent, ledgertDetail }:{ ledger: LedgerType; landingEvent: any , ledgertDetail: any}) {
    // 컴포넌트 내용...
    const [ledgerItem, setLedgerItem] = useState<LedgerType[]>([]);

    useEffect(() => {
        axios.post("/api/ledger/ledgerItem", JSON.stringify({
            "regDate2" : ledger,
            "userNo" : sessionStorage.getItem("userNo")
        }), {
            headers : {
                "Content-Type" : "application/json"
            }
        }).then(res => {
            setLedgerItem(res.data);
        })
    }, [landingEvent]);

    return (
        <div className={"itemWarp"}>
            {ledgerItem.map((ledger : LedgerType, index : number) => {
                return(
                    <div className={"ledgerItem"} key={index} onClick={() => ledgertDetail(ledger.fileManagerNo)}>
                        <div> 가격 : {ledger.price} </div>
                        <div> 입/출금 : {ledger.dw} </div>
                        <div className={"position-date"}> {ledger.regDate} </div>
                    </div>
                )
            })}


        </div>
    )
}