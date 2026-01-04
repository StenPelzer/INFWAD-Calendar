import {
  useGetEvents,
  getEventsForDay,
} from '../../event/services/eventsGraphql.service'
import type { CalendarViewProps } from '../../../types/CalendarType'

export default function DayView({
  currentYear,
  currentMonth,
  setCreateEventOnDay,
  createEventOnDay,
  monthNames,
  daysInMonth,
  selectedAttendees,
  onEventClick,
}: CalendarViewProps) {
  const { data, loading, error } = useGetEvents()
  const events =
    data?.events && createEventOnDay
      ? getEventsForDay(
          data.events,
          currentYear,
          currentMonth + 1,
          createEventOnDay.getDate(),
          selectedAttendees,
        )
      : []

  if (loading) return <div>Loading events...</div>
  if (error) return <div>Error loading events: {error.message}</div>

  return (
    <div>
      <div className="mb-2 flex gap-2 flex-wrap">
        {Array.from({ length: daysInMonth }, (_, i) => i + 1).map((day) => (
          <button
            key={day}
            className={`px-2 py-1 rounded ${createEventOnDay && createEventOnDay.getDate() === day ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
            onClick={() =>
              setCreateEventOnDay(new Date(currentYear, currentMonth, day))
            }
          >
            {day}
          </button>
        ))}
      </div>
      {createEventOnDay && (
        <div className="mt-4">
          <h3 className="font-semibold mb-2">
            Events for {createEventOnDay.getDate()}{' '}
            {monthNames[currentMonth]}
          </h3>
          <div className="events space-y-2">
            {events.length === 0 ? (
              <p className="text-gray-500">No events for this day</p>
            ) : (
              events.map((event, idx: number) => (
                <button
                  key={idx}
                  className="event block w-full text-left p-2 border rounded hover:bg-gray-50"
                  onClick={() => onEventClick(event)}
                  type="button"
                >
                  <span className="event-time font-medium">
                    {event.startTime} - {event.endTime}
                  </span>
                  <span className="event-title ml-2">{event.title}</span>
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  )
}
