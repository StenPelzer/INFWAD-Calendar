import React from 'react'
import { useCreateEvent } from '../services/eventsGraphql.service'
import type { CreateEventInput, User } from '@/graphql/generated'
import '../assets/styles.scss'
import AttendeeSelector from '@/features/calendar/components/AttendeeSelector'

type CreateEventProps = {
  selectedDate: Date
  setSelectedDate: (date: Date | null) => void
}

function getCurrentTimeString() {
  const now = new Date()
  const hours = now.getHours().toString().padStart(2, '0')
  const minutes = now.getMinutes().toString().padStart(2, '0')
  return hours + ':' + minutes
}

function CreateEvent({ selectedDate, setSelectedDate }: CreateEventProps) {
  const [eventText, setEventText] = React.useState('')
  const [eventTimeFrom, setEventTimeFrom] = React.useState(
    getCurrentTimeString(),
  )
  const [eventTimeTo, setEventTimeTo] = React.useState(getCurrentTimeString())
  const [eventTitle, setEventTitle] = React.useState('')
  const [eventAttendees, setEventAttendees] = React.useState<Array<User>>([])
  const [createEvent, { loading: creating }] = useCreateEvent()

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()

    // Format date as YYYY-MM-DD for LocalDate
    const dateStr = selectedDate.toISOString().split('T')[0]

    const input: CreateEventInput = {
      title: eventTitle,
      date: dateStr,
      startTime: eventTimeFrom,
      endTime: eventTimeTo,
      description: eventText || null,
      attendeeIds: eventAttendees.map((a) => a.id),
    }

    try {
      await createEvent({ variables: { input } })
      setSelectedDate(null)
      setEventText('')
      setEventTimeFrom('')
      setEventTimeTo('')
      setEventAttendees([])
    } catch (error) {
      console.error('Error creating event:', error)
      alert('Failed to create event. Please try again.')
    }
  }

  return (
    <form className="create-event-form" onSubmit={onSubmit}>
      <h3 className="font-semibold mb-2">
        Add Event for{' '}
        {selectedDate.getDate() +
          ' ' +
          selectedDate.toLocaleString('default', { month: 'long' })}
      </h3>
      <div className="space-y-4">
        <div>
          <label
            className="block text-sm font-medium mb-1"
            htmlFor="event-title"
          >
            Title
          </label>
          <input
            id="event-title"
            type="text"
            value={eventTitle}
            onChange={(e) => setEventTitle(e.target.value)}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label
            className="block text-sm font-medium mb-1"
            htmlFor="event-date"
          >
            Date
          </label>
          <input
            id="event-date"
            type="date"
            value={selectedDate.toLocaleDateString('en-CA').split('T')[0]}
            onChange={(e) => {
              setSelectedDate(new Date(e.target.value))
            }}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label
              className="block text-sm font-medium mb-1"
              htmlFor="event-time-from"
            >
              From
            </label>
            <input
              id="event-time-from"
              type="time"
              value={eventTimeFrom}
              onChange={(e) => setEventTimeFrom(e.target.value)}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label
              className="block text-sm font-medium mb-1"
              htmlFor="event-time-to"
            >
              To
            </label>
            <input
              id="event-time-to"
              type="time"
              value={eventTimeTo}
              onChange={(e) => setEventTimeTo(e.target.value)}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
        <div>
          <label
            className="block text-sm font-medium mb-1"
            htmlFor="event-attendees"
          >
            Attendees
          </label>

          <AttendeeSelector
            selectedAttendees={eventAttendees}
            onChange={setEventAttendees}
          />
        </div>
        <div>
          <label
            className="block text-sm font-medium mb-1"
            htmlFor="event-desc"
          >
            Description
          </label>
          <textarea
            id="event-desc"
            value={eventText}
            onChange={(e) => setEventText(e.target.value)}
            placeholder="Event description"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            rows={3}
          />
        </div>
        <button
          type="submit"
          disabled={creating}
          className="w-full py-2 px-4 bg-blue-600 text-white font-semibold rounded-md shadow hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {creating ? 'Creating...' : 'Add Event'}
        </button>
      </div>
    </form>
  )
}

export default CreateEvent
