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

export type CreateEventInput = {
  date: Scalars['LocalDate']['input'];
  description: InputMaybe<Scalars['String']['input']>;
  endTime: Scalars['String']['input'];
  startTime: Scalars['String']['input'];
  title: Scalars['String']['input'];
};

export type Event = {
  __typename?: 'Event';
  attendees: Array<User>;
  date: Scalars['LocalDate']['output'];
  description: Maybe<Scalars['String']['output']>;
  endTime: Scalars['String']['output'];
  id: Scalars['Int']['output'];
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
  date: Scalars['LocalDate']['input'];
  description: InputMaybe<Scalars['String']['input']>;
  endTime: Scalars['String']['input'];
  id: Scalars['Int']['input'];
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

export type Mutation = {
  __typename?: 'Mutation';
  createEvent: Event;
  deleteEvent: Scalars['Boolean']['output'];
  updateEvent: Maybe<Event>;
};


export type MutationCreateEventArgs = {
  input: CreateEventInput;
};


export type MutationDeleteEventArgs = {
  id: Scalars['Int']['input'];
};


export type MutationUpdateEventArgs = {
  id: Scalars['Int']['input'];
  input: EventInput;
};

export type Query = {
  __typename?: 'Query';
  event: Maybe<Event>;
  events: Array<Event>;
  group: Maybe<Group>;
  groups: Array<Group>;
  role: Maybe<Role>;
  roles: Array<Role>;
  room: Maybe<Room>;
  rooms: Array<Room>;
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


export type QueryRoleArgs = {
  id: Scalars['Int']['input'];
};


export type QueryRoomArgs = {
  id: Scalars['Int']['input'];
};


export type QueryUserArgs = {
  id: Scalars['Int']['input'];
};


export type QueryUserOfficeAttendanceArgs = {
  id: Scalars['Int']['input'];
};

export type Role = {
  __typename?: 'Role';
  id: Scalars['Int']['output'];
  title: Scalars['String']['output'];
};

export type Room = {
  __typename?: 'Room';
  capacity: Maybe<Scalars['Int']['output']>;
  id: Scalars['Int']['output'];
  location: Maybe<Scalars['String']['output']>;
  name: Scalars['String']['output'];
};

export type User = {
  __typename?: 'User';
  color: Maybe<Scalars['String']['output']>;
  email: Scalars['String']['output'];
  events: Array<Event>;
  groups: Array<Group>;
  id: Scalars['Int']['output'];
  name: Scalars['String']['output'];
  password: Scalars['String']['output'];
  role: Scalars['String']['output'];
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

export type GetEventsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetEventsQuery = { __typename?: 'Query', events: Array<{ __typename?: 'Event', id: number, title: string, date: any, startTime: string, endTime: string, description: string | null, attendees: Array<{ __typename?: 'User', id: number, name: string, color: string | null }> }> };


export const GetEventsDocument = gql`
    query GetEvents {
  events {
    id
    title
    date
    startTime
    endTime
    description
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