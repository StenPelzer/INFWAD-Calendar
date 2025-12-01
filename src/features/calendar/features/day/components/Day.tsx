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
    </div>
  )
}
