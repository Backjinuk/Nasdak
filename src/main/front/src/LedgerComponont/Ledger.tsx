import {LedgerType} from "../TypeList";
import {useEffect, useState} from "react";
import axios from "axios";
import {useAppDispatch, useAppSelector} from "../app/hooks";
import {RootState} from "../app/store";
import {axiosGetLedgerItem} from "../app/slices/ledgerSilce";

export default function Ledger({ ledger, event, ledgertDetail }:{ ledger: LedgerType; event: any , ledgertDetail: any}) {
    // 컴포넌트 내용...
    const [ledgerItem, setLedgerItem] = useState<LedgerType[]>([]);

    useEffect(() => {
        axios.post("/api/ledger/ledgerItem", JSON.stringify({
            "regDate2": ledger,
            "userNo" : sessionStorage.getItem("userNo")
        }), {
            headers : {
                "Content-Type" : "application/json"
            }
        }).then(res => {
            setLedgerItem(res.data);
        })
    }, [event]);

/*
    const dispatch = useAppDispatch();
    const ledgerItem = useAppSelector((state : RootState) => state.ledger.ledgerItem)
    useEffect(() => {
        dispatch(axiosGetLedgerItem({
            regDate: ledger , userNo :parseInt(sessionStorage.getItem("userNo") as string) as number}
        ));
    }, [event]);

 */

    return (
        <div className={"itemWarp"}>
            {ledgerItem.map((ledger : LedgerType, index : number) => {
                return(
                    <div className={"ledgerItem"} key={index} onClick={() => ledgertDetail(ledger.fileOwnerNo)}>
                        <div> 가격 : {ledger.price} </div>
                        <div> 입/출금 : {ledger.ledgerType == "SAVE" ? "입금" : "출금"} </div>
                        <div className={"position-date"}> {ledger.regDate} </div>
                    </div>
                )
            })}


        </div>
    )
}