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
        guide = Guide.objects.prefetch_related("achievement__quests").first()
        context["guide"] = guide
        context["achievements"] = guide.achievement.all() if guide else []
        # Accéder aux quêtes via les succès associés
        quests = set()
        if guide:
            for achievement in guide.achievement.all():
                for quest in achievement.quests.all():
                    quests.add(quest)
        context["quests"] = quests
        return context

    template_name = "app/main.html"


class DebugView(TemplateView):
    """Vue de debug"""

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        # Ajouter les données pour le template
        context["achievements"] = Achievement.objects.all()
        context["guides"] = Guide.objects.all()
        return context

    template_name = "app/debug.html"
