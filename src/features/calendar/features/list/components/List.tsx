import { getEventsForMonth } from '../../event/services/events.service'
import type { CalendarViewProps } from '../../../types/CalendarType'
import type { EventType } from '../../../features/event/types/EventType'

export default function ListView({
  currentYear,
  currentMonth,
  setCreateEventOnDay,
  createEventOnDay,
  monthNames,
  daysInMonth,
}: CalendarViewProps) {
  const events = getEventsForMonth(currentYear, currentMonth)

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
              <ul className="ml-4">
                {events.map((event: EventType, idx: number) => (
                  <li key={idx} className="text-gray-700">
                    <span className="font-mono text-xs text-gray-500">
                      {event.timeFrom} - {event.timeTo}
                    </span>{' '}
                    {event.description}
                  </li>
                ))}
              </ul>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
