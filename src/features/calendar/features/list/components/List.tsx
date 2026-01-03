import {
  getEventsForMonth,
  useGetEvents,
} from '../../event/services/eventsGraphql.service'
import type { CalendarViewProps } from '../../../types/CalendarType'

export default function ListView({
  currentYear,
  currentMonth,
  setCreateEventOnDay,
  createEventOnDay,
  monthNames,
  daysInMonth,
  selectedAttendees,
}: CalendarViewProps) {
  const { data, loading, error } = useGetEvents()
  const events = data?.events
    ? getEventsForMonth(
        data.events,
        currentYear,
        currentMonth + 1,
        selectedAttendees,
      )
    : []

  if (loading) return <div>Loading events...</div>
  if (error) return <div>Error loading events: {error.message}</div>

  return (
    <div>
      <h2 className="text-lg font-semibold mb-2">Days</h2>
      <ul>
        {Array.from({ length: daysInMonth }, (_, i) => i + 1).map((day) => {
          const key = `${currentYear}-${currentMonth + 1}-${day}`
          return (
            <li
              key={day}
              className={`mb-2 p-2 rounded border ${createEventOnDay && createEventOnDay.getDate() === day ? 'bg-blue-100' : ''}`}
            >
              <button
                className="font-bold mr-2 text-blue-700 hover:underline"
                onClick={() =>
                  setCreateEventOnDay(new Date(currentYear, currentMonth, day))
                }
              >
                {day} {monthNames[currentMonth]}
              </button>
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
          )
        })}
      </ul>
    </div>
  )
}
