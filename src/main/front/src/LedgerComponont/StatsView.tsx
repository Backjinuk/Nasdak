import React, { useEffect, useState } from 'react';
import { ArcElement, BarElement, CategoryScale, Chart as ChartJS, Legend, LinearScale, Title, Tooltip } from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { LedgerType } from '../TypeList';
import Button from '@mui/material/Button';
import Swal from 'sweetalert2';

export default function StatsView(ledgerAllList: any) {
  const [depositsDate, setDepositsDate] = useState<string[]>([]);
  const [saveDate, setSaveDate] = useState<string[]>([]);
  const [depositsDate2, setDepositsDate2] = useState<string[]>([]);
  const [saveDate2, setSaveDate2] = useState<string[]>([]);

  // 각 요일에 대한 지출과 입금의 합계를 계산합니다.
  type WeeklySumType = { [key: string]: { save: number; deposit: number } };

  let weeklyData: WeeklyData = {
    월요일: [],
    화요일: [],
    수요일: [],
    목요일: [],
    금요일: [],
    토요일: [],
    일요일: [],
  };

  // 각 요일에 대한 빈 배열을 생성합니다.
  type WeeklyData = {
    [key: string]: LedgerType[];
  };

  let weeklySum: WeeklySumType = {
    월요일: { save: 0, deposit: 0 },
    화요일: { save: 0, deposit: 0 },
    수요일: { save: 0, deposit: 0 },
    목요일: { save: 0, deposit: 0 },
    금요일: { save: 0, deposit: 0 },
    토요일: { save: 0, deposit: 0 },
    일요일: { save: 0, deposit: 0 },
  };

  ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title);

  useEffect(() => {
    WeekSum();
  }, []);

  const WeekSum = () => {
    setDepositsDate2([]);
    setSaveDate2([]);
    calculateWeekData('currentWeek', setDepositsDate, setSaveDate);
  };

  const comparedWeek = () => {
    calculateWeekData('nextWeek', setDepositsDate2, setSaveDate2);
  };

  const calculateWeekData = (key: string, setD: any, setS: any) => {
    const array123 = sortedLedgerArray(key);

    if (!array123) {
      Swal.fire({
        icon: 'info',
        title: '데이터가 존재하지 않습니다.',
        timer: 1000,
      });
      return;
    }

    Object.entries(array123).forEach(([key, ledger]: [string, LedgerType]) => {
      const date = new Date(ledger.useDate);
      const day = date.getDay();

      const dayInKorean = ['일요일', '월요일', '화요일', '수요일', '목요일', '금요일', '토요일'][day];

      weeklyData[dayInKorean].push(ledger);
    });

    Object.entries(weeklyData).forEach(([day, ledgerList]) => {
      ledgerList.forEach((ledger) => {
        if (ledger.ledgerType === 'DEPOSIT') {
          weeklySum[day].deposit += ledger.price;
        } else {
          weeklySum[day].save += ledger.price;
        }
      });
    });

    setD(Object.values(weeklySum).map((data: { deposit: any }) => data.deposit));
    setS(Object.values(weeklySum).map((data: { save: any }) => data.save));
  };

  const sortedLedgerArray = (searchType: string) => {
    const ledgerList = ledgerAllList.ledgerAllList;
    let index = ledgerAllList.date != '' ? Object.keys(ledgerList).indexOf(ledgerAllList.date) : 0;

    if (searchType != 'currentWeek') {
      index++;
    }

    if (index < 0 || index >= Object.keys(ledgerList).length) {
      return;
    }
    // ledgerList를 배열로 변환하고 useDate 기준으로 정렬
    const ledgerArray = Object.entries(ledgerList)[index][1] as LedgerType[];
    return [...ledgerArray].sort((a: LedgerType, b: LedgerType) => {
      const dateA = new Date(a.useDate);
      const dateB = new Date(b.useDate);

      // dateA가 dateB보다 이전이면 음수를, 같으면 0을, 이후면 양수를 반환
      return dateA.getTime() - dateB.getTime();
    });
  };

  const labels = ['월요일', '화요일', '수요일', '목요일', '금요일', '토요일', '일요일'];

  const datasets = [
    {
      label: '지출',
      data: depositsDate,
      backgroundColor: 'rgba(255, 99, 132, 0.5)',
    },
    {
      label: '입금',
      data: saveDate,
      backgroundColor: 'rgba(53, 162, 235, 0.5)',
    },
  ];

  if (depositsDate2.length > 0) {
    datasets.push(
      {
        label: '지출2',
        data: depositsDate2,
        backgroundColor: 'rgba(245,99,255,0.5)',
      },
      {
        label: '입금2',
        data: saveDate2,
        backgroundColor: 'rgba(53,235,153,0.5)',
      }
    );
  }

  const data2 = {
    labels,
    datasets,
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
        text: '',
      },
    },
  };

  return (
    <div className={'statsView'}>
      {/*<Pie data={data} />*/}
      <Button onClick={comparedWeek}>저번주랑 비교하기</Button>
      <Button onClick={WeekSum}>이번주 보기</Button>
      <Bar data={data2} options={options} />
    </div>
  );
}
