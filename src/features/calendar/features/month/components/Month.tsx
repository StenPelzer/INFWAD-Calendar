import {
  getEventsForMonth,
  useGetEvents,
} from '../../event/services/eventsGraphql.service'
import type { CalendarViewProps } from '../../../types/CalendarType'
import '../assets/styles.scss'

export default function MonthView({
  currentYear,
  currentMonth,
  setCreateEventOnDay,
  daysInMonth,
  selectedAttendees,
  isAdmin,
}: CalendarViewProps) {
  const { data, loading, error } = useGetEvents()
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

  const events = data?.events
    ? getEventsForMonth(
        data.events,
        currentYear,
        currentMonth + 1,
        selectedAttendees,
      )
    : []

  if (loading) return <div>Loading events...</div>
  if (error) return <div>Error loading events: {error.message}</div>

  function getEventBackground(event: {
    attendees: Array<{ id: number; color: string | null }>
  }): string {
    const selectedEventAttendees = event.attendees.filter((attendee) =>
      selectedAttendees.some((sa) => sa.id === attendee.id),
    )

    if (selectedEventAttendees.length === 0) {
      return ''
    }

    if (selectedEventAttendees.length === 1) {
      return selectedEventAttendees[0].color || 'gray'
    }

    let linearGradient = 'linear-gradient(130deg, '
    const colorStops = selectedEventAttendees.map((attendee, index) => {
      const color = attendee.color || 'gray'
      const percentageStart = (index / selectedEventAttendees.length) * 100
      const percentageEnd = ((index + 1) / selectedEventAttendees.length) * 100
      return `${color} ${percentageStart}%, ${color} ${percentageEnd}%`
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
                        {isAdmin && (
                          <button
                            className="add-event"
                            onClick={() =>
                              setCreateEventOnDay(
                                new Date(currentYear, currentMonth, day),
                              )
                            }
                          ></button>
                        )}
                      </div>
                      <div className="events">
                        {events
                          .filter((e) => {
                            const eventDate =
                              typeof e.date === 'string'
                                ? new Date(e.date)
                                : new Date(e.date)
                            return eventDate.getDate() === day
                          })
                          .map((event, idx: number) => (
                            <div
                              key={idx}
                              className="event"
                              style={{ background: getEventBackground(event) }}
                            >
                              <span className="event-time">
                                {event.startTime}
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
