import useQueryGetMembers from '../features/event/hooks/QueryGetMembers'
import '../assets/MemberSelector.scss'
import type { MemberType } from '../features/event/types/MemberType'

interface MemberSelectorProps {
  selectedMembers: Array<MemberType>
  onChange: (selected: Array<MemberType>) => void
  header?: string
}

function MemberSelector({
  selectedMembers,
  onChange,
  header = '',
}: MemberSelectorProps) {
  const { members } = useQueryGetMembers()

  const toggleMember = (member: MemberType) => {
    if (selectedMembers.some((m) => m.id === member.id)) {
      onChange(selectedMembers.filter((m) => m.id !== member.id))
    } else {
      onChange([...selectedMembers, member])
    }
  }

  return (
    <div className="member-selector">
      {header && <h3>Members</h3>}
      <div className="member-checkbox-group">
        {members.map((member) => (
          <label
            key={member.id}
            className="member-checkbox"
            style={{ ['--member-color' as any]: member.color }}
          >
            <input
              type="checkbox"
              value={member.id}
              checked={selectedMembers.some((m) => m.id === member.id)}
              onChange={() => toggleMember(member)}
            />
            <div className="custom-checkbox"></div>
            {member.name}
          </label>
        ))}
      </div>
    </div>
  )
}

export default MemberSelector
