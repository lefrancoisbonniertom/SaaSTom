import { A, Callout, H2, P, Table, UL } from "./prose";
import type { GuideMeta } from "./types";

export const meta: GuideMeta = {
  slug: "cfe-micro-entrepreneur",
  title: "CFE du micro-entrepreneur : faut-il payer, combien et avant quand ?",
  shortTitle: "La CFE",
  description:
    "Cotisation foncière des entreprises (CFE) en micro-entreprise : exonération la première année, réduction la deuxième, exonération sous 5 000 € de chiffre d'affaires, date limite du 15 décembre et avis à récupérer en ligne.",
  updatedAt: "2026-11-17",
  readingMinutes: 5,
  toc: [
    ["quoi", "La CFE, c'est quoi ?"],
    ["exonerations", "Quand vous ne payez pas (ou moins)"],
    ["montant", "Combien ça coûte"],
    ["payer", "Quand et comment payer"],
    ["declaration", "La déclaration à faire l'année de création"],
  ],
  faq: [
    [
      "Un micro-entrepreneur doit-il payer la CFE la première année ?",
      "Non. L'entreprise est exonérée de CFE pour sa première année d'activité, quelle que soit sa date de création. La deuxième année, la base d'imposition est réduite de moitié.",
    ],
    [
      "Faut-il payer la CFE si l'on a fait moins de 5 000 € de chiffre d'affaires ?",
      "Non. Le micro-entrepreneur est exonéré de CFE pour une année donnée si son chiffre d'affaires de l'année N-2 n'a pas dépassé 5 000 €.",
    ],
    [
      "Quelle est la date limite de paiement de la CFE ?",
      "Le 15 décembre inclus. Si cette date tombe un week-end ou un jour férié, elle est reportée au jour ouvré suivant.",
    ],
    [
      "Où trouver son avis de CFE ?",
      "L'avis n'est pas envoyé par courrier. Il faut le consulter dans son espace en ligne sur impots.gouv.fr.",
    ],
  ],
  sources: [
    ["Un micro-entrepreneur doit-il payer la CFE ? (Service-Public)", "https://entreprendre.service-public.gouv.fr/vosdroits/F23999"],
  ],
};

export default function Content() {
  return (
    <>
      <P>
        Chaque fin d&apos;année, beaucoup de micro-entrepreneurs découvrent la CFE au dernier moment, parfois avec une
        pénalité. Pourtant, les règles sont simples, et vous ne la paierez peut-être pas du tout cette année.
      </P>

      <H2 id="quoi">La CFE, c&apos;est quoi ?</H2>
      <P>
        La cotisation foncière des entreprises est un impôt local, perçu au profit de la commune où vous exercez. Elle
        concerne aussi les micro-entrepreneurs qui travaillent depuis leur domicile, sans local professionnel.
      </P>

      <H2 id="exonerations">Quand vous ne payez pas (ou moins)</H2>
      <UL>
        <li>
          <strong className="text-ink">La première année d&apos;activité :</strong> exonération totale, quelle que soit
          la date de création, à condition d&apos;avoir fait la déclaration initiale (voir plus bas).
        </li>
        <li>
          <strong className="text-ink">La deuxième année :</strong> la base de calcul est réduite de moitié.
        </li>
        <li>
          <strong className="text-ink">Les petits chiffres d&apos;affaires :</strong> si votre chiffre d&apos;affaires de
          l&apos;année N-2 n&apos;a pas dépassé 5 000 €, vous êtes exonéré pour l&apos;année N. Par exemple, pour la CFE
          2026, c&apos;est le chiffre d&apos;affaires 2024 qui compte.
        </li>
      </UL>

      <H2 id="montant">Combien ça coûte</H2>
      <P>
        Pour la plupart des micro-entrepreneurs, la CFE est calculée sur une « base minimum » fixée par chaque commune,
        selon le chiffre d&apos;affaires de l&apos;année N-2. Le taux voté par la commune s&apos;applique ensuite à
        cette base. Le montant varie donc beaucoup d&apos;une ville à l&apos;autre.
      </P>
      <Table
        head={["Chiffre d'affaires N-2", "Base minimum en 2026"]}
        rows={[["Jusqu'à 10 000 €", "entre 250 € et 597 €, selon la commune"]]}
      />
      <P>
        Attention, il s&apos;agit de la base, pas du montant à payer. Pour connaître la somme exacte, il faut attendre
        votre avis d&apos;imposition.
      </P>

      <H2 id="payer">Quand et comment payer</H2>
      <P>
        La CFE se paie <strong className="text-ink">au plus tard le 15 décembre</strong> (reporté au jour ouvré
        suivant si cette date tombe un week-end ou un jour férié). L&apos;avis n&apos;arrive pas par la poste : il est
        déposé dans votre espace en ligne sur impots.gouv.fr. Le paiement se fait en ligne, depuis ce même
        espace.
      </P>
      <Callout title="Le piège classique">
        <p>
          Ne pas recevoir de courrier ne veut pas dire ne rien devoir. Connectez-vous à votre espace en ligne fin
          novembre pour vérifier si un avis vous attend.
        </p>
      </Callout>
      <P>
        Si votre CFE de l&apos;année précédente dépassait 3 000 €, un acompte de 50 % est demandé au printemps, en
        général entre fin mai et mi-juin. Une petite taxe additionnelle pour les chambres consulaires peut aussi
        s&apos;ajouter : les micro-entrepreneurs la paient avec leurs cotisations sur{" "}
        <A href="https://www.autoentrepreneur.urssaf.fr">autoentrepreneur.urssaf.fr</A>.
      </P>

      <H2 id="declaration">La déclaration à faire l&apos;année de création</H2>
      <P>
        Pour bénéficier de l&apos;exonération de la première année, déposez le formulaire de déclaration initiale
        1447-C-SD auprès de votre service des impôts des entreprises, au plus tard le 31 décembre de l&apos;année de
        création. C&apos;est aussi cette déclaration qui permet à l&apos;administration de calculer votre CFE les
        années suivantes.
      </P>
      <P>
        Pour voir la CFE replacée parmi toutes vos autres échéances, consultez notre{" "}
        <A href="/guides/calendrier-micro-entrepreneur">calendrier du micro-entrepreneur</A>.
      </P>
    </>
  );
}
