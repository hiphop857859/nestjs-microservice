export interface IstatisticsEarn {
  user: string;
  days: number;
}

export interface IstatisticsPlaytime {
  user: string;
  days: number;
}

export interface IDeleteHistoryPlay {
  quizzId: string;
  eventId?: string;
}

export interface IUserInformation {
  id: string;
  email?: string;
  orgId?: string;
}
