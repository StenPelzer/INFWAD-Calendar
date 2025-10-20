import type { CalendarViewProps, EventType } from '../types/CalendarTypes';

export default function ListView({ currentYear, currentMonth, events, setSelectedDay, selectedDay, monthNames, daysInMonth }: CalendarViewProps) {
  return (
    <div>
      <h2 className="text-lg font-semibold mb-2">Days</h2>
      <ul>
        {Array.from({ length: daysInMonth }, (_, i) => i + 1).map(day => {
          const key = `${currentYear}-${currentMonth + 1}-${day}`;
          return (
            <li key={day} className={`mb-2 p-2 rounded border ${selectedDay === day ? 'bg-blue-100' : ''}`}>
              <button
                className="font-bold mr-2 text-blue-700 hover:underline"
                onClick={() => setSelectedDay(day)}
              >
                {day} {monthNames[currentMonth]}
              </button>
              <ul className="ml-4">
                {(events[key] ?? []).map((event: EventType, idx: number) => (
                  <li key={idx} className="text-gray-700">
                    <span className="font-mono text-xs text-gray-500">{event.time}</span> {event.text}
                  </li>
                ))}
              </ul>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
