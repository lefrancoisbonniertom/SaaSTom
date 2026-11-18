import { A, Callout, H2, P, Table, UL } from "./prose";
import type { GuideMeta } from "./types";

export const meta: GuideMeta = {
  slug: "calendrier-micro-entrepreneur",
  title: "Calendrier du micro-entrepreneur : toutes les échéances à ne pas rater",
  shortTitle: "Le calendrier des échéances",
  description:
    "Déclarations Urssaf mensuelles ou trimestrielles, CFE, impôt sur le revenu, facture électronique : toutes les dates à retenir quand on est micro-entrepreneur, vérifiées sur les sites officiels.",
  updatedAt: "2026-11-17",
  readingMinutes: 6,
  toc: [
    ["urssaf", "Déclarer son chiffre d'affaires à l'Urssaf"],
    ["premiere", "La toute première déclaration"],
    ["cfe", "La CFE, chaque fin d'année"],
    ["impots", "La déclaration de revenus, chaque printemps"],
    ["facture", "La facture électronique, en 2026 et 2027"],
    ["recap", "Le récapitulatif"],
  ],
  faq: [
    [
      "Faut-il déclarer son chiffre d'affaires à l'Urssaf même s'il est nul ?",
      "Oui. Même sans chiffre d'affaires, la déclaration reste obligatoire : il suffit d'indiquer 0 (« néant »). Une déclaration manquante entraîne une pénalité.",
    ],
    [
      "Quelle est la date limite de la déclaration trimestrielle Urssaf ?",
      "Le chiffre d'affaires de janvier à mars se déclare avant le 30 avril, celui d'avril à juin avant le 31 juillet, celui de juillet à septembre avant le 31 octobre et celui d'octobre à décembre avant le 31 janvier.",
    ],
    [
      "Quand payer la CFE quand on est micro-entrepreneur ?",
      "La CFE se paie au plus tard le 15 décembre. L'avis n'est pas envoyé par courrier : il faut le consulter dans son espace en ligne sur impots.gouv.fr. La première année d'activité, l'entreprise en est exonérée.",
    ],
    [
      "Peut-on passer de la déclaration trimestrielle à la déclaration mensuelle ?",
      "Oui, mais le changement doit être demandé avant le 31 octobre pour s'appliquer à partir du 1er janvier de l'année suivante.",
    ],
  ],
  sources: [
    ["Micro-entrepreneur : quand déclarer son chiffre d'affaires ? (Service-Public)", "https://entreprendre.service-public.gouv.fr/vosdroits/F23257"],
    ["Avancement de la date limite de septembre 2026 (Service-Public)", "https://entreprendre.service-public.gouv.fr/actualites/A19087"],
    ["Un micro-entrepreneur doit-il payer la CFE ? (Service-Public)", "https://entreprendre.service-public.gouv.fr/vosdroits/F23999"],
    ["Facturation électronique : guide pratique de démarrage (impots.gouv.fr)", "https://www.impots.gouv.fr/sites/default/files/media/1_metier/2_professionnel/EV/2_gestion/290_facturation_electronique/guide_pratique_facturation_electronique.pdf"],
  ],
};

export default function Content() {
  return (
    <>
      <P>
        Quand on lance sa micro-entreprise, on pense à trouver des clients, pas aux dates limites. Pourtant, une
        déclaration oubliée coûte vite de l&apos;argent. Voici toutes les échéances qui reviennent chaque année, avec
        les règles exactes publiées par l&apos;administration.
      </P>

      <H2 id="urssaf">Déclarer son chiffre d&apos;affaires à l&apos;Urssaf</H2>
      <P>
        C&apos;est l&apos;échéance la plus fréquente. Vous déclarez votre chiffre d&apos;affaires encaissé sur{" "}
        <A href="https://www.autoentrepreneur.urssaf.fr">autoentrepreneur.urssaf.fr</A> ou sur l&apos;application de
        l&apos;Urssaf, et vous payez vos cotisations en même temps. Selon l&apos;option choisie, la déclaration est
        mensuelle ou trimestrielle.
      </P>
      <UL>
        <li>
          <strong className="text-ink">Mensuelle :</strong> avant la fin du mois suivant. Le chiffre d&apos;affaires de
          juin se déclare au plus tard le 31 juillet.
        </li>
        <li>
          <strong className="text-ink">Trimestrielle :</strong> avant la fin du mois qui suit chaque trimestre.
        </li>
      </UL>
      <Table
        head={["Chiffre d'affaires de…", "À déclarer avant le…"]}
        rows={[
          ["janvier, février, mars", "30 avril"],
          ["avril, mai, juin", "31 juillet"],
          ["juillet, août, septembre", "31 octobre"],
          ["octobre, novembre, décembre", "31 janvier de l'année suivante"],
        ]}
      />
      <P>
        Même si vous n&apos;avez rien encaissé, la déclaration reste obligatoire : vous indiquez 0. En cas
        d&apos;oubli, l&apos;Urssaf applique une pénalité de 60,10 € par déclaration manquante, et les cotisations sont
        majorées (5 % par déclaration mensuelle ou 15 % par déclaration trimestrielle manquante).
      </P>
      <Callout title="Attention aux dates qui tombent un week-end">
        <p>
          En principe, une échéance qui tombe un samedi ou un dimanche est reportée au jour ouvré suivant. Ce n&apos;est
          pas automatique : pour septembre et le 3e trimestre 2026, l&apos;Urssaf a maintenu la date limite au samedi 31
          octobre 2026 à 23h59. Le plus sûr est de déclarer quelques jours avant.
        </p>
      </Callout>
      <P>
        Vous pouvez changer de rythme : pour passer de trimestriel à mensuel l&apos;année suivante, la demande doit être
        faite avant le 31 octobre. L&apos;option trimestrielle se choisit, elle, dans le mois qui suit le début de
        l&apos;activité.
      </P>

      <H2 id="premiere">La toute première déclaration</H2>
      <P>
        Au démarrage, la première déclaration regroupe plusieurs mois. En déclaration mensuelle, elle se fait avant la
        fin du mois qui suit vos trois premiers mois d&apos;activité : pour une activité commencée le 6 mars 2026,
        c&apos;était au plus tard le 31 juillet 2026. En trimestriel, elle se fait avant la fin du mois qui suit le
        trimestre d&apos;après celui de la création : pour une activité commencée le 12 avril 2026, c&apos;était au plus
        tard le 31 octobre 2026. Le pas à pas est dans notre{" "}
        <A href="/guides/premiere-declaration-urssaf">guide de la première déclaration</A>.
      </P>

      <H2 id="cfe">La CFE, chaque fin d&apos;année</H2>
      <P>
        La cotisation foncière des entreprises (CFE) est un impôt local que paient la plupart des micro-entrepreneurs,
        même ceux qui travaillent depuis chez eux. Elle se paie <strong className="text-ink">au plus tard le 15
        décembre</strong>. L&apos;avis n&apos;arrive pas par courrier : il est déposé dans votre espace en ligne sur
        impots.gouv.fr, il faut donc aller le chercher.
      </P>
      <P>
        La bonne nouvelle : la première année d&apos;activité, vous êtes exonéré. Pour en profiter, la déclaration
        initiale 1447-C-SD doit être envoyée au service des impôts des entreprises au plus tard le 31 décembre de
        l&apos;année de création. Tout le détail est dans notre <A href="/guides/cfe-micro-entrepreneur">guide sur la
        CFE</A>.
      </P>

      <H2 id="impots">La déclaration de revenus, chaque printemps</H2>
      <P>
        En plus de l&apos;Urssaf, votre chiffre d&apos;affaires doit figurer dans votre déclaration de revenus annuelle,
        dans la partie réservée aux professions non salariées. Les dates limites sont fixées chaque année par
        l&apos;administration fiscale et tombent en général entre mai et juin : vérifiez-les sur impots.gouv.fr dès le
        mois d&apos;avril. C&apos;est valable même si vous avez opté pour le versement libératoire, qui règle
        l&apos;impôt au fil de l&apos;eau avec vos cotisations.
      </P>

      <H2 id="facture">La facture électronique, en 2026 et 2027</H2>
      <P>
        La réforme de la facturation électronique entre entreprises se met en place en deux temps. Depuis le 1er
        septembre 2026, les entreprises concernées par la réforme doivent pouvoir recevoir des factures électroniques.
        Pour les PME, TPE et micro-entreprises, l&apos;obligation d&apos;émettre des factures électroniques arrive le 1er
        septembre 2027.
      </P>
      <P>
        Concrètement, ces factures passent par une plateforme agréée par l&apos;État. L&apos;administration conseille de
        la choisir sans attendre, directement ou via votre logiciel de facturation, votre banque ou votre
        expert-comptable.
      </P>

      <H2 id="recap">Le récapitulatif</H2>
      <Table
        head={["Quand", "Quoi"]}
        rows={[
          ["Chaque mois ou chaque trimestre", "Déclaration du chiffre d'affaires et paiement des cotisations Urssaf"],
          ["Mai – juin (dates fixées chaque année)", "Déclaration de revenus, partie professions non salariées"],
          ["Avant le 31 octobre", "Demande de changement de rythme de déclaration Urssaf pour l'année suivante"],
          ["Avant le 31 décembre de l'année de création", "Déclaration initiale de CFE (1447-C-SD)"],
          ["Au plus tard le 15 décembre", "Paiement de la CFE (à partir de la 2e année)"],
          ["1er septembre 2027", "Émission obligatoire des factures électroniques pour les micro-entreprises"],
        ]}
      />
    </>
  );
}
