import {Pie} from "react-chartjs-2";
import Button from "@mui/material/Button";
import React, {useEffect, useState} from "react";
import {useAppSelector} from "../app/hooks";
import {LedgerType} from "../TypeList";
import axios from "../customFunction/customAxios";
import {selectAllCategories} from "../app/slices/categoriesSlice";

export default function StatsViewPie({  setStatsView , date}: { setStatsView: (pie: string) => void, date : any }) {

    const [ledgerList, setLedgerList] = useState<LedgerType[]>([]);
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
            '/api/ledger/ledgerStatesPieList',
            JSON.stringify({
                date: date
            })
        ).then((res) => {
            const newLabels: React.SetStateAction<String[]> = [];
            const newPriceData: React.SetStateAction<number[]> = [];
            const newCategory: React.SetStateAction<any[]> = [];
            const newColor : React.SetStateAction<string[]> = [];

            res.data.forEach((ledger: LedgerType) => {
                newLabels.push(ledger.ledgerType);
                newPriceData.push(ledger.price);

                const ledgerTypeValue = ledger.ledgerType === "SAVE" ? " - 입금" : " - 출금";
                // categoryList에서 CategoryNo가 ledger의 categoryDto의 CategoryNo와 일치하는 것을 찾음
                const matchingCategory = categoryList.find(category => category.categoryNo === ledger.categoryDto.categoryNo);
                newCategory.push(matchingCategory?.content + ledgerTypeValue);
                //newColor.push(ledger.ledgerType === "SAVE" ? "rgba(255, 99, 132, 0.2)" : "rgba(255, 159, 64, 1)");
            });

            // categoryList를 기반으로 각 상태를 설정함
            setLabels(newLabels);
            setPriceData(newPriceData);
            setCategory(newCategory);
            //setColor(newColor);
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


    return (
        <div className={'statsView'}>
            <Button onClick={() => setStatsView("Bar")}>일별 보기</Button>
            <Pie data={data} />
        </div>
    )

}