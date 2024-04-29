import {dividerClasses} from "@mui/material";
import {Pie} from "react-chartjs-2";
import Button from "@mui/material/Button";
import React, {useEffect, useState} from "react";
import {useAppDispatch, useAppSelector} from "../app/hooks";
import {LedgerType} from "../TypeList";
import axios from "../customFunction/customAxios";
import {selectAllCategories} from "../app/slices/categoriesSlice";

export default function StatsViewPie({ ledgerAllList, setStatsView , date}: { ledgerAllList: any, setStatsView: (pie: string) => void, date : any }) {

    const [ledgerList , setLedgerList] = useState<[]>([]);
    const categoryList = useAppSelector(selectAllCategories);

    useEffect(() => {
        LedgerPieDate();
    }, []);

    const LedgerPieDate = () => {
        axios.post(
            '/api/ledger/ledgerStatesPieList',
            JSON.stringify({
                date : date
            })
        ).then((res) => {
           setLedgerList(res.date);
        })
    }

    function dataSetFormat(){
        ledgerList.map(item => console.log(item));
    }





    const data = {
        labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
        datasets: [
            {
                label: '# of Votes',
                data: [12, 19, 3, 5, 2, 3],
                backgroundColor: [
                    'rgba(255, 99, 132, 0.2)',
                    'rgba(54, 162, 235, 0.2)',
                    'rgba(255, 206, 86, 0.2)',
                    'rgba(75, 192, 192, 0.2)',
                    'rgba(153, 102, 255, 0.2)',
                    'rgba(255, 159, 64, 0.2)',
                ],
                borderColor: [
                    'rgba(255, 99, 132, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(75, 192, 192, 1)',
                    'rgba(153, 102, 255, 1)',
                    'rgba(255, 159, 64, 1)',
                ],
                borderWidth: 1,
            },
        ],
    };


    return (
        <div className={'statsView'}>
            <Button onClick={() => setStatsView("Bar")}>일별 보기</Button>
            <Pie data={data} />
        </div>
    )

}