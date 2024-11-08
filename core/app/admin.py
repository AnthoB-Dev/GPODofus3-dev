from django.contrib import admin

from .models import (
    AchievementQuest,
    Alignment,
    GuideAchievement,
    Quest,
    Achievement,
    Guide,
    CommonSpell,
)


class GuideAchievementInline(admin.TabularInline):
    model = GuideAchievement
    extra = 1


class GuideAdmin(admin.ModelAdmin):
    inlines = [GuideAchievementInline]
    list_display = [
        "title",
        "id",
    ]
    search_fields = ("title",)
    inlines = [GuideAchievementInline]


class QuestAchievementInline(admin.TabularInline):
    model = AchievementQuest
    extra = 1


class QuestAdmin(admin.ModelAdmin):
    inlines = [QuestAchievementInline]
    list_display = ["title", "id"]
    search_fields = ("title",)
    inlines = [QuestAchievementInline]


class AchievementQuestInline(admin.TabularInline):
    model = AchievementQuest
    extra = 1


class AchievementAdmin(admin.ModelAdmin):
    list_display = (
        "title",
        "id",
        "completion_points",
        "created_in_version",
        "updated_for_version",
        "updated_at",
    )
    list_filter = ("completion_points", "created_in_version", "updated_at")
    search_fields = ("title",)
    inlines = [AchievementQuestInline]


class AlignmentAdmin(admin.ModelAdmin):
    list_display = ["name", "id"]


admin.site.register(Alignment, AlignmentAdmin)
admin.site.register(Quest, QuestAdmin)
admin.site.register(Achievement, AchievementAdmin)
admin.site.register(Guide, GuideAdmin)
admin.site.register(CommonSpell)
