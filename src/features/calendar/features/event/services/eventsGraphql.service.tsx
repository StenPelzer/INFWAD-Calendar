import { gql } from '@apollo/client'
import { useLazyQuery, useQuery } from '@apollo/client/react'
import type { Event, GetEventsQuery } from '@/graphql/generated'
import { apolloClient } from '@/graphql/client'

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
export async function getEvents(): Promise<Array<Event>> {
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

export default {
  useGetEvents,
  getEvents,
  useGetEventsLazy,
}
