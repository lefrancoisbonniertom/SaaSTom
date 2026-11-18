import { A, Callout, H2, P, Table, UL } from "./prose";
import type { GuideMeta } from "./types";

export const meta: GuideMeta = {
  slug: "premiere-declaration-urssaf",
  title: "Première déclaration Urssaf du micro-entrepreneur : quand et comment la faire",
  shortTitle: "La première déclaration Urssaf",
  description:
    "Date limite de la première déclaration de chiffre d'affaires, montant à déclarer, déclaration à 0 €, pénalités et choix entre mensuel et trimestriel : le guide pas à pas, d'après les sources officielles.",
  updatedAt: "2026-11-18",
  readingMinutes: 5,
  toc: [
    ["quand", "Quand faire sa première déclaration ?"],
    ["quoi", "Quel chiffre d'affaires déclarer ?"],
    ["comment", "Comment déclarer, pas à pas"],
    ["oubli", "Et si on oublie ?"],
    ["rythme", "Mensuel ou trimestriel ?"],
  ],
  faq: [
    [
      "Quand faire sa première déclaration de chiffre d'affaires en micro-entreprise ?",
      "En déclaration mensuelle, avant la fin du mois qui suit les 3 premiers mois d'activité : pour un début le 6 mars 2026, au plus tard le 31 juillet 2026. En trimestriel, avant la fin du mois qui suit le trimestre d'après celui de la création : pour un début le 12 avril 2026, au plus tard le 31 octobre 2026.",
    ],
    [
      "Faut-il déclarer son chiffre d'affaires s'il est à 0 € ?",
      "Oui. La déclaration reste obligatoire même sans chiffre d'affaires : il suffit d'indiquer « néant ».",
    ],
    [
      "Quel chiffre d'affaires déclarer à l'Urssaf ?",
      "Le chiffre d'affaires réellement encaissé pendant la période, hors taxes. Les factures pas encore payées ne comptent pas, et on ne déduit aucune charge.",
    ],
    [
      "Que se passe-t-il si on oublie de déclarer ?",
      "L'Urssaf applique une pénalité de 60,10 € par déclaration manquante, et majore les cotisations de 5 % (mensuel) ou 15 % (trimestriel) par déclaration manquante.",
    ],
  ],
  sources: [
    ["Micro-entrepreneur : quand déclarer son chiffre d'affaires ? (Service-Public)", "https://entreprendre.service-public.gouv.fr/vosdroits/F23257"],
    ["Déclarer et payer ses cotisations (autoentrepreneur.urssaf.fr)", "https://www.autoentrepreneur.urssaf.fr"],
  ],
};

export default function Content() {
  return (
    <>
      <P>
        Tu viens de créer ta micro-entreprise et tu ne sais pas encore quand l&apos;Urssaf t&apos;attend ? C&apos;est
        normal : la première déclaration n&apos;arrive pas tout de suite, et son calendrier est différent des suivantes.
        Voici comment ne pas la rater.
      </P>

      <H2 id="quand">Quand faire sa première déclaration ?</H2>
      <P>Tout dépend du rythme choisi au moment de la création : mensuel ou trimestriel.</P>
      <Table
        head={["Rythme", "Règle", "Exemple officiel"]}
        rows={[
          ["Mensuel", "Avant la fin du mois qui suit tes 3 premiers mois d'activité", "Début le 6 mars 2026 → au plus tard le 31 juillet 2026"],
          ["Trimestriel", "Avant la fin du mois qui suit le trimestre d'après celui de la création", "Début le 12 avril 2026 → au plus tard le 31 octobre 2026"],
        ]}
      />
      <P>
        Cette première déclaration regroupe donc plusieurs mois. Ensuite, tu déclares chaque mois (avant la fin du mois
        suivant) ou chaque trimestre (avant le 30 avril, le 31 juillet, le 31 octobre et le 31 janvier). Toutes les
        dates sont dans notre <A href="/guides/calendrier-micro-entrepreneur">calendrier du micro-entrepreneur</A>.
      </P>

      <H2 id="quoi">Quel chiffre d&apos;affaires déclarer ?</H2>
      <UL>
        <li>
          <strong className="text-ink">Ce que tu as encaissé</strong>, pas ce que tu as facturé : une facture envoyée mais
          pas encore payée ne compte pas.
        </li>
        <li>
          <strong className="text-ink">Hors taxes</strong> : si tu factures la TVA, tu ne l&apos;inclus pas.
        </li>
        <li>
          <strong className="text-ink">Sans rien déduire</strong> : ni frais, ni commissions, ni achats.
        </li>
        <li>
          <strong className="text-ink">Même à 0 €</strong> : la déclaration reste obligatoire, il suffit d&apos;indiquer
          « néant ».
        </li>
      </UL>

      <H2 id="comment">Comment déclarer, pas à pas</H2>
      <UL>
        <li>
          Connecte-toi à ton espace sur <A href="https://www.autoentrepreneur.urssaf.fr">autoentrepreneur.urssaf.fr</A>.
        </li>
        <li>Choisis la période à déclarer et saisis ton chiffre d&apos;affaires encaissé, par type d&apos;activité.</li>
        <li>
          Le site calcule automatiquement tes cotisations, et ton impôt si tu as opté pour le versement libératoire.
        </li>
        <li>Valide, puis règle le montant en ligne : déclaration et paiement se font au même endroit.</li>
      </UL>
      <Callout title="Le bon réflexe">
        <p>
          Note tes encaissements au fil de l&apos;eau (un tableau suffit) et déclare quelques jours avant la date
          limite. Les échéances qui tombent un week-end ne sont pas toujours reportées.
        </p>
      </Callout>

      <H2 id="oubli">Et si on oublie ?</H2>
      <P>Une déclaration manquante coûte cher, même avec un petit chiffre d&apos;affaires :</P>
      <UL>
        <li>une pénalité de 60,10 € par déclaration manquante ;</li>
        <li>une majoration des cotisations de 5 % par déclaration mensuelle manquante, ou de 15 % par déclaration trimestrielle manquante ;</li>
        <li>des cotisations calculées sur un chiffre d&apos;affaires forfaitaire, souvent bien plus élevé que le tien, tant que tu n&apos;as pas déclaré.</li>
      </UL>
      <P>Tu peux toujours régulariser en faisant ta déclaration ensuite : mieux vaut le faire au plus vite.</P>

      <H2 id="rythme">Mensuel ou trimestriel ?</H2>
      <P>
        Par défaut, la déclaration est mensuelle. L&apos;option trimestrielle se demande dans le mois qui suit le début
        de l&apos;activité, et elle est reconduite automatiquement chaque année. Pour repasser au mensuel l&apos;année
        suivante, la demande doit être faite avant le 31 octobre.
      </P>
      <P>
        Le mensuel lisse les paiements et évite les grosses sommes d&apos;un coup ; le trimestriel demande moins de
        démarches. Dans les deux cas, le montant total des cotisations est le même : il dépend uniquement de ce que tu
        encaisses.
      </P>
    </>
  );
}
