from django.shortcuts import render
from django.http import HttpResponse

# Create your views here.

from rest_framework import viewsets, status, serializers
from rest_framework.response import Response
from .models import Character, Group, Achievement, Quest, Zone
from .serializers import CharacterSerializer, GroupSerializer, AchievementSerializer, QuestSerializer, ZoneSerializer

def Menu(request):
    return render(request, 'menu/index.html')

class CharacterViewSet(viewsets.ModelViewSet):
    queryset = Character.objects.all()
    serializer_class = CharacterSerializer
    
class ZoneViewSet(viewsets.ModelViewSet):
    queryset = Zone.objects.all()
    serializer_class = ZoneSerializer

class GroupViewSet(viewsets.ModelViewSet):
    queryset = Group.objects.all()
    serializer_class = GroupSerializer

class AchievementViewSet(viewsets.ModelViewSet):
    queryset = Achievement.objects.all()
    serializer_class = AchievementSerializer

class QuestViewSet(viewsets.ModelViewSet):
    queryset = Quest.objects.all()
    serializer_class = QuestSerializer

    # Custom endpoint for validating all quests
    def validate_all(self, request, pk=None):
        achievement = self.get_object()
        achievement.quests.update(is_completed=True)
        achievement.is_validated = True
        achievement.save()
        return Response({"status": "all quests validated"}, status=status.HTTP_200_OK)
