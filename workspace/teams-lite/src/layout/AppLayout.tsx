import { useMemo } from 'react';
import type { PropsWithChildren } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { AppBar, Box, Button, Divider, Drawer, IconButton, List, ListItem, ListItemButton, ListItemText, Toolbar, Typography } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EventIcon from '@mui/icons-material/Event';
import VideoCallIcon from '@mui/icons-material/VideoCall';
import MailIcon from '@mui/icons-material/Mail';
import { useAppStore } from '../store/useAppStore';

const drawerWidth = 300;

export default function AppLayout({ children }: PropsWithChildren) {
  const navigate = useNavigate();
  const { dms, groups, topics, users, currentUserId } = useAppStore();

  const dmItems = useMemo(() => Object.values(dms), [dms]);
  const groupItems = useMemo(() => Object.values(groups), [groups]);

  return (
    <Box sx={{ display: 'flex' }}>
      <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>Teams Lite</Typography>
          <Typography variant="body2" sx={{ mr: 2 }}>Signed in as {users[currentUserId]?.displayName}</Typography>
          <Button color="inherit" component={RouterLink} to="/calendar" startIcon={<EventIcon />}>Calendar</Button>
          <Button color="inherit" component={RouterLink} to="/meetings" startIcon={<VideoCallIcon />}>Meetings</Button>
          <Button color="inherit" component={RouterLink} to="/invitations" startIcon={<MailIcon />}>Invitations</Button>
        </Toolbar>
      </AppBar>

      <Drawer variant="permanent" sx={{ width: drawerWidth, [`& .MuiDrawer-paper`]: { width: drawerWidth, boxSizing: 'border-box' } }}>
        <Toolbar />
        <Box sx={{ overflow: 'auto' }}>
          <List subheader={<Typography sx={{ px: 2, py: 1 }} variant="overline">Direct Messages</Typography>}>
            {dmItems.map((dm) => {
              const otherId = dm.participantUserIds.find((id) => id !== currentUserId) ?? dm.participantUserIds[0];
              const other = users[otherId];
              return (
                <ListItem key={dm.id} disablePadding>
                  <ListItemButton component={RouterLink} to={`/chat/${dm.id}`}>
                    <ListItemText primary={other?.displayName ?? 'Unknown'} secondary={dm.topic ?? 'Direct chat'} />
                  </ListItemButton>
                </ListItem>
              );
            })}
          </List>

          <Divider />

          <List subheader={<Typography sx={{ px: 2, py: 1 }} variant="overline">Groups</Typography>}>
            {groupItems.map((g) => (
              <Box key={g.id}>
                <ListItem disableGutters secondaryAction={
                  <IconButton edge="end" aria-label="add-topic" onClick={() => navigate(`/groups/${g.id}/new-topic`)}>
                    <AddIcon />
                  </IconButton>
                }>
                  <ListItemButton component={RouterLink} to={`/chat/${g.id}`}>
                    <ListItemText primary={g.name} secondary={`${g.memberUserIds.length} members`} />
                  </ListItemButton>
                </ListItem>
                {g.topicIds.map((tid) => (
                  <ListItem key={tid} sx={{ pl: 4 }} disablePadding>
                    <ListItemButton component={RouterLink} to={`/chat/${tid}`}>
                      <ListItemText primary={topics[tid]?.name ?? 'Topic'} />
                    </ListItemButton>
                  </ListItem>
                ))}
              </Box>
            ))}
            <ListItem>
              <Button fullWidth variant="outlined" startIcon={<AddIcon />} onClick={() => navigate('/groups/new')}>
                Create Group
              </Button>
            </ListItem>
          </List>
        </Box>
      </Drawer>

      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <Toolbar />
        {children}
      </Box>
    </Box>
  );
}