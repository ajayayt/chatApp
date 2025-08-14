import { useMemo, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Box, Button, Stack, Typography } from '@mui/material';
import Webcam from 'react-webcam';
import { useAppStore } from '../store/useAppStore';

export default function MeetingRoom() {
  const { meetingId } = useParams();
  const navigate = useNavigate();
  const { meetings, users, currentUserId, endMeeting } = useAppStore();
  const meeting = meetingId ? meetings[meetingId] : undefined;

  const webcamRef = useRef<Webcam>(null);
  const [cameraOn, setCameraOn] = useState(true);
  const [micOn, setMicOn] = useState(true);

  const participants = useMemo(() => (meeting ? meeting.participantUserIds : []), [meeting]);

  if (!meeting) return <Typography>Meeting not found.</Typography>;

  return (
    <Stack spacing={2}>
      <Stack direction="row" alignItems="center" spacing={2}>
        <Typography variant="h5" sx={{ flexGrow: 1 }}>{meeting.title} {meeting.status === 'live' ? '(Live)' : ''}</Typography>
        <Button variant="outlined" onClick={() => setMicOn((m) => !m)}>{micOn ? 'Mute' : 'Unmute'}</Button>
        <Button variant="outlined" onClick={() => setCameraOn((c) => !c)}>{cameraOn ? 'Camera Off' : 'Camera On'}</Button>
        <Button color="error" variant="contained" onClick={() => { endMeeting(meeting.id); navigate('/meetings'); }}>Leave</Button>
      </Stack>

      <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 2 }}>
        {participants.map((uid) => (
          <Box key={uid} sx={{ position: 'relative', aspectRatio: '16/9', bgcolor: '#111', borderRadius: 1, overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {uid === currentUserId && cameraOn ? (
              <Webcam ref={webcamRef} audio={micOn} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            ) : (
              <Typography variant="h6" color="#fff">{users[uid]?.displayName ?? 'Participant'}</Typography>
            )}
          </Box>
        ))}
      </Box>
    </Stack>
  );
}