import glob
import json
import os
import datetime as dt
from datetime import datetime
import re
from django.http import HttpResponse, JsonResponse
from django.views.decorators.http import require_POST
from django.shortcuts import render, redirect, get_object_or_404
from django.core.cache import cache
from django.db.models import Prefetch
from app.models import Achievement, AchievementQuest, Alignment, Guide, GuideAchievement, Quest, User
from django.template.loader import render_to_string
from django.views import View
from django.views.decorators.csrf import csrf_exempt
from .utils import (
    get_navigation_context,
    get_filtered_quests,
    generate_expect_list,
    get_selected_achievement,
    calculate_completion_percentage,
)

ADMIN = False # DEBUG
ADMIN_FILTER_IDS = [1, 2, 3, 4]
ALIGNED_FILTER_IDS = [3, 4]


def redirect_to_guide(request, guide_id=None):
    # Récupère le guide passé en paramètre s'il y en a.
    if guide_id:
        print(guide_id)
        gid = guide_id
    else:
    # Redirige vers le dernier guide vu ou un guide par défaut (Le premier) si aucun n'est trouvé.
        gid = Guide.objects.filter(is_last_seen=True).first()
        if not gid:
            gid = 1
        else:
            gid = gid.id

    return redirect("app:guide_detail", guide_id=gid)

class GuideDetailView(View):
    def get(self, request, guide_id):
        guide = get_object_or_404(
            Guide.objects.prefetch_related(
                Prefetch(
                    "achievement",
                    queryset=Achievement.objects.prefetch_related("quests")
                ),
                "guide_achievements"
            ),
            id=guide_id,
        )
        guide.is_last_seen = True
        guide.save()

        navigation_context = get_navigation_context(guide, ADMIN)

        guide_achievements = guide.guide_achievements.select_related("achievement")
        selected_achievement = get_selected_achievement(guide_achievements, guide)

        user = User.objects.first()
        user_alignment = user.alignment
        user_alignment_name = user.alignment.name
        if user_alignment_name == "Neutre":
            alignment_ids = [user.alignment_id]
        else:
            alignment_ids = [user.alignment_id] + ALIGNED_FILTER_IDS
            
        admin_ids = ADMIN_FILTER_IDS

        achievements_with_completion = []
        last_seen_achievement = None

        for ga in guide_achievements:
            achievement = ga.achievement
            quests = get_filtered_quests(achievement, ADMIN, alignment_ids, admin_ids)
            if ga.is_last_seen:
                last_seen_achievement = achievement

            completion_percentage = calculate_completion_percentage(achievement, user_alignment, guide)
            expect_list = generate_expect_list(achievement, user_alignment_name)

            achievements_with_completion.append({
                "achievement": achievement,
                "completion_percentage": completion_percentage,
                "expect_list": expect_list
            })

        quests = get_filtered_quests(selected_achievement, ADMIN, alignment_ids, admin_ids) if selected_achievement else []

        current_alignment_id = user.alignment.id if user.alignment else None
        
        alignments = Alignment.objects.all()

        context = {
            "guide": guide,
            "achievements": achievements_with_completion,
            "selected_achievement": selected_achievement,
            "last_seen_achievement": last_seen_achievement,
            "quests": quests,
            "alignments": alignments,
            "user_alignment_name": user_alignment_name,
            "current_alignment_id": current_alignment_id,
        }
        context.update(navigation_context)

        return render(request, "pages/guide.html", context)


# Vue des objectifs
def guide_objectives_partial(request, guide_id):
    guide = get_object_or_404(Guide, id=guide_id)
    return render(request, "sections/objectives.html", {"guide": guide})


# Vue des succès
def guide_achievements_partial(request, guide_id):
    guide = get_object_or_404(
        Guide.objects.prefetch_related("achievement"), id=guide_id
    )
    achievements = guide.achievement.all()
    return render(
        request,
        "sections/achievements.html",
        {"guide": guide, "achievements": achievements},
    )


# Vue des quêtes
# Si un achievement_id est fourni, on affiche les quêtes de cet achievement
def guide_quests_partial(request, guide_id, achievement_id=None):
    guide = get_object_or_404(
        Guide.objects.prefetch_related("achievement__quests"), id=guide_id
    )
    
    # Récupérer l'achievement sélectionné
    achievement = get_object_or_404(guide.achievement, id=achievement_id)
    
    # Mettre à jour is_last_seen pour tous les GuideAchievement du guide
    GuideAchievement.objects.filter(guide=guide).update(is_last_seen=False)
    
    # Définir is_last_seen pour le GuideAchievement sélectionné
    guide_achievement = GuideAchievement.objects.get(
        guide=guide, achievement=achievement
    )
    guide_achievement.is_last_seen = True
    guide_achievement.save()
    
    user = User.objects.first()
    alignment_ids = [user.alignment_id] + ALIGNED_FILTER_IDS
    admin_ids = ADMIN_FILTER_IDS
    
    quests = get_filtered_quests(achievement, ADMIN, alignment_ids, admin_ids)
   
    context = {
        "guide": guide,
        "achievement": achievement,
        "quests": quests,
        "selected_achievement": achievement,  
    }

    return render(request, "sections/quests.html", context)


@require_POST
def toggle_quest_completion(request, quest_id):
    quest = get_object_or_404(Quest, id=quest_id)
    quest.completed = not quest.completed
    quest.save()
    
    achievement = Achievement.objects.filter(quests=quest).first()
    if not achievement:
        return HttpResponse(status=404)

    guide = Guide.objects.filter(achievement=achievement).first()
    if not guide:
        return HttpResponse(status=404)

    guide_achievements = guide.guide_achievements.select_related("achievement")

    selected_achievement = achievement
    
    user_alignment = User.objects.first().alignment

    completion_percentage = calculate_completion_percentage(achievement, user_alignment, guide)

    last_seen_achievement = get_selected_achievement(guide_achievements, guide)

    expect_list = generate_expect_list(achievement, User.objects.first().alignment.name)

    
    
    quest_html = render_to_string('sections/_quest_item.html', {
        'quest': quest,
        'achievement': achievement,
        'guide': guide,
        'selected_achievement': selected_achievement,
        'last_seen_achievement': last_seen_achievement,       
    }, request=request)
    
    achievement_html = render_to_string('sections/_achievement_item.html', {
        'item': {
            'achievement': achievement,
            'completion_percentage': completion_percentage,
            "expect_list": expect_list,
            'user_alignment' : user_alignment
        },
        'guide': guide,
        'selected_achievement': selected_achievement,
        'last_seen_achievement': last_seen_achievement,   
    }, request=request)

    response_content = f"""
    <turbo-stream action="replace" target="quest_frame_{quest.id}">
      <template>{quest_html}</template>
    </turbo-stream>
    <turbo-stream action="replace" target="achievement_frame_{achievement.id}">
      <template>{achievement_html}</template>
    </turbo-stream>
    """
    return HttpResponse(response_content, content_type='text/vnd.turbo-stream.html')


@require_POST
def alignment_choice(request):
    alignment_id = request.POST.get('alignment')

    if not alignment_id:
        return HttpResponse("Aucun alignement sélectionné.", status=400)

    alignment = get_object_or_404(Alignment, id=alignment_id)

    user = User.objects.first()
    if user:
        user.alignment = alignment
        user.save()
        
    return redirect('app:guide_detail', guide_id=174)


# Fonction d'extraction de date/heure
def datetime_extract(file_name):
    match = re.search(r"(\d{2})_(\d{2})_(\d{4})-(\d{2})_(\d{2})_(\d{2})", file_name)
    if match:
        day, month, year, h, m, s = map(int, match.groups())
        return dt.datetime(year, month, day, h, m, s)
    return dt.datetime.min

@csrf_exempt
def create_save(request):
    success = True
    message = "La sauvegarde a été créée avec succès."  
    
    try:
        data = []
        
        for guide_achievement in GuideAchievement.objects.select_related('guide', 'achievement').filter(guide__is_visible=True):
            quests = AchievementQuest.objects.filter(achievement=guide_achievement.achievement).select_related('quest')
            quest_data = [
                {"id": quest.quest.id, "completed": quest.quest.completed}
                for quest in quests
            ]
            data.append({
                "guide": {"id": guide_achievement.guide.id},
                "achievement": {"id": guide_achievement.achievement.id},
                "quests": quest_data,
                "is_last_seen": guide_achievement.is_last_seen,
            })
        
        alignment = User.objects.first().alignment.id if User.objects.exists() else None
        last_guide = Guide.objects.filter(is_last_seen=True).first().id
        
        global_data = {
            "alignment": alignment,
            "last_guide": last_guide
        }
        
        save_content = {
            "global": global_data,
            "guides": data
        }

        saves_folder = os.path.join(os.environ.get('APPDATA'), 'GPODofus3', 'saves')
        if not os.path.exists(saves_folder):
            os.makedirs(saves_folder)
            
        timestamp = datetime.now().strftime("%d_%m_%Y")
        hour = datetime.now().strftime("%H_%M_%S")
        
        save_name = f"save-{timestamp}-{hour}.json"
        
        message = f"La sauvegarde '{save_name}' a été créée avec succès dans \\AppData\\Roaming\\GPODofus3\\saves."

        output_file = os.path.join(saves_folder, save_name)
        old_save_file = os.path.join(saves_folder, f'old_{save_name}')

        if os.path.exists(output_file):
            os.rename(output_file, old_save_file)

        with open(output_file, 'w', encoding='utf-8') as f:
            json.dump(save_content, f, ensure_ascii=False, indent=4)
            
    except Exception as e:
        success = False
        message = f"Une erreur s'est produite lors de la sauvegarde : {str(e)}"
        print(f"Une erreur s'est produite lors de la sauvegarde : {str(e)}")

    if success:
        return render(request, 'sections/_messages.html', {
            'success': success,
            'message': message
        }, content_type="text/vnd.turbo-stream.html")
    else:
        return render(request, 'sections/_messages.html', {
            'success': success,
            'message': message
        }, content_type="text/vnd.turbo-stream.html")


@csrf_exempt
def load_save(request):
    success = True
    message = "Sauvegarde chargée avec succès.<br/>Redémarrez l'application ou changez de guide pour que les changements prennent effet." 
    
    try:
        # Charge les données depuis le fichier save.json le plus récent présent dans le dossier AppData\Roaming\GPODofus3\saves
        saves_folder = os.path.join(os.environ.get('APPDATA'), 'GPODofus3', 'saves')
        save_files = glob.glob(os.path.join(saves_folder, "*-*-*.json"))
        save_files.sort(key=datetime_extract, reverse=True)

        if save_files:
            save_file = save_files[0]

            # Charger le fichier JSON
            with open(save_file, "r", encoding="utf-8") as f:
                data = json.load(f)

            print("Fichier chargé:", save_file)
        else:
            print("Aucun fichier 'save-' trouvé dans", saves_folder)
        
        guides = data.get("guides", [])

        for item in guides:
            try:
                # Récupérer le Guide correspondant à l'ID
                guide = Guide.objects.get(id=item['guide']['id'])
            except Guide.DoesNotExist:
                print(f"Guide avec l'ID {item['guide']['id']} n'existe pas ou plus dans la base de données.")
                continue  # Ignore cet élément si le guide n'existe pas

            try:
                # Récupérer l'achievement correspondant à l'ID
                achievement = Achievement.objects.get(id=item['achievement']['id'])
            except Achievement.DoesNotExist:
                print(f"Achievement avec l'ID {item['achievement']['id']} n'existe pas ou plus dans la base de données.")
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
               
        global_data = data.get("global")
        if not global_data:
            return JsonResponse({'error': 'Données globales manquantes dans la sauvegarde.'}, status=400)

        # Vérification de l'alignement
        alignment_id = global_data.get("alignment")
        if alignment_id is None:
            return JsonResponse({'error': 'ID d\'alignement non trouvé dans la sauvegarde.'}, status=400)
        else:
            try:
                # Récupérer l'alignement correspondant à l'ID
                alignment = Alignment.objects.get(id=alignment_id)
                user = User.objects.first()
                if user:
                    user.alignment = alignment
                    user.save()
            except Alignment.DoesNotExist:
                print(f"Alignement avec l'ID {alignment_id} n'existe pas dans la base de données.")
                return JsonResponse({'error': 'Alignement non trouvé dans la sauvegarde.'}, status=400)
                
        guide_last_seen = global_data.get("last_guide")
        if guide_last_seen is None:
            guide_last_seen = 1

                
    except Exception as e:
        success = False
        message = f"Une erreur s'est produite lors du chargement : {str(e)}.<br/>Solution probable : Vérifiez la présence de save.json à l'emplacement indiqué."
        print(f"Une erreur s'est produite lors du chargement : {str(e)}")

    if success:
        return redirect_to_guide(request, guide_last_seen)
        
    else:
        return render(request, 'sections/_messages.html', {
            'success': success,
            'message': message
        }, content_type="text/vnd.turbo-stream.html")
    
    