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
    - [x] Reduire le nombre de redondance et de code inutile
- [ ] Faire une vérification complete de l'appli avec le django_debug.log
    - Lorsque je passe en debug : False, il ne trouve plus mon css / js
    - Dans mon environnement de Dev, tout est bon. Par contre au moment de distruber l'app... Donc j'attends de voir.
- [ ] Mettre en place expect_capture (sur donjon ?)
- [ ] **V2** Revoir toute la section **Quêtes** lorsque le guide est en rapport avec Tour du monde et Tornade des donjons
    - L'idée c'est de changer **Quêtes** en **Donjons** et que les succès affichent les donjons à la place des quêtes
- [ ] **V2** Ajouter un champ level aux succès et permettre l'affichage des succès par niveaux

<details>
<summary>Résolus</summary>

- Optimiser le code
    - [x] Enlever le dossier staticfiles
    - [x] Enlever les compresseurs en dev
    - [x] Revoir les turbo frames
- [x] Comprendre les fichier statiques en debug false + compression
- [x] Finir le système de tri du contenu selon l'alignement - En cours
- [x] Ajouter un toggle pour l'*alignement*, le mettre en storage.
- [x] Supprimer *LastSession*, rajouter un champ *is_last_seen* dans *GuideAchievement* pour sauvegarder l'achievement qui a été vu en dernier dans ce guide.
- [x] Revoir le fonctionnement du *selected_achievement* dans ma view *guide_detail*   
- [x] Enlever tout ce qui concerne le *achievement_id* dans guide_detail
- [x] Mettre en place la redirection vers le last_guide / last_achievement (la solution était plus simple : mettre simplement en place le dernier succès vu)
- [x] Supprimer *LastSession*, rajouter un champ *is_last_seen* dans *GuideAchievement* pour sauvegarder l'achievement qui a été vu en dernier dans ce guide.
- [x] Revoir le fonctionnement du *selected_achievement* dans ma view *guide_detail*   
- [x] Enlever tout ce qui concerne le *achievement_id* dans guide_detail
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


<details>
<summary>Résolus</summary>

- [x] Régler le probleme de redirection d'alignment_choice, turbo le prends pas..
- [x] Le toggleCompletion ne refresh pas auto le guide où la quête est doublon.
- [x] Problemes de "*content missing*" sur le succès "*Tout est en Ordre*" du guide "**Archipel de Valonia - Albuera**" (Vu qu'ici)
- [x] Icones d'alignements s'affichent en double *guide_detail*
- [x] Afficher les bonnes icones d'alignement
- [x] Problèmes à l'arrivée sur les guides 4 et 169
- [x] Le titre du succès dans quêtes ne se met pas à jour lors des cliques sur un succès différent (c'était du JS enfaite)
</details>

</details>


## Electron 
Distribution windows sous **Electron**.

<details>
<summary>Ouvrir</summary>

### Développer :

- [ ] **#1** Ajouter l'installation de Python pendant le script.
- [ ] **#2** Retirer le dossier static si c'est possible.
- [ ] **#3** Ajouter un loading screen au lancer.

<details>
<summary>Résolus</summary>

- [x] Comprendre comment utiliser Electron Forge
- [x] Faire un test de build
- [x] Le *validateAll* sur spam du bouton finit par ralentir un des processus, peut être le *clickNextAchievement*, ou peut être le render de quests    
- [x] S'assurer que lors de la fermeture de l'app via la X le terminal s'arrête (à vérif lorsqu'il y aura le .exe)
- [x] Résoudre *Electron Security Warning (Insecure Content-Security-Policy)*
- [x] Regler les gros problèmes de mémoires avec *Electron* (c'était la vidéo)
</details>

### Bogues :

- [ ] **#4** Les processus *Python* continuent de se réouvrir à la fermeture de l'app. (Semble s'être réglé, à observer)
    - Jerem n'a pas eu le problème ce qui ne m'aide pas.
- [x] **#1** L'installation demande des permissions *admin* pour installer les dépendences avec *pip*. 
- [x] **#2** Revoir la logique du script dans une certaine mesure. Il faudrait partager correctement la logique d'installation avec celle du lancement.
- [x] **#3** Dans le cas où le *#2* ne suffit pas, il faut revoir les events squirrel qui la plupart du temps empêche de lancer l'app du premier coup.

</details>


## Frontend
Développement frontend **templates Django**, **JavaScript**, **CSS / Less**.

<details>
<summary>Ouvrir</summary>

### Développer :

- **#1** Optimiser le code 
    - [ ] Vérifier les events js - En cours
    - Améliorer l'accessibilité
        - [ ] Changer la plupart de mes ul / li en divs - En cours
        - [ ] Remplir le alt des images - En cours
- [ ] **#3** Changer le pseudo discord de Skyzio en son youtube
- [ ] **#4** Media queries
- **V1.+** Réimplémenter les *clickNextAchievement*, *clickCurrentAchievement*
- **V1.+** Implémenter d'autres themes
    - Changer l'image background selon le thème
- **V2** Au survol d'une quête ou d'un succès dans les guides, mettre en surbrillance la quête et le succès.

<details>
<summary>Résolus</summary>

- Optimiser le code 
    - Améliorer l'accessibilité
        - [x] Aria label sur les liens
        - [x] Aria label sur les boutons
    - [x] Adapter le click JS en click sur la classe active seulement 
    - [x] Régler l'erreur *Form submission canceled because the form is not connected*
- [x] **#2** Mettre (remettre) un délais sur l'utilisation de *openAll* pour éviter qu'un con n'ouvre 100 onglets après avoir spam le btn.
- [x] Remplacer le pourcentage de progression pour les guides car c'est relativement incompatible avec ma mise en pratique du guide
- [x] Ajouter le passage au succès suivant lors de la validation manuelle des succès
- [x] Ajouter des eventlistener sur les fleches gauche et droite pour naviguer dans les *guides*
- [x] Ajouter des eventlistener sur les fleches du haut et du bas pour naviguer avec la *topNav*
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

- [ ] **#2** La *navigation clavier* : Je la laisse mais il faut prévenir de pas trop spam comme des dératés au risque de devoir relancer l'app.
- [ ] **#4** Le background du titre de l'achievement se perd lors du clique sur un achievement si plus de 2 quêtes sont complétés

<details>
<summary>Résolus</summary>

- [x] **#1** La *topNav* se réouvre lorsque **compress = true**. S : Le problème venait du fait que j'avais enlever **data-turbo-permanent** de *topNav*...
- [x] **#3** Résoudre *.active* qui disparait des succès lors de la validation des quêtes et qui empêche de leurs remettre. S : C'était un problème de comparaison entre achievement et last_seen_achievement
- [x] Moins flagrant sur le navigateur mais j'ai pu constater qu'il arrive malgré le disabled que lors du spam intense de *validateAll* des succès sont sautés. S : Probablement la compression.
- [x] La topNav ne galère plus par contre il faut que je mette un await sur la fermeture ou que je revois les setTimeout car le caret n'a pas le temps de se fermer. S : Comme pour les délais entre les guides.
- [x] Délais entre les changements des guides. S : La compression des assets, et le collectstatic règles tous les problèmes de latence.
- [x] Valider puis dévalider une seule quête cause le même problême: le bouton _validateAll_ ne prends plus la dite quête en compte et valide toute les autres. 
- [x] Lorsque je selectionne un guide et que je refresh la page, la *topNav* ne revient pas sur le dernier guide vu (scrollIntoView *nav.js*) S:Stocker la pos ?
- [x] Fix le JS de guide.js qui se dédouble après changemement de page
- [x] La topNav bug avec Electron, le toggleOpen galère
- [x] Le *clickCurrentAchievement* lorsqu'il n'y a plus de *nextAchievement* ne fonctionne pas
- [x] *validateAll* envoie vers */app/guide/x/quests/x* lorsque c'est le dernier succès de la liste, et lors de *doubles click*
- [x] Double les ouvertures de liens lors de *openAll*
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

- [ ] **#9** Mettre les guides présents à jours grâce à la maj du spreadsheet de Skyzio + améliorer le visuel de ceux existant.
- [ ] **#1** Rédiger tous les Guides - En cours (page 58: "Ali bonta 41")
- [ ] **#2** Rédiger 2/3 des guides
- [ ] **#3** Ajouter des guides de rappel de temps en temps
    - Exemple : quelques guides avant le Veilleur pour rappeler de ne pas aller au dela du level 114
- [ ] **#4** Ajouter un guide Rush Donjons après les Quêtes alignement Brak 41
- [ ] **#5** Ajouter un guide Rush Donjons après les Quêtes alignement Brak 20
- [ ] **#6** Dans le premier rush donjons entre alignement 0-4 et 4-16 : ajouter un if user.alignment = neutre pour afficher tous ceux à faire avec alignement.
- [ ] **#7** Rédiger 3/3 des guides
- [ ] **#8** Refaire les screens du tuto
    - Lorsque les bords n'ont pas de radius
    - L'image du passage sol invisible
- [ ] **V2** Combiné les guides ayant pour objectif la complétion d'un donjon
- [ ] **V2** Repenser la structure pour les succès Tour du monde et Tornade des donjons
    - Ajouter un succès Tour du monde et y mettre les 27 quêtes (donjons ?)
    - Pareil pour Tornade des donjons, ça ne refletera pas le vrai succès mais il se terminera bien au même moment.

<details>
<summary>Résolus</summary>

- [x] Ajouter un guide pour choisir son alignement
- [x] Faire le _README_ de l'app - En cours
- [x] **Garde à vous** et **Chef oui chef** du guide Quêtes d'alignements 4 à 16 affichent n'imp
- [x] Ajouter les succès aux guides avant rédaction
- [x] Rédiger 1/3 des guides
- [x] Faire le guide tuto
</details>

</details>

## Planning
<details>
<summary>Ouvrir</summary>

### 27 Novembre
<details>
<summary>Planning</summary>

#### Planning

#### Notes
La journée sera bonne si je rédige les 2/3 des guides et excellente si je résous le délais

#### Fin de journée
- À défaut d'avoir rédiger, j'ai ajouté tous les succès.
- J'ai clear un sacré paquet de dev et de bugs. Entre autre une partie du délais sur la nav des guides. 
- J'ai ajouté le support navigation au clavier et ma foi c'est pas vilain.
En conclusion, j'ai pas suivi le planning mais l'impression d'avoir fait plus que si je l'avais suivi.

</details>

### 28 Novembre
<details>
<summary>Planning</summary>

#### Planning

#### Notes
Prévoir un test de build en fin de journée après l'avancé des autres points.

#### Fin de journée
Encore pas de rédaction. Les pbs de front sont toujours là : le F > D > #3 (*clickNextAchievement*) est pour l'instant commenté.
Le *.active* sur les succès ne fonctionne toujours pas. Et enfin j'ai pas réussir à build l'app et je sens que ça ne va pas être simple.
Bref, une journée de merde.
En bon : J'ai compris comment servir les fichiers statics avec compression ce qui règle le gros problème de latence lors de la nav entre mes guides.

</details>

### 29 Novembre
<details>
<summary>Planning</summary>

#### Planning

#### Notes
Selon le test de la veille et l'état des bugs : Sortir la 0.9.0 build Electron.

#### Fin de journée
Galère avec le build toute la journée, *.active* bug toujours mais comme avant : lors du *validateAll*.
Aucune rédaction.

</details>

### 30 Novembre
<details>
<summary>Planning</summary>

#### Planning

#### Notes

#### Fin de journée
Toute la journée passée sur le script d'*Electron* et il reste des truc à faire comme revoir les events *squirrel* qui ne marchent pas correctement.
Et pas que, j'ai l'impression que le script n'aime pas le app.quit().
Aucune rédaction.

</details>

### 1 Décembre
<details>
<summary>Planning</summary>

#### Planning

#### Notes

#### Fin de journée
J'ai pu faire 3 des 4 points. Il me manque d'avoir un main.js totalement fonctionnel.

</details>

### 2 Décembre
<details>
<summary>Planning</summary>

#### Planning

#### Notes
J'ai le pourquoi du comment du bug, mettre en place la solution dans la matinée.
Ensuite rédiger si j'ai le temps.

#### Fin de journée
Je n'ai pas eu le temps d'incorporer Python, mais erreur code 1 c'est réglé.
J'ai tout juste avancé la rédaction.

### 3 Décembre
<details>
<summary>Planning</summary>

#### Planning

- 10h : **Rédaction** > *Rédiger* > #9 - MAJ guides + visu
- 11h : **Frontend** > *Bogues* > #2 - Prévention utilisation clavier
- 11h : **Frontend** > *Développer* > #3 - Icone Skyzio
- 12h : **RELEASE 1.0**

#### Notes
Sortie à midi max et derniers préparatifs le matin. Prévoir absolument 1h pour *compress* / *compilation* / *test* / *upload*.

#### Fin de journée
C'EST LE RUSH !!!

</details>

</details>
