import { useState } from 'react'
import type { CalendarViewProps, EventType } from '../../../types/CalendarType'

export default function WeekView({
  currentYear,
  currentMonth,
  events,
  setCreateEventOnDay,
  createEventOnDay,
  monthNames,
  daysInMonth,
}: CalendarViewProps) {
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
                <button
                  className="font-bold mr-2 text-blue-700 hover:underline"
                  onClick={() =>
                    setCreateEventOnDay(
                      new Date(currentYear, currentMonth, day),
                    )
                  }
                >
                  {day} {monthNames[currentMonth]}
                </button>
                <ul className="ml-4">
                  {(
                    events[`${currentYear}-${currentMonth + 1}-${day}`] ?? []
                  ).map((event: EventType, idx: number) => (
                    <li key={idx} className="text-gray-700">
                      <span className="font-mono text-xs text-gray-500">
                        {event.time}
                      </span>{' '}
                      {event.text}
                    </li>
                  ))}
                </ul>
              </li>
            ),
        )}
      </ul>
    </div>
  )
}
