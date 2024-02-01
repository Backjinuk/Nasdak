import Ledger from "./Ledger"
import {useEffect, useState} from "react";
import "./Ledger.css";
import * as React from "react";
import {axiosGetLedgerAllDay, axiosGetLedgerDetail} from "../app/slices/ledgerSilce";
import {useAppDispatch, useAppSelector} from "../app/hooks";
import {RootState} from "../app/store";
import LedgerDetail from "./LedgerDetail";
import Button from "@mui/material/Button";

export default function LedgerMain({categoryList , event} : any){

    const dispatch= useAppDispatch();
    const ledgerList = useAppSelector((state : RootState) => state.ledger.ledgerList);
    const ledger = useAppSelector((state : RootState) => state.ledger.ledger) ;
    const [open, setOpen] = useState<boolean>(false);
    const [selectButton, setSelectButton] = useState<number>(1);

    useEffect(() => {
        dispatch(axiosGetLedgerAllDay({
            userNo: parseInt(sessionStorage.getItem("userNo") as string) as number,
            searchKey: "Day"
        }));
    }, [event]);

    function ledgerDetail(key  : number){
      dispatch(axiosGetLedgerDetail(key));
    }

    const isOpen = (value : boolean) => {
        setOpen(value);
        return value;
    }

    function searchLedger(value : number){

        setSelectButton(value);

        switch (value) {
            case 1:
                console.log("일자별 보기");
                dispatch(axiosGetLedgerAllDay({
                    userNo: parseInt(sessionStorage.getItem("userNo") as string) as number,
                    searchKey: "Day"
                }));
                break;
            case 2:
                console.log("1주일별 보기");
                dispatch(axiosGetLedgerAllDay({
                    userNo: parseInt(sessionStorage.getItem("userNo") as string) as number,
                    searchKey: "Week"
                }));
                break;
            case 3:
                console.log("1개월별 보기");
                dispatch(axiosGetLedgerAllDay({
                    userNo: parseInt(sessionStorage.getItem("userNo") as string) as number,
                    searchKey: "Month"
                }));
                break;
            case 4:
                console.log("3개월별 보기");
                dispatch(axiosGetLedgerAllDay({
                    userNo: parseInt(sessionStorage.getItem("userNo") as string) as number,
                    searchKey: "Month3"
                }));
                break;
            default:
                console.log("일자별 보기");
                break;
        }
    }


    return(
        <div>
            <div className={"warp"}>
                <div className={"search-tag-result"}>
                    <Button variant={selectButton == 1 ? "outlined" : "contained"} sx={{ marginRight: 2 }} onClick={() => searchLedger(1)}>일자별 보기</Button>
                    <Button variant={selectButton == 2 ? "outlined" : "contained"} sx={{ marginRight: 2 }} onClick={() => searchLedger(2)}>1주일별 보기</Button>
                    <Button variant={selectButton == 3 ? "outlined" : "contained"} sx={{ marginRight: 2 }} onClick={() => searchLedger(3)}>1개월별 보기</Button>
                    <Button variant={selectButton == 4 ? "outlined" : "contained"} sx={{ marginRight: 2 }} onClick={() => searchLedger(4)}>3개월별 보기</Button>
                </div>

                {Object.entries(ledgerList).map(([date, ledgerData], index) => (
                    <div className="card shadow-lg" onClick={() => isOpen(true)} key={index}>
                        <Ledger date={date} ledgerData={ledgerData} ledgerDetail={ledgerDetail}/>
                    </div>
                ))}

                {ledger && <LedgerDetail categoryList={categoryList} ledger={ledger} isOpen={isOpen} open={open}/>}
            </div>
        </div>
    )
}