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
