# TODO

## Backend
Developpement backend **Django**.

<details>
<summary>Ouvrir</summary>

### Développer :

- Optimiser le code
    - [ ] Enlever les dépendences non utilisées
    - [ ] Trouver un moyen de réduire la query pour les guides dans *guide_detail*
        - A chaque changement de guide, ils sont tous récupérés alors qu'il ne pourrait y en a avoir qu'une dizaine, 10 avant, 10 après
        - Mais il est possible que le cache des guides empeche un quelconque soucis avec l'état actuel, à voir
    - [ ] Reduire le nombre de redondance et de code inutile
- [ ] Finir le système de tri du contenu selon l'alignement - En cours
    - Actuellement les succès d'alignements se partagent TOUTES les quêtes sans tri. Ce qui fait qu'il y a des quêtes Brak dans Bonta..
- [ ] Revoir toute la section **Quêtes** lorsque le guide est en rapport avec Tour du monde et Tornade des donjons
    - L'idée c'est de changer **Quêtes** en **Donjons** et que les succès affichent les donjons à la place des quêtes
- [ ] Changer les fichiers static
    - Lorsque je passe en debug : False, il ne trouve plus mon css / js
- [ ] Ajouter un champ level aux succès et permettre l'affichage des succès par niveaux
- [ ] Mettre en place expect_capture (sur donjon ?)

<details>
<summary>Résolus</summary>

- Optimiser le code
    - [x] Enlever le dossier staticfiles
    - [x] Enlever les compresseurs en dev
    - [x] Revoir les turbo frames
        - [x] frame_main
        - [x] frame_guides
        - [x] frame_quests
        - [x] quest_frame_achievement_title
        - [x] quest_frame_id
        - [x] frame_objectives
        - [x] frame_achievements
- [x] Ajouter un toggle pour l'*alignement*, le mettre en storage.
    - [x] Mettre en place la logique de visibilité des guides selon l'*alignement*
- [x] Supprimer *LastSession*, rajouter un champ *is_last_seen* dans *GuideAchievement* pour sauvegarder l'achievement qui a été vu en dernier dans ce guide.
- [x] Revoir le fonctionnement du *selected_achievement* dans ma view *guide_detail*   
    - Definir la valeur de *selected_achievement* grâce au champ *is_last_seen* de *GuideAchievement*
- [x] Enlever tout ce qui concerne le *achievement_id* dans guide_detail
    - Actuellement ne rentre jamais dans le if achievement_id puisque la view ne le reçois jamais, c'est traité ailleurs
- [x] Mettre en place la redirection vers le last_guide / last_achievement (la solution était plus simple : mettre simplement en place le dernier succès vu)
- [x] Supprimer *LastSession*, rajouter un champ *is_last_seen* dans *GuideAchievement* pour sauvegarder l'achievement qui a été vu en dernier dans ce guide.
- [x] Revoir le fonctionnement du *selected_achievement* dans ma view *guide_detail*   
    - Definir la valeur de *selected_achievement* grâce au champ *is_last_seen* de *GuideAchievement*
- [x] Enlever tout ce qui concerne le *achievement_id* dans guide_detail
    - Actuellement ne rentre jamais dans le if achievement_id puisque la view ne le reçois jamais, c'est traité ailleurs
- [x] Mettre en place la sauvegarde du dernier achievement vu lors des cliques sur ces derniers (Ne sauvegarde que le premier du guide actuellement)
- [x] Créer une fonction pour les navs et les enlever de *guide_detail*
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
</details>

### Bogues :

- [ ] Régler le probleme de redirection d'alignment_choice, turbo le prends pas..
- [ ] Par contre à présent, le toggleCompletion ne refresh pas auto le guide où la quête est doublon comme il le devrait.
    Les quêtes ne sont pas individuelle, comme j'ai utilisé une quête préalablement utilisée, elle est validée partout où elle est présente, ce qui n'est pas un problème en soit vu qu'un des seul cas de figure où ça aura lieu ce sera dans les différents guides tornades des donjons / tour du monde.
    Par contre, le refresh ne fonctionne que lorsque la quête est validée dans son succès initial
    - Guide 4 "**A travers le Krosmoz**"  
    - Guide 169 "**Donjon : Nid du Kwakwa**" 
- [ ] Problemes de "*content missing*" sur le succès "*Tout est en Ordre*" du guide "**Archipel de Valonia - Albuera**" (Vu qu'ici)

<details>
<summary>Résolus</summary>

- [x] Afficher les bonnes icones d'alignement
    - Avec le nouveau champ User.alignment ça devrait être ez
- [x] Problèmes à l'arrivée sur les guides 4 et 169
    Les problèmes de redirection puis de content missing étaients liés au fait que ces guides avaient des succès mais pas de quêtes associées.
- [x] Le titre du succès dans quêtes ne se met pas à jour lors des cliques sur un succès différent (c'était du JS enfaite)
</details>

</details>


## Electron 
Distribution windows sous **Electron**.

<details>
<summary>Ouvrir</summary>

### Développer :

- [ ] Ajouter un loading screen au lancer
- [ ] Faire en sorte de bien avoir le nom et l'icone de l'app dans le gestionnaire des tâches (peut être que le build résoudra le pb ?)

<details>
<summary>Résolus</summary>

- [x] Le *validateAll* sur spam du bouton finit par ralentir un des processus, peut être le *clickNextAchievement*, ou peut être le render de quests    
- [x] S'assurer que lors de la fermeture de l'app via la X le terminal s'arrête (à vérif lorsqu'il y aura le .exe)
- [x] Résoudre *Electron Security Warning (Insecure Content-Security-Policy)*
- [x] Regler les gros problèmes de mémoires avec *Electron* (c'était la vidéo)
</details>

</details>


## Frontend
Développement frontend **templates Django**, **JavaScript**, **CSS / Less**.

<details>
<summary>Ouvrir</summary>

### Développer :

- Optimiser le code 
    - [ ] Vérifier les events js - En cours
    - Améliorer l'accessibilité
        - [ ] Changer la plupart de mes ul / li en divs - En cours
        - [ ] Remplir le alt des images - En cours
- [ ] Ajouter le passage au succès suivant lors de la validation manuelle des succès
- [ ] Empecher le *clickNextAchievement* lors de la *dévalidation*
- [ ] Remplacer le pourcentage de progression pour les guides car c'est relativement incompatible avec ma mise en pratique du guide
- [ ] Ajouter des eventlistener sur les fleches gauche et droite pour naviguer dans les *guides*
- [ ] Ajouter des eventlistener sur les fleches du haut et du bas pour naviguer avec la *topNav*
- [ ] Changer le pseudo discord de Skyzio en son youtube
- [ ] Au survol d'une quête ou d'un succès dans les guides, mettre en surbrillance la quête et le succès.
- [ ] Media queries
- [ ] Implémenter d'autres themes
    - [ ] Changer l'image background selon le thème

<details>
<summary>Résolus</summary>

- Optimiser le code 
    - Améliorer l'accessibilité
        - [x] Aria label sur les liens
        - [x] Aria label sur les boutons
    - [x] Adapter le click JS en click sur la classe active seulement 
    - [x] Régler l'erreur *Form submission canceled because the form is not connected*
- [x] Ajouter l'icon other.png
- [x] Ajouter un délais sur le clique du *validateAll*
- [x] Faire en sorte que le *validateAll* lors du dernier succès du guide reste sur le dernier succès (probablement doublon avec la ligne de dessus) 
- [x] Terminer le front
- [x] Comprendre pourquoi #prevision n'existe pas dans les autres guides. (Mauvais format à la redaction)
- [x] Sur hover des succès : faire en sorte que le title prenne toute la hauteur + border radius right 8px
- [x] Update auto des borders selon la complétion
- [x] Update auto des pourcents selon la complétion
- [x] Peupler le front avec les données du back
- [x] Changer les checkbox en un bouton de validation
- [x] Faire le style du drop down de _topNav_
- [x] Mettre en place le passage au succès suivant après un _validateAll_ plutôt que de recliquer sur l'actuel
- [x] Rotate de 180 le caret de _topNav_ lorsque le drop est down
- [x] Enlever la video en background, elle se met à lag dans l'app Electron
</details>

### Bogues :

- [ ] Fix le JS de guide.js qui se dédouble après changemement de page
- [ ] Enorme délais dans la pageNav dans le changement des guides. Observé sur navigateur légèrement mais avec Electron c'est flagrant et permanent. Observé aussi sur la topNav.
    - Plus le spam est rapide moins ça avance.
    - Je pense que c'est liés au fait de supprimer les events et de les rajouter fois, passé partout ça a rajouter pas mal de merde à executer au changement de guide, et puis c'est depuis ces changements que ça merde
    - Mais c'est peut être aussi simplement lié à la duplication restante à ce niveau là de l'app
- [ ] Le *clickCurrentAchievement* lorsqu'il n'y a plus de *nextAchievement* ne fonctionne pas
    - Le clic sur le dernier achievement à l'air de se produire vu que le bouton *validateAll* se met à jour mais le style de l'achievement ne change pas
- [ ] Moins flagrant sur le navigateur mais j'ai pu constater qu'il arrive malgré le disabled que lors du spam intense de *validateAll* des succès sont sautés.
    - Je n'ai heureusement pas réussi à empêcher la fin de l'action CàD la validation des succès. Par contre lorsqu'il est validé à 100, le suivant est sauté..
- [ ] La topNav ne galère plus par contre il faut que je mette un await sur la fermeture on que je revois les setTimeout car le caret n'a pas le temps de se fermer
    - C'est peut être chose puisque je peux l'ouvrir / fermer sans problemes, c'est seulement lors de la selection d'un guide.
- [ ] Lorsque je selectionne un guide et que je refresh la page, la *topNav* ne revient pas sur le dernier guide vu (scrollIntoView *nav.js*) S:Stocker la pos ?
- [ ] Le background du titre de l'achievement se perd lors du clique sur un achievement si plus de 2 quêtes sont complétés
- [ ] Valider puis dévalider une seule quête cause le même problême: le bouton _validateAll_ ne prends plus la dite quête en compte et valide toute les autres. Ce qui résulte en celle qui a été validée / dévalidée a rester dévalidée à moins de rappuyer sur le _validateAll_ ()

<details>
<summary>Résolus</summary>

- [x] La topNav bug avec Electron, le toggleOpen galère
- [x] *validateAll* envoie vers */app/guide/x/quests/x* lorsque c'est le dernier succès de la liste, et lors de *doubles click*
    - J'ai pu observer que les doubles click d'affilé sur *validateAll* cause le problème de manière casi certain.
    - Mais parfois un simple *validateAll* sur le dernier succès me fait la redirection.
- [x] Double les ouvertures de liens lors de *openAll*
    - Est dû au double listener turbo dans app.js
- [x] Le titre du succès dans quêtes ne change pas suite au focus
- [x] Lorsque je valide toute les quêtes individuellement, le bouton _validateAll_ ne se met pas à jour et reste sur valider tout.
- [x] Refaire fonctionner la *topNav* qui est en partie cassé depuis le styling
- [x] Les event listener de click lorsque la _topNav_ est ouverte ne fonctionnent plus (pas?) pour fermer la nav
- Problèmes sur le premier chargement de la page qui ne prends pas le js en compte
    - [x] Le focus sur le premier succès non complété ne se fait pas lors de l'arrivée
    - [x] _validateAll_ ne fonctionne pas
</details>

</details>


## Redaction
Contenu de l'application.

<details>
<summary>Ouvrir</summary>

### Rédiger :

- [ ] Rédiger tous les Guides - En cours (page 58: "Ali bonta 41")
- [ ] Rédiger 2/3 des guides
- [ ] Ajouter des guides de rappel de temps en temps
    - Exemple : quelques guides avant le Veilleur pour rappeler de ne pas aller au dela du level 114
- [ ] Ajouter un guide Rush Donjons après les Quêtes alignement Brak 41
- [ ] Ajouter un guide Rush Donjons après les Quêtes alignement Brak 20
- [ ] Ajouter un guide pour choisir son alignement
- [ ] Dans le premier rush donjons entre alignement 0-4 et 4-16 : ajouter un if user.alignment = neutre pour afficher tous ceux à faire avec alignement.
- [ ] **Garde à vous** et **Chef oui chef** du guide Quêtes d'alignements 4 à 16 affichent n'imp
- [ ] Ajouter un succès pour les Donjons à la manière des alignements
- [ ] Rédiger 3/3 des guides
- [ ] Combiné les guides ayant pour objectif la complétion d'un donjon
- [ ] Repenser la structure pour les succès Tour du monde et Tornade des donjons
    - Ajouter un succès Tour du monde et y mettre les 27 quêtes (donjons ?)
    - Pareil pour Tornade des donjons, ça ne refletera pas le vrai succès mais il se terminera bien au même moment.
- [ ] Faire le _README_ de l'app - En cours

<details>
<summary>Résolus</summary>

- [x] Ajouter les succès aux guides avant rédaction
- [x] Rédiger 1/3 des guides
- [x] Faire le guide tuto
</details>

</details>

## Planning

<details>
<summary>Planning</summary>

<details>
<summary>27 Novembre</summary>
Se lis : "jusqu'à XXh"

- 13h : **Rédaction** > *Rédiger* > #1
- 16h : **Frontend** > *Bogues* > #2
- 19h : **Backend** > *Bogues* > #1
- 22h : **Rédaction** > *Rédiger* > #2
- 00h : **Rédaction** > *Rédiger* > #3

Note : La journée sera bonne si je rédige les 2/3 des guides et excellente si je résous le délais
</details>

<details>
<summary>28 Novembre</summary>

- 13h : TODO
- 16h : TODO
- 19h : TODO
- 22h : TODO
- 00h : TODO

Note : 
</details>

<details>
<summary>29 Novembre</summary>

- 13h : TODO
- 16h : TODO
- 19h : TODO
- 22h : TODO
- 00h : TODO

Note : 
</details>

<details>
<summary>30 Novembre</summary>

- 13h : TODO
- 16h : TODO
- 19h : TODO
- 22h : TODO
- 00h : TODO

Note : 
</details>

<details>
<summary>1 Décembre</summary>

- 13h : TODO
- 16h : TODO
- 19h : TODO
- 22h : TODO
- 00h : TODO

Note : 
</details>

<details>
<summary>2 Décembre</summary>

- 13h : TODO
- 16h : TODO
- 19h : TODO
- 22h : TODO
- 00h : TODO

Note : 
</details>

</details>
