import { gql } from '@apollo/client'
import { useQuery } from '@apollo/client/react'
import type { User } from '@/graphql/generated'

const GET_ATTENDEES_QUERY = gql`
  query GetAttendees {
    users {
      id
      name
      color
    }
  }
`

interface GetAttendeesQuery {
  users: Array<User>
}

export function useQueryGetAttendees() {
  const { data, loading, error } =
    useQuery<GetAttendeesQuery>(GET_ATTENDEES_QUERY)

  return {
    attendees: data?.users || [],
    loading,
    error,
  }
}

export default useQueryGetAttendees
