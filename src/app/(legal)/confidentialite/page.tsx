import { LegalPage, LegalSection } from "@/components/legal-content";

export const metadata = {
  title: "Politique de confidentialité | SaaSTom",
};

export default function ConfidentialitePage() {
  return (
    <LegalPage title="Politique de confidentialité" updatedAt="10 juin 2026">
      <LegalSection title="Responsable du traitement">
        <p>
          Le responsable du traitement des données est Tom Lefrancois Bonnier, exerçant en
          Micro-Entreprise (SIRET 101 407 914 00015), domicilié 7 Grande Rue, 77114
          Villiers-sur-Seine. Pour toute question relative à vos données, vous pouvez le contacter à
          l&apos;adresse bonnier.tom10@gmail.com.
        </p>
      </LegalSection>

      <LegalSection title="Données collectées">
        <ul className="list-disc space-y-1 pl-5">
          <li><strong>Données de compte</strong> : nom, adresse email, mot de passe (stocké de manière chiffrée).</li>
          <li><strong>Données métier</strong> : informations sur vos clients, documents générés, tâches que vous saisissez dans l&apos;application.</li>
          <li><strong>Données de facturation</strong> : gérées directement par Stripe (SaaSTom ne stocke pas vos coordonnées bancaires, uniquement un identifiant client et d&apos;abonnement Stripe).</li>
          <li><strong>Données techniques</strong> : cookies de session nécessaires à l&apos;authentification.</li>
          <li><strong>Contenus transmis à l&apos;assistant IA</strong> : les informations que vous saisissez pour générer un document (nom du client, prestation, montants, etc.) sont transmises à notre fournisseur de modèles d&apos;IA pour produire le contenu demandé.</li>
        </ul>
      </LegalSection>

      <LegalSection title="Finalités du traitement">
        <ul className="list-disc space-y-1 pl-5">
          <li>Fournir et faire fonctionner le service SaaSTom (compte, authentification, sauvegarde de vos données).</li>
          <li>Gérer les abonnements et la facturation.</li>
          <li>Générer des documents et contenus via l&apos;assistant IA, à votre demande.</li>
          <li>Vous envoyer des emails transactionnels (confirmation d&apos;abonnement, réinitialisation de mot de passe).</li>
          <li>Assurer la sécurité du service et prévenir les usages frauduleux.</li>
        </ul>
      </LegalSection>

      <LegalSection title="Sous-traitants et destinataires des données">
        <p>Pour fonctionner, SaaSTom fait appel aux prestataires suivants, qui peuvent être amenés à traiter tout ou partie de vos données :</p>
        <ul className="list-disc space-y-1 pl-5">
          <li><strong>Vercel Inc.</strong> — hébergement de l&apos;application.</li>
          <li><strong>Neon</strong> — hébergement de la base de données (PostgreSQL).</li>
          <li><strong>Stripe</strong> — traitement des paiements et abonnements.</li>
          <li><strong>Resend</strong> — envoi des emails transactionnels.</li>
          <li><strong>Groq</strong> — fourniture du modèle d&apos;intelligence artificielle utilisé pour générer des documents.</li>
        </ul>
        <p>
          Ces prestataires n&apos;utilisent vos données que pour exécuter les services qui leur sont
          confiés et dans le cadre de leurs propres politiques de confidentialité. Vos données ne
          sont ni vendues ni utilisées à des fins publicitaires.
        </p>
      </LegalSection>

      <LegalSection title="Durée de conservation">
        <p>
          Vos données sont conservées tant que votre compte est actif. En cas de suppression de
          votre compte, vos données personnelles et données métier sont supprimées dans un délai
          raisonnable, sauf obligation légale de conservation plus longue (notamment en matière
          comptable et fiscale).
        </p>
      </LegalSection>

      <LegalSection title="Sécurité">
        <p>
          Les mots de passe sont stockés sous forme chiffrée (hachage). Les échanges entre votre
          navigateur et l&apos;application sont sécurisés via HTTPS. L&apos;accès à votre compte est
          protégé par un système d&apos;authentification avec session sécurisée.
        </p>
      </LegalSection>

      <LegalSection title="Cookies">
        <p>
          SaaSTom utilise uniquement des cookies strictement nécessaires au fonctionnement du
          service : un cookie de session d&apos;authentification et un cookie technique permettant de
          détecter la fermeture de votre navigateur pour vous déconnecter automatiquement. Aucun
          cookie de mesure d&apos;audience ou publicitaire n&apos;est utilisé.
        </p>
      </LegalSection>

      <LegalSection title="Vos droits">
        <p>
          Conformément au Règlement Général sur la Protection des Données (RGPD) et à la loi
          Informatique et Libertés, vous disposez d&apos;un droit d&apos;accès, de rectification, de
          suppression, de portabilité et d&apos;opposition concernant vos données personnelles. Vous
          pouvez exercer ces droits en nous contactant à l&apos;adresse bonnier.tom10@gmail.com.
        </p>
        <p>
          Si vous estimez, après nous avoir contactés, que vos droits ne sont pas respectés, vous
          pouvez adresser une réclamation à la CNIL (www.cnil.fr).
        </p>
      </LegalSection>

      <LegalSection title="Modification de la politique">
        <p>
          Cette politique de confidentialité peut être mise à jour à tout moment. La date de
          dernière mise à jour figure en haut de cette page.
        </p>
      </LegalSection>
    </LegalPage>
  );
}
