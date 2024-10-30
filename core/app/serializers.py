from rest_framework import serializers

from .models import Achievement, Character, Group, Quest, Zone

class CharacterSerializer(serializers.ModelSerializer):
    class Meta:
        model = Character
        fields = "__all__"

class ZoneSerializer(serializers.ModelSerializer):
    class Meta:
        model = Zone
        fields = "__all__"

class GroupSerializer(serializers.ModelSerializer):
    class Meta:
        model = Group
        fields = "__all__"

class AchievementSerializer(serializers.ModelSerializer):
    class Meta:
        model = Achievement
        fields = "__all__"

class QuestSerializer(serializers.ModelSerializer):
    class Meta:
        model = Quest
        fields = "__all__"