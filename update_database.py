import os
import django
import json

# Configurer Django
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "backend.settings")
django.setup()

from app.models import GuideAchievement, Quest, Achievement, Guide

# Charger les données depuis le fichier JSON présent dans le dossier AppData\Roaming\GPODofus3
appdata_folder = os.path.join(os.environ.get('APPDATA'), 'GPODofus3')
output_file = os.path.join(appdata_folder, 'save.json')
with open(output_file, 'r', encoding='utf-8') as f:
  data = json.load(f)

for item in data:
  try:
    # Récupérer le Guide correspondant à l'ID
    guide = Guide.objects.get(id=item['guide']['id'])
  except Guide.DoesNotExist:
    print(f"Guide avec l'ID {item['guide']['id']} n'existe pas dans la base de données.")
    continue  # Ignore cet élément si le guide n'existe pas

  try:
    # Récupérer l'achievement correspondant à l'ID
    achievement = Achievement.objects.get(id=item['achievement']['id'])
  except Achievement.DoesNotExist:
    print(f"Achievement avec l'ID {item['achievement']['id']} n'existe pas dans la base de données.")
    continue  # Ignore cet élément si l'achievement n'existe pas

  # Si un GuideAchievement avec is_last_seen=True existe déjà pour ce guide, le réinitialiser
  if item['is_last_seen']:
    GuideAchievement.objects.filter(guide=guide, is_last_seen=True).update(is_last_seen=False)

  # Mettre à jour ou créer un GuideAchievement avec les nouveaux champs
  guide_achievement, created = GuideAchievement.objects.update_or_create(
    guide=guide,
    achievement=achievement,
    defaults={'is_last_seen': item['is_last_seen']}  # Mettre à jour le champ is_last_seen
  )

  # Mettre à jour les quêtes liées à cet achievement
  for quest_item in item['quests']:
    try:
      # Récupérer la quête correspondant à l'ID
      quest = Quest.objects.get(id=quest_item['id'])
    except Quest.DoesNotExist:
      print(f"Quest avec l'ID {quest_item['id']} n'existe pas dans la base de données.")
      continue  # Ignore cet élément si la quête n'existe pas

    # Mettre à jour la complétion de la quête
    quest.completed = quest_item['completed']
    quest.save()  # Sauvegarder la quête après mise à jour

print("Base de données mise à jour avec succès.")
