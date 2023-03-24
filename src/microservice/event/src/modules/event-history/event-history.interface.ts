export interface IEventHistoryInput {
  endAt: Date;
  playUserId: string;
  results: IEventHistoryResult;
  quizzId: string;
}

export interface IEventHistoryResult {
  questionId: string;
  answerIds: [string];
  createdAt: Date;
  reward: object;
  isCorrectAnswer: boolean;
}

export interface IStatisticsCategory {
  id: string;
}
