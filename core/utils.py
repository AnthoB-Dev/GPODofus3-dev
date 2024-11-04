import json
import os
from django.db import transaction
from django.conf import settings
from django.apps import apps
from app.models import *
from collections import Counter
from django.core import serializers

def parse_txt_to_json(input_file, output_file):
    # Vérification de l'existence du fichier d'entrée
    if not os.path.isfile(input_file):
        print(f"Le fichier {input_file} n'existe pas.")
        return

    # Initialisation de la liste pour stocker les lignes parsées et un ensemble pour vérifier les doublons
    parsed_data = []
    seen_titles = set()

    # Ouverture du fichier texte en lecture
    with open(input_file, 'r', encoding='utf-8') as file:
        for line in file:
            # Nettoyage de la ligne en supprimant les espaces et les sauts de ligne
            cleaned_line = line.strip()
            if cleaned_line:  # Vérifie si la ligne n'est pas vide
                if cleaned_line in seen_titles:
                    print(f"Doublon trouvé : {cleaned_line}. Il ne sera pas ajouté.")
                    continue  # Ignore les doublons
                seen_titles.add(cleaned_line)  # Ajoute le titre à l'ensemble des titres vus

                # Création d'un dictionnaire pour la ligne
                entry = {
                    "title": cleaned_line,
                    "url": "",
                    "completion_points": 10,
                    "expect_ressource": False,
                    "expect_item": False,
                    "expect_fight": True,
                    "expect_dungeon": False
                }
                # Ajout du dictionnaire à la liste
                parsed_data.append(entry)

    # Écriture des données parsées dans un fichier JSON
    with open(output_file, 'w', encoding='utf-8') as json_file:
        json.dump(parsed_data, json_file, ensure_ascii=False, indent=4)
        

def coda(data1=None, data2=None):
    if data1 is None and data2 is None:
        modelData = Achievement.objects.all()
        jsonData = os.path.join(settings.BASE_DIR.parent, 'achievements.json')
        md = []
        jd = []
        
    with open(jsonData, 'r', encoding='utf-8') as file:
        dataJson = json.load(file)
        
    for a in modelData: 
        md.append(a.title)
        
    for i in dataJson:
        jd.append(i['title'])
        

    count_entity = jd
    
    count = Counter(count_entity)
    duplicates = [title for title, cnt in count.items() if cnt > 1]
    
    if count_entity == jd and duplicates:
        print(f"Doublons dans le JSON : {duplicates}")
    elif count_entity == md and duplicates:
        print(f"Doublons en BDD : {duplicates}")

    for x in jd:
        if x not in md:
            print(f"Achievement '{x}' non trouvé dans la base de données.")   
            
    if set(jd) == set(md):
        print('Aucune différences entre les data fournies detecté.')
    
            

def maj_fields_of_model(model_input=None, field_name=None, new_value=None):
    # model_name = model_input.capitalize()
    # field = field_name.lower()

    # try:
    #     model = apps.get_model('app', model_name)  # Remplacez 'app' par le nom de votre application
    # except LookupError:
    #     print(f"Le modèle '{model_name}' n'existe pas.")
    #     return

    try:
        data = Achievement.objects.all()
    except Exception as e:
        print(f"Une erreur s'est produite lors de la récupération des données : {e}")
        return

    # try:
    #     if data.get(field):
    #         print(f"Champ '{field}' trouvé")
    # except Exception as e:
    #     print(f"Une erreur s'est produite lors de la récupération du champ : {e}")
    #     return
    
    try:
        for d in data:
            d.created_in_version = 2.73
            d.save()
        print("Versions modifiées")
    except Exception as e:
        raise e
    
    print("Versions sauvegardées")
    

def iafj(json_path=None):
    if json_path is None:
        json_path = os.path.join(settings.BASE_DIR.parent, 'achievements.json')
    
    with open(json_path, 'r') as file:
        data = json.load(file)

    for item in data:
        try:
            # Créer ou mettre à jour un Achievement
            achievement, created = Achievement.objects.update_or_create(
                title=item['title'].encode('latin1').decode('utf-8'),
                defaults={
                    'url': item['url'],
                    'completion_points': item['completion_points'],
                    'objectives': item.get('objectives', ''),  # Utiliser un champ vide si non spécifié
                    "expect_ressource": item['expect_ressource'],
                    "expect_item": item['expect_item'],
                    "expect_fight": item['expect_fight'],
                    "expect_dungeon": item['expect_dungeon'],
                    "expect_job": item['expect_job'],
                    "expect_other": item['expect_other'],
                    "expect_alignment": item['expect_alignment'],
                    'created_in_version': 2.73  # Version par défaut
                }
            )
            
            # Sauvegarder les changements pour cet achievement
            achievement.save()
            print(f"Achievement '{achievement.title}' importé avec succès.")
        except Exception as e:
            print(f"Erreur lors de l'importation de l'achievement '{item.get('title', '')}': {e}")


def export_achievements_to_json():
    # Récupérer tous les objets Achievement
    achievements = Achievement.objects.all()

    # Utiliser le sérialiseur de Django pour convertir en JSON
    achievements_json = serializers.serialize('json', achievements)

    # Écrire le JSON dans un fichier
    with open('achievements.json', 'w', encoding="utf-8") as file:
        file.write(achievements_json)

    print("Les achievements ont été exportés avec succès en JSON.")

# parse_txt_to_json('achi.txt', 'output.json')
