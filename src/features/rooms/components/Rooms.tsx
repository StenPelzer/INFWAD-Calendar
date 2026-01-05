import { useState } from 'react'
import { useAuth } from '@/context/AuthContext'
import {
  useGetRoomsWithBookings,
  useCreateRoom,
  useUpdateRoom,
  useDeleteRoom,
  useBookRoom,
  useCancelRoomBooking,
  isRoomAvailable,
  type Room,
  type RoomWithBookings,
  type RoomBooking,
} from '../services/roomsGraphql.service'
import Modal from '@/components/Modal'
import {
  Building2,
  Calendar,
  Clock,
  MapPin,
  Plus,
  Trash2,
  Edit2,
  Users,
  X,
} from 'lucide-react'
import '../assets/rooms.scss'

function getCurrentDateString() {
  const now = new Date()
  return now.toLocaleDateString('en-CA')
}

function getCurrentTimeString() {
  const now = new Date()
  const hours = now.getHours().toString().padStart(2, '0')
  const minutes = now.getMinutes().toString().padStart(2, '0')
  return `${hours}:${minutes}`
}

function formatDate(dateStr: string): string {
  const [year, month, day] = dateStr.split('-').map(Number)
  const date = new Date(year, month - 1, day)
  return date.toLocaleDateString('en', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  })
}

export default function Rooms() {
  const { user } = useAuth()
  const isAdmin = user?.role === 'ADMIN'

  const { data, loading, error } = useGetRoomsWithBookings()
  const [createRoom, { loading: creating }] = useCreateRoom()
  const [updateRoom, { loading: updating }] = useUpdateRoom()
  const [deleteRoom] = useDeleteRoom()
  const [bookRoom, { loading: booking }] = useBookRoom()
  const [cancelBooking] = useCancelRoomBooking()

  // Modal states
  const [showRoomModal, setShowRoomModal] = useState(false)
  const [showBookingModal, setShowBookingModal] = useState(false)
  const [editingRoom, setEditingRoom] = useState<Room | null>(null)
  const [bookingRoom, setBookingRoom] = useState<RoomWithBookings | null>(null)

  // Form states
  const [roomName, setRoomName] = useState('')
  const [roomCapacity, setRoomCapacity] = useState('')
  const [roomLocation, setRoomLocation] = useState('')

  const [bookingDate, setBookingDate] = useState(getCurrentDateString())
  const [bookingStartTime, setBookingStartTime] = useState(
    getCurrentTimeString(),
  )
  const [bookingEndTime, setBookingEndTime] = useState(getCurrentTimeString())
  const [bookingTitle, setBookingTitle] = useState('')

  // Selected room for details view
  const [selectedRoom, setSelectedRoom] = useState<RoomWithBookings | null>(
    null,
  )

  if (loading) return <div className="rooms-loading">Loading rooms...</div>
  if (error)
    return (
      <div className="rooms-error">Error loading rooms: {error.message}</div>
    )

  const rooms = data?.roomsWithBookings || []

  const openRoomModal = (room?: Room) => {
    if (room) {
      setEditingRoom(room)
      setRoomName(room.name)
      setRoomCapacity(room.capacity?.toString() || '')
      setRoomLocation(room.location || '')
    } else {
      setEditingRoom(null)
      setRoomName('')
      setRoomCapacity('')
      setRoomLocation('')
    }
    setShowRoomModal(true)
  }

  const closeRoomModal = () => {
    setShowRoomModal(false)
    setEditingRoom(null)
    setRoomName('')
    setRoomCapacity('')
    setRoomLocation('')
  }

  const handleRoomSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const input = {
      name: roomName,
      capacity: roomCapacity ? parseInt(roomCapacity, 10) : null,
      location: roomLocation || null,
    }

    try {
      if (editingRoom) {
        await updateRoom({ variables: { id: editingRoom.id, input } })
      } else {
        await createRoom({ variables: { input } })
      }
      closeRoomModal()
    } catch (err) {
      console.error('Error saving room:', err)
      alert('Failed to save room. Please try again.')
    }
  }

  const handleDeleteRoom = async (roomId: number) => {
    if (
      !confirm(
        'Are you sure you want to delete this room? All bookings will be cancelled.',
      )
    ) {
      return
    }
    try {
      await deleteRoom({ variables: { id: roomId } })
      if (selectedRoom?.id === roomId) {
        setSelectedRoom(null)
      }
    } catch (err) {
      console.error('Error deleting room:', err)
      alert('Failed to delete room. Please try again.')
    }
  }

  const openBookingModal = (room: RoomWithBookings) => {
    setBookingRoom(room)
    setBookingDate(getCurrentDateString())
    setBookingStartTime(getCurrentTimeString())
    setBookingEndTime(getCurrentTimeString())
    setBookingTitle('')
    setShowBookingModal(true)
  }

  const closeBookingModal = () => {
    setShowBookingModal(false)
    setBookingRoom(null)
  }

  const handleBookingSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!bookingRoom) return

    // Check availability first
    if (
      !isRoomAvailable(
        bookingRoom.bookings,
        bookingDate,
        bookingStartTime,
        bookingEndTime,
      )
    ) {
      alert('This room is not available at the selected time.')
      return
    }

    try {
      await bookRoom({
        variables: {
          input: {
            roomId: bookingRoom.id,
            date: bookingDate,
            startTime: bookingStartTime,
            endTime: bookingEndTime,
            title: bookingTitle || null,
          },
        },
      })
      closeBookingModal()
    } catch (err) {
      console.error('Error booking room:', err)
      alert(
        'Failed to book room. The room may not be available at the selected time.',
      )
    }
  }

  const handleCancelBooking = async (bookingId: number) => {
    if (!confirm('Are you sure you want to cancel this booking?')) {
      return
    }
    try {
      await cancelBooking({ variables: { bookingId } })
    } catch (err) {
      console.error('Error cancelling booking:', err)
      alert('Failed to cancel booking. Please try again.')
    }
  }

  // Filter upcoming bookings for a room
  const getUpcomingBookings = (bookings: RoomBooking[]) => {
    const today = getCurrentDateString()
    return bookings
      .filter((b) => b.date >= today)
      .sort((a, b) => {
        if (a.date !== b.date) return a.date.localeCompare(b.date)
        return a.startTime.localeCompare(b.startTime)
      })
  }

  return (
    <div className="rooms-container">
      <div className="rooms-header">
        <h1>
          <Building2 size={28} />
          Room Reservations
        </h1>
        {isAdmin && (
          <button className="btn-primary" onClick={() => openRoomModal()}>
            <Plus size={18} />
            Add Room
          </button>
        )}
      </div>

      <div className="rooms-grid">
        {rooms.length === 0 ? (
          <div className="no-rooms">
            <Building2 size={48} />
            <p>No rooms available</p>
            {isAdmin && <p>Add a room to get started</p>}
          </div>
        ) : (
          rooms.map((room) => (
            <div
              key={room.id}
              className={`room-card ${selectedRoom?.id === room.id ? 'selected' : ''}`}
              onClick={() => setSelectedRoom(room)}
            >
              <div className="room-card-header">
                <h3>{room.name}</h3>
                <div className="room-actions">
                  <button
                    className="btn-book"
                    onClick={(e) => {
                      e.stopPropagation()
                      openBookingModal(room)
                    }}
                    title="Book this room"
                  >
                    <Calendar size={16} />
                  </button>
                  {isAdmin && (
                    <>
                      <button
                        className="btn-edit"
                        onClick={(e) => {
                          e.stopPropagation()
                          openRoomModal(room)
                        }}
                        title="Edit room"
                      >
                        <Edit2 size={16} />
                      </button>
                      <button
                        className="btn-delete"
                        onClick={(e) => {
                          e.stopPropagation()
                          handleDeleteRoom(room.id)
                        }}
                        title="Delete room"
                      >
                        <Trash2 size={16} />
                      </button>
                    </>
                  )}
                </div>
              </div>
              <div className="room-meta">
                {room.capacity && (
                  <span className="room-capacity">
                    <Users size={14} />
                    {room.capacity} people
                  </span>
                )}
                {room.location && (
                  <span className="room-location">
                    <MapPin size={14} />
                    {room.location}
                  </span>
                )}
              </div>
              <div className="room-bookings-summary">
                <span>
                  {getUpcomingBookings(room.bookings).length} upcoming bookings
                </span>
              </div>
            </div>
          ))
        )}
      </div>

      {selectedRoom && (
        <div className="room-details">
          <div className="room-details-header">
            <h2>{selectedRoom.name}</h2>
            <button className="btn-close" onClick={() => setSelectedRoom(null)}>
              <X size={20} />
            </button>
          </div>
          <div className="room-details-meta">
            {selectedRoom.capacity && (
              <span>
                <Users size={16} /> Capacity: {selectedRoom.capacity}
              </span>
            )}
            {selectedRoom.location && (
              <span>
                <MapPin size={16} /> {selectedRoom.location}
              </span>
            )}
          </div>

          <div className="bookings-list">
            <h3>
              <Calendar size={18} />
              Upcoming Bookings
            </h3>
            {getUpcomingBookings(selectedRoom.bookings).length === 0 ? (
              <p className="no-bookings">No upcoming bookings</p>
            ) : (
              <ul>
                {getUpcomingBookings(selectedRoom.bookings).map((booking) => (
                  <li key={booking.id} className="booking-item">
                    <div className="booking-info">
                      <span className="booking-date">
                        {formatDate(booking.date)}
                      </span>
                      <span className="booking-time">
                        <Clock size={14} />
                        {booking.startTime} - {booking.endTime}
                      </span>
                      {booking.title && (
                        <span className="booking-title">{booking.title}</span>
                      )}
                      <span className="booking-user">
                        Booked by: {booking.user.name}
                      </span>
                    </div>
                    {(booking.userId === user?.id || isAdmin) && (
                      <button
                        className="btn-cancel"
                        onClick={() => handleCancelBooking(booking.id)}
                        title="Cancel booking"
                      >
                        <Trash2 size={14} />
                      </button>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </div>

          <button
            className="btn-primary btn-book-full"
            onClick={() => openBookingModal(selectedRoom)}
          >
            <Calendar size={18} />
            Book This Room
          </button>
        </div>
      )}

      {/* Room Create/Edit Modal */}
      <Modal isOpen={showRoomModal} onClose={closeRoomModal}>
        <h3 className="modal-title">
          {editingRoom ? 'Edit Room' : 'Add Room'}
        </h3>
        <form className="room-form" onSubmit={handleRoomSubmit}>
          <div className="form-group">
            <label htmlFor="room-name">Room Name *</label>
            <input
              id="room-name"
              type="text"
              value={roomName}
              onChange={(e) => setRoomName(e.target.value)}
              required
              placeholder="e.g., Conference Room A"
            />
          </div>
          <div className="form-group">
            <label htmlFor="room-capacity">Capacity</label>
            <input
              id="room-capacity"
              type="number"
              value={roomCapacity}
              onChange={(e) => setRoomCapacity(e.target.value)}
              min="1"
              placeholder="e.g., 10"
            />
          </div>
          <div className="form-group">
            <label htmlFor="room-location">Location</label>
            <input
              id="room-location"
              type="text"
              value={roomLocation}
              onChange={(e) => setRoomLocation(e.target.value)}
              placeholder="e.g., Building A, Floor 2"
            />
          </div>
          <div className="form-actions">
            <button
              type="button"
              className="btn-secondary"
              onClick={closeRoomModal}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn-primary"
              disabled={creating || updating}
            >
              {creating || updating
                ? 'Saving...'
                : editingRoom
                  ? 'Update Room'
                  : 'Create Room'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Booking Modal */}
      <Modal
        isOpen={showBookingModal && !!bookingRoom}
        onClose={closeBookingModal}
      >
        {bookingRoom && (
          <>
            <h3 className="modal-title">Book {bookingRoom.name}</h3>
            <form className="booking-form" onSubmit={handleBookingSubmit}>
              <div className="form-group">
                <label htmlFor="booking-title">Booking Title (optional)</label>
                <input
                  id="booking-title"
                  type="text"
                  value={bookingTitle}
                  onChange={(e) => setBookingTitle(e.target.value)}
                  placeholder="e.g., Team Meeting"
                />
              </div>
              <div className="form-group">
                <label htmlFor="booking-date">Date *</label>
                <input
                  id="booking-date"
                  type="date"
                  value={bookingDate}
                  onChange={(e) => setBookingDate(e.target.value)}
                  min={getCurrentDateString()}
                  required
                />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="booking-start">Start Time *</label>
                  <input
                    id="booking-start"
                    type="time"
                    value={bookingStartTime}
                    onChange={(e) => setBookingStartTime(e.target.value)}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="booking-end">End Time *</label>
                  <input
                    id="booking-end"
                    type="time"
                    value={bookingEndTime}
                    onChange={(e) => setBookingEndTime(e.target.value)}
                    required
                  />
                </div>
              </div>

              {/* Show existing bookings for selected date */}
              <div className="date-bookings">
                <h4>Bookings on {formatDate(bookingDate)}:</h4>
                {bookingRoom.bookings.filter((b) => b.date === bookingDate)
                  .length === 0 ? (
                  <p className="no-bookings-hint">
                    No bookings - room is available all day
                  </p>
                ) : (
                  <ul>
                    {bookingRoom.bookings
                      .filter((b) => b.date === bookingDate)
                      .sort((a, b) => a.startTime.localeCompare(b.startTime))
                      .map((b) => (
                        <li key={b.id} className="existing-booking">
                          <Clock size={12} />
                          {b.startTime} - {b.endTime}
                          {b.title && ` - ${b.title}`}
                        </li>
                      ))}
                  </ul>
                )}
              </div>

              <div className="form-actions">
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={closeBookingModal}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-primary"
                  disabled={booking}
                >
                  {booking ? 'Booking...' : 'Book Room'}
                </button>
              </div>
            </form>
          </>
        )}
      </Modal>
    </div>
  )
}
