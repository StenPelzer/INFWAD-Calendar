import type { User } from '@/graphql/generated'

export function useQueryGetAttendees() {
  const attendees: Array<User> = [
    { id: 1, name: 'Sten', color: 'orange', email: '0927439+sten@hr.nl', password: '', role: '', events: [], groups: [] },
    { id: 2, name: 'Bert', color: 'blue', email: '0927439+bert@hr.nl', password: '', role: '', events: [], groups: [] },
    { id: 3, name: 'Merel', color: 'green', email: '0927439+merel@hr.nl', password: '', role: '', events: [], groups: [] },
  ]

  return { attendees }
}

export default useQueryGetAttendees

