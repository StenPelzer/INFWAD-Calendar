import type { User } from '@/graphql/generated'

export interface CalendarViewProps {
  currentYear: number
  currentMonth: number
  setCreateEventOnDay: (date: Date) => void
  createEventOnDay: Date | null
  monthNames: Array<string>
  daysInMonth: number
  selectedAttendees: Array<User>
  isAdmin: boolean
}
