import type { MemberType } from './MemberType'

export type EventType = {
  id?: string
  title: string
  date: Date
  timeFrom: string
  timeTo: string
  members: Array<MemberType>
  description: string
}
