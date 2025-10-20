import type { CalendarViewProps, EventType } from '../types/CalendarTypes'

export default function DayView({
  currentYear,
  currentMonth,
  events,
  setSelectedDay,
  selectedDay,
  monthNames,
  daysInMonth,
}: CalendarViewProps) {
  return (
    <div>
      <div className="mb-2 flex gap-2 flex-wrap">
        {Array.from({ length: daysInMonth }, (_, i) => i + 1).map((day) => (
          <button
            key={day}
            className={`px-2 py-1 rounded ${selectedDay === day ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
            onClick={() => setSelectedDay(day)}
          >
            {day}
          </button>
        ))}
      </div>
      {selectedDay && (
        <ul>
          {(
            events[`${currentYear}-${currentMonth + 1}-${selectedDay}`] ?? []
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
