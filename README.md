# ENSET Room Booking App

Application de gestion des réservations de salles pour l'ENSET - Développée avec Next.js 16 et SQLite.

## 🚀 Démarrage Rapide

### Prérequis

- Node.js 20+
- pnpm (recommandé) ou npm

### Installation

```bash
# Cloner le dépôt
git clone https://github.com/alaaeddine-ahriz/enset-booking-app.git
cd enset-booking-app

# Installer les dépendances
pnpm install

# Compiler le module natif better-sqlite3
cd node_modules/.pnpm/better-sqlite3@*/node_modules/better-sqlite3
npm run build-release
cd -

# Initialiser la base de données avec des données de test
npx tsx lib/db/seed.ts

# Lancer le serveur de développement
pnpm dev
```

Ouvrir [http://localhost:3000](http://localhost:3000) 🎉

## 📁 Structure du Projet

```
├── app/
│   ├── api/              # Routes API
│   │   ├── rooms/
│   │   ├── reservations/
│   │   └── user/
│   ├── components/       # Composants UI réutilisables
│   ├── rooms/            # Pages des salles
│   ├── requests/         # Page admin des demandes
│   ├── reserve/          # Formulaire de réservation
│   └── profile/          # Profil utilisateur
├── lib/
│   ├── db/               # Base de données (SQLite)
│   ├── repositories/     # Couche d'accès aux données
│   ├── services/         # Logique métier
│   └── types.ts          # Types TypeScript
└── data/                 # Fichier SQLite (créé automatiquement)
```

## 🔌 Endpoints API

| Endpoint                 | Méthodes           | Description                        |
| ------------------------ | ------------------ | ---------------------------------- |
| `/api/rooms`             | GET                | Liste des salles (avec filtres)    |
| `/api/rooms/[id]`        | GET                | Détails salle + disponibilités     |
| `/api/reservations`      | GET, POST          | Lister/Créer des réservations      |
| `/api/reservations/[id]` | GET, PATCH, DELETE | Gérer une réservation              |
| `/api/user/me`           | GET                | Utilisateur courant + statistiques |

## 🛠️ Stack Technique

- **Framework** : Next.js 16 (App Router)
- **Base de données** : SQLite (better-sqlite3)
- **Styles** : Tailwind CSS 4
- **Langage** : TypeScript

## 🔄 Changer de Fournisseur de Base de Données

L'application utilise un Pattern Repository. Pour passer de SQLite à un autre fournisseur :

1. Créer les nouvelles implémentations dans `lib/repositories/`
2. Modifier `lib/services/index.ts` :

```typescript
import { SupabaseRoomRepository } from "../repositories/supabase";

function createRepositories() {
  return {
    rooms: new SupabaseRoomRepository(),
    // ...
  };
}
```

## 📝 Scripts Disponibles

```bash
pnpm dev          # Lancer le serveur de développement
pnpm build        # Build pour la production
pnpm start        # Lancer le serveur de production
npx tsx lib/db/seed.ts  # Réinitialiser la base de données
```

## 👥 Utilisateurs par Défaut

Après initialisation, ces comptes sont disponibles :

- **Souad Amitou** (Enseignante) - Utilisateur connecté par défaut
- **Prof. Ahmed**, **Prof. Fatima**, **Prof. Hassan** (Enseignants)
- **Admin User** (Administrateur)

---

Fait pour l'ENSET 🎓
