import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button, Stack, TextField, Typography } from '@mui/material';
import { useAppStore } from '../store/useAppStore';

export default function CreateTopicPage() {
  const { groupId } = useParams();
  const { createTopic } = useAppStore();
  const [name, setName] = useState('');
  const navigate = useNavigate();

  const onCreate = () => {
    if (!groupId || !name.trim()) return;
    const id = createTopic(groupId, name.trim());
    navigate(`/chat/${id}`);
  };

  return (
    <Stack spacing={2}>
      <Typography variant="h5">Create Topic</Typography>
      <TextField label="Topic Name" value={name} onChange={(e) => setName(e.target.value)} />
      <Button variant="contained" onClick={onCreate}>Create</Button>
    </Stack>
  );
}