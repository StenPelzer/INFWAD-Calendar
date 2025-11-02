import type { EventType } from '../features/event/types/EventType'

export interface CalendarViewProps {
  currentYear: number
  currentMonth: number
  events: Array<EventType>
  setCreateEventOnDay: (date: Date) => void
  createEventOnDay: Date | null
  monthNames: Array<string>
  daysInMonth: number
}
