import { useMemo } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import { Box, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../store/useAppStore';

export default function CalendarPage() {
  const { calendarEvents } = useAppStore();
  const navigate = useNavigate();
  const events = useMemo(() => Object.values(calendarEvents).map((e) => ({ id: e.id, title: e.title, start: e.start, end: e.end })), [calendarEvents]);

  return (
    <Box>
      <Typography variant="h5" sx={{ mb: 2 }}>Calendar</Typography>
      <FullCalendar
        plugins={[dayGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        events={events}
        eventClick={(info) => navigate(`/meet/${info.event.id}`)}
        height="auto"
      />
    </Box>
  );
}