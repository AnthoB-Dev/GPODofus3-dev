from app.models import Achievement, Quest
import json
from django.db import transaction

def add_quests_to_achievement(json_file_path):
    with open(json_file_path, 'r', encoding='utf-8') as file:
        quests_data = json.load(file)
    
    try:
        achievement = Achievement.objects.get(id=170)
        achievement.expect_alignment = True
        achievement.save()

        with transaction.atomic():
            # Supprimer les quêtes existantes associées à l'achievement
            existing_quests = achievement.quests.all()
            for quest in existing_quests:
                quest.delete()

            for quest_data in quests_data:
                quest_info = quest_data.get('quests', {})
                title = quest_info.get('name') or quest_info.get('title')
                url = quest_info.get('url')

                if title and url:
                    quest = Quest.objects.create(title=title, url=url)
                    achievement.quests.add(quest)

        achievement.save()
        print("Quests added successfully.")
    except Achievement.DoesNotExist:
        print("Achievement with id 170 does not exist.")
    except Exception as e:
        print(f"An error occurred: {e}")

# Utilisation de la fonction
add_quests_to_achievement('quests_brakmar.json')