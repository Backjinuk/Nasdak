import Ledger from "./Ledger"
import axios from "axios";
import {useCallback, useEffect, useState} from "react";
import {LedgerType} from "../TypeList";
import "./Ledger.css";
import {useNavigate} from "react-router-dom";
import * as React from "react";
import {useDispatch, useSelector} from "react-redux";
import {axiosGetLedger, axiosGetLedgerDetail} from "../app/slices/ledgerSilce";
import {useAppDispatch, useAppSelector} from "../app/hooks";
import {RootState} from "../app/store";
import LedgerDetail from "./LedgerDetail";

interface JQuery {
    modal(action: 'show' | 'hide'): void;
}




export default function LedgerMain({categoryList , event} : any){

    const dispatch= useAppDispatch();
    const ledgerList = useAppSelector((state : RootState) => state.ledger.ledgerList);
    const ledger = useAppSelector((state : RootState) => state.ledger.ledger) ;
    const [open, setOpen] = useState<boolean>(false);
    const navigate  = useNavigate();

  useEffect(() => {
      dispatch(axiosGetLedger(parseInt(sessionStorage.getItem("userNo") as string) as number));
    }, [event]);


    function ledgerDetail(key  : number){
      dispatch(axiosGetLedgerDetail(key));
    }

    const isOpen = (value : boolean) => {
        setOpen(value);
        return value;
    }


    return(
        <div>
            <div className={"warp"}>
                {ledgerList.map((ledger: LedgerType, index: number) => (
                    <div className="card shadow-lg" key={index} onClick={() => isOpen(true)}>
                        <Ledger ledger={ledger} event={event} ledgertDetail={ledgerDetail}/>
                    </div>
                ))}
                {ledger && <LedgerDetail categoryList={categoryList} ledger={ledger} isOpen={isOpen} open={open}/> }
            </div>
        </div>
    )
}