import useQueryGetAttendees from '../features/event/hooks/QueryGetAttendees'
import '../assets/AttendeeSelector.scss'
import type { User } from '@/graphql/generated'

interface AttendeeSelectorProps {
  selectedAttendees: Array<User>
  onChange: (selected: Array<User>) => void
  header?: string
}

function AttendeeSelector({
  selectedAttendees,
  onChange,
  header = '',
}: AttendeeSelectorProps) {
  const { attendees } = useQueryGetAttendees()

  const toggleAttendee = (attendee: User) => {
    if (selectedAttendees.some((a) => a.id === attendee.id)) {
      onChange(selectedAttendees.filter((a) => a.id !== attendee.id))
    } else {
      onChange([...selectedAttendees, attendee])
    }
  }

  return (
    <div className="attendee-selector">
      {header && <h3>Attendees</h3>}
      <div className="attendee-checkbox-group">
        {attendees.map((attendee) => (
          <label
            key={attendee.id}
            className="attendee-checkbox"
            style={{ ['--attendee-color' as any]: attendee.color || 'gray' }}
          >
            <input
              type="checkbox"
              value={attendee.id.toString()}
              checked={selectedAttendees.some((a) => a.id === attendee.id)}
              onChange={() => toggleAttendee(attendee)}
            />
            <div className="custom-checkbox"></div>
            {attendee.name}
          </label>
        ))}
      </div>
    </div>
  )
}

export default AttendeeSelector
