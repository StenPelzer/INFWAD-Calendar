import { getEventsForMonth } from '../../event/services/events.service'
import type { CalendarViewProps } from '../../../types/CalendarType'
import type { EventType } from '../../../features/event/types/EventType'
import '../assets/styles.scss'

export default function MonthView({
  currentYear,
  currentMonth,
  setCreateEventOnDay,
  createEventOnDay,
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

  const events = getEventsForMonth(currentYear, currentMonth + 1)

  return (
    <div className="month-view-container">
      <table className="w-full">
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
                  className={`calendar-day-wrapper border ${day === null ? 'bg-blue-100' : ''}`}
                >
                  {day && (
                    <div className="calendar-day">
                      <div className="calendar-day-header">
                        <button className="day-number">{day}</button>
                        <button
                          className="add-event"
                          onClick={() =>
                            setCreateEventOnDay(
                              new Date(currentYear, currentMonth, day),
                            )
                          }
                        ></button>
                      </div>
                    </div>
                  )}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      {createEventOnDay && (
        <ul>
          {events.map((event: EventType, idx: number) => (
            <li key={idx} className="text-gray-700">
              <span className="font-mono text-xs text-gray-500">
                {event.timeFrom} - {event.timeTo}
              </span>{' '}
              {event.title}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
