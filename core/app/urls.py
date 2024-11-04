from django.urls import path
from . import views

app_name = "app"  # Namespace de l'application

urlpatterns = [
    # Vue principale de l'application
    path("", views.AppView.as_view(), name="main"),
    # Autres routes pour les actions Turbo
    path("debug/", views.DebugView.as_view(), name="debug_view"),
]
