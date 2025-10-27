import type { CalendarViewProps, EventType } from '../../../types/CalendarTypes'

export default function DayView({
  currentYear,
  currentMonth,
  events,
  setCreateEventOnDay,
  createEventOnDay,
  monthNames,
  daysInMonth,
}: CalendarViewProps) {
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
        <ul>
          {(
            events[
              `${createEventOnDay.getFullYear()}-${createEventOnDay.getMonth() + 1}-${createEventOnDay.getDate()}`
            ] ?? []
          ).map((event: EventType, idx: number) => (
            <li key={idx} className="text-gray-700">
              <span className="font-mono text-xs text-gray-500">
                {event.time}
              </span>{' '}
              {event.text}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
