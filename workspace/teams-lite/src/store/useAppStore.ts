import { create } from 'zustand';
import { v4 as uuidv4 } from 'uuid';
import { addMinutes, formatISO, isBefore } from 'date-fns';
import type { CalendarEvent, Channel, DirectMessageChannel, GroupChannel, Id, Invitation, InvitationStatus, Meeting, Message, Topic, User } from '../types';

interface AppState {
  currentUserId: Id;
  users: Record<Id, User>;
  dms: Record<Id, DirectMessageChannel>;
  groups: Record<Id, GroupChannel>;
  topics: Record<Id, Topic>;
  messagesByChannel: Record<Id, Message[]>;
  invitations: Record<Id, Invitation>;
  meetings: Record<Id, Meeting>;
  calendarEvents: Record<Id, CalendarEvent>;

  // derived helpers
  getChannelMessages: (channelId: Id) => Message[];
  getChannelById: (channelId: Id) => Channel | undefined;

  // actions
  sendMessage: (channelId: Id, senderUserId: Id, body: string) => void;
  createGroup: (name: string, memberUserIds: Id[]) => Id;
  createTopic: (groupId: Id, name: string) => Id;
  inviteUserToGroup: (fromUserId: Id, toUserId: Id, groupId: Id) => Id;
  respondToInvitation: (invitationId: Id, status: InvitationStatus) => void;
  scheduleMeeting: (title: string, organizerUserId: Id, participantUserIds: Id[], start: Date, durationMinutes: number, channelId?: Id) => Id;
  startMeetingNow: (title: string, organizerUserId: Id, participantUserIds: Id[], channelId?: Id) => Id;
  endMeeting: (meetingId: Id) => void;
}

function createDummyUsers(): Record<Id, User> {
  const colors = ['#F44336', '#E91E63', '#9C27B0', '#3F51B5', '#009688', '#4CAF50', '#FF9800', '#795548'];
  const names = [
    { name: 'Ava Brooks', email: 'ava@example.com' },
    { name: 'Leo Carter', email: 'leo@example.com' },
    { name: 'Mia Diaz', email: 'mia@example.com' },
    { name: 'Noah Evans', email: 'noah@example.com' },
    { name: 'Ivy Flores', email: 'ivy@example.com' },
    { name: 'Liam Green', email: 'liam@example.com' },
    { name: 'Emma Hall', email: 'emma@example.com' },
    { name: 'Owen Irwin', email: 'owen@example.com' },
  ];
  const users: Record<Id, User> = {};
  names.forEach((n, idx) => {
    const id = uuidv4();
    users[id] = { id, displayName: n.name, email: n.email, avatarColor: colors[idx % colors.length] };
  });
  return users;
}

function pickIds<T>(rec: Record<Id, T>, count: number): Id[] {
  const ids = Object.keys(rec);
  return ids.slice(0, count);
}

export const useAppStore = create<AppState>((set, get) => {
  // Dummy initial data
  const users = createDummyUsers();
  const allUserIds = Object.keys(users);
  const currentUserId = allUserIds[0];

  // Create two DM channels
  const dm1Id = uuidv4();
  const dm2Id = uuidv4();
  const dms: Record<Id, DirectMessageChannel> = {
    [dm1Id]: { id: dm1Id, type: 'dm', participantUserIds: [currentUserId, allUserIds[1]], topic: 'Project Sync' },
    [dm2Id]: { id: dm2Id, type: 'dm', participantUserIds: [currentUserId, allUserIds[2]] },
  };

  // Groups and topics
  const group1Id = uuidv4();
  const group2Id = uuidv4();
  const topic1Id = uuidv4();
  const topic2Id = uuidv4();
  const groups: Record<Id, GroupChannel> = {
    [group1Id]: { id: group1Id, type: 'group', name: 'Design Team', topicIds: [topic1Id], memberUserIds: pickIds(users, 4) },
    [group2Id]: { id: group2Id, type: 'group', name: 'Engineering', topicIds: [topic2Id], memberUserIds: pickIds(users, 5) },
  };
  const topics: Record<Id, Topic> = {
    [topic1Id]: { id: topic1Id, type: 'topic', groupId: group1Id, name: 'UI Review' },
    [topic2Id]: { id: topic2Id, type: 'topic', groupId: group2Id, name: 'Sprint Planning' },
  };

  const messagesByChannel: Record<Id, Message[]> = {};
  const seedMessages = (channelId: Id, senderIds: Id[], text: string[]) => {
    messagesByChannel[channelId] = text.map((body, idx) => ({
      id: uuidv4(),
      channelId,
      senderUserId: senderIds[idx % senderIds.length],
      body,
      createdAt: formatISO(new Date(Date.now() - (text.length - idx) * 60000)),
    }));
  };
  seedMessages(dm1Id, [currentUserId, allUserIds[1]], [
    'Hey, how is the prototype going?',
    'Looking good! Need feedback on colors.',
    'Let’s review at 2pm.',
  ]);
  seedMessages(topic1Id, groups[group1Id].memberUserIds.slice(0, 3), [
    'Welcome to UI Review',
    'Posting latest Figma link.',
    'Please add comments.',
  ]);

  // Invitations
  const inv1Id = uuidv4();
  const invitations: Record<Id, Invitation> = {
    [inv1Id]: {
      id: inv1Id,
      fromUserId: allUserIds[1],
      toUserId: currentUserId,
      groupId: group2Id,
      createdAt: formatISO(new Date()),
      status: 'pending',
    },
  };

  // Meetings and calendar
  const meeting1Id = uuidv4();
  const now = new Date();
  const meeting1: Meeting = {
    id: meeting1Id,
    title: 'Daily Standup',
    organizerUserId: currentUserId,
    participantUserIds: groups[group2Id].memberUserIds.slice(0, 4),
    channelId: topic2Id,
    start: formatISO(addMinutes(now, 60)),
    end: formatISO(addMinutes(now, 90)),
    status: 'scheduled',
  };
  const calendarEvents: Record<Id, CalendarEvent> = {
    [meeting1Id]: { id: meeting1Id, title: meeting1.title, start: meeting1.start, end: meeting1.end, meetingId: meeting1Id },
  };

  const meetings: Record<Id, Meeting> = { [meeting1Id]: meeting1 };

  return {
    currentUserId,
    users,
    dms,
    groups,
    topics,
    messagesByChannel,
    invitations,
    meetings,
    calendarEvents,

    getChannelMessages: (channelId: Id) => get().messagesByChannel[channelId] ?? [],
    getChannelById: (channelId: Id): Channel | undefined => {
      const { dms, groups, topics } = get();
      return dms[channelId] || groups[channelId] || topics[channelId];
    },

    sendMessage: (channelId: Id, senderUserId: Id, body: string) => set((state) => {
      const newMsg: Message = {
        id: uuidv4(),
        channelId,
        senderUserId,
        body,
        createdAt: formatISO(new Date()),
      };
      const prev = state.messagesByChannel[channelId] ?? [];
      return {
        messagesByChannel: { ...state.messagesByChannel, [channelId]: [...prev, newMsg] },
      };
    }),

    createGroup: (name: string, memberUserIds: Id[]) => {
      const id = uuidv4();
      set((state) => {
        const group: GroupChannel = { id, type: 'group', name, topicIds: [], memberUserIds };
        return { groups: { ...state.groups, [id]: group } };
      });
      return id;
    },

    createTopic: (groupId: Id, name: string) => {
      const id = uuidv4();
      set((state) => {
        const topic: Topic = { id, type: 'topic', groupId, name };
        const group = state.groups[groupId];
        if (!group) return {} as any;
        const updatedGroup: GroupChannel = { ...group, topicIds: [...group.topicIds, id] };
        return {
          topics: { ...state.topics, [id]: topic },
          groups: { ...state.groups, [groupId]: updatedGroup },
        };
      });
      return id;
    },

    inviteUserToGroup: (fromUserId: Id, toUserId: Id, groupId: Id) => {
      const id = uuidv4();
      set((state) => {
        const inv: Invitation = {
          id,
          fromUserId,
          toUserId,
          groupId,
          createdAt: formatISO(new Date()),
          status: 'pending',
        };
        return { invitations: { ...state.invitations, [id]: inv } };
      });
      return id;
    },

    respondToInvitation: (invitationId: Id, status: InvitationStatus) => set((state) => {
      const inv = state.invitations[invitationId];
      if (!inv) return {} as any;
      const updated: Invitation = { ...inv, status };
      const updates: Partial<AppState> = { invitations: { ...state.invitations, [invitationId]: updated } };
      if (status === 'accepted' && inv.groupId) {
        const group = state.groups[inv.groupId];
        if (group && !group.memberUserIds.includes(inv.toUserId)) {
          updates.groups = { ...state.groups, [inv.groupId]: { ...group, memberUserIds: [...group.memberUserIds, inv.toUserId] } } as any;
        }
      }
      return updates as any;
    }),

    scheduleMeeting: (title, organizerUserId, participantUserIds, start, durationMinutes, channelId) => {
      const id = uuidv4();
      const end = addMinutes(start, durationMinutes);
      set((state) => {
        const meeting: Meeting = {
          id,
          title,
          organizerUserId,
          participantUserIds,
          channelId,
          start: formatISO(start),
          end: formatISO(end),
          status: isBefore(start, new Date()) ? 'live' : 'scheduled',
        };
        const evt: CalendarEvent = { id, title, start: meeting.start, end: meeting.end, meetingId: id };
        return {
          meetings: { ...state.meetings, [id]: meeting },
          calendarEvents: { ...state.calendarEvents, [id]: evt },
        };
      });
      return id;
    },

    startMeetingNow: (title, organizerUserId, participantUserIds, channelId) => {
      const id = uuidv4();
      const start = new Date();
      const end = addMinutes(start, 60);
      set((state) => {
        const meeting: Meeting = {
          id,
          title,
          organizerUserId,
          participantUserIds,
          channelId,
          start: formatISO(start),
          end: formatISO(end),
          status: 'live',
        };
        const evt: CalendarEvent = { id, title, start: meeting.start, end: meeting.end, meetingId: id };
        return {
          meetings: { ...state.meetings, [id]: meeting },
          calendarEvents: { ...state.calendarEvents, [id]: evt },
        };
      });
      return id;
    },

    endMeeting: (meetingId: Id) => set((state) => {
      const m = state.meetings[meetingId];
      if (!m) return {} as any;
      return { meetings: { ...state.meetings, [meetingId]: { ...m, status: 'ended' } } };
    }),
  };
});