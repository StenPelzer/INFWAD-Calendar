import type { EventType } from '../types/EventType'

const STORAGE_KEY = 'events'

type StoredEvent = Omit<EventType, 'date'> & { date: string; id: string }

function generateId(): string {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 9)}`
}

function safeParseStored(): Array<StoredEvent> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    if (!Array.isArray(parsed)) return []
    return parsed as Array<StoredEvent>
  } catch (e) {
    console.error('Failed to parse stored events, resetting local data', e)
    localStorage.removeItem(STORAGE_KEY)
    return []
  }
}

function persist(stored: Array<StoredEvent>) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(stored))
}

function storedToEvent(s: StoredEvent): EventType {
  return {
    ...s,
    date: new Date(s.date),
  }
}

function eventToStored(e: EventType): StoredEvent {
  return {
    id: e.id ?? generateId(),
    title: e.title,
    date:
      e.date instanceof Date
        ? e.date.toISOString()
        : new Date(e.date).toISOString(),
    timeFrom: e.timeFrom,
    timeTo: e.timeTo,
    members: e.members,
    description: e.description,
  }
}

function compareByDateTime(a: StoredEvent, b: StoredEvent) {
  if (a.date < b.date) return -1
  if (a.date > b.date) return 1
  if (a.timeFrom < b.timeFrom) return -1
  if (a.timeFrom > b.timeFrom) return 1
  return 0
}

export function addEvent(event: EventType) {
  const stored = safeParseStored()
  const toStore = eventToStored(event)
  stored.push(toStore)
  stored.sort(compareByDateTime)
  persist(stored)
}

export function getAllEvents(): Array<EventType> {
  const stored = safeParseStored()
  stored.sort(compareByDateTime)
  return stored.map(storedToEvent)
}

export function getEventsForMonth(
  year: number,
  month: number,
): Array<EventType> {
  const events = getAllEvents()
  return events.filter((e) => {
    const d = e.date
    return d.getFullYear() === year && d.getMonth() + 1 === month
  })
}

export function getEventsForDay(
  year: number,
  month: number,
  day: number,
): Array<EventType> {
  const events = getAllEvents()
  return events.filter((e) => {
    const d = e.date
    return (
      d.getFullYear() === year &&
      d.getMonth() + 1 === month &&
      d.getDate() === day
    )
  })
}

/**
 * Get events for a week inside a given month.
 * weekIndex is zero-based; weeks are built starting with Sunday (0) like the UI.
 */
export function getEventsForWeek(
  year: number,
  month: number,
  weekIndex: number,
): Array<EventType> {
  // build weeks for the month similar to Week component
  const daysInMonth = new Date(year, month, 0).getDate() // month is 1-12
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

  const events = getAllEvents()
  return events.filter((e) => {
    const d = e.date
    return (
      d.getFullYear() === year &&
      d.getMonth() + 1 === month &&
      daysInTarget.includes(d.getDate())
    )
  })
}

export function removeEventById(id: string) {
  const stored = safeParseStored()
  const filtered = stored.filter((s) => s.id !== id)
  persist(filtered)
}

export default {
  addEvent,
  getAllEvents,
  getEventsForMonth,
  getEventsForWeek,
  getEventsForDay,
  removeEventById,
}
