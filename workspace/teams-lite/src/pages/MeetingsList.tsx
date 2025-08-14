import { Card, CardContent, Stack, Typography, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../store/useAppStore';

export default function MeetingsList() {
  const { meetings, startMeetingNow, currentUserId } = useAppStore();
  const navigate = useNavigate();
  const list = Object.values(meetings);

  return (
    <Stack spacing={2}>
      <Stack direction="row" spacing={1}>
        <Button variant="contained" onClick={() => {
          const id = startMeetingNow('Quick Sync', currentUserId, [currentUserId]);
          navigate(`/meet/${id}`);
        }}>Start Quick Meeting</Button>
      </Stack>

      {list.map((m) => (
        <Card key={m.id}>
          <CardContent>
            <Typography variant="subtitle1">{m.title}</Typography>
            <Typography variant="body2" color="text.secondary">{new Date(m.start).toLocaleString()} - {new Date(m.end).toLocaleString()}</Typography>
            <Typography variant="body2" color="text.secondary">Status: {m.status}</Typography>
            <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
              <Button variant="contained" onClick={() => navigate(`/meet/${m.id}`)}>Open</Button>
            </Stack>
          </CardContent>
        </Card>
      ))}
    </Stack>
  );
}