import React from 'react';
import {Chart as ChartJS, ArcElement, Tooltip, Legend, Title, BarElement, LinearScale, CategoryScale} from 'chart.js';
import {Bar, Pie} from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend,CategoryScale,
    LinearScale,
    BarElement,
    Title);

export const data = {
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


export const options = {
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

const labels = ['January', 'February', 'March', 'April', 'May', 'June', 'July'];

export const data2 = {
    labels,
    datasets: [
        {
            label: '분류 1',
            data: [1, 2, 3, 4, 5, 6, 7],
            backgroundColor: 'rgba(255, 99, 132, 0.5)',
        },
        {
            label: '분류 2',
            data: [2, 3, 4, 5, 4, 7, 8],
            backgroundColor: 'rgba(53, 162, 235, 0.5)',
        },
    ],
};

export default function StatsView() {
    return (
        <div className={"statsView"}>
            <Pie data={data} />
            <Bar data={data2} options={options}/>
        </div>
    )
}