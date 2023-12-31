import Ledger from "./Ledger"
import axios from "axios";
import {useCallback, useEffect, useState} from "react";
import {CategoryType, LedgerType} from "../TypeList";
import "./Ledger.css";
import LedgerDetail from "./LedgerDetail";
import CategoryList from "../categoryComponent/CategortList";
import Logout from "UserComponont/Logout";
import UserInfoButton from "UserComponont/UserInfoButton";
import CreateLeger from "./CreateLeger";
import {BabyChangingStation} from "@mui/icons-material";
import Button from "@mui/material/Button";
import MapLocation from "../MapComponont/MapLocation";
import {useNavigate} from "react-router-dom";
import TopBar from "TopBar"
import * as React from "react";


interface JQuery {
    modal(action: 'show' | 'hide'): void;
}

export default function LedgerMain({categoryList, isLedgerList} : any){

    const [ledgerList, setLedgerList] = useState<LedgerType[]>([] );
    const [landingEvent , setLendingEvent] =  useState(false);
    const [ledger, setLedger] = useState<LedgerType>();
    const [open, setOpen] = useState<boolean>(false);
    const navigate  = useNavigate();

    useEffect(() => {
        axios.post("/api/ledger/LedgerList", JSON.stringify({
            userNo: sessionStorage.getItem("userNo")
        }), {
            headers: {
                "Content-Type": "application/json"
            }
        }).then(res => {
            setLedgerList(res.data );
            isLedgerList(res.data);
        })


    }, [landingEvent]);


    function ledgerDetail(key  : number){
        axios.post("/api/ledger/ledgerDetail",JSON.stringify({
            fileOwnerNo : key
        }), {
            headers : {
                "Content-Type" : "application/json"
            }
        }).then((res) => {
            setLedger(res.data);
        })
    }

    const isOpen = (value : boolean) => {
        setOpen(value);

        return value;
    }


    const ChangeEvent = () => {
        if (!landingEvent) {
            setLendingEvent(true);
        } else {
            setLendingEvent(false);
        }
    }


            return(
        <div>
            <div className={"warp"}>
                {ledgerList.map((ledger: LedgerType, index: number) => (
                    <div className="card shadow-lg" key={index} onClick={() => setOpen(true)}>
                        <Ledger ledger={ledger} landingEvent={landingEvent} ledgertDetail={ledgerDetail}/>
                    </div>
                ))}
                {ledger && <LedgerDetail categoryList={categoryList} ledger={ledger} ChangeEvent={ChangeEvent} isOpen={isOpen} open={open}/> }
            </div>
        </div>
    )
}