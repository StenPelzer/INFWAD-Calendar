
import { createFileRoute } from '@tanstack/react-router';
import Calendar from '../features/calendar/components/Calendar';

export const Route = createFileRoute('/')({
  component: Calendar,
});
