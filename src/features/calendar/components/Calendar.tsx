import React, { useState } from 'react'
import MonthView from './MonthView'
import WeekView from './WeekView'
import DayView from './DayView'
import ListView from './ListView'

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
  const [selectedDay, setSelectedDay] = useState<number | null>(null)
  const [eventText, setEventText] = useState('')
  const [eventTime, setEventTime] = useState('')
  const [view, setView] = useState<'month' | 'week' | 'day' | 'list'>('week')
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
    setSelectedDay(null)
  }

  function nextMonth() {
    setCurrentMonth((m) => {
      if (m === 11) {
        setCurrentYear((y) => y + 1)
        return 0
      }
      return m + 1
    })
    setSelectedDay(null)
  }

  function handleAddEvent(e: React.FormEvent) {
    e.preventDefault()
    if (selectedDay && eventText.trim()) {
      const key = `${currentYear}-${currentMonth + 1}-${selectedDay}`
      setEvents((prev) => ({
        ...prev,
        [key]: [...(prev[key] ?? []), { time: eventTime, text: eventText }],
      }))
      setEventText('')
      setEventTime('')
    }
  }

  const sharedProps = {
    currentYear,
    currentMonth,
    events,
    setSelectedDay,
    selectedDay,
    monthNames,
    daysInMonth,
  }

  return (
    <div className="max-w-xl mx-auto mt-10 p-6 bg-white rounded shadow">
      <h1 className="text-2xl font-bold mb-4 text-center">Agenda</h1>
      <div className="flex justify-between items-center mb-4">
        <button
          onClick={prevMonth}
          className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300"
        >
          Prev
        </button>
        <span className="text-lg font-semibold">
          {monthNames[currentMonth]} {currentYear}
        </span>
        <button
          onClick={nextMonth}
          className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300"
        >
          Next
        </button>
      </div>
      <div className="mb-4 flex gap-2 justify-center">
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

      {selectedDay && (
        <form
          onSubmit={handleAddEvent}
          className="mb-4 p-4 bg-gray-50 rounded border"
        >
          <h3 className="font-semibold mb-2">
            Add Event for {selectedDay} {monthNames[currentMonth]}
          </h3>
          <div className="mb-2">
            <input
              type="time"
              value={eventTime}
              onChange={(e) => setEventTime(e.target.value)}
              className="border rounded px-2 py-1 mr-2"
              required
            />
            <input
              type="text"
              value={eventText}
              onChange={(e) => setEventText(e.target.value)}
              className="border rounded px-2 py-1"
              placeholder="Event description"
              required
            />
            <button
              type="submit"
              className="ml-2 px-2 py-1 bg-blue-500 text-white rounded"
            >
              Add
            </button>
          </div>
        </form>
      )}
    </div>
  )
}
