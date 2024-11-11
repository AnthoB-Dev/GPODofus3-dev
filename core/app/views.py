from django.views.decorators.http import require_POST
from django.http import HttpResponse, JsonResponse
from django.shortcuts import render, redirect, get_object_or_404
from django.views.generic import (
    ListView,
    DetailView,
    CreateView,
    UpdateView,
    DeleteView,
    TemplateView,
)
from django.urls import reverse_lazy
from django.core.cache import cache
from django.db.models import Prefetch
from app.models import Achievement, Guide, Quest


# Vue principale
def guide_detail(request, guide_id):
    # Cache des guides
    guides = cache.get("all_guides")
    if guides is None:
        guides = Guide.objects.only("id", "title").all()
        cache.set("all_guides", guides, 60 * 15)

    # Guide actuel
    guide = get_object_or_404(
        Guide.objects.prefetch_related(
            Prefetch(
                "achievement", queryset=Achievement.objects.prefetch_related("quests")
            )
        ),
        id=guide_id,
    )

    previous_guide = None
    if guide.page > 0:  # Vérifier si on n'est pas au premier guide
        previous_guide = (
            Guide.objects.filter(page__lt=guide.page, page__gt=0)
            .order_by("-page")
            .first()
        )

    next_guide = Guide.objects.filter(page__gt=guide.page).order_by("page").first()

    # Préparation du contexte avec vérification
    achievements = list(guide.achievement.all())
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
        # # Liste des liens des quêtes par succès
        # quest_links = {}
        # for achievement in achievements:
        #     quest_links[achievement.id] = [
        #         {"id": quest.id, "title": quest.title, "url": quest.get_absolute_url()}
        #         for quest in achievement.quests.all()
        #     ]

    context = {
        "guide": guide,
        "guides": guides,
        "previous_guide": previous_guide,
        "next_guide": next_guide,
        "achievements": achievements_with_completion,
        "selected_achievement": selected_achievement,
        "quests": quests,
        # "quest_links": quest_links,
    }

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
def guide_quests_partial(request, guide_id, achievement_id=None):
    guide = get_object_or_404(
        Guide.objects.prefetch_related("achievement__quests"), id=guide_id
    )

    # Sélection de l'achievement avec debug
    if achievement_id:
        achievement = get_object_or_404(guide.achievement, id=achievement_id)
    else:
        achievement = guide.achievement.first()

    # Debug des quêtes
    quests = achievement.quests.all() if achievement else []

    context = {
        "guide": guide,
        "achievement": achievement,
        "quests": quests,
    }

    return render(request, "sections/quests.html", context)


# Permet de naviguer entre les succès d'un guide
def guide_achievements(request, guide_id, achievement_id):
    guide = get_object_or_404(
        Guide.objects.prefetch_related("achievement"), id=guide_id
    )
    achievements = guide.achievement.all()
    if get_object_or_404(achievements, id=achievement_id):
        selected_achievement = get_object_or_404(achievements, id=achievement_id)
    else:
        selected_achievement = []
    quests = selected_achievement.quests.all()
    context = {
        "guide": guide,
        "achievements": achievements,
        "selected_achievement": selected_achievement,
        "quests": quests,
    }
    return render(request, "pages/guide.html", context)


@require_POST
def toggle_quest_status(request, quest_id):
    quest = get_object_or_404(Quest, id=quest_id)
    quest.completed = not quest.completed
    quest.save()

    return render(
        request,
        "sections/_quest_item.html",
        {
            "quest": quest,
        },
    )
