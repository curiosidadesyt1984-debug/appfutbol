const FootballFilter = {
  KEYWORDS: [
    "laliga", "liga tv", "hypermotion", "dazn lalig", "campeones",
    "champions", "vamos", "movistar", "gol play", "tdp", "teledeporte",
    "tudn", "bein sport", "fox deportes", "foxsport", "espn",
    "premier league", "bundesliga", "serie a", "ligue 1", "calcio",
    "copa del rey", "supercopa", "europa league", "conference",
    "sport tv", "tyc sports", "dsports", "claro sports",
    "futbol", "football", "soccer", "liga ea",
    "m deportes", "onetoro", "gol ",
    "dazn 1 ", "dazn 2 ", "dazn 3", "dazn 4", "dazn la",
    "sky sports", "tnt sport", "polsat sport",
  ],

  match(name) {
    if (!name) return false;
    const n = name.toLowerCase();
    return this.KEYWORDS.some(kw => n.includes(kw));
  },

  filter(items) {
    return (items || []).filter(item => this.match(item.name));
  },
};
