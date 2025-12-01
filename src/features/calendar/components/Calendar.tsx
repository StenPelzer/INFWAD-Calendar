import { useState } from 'react'
import Modal from '../../../components/Modal'
import MonthView from '../features/month/components/Month'
import CreateEvent from '../features/event/components/CreateEvent'
import WeekView from '../features/week/components/Week'
import DayView from '../features/day/components/Day'
import ListView from '../features/list/components/List'
import AttendeeSelector from './AttendeeSelector'
import '../assets/Calendar.scss'
import type { User } from '@/graphql/generated'

function getDaysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate()
}

export default function Calendar() {
  const today = new Date()
  const [currentMonth, setCurrentMonth] = useState(today.getMonth())
  const [currentYear, setCurrentYear] = useState(today.getFullYear())
  const [selectedAttendees, setSelectedAttendees] = useState<Array<User>>([])
  const [createEventOnDay, setCreateEventOnDay] = useState<Date | null>(null)
  const [view, setView] = useState<'month' | 'week' | 'day' | 'list'>('month')

  const daysInMonth = getDaysInMonth(currentYear, currentMonth)
  const monthNames = [...Array(12).keys()].map((key) =>
    new Date(0, key).toLocaleString('en', { month: 'long' }),
  )

  function prevMonth() {
    if (currentMonth === 0) {
      setCurrentMonth(11)
      setCurrentYear(currentYear - 1)
    } else {
      setCurrentMonth(currentMonth - 1)
    }
    setCreateEventOnDay(null)
  }

  function nextMonth() {
    if (currentMonth === 11) {
      setCurrentMonth(0)
      setCurrentYear(currentYear + 1)
    } else {
      setCurrentMonth(currentMonth + 1)
    }
    setCreateEventOnDay(null)
  }

  function closeCreateEventModal() {
    setCreateEventOnDay(null)
  }

  const sharedProps = {
    currentYear,
    currentMonth,
    setCreateEventOnDay,
    createEventOnDay,
    monthNames,
    daysInMonth,
    selectedAttendees,
  }

  return (
    <div className="calendar-wrapper">
      <AttendeeSelector
        selectedAttendees={selectedAttendees}
        onChange={setSelectedAttendees}
        header="Attendees"
      />
      <div className="calendar">
        <div className="date-header">
          <div className="navigation">
            <button
              onClick={prevMonth}
              className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300"
            >
              Prev
            </button>
            <button
              onClick={nextMonth}
              className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300"
            >
              Next
            </button>
          </div>
          <span className="date-display">
            {monthNames[currentMonth]} {currentYear}
          </span>
          <div className="view-type-switcher">
            <button
              onClick={() => setView('month')}
              className={`px-2 py-1 rounded ${view === 'month' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
            >
              Month
            </button>
            <button
              onClick={() => setView('week')}
              className={`px-2 py-1 rounded ${view === 'week' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
            >
              Week
            </button>
            <button
              onClick={() => setView('day')}
              className={`px-2 py-1 rounded ${view === 'day' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
            >
              Day
            </button>
            <button
              onClick={() => setView('list')}
              className={`px-2 py-1 rounded ${view === 'list' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
            >
              List
            </button>
          </div>
        </div>

        {view === 'month' && <MonthView {...sharedProps} />}
        {view === 'week' && <WeekView {...sharedProps} />}
        {view === 'day' && <DayView {...sharedProps} />}
        {view === 'list' && <ListView {...sharedProps} />}

        <Modal
          isOpen={!!createEventOnDay}
          onClose={() => closeCreateEventModal()}
        >
          {createEventOnDay && (
            <CreateEvent
              selectedDate={createEventOnDay}
              setSelectedDate={setCreateEventOnDay}
            />
          )}
        </Modal>
      </div>
    </div>
  )
}
