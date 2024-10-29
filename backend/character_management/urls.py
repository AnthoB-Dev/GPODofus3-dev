from django.urls import path
from . import views

urlpatterns = [
    path('', views.Index, name='index'),
    path('group', views.Group, name='group'),
    path('zone', views.Zone, name='zone'),
    path('character', views.Character, name='character'),
    path('achievement', views.Achievement, name='achievement'),
    path('quest', views.Quest, name='quest'),
]