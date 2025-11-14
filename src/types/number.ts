export type NumberStatus = "aquecendo" | "pausado" | "pronto" | "banido";

export type InteractionType =
  | "message_sent"
  | "message_received"
  | "group_joined"
  | "block_alert"
  | "manual_interaction"
  | "profile_update";

export interface PhoneNumber {
  id: string;
  number: string;
  displayName: string;
  profilePhoto?: string;
  company: string;
  status: NumberStatus;
  operator?: string;
  heatingStartDate?: Date;
  lastActivity?: Date;
  progressPercent: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface HeatingPlan {
  id: string;
  numberId: string;
  dailyMessageLimit: number;
  weeklyMessageLimit: number;
  messageTypes: ("text" | "audio" | "image" | "video")[];
  interactionRequirements: {
    responseRate?: number;
    groupJoins?: number;
    manualInteractions?: number;
  };
  createdAt: Date;
  updatedAt: Date;
}

export interface Interaction {
  id: string;
  numberId: string;
  type: InteractionType;
  description: string;
  metadata?: {
    messageCount?: number;
    responseCount?: number;
    groupName?: string;
    blockReason?: string;
  };
  timestamp: Date;
  createdBy?: string;
}

export interface NumberHealth {
  numberId: string;
  responseRate: number;
  blockRate: number;
  averageMessagesPerDay: number;
  formatDiversity: {
    text: number;
    audio: number;
    image: number;
    video: number;
  };
  lastCalculated: Date;
}

export interface NumberDetails extends PhoneNumber {
  heatingPlan?: HeatingPlan;
  health?: NumberHealth;
  interactions: Interaction[];
}

export interface CreateNumberInput {
  number: string;
  displayName: string;
  company: string;
  operator?: string;
  profilePhoto?: string;
}

export interface UpdateNumberInput {
  displayName?: string;
  profilePhoto?: string;
  status?: NumberStatus;
}
