import { useMemo } from 'react'
import { Building2, MapPin, Users } from 'lucide-react'
import {
  isRoomAvailable,
  useGetRoomsWithBookings,
} from '@/features/rooms/services/roomsGraphql.service'
import './RoomSelector.scss'

type RoomSelectorProps = {
  selectedRoomId: number | null
  onChange: (roomId: number | null) => void
  date: string // YYYY-MM-DD
  startTime: string // HH:mm
  endTime: string // HH:mm
  excludeEventId?: number // For editing, exclude current event's room booking
}

export default function RoomSelector({
  selectedRoomId,
  onChange,
  date,
  startTime,
  endTime,
}: RoomSelectorProps) {
  const { data, loading, error } = useGetRoomsWithBookings()

  const roomsWithAvailability = useMemo(() => {
    if (!data?.roomsWithBookings) return []

    return data.roomsWithBookings.map((room) => ({
      ...room,
      available: isRoomAvailable(room.bookings, date, startTime, endTime),
    }))
  }, [data?.roomsWithBookings, date, startTime, endTime])

  if (loading) {
    return <div className="room-selector-loading">Loading rooms...</div>
  }

  if (error) {
    return <div className="room-selector-error">Error loading rooms</div>
  }

  if (roomsWithAvailability.length === 0) {
    return <div className="room-selector-empty">No rooms available</div>
  }

  return (
    <div className="room-selector">
      <div className="room-options">
        <button
          type="button"
          className={`room-option ${selectedRoomId === null ? 'selected' : ''}`}
          onClick={() => onChange(null)}
        >
          <span className="room-option-icon">—</span>
          <span className="room-option-name">No room</span>
        </button>

        {roomsWithAvailability.map((room) => (
          <button
            key={room.id}
            type="button"
            className={`room-option ${selectedRoomId === room.id ? 'selected' : ''} ${!room.available ? 'unavailable' : ''}`}
            onClick={() => {
              if (room.available) {
                onChange(room.id)
              }
            }}
            disabled={!room.available}
            title={
              !room.available ? 'Room is not available at this time' : undefined
            }
          >
            <span className="room-option-icon">
              <Building2 size={16} />
            </span>
            <div className="room-option-details">
              <span className="room-option-name">{room.name}</span>
              <span className="room-option-meta">
                {room.capacity && (
                  <span>
                    <Users size={12} /> {room.capacity}
                  </span>
                )}
                {room.location && (
                  <span>
                    <MapPin size={12} /> {room.location}
                  </span>
                )}
              </span>
            </div>
            {!room.available && (
              <span className="room-unavailable-badge">Booked</span>
            )}
          </button>
        ))}
      </div>
    </div>
  )
}
