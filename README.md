# SaaSTom

SaaSTom est un projet de SaaS IA pour aider les independants, freelances et petites entreprises a gerer leur activite : clients, documents, relances, propositions commerciales et taches.

## MVP vise

- Dashboard business avec indicateurs cles
- Assistant IA pour generer emails, devis et propositions
- Suivi clients simple type CRM
- Historique des documents generes
- Futur modele freemium : gratuit limite, puis abonnement Pro

## Stack actuelle

- Next.js App Router
- TypeScript
- Tailwind CSS
- lucide-react pour les icones
- SQLite local avec Prisma Client et better-sqlite3

## Lancer le projet

Installe les dependances, prepare le client Prisma, puis lance le serveur :

```bash
cp .env.example .env
npm install
npm run db:generate
npm run dev
```

Ouvre [http://localhost:3000](http://localhost:3000) dans le navigateur.

## Donnees locales

- La base SQLite locale est stockee dans `prisma/dev.db`.
- Les tables sont creees automatiquement au premier appel API.
- Les donnees de demo peuvent etre remises a zero depuis `/settings`.
- `DATABASE_URL` est documente dans `.env.example`.

## Fonctionnalites disponibles

- Dashboard avec indicateurs, pipeline client et documents recents
- Assistant IA de demo qui genere et enregistre des documents
- CRM simple avec ajout de clients
- Historique de documents avec recherche et preview
- Routes API Next pour lire/ecrire dans SQLite

## Prochaines etapes

- Ajouter une vraie authentification
- Connecter un vrai modele IA
- Passer de SQLite local a PostgreSQL avant une mise en production
- Ajouter une page facturation et des limites par abonnement

## Scripts utiles

```bash
npm run dev
npm run lint
npm run build
npm run db:generate
```

Pour ouvrir Prisma Studio en local :

```bash
npm run db:studio
```
