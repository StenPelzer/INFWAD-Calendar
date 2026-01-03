import { gql } from '@apollo/client'
import { useLazyQuery, useMutation, useQuery } from '@apollo/client/react'
import type { GetEventsQuery, User } from '@/graphql/generated'
import { apolloClient } from '@/graphql/client'

// Type for events returned from the query (partial Event type)
type EventFromQuery = GetEventsQuery['events'][number]

// Custom GraphQL query for fetching events
const GET_EVENTS_QUERY = gql`
  query GetEvents {
    events {
      id
      title
      date
      startTime
      endTime
      description
      attendees {
        id
        name
        color
      }
    }
  }
`

// Mutation for creating events
const CREATE_EVENT_MUTATION = gql`
  mutation CreateEvent($input: CreateEventInput!) {
    createEvent(input: $input) {
      id
      title
      date
      startTime
      endTime
      description
      attendees {
        id
        name
        color
      }
    }
  }
`

/**
 * Custom hook to fetch events using GraphQL
 * Returns loading, error, and data states
 *
 * @example
 * ```tsx
 * const { data, loading, error } = useGetEvents()
 * if (loading) return <div>Loading...</div>
 * if (error) return <div>Error: {error.message}</div>
 * return <div>{data?.events.map(event => ...)}</div>
 * ```
 */
export function useGetEvents() {
  return useQuery<GetEventsQuery>(GET_EVENTS_QUERY)
}

/**
 * Direct query function to fetch events using Apollo Client
 * Useful for non-React contexts or imperative data fetching
 *
 * @example
 * ```tsx
 * const events = await getEvents()
 * ```
 */
export async function getEvents(): Promise<Array<EventFromQuery>> {
  try {
    const { data } = await apolloClient.query<GetEventsQuery>({
      query: GET_EVENTS_QUERY,
      fetchPolicy: 'network-only', // Always fetch fresh data
    })
    return data?.events || []
  } catch (error) {
    console.error('Error fetching events:', error)
    throw error
  }
}

/**
 * Lazy query hook - returns a function that can be called to fetch events
 * Useful for fetching on-demand (e.g., button clicks)
 *
 * @example
 * ```tsx
 * const [fetchEvents, { data, loading }] = useGetEventsLazy()
 * <button onClick={() => fetchEvents()}>Load Events</button>
 * ```
 */
export function useGetEventsLazy() {
  return useLazyQuery<GetEventsQuery>(GET_EVENTS_QUERY)
}

/**
 * Hook to create an event using GraphQL mutation
 *
 * @example
 * ```tsx
 * const [createEvent, { loading, error }] = useCreateEvent()
 * await createEvent({ variables: { input: { title: '...', date: '...', ... } } })
 * ```
 */
export function useCreateEvent() {
  return useMutation(CREATE_EVENT_MUTATION, {
    refetchQueries: [{ query: GET_EVENTS_QUERY }],
  })
}

/**
 * Helper function to convert LocalDate string to Date object
 */
function parseLocalDate(date: any): Date {
  if (date instanceof Date) return date
  if (typeof date === 'string') {
    // Handle YYYY-MM-DD format
    const [year, month, day] = date.split('-').map(Number)
    return new Date(year, month - 1, day)
  }
  return new Date(date)
}

/**
 * Filter events for selected attendees
 */
function filterEventsByAttendees(
  events: Array<EventFromQuery>,
  selectedAttendees?: Array<User>,
): Array<EventFromQuery> {
  if (!selectedAttendees || selectedAttendees.length === 0) {
    return events
  }
  return events.filter((event) =>
    event.attendees.some((attendee) =>
      selectedAttendees.some((sa) => sa.id === attendee.id),
    ),
  )
}

/**
 * Get events for a specific month
 */
export function getEventsForMonth(
  events: Array<EventFromQuery>,
  year: number,
  month: number,
  selectedAttendees?: Array<User>,
): Array<EventFromQuery> {
  const filtered = filterEventsByAttendees(events, selectedAttendees)
  return filtered.filter((e) => {
    const eventDate = parseLocalDate(e.date)
    return (
      eventDate.getFullYear() === year && eventDate.getMonth() + 1 === month
    )
  })
}

/**
 * Get events for a specific day
 */
export function getEventsForDay(
  events: Array<EventFromQuery>,
  year: number,
  month: number,
  day: number,
  selectedAttendees?: Array<User>,
): Array<EventFromQuery> {
  const filtered = filterEventsByAttendees(events, selectedAttendees)
  return filtered.filter((e) => {
    const eventDate = parseLocalDate(e.date)
    return (
      eventDate.getFullYear() === year &&
      eventDate.getMonth() + 1 === month &&
      eventDate.getDate() === day
    )
  })
}

/**
 * Get events for a specific week
 */
export function getEventsForWeek(
  events: Array<EventFromQuery>,
  year: number,
  month: number,
  weekIndex: number,
  selectedAttendees?: Array<User>,
): Array<EventFromQuery> {
  const daysInMonth = new Date(year, month, 0).getDate()
  const firstDay = new Date(year, month - 1, 1).getDay()
  const weeks: Array<Array<number | null>> = []
  let day = 1
  for (let w = 0; day <= daysInMonth; w++) {
    const week: Array<number | null> = []
    for (let d = 0; d < 7; d++) {
      if ((w === 0 && d < firstDay) || day > daysInMonth) {
        week.push(null)
      } else {
        week.push(day++)
      }
    }
    weeks.push(week)
  }

  const targetWeek = weeks[weekIndex] || []
  const daysInTarget = targetWeek.filter((v): v is number => v !== null)
  if (daysInTarget.length === 0) return []

  const filtered = filterEventsByAttendees(events, selectedAttendees)
  return filtered.filter((e) => {
    const eventDate = parseLocalDate(e.date)
    return (
      eventDate.getFullYear() === year &&
      eventDate.getMonth() + 1 === month &&
      daysInTarget.includes(eventDate.getDate())
    )
  })
}

export default {
  useGetEvents,
  getEvents,
  useGetEventsLazy,
  useCreateEvent,
  getEventsForMonth,
  getEventsForDay,
  getEventsForWeek,
}
