import { useState } from 'react'
import {
  getEventsForWeek,
  useGetEvents,
} from '../../event/services/eventsGraphql.service'
import type { CalendarViewProps } from '../../../types/CalendarType'

export default function WeekView({
  currentYear,
  currentMonth,
  setCreateEventOnDay,
  createEventOnDay,
  monthNames,
  daysInMonth,
  selectedAttendees,
  isAdmin,
}: CalendarViewProps) {
  const { data, loading, error } = useGetEvents()
  const today = new Date()
  const [selectedWeek, setSelectedWeek] = useState<number>(
    Math.floor((today.getDate() + today.getDay()) / 7),
  )
  const firstDay = new Date(currentYear, currentMonth, 1).getDay()
  const weeks = []
  let day = 1
  for (let w = 0; day <= daysInMonth; w++) {
    const week = []
    for (let d = 0; d < 7; d++) {
      if ((w === 0 && d < firstDay) || day > daysInMonth) {
        week.push(null)
      } else {
        week.push(day++)
      }
    }
    weeks.push(week)
  }
  const weekDays = weeks[selectedWeek] || []

  const events = data?.events
    ? getEventsForWeek(
        data.events,
        currentYear,
        currentMonth + 1,
        selectedWeek,
        selectedAttendees,
      )
    : []

  if (loading) return <div>Loading events...</div>
  if (error) return <div>Error loading events: {error.message}</div>

  return (
    <div>
      <div className="mb-2 flex gap-2">
        {weeks.map((_, i) => (
          <button
            key={i}
            className={`px-2 py-1 rounded ${selectedWeek === i ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
            onClick={() => setSelectedWeek(i)}
          >
            Week {i + 1}
          </button>
        ))}
      </div>
      <ul>
        {weekDays.map(
          (day, i) =>
            day && (
              <li
                key={i}
                className={`mb-2 p-2 rounded border ${createEventOnDay && createEventOnDay.getDate() === day ? 'bg-blue-100' : ''}`}
              >
                {isAdmin ? (
                  <button
                    className="font-bold mr-2 hover:underline"
                    onClick={() =>
                      setCreateEventOnDay(
                        new Date(currentYear, currentMonth, day),
                      )
                    }
                  >
                    {day} {monthNames[currentMonth]}
                  </button>
                ) : (
                  <span className="font-bold mr-2">
                    {day} {monthNames[currentMonth]}
                  </span>
                )}
                <div className="events">
                  {events
                    .filter((e) => {
                      const eventDate =
                        typeof e.date === 'string'
                          ? new Date(e.date)
                          : new Date(e.date)
                      return eventDate.getDate() === day
                    })
                    .map((event, idx: number) => (
                      <div key={idx} className="event">
                        <span className="event-time">
                          {event.startTime} - {event.endTime}
                        </span>
                        <span className="event-title">{event.title}</span>
                      </div>
                    ))}
                </div>
              </li>
            ),
        )}
      </ul>
    </div>
  )
}
