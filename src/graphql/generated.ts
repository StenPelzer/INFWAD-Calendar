import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client/react';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
const defaultOptions = {} as const;
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  LocalDate: { input: any; output: any; }
};

/** Defines when a policy shall be executed. */
export enum ApplyPolicy {
  /** After the resolver was executed. */
  AfterResolver = 'AFTER_RESOLVER',
  /** Before the resolver was executed. */
  BeforeResolver = 'BEFORE_RESOLVER',
  /** The policy is applied in the validation step before the execution. */
  Validation = 'VALIDATION'
}

export type AuthPayload = {
  __typename?: 'AuthPayload';
  error: Maybe<Scalars['String']['output']>;
  success: Scalars['Boolean']['output'];
  token: Maybe<Scalars['String']['output']>;
  user: Maybe<User>;
};

export type Event = {
  __typename?: 'Event';
  attendees: Array<User>;
  date: Scalars['LocalDate']['output'];
  description: Maybe<Scalars['String']['output']>;
  endTime: Scalars['String']['output'];
  id: Scalars['Int']['output'];
  room: Maybe<Room>;
  roomId: Maybe<Scalars['Int']['output']>;
  startTime: Scalars['String']['output'];
  title: Scalars['String']['output'];
};

export type EventAttendee = {
  __typename?: 'EventAttendee';
  event: Event;
  eventId: Scalars['Int']['output'];
  user: User;
  userId: Scalars['Int']['output'];
};

export type EventInput = {
  attendeeIds: InputMaybe<Array<Scalars['Int']['input']>>;
  date: Scalars['LocalDate']['input'];
  description: InputMaybe<Scalars['String']['input']>;
  endTime: Scalars['String']['input'];
  roomId: InputMaybe<Scalars['Int']['input']>;
  startTime: Scalars['String']['input'];
  title: Scalars['String']['input'];
};

export type Group = {
  __typename?: 'Group';
  description: Maybe<Scalars['String']['output']>;
  id: Scalars['Int']['output'];
  members: Array<User>;
  name: Scalars['String']['output'];
};

export type GroupMembership = {
  __typename?: 'GroupMembership';
  group: Group;
  groupId: Scalars['Int']['output'];
  user: User;
  userId: Scalars['Int']['output'];
};

export type LoginInput = {
  email: Scalars['String']['input'];
  password: Scalars['String']['input'];
};

export type Mutation = {
  __typename?: 'Mutation';
  bookRoom: RoomBooking;
  cancelRoomBooking: Scalars['Boolean']['output'];
  createEvent: Event;
  createRoom: Room;
  deleteEvent: Scalars['Boolean']['output'];
  deleteRoom: Scalars['Boolean']['output'];
  joinEvent: Maybe<Event>;
  leaveEvent: Maybe<Event>;
  login: AuthPayload;
  register: AuthPayload;
  updateEvent: Maybe<Event>;
  updateRoom: Maybe<Room>;
};


export type MutationBookRoomArgs = {
  input: RoomBookingInput;
};


export type MutationCancelRoomBookingArgs = {
  bookingId: Scalars['Int']['input'];
};


export type MutationCreateEventArgs = {
  input: EventInput;
};


export type MutationCreateRoomArgs = {
  input: RoomInput;
};


export type MutationDeleteEventArgs = {
  id: Scalars['Int']['input'];
};


export type MutationDeleteRoomArgs = {
  id: Scalars['Int']['input'];
};


export type MutationJoinEventArgs = {
  eventId: Scalars['Int']['input'];
};


export type MutationLeaveEventArgs = {
  eventId: Scalars['Int']['input'];
};


export type MutationLoginArgs = {
  input: LoginInput;
};


export type MutationRegisterArgs = {
  input: RegisterInput;
};


export type MutationUpdateEventArgs = {
  id: Scalars['Int']['input'];
  input: EventInput;
};


export type MutationUpdateRoomArgs = {
  id: Scalars['Int']['input'];
  input: RoomInput;
};

export type Query = {
  __typename?: 'Query';
  event: Maybe<Event>;
  events: Array<Event>;
  group: Maybe<Group>;
  groups: Array<Group>;
  me: Maybe<User>;
  room: Maybe<Room>;
  roomBookings: Array<RoomBooking>;
  roomBookingsByRoom: Array<RoomBooking>;
  roomWithBookings: Maybe<Room>;
  rooms: Array<Room>;
  roomsWithBookings: Array<RoomWithBookings>;
  user: Maybe<User>;
  userOfficeAttendance: Maybe<UserOfficeAttendance>;
  userOfficeAttendances: Array<UserOfficeAttendance>;
  users: Array<User>;
};


export type QueryEventArgs = {
  id: Scalars['Int']['input'];
};


export type QueryGroupArgs = {
  id: Scalars['Int']['input'];
};


export type QueryRoomArgs = {
  id: Scalars['Int']['input'];
};


export type QueryRoomBookingsByRoomArgs = {
  roomId: Scalars['Int']['input'];
};


export type QueryRoomWithBookingsArgs = {
  id: Scalars['Int']['input'];
};


export type QueryUserArgs = {
  id: Scalars['Int']['input'];
};


export type QueryUserOfficeAttendanceArgs = {
  id: Scalars['Int']['input'];
};

export type RegisterInput = {
  email: Scalars['String']['input'];
  name: Scalars['String']['input'];
  password: Scalars['String']['input'];
};

export type Room = {
  __typename?: 'Room';
  capacity: Maybe<Scalars['Int']['output']>;
  id: Scalars['Int']['output'];
  location: Maybe<Scalars['String']['output']>;
  name: Scalars['String']['output'];
};

export type RoomBooking = {
  __typename?: 'RoomBooking';
  date: Scalars['LocalDate']['output'];
  endTime: Scalars['String']['output'];
  id: Scalars['Int']['output'];
  room: Room;
  roomId: Scalars['Int']['output'];
  startTime: Scalars['String']['output'];
  title: Maybe<Scalars['String']['output']>;
  user: User;
  userId: Scalars['Int']['output'];
};

export type RoomBookingInput = {
  date: Scalars['LocalDate']['input'];
  endTime: Scalars['String']['input'];
  roomId: Scalars['Int']['input'];
  startTime: Scalars['String']['input'];
  title: InputMaybe<Scalars['String']['input']>;
};

export type RoomInput = {
  capacity: InputMaybe<Scalars['Int']['input']>;
  location: InputMaybe<Scalars['String']['input']>;
  name: Scalars['String']['input'];
};

export type RoomWithBookings = {
  __typename?: 'RoomWithBookings';
  bookings: Array<RoomBooking>;
  capacity: Maybe<Scalars['Int']['output']>;
  id: Scalars['Int']['output'];
  location: Maybe<Scalars['String']['output']>;
  name: Scalars['String']['output'];
};

export type User = {
  __typename?: 'User';
  color: Scalars['String']['output'];
  email: Scalars['String']['output'];
  events: Array<Event>;
  groups: Array<Group>;
  id: Scalars['Int']['output'];
  name: Scalars['String']['output'];
  role: UserRole;
};

export type UserOfficeAttendance = {
  __typename?: 'UserOfficeAttendance';
  dayOfTheWeek: Scalars['String']['output'];
  endTime: Scalars['String']['output'];
  id: Scalars['Int']['output'];
  startTime: Scalars['String']['output'];
  user: User;
  userId: Scalars['Int']['output'];
};

export enum UserRole {
  Admin = 'ADMIN',
  Basic = 'BASIC'
}

export type GetAttendeesQueryVariables = Exact<{ [key: string]: never; }>;


export type GetAttendeesQuery = { __typename?: 'Query', users: Array<{ __typename?: 'User', id: number, name: string, color: string }> };

export type GetEventsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetEventsQuery = { __typename?: 'Query', events: Array<{ __typename?: 'Event', id: number, title: string, date: any, startTime: string, endTime: string, description: string | null, roomId: number | null, room: { __typename?: 'Room', id: number, name: string, capacity: number | null, location: string | null } | null, attendees: Array<{ __typename?: 'User', id: number, name: string, color: string }> }> };

export type CreateEventMutationVariables = Exact<{
  input: EventInput;
}>;


export type CreateEventMutation = { __typename?: 'Mutation', createEvent: { __typename?: 'Event', id: number, title: string, date: any, startTime: string, endTime: string, description: string | null, roomId: number | null, room: { __typename?: 'Room', id: number, name: string, capacity: number | null, location: string | null } | null, attendees: Array<{ __typename?: 'User', id: number, name: string, color: string }> } };

export type UpdateEventMutationVariables = Exact<{
  id: Scalars['Int']['input'];
  input: EventInput;
}>;


export type UpdateEventMutation = { __typename?: 'Mutation', updateEvent: { __typename?: 'Event', id: number, title: string, date: any, startTime: string, endTime: string, description: string | null, roomId: number | null, room: { __typename?: 'Room', id: number, name: string, capacity: number | null, location: string | null } | null, attendees: Array<{ __typename?: 'User', id: number, name: string, color: string }> } | null };

export type DeleteEventMutationVariables = Exact<{
  id: Scalars['Int']['input'];
}>;


export type DeleteEventMutation = { __typename?: 'Mutation', deleteEvent: boolean };

export type JoinEventMutationVariables = Exact<{
  eventId: Scalars['Int']['input'];
}>;


export type JoinEventMutation = { __typename?: 'Mutation', joinEvent: { __typename?: 'Event', id: number, title: string, date: any, startTime: string, endTime: string, description: string | null, roomId: number | null, room: { __typename?: 'Room', id: number, name: string, capacity: number | null, location: string | null } | null, attendees: Array<{ __typename?: 'User', id: number, name: string, color: string }> } | null };

export type LeaveEventMutationVariables = Exact<{
  eventId: Scalars['Int']['input'];
}>;


export type LeaveEventMutation = { __typename?: 'Mutation', leaveEvent: { __typename?: 'Event', id: number, title: string, date: any, startTime: string, endTime: string, description: string | null, roomId: number | null, room: { __typename?: 'Room', id: number, name: string, capacity: number | null, location: string | null } | null, attendees: Array<{ __typename?: 'User', id: number, name: string, color: string }> } | null };

export type GetRoomsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetRoomsQuery = { __typename?: 'Query', rooms: Array<{ __typename?: 'Room', id: number, name: string, capacity: number | null, location: string | null }> };

export type GetRoomsWithBookingsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetRoomsWithBookingsQuery = { __typename?: 'Query', roomsWithBookings: Array<{ __typename?: 'RoomWithBookings', id: number, name: string, capacity: number | null, location: string | null, bookings: Array<{ __typename?: 'RoomBooking', id: number, roomId: number, userId: number, date: any, startTime: string, endTime: string, title: string | null, user: { __typename?: 'User', id: number, name: string } }> }> };

export type GetRoomBookingsByRoomQueryVariables = Exact<{
  roomId: Scalars['Int']['input'];
}>;


export type GetRoomBookingsByRoomQuery = { __typename?: 'Query', roomBookingsByRoom: Array<{ __typename?: 'RoomBooking', id: number, roomId: number, userId: number, date: any, startTime: string, endTime: string, title: string | null, room: { __typename?: 'Room', id: number, name: string }, user: { __typename?: 'User', id: number, name: string } }> };

export type CreateRoomMutationVariables = Exact<{
  input: RoomInput;
}>;


export type CreateRoomMutation = { __typename?: 'Mutation', createRoom: { __typename?: 'Room', id: number, name: string, capacity: number | null, location: string | null } };

export type UpdateRoomMutationVariables = Exact<{
  id: Scalars['Int']['input'];
  input: RoomInput;
}>;


export type UpdateRoomMutation = { __typename?: 'Mutation', updateRoom: { __typename?: 'Room', id: number, name: string, capacity: number | null, location: string | null } | null };

export type DeleteRoomMutationVariables = Exact<{
  id: Scalars['Int']['input'];
}>;


export type DeleteRoomMutation = { __typename?: 'Mutation', deleteRoom: boolean };

export type BookRoomMutationVariables = Exact<{
  input: RoomBookingInput;
}>;


export type BookRoomMutation = { __typename?: 'Mutation', bookRoom: { __typename?: 'RoomBooking', id: number, roomId: number, userId: number, date: any, startTime: string, endTime: string, title: string | null, room: { __typename?: 'Room', id: number, name: string }, user: { __typename?: 'User', id: number, name: string } } };

export type CancelRoomBookingMutationVariables = Exact<{
  bookingId: Scalars['Int']['input'];
}>;


export type CancelRoomBookingMutation = { __typename?: 'Mutation', cancelRoomBooking: boolean };

export type RegisterMutationVariables = Exact<{
  input: RegisterInput;
}>;


export type RegisterMutation = { __typename?: 'Mutation', register: { __typename?: 'AuthPayload', success: boolean, token: string | null, error: string | null, user: { __typename?: 'User', id: number, name: string, email: string, role: UserRole, color: string } | null } };

export type LoginMutationVariables = Exact<{
  input: LoginInput;
}>;


export type LoginMutation = { __typename?: 'Mutation', login: { __typename?: 'AuthPayload', success: boolean, token: string | null, error: string | null, user: { __typename?: 'User', id: number, name: string, email: string, role: UserRole, color: string } | null } };

export type MeQueryVariables = Exact<{ [key: string]: never; }>;


export type MeQuery = { __typename?: 'Query', me: { __typename?: 'User', id: number, name: string, email: string, role: UserRole, color: string } | null };


export const GetAttendeesDocument = gql`
    query GetAttendees {
  users {
    id
    name
    color
  }
}
    `;

/**
 * __useGetAttendeesQuery__
 *
 * To run a query within a React component, call `useGetAttendeesQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetAttendeesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetAttendeesQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetAttendeesQuery(baseOptions?: Apollo.QueryHookOptions<GetAttendeesQuery, GetAttendeesQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetAttendeesQuery, GetAttendeesQueryVariables>(GetAttendeesDocument, options);
      }
export function useGetAttendeesLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetAttendeesQuery, GetAttendeesQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetAttendeesQuery, GetAttendeesQueryVariables>(GetAttendeesDocument, options);
        }
export function useGetAttendeesSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetAttendeesQuery, GetAttendeesQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetAttendeesQuery, GetAttendeesQueryVariables>(GetAttendeesDocument, options);
        }
export type GetAttendeesQueryHookResult = ReturnType<typeof useGetAttendeesQuery>;
export type GetAttendeesLazyQueryHookResult = ReturnType<typeof useGetAttendeesLazyQuery>;
export type GetAttendeesSuspenseQueryHookResult = ReturnType<typeof useGetAttendeesSuspenseQuery>;
export type GetAttendeesQueryResult = Apollo.QueryResult<GetAttendeesQuery, GetAttendeesQueryVariables>;
export const GetEventsDocument = gql`
    query GetEvents {
  events {
    id
    title
    date
    startTime
    endTime
    description
    roomId
    room {
      id
      name
      capacity
      location
    }
    attendees {
      id
      name
      color
    }
  }
}
    `;

/**
 * __useGetEventsQuery__
 *
 * To run a query within a React component, call `useGetEventsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetEventsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetEventsQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetEventsQuery(baseOptions?: Apollo.QueryHookOptions<GetEventsQuery, GetEventsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetEventsQuery, GetEventsQueryVariables>(GetEventsDocument, options);
      }
export function useGetEventsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetEventsQuery, GetEventsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetEventsQuery, GetEventsQueryVariables>(GetEventsDocument, options);
        }
export function useGetEventsSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetEventsQuery, GetEventsQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetEventsQuery, GetEventsQueryVariables>(GetEventsDocument, options);
        }
export type GetEventsQueryHookResult = ReturnType<typeof useGetEventsQuery>;
export type GetEventsLazyQueryHookResult = ReturnType<typeof useGetEventsLazyQuery>;
export type GetEventsSuspenseQueryHookResult = ReturnType<typeof useGetEventsSuspenseQuery>;
export type GetEventsQueryResult = Apollo.QueryResult<GetEventsQuery, GetEventsQueryVariables>;
export const CreateEventDocument = gql`
    mutation CreateEvent($input: EventInput!) {
  createEvent(input: $input) {
    id
    title
    date
    startTime
    endTime
    description
    roomId
    room {
      id
      name
      capacity
      location
    }
    attendees {
      id
      name
      color
    }
  }
}
    `;
export type CreateEventMutationFn = Apollo.MutationFunction<CreateEventMutation, CreateEventMutationVariables>;

/**
 * __useCreateEventMutation__
 *
 * To run a mutation, you first call `useCreateEventMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateEventMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createEventMutation, { data, loading, error }] = useCreateEventMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useCreateEventMutation(baseOptions?: Apollo.MutationHookOptions<CreateEventMutation, CreateEventMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateEventMutation, CreateEventMutationVariables>(CreateEventDocument, options);
      }
export type CreateEventMutationHookResult = ReturnType<typeof useCreateEventMutation>;
export type CreateEventMutationResult = Apollo.MutationResult<CreateEventMutation>;
export type CreateEventMutationOptions = Apollo.BaseMutationOptions<CreateEventMutation, CreateEventMutationVariables>;
export const UpdateEventDocument = gql`
    mutation UpdateEvent($id: Int!, $input: EventInput!) {
  updateEvent(id: $id, input: $input) {
    id
    title
    date
    startTime
    endTime
    description
    roomId
    room {
      id
      name
      capacity
      location
    }
    attendees {
      id
      name
      color
    }
  }
}
    `;
export type UpdateEventMutationFn = Apollo.MutationFunction<UpdateEventMutation, UpdateEventMutationVariables>;

/**
 * __useUpdateEventMutation__
 *
 * To run a mutation, you first call `useUpdateEventMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateEventMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateEventMutation, { data, loading, error }] = useUpdateEventMutation({
 *   variables: {
 *      id: // value for 'id'
 *      input: // value for 'input'
 *   },
 * });
 */
export function useUpdateEventMutation(baseOptions?: Apollo.MutationHookOptions<UpdateEventMutation, UpdateEventMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateEventMutation, UpdateEventMutationVariables>(UpdateEventDocument, options);
      }
export type UpdateEventMutationHookResult = ReturnType<typeof useUpdateEventMutation>;
export type UpdateEventMutationResult = Apollo.MutationResult<UpdateEventMutation>;
export type UpdateEventMutationOptions = Apollo.BaseMutationOptions<UpdateEventMutation, UpdateEventMutationVariables>;
export const DeleteEventDocument = gql`
    mutation DeleteEvent($id: Int!) {
  deleteEvent(id: $id)
}
    `;
export type DeleteEventMutationFn = Apollo.MutationFunction<DeleteEventMutation, DeleteEventMutationVariables>;

/**
 * __useDeleteEventMutation__
 *
 * To run a mutation, you first call `useDeleteEventMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteEventMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteEventMutation, { data, loading, error }] = useDeleteEventMutation({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useDeleteEventMutation(baseOptions?: Apollo.MutationHookOptions<DeleteEventMutation, DeleteEventMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<DeleteEventMutation, DeleteEventMutationVariables>(DeleteEventDocument, options);
      }
export type DeleteEventMutationHookResult = ReturnType<typeof useDeleteEventMutation>;
export type DeleteEventMutationResult = Apollo.MutationResult<DeleteEventMutation>;
export type DeleteEventMutationOptions = Apollo.BaseMutationOptions<DeleteEventMutation, DeleteEventMutationVariables>;
export const JoinEventDocument = gql`
    mutation JoinEvent($eventId: Int!) {
  joinEvent(eventId: $eventId) {
    id
    title
    date
    startTime
    endTime
    description
    roomId
    room {
      id
      name
      capacity
      location
    }
    attendees {
      id
      name
      color
    }
  }
}
    `;
export type JoinEventMutationFn = Apollo.MutationFunction<JoinEventMutation, JoinEventMutationVariables>;

/**
 * __useJoinEventMutation__
 *
 * To run a mutation, you first call `useJoinEventMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useJoinEventMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [joinEventMutation, { data, loading, error }] = useJoinEventMutation({
 *   variables: {
 *      eventId: // value for 'eventId'
 *   },
 * });
 */
export function useJoinEventMutation(baseOptions?: Apollo.MutationHookOptions<JoinEventMutation, JoinEventMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<JoinEventMutation, JoinEventMutationVariables>(JoinEventDocument, options);
      }
export type JoinEventMutationHookResult = ReturnType<typeof useJoinEventMutation>;
export type JoinEventMutationResult = Apollo.MutationResult<JoinEventMutation>;
export type JoinEventMutationOptions = Apollo.BaseMutationOptions<JoinEventMutation, JoinEventMutationVariables>;
export const LeaveEventDocument = gql`
    mutation LeaveEvent($eventId: Int!) {
  leaveEvent(eventId: $eventId) {
    id
    title
    date
    startTime
    endTime
    description
    roomId
    room {
      id
      name
      capacity
      location
    }
    attendees {
      id
      name
      color
    }
  }
}
    `;
export type LeaveEventMutationFn = Apollo.MutationFunction<LeaveEventMutation, LeaveEventMutationVariables>;

/**
 * __useLeaveEventMutation__
 *
 * To run a mutation, you first call `useLeaveEventMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useLeaveEventMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [leaveEventMutation, { data, loading, error }] = useLeaveEventMutation({
 *   variables: {
 *      eventId: // value for 'eventId'
 *   },
 * });
 */
export function useLeaveEventMutation(baseOptions?: Apollo.MutationHookOptions<LeaveEventMutation, LeaveEventMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<LeaveEventMutation, LeaveEventMutationVariables>(LeaveEventDocument, options);
      }
export type LeaveEventMutationHookResult = ReturnType<typeof useLeaveEventMutation>;
export type LeaveEventMutationResult = Apollo.MutationResult<LeaveEventMutation>;
export type LeaveEventMutationOptions = Apollo.BaseMutationOptions<LeaveEventMutation, LeaveEventMutationVariables>;
export const GetRoomsDocument = gql`
    query GetRooms {
  rooms {
    id
    name
    capacity
    location
  }
}
    `;

/**
 * __useGetRoomsQuery__
 *
 * To run a query within a React component, call `useGetRoomsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetRoomsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetRoomsQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetRoomsQuery(baseOptions?: Apollo.QueryHookOptions<GetRoomsQuery, GetRoomsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetRoomsQuery, GetRoomsQueryVariables>(GetRoomsDocument, options);
      }
export function useGetRoomsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetRoomsQuery, GetRoomsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetRoomsQuery, GetRoomsQueryVariables>(GetRoomsDocument, options);
        }
export function useGetRoomsSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetRoomsQuery, GetRoomsQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetRoomsQuery, GetRoomsQueryVariables>(GetRoomsDocument, options);
        }
export type GetRoomsQueryHookResult = ReturnType<typeof useGetRoomsQuery>;
export type GetRoomsLazyQueryHookResult = ReturnType<typeof useGetRoomsLazyQuery>;
export type GetRoomsSuspenseQueryHookResult = ReturnType<typeof useGetRoomsSuspenseQuery>;
export type GetRoomsQueryResult = Apollo.QueryResult<GetRoomsQuery, GetRoomsQueryVariables>;
export const GetRoomsWithBookingsDocument = gql`
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
    `;

/**
 * __useGetRoomsWithBookingsQuery__
 *
 * To run a query within a React component, call `useGetRoomsWithBookingsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetRoomsWithBookingsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetRoomsWithBookingsQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetRoomsWithBookingsQuery(baseOptions?: Apollo.QueryHookOptions<GetRoomsWithBookingsQuery, GetRoomsWithBookingsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetRoomsWithBookingsQuery, GetRoomsWithBookingsQueryVariables>(GetRoomsWithBookingsDocument, options);
      }
export function useGetRoomsWithBookingsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetRoomsWithBookingsQuery, GetRoomsWithBookingsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetRoomsWithBookingsQuery, GetRoomsWithBookingsQueryVariables>(GetRoomsWithBookingsDocument, options);
        }
export function useGetRoomsWithBookingsSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetRoomsWithBookingsQuery, GetRoomsWithBookingsQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetRoomsWithBookingsQuery, GetRoomsWithBookingsQueryVariables>(GetRoomsWithBookingsDocument, options);
        }
export type GetRoomsWithBookingsQueryHookResult = ReturnType<typeof useGetRoomsWithBookingsQuery>;
export type GetRoomsWithBookingsLazyQueryHookResult = ReturnType<typeof useGetRoomsWithBookingsLazyQuery>;
export type GetRoomsWithBookingsSuspenseQueryHookResult = ReturnType<typeof useGetRoomsWithBookingsSuspenseQuery>;
export type GetRoomsWithBookingsQueryResult = Apollo.QueryResult<GetRoomsWithBookingsQuery, GetRoomsWithBookingsQueryVariables>;
export const GetRoomBookingsByRoomDocument = gql`
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
    `;

/**
 * __useGetRoomBookingsByRoomQuery__
 *
 * To run a query within a React component, call `useGetRoomBookingsByRoomQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetRoomBookingsByRoomQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetRoomBookingsByRoomQuery({
 *   variables: {
 *      roomId: // value for 'roomId'
 *   },
 * });
 */
export function useGetRoomBookingsByRoomQuery(baseOptions: Apollo.QueryHookOptions<GetRoomBookingsByRoomQuery, GetRoomBookingsByRoomQueryVariables> & ({ variables: GetRoomBookingsByRoomQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetRoomBookingsByRoomQuery, GetRoomBookingsByRoomQueryVariables>(GetRoomBookingsByRoomDocument, options);
      }
export function useGetRoomBookingsByRoomLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetRoomBookingsByRoomQuery, GetRoomBookingsByRoomQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetRoomBookingsByRoomQuery, GetRoomBookingsByRoomQueryVariables>(GetRoomBookingsByRoomDocument, options);
        }
export function useGetRoomBookingsByRoomSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetRoomBookingsByRoomQuery, GetRoomBookingsByRoomQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetRoomBookingsByRoomQuery, GetRoomBookingsByRoomQueryVariables>(GetRoomBookingsByRoomDocument, options);
        }
export type GetRoomBookingsByRoomQueryHookResult = ReturnType<typeof useGetRoomBookingsByRoomQuery>;
export type GetRoomBookingsByRoomLazyQueryHookResult = ReturnType<typeof useGetRoomBookingsByRoomLazyQuery>;
export type GetRoomBookingsByRoomSuspenseQueryHookResult = ReturnType<typeof useGetRoomBookingsByRoomSuspenseQuery>;
export type GetRoomBookingsByRoomQueryResult = Apollo.QueryResult<GetRoomBookingsByRoomQuery, GetRoomBookingsByRoomQueryVariables>;
export const CreateRoomDocument = gql`
    mutation CreateRoom($input: RoomInput!) {
  createRoom(input: $input) {
    id
    name
    capacity
    location
  }
}
    `;
export type CreateRoomMutationFn = Apollo.MutationFunction<CreateRoomMutation, CreateRoomMutationVariables>;

/**
 * __useCreateRoomMutation__
 *
 * To run a mutation, you first call `useCreateRoomMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateRoomMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createRoomMutation, { data, loading, error }] = useCreateRoomMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useCreateRoomMutation(baseOptions?: Apollo.MutationHookOptions<CreateRoomMutation, CreateRoomMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateRoomMutation, CreateRoomMutationVariables>(CreateRoomDocument, options);
      }
export type CreateRoomMutationHookResult = ReturnType<typeof useCreateRoomMutation>;
export type CreateRoomMutationResult = Apollo.MutationResult<CreateRoomMutation>;
export type CreateRoomMutationOptions = Apollo.BaseMutationOptions<CreateRoomMutation, CreateRoomMutationVariables>;
export const UpdateRoomDocument = gql`
    mutation UpdateRoom($id: Int!, $input: RoomInput!) {
  updateRoom(id: $id, input: $input) {
    id
    name
    capacity
    location
  }
}
    `;
export type UpdateRoomMutationFn = Apollo.MutationFunction<UpdateRoomMutation, UpdateRoomMutationVariables>;

/**
 * __useUpdateRoomMutation__
 *
 * To run a mutation, you first call `useUpdateRoomMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateRoomMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateRoomMutation, { data, loading, error }] = useUpdateRoomMutation({
 *   variables: {
 *      id: // value for 'id'
 *      input: // value for 'input'
 *   },
 * });
 */
export function useUpdateRoomMutation(baseOptions?: Apollo.MutationHookOptions<UpdateRoomMutation, UpdateRoomMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateRoomMutation, UpdateRoomMutationVariables>(UpdateRoomDocument, options);
      }
export type UpdateRoomMutationHookResult = ReturnType<typeof useUpdateRoomMutation>;
export type UpdateRoomMutationResult = Apollo.MutationResult<UpdateRoomMutation>;
export type UpdateRoomMutationOptions = Apollo.BaseMutationOptions<UpdateRoomMutation, UpdateRoomMutationVariables>;
export const DeleteRoomDocument = gql`
    mutation DeleteRoom($id: Int!) {
  deleteRoom(id: $id)
}
    `;
export type DeleteRoomMutationFn = Apollo.MutationFunction<DeleteRoomMutation, DeleteRoomMutationVariables>;

/**
 * __useDeleteRoomMutation__
 *
 * To run a mutation, you first call `useDeleteRoomMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteRoomMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteRoomMutation, { data, loading, error }] = useDeleteRoomMutation({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useDeleteRoomMutation(baseOptions?: Apollo.MutationHookOptions<DeleteRoomMutation, DeleteRoomMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<DeleteRoomMutation, DeleteRoomMutationVariables>(DeleteRoomDocument, options);
      }
export type DeleteRoomMutationHookResult = ReturnType<typeof useDeleteRoomMutation>;
export type DeleteRoomMutationResult = Apollo.MutationResult<DeleteRoomMutation>;
export type DeleteRoomMutationOptions = Apollo.BaseMutationOptions<DeleteRoomMutation, DeleteRoomMutationVariables>;
export const BookRoomDocument = gql`
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
    `;
export type BookRoomMutationFn = Apollo.MutationFunction<BookRoomMutation, BookRoomMutationVariables>;

/**
 * __useBookRoomMutation__
 *
 * To run a mutation, you first call `useBookRoomMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useBookRoomMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [bookRoomMutation, { data, loading, error }] = useBookRoomMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useBookRoomMutation(baseOptions?: Apollo.MutationHookOptions<BookRoomMutation, BookRoomMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<BookRoomMutation, BookRoomMutationVariables>(BookRoomDocument, options);
      }
export type BookRoomMutationHookResult = ReturnType<typeof useBookRoomMutation>;
export type BookRoomMutationResult = Apollo.MutationResult<BookRoomMutation>;
export type BookRoomMutationOptions = Apollo.BaseMutationOptions<BookRoomMutation, BookRoomMutationVariables>;
export const CancelRoomBookingDocument = gql`
    mutation CancelRoomBooking($bookingId: Int!) {
  cancelRoomBooking(bookingId: $bookingId)
}
    `;
export type CancelRoomBookingMutationFn = Apollo.MutationFunction<CancelRoomBookingMutation, CancelRoomBookingMutationVariables>;

/**
 * __useCancelRoomBookingMutation__
 *
 * To run a mutation, you first call `useCancelRoomBookingMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCancelRoomBookingMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [cancelRoomBookingMutation, { data, loading, error }] = useCancelRoomBookingMutation({
 *   variables: {
 *      bookingId: // value for 'bookingId'
 *   },
 * });
 */
export function useCancelRoomBookingMutation(baseOptions?: Apollo.MutationHookOptions<CancelRoomBookingMutation, CancelRoomBookingMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CancelRoomBookingMutation, CancelRoomBookingMutationVariables>(CancelRoomBookingDocument, options);
      }
export type CancelRoomBookingMutationHookResult = ReturnType<typeof useCancelRoomBookingMutation>;
export type CancelRoomBookingMutationResult = Apollo.MutationResult<CancelRoomBookingMutation>;
export type CancelRoomBookingMutationOptions = Apollo.BaseMutationOptions<CancelRoomBookingMutation, CancelRoomBookingMutationVariables>;
export const RegisterDocument = gql`
    mutation Register($input: RegisterInput!) {
  register(input: $input) {
    success
    token
    error
    user {
      id
      name
      email
      role
      color
    }
  }
}
    `;
export type RegisterMutationFn = Apollo.MutationFunction<RegisterMutation, RegisterMutationVariables>;

/**
 * __useRegisterMutation__
 *
 * To run a mutation, you first call `useRegisterMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useRegisterMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [registerMutation, { data, loading, error }] = useRegisterMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useRegisterMutation(baseOptions?: Apollo.MutationHookOptions<RegisterMutation, RegisterMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<RegisterMutation, RegisterMutationVariables>(RegisterDocument, options);
      }
export type RegisterMutationHookResult = ReturnType<typeof useRegisterMutation>;
export type RegisterMutationResult = Apollo.MutationResult<RegisterMutation>;
export type RegisterMutationOptions = Apollo.BaseMutationOptions<RegisterMutation, RegisterMutationVariables>;
export const LoginDocument = gql`
    mutation Login($input: LoginInput!) {
  login(input: $input) {
    success
    token
    error
    user {
      id
      name
      email
      role
      color
    }
  }
}
    `;
export type LoginMutationFn = Apollo.MutationFunction<LoginMutation, LoginMutationVariables>;

/**
 * __useLoginMutation__
 *
 * To run a mutation, you first call `useLoginMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useLoginMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [loginMutation, { data, loading, error }] = useLoginMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useLoginMutation(baseOptions?: Apollo.MutationHookOptions<LoginMutation, LoginMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<LoginMutation, LoginMutationVariables>(LoginDocument, options);
      }
export type LoginMutationHookResult = ReturnType<typeof useLoginMutation>;
export type LoginMutationResult = Apollo.MutationResult<LoginMutation>;
export type LoginMutationOptions = Apollo.BaseMutationOptions<LoginMutation, LoginMutationVariables>;
export const MeDocument = gql`
    query Me {
  me {
    id
    name
    email
    role
    color
  }
}
    `;

/**
 * __useMeQuery__
 *
 * To run a query within a React component, call `useMeQuery` and pass it any options that fit your needs.
 * When your component renders, `useMeQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useMeQuery({
 *   variables: {
 *   },
 * });
 */
export function useMeQuery(baseOptions?: Apollo.QueryHookOptions<MeQuery, MeQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<MeQuery, MeQueryVariables>(MeDocument, options);
      }
export function useMeLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<MeQuery, MeQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<MeQuery, MeQueryVariables>(MeDocument, options);
        }
export function useMeSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<MeQuery, MeQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<MeQuery, MeQueryVariables>(MeDocument, options);
        }
export type MeQueryHookResult = ReturnType<typeof useMeQuery>;
export type MeLazyQueryHookResult = ReturnType<typeof useMeLazyQuery>;
export type MeSuspenseQueryHookResult = ReturnType<typeof useMeSuspenseQuery>;
export type MeQueryResult = Apollo.QueryResult<MeQuery, MeQueryVariables>;