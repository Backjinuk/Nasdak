import {LedgerType} from "../TypeList";
import {useState} from "react";
import LedgerDetailModal from "./LedgerDetailModal";
import axios from "../customFunction/customAxios";

interface LedgerProps {
    ledgerData: LedgerType[];
}


export default function Ledger({ledgerData, ledgerDetail, date, isOpen, selectButton}: {
    ledgerData: LedgerType[],
    ledgerDetail: any,
    date: string,
    isOpen: any,
    selectButton: number
}) {
    const [open2, setOpen2] = useState(false);
    const [ledgerList, setLedgerList] = useState<LedgerType[]>(ledgerData);


    function isOpen2(value: boolean) {
        setOpen2(value);
    }

    async function ledgerDate(value: string) {

        const res = await axios.post(
            "/api/ledger/ledgerDateList",
            JSON.stringify({
                "date": value,
                "userNo": parseInt(sessionStorage.getItem("userNo") as string) as number
            }),
        );

        setLedgerList(res.data);
        isOpen2(true);
    }


    return (
        <div className={"itemWarp"}>
            <div className={"ledgerBoxTop"}>
                {date}
            </div>

            <div className={"ledgerBoxBody"}>
                {ledgerData.map((ledger, index) => (
                    selectButton === 1 ? (
                        <div className={"ledgerItem"} key={index} onClick={() => {
                            ledgerDetail(ledger.fileOwnerNo);
                        }}>
                            <div> 날짜 : {new Date(ledger.useDate).toLocaleDateString()} </div>
                            <div> {ledger.ledgerType === "SAVE" ? "입금" : "출금"} : {ledger.price} </div>
                        </div>
                    ) : (
                        <div className={"ledgerItem"} key={index} onClick={() => {
                            ledgerDate(ledger.useDate).then();
                        }}>
                            <div> 날짜 : {ledger.useDate} </div>
                            <div> {ledger.ledgerType === "SAVE" ? "입금" : "출금"} : {ledger.price} </div>
                            <div> {ledger.ledgerType2 === "SAVE" ? "입금" : "출금"} : {ledger.price2} </div>
                        </div>
                    )
                ))}
            </div>

            {ledgerList && <LedgerDetailModal ledgerList={ledgerList} isOpen2={isOpen2} open2={open2} ledgerDetail={ledgerDetail}/> }
        </div>
    )
}

