# Product Requirements Document – Application de gestion des réservations de salles

1. Contexte et objectif

L’ENSET souhaite moderniser le système de réservation des salles. Le processus actuel repose sur des formulaires papier et génère :
	•	délais de traitement importants
	•	conflits d’occupation
	•	faible visibilité sur la disponibilité des salles

Objectif principal : concevoir une application web simple permettant la réservation, la validation et le suivi d’occupation des salles de cours.

⸻

2. Utilisateurs cibles et rôles

2.1 Enseignants
	•	consulter les disponibilités des salles
	•	effectuer des réservations simples et récurrentes

2.2 Administration
	•	valider ou refuser les demandes
	•	gérer et modifier les réservations
	•	générer des rapports d’utilisation
	•	vue centralisée de l’occupation

2.3 Étudiants
	•	consulter les salles et créneaux attribués
	•	lecture seule

2.4 Gestion des comptes
	•	comptes locaux
	•	administration globale et centralisée

⸻

3. Périmètre fonctionnel

3.1 Réservation
	•	réservation unique
	•	réservation récurrente
	•	gestion des conflits de réservation
	•	historique des demandes et statuts

3.2 Validation administrative
	•	workflow simple : demandée → validée/refusée
	•	capacités de modification / annulation par l’administration

3.3 Consultation des disponibilités
	•	affichage par :
	•	salle
	•	bâtiment
	•	date
	•	vue calendrier / planning

3.4 Gestion des ressources
	•	création / mise à jour des salles
	•	caractéristiques :
	•	nom
	•	type (amphi, salle, labo)
	•	capacité
	•	bâtiment
	•	équipements :
	•	projecteur
	•	télé
	•	tables
	•	chaises
	•	tableau blanc

3.5 Rapports d’utilisation
	•	taux d’occupation global
	•	occupation par salle
	•	historique des réservations

⸻

4. Contraintes techniques
	•	application web accessible via navigateur
	•	architecture simple (MVP)
	•	support desktop et mobile responsive

4.1 Stack choisie
	•	Frontend & Backend : Next.js
	•	Base de données : Supabase
	•	Authentification : Supabase Auth

⸻

5. Spécifications non fonctionnelles
	•	simplicité d’usage prioritaire
	•	performance suffisante pour usage établissement
	•	disponibilité correcte sans haute criticité
	•	sécurité basique côté authentification et autorisation
	•	évolutivité pour futures fonctionnalités (intégrations ultérieures)

⸻

6. Hors périmètre (MVP)

Les éléments suivants ne sont pas inclus pour l’instant :
	•	intégration systèmes externes (emploi du temps, Google/Outlook)
	•	SSO institutionnel
	•	notifications SMS
	•	gestion multietablissement
	•	analytics avancées
