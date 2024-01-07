import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import {useEffect} from "react";

export default function CalenderMain({ledgerList} : any){
    useEffect(() => {
        console.log(ledgerList)
    }, []);
    return (
        <div className='demo-app'>
            <div className='demo-app-main'>
                <FullCalendar
                    plugins={[ dayGridPlugin ]}
                />
            </div>
        </div>
    )
}