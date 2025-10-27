import React from 'react'
import useQueryGetMembers from '../hooks/QueryGetMembers'

type CreateEventProps = {
  selectedDate: Date
  setSelectedDate: (date: Date | null) => void
  eventTime: string
  setEventTime: (val: string) => void
  eventText: string
  setEventText: (val: string) => void
  handleAddEvent: (e: React.FormEvent) => void
}

function CreateEvent({
  selectedDate,
  setSelectedDate,
  eventTime,
  setEventTime,
  eventText,
  setEventText,
  handleAddEvent,
}: CreateEventProps) {
  const members = useQueryGetMembers()

  return (
    <form onSubmit={handleAddEvent}>
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
            htmlFor="event-date"
          >
            Date
          </label>
          <input
            id="event-date"
            type="date"
            value={selectedDate.toISOString().split('T')[0]}
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
              value={eventTime}
              onChange={(e) => setEventTime(e.target.value)}
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
              value={eventTime}
              onChange={(e) => setEventTime(e.target.value)}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
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
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            rows={3}
          />
        </div>
        <button
          type="submit"
          className="w-full py-2 px-4 bg-blue-600 text-white font-semibold rounded-md shadow hover:bg-blue-700 transition-colors"
        >
          Add Event
        </button>
      </div>
    </form>
  )
}

export default CreateEvent
