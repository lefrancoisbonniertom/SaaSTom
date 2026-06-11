import { LegalPage, LegalSection } from "@/components/legal-content";

export const metadata = {
  title: "Mentions légales | Orfeo",
};

export default function MentionsLegalesPage() {
  return (
    <LegalPage title="Mentions légales" updatedAt="10 juin 2026">
      <LegalSection title="Éditeur du site">
        <p>
          Le site et l&apos;application Orfeo sont édités par <strong>Tom Lefrancois Bonnier</strong>,
          exerçant en Micro-Entreprise (Entreprise Individuelle).
        </p>
        <ul className="list-disc space-y-1 pl-5">
          <li>Adresse : 7 Grande Rue, 77114 Villiers-sur-Seine, France</li>
          <li>SIREN : 101 407 914</li>
          <li>SIRET : 101 407 914 00015</li>
          <li>Code APE : 62.01Z</li>
          <li>TVA non applicable, article 293 B du Code général des impôts</li>
          <li>Email : bonnier.tom10@gmail.com</li>
          <li>Téléphone : 07 83 43 37 72</li>
        </ul>
      </LegalSection>

      <LegalSection title="Directeur de la publication">
        <p>Tom Lefrancois Bonnier.</p>
      </LegalSection>

      <LegalSection title="Hébergement">
        <p>L&apos;application est hébergée par :</p>
        <ul className="list-disc space-y-1 pl-5">
          <li>Vercel Inc., 440 N Barranca Ave #4133, Covina, CA 91723, États-Unis (vercel.com)</li>
          <li>La base de données est hébergée par Neon (neon.tech), un service serverless PostgreSQL.</li>
        </ul>
      </LegalSection>

      <LegalSection title="Propriété intellectuelle">
        <p>
          L&apos;ensemble des éléments composant Orfeo (textes, logos, interfaces, code source) est la
          propriété de Tom Lefrancois Bonnier, sauf mentions contraires. Toute reproduction,
          représentation, modification, publication ou adaptation, totale ou partielle, sans
          autorisation préalable est interdite.
        </p>
        <p>
          Les contenus générés par l&apos;assistant IA pour un utilisateur (devis, emails, documents,
          etc.) restent la propriété de cet utilisateur, qui en est seul responsable de l&apos;usage.
        </p>
      </LegalSection>

      <LegalSection title="Droit applicable et juridiction">
        <p>
          Les présentes mentions légales sont soumises au droit français. En cas de litige et à
          défaut de résolution amiable, les tribunaux compétents de Melun seront seuls compétents.
        </p>
      </LegalSection>
    </LegalPage>
  );
}
