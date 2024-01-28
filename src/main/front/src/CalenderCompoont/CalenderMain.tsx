import React, { useState, useEffect } from 'react';
import axios from 'axios';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import "./Calender.css"
import {LedgerType} from "../TypeList";
import LedgerDetail from "../LedgerComponont/LedgerDetail";

export default function CalendarMain({categoryList, ChangeEvent} : any) {
    const [events, setEvents] = useState<{ title: string, date: string }[]>([]);
    const [ledger, setLedger] =useState<LedgerType>();
    const [open , setOpen] = useState<boolean>(false);

    useEffect(() => {
        // Event값 초기화
        setEvents([])

        axios.post(
            "/api/ledger/ledgerAllList",
            sessionStorage.getItem("userDto"),
            {
                headers: {
                    "Content-Type": "application/json",
                },
            }
        ).then(res  => {

            // 이전의 이벤트를 유지한 상태에서 새로운 이벤트 추가
            setEvents(prevEvents => [
                ...prevEvents,
                ...res.data.map((value: { comment: any; useDate: any; fileOwnerNo : any}) => ({
                    title: value.comment,
                    start: formatDateString(value.useDate),
                    end : formatDateString(value.useDate),
                    publicId: value.fileOwnerNo

                }))
            ]);

        });
    }, [ChangeEvent]); // events가 변경될 때마다 호출되도록 설정



    function formatDateString(originalDateString : any) {
        const date = new Date(originalDateString);

        // isNaN 함수를 사용하여 날짜가 유효한지 확인
        if (isNaN(date.getTime())) {
            return "Invalid Date";
        }

        const year = date.getFullYear();
        const month = ('0' + (date.getMonth() + 1)).slice(-2);
        const day = ('0' + date.getDate()).slice(-2);

        return `${year}-${month}-${day}`;
    }


    function dateClick(data : any) {

    }


    function clickEvent(value : any) {
        console.log(value.event._def.extendedProps.publicId);

        axios.post("/api/ledger/ledgerDetail", JSON.stringify({
            fileOwnerNo : value.event._def.extendedProps.publicId
        }), {
            headers : {
                "Content-Type" : "application/json"
            }
        }).then(res => {
            setLedger(res.data);
            setOpen(true);
        })
    }

    const isOpen = (value : boolean) => {
        setOpen(value);
        return value;
    }




    return (
        <>
        <div className='demo-app'>
            <div style={{margin: 15, display: 'grid', gridTemplateColumns: "2fr 1fr"}}>
                <FullCalendar
                    plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
                    initialView={'dayGridMonth'}
                    dayMaxEventRows={5}

                    events={events}
                    headerToolbar={
                        {
                            start: 'today',
                            center: 'title',
                            end: 'prev,next'
                        }
                    }
                    height={"85vh"}
                    contentHeight={600}
                    // @ts-ignore
                    dateClick={() => dateClick()}
                    eventClick={(info) => clickEvent(info)} // 이벤트 클릭시
                />
            </div>
        </div>


            {ledger && <LedgerDetail categoryList={categoryList} ledger={ledger}  isOpen={isOpen} open={open}/>}
        </>
    );
}
