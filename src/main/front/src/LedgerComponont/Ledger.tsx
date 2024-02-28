import {LedgerType} from "../TypeList";
import {useState} from "react";
import LedgerDetailModal from "./LedgerDetailModal";
import axios from "../customFunction/customAxios";
import Button from "@mui/material/Button";
import {axiosGetLedgerAllDay} from "../app/slices/ledgerSilce";
import {useAppDispatch} from "../app/hooks";


interface LedgerProps {
    ledgerData: LedgerType[];
}

export default function Ledger({ledgerData, ledgerDetail, date, isOpen, selectButton, nextPlease , prevPlease}: {
    ledgerData: LedgerType[],
    ledgerDetail: any,
    date: string,
    isOpen: any,
    selectButton: number,
    nextPlease: () => void,
    prevPlease: () => void
}) {
    const dispatch = useAppDispatch();
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

    const searchDate = (date : string, type : string) => {
        const startDate = date.split("~")[0].trim();

        let value = selectButton === 1 ?  "Day" : selectButton === 2 ?  "Week" : selectButton === 3 ?  "Month" : "Month3";
        dispatch(axiosGetLedgerAllDay({
            userNo: parseInt(sessionStorage.getItem("userNo") as string) as number,
            searchKey: value,
            startPage: 0,
            endPage: 0,
            startDate : startDate,
            type : type
        }));


        setTimeout(() => {
            if(type === "PREV"){
                prevPlease();
            }else{
                nextPlease();
            }
        }, 1000);

    }

    return (
        <>
            <div className={"itemWarp"}>
                <div className={"ledgerBoxTop"}>
                    {date}
                </div>
                {selectButton == 1 &&
                    <div className={"ledgerBoxBody"}>
                        {ledgerData.map((ledger, index) => (
                            <div className={"ledgerItem"} key={index} onClick={() => { ledgerDetail(ledger.fileOwnerNo); }}>
                                <div> 날짜 : {new Date(ledger.useDate).toLocaleDateString()} </div>
                                <div> {ledger.ledgerType === "SAVE" ? "입금" : "출금"} : {ledger.price} </div>
                            </div>
                        ))}
                    </div>
                }


                {selectButton != 1 &&
                    <div className={"ledgerBoxBody2"}>
                        {ledgerData.map((ledger, index) => (
                        <div className={"ledgerItem2"} key={index} onClick={() => {
                            ledgerDate(ledger.useDate).then();
                        }}>
                            <div> 날짜 : {ledger.useDate} </div>
                            <div> {ledger.ledgerType === "SAVE" ? "입금" : "출금"} : {ledger.price} </div>
                            <div> {ledger.ledgerType2 === "SAVE" ? "입금" : "출금"} : {ledger.price2} </div>
                        </div>
                        ))}
                    </div>
                }


                {ledgerList && <LedgerDetailModal ledgerList={ledgerList} isOpen2={isOpen2} open2={open2}
                                                  ledgerDetail={ledgerDetail}/>}
            </div>

            {selectButton != 1 &&
                <div className={"flex-box"}>
                    <Button variant={"contained"} onClick={() => searchDate(date, "PREV")}>
                        PREV
                    </Button>

                    <Button variant={"contained"} onClick={() => searchDate(date, "NEXT")}>
                            NEXT
                        </Button>
                </div>
            }
        </>
    )
}

