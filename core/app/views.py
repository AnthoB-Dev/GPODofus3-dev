from django.http import JsonResponse
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

from app.models import Achievement, Guide


class AppView(TemplateView):
    """Vue principale de l'application utilisant Turbo"""

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        # Utiliser prefetch_related pour précharger les succès et les quêtes associées
        guides = Guide.objects.prefetch_related("achievement__quests").all()
        context["guides"] = guides

        achievements = set()
        quests = set()
        for guide in guides:
            for achievement in guide.achievement.all():
                achievements.add(achievement)
                for quest in achievement.quests.all():
                    quests.add(quest)

        context["achievements"] = achievements
        context["quests"] = quests
        return context

    template_name = "pages/guide.html"


def guide_detail(request, guide_id):
    guide = get_object_or_404(
        Guide.objects.prefetch_related("achievement__quests"), id=guide_id
    )
    achievements = list(guide.achievement.all())
    quests = set()
    if achievements:
        selected_achievement = achievements[0]  # Premier achievement
        for quest in selected_achievement.quests.all():
            quests.add(quest)

    context = {
        "guide": guide,
        "achievements": achievements,
        "selected_achievement": selected_achievement,  # Ajouter l'achievement sélectionné
        "quests": quests,
    }
    return render(request, "pages/guide.html", context)


def guide_objectives_partial(request, guide_id):
    guide = get_object_or_404(Guide, id=guide_id)
    return render(request, "sections/objectives.html", {"guide": guide})


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


def guide_quests_partial(request, guide_id, achievement_id=None):
    guide = get_object_or_404(
        Guide.objects.prefetch_related("achievement__quests"), id=guide_id
    )

    # Debug print
    print(f"Guide ID: {guide_id}")

    # Sélection de l'achievement avec debug
    if achievement_id:
        achievement = get_object_or_404(guide.achievement, id=achievement_id)
        print(f"Achievement ID: {achievement_id}, Title: {achievement.title}")
    else:
        achievement = guide.achievement.first()
        print("Using first achievement")
        if achievement:
            print(f"First achievement title: {achievement.title}")

    # Debug des quêtes
    quests = achievement.quests.all() if achievement else []
    print(f"Number of quests: {len(quests)}")

    context = {
        "guide": guide,
        "achievement": achievement,
        "quests": quests,
    }

    # Debug final
    print("Context:", context)

    return render(request, "sections/quests.html", context)


# Permet de naviguer entre les succès d'un guide
def guide_achievements(request, guide_id, achievement_id):
    guide = get_object_or_404(
        Guide.objects.prefetch_related("achievement"), id=guide_id
    )
    achievements = guide.achievement.all()
    selected_achievement = get_object_or_404(achievements, id=achievement_id)
    quests = selected_achievement.quests.all()
    context = {
        "guide": guide,
        "achievements": achievements,
        "selected_achievement": selected_achievement,
        "quests": quests,
    }
    return render(request, "pages/guide.html", context)
