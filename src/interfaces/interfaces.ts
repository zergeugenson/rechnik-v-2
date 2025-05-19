interface Dictionary {
  rus: string;
  srb: string;
  eng: string;
  id: number;
  hidden: boolean;
}

interface wordConstruct {
  data: string[];
  header: string;
}

interface Grammar {
  glagola: {
    paju: wordConstruct;
    peu: wordConstruct;
    pie: wordConstruct;
  }
  padez: {
    akuzativ: wordConstruct;
    dativ: wordConstruct;
    genetiv: wordConstruct;
    instrumental: wordConstruct;
    locativ: wordConstruct;
  }
}

export type { Dictionary, Grammar };
