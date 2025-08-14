import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Button, Checkbox, FormControlLabel, Stack, TextField, Typography } from '@mui/material';
import { useAppStore } from '../store/useAppStore';

export default function CreateGroupPage() {
  const { users, currentUserId, createGroup } = useAppStore();
  const [name, setName] = useState('');
  const [selected, setSelected] = useState<Record<string, boolean>>({ [currentUserId]: true });
  const navigate = useNavigate();

  const toggle = (id: string) => setSelected((s) => ({ ...s, [id]: !s[id] }));

  const onCreate = () => {
    const memberIds = Object.keys(selected).filter((id) => selected[id]);
    if (!name.trim() || memberIds.length < 1) return;
    const id = createGroup(name.trim(), memberIds);
    navigate(`/chat/${id}`);
  };

  return (
    <Stack spacing={2}>
      <Typography variant="h5">Create Group</Typography>
      <TextField label="Group Name" value={name} onChange={(e) => setName(e.target.value)} />
      <Box>
        <Typography variant="subtitle1" sx={{ mb: 1 }}>Members</Typography>
        <Stack>
          {Object.values(users).map((u) => (
            <FormControlLabel key={u.id} control={<Checkbox checked={!!selected[u.id]} onChange={() => toggle(u.id)} />} label={`${u.displayName} (${u.email})`} />
          ))}
        </Stack>
      </Box>
      <Button variant="contained" onClick={onCreate}>Create</Button>
    </Stack>
  );
}