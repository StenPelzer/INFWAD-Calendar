import type { MemberType } from '../features/event/types/MemberType'

export interface CalendarViewProps {
  currentYear: number
  currentMonth: number
  setCreateEventOnDay: (date: Date) => void
  createEventOnDay: Date | null
  monthNames: Array<string>
  daysInMonth: number
  selectedMembers: Array<MemberType>
}
