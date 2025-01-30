# v.1.0.6 Release
Comme j'ai pu me concentrer sur la rédaction cette semaine, j'ai pu bien avancer et voilà donc tous les guides de niveau 140, 150 et 160.

À vu de nez je dirais qu'il me reste 2 semaines de travail pour finir la rédaction de ce qu'il manque, maitenant pas sûr que ce soit fini sous 2 semaines avec la sortie de Kingdome Come : Deliverance II qui arrive... Je vais faire de mon mieux, promis.

Ensuite j'ai réutilisé les premiers guides pour test un perso et me suis me rendu compte qu'ils pourraient être améliorés, une nouvelle fois, avec plus de directives pour faciliter la compréhension. Comme c'est le cas dans mes dernières rédactions où j'ai pas eu le choix vu le casse tête des guides Frigost et Pandala...


## Changelogs

### v1.0.6 Release

<details>
<summary>Voir les détails</summary>

## Général

### Ajouts
- Ajout des copyrights


## Guides
Les guides 140, 150 et 160 ont été rédigés.

### Modifications
- Mise à jour des titres de certains guides pour correspondre à ceux de Skyzio. Je ne met pas le détail puisque ça concerne des guides qui n'étaient plus visible depuis la 1.0.2
- Frigost : Le Royalmouth
  - Amélioration des instructions globales du guide + du passage du donjon.
  - Ajout de la mention de la quête Antiroyaliste.
  - Correction sur les instructions donnés pour la quête Bienvenue à Frigost.
  - Ajout d'une explication quant au choix concernant la quête Agriculture ou Alchimie.
  - Ajustement des Objectifs.

### Ajouts
- Frigost : Les Pins Perdus & Le Lac Gelé
- Quêtes d'alignement : 60 + Ordre 3 (Bonta)
- Quêtes d'alignement : 60 + Ordre 3 (Brâkmar)
- Bleu Turquoise - 2 / 5 - Troisième Dofus Primordial
- Royaume d'Amakna : L'art de la langue de bois
- Pandala : Sous des nuages de cendre 
- Frigost - Le Berceau d'Alma
- Bleu Turquoise - 3 / 5 - Troisième Dofus Primordial
- Frigost - Les Larmes d'Ouronigride
- Quêtes d'alignement : 70 (Bonta)
- Quêtes d'alignement : 70 (Brâkmar)
- Forêt Maléfique - Fin

### Suppression
- Quêtes de Silvosse - Partie 2
- Rush Donjons - 8
- Tour du Monde - Fin
- Frigost - Le Berceau d'Alma Pt 2


## Succès

### Modifications 
- Les survivants de Frigost
  - Ajout de l'icone à prévoir : Capture.

### Ajouts
- Forage à tout va
- Les carrières de glace


## Quêtes

### Ajouts
- Pêche en eaux gelées
- Il est frais mon pichon
- Hôtel de glace
- La fonte des glaces
- L'ombre et la glace
- Lumière sur l'ombre
- Qu'est-ce qu'on a fait des tuyaux ?
- Lâcher les gaz


</details>




### v1.0.5 Release

<details>
<summary>Voir les détails</summary>

## Général

Plus de détails sur la [refonte de l'installation](#refonte-de-linstallation) plus bas. 

### Modifications
- Refonte total du fichier de configuration de l'application Electron. Et particulièrement l'installation.
- Ajustement de la partie Installation du README.

### Ajouts
- Ajout d'une fenêtre indiquant que l'installation est en cours.
- Ajout d'un "splash screen" qui est une fenêtre de chargement qui s'affiche le temps que l'app se charge.
- Ajout de Python 3.13.1 dans l'application et ainsi retirer cette dépendance.


## Guides
Ajout de tous les guides 130.

### Modifications

- "Astrub : Introduction au background et avancée du personnage" 
  - Paragraphes oubliés ajoutés.
  - Ajout de section à dévoiler via "Afficher" pour rendre le guide plus digeste.
  - Affinement des explications et du formatage des paragraphes liés aux donjons.
  - Ajout des changelogs de la version 1.0.5.
- "Frigost : Le Royalmouth"
  - Ajout de la mention "accomplir le donjon"
- "Pourpre Profond - 2 / 3 - Second Dofus Primordial"
  - Correction de plusieurs fautes dans les explications par rapport à la quête "Le trésor de Totankama" principalement.
- "Cania : Ça en valait la plaine"
  - Ajout de la mention de la quête "Jeu de Trooll"
- "Le Campement des Bworks et Gobelins"
  - Ajout de la mention de la quête "Jeu de Trooll" et du succès "Ça en valait la plaine"

### Ajouts

- "Srambad Chapitre 1 : Capitaine Ekarlatte"
- "Pourpre Profond - 3 / 3 - Second Dofus Primordial"
- "Cania : Ça en valait la plaine - Fin"
- "Saharach : Territoire Cacterre"
- "Pandala : Des larmes de pierres"

### Suppression

- "Pandala 1 - Le Dojo"


## Succès

### Modifications 
- "Au clair de la dune"
  - Ajout de demande : donjon.
- "Des larmes de pierres"
  - Changement de l'ordre d'affichage des quêtes pour refléter les directives du guide.
- "La tornade des donjons"
  - Ajout de la quête "Tour de passe-passe" qui avait été oubliée.


## CSS
- Ajout de marges dans les sections à dévoiler via le bouton "Afficher"



</details>

## Refonte de l'installation
Ça aura été un casse tête mais au moins c'est fait, et puis c'était nécessaire. J'ai donc :
 - Intégrer la dépendance Python à l'application, ce qui à pour conséquence d'avoir augmenté la taille de GPOD3.
 - Refonte en totalité mon fichier de configuration de l'application Electron. Traduction : L'installation et le lancement de l'app.
 - Ajouter une fenêtre "installateur" qui suit celle de Squirrel (Le gif vert au début de l'installation).
 - Ajouter un écran de démarrage pour le style.
 
La majeur partie des problèmes venaient du fait que l'installateur Squirrel se fermait précocement. Et j'ai autant galérer à cause de ma méconnaissance d'Electron et surtout ici de Squirrel. 
Il se trouve que l'évènement "--squirrel-install" dans lequel j'imaginais pouvoir faire toutes les opérations d'installations, à une durée de vie fixe de 15s puis s'arrête et passe au suivant, or selon le PC et la connexion, GPOD3 met plus de temps que ça à s'installer. 
Donc j'ai passé des jours, littéralement, à chercher une solution à un problème qui ne pouvait être résolu. 

Mais j'ai pu commencer à avancer des lors que j'ai eu cette info et résultat j'ai remplacé le vide par une petite fenêtre indiquant que l'installation se déroule. C'est très minimaliste pour l'instant mais fonctionnel. Ce sera amélioré ultérieurement.

J'en ai profité pour ajouter une fenêtre de démarrage pendant que l'app charge. Là encore rien de bien tape à l'œil mais au moins il y a quelque chose.
 
Globalement c'est encore loin d'être parfait mais je m'y retrouve donc c'est pas mal pour avancer.
J'ai encore à améliorer certaines choses mais je ne devrais plus avoir trop de retour négatifs en ce qui concerne l'installation qui échouée régulièrement. Si vous avez un problème lors de l'installation en **version ≥ 1.0.5** n'hésitez pas à me le faire savoir.

## Sauvegarde de la progression
Il est à présent possible depuis la **version 1.0.3** de sauvegarder et charger sa progression via un menu d'option situé en haut à droite de l'application. 
- Pour les utilisateurs de la **version ≥ 1.0.3** ou si c'est votre première utilisation, alors tout va bien pour vous. Vous trouverez quand même des explications sur comment ça fonctionne tout en bas "Version ≥ 1.0.3" ou dans le premier guide de GPOD3.
- Pour les utilisateurs des versions précédentes ( **version ≤ 1.0.2** ) voir la section "Version ≤ 1.0.2" un peu plus bas.

**Remarque** : La mise à jour n'est pas encore un procédé très abouti. Idéalement il faudra que je rende tout ça in-app automatique. Techniquement c'est déjà possible avec les deux autres fichiers que je fourni, le .nupkg et le RELEASES mais il faut encore que je comprenne comment.

### Version ≤ 1.0.2
Pour ceux ayant utilisé une version inférieur ou égale à la **1.0.2** et qui ne souhaitent pas perdre leurs progression en mettant l'app à jour, il vous faudra faire quelques manipulations. Pas de panique voici la marche à suivre :
1. Téléchargez le dossier "creation_sauvegarde.7z" et dézippez le où vous voulez.
2. Vous aurez deux fichiers : "save.bat" et "create_save.py".
3. Ouvrez les fichiers locaux de l'application en faisant un clique droit sur l'icone de l'application présente sur votre bureau > "Ouvrir l'emplacement du fichier". Ou bien faites la combinaison de touches "Windows" + "R" et collez %LocalAppData% puis faites entrer et ouvrez le dossier "GPODofus3".
4. Allez dans le dossier app-1.X.X (les X correspondent à votre version) notez que vous y êtes déjà si vous avez êtes passer par "Ouvrir l'emplacement du fichier" > "resources" > "app". Glissez dans ce dernier le fichier "create_save.py".
5. Retournez 2 fois en arrière dans le dossier app-1.X.X et glissez y le fichier "save.bat".
6. Enfin, double cliquez sur "save.bat" et cela vous créera la sauvegarde de votre progression.

Vous pouvez maintenant installer la nouvelle version de l'application. 
Une fois dans l'application nouvellement installée puis lancée, ouvrez le menu via l'icone située en haut à droite de l'application et cliquez sur "Charger". Cela ira chercher le fichier de sauvegarde crée précédemment. 
Maintenant plus de panique puisque vous n'aurez plus besoin de faire cette opération manuellement il vous faudra simplement cliquer sur "Sauvegarder" et cela fera la même chose.

### Version ≥ 1.0.3
1. Cliquez sur le menu d'option en haut à droite de l'application. 
2. Dans la section "Sauvegarde" vous avez 2 options : 
    - La première créera la sauvegarde. 
    - La seconde la chargera.
    
C'est aussi simple que ça. Une fois la sauvegarde créée, vous pourrez mettre l'application à jour en installant les nouvelle version et une fois l'application lancée vous n'aurez qu'à appuyer sur "Charger" et vous retrouverez votre progression (une fois l'application redémarrée ou si vous passez au guide suivant ou précédent).



# v.1.0.4 Release
**BIEN LIRE LA SECTION INSTALLATION DU README**
- Améliorations des guides existants.
- Ajout de nouveaux guides.
- La sauvegarde de l'alignement choisi est à présent sauvegarder lors d'une sauvegarde de la progression.

## Changelogs
Cette fois-ci j'ai un vrai changelogs à proposer que voici.

### v1.0.4 Release

<details>
<summary>Voir les détails</summary>

## Général

### Ajouts
- Ajout de la sauvegarde de l'alignement de l'utilisateur.
- Ajustement du chemin du script d'installation dans install.vbs.
- Ajout d'un "pause" dans le script de lancer run.bat.


## Guides

### Modifications

<details>
<summary>Voir les détails</summary>

- "Tutoriel - GPODofus3"
  - Retrait du bloc "Remarque" de "Changelogs".
  - Ajout du changelogs pour la version 1.0.4.
- "Introduction aux dimensions divines"
  - Ajout du succès "Errances félines" et modifications du guide pour refléter cet ajout.
  - Quelques modifications dans les explications sur le Dofus des Veilleurs.
- "Ocre d'Ambre - Reine Nyée"
  - Ajout de directives pour la quête "Rester planté là".
- "Dofus des Veilleurs : Odyssée en Trois dimensions"
  - Ajout de la mention "accomplir le donjon" pour la quête "Le disparu de Sufokia".
- "La Fratrie des Oubliés"
  - Retrait du mot "Fin" du titre car il n'y en a plus qu'un.
- "Noir d'Ébène"
  - Changement du titre en "Dofus Ebène - 1 / 2"
- Les titres de tous les guides d'alignements ont été modifiés.
  - Ajout d'un [ A ] pour les différencier.
  - Retrait de la majuscule du mot "Alignement".
  - Retrait des mots "Bonta" ou "Brâkmar" qui étaient présent dans la plupart des guides alors que ce n'était pas nécessaire puisqu'ils ne sont de toute façon visible que pour l'alignement selectionné.
  - Uniformisation : Certains étaient séparés par des " - " d'autres par des " : ".
- Améliorations de tous les guides d'alignements
  - Ajout des numéros des quêtes dans les titres de la section "Guide" pour s'y retrouver plus facilement.
  - [En cours] Ajout d'informations manquante entre autre sur des prérequis qui méritaient d'être mis en avant.
  - Changements de mots utilisés pour rester cohérent avec les autres guides (exemple "accomplir" lorsqu'il sagit de parler d'un donjon, "compléter" pour des quêtes / succès, etc.)
- "Quêtes d'alignement : 40 + Ordre 2" (Brâkmar)
  - Changement du titre en "Quêtes d'alignement : 40"
  - Retrait du succès "Jusqu'à nouvel ordre" et de la mention de l'Ordre 2 du titre et du Guide. Ce n'est en effet pas pertinent puisqu'il n'est pas possible de le passer lors de ce guide.
- "Vert Émeraude : Premier Dofus Primordial"
  - Ajout d'une précision pour les Brâkmariens concernant la quête d'alignement 40 + le passage de l'ordre 2 une fois le Meulou accompli.
- "Rush Donjons - 6" : Ajout d'un lien vers le chemin pour se rendre dans le donjon Koulosse.

</details>

### Ajouts (Guides 110, 120)

- "110 - Eliocalypse - Résonance".
- "110 - Quêtes d'Alignement : Bonta - 41".
- "110 - Quêtes d'Alignement : Brâkmar - 41".
- "110 - Bonta & Brâkmar : Frères ennemis".
- "110 - Cania : Ça en valait la plaine".
- "110 - Ecaflipus Chapitre 1 : Pounicheur".
- "110 - Ocre d'Ambre - Damadrya".
- "110 - Pandala : De quel bois je me chauffe".
- "110 - Pourpre profond - 1 / 3 - Second Dofus Primordial".
- "120 - Frigost : Le Royalmouth".
- "120 - Quêtes d'Alignement : Bonta - 55".
- "120 - Quêtes d'Alignement : Brâkmar - 55".
- "120 - Pourpre Profond - 2 / 3 - Second Dofus Primordial".
- "120 - La Fratrie des Oubliés".
- "120 - Xelorium Chapitre 1 : Fraktale".
- "120 - Dofus Ebène - 1 / 2".

### Suppression

- "110 : Fratrie des Oubliés - 1 / 2".

## Succès

### Ajouts

- "Problèmes et solutions".
- "Objets trouvés".

## Quêtes

### Modifications

- Ajout d'un [P] ou [A] au titre des quêtes du succès "Agriculture ou Alchimie" pour indiquer si c'est une quête "Agriculture" [P] ou "Alchimie" [A].

### Ajouts

- "Pauvre Kiki.".
- "Star ski et Dutch.".
- "Groméo et Ginette.".
- "La marche de l'impératrice.".
- "Gène et tique.".
- "Manque de re-peau.".
- "Scierie Bambelle.".
- "Semer ses graines.".
- "Une blague vaseuse ?".
- "Un volcan s'éteint.".
- "Souvenir, souvenir.".
- "Bricoleur de génie.".
- "Un gros cube, un p'ti cube.".
- "Bijoux de famille.".
- "Obscurantisme.".
- "Monstre aux plantes.".
- "La transe du crystal.".
- "Art nacre.".
- "Glourmandise.".


## CSS 

- Retrait du font-weight: 500; de ".quest"
- Ajout des h6 avec font-size: 1em;
- Ajout font-weight: 500; dans ".dungeon"

</details>