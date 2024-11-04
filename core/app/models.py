from decimal import Decimal
from django.db import models

game_version = Decimal('2.73')

class Alignment(models.Model):
    name = models.CharField(max_length=100, 
                            verbose_name="Nom")
    
    def __str__(self):
        return self.name
    
    class Meta:
        ordering = ['id']
   
    
class Quest(models.Model):
    title = models.CharField(max_length=100, 
                             verbose_name="Titre")
    url = models.URLField(max_length=255)
    alignment = models.ForeignKey(Alignment, 
                                  on_delete=models.CASCADE, 
                                  related_name="quests", 
                                  null=True, 
                                  verbose_name="Alignement")
    created_at = models.DateTimeField(auto_now_add=True, 
                                      verbose_name="Date de création")
    updated_at = models.DateTimeField(auto_now=True, 
                                      verbose_name="Date de mise à jour")
    created_in_version = models.FloatField(default=game_version, 
                                           verbose_name="Créer en version")
    updated_for_version = models.FloatField(blank=True, 
                                            null=True, 
                                            verbose_name="Mis à jour lors de la version")
    completed = models.BooleanField(default=False, verbose_name="Complété ?")
    
    def __str__(self):
        return self.title


class Achievement(models.Model):
    title = models.CharField(max_length=255, 
                             verbose_name="titre")
    url = models.URLField(max_length=255)
    completion_points = models.IntegerField(verbose_name="Point de succès")
    objectives = models.TextField(max_length=255, 
                                  null=True, 
                                  blank=True, 
                                  verbose_name="Objectifs")
    expect_ressource = models.BooleanField(default=False, 
                                           verbose_name="Demande : Ressource")
    expect_item = models.BooleanField(default=False, 
                                      verbose_name="Demande : Item")
    expect_fight = models.BooleanField(default=False, 
                                       verbose_name="Demande : Combat")
    expect_dungeon = models.BooleanField(default=False, 
                                         verbose_name="Demande : Donjon")
    expect_job = models.BooleanField(default=False, 
                                     verbose_name="Demande : Métier")
    expect_other = models.BooleanField(default=False, 
                                       verbose_name="Demande : Autre")
    expect_alignment = models.BooleanField(default=False, 
                                           verbose_name="Demande : Alignement")
    created_at = models.DateTimeField(auto_now_add=True, 
                                      verbose_name="Date de création")
    updated_at = models.DateTimeField(auto_now=True, 
                                      verbose_name="Date de mise à jour")
    created_in_version = models.FloatField(default=game_version, 
                                           verbose_name="Créer en version")
    updated_for_version = models.FloatField(blank=True, 
                                            null=True, 
                                            verbose_name="Mis à jour lors de la version")
    quests = models.ManyToManyField(Quest, 
                                    through='AchievementQuest', 
                                    related_name="achievements") 
    
    class Meta:
        ordering = ['title']

    def __str__(self):
        return f"{self.title}"


class AchievementQuest(models.Model):
    achievement = models.ForeignKey(Achievement, 
                                    on_delete=models.CASCADE, 
                                    verbose_name="Succès")
    quest = models.ForeignKey(Quest, 
                              on_delete=models.CASCADE, 
                              verbose_name="Quêtes")
    
    class Meta:
        # Définir une clé primaire composite
        unique_together = ('achievement', 'quest')
        db_table = 'achievement_quest'  # Nom de la table de liaison dans la base de données

    def __str__(self):
        return f"{self.achievement.title} - {self.quest.title}"
    
    
class Guide(models.Model):
    title = models.CharField(max_length=255, 
                             verbose_name="Titre")
    objectives = models.CharField(max_length=255, 
                                  verbose_name="Objectifs")
    explanations = models.TextField(null=True, 
                                    blank=True, 
                                    verbose_name="Guide")
    page = models.FloatField()
    recommended_level = models.IntegerField(verbose_name="Niveau recommandé")
    alignment = models.ForeignKey(Alignment, 
                                  on_delete=models.CASCADE, 
                                  related_name="guides", 
                                  null=True, 
                                  blank=True,
                                  verbose_name="Alignement")
    created_at = models.DateTimeField(auto_now_add=True, 
                                      verbose_name="Date de création")
    updated_at = models.DateTimeField(auto_now=True, 
                                      verbose_name="Date de mise à jour")
    created_in_version = models.FloatField(default=game_version, 
                                           verbose_name="Créer en version")
    updated_for_version = models.FloatField(blank=True, 
                                            null=True, 
                                            verbose_name="Mis à jour lors de la version")
    achievement = models.ManyToManyField(Achievement, 
                                         through="GuideAchievement", 
                                         related_name="guides")
    
    def __str__(self):
        return self.title
    

class GuideAchievement(models.Model):
    guide = models.ForeignKey(Guide, 
                              on_delete=models.CASCADE, 
                              verbose_name="Guide")
    achievement = models.ForeignKey(Achievement, 
                                    on_delete=models.CASCADE, 
                                    verbose_name="Succès")
    
    class Meta:
        unique_together = ("guide", "achievement")
        db_table = 'guide_achievement'
        
    def __str__(self):
        return f"{self.guide.title} - {self.achievement.title}"

    
class CommonSpell(models.Model):
    name = models.CharField(max_length=100, 
                            verbose_name="Nom")
    obtainment = models.CharField(max_length=255, 
                                  verbose_name="Obtention")
    url = models.URLField(null=True, 
                          blank=True)
    guide = models.ForeignKey(Guide, 
                              on_delete=models.CASCADE, 
                              related_name="common_spells", 
                              null=True)
    
    def __str__(self):
        return self.name
        
        

