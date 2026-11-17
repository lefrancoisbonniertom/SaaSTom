import { A, Callout, H2, P, Table, UL } from "./prose";
import type { GuideMeta } from "./types";

export const meta: GuideMeta = {
  slug: "seuil-tva-micro-entrepreneur",
  title: "Seuils de TVA 2026 du micro-entrepreneur : que faire si vous les dépassez ?",
  shortTitle: "Les seuils de TVA",
  description:
    "Franchise en base de TVA en 2026 : les seuils par activité, ce qui se passe quand on les dépasse, la mention à mettre sur ses factures et les démarches à faire. Expliqué simplement, sources officielles à l'appui.",
  updatedAt: "2026-11-17",
  readingMinutes: 6,
  toc: [
    ["principe", "La franchise en base, c'est quoi ?"],
    ["seuils", "Les seuils 2026"],
    ["depassement", "Ce qui se passe quand on dépasse"],
    ["demarches", "Les démarches à faire"],
    ["mention", "La mention sur vos factures"],
    ["25000", "Et le seuil unique à 25 000 € ?"],
  ],
  faq: [
    [
      "Quel est le seuil de franchise de TVA pour un micro-entrepreneur en 2026 ?",
      "Pour les prestations de services, le seuil est de 37 500 € de chiffre d'affaires l'année précédente, avec un seuil majoré de 41 250 € en cours d'année. Pour le commerce et l'hébergement, il est de 85 000 €, avec un seuil majoré de 93 500 €.",
    ],
    [
      "Que se passe-t-il si je dépasse le seuil majoré de TVA ?",
      "La franchise s'arrête dès le jour du dépassement : vous devez facturer la TVA sur vos opérations à partir de cette date.",
    ],
    [
      "Est-ce que je reste micro-entrepreneur si je dois facturer la TVA ?",
      "Oui, tant que vous restez sous les plafonds de chiffre d'affaires de la micro-entreprise. Vous facturez simplement la TVA et la déclarez, en général au régime réel simplifié.",
    ],
    [
      "Le seuil de TVA à 25 000 € s'applique-t-il ?",
      "Non. Ce seuil unique, prévu par la loi de finances pour 2025, a été définitivement supprimé par une loi du 3 novembre 2025.",
    ],
  ],
  sources: [
    ["Fiscalité d'un micro-entrepreneur : ce qu'il faut savoir (Service-Public)", "https://entreprendre.service-public.gouv.fr/vosdroits/F36244"],
    ["Franchise en base de TVA (Service-Public)", "https://entreprendre.service-public.gouv.fr/vosdroits/F21746"],
    ["Suppression du seuil unique de 25 000 € (Service-Public)", "https://entreprendre.service-public.gouv.fr/actualites/A17995"],
  ],
};

export default function Content() {
  return (
    <>
      <P>
        Tant que votre chiffre d&apos;affaires reste modeste, vous ne facturez pas la TVA à vos clients : c&apos;est la
        franchise en base. Mais au-delà de certains seuils, tout change, parfois du jour au lendemain. Voici les
        chiffres en vigueur en 2026 et ce qu&apos;il faut faire au bon moment.
      </P>

      <H2 id="principe">La franchise en base, c&apos;est quoi ?</H2>
      <P>
        En franchise, vous facturez vos clients hors taxe et vous ne reversez pas de TVA à l&apos;État. En contrepartie,
        vous ne pouvez pas récupérer la TVA payée sur vos achats professionnels. C&apos;est le cas de la plupart des
        micro-entrepreneurs qui démarrent.
      </P>

      <H2 id="seuils">Les seuils 2026</H2>
      <P>
        Il existe deux seuils. Le <strong className="text-ink">seuil de base</strong> se regarde sur le chiffre
        d&apos;affaires de l&apos;année précédente. Le <strong className="text-ink">seuil majoré</strong> se surveille
        en cours d&apos;année. Pour 2026, l&apos;administration indique qu&apos;ils sont inchangés.
      </P>
      <Table
        head={["Activité", "Seuil de base", "Seuil majoré"]}
        rows={[
          ["Prestations de services et activités libérales (hors avocat)", "37 500 €", "41 250 €"],
          ["Commerce, vente à consommer sur place et hébergement", "85 000 €", "93 500 €"],
          ["Avocat (activités réglementées), œuvres et droits d'auteur", "50 000 €", "55 000 €"],
          ["Avocat (activités non réglementées), autres activités d'auteur", "35 000 €", "38 500 €"],
        ]}
      />
      <Callout title="À ne pas confondre">
        <p>
          Ces seuils de TVA sont bien plus bas que les plafonds de la micro-entreprise (83 600 € pour les services et
          203 100 € pour le commerce en 2026). On peut donc rester micro-entrepreneur tout en devenant redevable de la
          TVA.
        </p>
      </Callout>

      <H2 id="depassement">Ce qui se passe quand on dépasse</H2>
      <UL>
        <li>
          <strong className="text-ink">Vous dépassez le seuil majoré</strong> (par exemple 41 250 € en services) : la
          franchise s&apos;arrête le jour même. Vous facturez la TVA sur vos opérations dès ce jour-là.
        </li>
        <li>
          <strong className="text-ink">Vous dépassez seulement le seuil de base</strong> (entre 37 500 € et 41 250 € en
          services) : vous terminez l&apos;année en franchise, et la TVA s&apos;applique à partir du 1er janvier
          suivant.
        </li>
      </UL>
      <P>
        Depuis 2025, il n&apos;y a plus de tolérance sur deux ans : un seul dépassement du seuil de base suffit pour
        sortir de la franchise l&apos;année suivante.
      </P>

      <H2 id="demarches">Les démarches à faire</H2>
      <UL>
        <li>Demandez un numéro de TVA intracommunautaire à votre service des impôts des entreprises, depuis votre espace professionnel sur impots.gouv.fr, et faites-le figurer sur vos factures.</li>
        <li>Facturez la TVA et indiquez son montant sur chaque facture à partir de la date de sortie de la franchise.</li>
        <li>Déclarez et reversez la TVA. Pour la plupart des micro-entrepreneurs, c&apos;est le régime réel simplifié qui s&apos;applique.</li>
        <li>Bonne nouvelle : vous pouvez désormais récupérer la TVA payée sur vos achats professionnels.</li>
      </UL>
      <P>
        Pensez aussi à prévenir vos clients réguliers : pour un particulier, vos prix TTC augmentent si vous ne les
        ajustez pas. Il est aussi possible d&apos;opter volontairement pour la TVA avant d&apos;atteindre les seuils,
        par exemple si vos clients sont surtout des entreprises qui la récupèrent. L&apos;option vaut alors deux ans.
      </P>

      <H2 id="mention">La mention sur vos factures</H2>
      <P>
        Tant que vous êtes en franchise, chaque facture doit le dire. La mention historique est « TVA non applicable,
        article 293 B du CGI ». Depuis le 1er septembre 2026, la mention doit faire référence aux articles L. 223 et
        suivants du code des impositions sur les biens et services (CIBS). Une tolérance permet de garder l&apos;ancienne
        mention jusqu&apos;au 31 décembre 2027.
      </P>

      <H2 id="25000">Et le seuil unique à 25 000 € ?</H2>
      <P>
        Vous en avez peut-être entendu parler : la loi de finances pour 2025 prévoyait un seuil unique de 25 000 € pour
        toutes les activités. Il a d&apos;abord été suspendu, puis{" "}
        <A href="https://entreprendre.service-public.gouv.fr/actualites/A17995">définitivement supprimé</A> par une loi
        du 3 novembre 2025. Les seuils ci-dessus restent donc ceux qui comptent. Ils peuvent toutefois évoluer avec une
        nouvelle loi de finances : vérifiez-les chaque début d&apos;année.
      </P>
    </>
  );
}
