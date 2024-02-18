import Ledger from "./Ledger"
import {useEffect, useState} from "react";
import "./Ledger.css";
import * as React from "react";
import {axiosGetLedgerAllDay, axiosGetLedgerDetail, ChangePage, ChangeSelectButton} from "../app/slices/ledgerSilce";
import {useAppDispatch, useAppSelector} from "../app/hooks";
import {RootState} from "../app/store";
import LedgerDetail from "./LedgerDetail";
import Button from "@mui/material/Button";
import { useInView } from 'react-intersection-observer';
export default function LedgerMain({categoryList , event} : any){

    const [ref, inView] = useInView();
    const dispatch= useAppDispatch();
    const ledgerList = useAppSelector((state : RootState) => state.ledger.ledgerList);
    const ledger = useAppSelector((state : RootState) => state.ledger.ledger) ;
    const [open, setOpen] = useState<boolean>(false);
    const selectButtonValue = useAppSelector((state : RootState) => state.ledger.selectButton);
    const startPage = useAppSelector((state : RootState) => state.ledger.startPage);
    const endPage = useAppSelector((state : RootState) => state.ledger.endPage);
    const [lendering, setLendering] = useState<boolean>(false);

    useEffect(() => {
        let value = selectButtonValue === 1 ?  "Day" : selectButtonValue === 2 ?  "Week" : selectButtonValue === 3 ?  "Month" : "Month3";

        alert(11);
        dispatch(axiosGetLedgerAllDay({
            userNo: parseInt(sessionStorage.getItem("userNo") as string) as number,
            searchKey: value,
            startPage: startPage,
            endPage: endPage
        }));

        if (lendering) { // lendering 상태가 true이면 항상 실행
            if(inView) {
                dispatch(ChangePage({startPage: startPage + 5, endPage: endPage + 5}));
                console.log(startPage, endPage);
            }
            setLendering(false); // 초기 렌더링 이후에는 lendering 상태를 false로 설정
        }

    }, [event, inView]);



    function ledgerDetail(key  : number){
        isOpen(true);
        dispatch(axiosGetLedgerDetail(key));
    }

    const isOpen = (value : boolean) => {
        setOpen(value);
        return value;
    }

    function searchLedger(value : number){

        dispatch(ChangeSelectButton(value));

        switch (value) {
            case 1:
                dispatch(axiosGetLedgerAllDay({
                    userNo: parseInt(sessionStorage.getItem("userNo") as string) as number,
                    searchKey: "Day",
                    startPage: startPage,
                    endPage: endPage
                }));
                break;
            case 2:
                dispatch(axiosGetLedgerAllDay({
                    userNo: parseInt(sessionStorage.getItem("userNo") as string) as number,
                    searchKey: "Week",
                    startPage: startPage,
                    endPage: endPage
                }));
                break;
            case 3:
                dispatch(axiosGetLedgerAllDay({
                    userNo: parseInt(sessionStorage.getItem("userNo") as string) as number,
                    searchKey: "Month",
                    startPage: startPage,
                    endPage: endPage
                }));
                break;
            case 4:
                dispatch(axiosGetLedgerAllDay({
                    userNo: parseInt(sessionStorage.getItem("userNo") as string) as number,
                    searchKey: "Month3",
                    startPage: startPage,
                    endPage: endPage
                }));
                break;
            default:
                break;
        }
    }


    return(
        <div>
            <div className={"warp"}>
                <div className={"search-tag-result"}>
                    <Button variant={selectButtonValue == 1 ? "outlined" : "contained"} sx={{ marginRight: 2 }} onClick={() => searchLedger(1)}>일자별 보기</Button>
                    <Button variant={selectButtonValue == 2 ? "outlined" : "contained"} sx={{ marginRight: 2 }} onClick={() => searchLedger(2)}>1주일별 보기</Button>
                    <Button variant={selectButtonValue == 3 ? "outlined" : "contained"} sx={{ marginRight: 2 }} onClick={() => searchLedger(3)}>1개월별 보기</Button>
                    <Button variant={selectButtonValue == 4 ? "outlined" : "contained"} sx={{ marginRight: 2 }} onClick={() => searchLedger(4)}>3개월별 보기</Button>
                </div>

                {Object.entries(ledgerList).map(([date, ledgerData], index) => (
                    <div className="card shadow-lg" key={index}>
                        <Ledger date={date} isOpen={isOpen} ledgerData={ledgerData} ledgerDetail={ledgerDetail} selectButton={selectButtonValue}/>
                    </div>
                ))}
                <div ref={ref}></div>
                {ledger && <LedgerDetail categoryList={categoryList} ledger={ledger} isOpen={isOpen} open={open}/>}
            </div>
        </div>
    )
}
