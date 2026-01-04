import React, { useState } from 'react'
import {
  useDeleteEvent,
  useUpdateEvent,
  useJoinEvent,
  useLeaveEvent,
} from '../services/eventsGraphql.service'
import type { EventFromQuery } from '../services/eventsGraphql.service'
import type { User } from '@/graphql/generated'
import '../assets/styles.scss'
import AttendeeSelector from '@/features/calendar/components/AttendeeSelector'
import { useAuth } from '@/context/AuthContext'

type EventInput = {
  title: string
  date: string
  startTime: string
  endTime: string
  description: string | null
  attendeeIds: Array<number>
}

type EventDetailsProps = {
  event: EventFromQuery
  onClose: () => void
  isAdmin: boolean
}

function EventDetails({ event, onClose, isAdmin }: EventDetailsProps) {
  const { user: currentUser } = useAuth()
  const [isEditing, setIsEditing] = useState(false)
  const [eventTitle, setEventTitle] = useState(event.title)
  const [eventDescription, setEventDescription] = useState(
    event.description || '',
  )
  const [eventDate, setEventDate] = useState(
    typeof event.date === 'string'
      ? event.date
      : event.date.toISOString().split('T')[0],
  )
  const [eventTimeFrom, setEventTimeFrom] = useState(event.startTime)
  const [eventTimeTo, setEventTimeTo] = useState(event.endTime)
  const [eventAttendees, setEventAttendees] = useState<Array<User>>(
    event.attendees as Array<User>,
  )
  const [updateEvent, { loading: updating }] = useUpdateEvent()
  const [deleteEvent, { loading: deleting }] = useDeleteEvent()
  const [joinEvent, { loading: joining }] = useJoinEvent()
  const [leaveEvent, { loading: leaving }] = useLeaveEvent()
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

  // Check if current user is attending this event
  const isAttending = currentUser
    ? event.attendees.some((a) => a.id === currentUser.id)
    : false

  async function handleJoinEvent() {
    try {
      await joinEvent({ variables: { eventId: event.id } })
      onClose()
    } catch (error) {
      console.error('Error joining event:', error)
      alert('Failed to join event. Please try again.')
    }
  }

  async function handleLeaveEvent() {
    try {
      await leaveEvent({ variables: { eventId: event.id } })
      onClose()
    } catch (error) {
      console.error('Error leaving event:', error)
      alert('Failed to leave event. Please try again.')
    }
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault()

    const input: EventInput = {
      title: eventTitle,
      date: eventDate,
      startTime: eventTimeFrom,
      endTime: eventTimeTo,
      description: eventDescription || null,
      attendeeIds: eventAttendees.map((a) => a.id),
    }

    try {
      await updateEvent({ variables: { id: event.id, input } })
      onClose()
    } catch (error) {
      console.error('Error updating event:', error)
      alert('Failed to update event. Please try again.')
    }
  }

  async function handleDelete() {
    try {
      await deleteEvent({ variables: { id: event.id } })
      onClose()
    } catch (error) {
      console.error('Error deleting event:', error)
      alert('Failed to delete event. Please try again.')
    }
  }

  function handleCancel() {
    setEventTitle(event.title)
    setEventDescription(event.description || '')
    setEventDate(
      typeof event.date === 'string'
        ? event.date
        : event.date.toISOString().split('T')[0],
    )
    setEventTimeFrom(event.startTime)
    setEventTimeTo(event.endTime)
    setEventAttendees(event.attendees as Array<User>)
    setIsEditing(false)
  }

  const eventDateObj = new Date(eventDate)

  if (showDeleteConfirm) {
    return (
      <div className="event-details-form">
        <h3 className="font-semibold mb-4 text-lg">Delete Event</h3>
        <p className="mb-4">
          Are you sure you want to delete &quot;{event.title}&quot;? This action
          cannot be undone.
        </p>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={handleDelete}
            disabled={deleting}
            className="flex-1 py-2 px-4 bg-red-600 text-white font-semibold rounded-md shadow hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {deleting ? 'Deleting...' : 'Delete'}
          </button>
          <button
            type="button"
            onClick={() => setShowDeleteConfirm(false)}
            className="flex-1 py-2 px-4 bg-gray-200 font-semibold rounded-md shadow hover:bg-gray-300 transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    )
  }

  if (isEditing) {
    return (
      <form className="event-details-form" onSubmit={handleSave}>
        <h3 className="font-semibold mb-2">Edit Event</h3>
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
              value={eventDate}
              onChange={(e) => setEventDate(e.target.value)}
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
              value={eventDescription}
              onChange={(e) => setEventDescription(e.target.value)}
              placeholder="Event description"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              rows={3}
            />
          </div>
          <div className="flex gap-2">
            <button
              type="submit"
              disabled={updating}
              className="flex-1 py-2 px-4 bg-blue-600 text-white font-semibold rounded-md shadow hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {updating ? 'Saving...' : 'Save Changes'}
            </button>
            <button
              type="button"
              onClick={handleCancel}
              className="flex-1 py-2 px-4 bg-gray-200 font-semibold rounded-md shadow hover:bg-gray-300 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      </form>
    )
  }

  return (
    <div className="event-details-form">
      <h3 className="font-semibold mb-2 text-xl">{event.title}</h3>
      <div className="space-y-3">
        <div className="flex items-center gap-2 text-gray-600">
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
          <span>
            {eventDateObj.toLocaleDateString('en-US', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </span>
        </div>
        <div className="flex items-center gap-2 text-gray-600">
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <span>
            {event.startTime} - {event.endTime}
          </span>
        </div>
        {event.attendees.length > 0 && (
          <div className="flex items-start gap-2 text-gray-600">
            <svg
              className="w-5 h-5 mt-0.5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
              />
            </svg>
            <div className="flex flex-wrap gap-1">
              {event.attendees.map((attendee) => (
                <span
                  key={attendee.id}
                  className="inline-flex items-center px-2 py-0.5 rounded text-sm"
                  style={{
                    backgroundColor: attendee.color
                      ? `${attendee.color}30`
                      : '#e5e7eb',
                    borderLeft: `3px solid ${attendee.color || '#9ca3af'}`,
                  }}
                >
                  {attendee.name}
                </span>
              ))}
            </div>
          </div>
        )}
        {event.description && (
          <div className="flex items-center gap-2 text-gray-600">
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M16.862 3.487a2.598 2.598 0 013.65 3.697l-12.21 12.21a2 2 0 01-.707.445l-3.59 1.197a.75.75 0 01-.95-.95l1.197-3.59a2 2 0 01.445-.707l12.21-12.21zm2.121 2.122l-1.5-1.5"
              />
            </svg>
            <span>{event.description}</span>
          </div>
        )}
        {isAdmin && (
          <div className="flex gap-2 mt-6">
            <button
              type="button"
              onClick={() => setIsEditing(true)}
              className="flex-1 py-2 px-4 bg-blue-600 text-white font-semibold rounded-md shadow hover:bg-blue-700 transition-colors"
            >
              Edit
            </button>
            <button
              type="button"
              onClick={() => setShowDeleteConfirm(true)}
              className="flex-1 py-2 px-4 bg-red-600 text-white font-semibold rounded-md shadow hover:bg-red-700 transition-colors"
            >
              Delete
            </button>
          </div>
        )}
        {!isAdmin && currentUser && (
          <div className="flex gap-2 mt-6">
            {isAttending ? (
              <button
                type="button"
                onClick={handleLeaveEvent}
                disabled={leaving}
                className="flex-1 py-2 px-4 bg-red-600 text-white font-semibold rounded-md shadow hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {leaving ? 'Leaving...' : 'Leave Event'}
              </button>
            ) : (
              <button
                type="button"
                onClick={handleJoinEvent}
                disabled={joining}
                className="flex-1 py-2 px-4 bg-green-600 text-white font-semibold rounded-md shadow hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {joining ? 'Joining...' : 'Join Event'}
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default EventDetails
