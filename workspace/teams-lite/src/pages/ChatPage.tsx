import { useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Box, Button, Card, CardContent, Stack, TextField, Typography } from '@mui/material';
import { useAppStore } from '../store/useAppStore';
import type { Channel, DirectMessageChannel, GroupChannel, Topic } from '../types';

function isDM(ch: Channel): ch is DirectMessageChannel {
  return (ch as any).type === 'dm';
}
function isGroup(ch: Channel): ch is GroupChannel {
  return (ch as any).type === 'group';
}
function isTopic(ch: Channel): ch is Topic {
  return (ch as any).type === 'topic';
}

export default function ChatPage() {
  const { channelId } = useParams();
  const navigate = useNavigate();
  const { getChannelMessages, getChannelById, users, currentUserId, sendMessage, startMeetingNow } = useAppStore();
  const [text, setText] = useState('');

  const channel = useMemo(() => channelId ? getChannelById(channelId) : undefined, [channelId, getChannelById]);
  const messages = useMemo(() => (channelId ? getChannelMessages(channelId) : []), [channelId, getChannelMessages]);

  const channelTitle = useMemo(() => {
    if (!channel) return 'Channel';
    if (isDM(channel)) {
      const otherId = channel.participantUserIds.find((id: string) => id !== currentUserId) ?? channel.participantUserIds[0];
      return users[otherId]?.displayName ?? 'Direct Message';
    }
    if (isGroup(channel)) return channel.name;
    if (isTopic(channel)) return channel.name;
    return 'Channel';
  }, [channel, users, currentUserId]);

  const participants: string[] = useMemo(() => {
    if (!channel) return [];
    if (isDM(channel)) return channel.participantUserIds;
    if (isGroup(channel)) return channel.memberUserIds;
    if (isTopic(channel)) {
      const group = useAppStore.getState().groups[channel.groupId];
      return group?.memberUserIds ?? [];
    }
    return [];
  }, [channel]);

  const onSend = () => {
    if (!text.trim() || !channelId) return;
    sendMessage(channelId, currentUserId, text.trim());
    setText('');
  };

  const onStartMeeting = () => {
    if (!channel) return;
    const meetingId = startMeetingNow(`Meeting: ${channelTitle}`, currentUserId, participants, (channel as any).id);
    navigate(`/meet/${meetingId}`);
  };

  if (!channelId || !channel) {
    return <Typography variant="h6">Select a channel to start chatting.</Typography>;
  }

  return (
    <Stack spacing={2}>
      <Stack direction="row" alignItems="center" spacing={2}>
        <Typography variant="h5" sx={{ flexGrow: 1 }}>{channelTitle}</Typography>
        <Button variant="contained" onClick={onStartMeeting}>Start Instant Meeting</Button>
      </Stack>

      <Card>
        <CardContent>
          <Stack spacing={1}>
            {messages.map((m) => (
              <Box key={m.id}>
                <Typography variant="caption" color="text.secondary">
                  {users[m.senderUserId]?.displayName} • {new Date(m.createdAt).toLocaleTimeString()}
                </Typography>
                <Typography>{m.body}</Typography>
              </Box>
            ))}
          </Stack>
        </CardContent>
      </Card>

      <Stack direction="row" spacing={1}>
        <TextField fullWidth placeholder="Type a message" value={text} onChange={(e) => setText(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter') onSend(); }} />
        <Button variant="contained" onClick={onSend}>Send</Button>
      </Stack>
    </Stack>
  );
}