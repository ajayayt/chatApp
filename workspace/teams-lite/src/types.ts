export type Id = string;

export interface User {
  id: Id;
  displayName: string;
  email: string;
  avatarColor: string; // hex color for placeholder avatar
}

export interface DirectMessageChannel {
  id: Id;
  type: 'dm';
  participantUserIds: Id[]; // exactly 2 for simplicity
  topic?: string;
}

export interface GroupChannel {
  id: Id;
  type: 'group';
  name: string;
  topicIds: Id[]; // child topics
  memberUserIds: Id[];
}

export interface Topic {
  id: Id;
  type: 'topic';
  groupId: Id;
  name: string;
}

export type Channel = DirectMessageChannel | GroupChannel | Topic;

export interface Message {
  id: Id;
  channelId: Id; // dm, group, or topic id
  senderUserId: Id;
  body: string;
  createdAt: string; // ISO
}

export type InvitationStatus = 'pending' | 'accepted' | 'declined';

export interface Invitation {
  id: Id;
  fromUserId: Id;
  toUserId: Id;
  groupId?: Id; // invite to group
  createdAt: string;
  status: InvitationStatus;
}

export type MeetingStatus = 'scheduled' | 'live' | 'ended';

export interface Meeting {
  id: Id;
  title: string;
  organizerUserId: Id;
  participantUserIds: Id[];
  channelId?: Id; // optional source channel
  start: string; // ISO
  end: string; // ISO
  status: MeetingStatus;
}

export interface CalendarEvent {
  id: Id;
  title: string;
  start: string; // ISO
  end: string; // ISO
  meetingId?: Id;
}