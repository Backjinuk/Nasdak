import React, { useState, useEffect } from 'react';
import axios from 'axios';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';

export default function CalendarMain() {
    const [events, setEvents] = useState<{ title: string, date: string }[]>([]);


    useEffect(() => {
        axios.post(
            "/api/ledger/ledgerAllList",
            sessionStorage.getItem("userDto"),
            {
                headers: {
                    "Content-Type": "application/json",
                },
            }
        ).then(res => {
            console.log(res.data);

            // 이전의 이벤트를 유지한 상태에서 새로운 이벤트 추가
            setEvents(prevEvents => [
                ...prevEvents,
                ...res.data.map((value: { comment: any; useDate: any; }) => ({
                    title: value.comment,
                    start: value.useDate,
                    end : formatDateString(value.useDate)

                }))
            ]);

            // 이 부분에서 events 값을 확인할 수 있음
            console.log(events);
        });
    }, []); // events가 변경될 때마다 호출되도록 설정



    function formatDateString(originalDateString : any) {
        const date = new Date(originalDateString);

        // isNaN 함수를 사용하여 날짜가 유효한지 확인
        if (isNaN(date.getTime())) {
            return "Invalid Date";
        }

        const year = date.getFullYear();
        const month = ('0' + (date.getMonth() + 1)).slice(-2);
        const day = ('0' + date.getDate()).slice(-2);
        const hours = ('0' + date.getHours()).slice(-2);
        const minutes = ('0' + date.getMinutes()).slice(-2);
        const seconds = ('0' + date.getSeconds()).slice(-2);

        return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    }


    return (
        <div className='demo-app'>
            <div className='demo-app-main'>
                <FullCalendar
                    plugins={[dayGridPlugin]}
                    events={events}
                />
            </div>
        </div>
    );
}
