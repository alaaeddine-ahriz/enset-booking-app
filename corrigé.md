# Corrigé – Étude de cas « Application de réservation de salles »

---

## 1. Product Backlog priorisé et estimé

| ID  | Backlog Item (épique / user story / tâche)                                                                 | Type       | Priorité (1 = très élevée) | Estimation (story points) |
| --- | ---------------------------------------------------------------------------------------------------------- | ---------- | -------------------------- | ------------------------- |
| 1   | En tant qu’enseignant, je veux m’authentifier et accéder à mon compte.                                     | User story | 1                          | 5                         |
| 2   | En tant qu’admin, je veux gérer les rôles (création compte enseignant, admin).                             | User story | 1                          | 8                         |
| 3   | Consultation du planning des salles sous forme de calendrier (vue par jour/semaine).                       | User story | 1                          | 8                         |
| 4   | En tant qu’enseignant, je veux créer une demande de réservation de salle en ligne.                         | User story | 1                          | 13                        |
| 5   | Gestion automatique des conflits de réservation (détection de chevauchement horaire).                      | User story | 2                          | 8                         |
| 6   | Workflow de validation des réservations par l’administration (accepter / refuser / commenter).             | User story | 2                          | 8                         |
| 7   | Génération de rapports d’occupation des salles (par jour, semaine, mois).                                  | User story | 3                          | 13                        |
| 8   | Tableau de bord admin : vue centralisée des réservations et filtre par salle / date / enseignant.          | Épique     | 3                          | 20                        |
| 9   | Tâche technique : architecture de l’application web (choix techno front/back, BDD, déploiement initial).   | Tâche      | 1                          | 5                         |
| 10  | Tâche technique : configuration de Jira (projet Scrum, board, colonnes, workflows) et gestion des sprints. | Tâche      | 2                          | 3                         |
| 11  | Tâche technique : tests et sécurité (authentification, droits d’accès, tests unitaires principaux).        | Tâche      | 2                          | 5                         |

Remarque : les items 1–6 et 9 sont candidats pour le **premier sprint** (MVP fonctionnel : réservation simple avec validation et gestion des rôles).

---

## 2. User Stories (4) avec critères d’acceptation et tâches

### 2.1. Enseignant – Consultation de la disponibilité

**User story 1 (Enseignant)**

- **Formulation**  
  En tant qu’enseignant, je veux consulter un planning des salles afin de choisir un créneau disponible avant de faire ma réservation.

- **Critères d’acceptation**

  - L’enseignant voit un calendrier affichant toutes les salles autorisées pour lui.
  - Les créneaux occupés apparaissent clairement (couleur ou icône).
  - Il est possible de filtrer par salle, date et plage horaire.
  - Le système répond en moins de quelques secondes pour une requête de planning standard.

- **Tâches éventuelles**
  - Concevoir la page « Planning » (UX/UI).
  - Implémenter l’API de récupération des réservations par salle/date.
  - Intégrer le composant calendrier côté front-end.
  - Écrire des tests simples (affichage, filtre).

---

### 2.2. Enseignant – Création d’une réservation

**User story 2 (Enseignant)**

- **Formulation**  
  En tant qu’enseignant, je veux créer une demande de réservation de salle en ligne afin d’éviter le formulaire papier et gagner du temps.

- **Critères d’acceptation**

  - Le formulaire permet de saisir : salle, date, heure début, heure fin, type de cours, commentaire.
  - À la soumission, le système vérifie la disponibilité de la salle.
  - En cas de conflit, l’enseignant reçoit un message d’erreur explicite avec suggestion de créneaux libres (si possible).
  - En cas de succès, la réservation est enregistrée avec le statut « en attente de validation ».
  - L’enseignant reçoit une confirmation (écran + éventuellement email).

- **Tâches éventuelles**
  - Conception du modèle de données « Réservation ».
  - Développement du formulaire de réservation.
  - Implémentation de la logique de détection de conflit.
  - Tests de validation (cas conflit / pas conflit).

---

### 2.3. Administration – Validation des réservations

**User story 3 (Admin)**

- **Formulation**  
  En tant qu’administrateur, je veux voir toutes les demandes de réservation en attente afin de les accepter ou refuser en fonction des contraintes de l’établissement.

- **Critères d’acceptation**

  - Un écran liste les demandes « en attente » triées par date de création.
  - Pour chaque demande, l’admin voit : enseignant, salle, date, créneau, statut courant.
  - L’admin peut changer le statut en « accepté » ou « refusé » et ajouter un commentaire.
  - Lorsqu’une réservation est acceptée, elle devient visible comme « confirmée » sur le planning enseignant.
  - L’enseignant est notifié du changement de statut.

- **Tâches éventuelles**
  - Conception de la vue liste des demandes en attente.
  - Création de l’API de changement de statut.
  - Mise à jour temps réel ou rafraîchissement de la liste après action.
  - Tests d’autorisation (seuls les admins voient cette page).

---

### 2.4. Administration – Rapports et vue centralisée

**User story 4 (Admin)**

- **Formulation**  
  En tant qu’administrateur, je veux générer des rapports d’occupation des salles afin d’analyser le taux d’utilisation et optimiser la planification.

- **Critères d’acceptation**

  - L’admin peut sélectionner une période (semaine, mois, semestre).
  - Le système calcule pour chaque salle : nombre d’heures réservées, taux de remplissage, plages sous-utilisées.
  - Les résultats sont affichés sous forme de tableau (et éventuellement graphiques simples).
  - Il est possible d’exporter les données en CSV ou PDF.
  - Les rapports ne doivent afficher que des données issues des réservations « acceptées ».

- **Tâches éventuelles**
  - Implémenter les requêtes d’agrégation sur la base de données.
  - Développer l’interface « Rapports ».
  - Export CSV/PDF.
  - Tests de cohérence des chiffres sur un jeu de données de test.

---

## 3. Organisation d’un sprint de deux semaines (Scrum)

Hypothèse : sprint de **2 semaines = 10 jours ouvrés**. Outil principal : **Jira Software**.

### 3.1. Sprint Planning (Jour 1 – ~4h)

- Le Product Owner présente l’objectif du sprint : par exemple, _« Permettre aux enseignants de créer des réservations en ligne et aux admins de les valider »_.
- L’équipe sélectionne les items du Product Backlog avec priorité élevée : IDs 1, 2, 3, 4, 5, 6, 9 (par exemple).
- Chaque user story est décomposée en tâches techniques dans Jira (front-end, back-end, tests, intégration).
- La capacité de l’équipe (en points et en jours) est vérifiée afin de ne pas surcharger le sprint.
- Le Sprint Backlog est finalisé et un Sprint Goal clair est défini.

### 3.2. Exécution du sprint et Daily Scrum (Jours 1–10)

- **Daily Scrum** : réunion quotidienne de 15 minutes, debout, avec toute l’équipe.
  - Chaque membre répond à trois questions :
    1. Ce que j’ai fait depuis la dernière Daily.
    2. Ce que je prévois de faire aujourd’hui.
    3. Les obstacles éventuels.
- Le tableau Jira (colonnes typiques : _To Do_, _In Progress_, _In Review_, _Done_) permet de suivre l’avancement.
- Un **burndown chart** permet de vérifier si le rythme du sprint permet d’atteindre l’objectif.
- Les tests unitaires et d’intégration sont exécutés au fil de l’eau (pas uniquement en fin de sprint).

### 3.3. Sprint Review (Fin du jour 10 – ~2h)

- L’équipe démontre l’incrément potentiellement livrable :
  - Authentification, consultation de planning, création de réservation, validation par l’admin.
- Les parties prenantes (administration ENSET, représentants enseignants) donnent un retour :
  - Ergonomie, besoins complémentaires, priorités pour le sprint suivant.
- Le Product Owner met à jour le Product Backlog en fonction des remarques (ajout/modification/priorisation d’items).

### 3.4. Sprint Retrospective (Fin du jour 10 – ~1h30)

- Réunion interne, sans client, focalisée sur l’amélioration du processus.
- Exemples de questions :
  - Ce qui a bien fonctionné (communication, utilisation de Jira, qualité du code).
  - Ce qui a moins bien fonctionné (estimation, dépendances non anticipées, bugs récurrents).
  - Actions d’amélioration concrètes pour le prochain sprint (ex. mieux découper les user stories, renforcer les tests automatisés).
- Les actions sont ajoutées au Backlog d’amélioration interne et suivies dans Jira.

---

## 4. Barème proposé (/20)

### Partie 1 – Product Backlog (8 points)

- Respect du format (ID, description, priorité, estimation) : **2 pts**
- Cohérence de la priorisation (items cœur du besoin mis en avant) : **3 pts**
- Réalisme des estimations et distinction épique / story / tâche : **3 pts**

### Partie 2 – User Stories (8 points)

- Formulation correcte des 4 stories (rôle, besoin, valeur) : **3 pts**
- Pertinence fonctionnelle par rapport au cas (2 enseignant, 2 admin) : **2 pts**
- Qualité et précision des critères d’acceptation : **3 pts**

### Partie 3 – Organisation du sprint (4 points)

- Description structurée des cérémonies Scrum (planning, daily, review, rétro) : **3 pts**
- Prise en compte de la durée du sprint et de l’usage de Jira / suivi (capacité, board, burndown) : **1 pt**

**Total : 8 + 8 + 4 = 20 points**
