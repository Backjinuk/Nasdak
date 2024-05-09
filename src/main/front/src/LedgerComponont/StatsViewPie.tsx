import {getDatasetAtEvent, getElementAtEvent, Pie} from "react-chartjs-2";
import Button from "@mui/material/Button";
import React, {useEffect, useRef, useState} from "react";
import {useAppDispatch, useAppSelector} from "../app/hooks";
import {LedgerType} from "../TypeList";
import axios from "../customFunction/customAxios";
import {selectAllCategories} from "../app/slices/categoriesSlice";
import {Simulate} from "react-dom/test-utils";
import reset = Simulate.reset;
import LedgerDetailModal from "./LedgerDetailModal";
import {axiosGetLedgerDetail, ChangeledgerSeqNumbers} from "../app/slices/ledgerSilce";

export default function StatsViewPie({  setStatsView , date, ledgerDetail}: { setStatsView: (pie: string) => void, date : any ,ledgerDetail : () => void }) {

    const dispatch= useAppDispatch();
    const [ledgerList, setLedgerList] = useState<LedgerType[]>([]);
    const [open, setOpen] = useState(false);
    const categoryList = useAppSelector(selectAllCategories);
    const [labels, setLabels] = useState<String[]>([]);
    const [category, setCategory] = useState<any[]>([])
    const [priceData, setPriceData] = useState<number[]>([])

    //const [color, setColor] = useState<string[]>([]);

    useEffect(() => {
        LedgerPieDate();
    }, []);

    const LedgerPieDate = () => {
        axios.post(
            '/api/ledger/getLedgerPieList',
            JSON.stringify({ date: date })
        ).then((res) => {
            console.log(res.data)

            const newLabels: React.SetStateAction<String[]> = [];
            const newPriceData: React.SetStateAction<number[]> = [];
            const newCategory: React.SetStateAction<any[]> = [];
            const newColor : React.SetStateAction<string[]> = [];
            const newSeq : React.SetStateAction<number[]> = [];

            res.data.forEach((ledger: LedgerType) => {
                const ledgerTypeValue = ledger.ledgerType === "SAVE" ? " - 입금" : " - 출금";
                const matchingCategory = categoryList.find(category => category.categoryNo === ledger.categoryDto.categoryNo);

                newLabels.push(ledger.ledgerType);
                newPriceData.push(ledger.price);
                newCategory.push(matchingCategory?.content + ledgerTypeValue);
                newSeq.push(ledger.fileOwnerNo);
            });

            // categoryList를 기반으로 각 상태를 설정함
            setLabels(newLabels);
            setPriceData(newPriceData);
            setCategory(newCategory);
            //setColor(newColor);

            dispatch(ChangeledgerSeqNumbers(newSeq));

        }).catch(error => {
            console.error('Error fetching data:', error);
        });
    };


const data = {
        labels: category,
        datasets: [
            {
                data: priceData,
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
const chartRef = useRef();
const showPieData = (e: React.MouseEvent<HTMLCanvasElement, MouseEvent>) => {
    const chart = chartRef.current;
    if (!chart) return;
    const dataIndex = getElementAtEvent(chart, e)[0].index;
    const searchValue = category[dataIndex].split(" - ");

    axios.post("api/ledger/getPieLedgerTypeList",
        JSON.stringify({
            date,
            category: searchValue[0],
            ledgerType: searchValue[1] === "입금" ? "SAVE" : "DEPOSIT"
        })
    ).then((res) => {
        setLedgerList(res.data);
        setOpen(true);
    })
}


    return (
        <div className={'statsView'}>
            <Button onClick={() => setStatsView("Bar")}>일별 보기</Button>
            <Pie
                ref={chartRef}
                data={data}
                onClick={e => showPieData(e)}
            />

            {ledgerList && <LedgerDetailModal open2={open} isOpen2={setOpen} ledgerList={ledgerList} ledgerDetail={ledgerDetail} />}
        </div>
    )

}