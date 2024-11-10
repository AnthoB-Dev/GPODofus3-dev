from django.urls import path
from . import views

app_name = "app"  # Namespace de l'application

urlpatterns = [
    # # Vue principale de l'application /app/
    # path("", views.AppView.as_view(), name="guide"),
    # # Vues détaillées des guides /app/guide/<id>/
    # path("guide/<int:pk>", views.AppView.as_view(), name="guide_view"),
    # path("guide/<int:id>/edit", views.AppView.as_view(), name="guide_edit"),
    # # Vues détaillées des quêtes /app/quest/<id>/
    # path("quest/<int:id>", views.AppView.as_view(), name="quest_view"),
    # path("quest/<int:id>/edit", views.AppView.as_view(), name="quest_edit"),
    # # Vues détaillées des succès /app/achievement/<id>/
    # path("achievement/<int:id>", views.AppView.as_view(), name="achievement_view"),
    path("guide/", views.guide_detail, name="guide"),
    path("guide/<int:guide_id>/", views.guide_detail, name="guide_detail"),
    path(
        "guide/<int:guide_id>/achievements/",
        views.guide_achievements_partial,
        name="guide_achievements_partial",
    ),
    path(
        "guide/<int:guide_id>/<int:achievement_id>",
        views.guide_achievements,
        name="guide_achievements",
    ),
    path(
        "guide/<int:guide_id>/objectives/",
        views.guide_objectives_partial,
        name="guide_objectives_partial",
    ),
    path(
        "guide/<int:guide_id>/quests/",
        views.guide_quests_partial,
        name="guide_quests_partial",
    ),
    path(
        "guide/<int:guide_id>/quests/<int:achievement_id>/",
        views.guide_quests_partial,
        name="guide_quests_achievement",
    ),
]
