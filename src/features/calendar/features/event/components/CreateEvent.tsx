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
      <div className="mb-2">
        <input
          type="date"
          value={selectedDate.toISOString().split('T')[0]}
          onChange={(e) => {
            setSelectedDate(new Date(e.target.value))
          }}
          required
        />
        <input
          type="time"
          value={eventTime}
          onChange={(e) => setEventTime(e.target.value)}
          required
        />
        <input
          type="text"
          value={eventText}
          onChange={(e) => setEventText(e.target.value)}
          placeholder="Event description"
          required
        />
        <button type="submit">Add</button>
      </div>
    </form>
  )
}

export default CreateEvent
