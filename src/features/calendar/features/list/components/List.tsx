import { useMemo } from 'react'
import { useGetEvents } from '../../event/services/eventsGraphql.service'
import type { EventFromQuery } from '../../event/services/eventsGraphql.service'
import type { CalendarViewProps } from '../../../types/CalendarType'
import '../assets/styles.scss'

/**
 * Helper to parse date string to Date object
 */
function parseEventDate(date: string | Date): Date {
  if (date instanceof Date) return date
  // Handle YYYY-MM-DD format
  const [year, month, day] = date.split('-').map(Number)
  return new Date(year, month - 1, day)
}

/**
 * Get upcoming events (today and future) sorted by date
 */
function getUpcomingEvents(
  events: Array<EventFromQuery>,
  selectedAttendees: Array<{ id: number }>,
): Array<EventFromQuery> {
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  let filtered = events.filter((e) => {
    const eventDate = parseEventDate(e.date)
    eventDate.setHours(0, 0, 0, 0)
    return eventDate >= today
  })

  // Filter by attendees if any selected
  if (selectedAttendees.length > 0) {
    filtered = filtered.filter((event) =>
      event.attendees.some((attendee) =>
        selectedAttendees.some((sa) => sa.id === attendee.id),
      ),
    )
  }

  // Sort by date ascending
  return filtered.sort((a, b) => {
    const dateA = parseEventDate(a.date)
    const dateB = parseEventDate(b.date)
    return dateA.getTime() - dateB.getTime()
  })
}

export default function ListView({
  currentYear,
  currentMonth,
  setCreateEventOnDay,
  createEventOnDay,
  monthNames,
  daysInMonth,
  selectedAttendees,
  isAdmin,
  onEventClick,
}: CalendarViewProps) {
  const { data, loading, error } = useGetEvents()

  function getEventBackground(event: {
    attendees: Array<{ id: number; color: string | null }>
  }): string {
    if (!isAdmin) {
      return ''
    }

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

  // For non-admin users, show only upcoming events
  // For admin users, show all events for the current month
  const events = useMemo(() => {
    if (!data?.events) return []

    if (!isAdmin) {
      // Non-admin: show upcoming events only
      return getUpcomingEvents(data.events, selectedAttendees)
    }

    // Admin: show events for the current month (existing behavior)
    let filtered = data.events.filter((e) => {
      const eventDate = parseEventDate(e.date)
      return (
        eventDate.getFullYear() === currentYear &&
        eventDate.getMonth() === currentMonth
      )
    })

    if (selectedAttendees.length > 0) {
      filtered = filtered.filter((event) =>
        event.attendees.some((attendee) =>
          selectedAttendees.some((sa) => sa.id === attendee.id),
        ),
      )
    }

    return filtered
  }, [data?.events, isAdmin, currentYear, currentMonth, selectedAttendees])

  if (loading) return <div>Loading events...</div>
  if (error) return <div>Error loading events: {error.message}</div>

  // Non-admin: render a simple chronological list of upcoming events
  if (!isAdmin) {
    return (
      <div className="list-view">
        {events.length === 0 ? (
          <p className="text-gray-500">No upcoming events</p>
        ) : (
          <ul className="events-list">
            {events.map((event) => {
              const eventDate = parseEventDate(event.date)
              return (
                <li key={event.id} className="mb-2 p-3 rounded border">
                  <button
                    className="event w-full text-left"
                    style={{ background: getEventBackground(event) }}
                    onClick={() => onEventClick(event)}
                    type="button"
                  >
                    <span className="event-date font-semibold">
                      {eventDate.toLocaleDateString('en', {
                        weekday: 'short',
                        month: 'short',
                        day: 'numeric',
                        year:
                          eventDate.getFullYear() !== new Date().getFullYear()
                            ? 'numeric'
                            : undefined,
                      })}
                    </span>
                    <span className="event-time ml-2">
                      {event.startTime} - {event.endTime}
                    </span>
                    <span className="event-title block mt-1">
                      {event.title}
                    </span>
                  </button>
                </li>
              )
            })}
          </ul>
        )}
      </div>
    )
  }

  // Admin: render day-by-day view for the current month
  return (
    <div className="list-view">
      <h2 className="text-lg font-semibold mb-2">Days</h2>
      <ul>
        {Array.from({ length: daysInMonth }, (_, i) => i + 1).map((day) => {
          const dayEvents = events.filter((e) => {
            const eventDate = parseEventDate(e.date)
            return eventDate.getDate() === day
          })
          return (
            <li
              key={day}
              className={`mb-2 p-2 rounded border ${createEventOnDay && createEventOnDay.getDate() === day ? 'bg-blue-100' : ''}`}
            >
              <div className="list-day-header">
                <span className="font-bold">
                  {day} {monthNames[currentMonth]}
                </span>
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
                {dayEvents.map((event) => (
                  <button
                    key={event.id}
                    className="event"
                    style={{ background: getEventBackground(event) }}
                    onClick={() => onEventClick(event)}
                    type="button"
                  >
                    <span className="event-time">
                      {event.startTime} - {event.endTime}
                    </span>
                    <span className="event-title">{event.title}</span>
                  </button>
                ))}
              </div>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
