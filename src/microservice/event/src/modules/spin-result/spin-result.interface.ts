export interface IBonus {
  HOP: number;
  LEAP: number;
  TURN: number;
}

export interface IGift {
  _id: string;
  type: string;
  bonus: IBonus;
}
export interface IUser {
  id: string;
  email: string;
  type: string;
}

