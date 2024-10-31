from django.urls import path
from . import views

urlpatterns = [
    path('', views.App, name='index'),
    path('groupes', views.Group, name='groups'),
    path('personnages', views.CharacterViewSet.Character, name='characters'),
    path('succes', views.Achievement, name='achievements'),
    path('quetes', views.Quest, name='quests'),
    # path('menu', views.Menu, name='menu'),
    # path('zone', views.Zone, name='zone'),
]