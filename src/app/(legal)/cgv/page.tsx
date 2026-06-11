import Link from "next/link";
import { LegalPage, LegalSection } from "@/components/legal-content";

export const metadata = {
  title: "CGV | SaaSTom",
};

export default function CgvPage() {
  return (
    <LegalPage title="Conditions générales de vente" updatedAt="10 juin 2026">
      <LegalSection title="Article 1 — Objet et champ d'application">
        <p>
          Les présentes conditions générales de vente (CGV) régissent l&apos;accès et l&apos;utilisation
          du service SaaSTom, une application en ligne (SaaS) éditée par Tom Lefrancois Bonnier
          (Micro-Entreprise, SIRET 101 407 914 00015), permettant aux indépendants et petites
          entreprises de gérer leurs clients, de générer des documents assistés par IA et de suivre
          leur activité commerciale.
        </p>
        <p>
          Toute souscription à une offre payante implique l&apos;acceptation pleine et entière des
          présentes CGV.
        </p>
      </LegalSection>

      <LegalSection title="Article 2 — Création de compte">
        <p>
          L&apos;accès au service nécessite la création d&apos;un compte avec une adresse email valide et
          un mot de passe. L&apos;utilisateur s&apos;engage à fournir des informations exactes et à
          conserver la confidentialité de ses identifiants.
        </p>
      </LegalSection>

      <LegalSection title="Article 3 — Offres et tarifs">
        <p>SaaSTom propose les offres suivantes, détaillées sur la <Link className="text-gold hover:underline" href="/pricing">page tarifs</Link> :</p>
        <ul className="list-disc space-y-1 pl-5">
          <li><strong>Gratuit</strong> : 0 EUR, fonctionnalités limitées (générations IA et clients en nombre limité).</li>
          <li><strong>Pro</strong> : 19 EUR/mois, générations IA et clients illimités, fonctionnalités avancées.</li>
          <li><strong>Business</strong> : 49 EUR/mois, fonctionnalités du plan Pro et fonctionnalités complémentaires pour équipes.</li>
        </ul>
        <p>
          Les prix sont indiqués en euros. SaaSTom se réserve le droit de modifier ses tarifs à tout
          moment ; les utilisateurs déjà abonnés seront informés avant toute application d&apos;un
          nouveau tarif à leur abonnement.
        </p>
      </LegalSection>

      <LegalSection title="Article 4 — Paiement">
        <p>
          Le paiement des offres payantes s&apos;effectue par carte bancaire via la plateforme de
          paiement sécurisée Stripe. SaaSTom ne stocke aucune donnée bancaire. Les abonnements sont
          facturés mensuellement et renouvelés automatiquement par prélèvement, sauf résiliation.
        </p>
      </LegalSection>

      <LegalSection title="Article 5 — Durée, renouvellement et résiliation">
        <p>
          L&apos;abonnement est conclu pour une durée d&apos;un mois, renouvelable automatiquement par
          tacite reconduction. L&apos;utilisateur peut résilier son abonnement à tout moment depuis son
          espace de réglages ou le portail de gestion d&apos;abonnement Stripe. La résiliation prend
          effet à la fin de la période de facturation en cours ; aucun remboursement au prorata
          n&apos;est effectué pour la période déjà entamée. À l&apos;issue de la résiliation, le compte
          repasse automatiquement en offre Gratuite.
        </p>
      </LegalSection>

      <LegalSection title="Article 6 — Droit de rétractation">
        <p>
          Conformément à l&apos;article L221-28 du Code de la consommation, le droit de rétractation ne
          s&apos;applique pas aux contenus numériques fournis sur un support immatériel dont
          l&apos;exécution a commencé avec l&apos;accord préalable du consommateur, qui a renoncé
          expressément à son droit de rétractation. En souscrivant à une offre payante et en
          accédant immédiatement aux fonctionnalités correspondantes, l&apos;utilisateur reconnaît
          renoncer à son droit de rétractation pour la période en cours.
        </p>
      </LegalSection>

      <LegalSection title="Article 7 — Disponibilité et responsabilité">
        <p>
          SaaSTom met en œuvre les moyens raisonnables pour assurer la disponibilité et la sécurité
          du service, sans garantie de continuité absolue. Le service est fourni « en l&apos;état »,
          sans garantie d&apos;adéquation à un besoin particulier. SaaSTom ne pourra être tenu
          responsable des dommages indirects résultant de l&apos;utilisation ou de l&apos;impossibilité
          d&apos;utiliser le service.
        </p>
      </LegalSection>

      <LegalSection title="Article 8 — Contenus générés par intelligence artificielle">
        <p>
          Les documents, emails et textes générés via l&apos;assistant IA sont produits automatiquement
          à partir des informations fournies par l&apos;utilisateur. Ils sont fournis à titre
          d&apos;assistance et ne constituent ni un conseil juridique, comptable ou fiscal. Il
          appartient à l&apos;utilisateur de vérifier l&apos;exactitude, la conformité et la pertinence de
          tout contenu généré avant son utilisation ou son envoi à un tiers.
        </p>
      </LegalSection>

      <LegalSection title="Article 9 — Données et propriété">
        <p>
          Les données saisies par l&apos;utilisateur (clients, documents, tâches) restent sa propriété.
          Les modalités de traitement de ces données sont décrites dans la{" "}
          <Link className="text-gold hover:underline" href="/confidentialite">
            politique de confidentialité
          </Link>
          .
        </p>
      </LegalSection>

      <LegalSection title="Article 10 — Modification des CGV">
        <p>
          SaaSTom peut modifier les présentes CGV à tout moment. Les utilisateurs seront informés de
          toute modification substantielle. La poursuite de l&apos;utilisation du service après
          notification vaut acceptation des nouvelles CGV.
        </p>
      </LegalSection>

      <LegalSection title="Article 11 — Droit applicable et litiges">
        <p>
          Les présentes CGV sont soumises au droit français. En cas de litige, et après tentative de
          résolution amiable, les tribunaux compétents de Melun seront seuls compétents.
        </p>
      </LegalSection>
    </LegalPage>
  );
}
