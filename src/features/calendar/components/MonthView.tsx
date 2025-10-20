import type { CalendarViewProps, EventType } from '../types/CalendarTypes'

export default function MonthView({
  currentYear,
  currentMonth,
  events,
  setSelectedDay,
  selectedDay,
  monthNames,
  daysInMonth,
}: CalendarViewProps) {
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
  return (
    <div>
      <table className="w-full mb-4">
        <thead>
          <tr>
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((d) => (
              <th key={d} className="p-1 text-xs">
                {d}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {weeks.map((week, i) => (
            <tr key={i}>
              {week.map((day, j) => (
                <td
                  key={j}
                  className={`h-12 w-12 text-center border ${selectedDay === day ? 'bg-blue-100' : ''}`}
                >
                  {day && (
                    <button
                      className="w-full h-full"
                      onClick={() => setSelectedDay(day)}
                    >
                      {day}
                    </button>
                  )}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
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
