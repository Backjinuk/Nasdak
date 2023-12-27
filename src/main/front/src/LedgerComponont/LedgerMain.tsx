import CreateLeger from "./CreateComponont/CreateLeger"
import Ledger from "./Ledger"
import axios from "axios";
import {useCallback, useEffect, useState} from "react";
import {CategoryType, LedgerType} from "../TypeList";
import "./Ledger.css";
import LedgerDetail from "./DetailComponont/ledgerDetail";
import CategoryList from "../categoryComponent/CategortList";
import KakaoMap from "./CreateComponont/KakaoMap";

interface JQuery {
    modal(action: 'show' | 'hide'): void;
}

export default function LedgerMain(){

    const [ledgerList, setLedgerList] = useState<LedgerType[]>([] );
    const [landingEvent , setLendingEvent] =  useState(false);
    const [categoryList, setCategoryList] = useState<CategoryType[]>([]);
    const [ledger, setLedger] = useState<LedgerType>();

    const ChangeEvent = () => {
        if (!landingEvent) {
            setLendingEvent(true);
        } else {
            setLendingEvent(false);
        }
    }

    useEffect(() => {
        axios.post("/api/ledger/LedgerList", JSON.stringify({
            userNo: sessionStorage.getItem("userNo")
        }), {
            headers: {
                "Content-Type": "application/json"
            }
        }).then(res => {
            setLedgerList(res.data );
        })

        const userDto = {
            userNo : sessionStorage.getItem("userNo"),
            userId : sessionStorage.getItem("userId")
        }

        axios.post("/api/category/getCategoryList", JSON.stringify(userDto),
            { headers : {"Content-Type" : "application/json"}
            }).then(res => {
            setCategoryList(res.data);
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
            // @ts-ignore
            $("#ledgerDetail").modal("show");
        })
    }

    return(
        <div>
            <div className={"createBox"}>
                <CreateLeger ChangeEvent={ChangeEvent} categoryList={categoryList}/>
                <CategoryList changeEvent={ChangeEvent} categoryList={categoryList}/>
            </div>
           <div className={"warp"}>
                {ledgerList.map((ledger: LedgerType, index: number) => (
                    <div className="card shadow-lg" key={index}>
                        <Ledger ledger={ledger} landingEvent={landingEvent} ledgertDetail={ledgerDetail} />
                    </div>
                ))}
                {ledger && <LedgerDetail categoryList={categoryList} ledger={ledger} ChangeEvent={ChangeEvent}/>}
            </div>
        </div>
    )
}