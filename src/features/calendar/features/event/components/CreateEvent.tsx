import React from 'react'

type CreateEventProps = {
  selectedDate: Date
  eventTime: string
  setEventTime: (val: string) => void
  eventText: string
  setEventText: (val: string) => void
  handleAddEvent: (e: React.FormEvent) => void
}

function CreateEvent({
  selectedDate,
  eventTime,
  setEventTime,
  eventText,
  setEventText,
  handleAddEvent,
}: CreateEventProps) {
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
