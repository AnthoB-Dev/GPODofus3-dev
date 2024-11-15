## Backend

- [x] Finir le peuplement des quêtes dans achievements.json
- [x] Peupler la BDD avec le contenu de achievements.json
- [x] Peupler la BDD avec le contenu de guides.json
- [x] Créer un model "dungeon"
- [x] Penser la mise en place de la navigation.
- [x] Mettre en place Turbo
- [x] Mettre en place la navigation des guides.
- [x] Rendre les barres de navigation fonctionnels
- [x] Electron : actuellement l'ouverture de liens se fait avec une page electron. Je ne le veux pas.
- [x] Mettre en place les validation de quêtes
- [x] Mettre en place la bottom bar de Quêtes
- [x] Modifier les problêmes lié à _validAll_ qui ne peut pas enchainer les toggles (lié à la façon de render la view)
- [x] Mettre en place l'arrivée sur le dernier guide vu
- [x] Mettre en place l'arrivée sur le premier succès non à 100%
- [ ] Mettre en place expect_capture (sur donjon ?)
- [ ] Optimiser le code

## Frontend

- [x] Terminer le front
- [x] Comprendre pourquoi #prevision n'existe pas dans les autres guides. (Mauvais format à la redaction)
- [x] Sur hover des succès : faire en sorte que le title prenne toute la hauteur + border radius right 8px
- [x] Update auto des borders selon la complétion
- [x] Update auto des pourcents selon la complétion
- [x] Peupler le front avec les données du back
- [x] Changer les checkbox en un bouton de validation
- [x] Faire le style du drop down de _topNav_
- [ ] Rotate de 360 le caret de _topNav_ lorsque le drop est down
- [ ] Créer une fonction qui sauvegarde les achievements lors des event de click sur ces derniers
- [ ] Mettre en place le passage au succès suivant après un _validateAll_ plutôt que de recliquer sur l'actuel (confort + va permettre de mettre à jour achievementId)
- [ ] Repenser la structure pour les succès Tour du monde et Tornade des donjons
- [ ] Remplacer le pourcentage de progression pour les guides car c'est relativement incompatible avec ma mise en pratique du guide
- [ ] Enlever la video en background, elle se met à lag dans l'app Electron
- [ ] Media queries
- [ ] Implémenter d'autres themes

## Redaction

- [ ] Combiné les guides ayant pour objectif la complétion d'un donjon
- [ ] Définir les succès concernés sur chaque Guide (actuellement à "**A travers le Krosmoz**")
- [ ] Faire le _README_ de l'app

## Bogues

- [ ] Les event listener de click lorsque la _topNav_ est ouverte ne fonctionnent plus (pas?)
- [ ] Premier chargement de page : _validateAll_ ne fonctionne pas
- [ ] Lorsque je valide toute les quêtes individuellement, le bouton _validateAll_ ne se met pas à jour et reste sur valider tout.
- [ ] Valider puis dévalider une seule quête cause le même problême: le bouton _validateAll_ ne prends plus la dite quête en compte et valide toute les autres. Ce qui résulte en celle qui a été validée / dévalidée a rester dévalidée à moins de rappuyer sur le _validateAll_
