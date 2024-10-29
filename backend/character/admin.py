from django.contrib import admin

from .models import Character, Group

# Register your models here.
class CharacterAdmin(admin.ModelAdmin):
    list_display = ('name', 'group')
    list_select_related = ("group", )
    
    def get_group_name(self, obj):
        return obj.group.name  # Remplacez "name" par le champ souhaité du modèle Group

class CharacterInline(admin.TabularInline):  # Utilisez `StackedInline` si vous préférez un affichage en blocs
    model = Character
    extra = 1  # Affiche un champ vide pour ajouter un nouveau personnage directement dans l'admin
    fields = ('name', 'group')  # Spécifie les champs de Character que vous souhaitez afficher dans l'inline

class GroupAdmin(admin.ModelAdmin):
    inlines = [CharacterInline]  # Ajout de l'inline dans GroupAdmin pour afficher les personnages associés


admin.site.register(Character, CharacterAdmin)
admin.site.register(Group, GroupAdmin)