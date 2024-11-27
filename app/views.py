import logging
from django.http import HttpResponse
from django.urls import reverse
from django.views.decorators.http import require_POST
from django.shortcuts import render, redirect, get_object_or_404
from django.core.cache import cache
from django.db.models import Prefetch
from app.models import Achievement, Alignment, Guide, GuideAchievement, Quest, User
from django.template.loader import render_to_string

ADMIN = True            # DEBUG TODO: ENLEVER

def redirect_to_guide(request):
    # Récupérer le dernier guide vu
    last_guide = Guide.objects.filter(is_last_seen=True).first()

    if last_guide:
        return redirect("app:guide_detail", guide_id=last_guide.id)
    else:
        # Rediriger vers un guide par défaut si aucun n'est trouvé
        return redirect("app:guide_detail", guide_id=1)


def get_navigation_context(guide):
    # Déterminer l'alignement à utiliser
    user = User.objects.first()
    alignment_ids = [user.alignment_id, 3, 4] # L'alignement de l'utilisateur + neutre + aligner
    
    admin_ids = [1, 2, 3, 4]   # DEBUG TODO: ENLEVER

    if not ADMIN:
        # Cache des guides
        guides = cache.get(f"all_guides_alignment_{alignment_ids}")
        if guides is None:
            guides = Guide.objects.filter(alignment_id__in=alignment_ids).only("id", "title").order_by("page").all()
            cache.set(f"all_guides_alignment_{alignment_ids}", guides, 60 * 15)  # Cache pour 15 minutes

        # Guides précédent et suivant
        previous_guide = None
        if guide.page > 0:  # Vérifier si on n'est pas au premier guide
            previous_guide = (
                Guide.objects.filter(page__lt=guide.page, page__gt=0, alignment_id__in=alignment_ids)
                .order_by("-page")
                .first()
            )

        next_guide = Guide.objects.filter(page__gt=guide.page, alignment_id__in=alignment_ids).order_by("page").first()
        
    else:
        # Cache des guides
        guides = cache.get(f"all_guides_admin_{admin_ids}")
        if guides is None:
            guides = Guide.objects.filter(alignment_id__in=admin_ids).only("id", "title").order_by("page").all()
            cache.set(f"all_guides_admin_{admin_ids}", guides, 60 * 15)  # Cache pour 15 minutes
        
        # Guides précédent et suivant
        previous_guide = None
        if guide.page > 0:
            previous_guide = (
                Guide.objects.filter(page__lt=guide.page, page__gt=0, alignment_id__in=admin_ids)
                .order_by("-page")
                .first()
            )
        
        next_guide = Guide.objects.filter(page__gt=guide.page, alignment_id__in=admin_ids).order_by("page").first()

    return {
        "guides": guides,
        "previous_guide": previous_guide,
        "next_guide": next_guide,
    }

def guide_detail(request, guide_id):
    # Récupérer le guide avec les achievements et quêtes préchargés
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

    # Contexte de navigation
    navigation_context = get_navigation_context(guide)

    # Récupérer les GuideAchievement associés
    guide_achievements = guide.guide_achievements.select_related("achievement")

    # Sélection de l'achievement avec is_last_seen=True
    selected_guide_achievement = guide_achievements.filter(is_last_seen=True).first()

    # Définir selected_achievement
    if selected_guide_achievement:
        selected_achievement = selected_guide_achievement.achievement
    else:
        achievements = list(guide.achievement.all())
        selected_achievement = achievements[0] if achievements else None

    user = User.objects.first()
    user_alignment = user.alignment.name
    alignment_ids = [user.alignment_id, 3, 4] # L'alignement de l'utilisateur + neutre + aligner = Tout voir sauf l'alignement opposé
    admin_ids = [1, 2, 3, 4]

    achievements_with_completion = []
    expect_list = []
    last_seen_achievement = None
    
    for guide_achievement in guide_achievements:
        achievement = guide_achievement.achievement
        
        if not ADMIN:
            quests = achievement.quests.filter(alignment_id__in=alignment_ids) if achievement else []
        else:
            quests = achievement.quests.filter(alignment_id__in=admin_ids) if achievement else []

        if guide_achievement.is_last_seen:
            last_seen_achievement = achievement.id

        total_quests = achievement.quests.count()
        completed_quests = achievement.quests.filter(completed=True).count()
        completion_percentage = (
            int((completed_quests / total_quests * 100)) if total_quests > 0 else 0
        )
        
        # Permet de modifier l'icone selon l'alignement de l'utilisateur
        for field in achievement._meta.get_fields():
            if field.name.startswith('expect_') and getattr(achievement, field.name):
                expect = field.name[7:]
                if expect == 'alignment':
                    if user.alignment and user.alignment.name == "Bonta":
                        expect = 'alignment_bonta'
                    elif user.alignment and user.alignment.name == "Brâkmar":
                        expect = 'alignment_brak'
                else:
                    expect = f'{expect}'
                expect_list.append(expect)
        
        achievements_with_completion.append({
            "achievement": achievement,
            "completion_percentage": completion_percentage,
            "expect_list": expect_list
        })

        alignments = Alignment.objects.all()

    # Contexte complet
    context = {
        "guide": guide,
        "achievements": achievements_with_completion,
        "selected_achievement": selected_achievement,
        "last_seen_achievement": last_seen_achievement,
        "quests": quests,
        "alignments" : alignments,
        "user_alignment" : user_alignment
    }
    context.update(navigation_context)

    # Rendre la page complète
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
    
    # Définir selected_achievement
    selected_achievement = achievement
    
    user = User.objects.first()
    admin_ids = [1, 2, 3, 4]
    
    if not ADMIN:
        quests = achievement.quests.filter(alignment=user.alignment) if achievement else []
    else:
        quests = achievement.quests.filter(alignment_id__in=admin_ids) if achievement else []
   
    context = {
        "guide": guide,
        "achievement": achievement,
        "quests": quests,
        "selected_achievement": selected_achievement,  
        "last_seen_achievement": selected_achievement, # TODO: verifier l'utilitée
    }

    return render(request, "sections/quests.html", context)


@require_POST
def toggle_quest_completion(request, quest_id):
    quest = get_object_or_404(Quest, id=quest_id)
    quest.completed = not quest.completed
    quest.save()

    # Récupérer l'achievement associé
    achievement = Achievement.objects.filter(quests=quest).first()
    guide = Guide.objects.filter(achievement=achievement).first()

    # Définir selected_achievement
    selected_achievement = achievement

    # Recalculer le pourcentage de complétion
    total_quests = achievement.quests.count()
    completed_quests = achievement.quests.filter(completed=True).count()
    completion_percentage = (
        int((completed_quests / total_quests * 100)) if total_quests > 0 else 0
    )

    # Définir last_seen_achievement
    last_seen_achievement = GuideAchievement.objects.filter(
        guide=guide, is_last_seen=True
    ).first()
    expect_list = []
    expect_list = [field.name[7:] for field in achievement._meta.get_fields() if field.name.startswith('expect_') and getattr(achievement, field.name)]

    user_alignment = User.objects.first().alignment

    # Rendre les templates partiels en incluant request
    quest_html = render_to_string('sections/_quest_item.html', {
        'quest': quest,
        'achievement': achievement,
        'guide': guide,
        'selected_achievement': selected_achievement,
        'last_seen_achievement': last_seen_achievement 
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
        'last_seen_achievement': last_seen_achievement 
    }, request=request)

    # Créer la réponse Turbo Stream
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
    alignment = get_object_or_404(Alignment, id=alignment_id)
    
    user, created = User.objects.get_or_create(id=1)
    user.alignment = alignment
    user.save()
    
    alignments = Alignment.objects.all()
    alignments_html = render_to_string('sections/alignment.html', {
        'alignments': alignments,
    }, request=request)

    response_content = f"""
    <turbo-stream action="replace" target="alignment_choice">
      <template>{alignments_html}</template>
    </turbo-stream>
    """
    return HttpResponse(response_content, content_type='text/vnd.turbo-stream.html')