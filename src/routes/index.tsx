import { createFileRoute } from '@tanstack/react-router';
import React, { useState } from 'react';

function getDaysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate();
}

type EventType = { time: string; text: string };
type EventsMap = { [key: string]: Array<EventType> };

interface CalendarViewProps {
  currentYear: number;
  currentMonth: number;
  events: EventsMap;
  setSelectedDay: (day: number) => void;
  selectedDay: number | null;
  monthNames: Array<string>;
  daysInMonth: number;
}

interface WeekViewProps extends CalendarViewProps {
  selectedWeek: number;
  setSelectedWeek: (week: number) => void;
}

function CalendarPage() {
  const today = new Date();
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [events, setEvents] = useState<EventsMap>({});
  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  const [eventText, setEventText] = useState("");
  const [eventTime, setEventTime] = useState("");
  const [view, setView] = useState<'month' | 'week' | 'day' | 'list'>('week');
  const [selectedWeek, setSelectedWeek] = useState<number>(Math.floor((today.getDate() + today.getDay()) / 7));

  const daysInMonth = getDaysInMonth(currentYear, currentMonth);
  const monthNames = [...Array(12).keys()].map(key => new Date(0, key).toLocaleString('en', { month: 'long' }));

  function prevMonth() {
    setCurrentMonth(m => {
      console.log('testing');

      if (m === 0) {
        setCurrentYear(y => y - 1);
        return 11;
      }
      return m - 1;
    });
    setSelectedDay(null);
  }

  function nextMonth() {
    setCurrentMonth(m => {
      if (m === 11) {
        setCurrentYear(y => y + 1);
        return 0;
      }
      return m + 1;
    });
    setSelectedDay(null);
  }

  function handleAddEvent(e: React.FormEvent) {
    e.preventDefault();
    if (selectedDay && eventText.trim()) {
      const key = `${currentYear}-${currentMonth + 1}-${selectedDay}`;
      setEvents(prev => ({
        ...prev,
        [key]: [...prev[key] ?? [], { time: eventTime, text: eventText }],
      }));
      setEventText("");
      setEventTime("");
    }
  }

  return (
    <div className="max-w-xl mx-auto mt-10 p-6 bg-white rounded shadow">
      <h1 className="text-2xl font-bold mb-4 text-center">Agenda</h1>
      <div className="flex justify-between items-center mb-4">
        <button onClick={prevMonth} className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300">Prev</button>
        <span className="text-lg font-semibold">{monthNames[currentMonth]} {currentYear}</span>
        <button onClick={nextMonth} className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300">Next</button>
      </div>
      <div className="mb-4 flex gap-2 justify-center">
        <button onClick={() => setView('month')} className={`px-2 py-1 rounded ${view === 'month' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}>Month</button>
        <button onClick={() => setView('week')} className={`px-2 py-1 rounded ${view === 'week' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}>Week</button>
        <button onClick={() => setView('day')} className={`px-2 py-1 rounded ${view === 'day' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}>Day</button>
        <button onClick={() => setView('list')} className={`px-2 py-1 rounded ${view === 'list' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}>List</button>
      </div>
      {/* Conditional rendering for views */}
      {view === 'month' && (
        <MonthView
          currentYear={currentYear}
          currentMonth={currentMonth}
          events={events}
          setSelectedDay={setSelectedDay}
          selectedDay={selectedDay}
          monthNames={monthNames}
          daysInMonth={daysInMonth}
        />
      )}
      {view === 'week' && (
        <WeekView
          currentYear={currentYear}
          currentMonth={currentMonth}
          events={events}
          setSelectedDay={setSelectedDay}
          selectedDay={selectedDay}
          monthNames={monthNames}
          selectedWeek={selectedWeek}
          setSelectedWeek={setSelectedWeek}
          daysInMonth={daysInMonth}
        />
      )}
      {view === 'day' && (
        <DayView
          currentYear={currentYear}
          currentMonth={currentMonth}
          events={events}
          setSelectedDay={setSelectedDay}
          selectedDay={selectedDay}
          monthNames={monthNames}
          daysInMonth={daysInMonth}
        />
      )}
      {view === 'list' && (
        <ListView
          currentYear={currentYear}
          currentMonth={currentMonth}
          events={events}
          setSelectedDay={setSelectedDay}
          selectedDay={selectedDay}
          monthNames={monthNames}
          daysInMonth={daysInMonth}
        />
      )}
      {/* Event form stays for all views if a day is selected */}
      {selectedDay && (
        <form onSubmit={handleAddEvent} className="mb-4 p-4 bg-gray-50 rounded border">
          <h3 className="font-semibold mb-2">Add Event for {selectedDay} {monthNames[currentMonth]}</h3>
          <div className="mb-2">
            <input
              type="time"
              value={eventTime}
              onChange={e => setEventTime(e.target.value)}
              className="border rounded px-2 py-1 mr-2"
              required
            />
            <input
              type="text"
              value={eventText}
              onChange={e => setEventText(e.target.value)}
              className="border rounded px-2 py-1"
              placeholder="Event description"
              required
            />
            <button type="submit" className="ml-2 px-2 py-1 bg-blue-500 text-white rounded">Add</button>
          </div>
        </form>
      )}
    </div>
  );
}

function MonthView({ currentYear, currentMonth, events, setSelectedDay, selectedDay, monthNames, daysInMonth }: CalendarViewProps) {
  const firstDay = new Date(currentYear, currentMonth, 1).getDay();
  const weeks = [];
  let day = 1;
  for (let w = 0; day <= daysInMonth; w++) {
    const week = [];
    for (let d = 0; d < 7; d++) {
      if ((w === 0 && d < firstDay) || day > daysInMonth) {
        week.push(null);
      } else {
        week.push(day++);
      }
    }
    weeks.push(week);
  }
  return (
    <div>
      <table className="w-full mb-4">
        <thead>
          <tr>
            {['Sun','Mon','Tue','Wed','Thu','Fri','Sat'].map(d => <th key={d} className="p-1 text-xs">{d}</th>)}
          </tr>
        </thead>
        <tbody>
          {weeks.map((week, i) => (
            <tr key={i}>
              {week.map((day, j) => (
                <td key={j} className={`h-12 w-12 text-center border ${selectedDay === day ? 'bg-blue-100' : ''}`}>
                  {day && (
                    <button className="w-full h-full" onClick={() => setSelectedDay(day)}>{day}</button>
                  )}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      {selectedDay && (
        <ul>
          {(events[`${currentYear}-${currentMonth + 1}-${selectedDay}`] ?? []).map((event: EventType, idx: number) => (
            <li key={idx} className="text-gray-700">
              <span className="font-mono text-xs text-gray-500">{event.time}</span> {event.text}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function WeekView({ currentYear, currentMonth, events, setSelectedDay, selectedDay, monthNames, daysInMonth, selectedWeek, setSelectedWeek }: WeekViewProps) {
  const firstDay = new Date(currentYear, currentMonth, 1).getDay();
  const weeks = [];
  let day = 1;
  for (let w = 0; day <= daysInMonth; w++) {
    const week = [];
    for (let d = 0; d < 7; d++) {
      if ((w === 0 && d < firstDay) || day > daysInMonth) {
        week.push(null);
      } else {
        week.push(day++);
      }
    }
    weeks.push(week);
  }
  const weekDays = weeks[selectedWeek] || [];
  return (
    <div>
      <div className="mb-2 flex gap-2">
        {weeks.map((_, i) => (
          <button key={i} className={`px-2 py-1 rounded ${selectedWeek === i ? 'bg-blue-500 text-white' : 'bg-gray-200'}`} onClick={() => setSelectedWeek(i)}>
            Week {i + 1}
          </button>
        ))}
      </div>
      <ul>
        {weekDays.map((day, i) => day && (
          <li key={i} className={`mb-2 p-2 rounded border ${selectedDay === day ? 'bg-blue-100' : ''}`}>
            <button className="font-bold mr-2 text-blue-700 hover:underline" onClick={() => setSelectedDay(day)}>
              {day} {monthNames[currentMonth]}
            </button>
            <ul className="ml-4">
              {(events[`${currentYear}-${currentMonth + 1}-${day}`] ?? []).map((event: EventType, idx: number) => (
                <li key={idx} className="text-gray-700">
                  <span className="font-mono text-xs text-gray-500">{event.time}</span> {event.text}
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
    </div>
  );
}

function DayView({ currentYear, currentMonth, events, setSelectedDay, selectedDay, monthNames, daysInMonth }: CalendarViewProps) {
  return (
    <div>
      <div className="mb-2 flex gap-2 flex-wrap">
        {Array.from({ length: daysInMonth }, (_, i) => i + 1).map(day => (
          <button key={day} className={`px-2 py-1 rounded ${selectedDay === day ? 'bg-blue-500 text-white' : 'bg-gray-200'}`} onClick={() => setSelectedDay(day)}>
            {day}
          </button>
        ))}
      </div>
      {selectedDay && (
        <ul>
          {(events[`${currentYear}-${currentMonth + 1}-${selectedDay}`] ?? []).map((event: EventType, idx: number) => (
            <li key={idx} className="text-gray-700">
              <span className="font-mono text-xs text-gray-500">{event.time}</span> {event.text}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function ListView({ currentYear, currentMonth, events, setSelectedDay, selectedDay, monthNames, daysInMonth }: CalendarViewProps) {
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

export const Route = createFileRoute('/')({
  component: CalendarPage,
});
