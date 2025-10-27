export type EventType = { time: string; text: string }
export type EventsMap = { [key: string]: Array<EventType> }

export interface CalendarViewProps {
  currentYear: number
  currentMonth: number
  events: EventsMap
  setCreateEventOnDay: (day: number) => void
  createEventOnDay: number | null
  monthNames: Array<string>
  daysInMonth: number
}

export interface WeekViewProps extends CalendarViewProps {
  selectedWeek: number
  setSelectedWeek: (week: number) => void
}
