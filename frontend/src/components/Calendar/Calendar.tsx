import React, {useState} from 'react';
import Calendar from 'react-calendar';
import styles from './calendar.module.css';
import type { Value } from 'react-calendar/src/shared/types.js';
import 'react-calendar/dist/Calendar.css'
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';


const Calendarcomponent: React.FC = () => {
    const [date, setDate] = useState<Value>(new Date());

    const formatShortWeekday =(_: string | undefined, date: Date) => {
        return ['D', 'L', 'M', 'M', 'J', 'V', 'S'][date.getDay()]
    }

    const formatMonthYear = (_: string | undefined, date: Date) => {
        const months = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre']
        return `${months[date.getMonth()]} de ${date.getFullYear()}`
    }

    return (
        <div className={styles.calendarContainer}>
            <Calendar
                onChange={setDate}
                value={date}
                locale='es-ES'
                calendarType='iso8601'
                className={styles.calendar}
                prevLabel={<FiChevronLeft size={20}/>}
                nextLabel={<FiChevronRight size={20}/>}
                next2Label={null}
                prev2Label={null}
                navigationAriaLabel='Nagevación del calendario'
                formatShortWeekday={formatShortWeekday}
                formatMonthYear={formatMonthYear}
                prevAriaLabel='Mes anterior'
                nextAriaLabel='Mes siguiente'
                showNeighboringMonth={false}
            />
        </div>
    )
}

export default Calendarcomponent