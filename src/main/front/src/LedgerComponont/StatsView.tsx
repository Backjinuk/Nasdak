import React, {useEffect} from 'react';
import {Chart as ChartJS, ArcElement, Tooltip, Legend, Title, BarElement, LinearScale, CategoryScale} from 'chart.js';
import {Bar, Pie} from 'react-chartjs-2';
import {useAppSelector} from "../app/hooks";
import {LedgerType} from "../TypeList";
export default function StatsView(ledgerAllList : any) {



    ChartJS.register(ArcElement, Tooltip, Legend,CategoryScale,
        LinearScale,
        BarElement,
        Title);



    useEffect(() => {
        const ledgerList = ledgerAllList.ledgerAllList;
        const index = Object.keys(ledgerList).indexOf(ledgerAllList.date);
        //
        //
        // // ledgerList를 배열로 변환하고 useDate 기준으로 정렬
        // const sortedLedgerList = Object.entries(ledgerList)[index].sort((a: [string, unknown], b: [string, unknown]) => new Date((b[1] as { useDate: string | number | Date; }).useDate).getTime() - new Date((a[1] as { useDate: string | number | Date; }).useDate).getTime());
        //
        // // 가장 최근 7일의 데이터를 선택
        // const recentLedgerList = sortedLedgerList.slice(0, 7);
        //
        // console.log(sortedLedgerList);
        //
        //
        // const ledger = sortedLedgerList[1] as { useDate: string | number | Date; } | undefined;
        // const useDate = ledger?.useDate;
        // if (!useDate || isNaN(Date.parse(useDate.toString()))) {
        //     console.error(`Invalid date: ${useDate}`);
        // }else {
        //     const latestDate = new Date(useDate);
        //
        //     // latestDate를 기준으로 7일 간의 날짜 배열 생성
        //     const dates = [];
        //     for (let i = 0; i < 7; i++) {
        //         const date = new Date(latestDate);
        //         date.setDate(date.getDate() - i);
        //         dates.push(date.toISOString().split('T')[0]);
        //     }
        //
        //     // 누락된 날짜를 채우기 위한 최종 ledgerList 생성
        //     // const finalLedgerList = dates.map(date => {
        //     //     const ledger = recentLedgerList.find((ledger: [string, unknown]) => (ledger[1] as { useDate: string; }).useDate.split('T')[0] === date);
        //     //     return ledger || { useDate: date, /* 나머지 필드는 기본값 또는 null로 설정 */ };
        //     // });
        //
        //     // console.log(finalLedgerList)
        // }
    }, []);

    const labels = ['월요일', '화요일', '수요일', '목요일', '금요일', '토요일', '일요일'];

    const data2 = {
        labels,
        datasets: [
            {
                label: '지출',
                data: [1, 2, 3, 4, 5, 6, 7],
                backgroundColor: 'rgba(255, 99, 132, 0.5)',
            },
            {
                label: '입금',
                data: [2, 3, 4, 5, 4, 7, 8],
                backgroundColor: 'rgba(53, 162, 235, 0.5)',
            },
        ],
    };


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


    const options = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top' as const,
            },
            title: {
                display: true,
                text: 'Chart.js Bar Chart',
            },
        },
    };



    return (
        <div className={"statsView"}>
            {/*<Pie data={data} />*/}
            <Bar data={data2} options={options}/>
        </div>
    )
}