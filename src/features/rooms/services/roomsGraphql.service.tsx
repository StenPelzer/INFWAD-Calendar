import { gql } from '@apollo/client'
import { useMutation, useQuery } from '@apollo/client/react'

// Types
export interface Room {
  id: number
  name: string
  capacity: number | null
  location: string | null
}

export interface RoomBooking {
  id: number
  roomId: number
  userId: number
  date: string
  startTime: string
  endTime: string
  title: string | null
  room: Room
  user: {
    id: number
    name: string
  }
}

export interface RoomWithBookings extends Room {
  bookings: Array<RoomBooking>
}

// Queries
const GET_ROOMS_QUERY = gql`
  query GetRooms {
    rooms {
      id
      name
      capacity
      location
    }
  }
`

const GET_ROOMS_WITH_BOOKINGS_QUERY = gql`
  query GetRoomsWithBookings {
    roomsWithBookings {
      id
      name
      capacity
      location
      bookings {
        id
        roomId
        userId
        date
        startTime
        endTime
        title
        user {
          id
          name
        }
      }
    }
  }
`

const GET_ROOM_BOOKINGS_BY_ROOM_QUERY = gql`
  query GetRoomBookingsByRoom($roomId: Int!) {
    roomBookingsByRoom(roomId: $roomId) {
      id
      roomId
      userId
      date
      startTime
      endTime
      title
      room {
        id
        name
      }
      user {
        id
        name
      }
    }
  }
`

// Mutations
const CREATE_ROOM_MUTATION = gql`
  mutation CreateRoom($input: RoomInput!) {
    createRoom(input: $input) {
      id
      name
      capacity
      location
    }
  }
`

const UPDATE_ROOM_MUTATION = gql`
  mutation UpdateRoom($id: Int!, $input: RoomInput!) {
    updateRoom(id: $id, input: $input) {
      id
      name
      capacity
      location
    }
  }
`

const DELETE_ROOM_MUTATION = gql`
  mutation DeleteRoom($id: Int!) {
    deleteRoom(id: $id)
  }
`

const BOOK_ROOM_MUTATION = gql`
  mutation BookRoom($input: RoomBookingInput!) {
    bookRoom(input: $input) {
      id
      roomId
      userId
      date
      startTime
      endTime
      title
      room {
        id
        name
      }
      user {
        id
        name
      }
    }
  }
`

const CANCEL_ROOM_BOOKING_MUTATION = gql`
  mutation CancelRoomBooking($bookingId: Int!) {
    cancelRoomBooking(bookingId: $bookingId)
  }
`

// Hooks
export function useGetRooms() {
  return useQuery<{ rooms: Array<Room> }>(GET_ROOMS_QUERY)
}

export function useGetRoomsWithBookings() {
  return useQuery<{ roomsWithBookings: Array<RoomWithBookings> }>(
    GET_ROOMS_WITH_BOOKINGS_QUERY,
  )
}

export function useGetRoomBookingsByRoom(roomId: number) {
  return useQuery<{ roomBookingsByRoom: Array<RoomBooking> }>(
    GET_ROOM_BOOKINGS_BY_ROOM_QUERY,
    { variables: { roomId } },
  )
}

export function useCreateRoom() {
  return useMutation(CREATE_ROOM_MUTATION, {
    refetchQueries: [
      { query: GET_ROOMS_QUERY },
      { query: GET_ROOMS_WITH_BOOKINGS_QUERY },
    ],
  })
}

export function useUpdateRoom() {
  return useMutation(UPDATE_ROOM_MUTATION, {
    refetchQueries: [
      { query: GET_ROOMS_QUERY },
      { query: GET_ROOMS_WITH_BOOKINGS_QUERY },
    ],
  })
}

export function useDeleteRoom() {
  return useMutation(DELETE_ROOM_MUTATION, {
    refetchQueries: [
      { query: GET_ROOMS_QUERY },
      { query: GET_ROOMS_WITH_BOOKINGS_QUERY },
    ],
  })
}

export function useBookRoom() {
  return useMutation(BOOK_ROOM_MUTATION, {
    refetchQueries: [
      { query: GET_ROOMS_QUERY },
      { query: GET_ROOMS_WITH_BOOKINGS_QUERY },
    ],
  })
}

export function useCancelRoomBooking() {
  return useMutation(CANCEL_ROOM_BOOKING_MUTATION, {
    refetchQueries: [
      { query: GET_ROOMS_QUERY },
      { query: GET_ROOMS_WITH_BOOKINGS_QUERY },
    ],
  })
}

// Helper to check if a room is available at a specific time
export function isRoomAvailable(
  bookings: Array<RoomBooking>,
  date: string,
  startTime: string,
  endTime: string,
  excludeBookingId?: number,
): boolean {
  const dayBookings = bookings.filter(
    (b) => b.date === date && b.id !== excludeBookingId,
  )

  for (const booking of dayBookings) {
    // Check for time overlap
    if (timesOverlap(startTime, endTime, booking.startTime, booking.endTime)) {
      return false
    }
  }

  return true
}

function timesOverlap(
  start1: string,
  end1: string,
  start2: string,
  end2: string,
): boolean {
  const toMinutes = (time: string) => {
    const [h, m] = time.split(':').map(Number)
    return h * 60 + m
  }

  const s1 = toMinutes(start1)
  const e1 = toMinutes(end1)
  const s2 = toMinutes(start2)
  const e2 = toMinutes(end2)

  return s1 < e2 && s2 < e1
}

export default {
  useGetRooms,
  useGetRoomsWithBookings,
  useGetRoomBookingsByRoom,
  useCreateRoom,
  useUpdateRoom,
  useDeleteRoom,
  useBookRoom,
  useCancelRoomBooking,
  isRoomAvailable,
}
