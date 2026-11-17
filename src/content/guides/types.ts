export type GuideMeta = {
  slug: string;
  title: string;
  shortTitle: string;
  description: string;
  /** Date de dernière vérification des informations (AAAA-MM-JJ) */
  updatedAt: string;
  readingMinutes: number;
  /** Sommaire : [ancre, libellé] */
  toc: [string, string][];
  /** Questions fréquentes : [question, réponse] (aussi publiées en données structurées) */
  faq: [string, string][];
  /** Sources officielles : [libellé, url] */
  sources: [string, string][];
};
