from django.db import models

# Create your models here.

class Group(models.Model):
    name = models.CharField(max_length=100)

    def __str__(self):
        return self.name
    
class Zone(models.Model):
    name = models.CharField(max_length=100)

    def __str__(self):
        return self.name

class Character(models.Model):
    name = models.CharField(max_length=100)
    group = models.ForeignKey(Group, on_delete=models.CASCADE, related_name="characters", blank=True, null=True)

    def __str__(self):
        return self.name

class Achievement(models.Model):
    title = models.CharField(max_length=100)
    zone_id = models.ForeignKey(Zone, on_delete=models.CASCADE, related_name="achievements")
    is_validated = models.BooleanField(default=False)

    def __str__(self):
        return self.title

class Quest(models.Model):
    title = models.CharField(max_length=100)
    character = models.ForeignKey(Character, on_delete=models.CASCADE, related_name="quests")
    achievement = models.ForeignKey(Achievement, on_delete=models.CASCADE, related_name="quests")
    is_completed = models.BooleanField(default=False)

    def __str__(self):
        return self.title
