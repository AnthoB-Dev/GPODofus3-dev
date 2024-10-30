from django.urls import path
from . import views

urlpatterns = [
    path('', views.Menu, name='menu'),
    path('group', views.Group, name='group'),
    path('zone', views.Zone, name='zone'),
    path('character', views.Character, name='character'),
    path('achievement', views.Achievement, name='achievement'),
    path('quest', views.Quest, name='quest'),
]