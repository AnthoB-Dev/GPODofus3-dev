import logging
from django.http import HttpResponse
from django.urls import reverse
from django.views.decorators.http import require_POST
from django.shortcuts import render, redirect, get_object_or_404
from django.core.cache import cache
from django.db.models import Prefetch
from app.models import Achievement, Guide, Quest, LastSession
from django.template.loader import render_to_string


def get_navigation_context(guide):
    # Cache des guides
    guides = cache.get("all_guides")
    if guides is None:
        guides = Guide.objects.only("id", "title").all()
        cache.set("all_guides", guides, 60 * 15)  # Cache pour 15 minutes

    # Guides précédent et suivant
    previous_guide = None
    if guide.page > 0:  # Vérifier si on n'est pas au premier guide
        previous_guide = (
            Guide.objects.filter(page__lt=guide.page, page__gt=0)
            .order_by("-page")
            .first()
        )

    next_guide = Guide.objects.filter(page__gt=guide.page).order_by("page").first()

    return {
        "guides": guides,
        "previous_guide": previous_guide,
        "next_guide": next_guide,
    }
    
    
def guide_detail(request, guide_id, achievement_id=None):
    # Guide actuel
    guide = get_object_or_404(
        Guide.objects.prefetch_related(
            Prefetch(
                "achievement", queryset=Achievement.objects.prefetch_related("quests")
            )
        ),
        id=guide_id,
    )

    # Obtenir le contexte de navigation
    navigation_context = get_navigation_context(guide)

    # Préparation du contexte avec vérification
    achievements = list(guide.achievement.all())
    if achievement_id:
        selected_achievement = get_object_or_404(achievements, id=achievement_id)
    else:
        selected_achievement = achievements[0] if achievements else None

    quests = selected_achievement.quests.all() if selected_achievement else []

    # Calcul du pourcentage de quêtes complétées pour chaque achievement
    achievements_with_completion = []
    for achievement in achievements:
        total_quests = achievement.quests.count()
        completed_quests = achievement.quests.filter(completed=True).count()
        completion_percentage = (
            int((completed_quests / total_quests * 100)) if total_quests > 0 else 0
        )
        achievements_with_completion.append(
            {
                "achievement": achievement,
                "completion_percentage": completion_percentage,
            }
        )

    lastSession, created = LastSession.objects.get_or_create(id=1)
    lastSession.last_guide = guide if guide is not None else 1
    lastSession.last_achievement = selected_achievement
    lastSession.save()
    
    context = {
        "guide": guide,
        "achievements": achievements_with_completion,
        "selected_achievement": selected_achievement,
        "quests": quests,
    }

    # Ajouter le contexte de navigation au contexte général
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
    
    if achievement_id:
        achievement = get_object_or_404(guide.achievement, id=achievement_id)
    else:
        achievement = guide.achievement.first()

    quests = achievement.quests.all() if achievement else []

    context = {
        "guide": guide,
        "achievement": achievement,
        "quests": quests,
    }

    return render(request, "sections/quests.html", context)

logger = logging.getLogger(__name__)

@require_POST
def toggle_quest_completion(request, quest_id):
    quest = get_object_or_404(Quest, id=quest_id)
    quest.completed = not quest.completed
    quest.save()

    # Récupérer l'achievement associé
    achievement = Achievement.objects.filter(quests=quest).first()
    guide = Guide.objects.filter(achievement=achievement).first()

    # Recalculer le pourcentage de complétion
    total_quests = achievement.quests.count()
    completed_quests = achievement.quests.filter(completed=True).count()
    completion_percentage = (
        int((completed_quests / total_quests * 100)) if total_quests > 0 else 0
    )

    # Rendre les templates partiels EN INCLUANT `request`
    quest_html = render_to_string('sections/_quest_item.html', {
        'quest': quest,
        'achievement': achievement,
        'guide': guide
    }, request=request)
    
    achievement_html = render_to_string('sections/_achievement_item.html', {
        'item': {
            'achievement': achievement,
            'completion_percentage': completion_percentage
        },
        'guide': guide
    }, request=request)

    logger.debug(f"Quest HTML: {quest_html}")
    logger.debug(f"Achievement HTML: {achievement_html}")

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
