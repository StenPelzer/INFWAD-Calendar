type Member = {
  id: string
  name: string
  color: string
  email: string
}

export function useQueryGetMembers() {
  const members: Array<Member> = [
    { id: '1', name: 'Sten', color: 'orange', email: '0927439+sten@hr.nl' },
    { id: '2', name: 'Bert', color: 'blue', email: '0927439+bert@hr.nl' },
    { id: '3', name: 'Merel', color: 'green', email: '0927439+merel@hr.nl' },
  ]

  return { members }
}

export default useQueryGetMembers
