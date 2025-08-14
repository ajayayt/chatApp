import { Stack, Card, CardContent, Typography, Button } from '@mui/material';
import { useAppStore } from '../store/useAppStore';

export default function InvitationsPage() {
  const { invitations, users, respondToInvitation } = useAppStore();
  const list = Object.values(invitations);

  if (!list.length) return <Typography>No invitations.</Typography>;

  return (
    <Stack spacing={2}>
      {list.map((inv) => (
        <Card key={inv.id}>
          <CardContent>
            <Typography variant="subtitle1">From: {users[inv.fromUserId]?.displayName}</Typography>
            <Typography variant="body2" color="text.secondary">Status: {inv.status}</Typography>
            <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
              <Button variant="contained" disabled={inv.status !== 'pending'} onClick={() => respondToInvitation(inv.id, 'accepted')}>Accept</Button>
              <Button variant="outlined" disabled={inv.status !== 'pending'} onClick={() => respondToInvitation(inv.id, 'declined')}>Decline</Button>
            </Stack>
          </CardContent>
        </Card>
      ))}
    </Stack>
  );
}