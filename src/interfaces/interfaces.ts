interface Dictionary {
  rus?: string | undefined;
  srb?: string | undefined;
  eng?: string | undefined;
  id?: number | undefined;
  hidden?: boolean | undefined;
}

interface WordConstruct {
  data?: string[];
  header?: string;
}

interface Grammar {
  glagola?: {
    paju?: WordConstruct;
    peu?: WordConstruct;
    pie?: WordConstruct;
  };
  padez?: {
    akuzativ?: WordConstruct;
    dativ?: WordConstruct;
    genetiv?: WordConstruct;
    instrumental?: WordConstruct;
    locativ?: WordConstruct;
  };
}

export type { Dictionary, Grammar, WordConstruct };
