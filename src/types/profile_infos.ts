interface ProfileInfo {
  playerInfo: PlayerInfo;
  battleStats: BattleStats;
  mostPlayedChampions: Array<MostPlayedChampions>;
}

interface PlayerInfo {
  name: string;
  tag: string;
  level: string;
  rank: Rank;
}

interface Item {
  iconUrl: string;
}

interface RecentMatchs {
  championsIconUrl: string;
  kill: number;
  death: number;
  assist: number;
  gold: number;
  items: Array<Item>;
  mode: string;
  status: string;
}

interface MostPlayedChampions {
  champIconUrl: string;
  winrate: number;
  gameCount: number;
}

interface BattleStats {
  winratte: string;
  mvp: string;
  played: string;
  kdaAvg: number;
  tp: number;
  gpm: number;
  add: number;
  adt: number;
  atd: number;
}

interface Rank {
  title: string;
  logoUrl: string;
}
