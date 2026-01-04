import { useEffect, useState } from 'react'
import { Link } from '@tanstack/react-router'
import Modal from '../../../components/Modal'
import MonthView from '../features/month/components/Month'
import CreateEvent from '../features/event/components/CreateEvent'
import EventDetails from '../features/event/components/EventDetails'
import ListView from '../features/list/components/List'
import AttendeeSelector from './AttendeeSelector'
import '../assets/Calendar.scss'
import type { User } from '@/graphql/generated'
import type { EventFromQuery } from '../features/event/services/eventsGraphql.service'
import { useAuth } from '@/context/AuthContext'

const SELECTED_ATTENDEES_KEY = 'calendar_selected_attendees'

function getDaysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate()
}

function loadSelectedAttendees(): Array<User> {
  try {
    const stored = localStorage.getItem(SELECTED_ATTENDEES_KEY)
    return stored ? JSON.parse(stored) : []
  } catch {
    return []
  }
}

interface CalendarProps {
  view: 'month' | 'list'
}

export default function Calendar({ view }: CalendarProps) {
  const { user } = useAuth()
  const isAdmin = user?.role === 'ADMIN'
  const today = new Date()
  const [currentMonth, setCurrentMonth] = useState(today.getMonth())
  const [currentYear, setCurrentYear] = useState(today.getFullYear())
  const [selectedAttendees, setSelectedAttendees] = useState<Array<User>>(
    loadSelectedAttendees,
  )
  const [createEventOnDay, setCreateEventOnDay] = useState<Date | null>(null)
  const [selectedEvent, setSelectedEvent] = useState<EventFromQuery | null>(
    null,
  )

  // Persist selected attendees to localStorage
  useEffect(() => {
    localStorage.setItem(
      SELECTED_ATTENDEES_KEY,
      JSON.stringify(selectedAttendees),
    )
  }, [selectedAttendees])

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
    setCreateEventOnDay: isAdmin ? setCreateEventOnDay : () => {},
    createEventOnDay,
    monthNames,
    daysInMonth,
    selectedAttendees,
    isAdmin,
    onEventClick: setSelectedEvent,
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
          {(view === 'month' || isAdmin) && (
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
          )}
          {(view === 'month' || isAdmin) && (
            <span className="date-display">
              {monthNames[currentMonth]} {currentYear}
            </span>
          )}
          {view === 'list' && !isAdmin && <span className="filler"></span>}
          {view === 'list' && !isAdmin && (
            <span className="date-display">Upcoming Events</span>
          )}
          <div className="view-type-switcher">
            <Link
              to="/month"
              className={`px-2 py-1 rounded ${view === 'month' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
            >
              Month
            </Link>
            <Link
              to="/list"
              className={`px-2 py-1 rounded ${view === 'list' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
            >
              List
            </Link>
          </div>
        </div>

        {view === 'month' && <MonthView {...sharedProps} />}
        {view === 'list' && <ListView {...sharedProps} />}

        {isAdmin && (
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
        )}

        <Modal isOpen={!!selectedEvent} onClose={() => setSelectedEvent(null)}>
          {selectedEvent && (
            <EventDetails
              event={selectedEvent}
              onClose={() => setSelectedEvent(null)}
              isAdmin={isAdmin}
            />
          )}
        </Modal>
      </div>
    </div>
  )
}
