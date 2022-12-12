export type Player = {
  id: string;
  teamId: string;
  name: string;
  number: number;
  goals: number;
  sevenMeters: {
    goals: number;
    attempts: number;
  };
  penalties: number;
  yellowCards: number;
  redCards: number;
};
