import { getEventsForDay } from '../../event/services/events.service'
import type { CalendarViewProps } from '../../../types/CalendarType'

export default function DayView({
  currentYear,
  currentMonth,
  setCreateEventOnDay,
  createEventOnDay,
  monthNames,
  daysInMonth,
}: CalendarViewProps) {
  const events = getEventsForDay(
    currentYear,
    currentMonth + 1,
    createEventOnDay ? createEventOnDay.getDate() : 0,
  )

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
