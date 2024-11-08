import json
import os
from django.db import transaction
from django.conf import settings
from django.apps import apps
from app.models import Guide, Achievement, Quest, AchievementQuest, Alignment
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
    with open(input_file, "r", encoding="utf-8") as file:
        for line in file:
            # Nettoyage de la ligne en supprimant les espaces et les sauts de ligne
            cleaned_line = line.strip()
            if cleaned_line:  # Vérifie si la ligne n'est pas vide
                if cleaned_line in seen_titles:
                    print(f"Doublon trouvé : {cleaned_line}. Il ne sera pas ajouté.")
                    continue  # Ignore les doublons
                seen_titles.add(
                    cleaned_line
                )  # Ajoute le titre à l'ensemble des titres vus

                # Création d'un dictionnaire pour la ligne
                entry = {
                    "title": cleaned_line,
                    "url": "",
                    "completion_points": 10,
                    "expect_ressource": False,
                    "expect_item": False,
                    "expect_fight": True,
                    "expect_dungeon": False,
                }
                # Ajout du dictionnaire à la liste
                parsed_data.append(entry)

    # Écriture des données parsées dans un fichier JSON
    with open(output_file, "w", encoding="utf-8") as json_file:
        json.dump(parsed_data, json_file, ensure_ascii=False, indent=4)


def maj_page_of_guide():
    try:
        guides = Guide.objects.all().order_by("id")  # Get all guides ordered by id
        for index, guide in enumerate(guides, start=1):
            guide.page = float(index)  # Set page to 1.0, 2.0, 3.0 etc.
            guide.save()
        print(f"Updated {guides.count()} guides with sequential page numbers")
    except Exception as e:
        print(f"An error occurred: {e}")


def export_guides_to_json(output_file=None):
    try:
        guides = Guide.objects.all()

        if not output_file:
            output_file = "guides.json"

        data = serializers.serialize("json", guides)

        with open(output_file, "w", encoding="utf-8") as f:
            f.write(data)

        print(f"Export des guides réussi vers {output_file}")

    except Exception as e:
        print(f"Erreur lors de l'export: {str(e)}")


def import_achievements_from_json(json_path=None):
    """Import des achievements depuis le format JSON Django avec leurs quêtes."""
    if json_path is None:
        json_path = os.path.join(settings.BASE_DIR, "achievements.json")

    try:
        with open(json_path, "r", encoding="utf-8") as file:
            data = json.load(file)

        for item in data:
            if item["model"] != "app.achievement":
                continue

            fields = item["fields"]
            achievement, created = Achievement.objects.update_or_create(
                id=item["pk"],
                defaults={
                    "title": fields["title"],
                    "url": fields["url"],
                    "completion_points": fields["completion_points"],
                    "objectives": fields["objectives"],
                    "expect_ressource": fields["expect_ressource"],
                    "expect_item": fields["expect_item"],
                    "expect_fight": fields["expect_fight"],
                    "expect_dungeon": fields["expect_dungeon"],
                    "expect_job": fields["expect_job"],
                    "expect_other": fields["expect_other"],
                    "expect_alignment": fields["expect_alignment"],
                    "created_in_version": fields["created_in_version"],
                    "updated_for_version": fields["updated_for_version"],
                },
            )

            # Gestion des quêtes
            if "quests" in item:
                for quest_data in item["quests"]:
                    # Récupérer l'objet Alignment
                    alignment = Alignment.objects.get(id=quest_data["alignment"])

                    quest, _ = Quest.objects.get_or_create(
                        title=quest_data["title"],
                        defaults={
                            "url": quest_data["url"],
                            "alignment": alignment,  # Assigner l'objet, pas l'ID
                            "completed": quest_data["completed"],
                        },
                    )

                    AchievementQuest.objects.get_or_create(
                        achievement=achievement, quest=quest
                    )

            status = "créé" if created else "mis à jour"
            print(f"Achievement '{achievement.title}' {status} avec succès.")

    except Exception as e:
        print(f"Erreur lors de l'importation: {str(e)}")


def import_guides_from_json(json_path=None):
    """
    Import des guides depuis un JSON simple.
    Format attendu:
    {
        "title": "Nom du guide",
        "recommended_level": 200,
        "alignment_id": 3
    }
    """
    if json_path is None:
        json_path = os.path.join(settings.BASE_DIR, "guides.json")

    try:
        with open(json_path, "r", encoding="utf-8") as file:
            guides_data = json.load(file)

        for guide_data in guides_data:
            # Récupérer l'alignement
            alignment = None
            if "alignment_id" in guide_data:
                alignment = Alignment.objects.get(id=guide_data["alignment_id"])

            guide, created = Guide.objects.get_or_create(
                title=guide_data["title"],
                defaults={
                    "objectives": "",  # Champ vide par défaut
                    "explanations": "",  # Champ vide par défaut
                    "page": 1.0,  # Valeur par défaut
                    "recommended_level": guide_data.get("recommended_level", 1),
                    "alignment": alignment,
                    # Les champs created_at, updated_at seront gérés automatiquement
                    # created_in_version et updated_for_version utilisent GAME_VERSION par défaut
                },
            )

            status = "créé" if created else "existant"
            print(f"Guide '{guide.title}' {status}")

    except FileNotFoundError:
        print(f"Erreur: Le fichier {json_path} n'existe pas")
    except json.JSONDecodeError:
        print("Erreur: Format JSON invalide")
    except Exception as e:
        print(f"Erreur lors de l'importation: {str(e)}")
