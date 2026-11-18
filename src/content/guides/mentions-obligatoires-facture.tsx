import { A, Callout, H2, P, UL } from "./prose";
import type { GuideMeta } from "./types";

export const meta: GuideMeta = {
  slug: "mentions-obligatoires-facture",
  title: "Facture du micro-entrepreneur : toutes les mentions obligatoires en 2026",
  shortTitle: "Les mentions obligatoires d'une facture",
  description:
    "Mention « EI », SIREN, numérotation, TVA non applicable, pénalités de retard, indemnité de 40 € : la liste complète des mentions obligatoires sur une facture de micro-entrepreneur, et ce qui change en 2026 et 2027.",
  updatedAt: "2026-11-18",
  readingMinutes: 6,
  toc: [
    ["toi", "Qui tu es"],
    ["client", "Ton client"],
    ["facture", "La facture elle-même"],
    ["paiement", "Le paiement"],
    ["tva", "La mention de TVA"],
    ["changements", "Ce qui change en 2026 et 2027"],
    ["sanctions", "Conservation et sanctions"],
  ],
  faq: [
    [
      "Un micro-entrepreneur doit-il écrire « EI » sur ses factures ?",
      "Oui. Le nom et le prénom de l'entrepreneur doivent être accompagnés de la mention « Entrepreneur individuel » ou « EI », avec l'adresse et le numéro SIREN.",
    ],
    [
      "Quelle mention de TVA mettre sur une facture de micro-entrepreneur ?",
      "En franchise en base de TVA, la mention historique est « TVA non applicable, art. 293 B du CGI ». Depuis le 1er septembre 2026, elle doit faire référence aux articles L. 223 et suivants du CIBS, avec une tolérance pour l'ancienne mention jusqu'au 31 décembre 2027.",
    ],
    [
      "L'indemnité de 40 € est-elle obligatoire sur les factures ?",
      "Oui, la facture doit mentionner l'indemnité forfaitaire de 40 € pour frais de recouvrement. Elle ne peut être réclamée qu'à un client professionnel.",
    ],
    [
      "Combien de temps garder ses factures ?",
      "Dix ans.",
    ],
  ],
  sources: [
    ["Documents commerciaux d'une micro-entreprise (Service-Public)", "https://entreprendre.service-public.gouv.fr/vosdroits/F36008"],
    ["Mentions obligatoires sur une facture (Service-Public)", "https://entreprendre.service-public.gouv.fr/vosdroits/F31808"],
  ],
};

export default function Content() {
  return (
    <>
      <P>
        Une facture incomplète peut coûter cher et retarder ton paiement. Voici, rubrique par rubrique, ce qui doit
        obligatoirement figurer sur une facture de micro-entrepreneur, d&apos;après l&apos;administration.
      </P>

      <H2 id="toi">Qui tu es</H2>
      <UL>
        <li>
          Ton nom et ton prénom, suivis de la mention <strong className="text-ink">« Entrepreneur individuel »</strong> ou{" "}
          <strong className="text-ink">« EI »</strong>.
        </li>
        <li>Ton adresse, et l&apos;adresse de facturation si elle est différente.</li>
        <li>Ton numéro SIREN.</li>
        <li>
          Si ton métier exige une assurance professionnelle (par exemple la décennale dans le bâtiment) : le contrat,
          les coordonnées de l&apos;assureur et la couverture géographique.
        </li>
      </UL>

      <H2 id="client">Ton client</H2>
      <UL>
        <li>Pour une entreprise : son nom (dénomination).</li>
        <li>Pour un particulier : son nom et son adresse, et son adresse de facturation si elle est différente.</li>
        <li>Le numéro de bon de commande, si ton client en a établi un.</li>
      </UL>

      <H2 id="facture">La facture elle-même</H2>
      <UL>
        <li>
          La date d&apos;émission et un <strong className="text-ink">numéro unique</strong>, qui suit une séquence
          chronologique et continue (pas de trou, pas de retour en arrière).
        </li>
        <li>La date de la vente ou de la prestation (ou du versement de l&apos;acompte).</li>
        <li>La désignation précise de ce que tu vends : quantité, prix unitaire hors taxe, taux de TVA ou mention d&apos;exonération.</li>
        <li>Les totaux hors taxe et TTC, avec les éventuels frais (transport, emballage) et réductions.</li>
      </UL>

      <H2 id="paiement">Le paiement</H2>
      <UL>
        <li>La date à laquelle le paiement doit être fait.</li>
        <li>
          Les conditions d&apos;escompte, ou à défaut la mention{" "}
          <strong className="text-ink">« Escompte pour paiement anticipé : néant »</strong>.
        </li>
        <li>Le taux des pénalités de retard, dues sans rappel si la facture n&apos;est pas payée à temps.</li>
        <li>
          L&apos;<strong className="text-ink">indemnité forfaitaire de 40 €</strong> pour frais de recouvrement, réclamable
          uniquement à un client professionnel.
        </li>
      </UL>

      <H2 id="tva">La mention de TVA</H2>
      <P>
        Si tu es en franchise en base de TVA (le cas de la plupart des micro-entrepreneurs), ta facture doit le dire.
        La mention historique est <strong className="text-ink">« TVA non applicable, art. 293 B du CGI »</strong>. Depuis
        le 1er septembre 2026, elle doit faire référence aux articles L. 223 et suivants du code des impositions sur
        les biens et services (CIBS). L&apos;ancienne mention reste tolérée jusqu&apos;au 31 décembre 2027.
      </P>
      <P>
        Le numéro de TVA intracommunautaire n&apos;est demandé que si tu es redevable de la TVA, et pas pour les factures
        de 150 € HT ou moins. Pour savoir si tu approches des seuils, lis notre{" "}
        <A href="/guides/seuil-tva-micro-entrepreneur">guide sur les seuils de TVA</A>.
      </P>

      <H2 id="changements">Ce qui change en 2026 et 2027</H2>
      <P>
        Avec la facturation électronique, quatre nouvelles mentions deviendront obligatoires pour les micro-entreprises
        à partir du 1er septembre 2027 :
      </P>
      <UL>
        <li>le numéro SIREN de ton client, quand c&apos;est une entreprise ;</li>
        <li>l&apos;adresse de livraison, si elle diffère de l&apos;adresse du client ;</li>
        <li>la nature des opérations : livraison de biens, prestation de services, ou les deux ;</li>
        <li>la mention « Option pour le paiement de la taxe d&apos;après les débits », si tu as choisi cette option.</li>
      </UL>
      <Callout title="Pour les particuliers">
        <p>
          Si tu vends certains biens à des particuliers (électroménager, informatique, jouets, articles de sport…), ta
          facture doit aussi mentionner la garantie légale de conformité, d&apos;au moins 2 ans.
        </p>
      </Callout>

      <H2 id="sanctions">Conservation et sanctions</H2>
      <P>Garde tes factures 10 ans. En cas de contrôle, les erreurs se paient :</P>
      <UL>
        <li>15 € par mention manquante ou inexacte, dans la limite de 25 % du montant de la facture ;</li>
        <li>jusqu&apos;à 75 000 € d&apos;amende si tu ne factures pas alors que c&apos;est obligatoire (150 000 € en cas de récidive dans les 2 ans).</li>
      </UL>
      <P>
        Pour être sûr de ne rien oublier, le plus simple est d&apos;utiliser un modèle qui reprend toutes ces mentions
        une fois pour toutes.
      </P>
    </>
  );
}
