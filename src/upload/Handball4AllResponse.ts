export type Handball4AllResponse = {
  content: {
    futureGames: {
      games: {
        gNo: string;
        sGID: string;
        gHomeGoals: string;
        gGuestGoals: string;
      }[];
    };
  };
};
