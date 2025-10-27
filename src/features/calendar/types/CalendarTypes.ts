export type EventType = { time: string; text: string }
export type EventsMap = { [key: string]: Array<EventType> }

export interface CalendarViewProps {
  currentYear: number
  currentMonth: number
  events: EventsMap
  setCreateEventOnDay: (date: Date) => void
  createEventOnDay: Date | null
  monthNames: Array<string>
  daysInMonth: number
}
