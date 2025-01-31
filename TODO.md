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
- [ ] **V1.0.4^** Permettre l'arrivée sur le dernier guide vu de la version précédente lors d'un chargement de progression.
    - Ça devrait être assez simple en sauvegardant le dernier guide vu dans *global* de mon JSON et une fois tout chargé depuis *views*, rediriger. L'autre avantage c'est qu'il n'y aurait pas à changer manuellement de guide pour refresh.
- [ ] **V1.0.4^** Ajouter un champ *icone* dans *Guide* et ainsi afficher une icone pour simplifier la navigation.
    - Guides qui pourraient en bénéficier : **Alignements**, **donjons**, **informations**, **Dofus**
- [ ] **V1.0.4^** Retirer l'obligation d'avoir le champs *level* de rempli et enlever le niveau des guides **infos**.
- [ ] **V1.+** Mettre en place donjons.
- [ ] **V1.+** Revoir toute la section **Quêtes** lorsque le guide est en rapport avec Tour du monde et Tornade des donjons.
    - L'idée c'est de changer **Quêtes** en **Donjons** et que les succès affichent les donjons à la place des quêtes.
- [ ] **V1.+** Ajouter un champ level aux succès et permettre un tri des succès par niveaux.
- [ ] **V1.+** Ajouter un système de rappel activable / désactivable comme pour les quêtes pandala qui demande 24h d'attente.

<details>
<summary>Résolus</summary>

- Optimiser le code
    - [x] Enlever le dossier staticfiles
    - [x] Enlever les compresseurs en dev
    - [x] Revoir les turbo frames
- [x] Ajouter un champ position pour les quêtes / succès pour géré le triage dans le cas où y'a besoin de les changés de place.
- [x] Faire une vérification complete de l'appli avec le django_debug.log
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

- [ ] **#1** Le *validate* des quêtes du succès **Donjons avancés** ne rafraichissent pas le succès et donc ni son pourcentages, ni sa bordure.
    - Lorsque je suis en alignement Neutre, ça fonctionne.


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

- [ ] **#1** Ajouter l'installation de Python pendant le script (avec l'installateur).
- [ ] **#4** Éffacer le dossier *dependencies* une fois utilisé.
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

- [ ] **#5** Supprimer le Python embarqué puisqu'il ne sert à rien une fois installé (A voir néanmoins si ça ne va pas poser de problèmes avec l'updating) 135Mo à libéré
    J'ai perdu pas mal de temps à essayer, le problème c'est que j'ai besoin de redéfinir les variables pathExec et pythonPath (qui se fait actuellement dans ensureVenvExists()) car si je n'appel pas ensureVenvExists() avant de suppr libs, j'ai des erreurs :
      [debug] createWindow
      [info]  Création de la fenêtre principale.
      [info]  Fenêtre principale créée. Fin du processus.
      [debug] Fn - deleteFolders
      [debug] handleFirstRun complété.
      [error] stderr : did not find executable at 'C:\Users\bonis\AppData\Local\GPODofus3\app-1.0.5\resources\app\libs\python\WPy64-31310\python\python.exe': Le fichier sp�cifi� est introuvable.



      [error] Erreur lors de la vérification des dépendances : La commande a échouée avec le code 103
      [info]  Une ou plusieurs dépendances sont manquantes. Installation...
      [debug] Fn - installDependencies
      [info]  Installation des dépendances...
      [info]  Installation via pip...
      [info]  CMD C:\Users\bonis\AppData\Local\GPODofus3\app-1.0.5\venv\Scripts\pip.exe install,--no-cache-dir,-r,C:\Users\bonis\AppData\Local\GPODofus3\app-1.0.5\resources\app\requirements.txt,--default-timeout=600 [object Object] exécutée.
      [error] stderr : did not find executable at 'C:\Users\bonis\AppData\Local\GPODofus3\app-1.0.5\resources\app\libs\python\WPy64-31310\python\python.exe': Le fichier sp�cifi� est introuvable.



      [error] Erreur lors de l'installation des dépendances : Error: La commande a échouée avec le code 103
          at ChildProcess.<anonymous> (C:\Users\bonis\AppData\Local\GPODofus3\app-1.0.5\resources\app\scripts\electron\squirrelEventsHandlers.js:58:16)
          at ChildProcess.emit (node:events:518:28)
          at maybeClose (node:internal/child_process:1104:16)
          at ChildProcess._handle.onexit (node:internal/child_process:304:5)

    Il faut que je les redéfinissent mais avant de les appelés dans deleteFolders()
- [ ] **#6** Réabiliter l'installation via source code (N'est plus prio puisque l'installeur fonctionne)
- [x] **#4** Les processus *Python* continuent de se réouvrir à la fermeture de l'app. (Semble s'être réglé, à observer)
- [x] **#1** L'installation demande des permissions *admin* pour installer les dépendences avec *pip*. 
- [x] **#2** Revoir la logique du script dans une certaine mesure. Il faudrait partager correctement la logique d'installation avec celle du lancement.
- [x] **#3** Dans le cas où le *#2* ne suffit pas, il faut revoir les events squirrel qui la plupart du temps empêche de lancer l'app du premier coup.

</details>


## Frontend
Développement frontend **templates Django**, **JavaScript**, **CSS / Less**.

<details>
<summary>Ouvrir</summary>

### Développer :

- [ ] **#2** Au démarrage de l'application les liens du dernier guide, celui ouvert, ne sont pas cliquable.
- **#1** Optimiser le code 
    - [ ] Vérifier les events js - En cours
- [ ] **#4** Media queries
- **V1.+** Réimplémenter les *clickNextAchievement*, *clickCurrentAchievement*
- **V1.+** Ajouter une recherche
    - De guide
    - De quête
- **V1.+** Implémenter d'autres themes
    - Changer l'image background selon le thème
- **V1.+** Au survol d'une quête ou d'un succès dans les guides, mettre en surbrillance la quête et le succès.

<details>
<summary>Résolus</summary>

- Optimiser le code 
    - Améliorer l'accessibilité
        - [x] Changer la plupart de mes ul / li en divs - En cours
        - [x] Remplir le alt des images - En cours
        - [x] Aria label sur les liens
        - [x] Aria label sur les boutons
    - [x] Adapter le click JS en click sur la classe active seulement 
    - [x] Régler l'erreur *Form submission canceled because the form is not connected*
- [x] **#3** Changer le pseudo discord de Skyzio en son youtube
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
- [ ] **#4** Le background du titre de l'achievement se perd lors du clique sur un achievement si plus de 2 quêtes sont complétés.
- [ ] **#5** *Valider tout* reste disabled en cas de changement de guide alors que la validation des guides n'est pas fini.

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

- [ ] **#1** Rédiger tous les Guides
- [ ] **#4** Ajouter un guide Rush Donjons après les Quêtes alignement Brak 41
- [ ] **V1.+** Combiné les guides ayant pour objectif la complétion d'un donjon
- [ ] **V1.+** Repenser la structure pour les succès Tour du monde et Tornade des donjons
    - Ajouter un succès Tour du monde et y mettre les 27 quêtes (donjons ?)
    - Pareil pour Tornade des donjons, ça ne refletera pas le vrai succès mais il se terminera bien au même moment.

<details>
<summary>Résolus</summary>

- [x] **#9** Ajouter les copyrights 
- **#3** Ajouter des guides de rappel de temps en temps
- [x] **#8** Mettre à jour les guides selon le GPO v3.0 de Skyzio 
- [x] **#10** Ajouter les numéros de quêtes aux quêtes d'alignement
- [x] **#5** Ajouter un guide Rush Donjons après les Quêtes alignement Brak 20
- [x] **#8** Refaire les screens du tuto
- [x] Ajouter un guide pour choisir son alignement
- [x] Faire le _README_ de l'app - En cours
- [x] **Garde à vous** et **Chef oui chef** du guide Quêtes d'alignements 4 à 16 affichent n'imp
- [x] Ajouter les succès aux guides avant rédaction
- [x] Rédiger 1/3 des guides
- [x] Faire le guide tuto
</details>

</details>

</details>
