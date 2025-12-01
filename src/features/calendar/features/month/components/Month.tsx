import { useEffect } from 'react'
import { getEventsForMonth } from '../../event/services/events.service'
import { getEvents } from '../../event/services/eventsGraphql.service'
import type { CalendarViewProps } from '../../../types/CalendarType'
import type { EventType } from '../../../features/event/types/EventType'
import '../assets/styles.scss'

export default function MonthView({
  currentYear,
  currentMonth,
  setCreateEventOnDay,
  daysInMonth,
  selectedMembers,
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

  const events = getEventsForMonth(
    currentYear,
    currentMonth + 1,
    selectedMembers,
  )

  function getEventBackground(event: EventType): string {
    const selectedEventMembers = event.members.filter((member) =>
      selectedMembers.some((sm) => sm.id === member.id),
    )

    if (selectedEventMembers.length === 0) {
      return ''
    }

    if (selectedEventMembers.length === 1) {
      return selectedEventMembers[0].color
    }

    let linearGradient = 'linear-gradient(130deg, '
    const colorStops = selectedEventMembers.map((member, index) => {
      const percentageStart = (index / selectedEventMembers.length) * 100
      const percentageEnd = ((index + 1) / selectedEventMembers.length) * 100
      return `${member.color} ${percentageStart}%, ${member.color} ${percentageEnd}%`
    })
    linearGradient += colorStops.join(', ') + ')'
    return linearGradient
  }

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
                      <div className="events">
                        {events
                          .filter((e) => e.date.getDate() === day)
                          .map((event: EventType, idx: number) => (
                            <div
                              key={idx}
                              className="event"
                              style={{ background: getEventBackground(event) }}
                            >
                              <span className="event-time">
                                {event.timeFrom}
                              </span>
                              <span className="event-title">{event.title}</span>
                            </div>
                          ))}
                      </div>
                    </div>
                  )}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
