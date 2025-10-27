import React, { useState } from 'react'
import Modal from '../../../components/Modal'
import MonthView from '../features/month/components/Month'
import CreateEvent from '../features/event/components/CreateEvent'
import WeekView from '../features/week/components/Week'
import DayView from '../features/day/components/Day'
import ListView from '../features/list/components/List'
import '../assets/styles.scss'

function getDaysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate()
}

type EventType = { time: string; text: string }
type EventsMap = { [key: string]: Array<EventType> }

export default function Calendar() {
  const today = new Date()
  const [currentMonth, setCurrentMonth] = useState(today.getMonth())
  const [currentYear, setCurrentYear] = useState(today.getFullYear())
  const [events, setEvents] = useState<EventsMap>({})
  const [createEventOnDay, setCreateEventOnDay] = useState<Date | null>(null)
  const [eventText, setEventText] = useState('')
  const [eventTime, setEventTime] = useState('')
  const [view, setView] = useState<'month' | 'week' | 'day' | 'list'>('month')
  const [selectedWeek, setSelectedWeek] = useState<number>(
    Math.floor((today.getDate() + today.getDay()) / 7),
  )

  const daysInMonth = getDaysInMonth(currentYear, currentMonth)
  const monthNames = [...Array(12).keys()].map((key) =>
    new Date(0, key).toLocaleString('en', { month: 'long' }),
  )

  function prevMonth() {
    setCurrentMonth((m) => {
      if (m === 0) {
        setCurrentYear((y) => y - 1)
        return 11
      }
      return m - 1
    })
    setCreateEventOnDay(null)
  }

  function nextMonth() {
    setCurrentMonth((m) => {
      if (m === 11) {
        setCurrentYear((y) => y + 1)
        return 0
      }
      return m + 1
    })
    setCreateEventOnDay(null)
  }

  function handleAddEvent(e: React.FormEvent) {
    e.preventDefault()
    if (createEventOnDay && eventText.trim()) {
      const year = createEventOnDay.getFullYear()
      const month = createEventOnDay.getMonth() + 1
      const day = createEventOnDay.getDate()
      const key = `${year}-${month}-${day}`
      setEvents((prev) => ({
        ...prev,
        [key]: [...(prev[key] ?? []), { time: eventTime, text: eventText }],
      }))
    }

    closeCreateEventModal()
  }

  function closeCreateEventModal() {
    setCreateEventOnDay(null)
    setEventText('')
    setEventTime('')
  }

  const sharedProps = {
    currentYear,
    currentMonth,
    events,
    setCreateEventOnDay,
    createEventOnDay,
    monthNames,
    daysInMonth,
  }

  return (
    <div className="calendar">
      <h1 className="text-4xl font-bold mb-4 text-center">Calendar</h1>
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
      {view === 'week' && (
        <WeekView
          {...sharedProps}
          selectedWeek={selectedWeek}
          setSelectedWeek={setSelectedWeek}
        />
      )}
      {view === 'day' && <DayView {...sharedProps} />}
      {view === 'list' && <ListView {...sharedProps} />}

      <Modal
        isOpen={!!createEventOnDay}
        onClose={() => closeCreateEventModal()}
      >
        {createEventOnDay && (
          <CreateEvent
            selectedDate={createEventOnDay}
            eventTime={eventTime}
            setEventTime={setEventTime}
            eventText={eventText}
            setEventText={setEventText}
            handleAddEvent={handleAddEvent}
          />
        )}
      </Modal>
    </div>
  )
}
