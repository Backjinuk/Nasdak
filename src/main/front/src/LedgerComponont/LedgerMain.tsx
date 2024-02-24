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

    const dispatch= useAppDispatch();
    const ledgerList = useAppSelector((state : RootState) => state.ledger.ledgerList);
    const ledger = useAppSelector((state : RootState) => state.ledger.ledger) ;
    const [open, setOpen] = useState<boolean>(false);
    const selectButtonValue = useAppSelector((state : RootState) => state.ledger.selectButton);
    const startPage = useAppSelector((state : RootState) => state.ledger.startPage);
    const endPage = useAppSelector((state : RootState) => state.ledger.endPage);
    const [lendering, setLendering] = useState<boolean>(false);

    const [ref, inView] = useInView({
        onChange: (inView) => {
            if(inView){
                nextPage();
                ChangePageType();
            }

        }
    }); // 무한 스크롤링을 위한 라이브러리


    useEffect(() => {
        nextPage();
        ChangePageType();
    }, [event, selectButtonValue]);

    function nextPage() {
        let value = selectButtonValue === 1 ?  "Day" : selectButtonValue === 2 ?  "Week" : selectButtonValue === 3 ?  "Month" : "Month3";
        dispatch(axiosGetLedgerAllDay({
            userNo: parseInt(sessionStorage.getItem("userNo") as string) as number,
            searchKey: value,
            startPage: startPage,
            endPage: endPage
        }));

    }

    function ChangePageType(){
        switch (selectButtonValue) {
            case 1 : dispatch(ChangePage({startPage: startPage + endPage, endPage: endPage + 5})); break;
            case 2 : dispatch(ChangePage({startPage: startPage + endPage, endPage: endPage + 7})); break;
            case 3 : dispatch(ChangePage({startPage: startPage + endPage, endPage: endPage + 30})); break;
            case 4 : dispatch(ChangePage({startPage: startPage + endPage, endPage: endPage + 90})); break;
        }
    }

    function nextView(){
        $(".nextView").css("display", "none");

         setTimeout(() => {
             $(".nextView").css("display", "block");
         },1000);
    }


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
                    <Button variant={selectButtonValue == 1 ? "outlined" : "contained"} sx={{marginRight: 2}}
                            onClick={() => searchLedger(1)}>일자별 보기</Button>
                    <Button variant={selectButtonValue == 2 ? "outlined" : "contained"} sx={{marginRight: 2}}
                            onClick={() => searchLedger(2)}>1주일별 보기</Button>
                    <Button variant={selectButtonValue == 3 ? "outlined" : "contained"} sx={{marginRight: 2}}
                            onClick={() => searchLedger(3)}>1개월별 보기</Button>
                    <Button variant={selectButtonValue == 4 ? "outlined" : "contained"} sx={{marginRight: 2}}
                            onClick={() => searchLedger(4)}>3개월별 보기</Button>
                </div>

                {Object.entries(ledgerList).map(([date, ledgerData], index) => (
                    <div className="card shadow-lg" key={index}>
                        <Ledger date={date} isOpen={isOpen} ledgerData={ledgerData} ledgerDetail={ledgerDetail}
                                selectButton={selectButtonValue}/>
                    </div>
                ))}

                {ledger && <LedgerDetail categoryList={categoryList} ledger={ledger} isOpen={isOpen} open={open}/>}

                <input type="button" value="next" onClick={() => nextView()}/>
                <div className={"nextView"} ref={ref} >ref</div>
            </div>
        </div>
    )
}
